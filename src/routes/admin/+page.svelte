<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';

	type Berita = { id: number; judul: string; ringkasan: string; isi: string; foto_url: string; created_at: string };

	let list = $state<Berita[]>([]);
	let form = $state({ judul: '', ringkasan: '', isi: '', foto_url: '' });
	let editId = $state<number | null>(null);
	let uploading = $state(false);
	let loading = $state(false);
	let msg = $state('');

	async function load() {
		const { data, error } = await supabase.from('berita').select('*').order('created_at', { ascending: false });
		if (error) msg = 'Error: ' + error.message;
		list = data ?? [];
	}

	onMount(load);

	async function uploadFoto(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		uploading = true;
		const ext = file.name.split('.').pop();
		const path = `berita/${Date.now()}.${ext}`;
		const { error } = await supabase.storage.from('galeri').upload(path, file);
		if (error) {
			msg = 'Error upload: ' + error.message;
		} else {
			const { data } = supabase.storage.from('galeri').getPublicUrl(path);
			form.foto_url = data.publicUrl;
		}
		uploading = false;
	}

	function hapusFotoForm() {
		form.foto_url = '';
	}

	async function simpan(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		if (editId) {
			const { error } = await supabase.from('berita').update(form).eq('id', editId);
			msg = error ? 'Error: ' + error.message : 'Berita diperbarui.';
		} else {
			const { error } = await supabase.from('berita').insert(form);
			msg = error ? 'Error: ' + error.message : 'Berita ditambahkan.';
		}
		form = { judul: '', ringkasan: '', isi: '', foto_url: '' };
		editId = null;
		loading = false;
		await load();
		setTimeout(() => msg = '', 3000);
	}

	function edit(b: Berita) {
		editId = b.id;
		form = { judul: b.judul, ringkasan: b.ringkasan, isi: b.isi ?? '', foto_url: b.foto_url ?? '' };
	}

	async function hapus(id: number) {
		if (!confirm('Hapus berita ini?')) return;
		await supabase.from('berita').delete().eq('id', id);
		await load();
	}
</script>

<div class="page-head">
	<h1 class="page-title">Kelola Berita</h1>
</div>

{#if msg}
	<div class="msg-box {msg.startsWith('Error') ? 'error' : 'success'}">{msg}</div>
{/if}

<div class="card">
	<h2 class="card-title">{editId ? 'Edit Berita' : 'Tambah Berita'}</h2>
	<form onsubmit={simpan} class="form-grid">
		<div class="field">
			<label class="field-label" for="judul">Judul</label>
			<input id="judul" type="text" bind:value={form.judul} required class="cek-input" placeholder="Judul berita..." />
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
					<button type="button" onclick={hapusFotoForm} class="btn-hapus-foto">✕ Hapus Foto</button>
				</div>
			{/if}
		</div>
		<div class="field">
			<label class="field-label" for="isi">Isi Berita</label>
			<textarea id="isi" rows="8" bind:value={form.isi} required class="cek-input"></textarea>
		</div>
		<div class="form-actions">
			<button type="submit" class="btn btn-primary btn-sm" disabled={loading || uploading}>
				{loading ? 'Menyimpan...' : editId ? 'Perbarui' : 'Simpan'}
			</button>
			{#if editId}
				<button type="button" onclick={() => { editId = null; form = { judul: '', ringkasan: '', isi: '', foto_url: '' }; }} class="btn btn-secondary btn-sm">Batal</button>
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
						<p class="berita-meta">{new Date(b.created_at).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}</p>
					</div>
					<div class="berita-actions">
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
	.card { background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 8px -2px rgba(15,23,42,0.08); margin-bottom: 1.5rem; }
	.card-title { margin: 0 0 1.25rem; font-size: 1rem; font-weight: 800; color: var(--green-900); }
	.form-grid { display: flex; flex-direction: column; gap: 1rem; }
	.field { display: grid; gap: 0.4rem; }
	.field-label { font-size: 0.85rem; font-weight: 700; color: var(--green-900); }
	.opsional { font-weight: 400; color: var(--muted); font-size: 0.78rem; }
	.file-input { font-size: 0.88rem; color: var(--muted); }
	.upload-info { margin: 0.25rem 0 0; font-size: 0.82rem; color: var(--orange-600); }
	.preview-wrap { display: flex; align-items: flex-start; gap: 0.75rem; margin-top: 0.5rem; }
	.preview { width: 160px; height: 100px; object-fit: cover; border-radius: 0.65rem; border: 1px solid rgba(15,23,42,0.08); }
	.btn-hapus-foto { padding: 0.35rem 0.75rem; border-radius: 0.6rem; font-size: 0.78rem; font-weight: 600; color: #dc2626; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); cursor: pointer; }
	textarea { resize: vertical; }
	.form-actions { display: flex; gap: 0.75rem; }
	.msg-box { border-radius: 0.75rem; padding: 0.75rem 1rem; font-size: 0.88rem; margin-bottom: 1.25rem; }
	.success { background: rgba(22,163,74,0.08); border: 1px solid rgba(22,163,74,0.25); color: var(--green-700); }
	.error   { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); color: #dc2626; }
	.berita-list { display: flex; flex-direction: column; gap: 0.5rem; }
	.berita-row { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem; background: #f8fafc; border-radius: 0.75rem; border: 1px solid rgba(15,23,42,0.06); }
	.berita-thumb { width: 60px; height: 44px; object-fit: cover; border-radius: 0.5rem; flex-shrink: 0; }
	.berita-thumb-placeholder { width: 60px; height: 44px; border-radius: 0.5rem; background: rgba(249,115,22,0.08); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
	.berita-info { flex: 1; min-width: 0; }
	.berita-judul { margin: 0; font-size: 0.9rem; font-weight: 700; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
	.berita-meta  { margin: 0.2rem 0 0; font-size: 0.75rem; color: var(--muted); }
	.berita-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
	.btn-hapus { padding: 0.45rem 0.85rem; border-radius: 0.6rem; font-size: 0.82rem; font-weight: 600; color: #dc2626; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); cursor: pointer; }
	.btn-hapus:hover { background: rgba(239,68,68,0.15); }
	.empty { color: var(--muted); font-size: 0.9rem; }
</style>
