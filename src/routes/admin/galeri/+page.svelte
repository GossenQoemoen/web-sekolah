<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';

	type Galeri = { id: number; judul: string; foto_url: string; keterangan: string; created_at: string };

	let list = $state<Galeri[]>([]);
	let form = $state({ judul: '', foto_url: '', keterangan: '' });
	let editId = $state<number | null>(null);
	let loading = $state(false);
	let uploading = $state(false);
	let msg = $state('');

	async function load() {
		const { data, error } = await supabase.from('galeri').select('*').order('created_at', { ascending: false });
		if (error) msg = 'Error: ' + error.message;
		list = data ?? [];
	}

	onMount(load);

	async function uploadFoto(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		uploading = true;
		const ext = file.name.split('.').pop();
		const path = `${Date.now()}.${ext}`;
		const { error } = await supabase.storage.from('galeri').upload(path, file);
		if (error) {
			msg = 'Error upload: ' + error.message;
		} else {
			const { data } = supabase.storage.from('galeri').getPublicUrl(path);
			form.foto_url = data.publicUrl;
		}
		uploading = false;
	}

	async function simpan(e: SubmitEvent) {
		e.preventDefault();
		if (!form.foto_url) { msg = 'Upload foto terlebih dahulu.'; return; }
		loading = true;
		if (editId) {
			const { error } = await supabase.from('galeri').update(form).eq('id', editId);
			msg = error ? 'Error: ' + error.message : 'Foto diperbarui.';
		} else {
			const { error } = await supabase.from('galeri').insert(form);
			msg = error ? 'Error: ' + error.message : 'Foto ditambahkan.';
		}
		form = { judul: '', foto_url: '', keterangan: '' };
		editId = null;
		loading = false;
		await load();
		setTimeout(() => msg = '', 3000);
	}

	function edit(g: Galeri) {
		editId = g.id;
		form = { judul: g.judul, foto_url: g.foto_url, keterangan: g.keterangan ?? '' };
	}

	async function hapus(id: number, foto_url: string) {
		if (!confirm('Hapus foto ini?')) return;
		await supabase.from('galeri').delete().eq('id', id);
		// hapus dari storage juga
		const path = foto_url.split('/galeri/')[1];
		if (path) await supabase.storage.from('galeri').remove([path]);
		await load();
	}
</script>

<div class="page-head">
	<h1 class="page-title">Kelola Galeri Foto</h1>
</div>

{#if msg}
	<div class="msg-box {msg.startsWith('Error') ? 'error' : 'success'}">{msg}</div>
{/if}

<div class="card">
	<h2 class="card-title">{editId ? 'Edit Foto' : 'Tambah Foto'}</h2>
	<form onsubmit={simpan} class="form-grid">
		<div class="field">
			<label class="field-label" for="judul">Judul Foto</label>
			<input id="judul" type="text" bind:value={form.judul} required class="cek-input" placeholder="Contoh: Upacara Bendera 2024" />
		</div>
		<div class="field">
			<label class="field-label" for="foto">Upload Foto</label>
			<input id="foto" type="file" accept="image/*" onchange={uploadFoto} class="file-input" />
			{#if uploading}<p class="upload-info">Mengupload...</p>{/if}
			{#if form.foto_url}
				<img src={form.foto_url} alt="preview" class="preview" />
			{/if}
		</div>
		<div class="field">
			<label class="field-label" for="keterangan">Keterangan (opsional)</label>
			<input id="keterangan" type="text" bind:value={form.keterangan} class="cek-input" placeholder="Keterangan singkat..." />
		</div>
		<div class="form-actions">
			<button type="submit" class="btn btn-primary btn-sm" disabled={loading || uploading}>
				{loading ? 'Menyimpan...' : editId ? 'Perbarui' : 'Simpan'}
			</button>
			{#if editId}
				<button type="button" onclick={() => { editId = null; form = { judul: '', foto_url: '', keterangan: '' }; }} class="btn btn-secondary btn-sm">Batal</button>
			{/if}
		</div>
	</form>
</div>

<div class="card">
	<h2 class="card-title">Daftar Foto ({list.length})</h2>
	{#if list.length === 0}
		<p class="empty">Belum ada foto.</p>
	{:else}
		<div class="galeri-grid">
			{#each list as g}
				<div class="galeri-item">
					<img src={g.foto_url} alt={g.judul} class="galeri-img" />
					<div class="galeri-info">
						<p class="galeri-judul">{g.judul}</p>
						{#if g.keterangan}<p class="galeri-ket">{g.keterangan}</p>{/if}
					</div>
					<div class="galeri-actions">
						<button onclick={() => edit(g)} class="btn btn-secondary btn-sm">Edit</button>
						<button onclick={() => hapus(g.id, g.foto_url)} class="btn-hapus">Hapus</button>
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
	.file-input { font-size: 0.88rem; color: var(--muted); }
	.upload-info { margin: 0.25rem 0 0; font-size: 0.82rem; color: var(--orange-600); }
	.preview { margin-top: 0.5rem; width: 100%; max-width: 280px; height: 160px; object-fit: cover; border-radius: 0.75rem; border: 1px solid rgba(15,23,42,0.08); }
	.form-actions { display: flex; gap: 0.75rem; }
	.msg-box { border-radius: 0.75rem; padding: 0.75rem 1rem; font-size: 0.88rem; margin-bottom: 1.25rem; }
	.success { background: rgba(22,163,74,0.08); border: 1px solid rgba(22,163,74,0.25); color: var(--green-700); }
	.error   { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); color: #dc2626; }
	.galeri-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); gap: 1rem; }
	.galeri-item { border-radius: 0.85rem; overflow: hidden; border: 1px solid rgba(15,23,42,0.06); background: #f8fafc; }
	.galeri-img { width: 100%; height: 140px; object-fit: cover; display: block; }
	.galeri-info { padding: 0.75rem 0.85rem 0.5rem; }
	.galeri-judul { margin: 0; font-size: 0.85rem; font-weight: 700; color: var(--ink); }
	.galeri-ket   { margin: 0.2rem 0 0; font-size: 0.75rem; color: var(--muted); }
	.galeri-actions { display: flex; gap: 0.5rem; padding: 0 0.85rem 0.85rem; }
	.btn-hapus { padding: 0.4rem 0.75rem; border-radius: 0.6rem; font-size: 0.8rem; font-weight: 600; color: #dc2626; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); cursor: pointer; }
	.btn-hapus:hover { background: rgba(239,68,68,0.15); }
	.empty { color: var(--muted); font-size: 0.9rem; }
</style>
