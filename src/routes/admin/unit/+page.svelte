<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';

	type Unit = { id: number; nama: string; created_at: string };

	let list = $state<Unit[]>([]);
	let nama = $state('');
	let editId = $state<number | null>(null);
	let editNama = $state('');
	let loading = $state(false);
	let msg = $state('');

	async function load() {
		const { data, error } = await supabase.from('unit').select('*').order('nama');
		if (error) msg = 'Error: ' + error.message;
		list = data ?? [];
	}

	onMount(load);

	async function simpan(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		const { error } = await supabase.from('unit').insert({ nama });
		msg = error ? 'Error: ' + error.message : 'Unit ditambahkan.';
		nama = '';
		loading = false;
		await load();
		setTimeout(() => msg = '', 3000);
	}

	async function simpanEdit(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		const { error } = await supabase.from('unit').update({ nama: editNama }).eq('id', editId);
		msg = error ? 'Error: ' + error.message : 'Unit diperbarui.';
		editId = null;
		loading = false;
		await load();
		setTimeout(() => msg = '', 3000);
	}

	async function hapus(id: number) {
		if (!confirm('Hapus unit ini?')) return;
		await supabase.from('unit').delete().eq('id', id);
		await load();
	}
</script>

<div class="page-head">
	<h1 class="page-title">Kelola Unit & Sektor</h1>
	<p class="page-sub">Unit digunakan sebagai identitas kontributor saat posting berita dan galeri.</p>
</div>

{#if msg}
	<div class="msg-box {msg.startsWith('Error') ? 'error' : 'success'}">{msg}</div>
{/if}

<div class="card">
	<h2 class="card-title">Tambah Unit</h2>
	<form onsubmit={simpan} class="form-row">
		<div class="field" style="flex:1">
			<label class="field-label" for="nama">Nama Unit/Sektor</label>
			<input id="nama" type="text" bind:value={nama} required class="cek-input" placeholder="Contoh: Teknik Otomotif, Tata Usaha, OSIS..." />
		</div>
		<div class="field field-btn">
			<label class="field-label">&nbsp;</label>
			<button type="submit" class="btn btn-primary btn-sm" disabled={loading}>Tambah</button>
		</div>
	</form>
</div>

<div class="card">
	<h2 class="card-title">Daftar Unit ({list.length})</h2>
	{#if list.length === 0}
		<p class="empty">Belum ada unit.</p>
	{:else}
		<div class="unit-list">
			{#each list as u}
				<div class="unit-row">
					{#if editId === u.id}
						<form onsubmit={simpanEdit} class="edit-form">
							<input type="text" bind:value={editNama} required class="cek-input" />
							<button type="submit" class="btn btn-primary btn-sm" disabled={loading}>Simpan</button>
							<button type="button" onclick={() => editId = null} class="btn btn-secondary btn-sm">Batal</button>
						</form>
					{:else}
						<span class="unit-nama">{u.nama}</span>
						<div class="unit-actions">
							<button onclick={() => { editId = u.id; editNama = u.nama; }} class="btn btn-secondary btn-sm">Edit</button>
							<button onclick={() => hapus(u.id)} class="btn-hapus">Hapus</button>
						</div>
					{/if}
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
	.form-row { display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap; }
	.field { display: grid; gap: 0.4rem; }
	.field-btn { flex-shrink: 0; }
	.field-label { font-size: 0.85rem; font-weight: 700; color: var(--green-900); }
	.msg-box { border-radius: 0.75rem; padding: 0.75rem 1rem; font-size: 0.88rem; margin-bottom: 1.25rem; }
	.success { background: rgba(22,163,74,0.08); border: 1px solid rgba(22,163,74,0.25); color: var(--green-700); }
	.error   { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); color: #dc2626; }
	.unit-list { display: flex; flex-direction: column; gap: 0.5rem; }
	.unit-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.85rem 1rem; background: #f8fafc; border-radius: 0.75rem; border: 1px solid rgba(15,23,42,0.06); }
	.unit-nama { font-size: 0.9rem; font-weight: 600; color: var(--ink); }
	.unit-actions { display: flex; gap: 0.5rem; }
	.edit-form { display: flex; gap: 0.5rem; align-items: center; flex: 1; }
	.edit-form input { flex: 1; }
	.btn-hapus { padding: 0.45rem 0.85rem; border-radius: 0.6rem; font-size: 0.82rem; font-weight: 600; color: #dc2626; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); cursor: pointer; }
	.btn-hapus:hover { background: rgba(239,68,68,0.15); }
	.empty { color: var(--muted); font-size: 0.9rem; }
</style>
