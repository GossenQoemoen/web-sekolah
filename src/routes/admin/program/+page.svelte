<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';

	type Program = { id: number; nama: string; jumlah_siswa: number };

	let list = $state<Program[]>([]);
	let form = $state({ nama: '', jumlah_siswa: 0 });
	let editId = $state<number | null>(null);
	let loading = $state(false);
	let msg = $state('');

	async function load() {
		const { data, error } = await supabase.from('program_keahlian').select('*').order('nama');
		if (error) msg = 'Error: ' + error.message;
		list = data ?? [];
	}

	onMount(load);

	async function simpan(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		if (editId) {
			const { error } = await supabase.from('program_keahlian').update(form).eq('id', editId);
			msg = error ? 'Error: ' + error.message : 'Program diperbarui.';
		} else {
			const { error } = await supabase.from('program_keahlian').insert(form);
			msg = error ? 'Error: ' + error.message : 'Program ditambahkan.';
		}
		form = { nama: '', jumlah_siswa: 0 };
		editId = null;
		loading = false;
		await load();
		setTimeout(() => msg = '', 3000);
	}

	function edit(p: Program) {
		editId = p.id;
		form = { nama: p.nama, jumlah_siswa: p.jumlah_siswa };
	}

	async function hapus(id: number) {
		if (!confirm('Hapus program ini?')) return;
		await supabase.from('program_keahlian').delete().eq('id', id);
		await load();
	}
</script>

<div class="page-head">
	<h1 class="page-title">Kelola Program Keahlian</h1>
</div>

{#if msg}
	<div class="msg-box {msg.startsWith('Error') ? 'error' : 'success'}">{msg}</div>
{/if}

<div class="card">
	<h2 class="card-title">{editId ? 'Edit Program' : 'Tambah Program'}</h2>
	<form onsubmit={simpan} class="form-grid">
		<div class="fields-row">
			<div class="field">
				<label class="field-label" for="nama">Nama Program Keahlian</label>
				<input id="nama" type="text" bind:value={form.nama} required class="cek-input" placeholder="Contoh: Teknik Otomotif" />
			</div>
			<div class="field">
				<label class="field-label" for="jumlah">Jumlah Siswa</label>
				<input id="jumlah" type="number" bind:value={form.jumlah_siswa} required min="0" class="cek-input" />
			</div>
		</div>
		<div class="form-actions">
			<button type="submit" class="btn btn-primary btn-sm" disabled={loading}>
				{loading ? 'Menyimpan...' : editId ? 'Perbarui' : 'Simpan'}
			</button>
			{#if editId}
				<button type="button" onclick={() => { editId = null; form = { nama: '', jumlah_siswa: 0 }; }} class="btn btn-secondary btn-sm">Batal</button>
			{/if}
		</div>
	</form>
</div>

<div class="card">
	<h2 class="card-title">Daftar Program ({list.length})</h2>
	{#if list.length === 0}
		<p class="empty">Belum ada program keahlian.</p>
	{:else}
		<div class="list">
			{#each list as p}
				<div class="row">
					<div class="info">
						<p class="nama">{p.nama}</p>
						<span class="pill pill-orange">{p.jumlah_siswa} siswa</span>
					</div>
					<div class="actions">
						<button onclick={() => edit(p)} class="btn btn-secondary btn-sm">Edit</button>
						<button onclick={() => hapus(p.id)} class="btn-hapus">Hapus</button>
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
	.fields-row { display: grid; grid-template-columns: 1fr auto; gap: 1rem; align-items: end; }
	.field { display: grid; gap: 0.4rem; }
	.field-label { font-size: 0.85rem; font-weight: 700; color: var(--green-900); }
	.form-actions { display: flex; gap: 0.75rem; }
	.msg-box { border-radius: 0.75rem; padding: 0.75rem 1rem; font-size: 0.88rem; margin-bottom: 1.25rem; }
	.success { background: rgba(22,163,74,0.08); border: 1px solid rgba(22,163,74,0.25); color: var(--green-700); }
	.error   { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); color: #dc2626; }
	.list { display: flex; flex-direction: column; gap: 0.5rem; }
	.row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.85rem 1rem; background: #f8fafc; border-radius: 0.75rem; border: 1px solid rgba(15,23,42,0.06); }
	.info { display: flex; align-items: center; gap: 0.75rem; flex: 1; min-width: 0; }
	.nama { margin: 0; font-size: 0.9rem; font-weight: 700; color: var(--ink); }
	.actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
	.btn-hapus { padding: 0.45rem 0.85rem; border-radius: 0.6rem; font-size: 0.82rem; font-weight: 600; color: #dc2626; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); cursor: pointer; }
	.btn-hapus:hover { background: rgba(239,68,68,0.15); }
	.empty { color: var(--muted); font-size: 0.9rem; }
</style>
