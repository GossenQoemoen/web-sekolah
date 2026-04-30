<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';

	const MAX_FOTO = 5;

	type Album = { id: number; judul: string; keterangan: string; status: string; unit: string; created_at: string; galeri: { id: number; judul: string; foto_url: string }[] };
	type Preview = { file: File; url: string; judul: string; uploading: boolean; done: boolean; error: string };

	let profile = $state<{ role: string; unit: string } | null>(null);
	let albums = $state<Album[]>([]);
	let albumForm = $state({ judul: '', keterangan: '', unit: '' });
	let editAlbumId = $state<number | null>(null);
	let selectedAlbum = $state<Album | null>(null);
	let previews = $state<Preview[]>([]);
	let loading = $state(false);
	let msg = $state('');

	const canPublish = $derived(profile?.role === 'admin_berita' || profile?.role === 'superadmin');

	async function load() {
		if (!profile) return;
		let q = supabase.from('album').select('id, judul, keterangan, status, unit, created_at, galeri(id, judul, foto_url)').order('created_at', { ascending: false });
		if (profile.role === 'kontributor') {
			const { data: { session } } = await supabase.auth.getSession();
			q = q.eq('author_id', session!.user.id);
		}
		const { data, error } = await q;
		if (error) msg = 'Error: ' + error.message;
		albums = (data ?? []) as Album[];
		if (selectedAlbum) selectedAlbum = albums.find(a => a.id === selectedAlbum!.id) ?? null;
	}

	onMount(async () => {
		const { data: { session } } = await supabase.auth.getSession();
		if (!session) return;
		const { data } = await supabase.from('profiles').select('role, unit').eq('id', session.user.id).single();
		profile = data;
		albumForm.unit = data?.unit ?? '';
		await load();
	});

	async function simpanAlbum(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		const { data: { session } } = await supabase.auth.getSession();
		if (editAlbumId) {
			const { error } = await supabase.from('album').update(albumForm).eq('id', editAlbumId);
			msg = error ? 'Error: ' + error.message : 'Album diperbarui.';
			editAlbumId = null;
		} else {
			const { error } = await supabase.from('album').insert({ ...albumForm, status: 'draft', author_id: session!.user.id });
			msg = error ? 'Error: ' + error.message : 'Album disimpan sebagai draft.';
		}
		albumForm = { judul: '', keterangan: '', unit: profile?.unit ?? '' };
		loading = false;
		await load();
		setTimeout(() => msg = '', 3000);
	}

	function editAlbum(a: Album) {
		editAlbumId = a.id;
		albumForm = { judul: a.judul, keterangan: a.keterangan ?? '', unit: a.unit ?? '' };
	}

	async function hapusAlbum(id: number) {
		if (!confirm('Hapus album beserta semua fotonya?')) return;
		await supabase.from('album').delete().eq('id', id);
		if (selectedAlbum?.id === id) selectedAlbum = null;
		await load();
	}

	async function publish(id: number) {
		await supabase.from('album').update({ status: 'published' }).eq('id', id);
		await load();
	}

	async function unpublish(id: number) {
		await supabase.from('album').update({ status: 'draft' }).eq('id', id);
		await load();
	}

	function pilihFoto(e: Event) {
		if (!selectedAlbum) return;
		const sudahAda = selectedAlbum.galeri?.length ?? 0;
		const sisa = MAX_FOTO - sudahAda;
		if (sisa <= 0) { msg = `Album sudah penuh (maks. ${MAX_FOTO} foto).`; return; }
		const files = Array.from((e.target as HTMLInputElement).files ?? []).slice(0, sisa);
		msg = '';
		previews = files.map(file => ({
			file, url: URL.createObjectURL(file),
			judul: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
			uploading: false, done: false, error: ''
		}));
	}

	async function uploadFoto() {
		if (!selectedAlbum || previews.length === 0) return;
		loading = true;
		let berhasil = 0;
		for (let i = 0; i < previews.length; i++) {
			previews[i].uploading = true;
			const ext = previews[i].file.name.split('.').pop();
			const path = `${Date.now()}-${i}.${ext}`;
			const { error: upErr } = await supabase.storage.from('galeri').upload(path, previews[i].file);
			if (upErr) { previews[i].error = upErr.message; previews[i].uploading = false; continue; }
			const { data } = supabase.storage.from('galeri').getPublicUrl(path);
			const { error: dbErr } = await supabase.from('galeri').insert({ judul: previews[i].judul || 'Foto', foto_url: data.publicUrl, album_id: selectedAlbum.id });
			if (dbErr) { previews[i].error = dbErr.message; }
			else { previews[i].done = true; berhasil++; }
			previews[i].uploading = false;
		}
		loading = false;
		msg = `${berhasil} foto berhasil diupload.`;
		await load();
		setTimeout(() => { previews = []; msg = ''; }, 2000);
	}

	async function hapusFoto(id: number, foto_url: string) {
		if (!confirm('Hapus foto ini?')) return;
		await supabase.from('galeri').delete().eq('id', id);
		const path = foto_url.split('/galeri/')[1];
		if (path) await supabase.storage.from('galeri').remove([path]);
		await load();
	}
</script>

<div class="page-head">
	<h1 class="page-title">Kelola Galeri</h1>
	{#if !canPublish}
		<p class="page-sub">Album yang kamu buat akan menjadi draft dan menunggu persetujuan admin.</p>
	{/if}
</div>

{#if msg}
	<div class="msg-box {msg.startsWith('Error') ? 'error' : 'success'}">{msg}</div>
{/if}

<div class="card">
	<h2 class="card-title">{editAlbumId ? 'Edit Album' : 'Buat Album Baru'}</h2>
	<form onsubmit={simpanAlbum} class="form-row">
		<div class="field" style="flex:2">
			<label class="field-label" for="judul-album">Judul Album</label>
			<input id="judul-album" type="text" bind:value={albumForm.judul} required class="cek-input" placeholder="Contoh: Upacara HUT RI 2024" />
		</div>
		<div class="field" style="flex:2">
			<label class="field-label" for="ket-album">Keterangan (opsional)</label>
			<input id="ket-album" type="text" bind:value={albumForm.keterangan} class="cek-input" placeholder="Keterangan singkat..." />
		</div>
		<div class="field" style="flex:1">
			<label class="field-label" for="unit-album">Unit</label>
			<input id="unit-album" type="text" bind:value={albumForm.unit} class="cek-input" placeholder="Unit..." readonly={profile?.role === 'kontributor'} />
		</div>
		<div class="field field-btn">
			<div class="form-actions">
				<button type="submit" class="btn btn-primary btn-sm" disabled={loading}>
					{editAlbumId ? 'Perbarui' : 'Buat Album'}
				</button>
				{#if editAlbumId}
					<button type="button" onclick={() => { editAlbumId = null; albumForm = { judul: '', keterangan: '', unit: profile?.unit ?? '' }; }} class="btn btn-secondary btn-sm">Batal</button>
				{/if}
			</div>
		</div>
	</form>
</div>

<div class="card">
	<h2 class="card-title">Daftar Album ({albums.length})</h2>
	{#if albums.length === 0}
		<p class="empty">Belum ada album.</p>
	{:else}
		<div class="album-list">
			{#each albums as a}
				<div class="album-row {selectedAlbum?.id === a.id ? 'selected' : ''}">
					<div class="album-info" onclick={() => selectedAlbum = selectedAlbum?.id === a.id ? null : a} role="button" tabindex="0">
						<p class="album-judul">{a.judul}</p>
						<div class="album-meta">
							<span class="status-badge status-{a.status}">{a.status === 'published' ? '✓ Published' : '⏳ Draft'}</span>
							{#if a.unit}<span class="unit-tag">{a.unit}</span>{/if}
							<span>{a.galeri?.length ?? 0}/{MAX_FOTO} foto</span>
							{#if (a.galeri?.length ?? 0) >= MAX_FOTO}<span class="badge-penuh">Penuh</span>{/if}
						</div>
					</div>
					<div class="album-actions">
						{#if canPublish}
							{#if a.status === 'draft'}
								<button onclick={() => publish(a.id)} class="btn-publish">✓ Publish</button>
							{:else}
								<button onclick={() => unpublish(a.id)} class="btn-unpublish">↩ Draft</button>
							{/if}
						{/if}
						<button onclick={() => editAlbum(a)} class="btn btn-secondary btn-sm">Edit</button>
						<button onclick={() => hapusAlbum(a.id)} class="btn-hapus">Hapus</button>
					</div>
				</div>

				{#if selectedAlbum?.id === a.id}
					<div class="foto-panel">
						<div class="foto-panel-head">
							<p class="foto-panel-title">Foto dalam "{a.judul}" ({a.galeri?.length ?? 0}/{MAX_FOTO})</p>
							{#if (a.galeri?.length ?? 0) < MAX_FOTO}
								<div class="upload-area">
									<input type="file" accept="image/*" multiple id="upload-{a.id}" onchange={pilihFoto} class="file-input" />
									<label for="upload-{a.id}" class="btn btn-secondary btn-sm" style="cursor:pointer">
										+ Tambah Foto (sisa {MAX_FOTO - (a.galeri?.length ?? 0)})
									</label>
								</div>
							{/if}
						</div>

						{#if previews.length > 0}
							<div class="preview-grid">
								{#each previews as p}
									<div class="preview-item {p.done ? 'done' : ''} {p.error ? 'has-error' : ''}">
										<img src={p.url} alt={p.judul} class="preview-img" />
										{#if p.uploading}<div class="preview-overlay">Mengupload...</div>
										{:else if p.done}<div class="preview-overlay done-overlay">✓</div>{/if}
										{#if !p.uploading && !p.done}
											<input type="text" bind:value={p.judul} class="cek-input preview-input" placeholder="Judul foto" />
										{/if}
										{#if p.error}<p class="preview-error">{p.error}</p>{/if}
									</div>
								{/each}
							</div>
							<button type="button" class="btn btn-primary btn-sm" onclick={uploadFoto} disabled={loading} style="margin-top:0.75rem">
								{loading ? 'Mengupload...' : `Upload ${previews.length} Foto`}
							</button>
						{/if}

						{#if a.galeri?.length > 0}
							<div class="foto-grid">
								{#each a.galeri as f}
									<div class="foto-item">
										<img src={f.foto_url} alt={f.judul} class="foto-img" />
										<div class="foto-info"><p class="foto-judul">{f.judul}</p></div>
										<button onclick={() => hapusFoto(f.id, f.foto_url)} class="btn-hapus-foto">✕ Hapus</button>
									</div>
								{/each}
							</div>
						{:else}
							<p class="empty" style="margin-top:0.75rem">Belum ada foto.</p>
						{/if}
					</div>
				{/if}
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
	.form-row { display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap; }
	.field { display: grid; gap: 0.4rem; }
	.field-btn { flex-shrink: 0; }
	.field-label { font-size: 0.85rem; font-weight: 700; color: var(--green-900); }
	.form-actions { display: flex; gap: 0.5rem; }
	.album-list { display: flex; flex-direction: column; gap: 0.5rem; }
	.album-row { border-radius: 0.75rem; border: 1px solid rgba(15,23,42,0.06); overflow: hidden; }
	.album-row.selected { border-color: var(--orange-500); }
	.album-info { display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; background: #f8fafc; cursor: pointer; gap: 1rem; }
	.album-row.selected .album-info { background: rgba(249,115,22,0.05); }
	.album-judul { margin: 0 0 0.3rem; font-size: 0.9rem; font-weight: 700; color: var(--ink); }
	.album-meta { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; font-size: 0.75rem; color: var(--muted); }
	.status-badge { font-size: 0.72rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 999px; }
	.status-published { background: rgba(22,163,74,0.1); color: var(--green-700); border: 1px solid rgba(22,163,74,0.25); }
	.status-draft { background: rgba(234,88,12,0.08); color: var(--orange-600); border: 1px solid rgba(234,88,12,0.2); }
	.unit-tag { font-size: 0.72rem; font-weight: 600; color: #6366f1; background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.2); padding: 0.2rem 0.55rem; border-radius: 999px; }
	.badge-penuh { background: rgba(239,68,68,0.1); color: #dc2626; font-size: 0.7rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 999px; border: 1px solid rgba(239,68,68,0.2); }
	.album-actions { display: flex; gap: 0.5rem; padding: 0.6rem 1rem; background: white; border-top: 1px solid rgba(15,23,42,0.06); flex-wrap: wrap; }
	.btn-publish { padding: 0.45rem 0.85rem; border-radius: 0.6rem; font-size: 0.82rem; font-weight: 600; color: var(--green-700); background: rgba(22,163,74,0.08); border: 1px solid rgba(22,163,74,0.2); cursor: pointer; }
	.btn-publish:hover { background: rgba(22,163,74,0.15); }
	.btn-unpublish { padding: 0.45rem 0.85rem; border-radius: 0.6rem; font-size: 0.82rem; font-weight: 600; color: #6366f1; background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.2); cursor: pointer; }
	.foto-panel { padding: 1rem; border-top: 1px solid rgba(249,115,22,0.15); background: rgba(249,115,22,0.02); }
	.foto-panel-head { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem; }
	.foto-panel-title { margin: 0; font-size: 0.85rem; font-weight: 700; color: var(--green-900); }
	.file-input { display: none; }
	.preview-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px,1fr)); gap: 0.75rem; }
	.preview-item { border-radius: 0.65rem; overflow: hidden; border: 1px solid rgba(15,23,42,0.08); background: white; position: relative; }
	.preview-item.done { border-color: rgba(22,163,74,0.3); }
	.preview-item.has-error { border-color: rgba(239,68,68,0.3); }
	.preview-img { width: 100%; height: 90px; object-fit: cover; display: block; }
	.preview-overlay { position: absolute; inset: 0 0 auto 0; height: 90px; background: rgba(15,23,42,0.55); color: white; font-size: 0.78rem; font-weight: 700; display: flex; align-items: center; justify-content: center; }
	.done-overlay { background: rgba(22,163,74,0.7); }
	.preview-input { border-radius: 0; border: none; border-top: 1px solid rgba(15,23,42,0.06); font-size: 0.75rem; padding: 0.35rem 0.5rem; }
	.preview-error { margin: 0; padding: 0.35rem 0.5rem; font-size: 0.72rem; color: #dc2626; }
	.foto-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px,1fr)); gap: 0.75rem; margin-top: 1rem; }
	.foto-item { border-radius: 0.65rem; overflow: hidden; border: 1px solid rgba(15,23,42,0.06); background: white; }
	.foto-img { width: 100%; height: 90px; object-fit: cover; display: block; }
	.foto-info { padding: 0.35rem 0.5rem; }
	.foto-judul { margin: 0; font-size: 0.75rem; font-weight: 600; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
	.btn-hapus-foto { width: 100%; padding: 0.3rem; font-size: 0.72rem; font-weight: 600; color: #dc2626; background: rgba(239,68,68,0.06); border: none; border-top: 1px solid rgba(239,68,68,0.1); cursor: pointer; }
	.btn-hapus-foto:hover { background: rgba(239,68,68,0.12); }
	.msg-box { border-radius: 0.75rem; padding: 0.75rem 1rem; font-size: 0.88rem; margin-bottom: 1.25rem; }
	.success { background: rgba(22,163,74,0.08); border: 1px solid rgba(22,163,74,0.25); color: var(--green-700); }
	.error { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); color: #dc2626; }
	.btn-hapus { padding: 0.45rem 0.85rem; border-radius: 0.6rem; font-size: 0.82rem; font-weight: 600; color: #dc2626; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); cursor: pointer; }
	.btn-hapus:hover { background: rgba(239,68,68,0.15); }
	.empty { color: var(--muted); font-size: 0.9rem; margin: 0; }
</style>
