<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';

	type Guru = { id: number; nama: string; nip: string; jabatan: string; mapel: string; foto_url: string };

	let list = $state<Guru[]>([]);
	let form = $state({ nama: '', nip: '', jabatan: '', mapel: '', foto_url: '' });
	let editId = $state<number | null>(null);
	let loading = $state(false);
	let msg = $state('');

	async function load() {
		const { data, error } = await supabase.from('guru').select('*').order('nama');
		if (error) msg = 'Error: ' + error.message;
		list = data ?? [];
	}

	onMount(load);

	async function simpan(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		if (editId) {
			const { error } = await supabase.from('guru').update(form).eq('id', editId);
			msg = error ? 'Error: ' + error.message : 'Data guru diperbarui.';
		} else {
			const { error } = await supabase.from('guru').insert(form);
			msg = error ? 'Error: ' + error.message : 'Guru ditambahkan.';
		}
		form = { nama: '', nip: '', jabatan: '', mapel: '', foto_url: '' };
		editId = null;
		loading = false;
		await load();
		setTimeout(() => msg = '', 3000);
	}

	function edit(g: Guru) {
		editId = g.id;
		form = { nama: g.nama, nip: g.nip ?? '', jabatan: g.jabatan ?? '', mapel: g.mapel ?? '', foto_url: g.foto_url ?? '' };
	}

	async function hapus(id: number) {
		if (!confirm('Hapus guru ini?')) return;
		await supabase.from('guru').delete().eq('id', id);
		await load();
	}

	function batal() {
		editId = null;
		form = { nama: '', nip: '', jabatan: '', mapel: '', foto_url: '' };
	}
</script>

<div class="page-head">
	<h1 class="page-title">Kelola Guru & Staf</h1>
</div>

{#if msg}
	<div class="msg-box {msg.startsWith('Error') ? 'error' : 'success'}">{msg}</div>
{/if}

<div class="card">
	<h2 class="card-title">{editId ? 'Edit Guru' : 'Tambah Guru'}</h2>
	<form onsubmit={simpan} class="form-grid">
		<div class="fields-row">
			{#each [['nama','Nama Lengkap','text',true],['nip','NIP','text',false],['jabatan','Jabatan','text',false],['mapel','Mata Pelajaran','text',false]] as [key, label, type, req]}
				<div class="field">
					<label class="field-label" for={key}>{label}</label>
					<input id={key} {type} bind:value={form[key as keyof typeof form]} required={req} class="cek-input" placeholder={label} />
				</div>
			{/each}
		</div>
		<div class="field">
			<label class="field-label" for="foto_url">URL Foto (opsional)</label>
			<input id="foto_url" type="url" bind:value={form.foto_url} class="cek-input" placeholder="https://..." />
		</div>
		<div class="form-actions">
			<button type="submit" class="btn btn-primary btn-sm" disabled={loading}>
				{loading ? 'Menyimpan...' : editId ? 'Perbarui' : 'Simpan'}
			</button>
			{#if editId}
				<button type="button" onclick={batal} class="btn btn-secondary btn-sm">Batal</button>
			{/if}
		</div>
	</form>
</div>

<div class="card">
	<h2 class="card-title">Daftar Guru ({list.length})</h2>
	{#if list.length === 0}
		<p class="empty">Belum ada data guru.</p>
	{:else}
		<div class="guru-list">
			{#each list as g}
				<div class="guru-row">
					<div class="guru-avatar">
						{#if g.foto_url}
							<img src={g.foto_url} alt={g.nama} class="guru-foto" />
						{:else}
							<span>{g.nama[0]}</span>
						{/if}
					</div>
					<div class="guru-info">
						<p class="guru-nama">{g.nama}</p>
						<p class="guru-meta">{g.jabatan || '-'} {g.mapel ? '· ' + g.mapel : ''}</p>
					</div>
					<div class="actions">
						<button onclick={() => edit(g)} class="btn btn-secondary btn-sm">Edit</button>
						<button onclick={() => hapus(g.id)} class="btn-hapus">Hapus</button>
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
	.fields-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px,1fr)); gap: 1rem; }
	.field { display: grid; gap: 0.4rem; }
	.field-label { font-size: 0.85rem; font-weight: 700; color: var(--green-900); }
	.form-actions { display: flex; gap: 0.75rem; }
	.msg-box { border-radius: 0.75rem; padding: 0.75rem 1rem; font-size: 0.88rem; margin-bottom: 1.25rem; }
	.success { background: rgba(22,163,74,0.08); border: 1px solid rgba(22,163,74,0.25); color: var(--green-700); }
	.error   { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); color: #dc2626; }
	.guru-list { display: flex; flex-direction: column; gap: 0.5rem; }
	.guru-row { display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1rem; background: #f8fafc; border-radius: 0.75rem; border: 1px solid rgba(15,23,42,0.06); }
	.guru-avatar { width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg, var(--orange-50), #f0fdf4); border: 1px solid rgba(249,115,22,0.2); display: flex; align-items: center; justify-content: center; font-weight: 800; color: var(--orange-600); overflow: hidden; }
	.guru-foto { width: 100%; height: 100%; object-fit: cover; }
	.guru-info { flex: 1; min-width: 0; }
	.guru-nama { margin: 0; font-size: 0.9rem; font-weight: 700; color: var(--ink); }
	.guru-meta { margin: 0.15rem 0 0; font-size: 0.75rem; color: var(--muted); }
	.actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
	.btn-hapus { padding: 0.45rem 0.85rem; border-radius: 0.6rem; font-size: 0.82rem; font-weight: 600; color: #dc2626; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); cursor: pointer; }
	.btn-hapus:hover { background: rgba(239,68,68,0.15); }
	.empty { color: var(--muted); font-size: 0.9rem; }
</style>
