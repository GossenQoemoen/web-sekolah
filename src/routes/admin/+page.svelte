<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';
	import type { Profile } from '$lib/auth';

	type Berita = { id: number; judul: string; ringkasan: string; isi: string; foto_url: string; status: string; unit: string; created_at: string };

	let profile = $state<Profile | null>(null);
	let list = $state<Berita[]>([]);
	let form = $state({ judul: '', ringkasan: '', isi: '', foto_url: '', unit: '' });
	let editId = $state<number | null>(null);
	let uploading = $state(false);
	let loading = $state(false);
	let msg = $state('');

	async function load() {
		if (!profile) return;
		let q = supabase.from('berita').select('*').order('created_at', { ascending: false });
		// kontributor hanya lihat milik sendiri
		if (profile.role === 'kontributor') {
			const { data: { session } } = await supabase.auth.getSession();
			q = q.eq('author_id', session!.user.id);
		}
		const { data, error } = await q;
		if (error) msg = 'Error: ' + error.message;
		list = data ?? [];
	}

	onMount(async () => {
		const { data: { session } } = await supabase.auth.getSession();
		if (!session) return;
		const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
		profile = data;
		form.unit = data?.unit ?? '';
		await load();
	});

	async function uploadFoto(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		uploading = true;
		const ext = file.name.split('.').pop();
		const path = `berita/${Date.now()}.${ext}`;
		const { error } = await supabase.storage.from('galeri').upload(path, file);
		if (error) { msg = 'Error upload: ' + error.message; uploading = false; return; }
		const { data } = supabase.storage.from('galeri').getPublicUrl(path);
		form.foto_url = data.publicUrl;
		uploading = false;
	}

	async function simpan(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		const { data: { session } } = await supabase.auth.getSession();
		const payload = { ...form, status: 'draft', author_id: session!.user.id };

		if (editId) {
			const { error } = await supabase.from('berita').update(form).eq('id', editId);
			msg = error ? 'Error: ' + error.message : 'Berita diperbarui.';
		} else {
			const { error } = await supabase.from('berita').insert(payload);
			msg = error ? 'Error: ' + error.message : 'Berita disimpan sebagai draft.';
		}
		form = { judul: '', ringkasan: '', isi: '', foto_url: '', unit: profile?.unit ?? '' };
		editId = null;
		loading = false;
		await load();
		setTimeout(() => msg = '', 3000);
	}

	async function publish(id: number) {
		await supabase.from('berita').update({ status: 'published' }).eq('id', id);
		await load();
	}

	async function unpublish(id: number) {
		await supabase.from('berita').update({ status: 'draft' }).eq('id', id);
		await load();
	}

	function edit(b: Berita) {
		editId = b.id;
		form = { judul: b.judul, ringkasan: b.ringkasan, isi: b.isi ?? '', foto_url: b.foto_url ?? '', unit: b.unit ?? '' };
	}

	async function hapus(id: number) {
		if (!confirm('Hapus berita ini?')) return;
		await supabase.from('berita').delete().eq('id', id);
		await load();
	}

	const canPublish = $derived(profile?.role === 'admin_berita' || profile?.role === 'superadmin');
</script>

<div class="page-head">
	<h1 class="page-title">
		{canPublish ? 'Kelola Berita' : 'Berita Saya'}
	</h1>
	{#if !canPublish}
		<p class="page-sub">Berita yang kamu kirim akan menjadi draft dan menunggu persetujuan admin.</p>
	{/if}
</div>

{#if msg}
	<div class="msg-box {msg.startsWith('Error') ? 'error' : 'success'}">{msg}</div>
{/if}

<div class="card">
	<h2 class="card-title">{editId ? 'Edit Berita' : 'Tulis Berita'}</h2>
	<form onsubmit={simpan} class="form-grid">
		<div class="fields-row">
			<div class="field" style="flex:3">
				<label class="field-label" for="judul">Judul</label>
				<input id="judul" type="text" bind:value={form.judul} required class="cek-input" placeholder="Judul berita..." />
			</div>
			<div class="field" style="flex:1">
				<label class="field-label" for="unit">Unit/Sektor</label>
				<input id="unit" type="text" bind:value={form.unit} class="cek-input" placeholder="Contoh: TKJ" readonly={profile?.role === 'kontributor'} />
			</div>
		</div>
		<div class="field">
			<label class="field-label" for="ringkasan">Ringkasan</label>
			<input id="ringkasan" type="text" bind:value={form.ringkasan} required class="cek-input" placeholder="Ringkasan singkat..." />
		</div>
		<div class="field">
			<label class="field-label" for="foto">Foto Thumbnail <span class="opsional">(opsional)</span></label>
			<input id="foto" type="file" accept="image/*" onchange={uploadFoto} class="file-input" disabled={uploading} />
			{#if uploading}<p class="upload-info">Mengupload...</p>{/if}
			{#if form.foto_url}
				<div class="preview-wrap">
					<img src={form.foto_url} alt="preview" class="preview" />
					<button type="button" onclick={() => form.foto_url = ''} class="btn-hapus-foto">✕ Hapus</button>
				</div>
			{/if}
		</div>
		<div class="field">
			<label class="field-label" for="isi">Isi Berita</label>
			<textarea id="isi" rows="8" bind:value={form.isi} required class="cek-input"></textarea>
		</div>
		<div class="form-actions">
			<button type="submit" class="btn btn-primary btn-sm" disabled={loading || uploading}>
				{loading ? 'Menyimpan...' : editId ? 'Perbarui' : 'Kirim sebagai Draft'}
			</button>
			{#if editId}
				<button type="button" onclick={() => { editId = null; form = { judul: '', ringkasan: '', isi: '', foto_url: '', unit: profile?.unit ?? '' }; }} class="btn btn-secondary btn-sm">Batal</button>
			{/if}
		</div>
	</form>
</div>

<div class="card">
	<h2 class="card-title">Daftar Berita ({list.length})</h2>
	{#if list.length === 0}
		<p class="empty">Belum ada berita.</p>
	{:else}
		<div class="berita-list">
			{#each list as b}
				<div class="berita-row">
					{#if b.foto_url}
						<img src={b.foto_url} alt={b.judul} class="berita-thumb" />
					{:else}
						<div class="berita-thumb-placeholder">📰</div>
					{/if}
					<div class="berita-info">
						<p class="berita-judul">{b.judul}</p>
						<div class="berita-meta-row">
							<span class="status-badge status-{b.status}">{b.status === 'published' ? '✓ Published' : '⏳ Draft'}</span>
							{#if b.unit}<span class="unit-tag">{b.unit}</span>{/if}
							<span class="berita-tgl">{new Date(b.created_at).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}</span>
						</div>
					</div>
					<div class="berita-actions">
						{#if canPublish}
							{#if b.status === 'draft'}
								<button onclick={() => publish(b.id)} class="btn-publish">✓ Publish</button>
							{:else}
								<button onclick={() => unpublish(b.id)} class="btn-unpublish">↩ Draft</button>
							{/if}
						{/if}
						<button onclick={() => edit(b)} class="btn btn-secondary btn-sm">Edit</button>
						<button onclick={() => hapus(b.id)} class="btn-hapus">Hapus</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.page-head { margin-bottom: 1.5rem; }
	.page-title { margin: 0; font-size: 1.5rem; font-weight: 800; color: var(--ink); }
	.page-sub { margin: 0.35rem 0 0; font-size: 0.85rem; color: var(--muted); }
	.card { background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 8px -2px rgba(15,23,42,0.08); margin-bottom: 1.5rem; }
	.card-title { margin: 0 0 1.25rem; font-size: 1rem; font-weight: 800; color: var(--green-900); }
	.form-grid { display: flex; flex-direction: column; gap: 1rem; }
	.fields-row { display: flex; gap: 1rem; flex-wrap: wrap; }
	.field { display: grid; gap: 0.4rem; }
	.field-label { font-size: 0.85rem; font-weight: 700; color: var(--green-900); }
	.opsional { font-weight: 400; color: var(--muted); font-size: 0.78rem; }
	.file-input { font-size: 0.88rem; color: var(--muted); }
	.upload-info { margin: 0.25rem 0 0; font-size: 0.82rem; color: var(--orange-600); }
	.preview-wrap { display: flex; align-items: flex-start; gap: 0.75rem; margin-top: 0.5rem; }
	.preview { width: 120px; height: 80px; object-fit: cover; border-radius: 0.65rem; border: 1px solid rgba(15,23,42,0.08); }
	.btn-hapus-foto { padding: 0.35rem 0.75rem; border-radius: 0.6rem; font-size: 0.78rem; font-weight: 600; color: #dc2626; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); cursor: pointer; }
	textarea { resize: vertical; }
	.form-actions { display: flex; gap: 0.75rem; }
	.msg-box { border-radius: 0.75rem; padding: 0.75rem 1rem; font-size: 0.88rem; margin-bottom: 1.25rem; }
	.success { background: rgba(22,163,74,0.08); border: 1px solid rgba(22,163,74,0.25); color: var(--green-700); }
	.error   { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); color: #dc2626; }
	.berita-list { display: flex; flex-direction: column; gap: 0.5rem; }
	.berita-row { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem; background: #f8fafc; border-radius: 0.75rem; border: 1px solid rgba(15,23,42,0.06); }
	.berita-thumb { width: 80px; height: 80px; object-fit: cover; border-radius: 0.65rem; flex-shrink: 0; margin: 10px; }
	.berita-thumb-placeholder { width: 60px; height: 44px; border-radius: 0.5rem; background: rgba(249,115,22,0.08); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
	.berita-info { flex: 1; min-width: 0; }
	.berita-judul { margin: 0 0 0.35rem; font-size: 0.9rem; font-weight: 700; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
	.berita-meta-row { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
	.status-badge { font-size: 0.72rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 999px; }
	.status-published { background: rgba(22,163,74,0.1); color: var(--green-700); border: 1px solid rgba(22,163,74,0.25); }
	.status-draft { background: rgba(234,88,12,0.08); color: var(--orange-600); border: 1px solid rgba(234,88,12,0.2); }
	.unit-tag { font-size: 0.72rem; font-weight: 600; color: #6366f1; background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.2); padding: 0.2rem 0.55rem; border-radius: 999px; }
	.berita-tgl { font-size: 0.72rem; color: var(--muted); }
	.berita-actions { display: flex; gap: 0.5rem; flex-shrink: 0; flex-wrap: wrap; }
	.btn-publish { padding: 0.45rem 0.85rem; border-radius: 0.6rem; font-size: 0.82rem; font-weight: 600; color: var(--green-700); background: rgba(22,163,74,0.08); border: 1px solid rgba(22,163,74,0.2); cursor: pointer; }
	.btn-publish:hover { background: rgba(22,163,74,0.15); }
	.btn-unpublish { padding: 0.45rem 0.85rem; border-radius: 0.6rem; font-size: 0.82rem; font-weight: 600; color: #6366f1; background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.2); cursor: pointer; }
	.btn-hapus { padding: 0.45rem 0.85rem; border-radius: 0.6rem; font-size: 0.82rem; font-weight: 600; color: #dc2626; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); cursor: pointer; }
	.btn-hapus:hover { background: rgba(239,68,68,0.15); }
	.empty { color: var(--muted); font-size: 0.9rem; }
</style>
