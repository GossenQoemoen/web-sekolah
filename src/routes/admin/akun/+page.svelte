<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import type { ActionData } from './$types';

	type Akun = { id: string; nama: string; role: string; unit: string; created_at: string };

	let { form }: { form: ActionData } = $props();

	let list = $state<Akun[]>([]);
	let units = $state<{ id: number; nama: string }[]>([]);
	let editId = $state<string | null>(null);
	let editForm = $state({ nama: '', role: 'kontributor', unit: '' });
	let newForm = $state({ email: '', password: '', nama: '', role: 'kontributor', unit: '' });
	let loading = $state(false);

	async function load() {
		const { data } = await supabase.from('profiles').select('*').order('created_at');
		list = data ?? [];
		const { data: u } = await supabase.from('unit').select('id, nama').order('nama');
		units = u ?? [];
	}

	onMount(load);

	function mulaiEdit(a: Akun) {
		editId = a.id;
		editForm = { nama: a.nama, role: a.role, unit: a.unit ?? '' };
	}

	async function simpanEdit(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		const { error } = await supabase.from('profiles').update(editForm).eq('id', editId);
		editId = null;
		loading = false;
		await load();
	}

	const roleLabel: Record<string, string> = {
		superadmin: 'Super Admin',
		admin_berita: 'Admin Berita',
		kontributor: 'Kontributor'
	};
</script>

<div class="page-head">
	<h1 class="page-title">Kelola Akun</h1>
</div>

{#if form?.msg}
	<div class="msg-box {form.msg.startsWith('Error') ? 'error' : 'success'}">{form.msg}</div>
{/if}

<!-- Form Buat Akun -->
{#if !editId}
<div class="card">
	<h2 class="card-title">Buat Akun Baru</h2>
	<form method="POST" action="?/buat" use:enhance={() => { loading = true; return async ({ update }) => { loading = false; await update(); newForm = { email: '', password: '', nama: '', role: 'kontributor', unit: '' }; await load(); }; }} class="form-grid">
		<div class="fields-row">
			<div class="field">
				<label class="field-label" for="nama">Nama</label>
				<input id="nama" type="text" bind:value={newForm.nama} required class="cek-input" placeholder="Nama lengkap" />
			</div>
			<div class="field">
				<label class="field-label" for="email">Email</label>
				<input id="email" type="email" bind:value={newForm.email} required class="cek-input" placeholder="email@sekolah.com" />
			</div>
			<div class="field">
				<label class="field-label" for="password">Password</label>
				<input id="password" type="password" bind:value={newForm.password} required minlength={6} class="cek-input" placeholder="Min. 6 karakter" />
			</div>
		</div>
		<div class="fields-row">
			<div class="field">
				<label class="field-label" for="role">Role</label>
				<select id="role" bind:value={newForm.role} class="cek-input">
					<option value="kontributor">Kontributor</option>
					<option value="admin_berita">Admin Berita</option>
					<option value="superadmin">Super Admin</option>
				</select>
			</div>
			<div class="field">
				<label class="field-label" for="unit">Unit/Sektor</label>
				<select id="unit" bind:value={newForm.unit} class="cek-input">
					<option value="">— Pilih Unit —</option>
					{#each units as u}
						<option value={u.nama}>{u.nama}</option>
					{/each}
				</select>
			</div>
		</div>
		<div>
			<button type="submit" class="btn btn-primary btn-sm" disabled={loading}>
				{loading ? 'Membuat...' : 'Buat Akun'}
			</button>
		</div>
	</form>
</div>
{/if}

<!-- Form Edit -->
{#if editId}
<div class="card">
	<h2 class="card-title">Edit Akun</h2>
	<form onsubmit={simpanEdit} class="form-grid">
		<div class="fields-row">
			<div class="field">
				<label class="field-label" for="enama">Nama</label>
				<input id="enama" type="text" bind:value={editForm.nama} required class="cek-input" />
			</div>
			<div class="field">
				<label class="field-label" for="erole">Role</label>
				<select id="erole" bind:value={editForm.role} class="cek-input">
					<option value="kontributor">Kontributor</option>
					<option value="admin_berita">Admin Berita</option>
					<option value="superadmin">Super Admin</option>
				</select>
			</div>
			<div class="field">
				<label class="field-label" for="eunit">Unit/Sektor</label>
				<select id="eunit" bind:value={editForm.unit} class="cek-input">
					<option value="">— Pilih Unit —</option>
					{#each units as u}
						<option value={u.nama}>{u.nama}</option>
					{/each}
				</select>
			</div>
		</div>
		<div class="form-actions">
			<button type="submit" class="btn btn-primary btn-sm" disabled={loading}>Simpan</button>
			<button type="button" onclick={() => editId = null} class="btn btn-secondary btn-sm">Batal</button>
		</div>
	</form>
</div>
{/if}

<!-- Daftar Akun -->
<div class="card">
	<h2 class="card-title">Daftar Akun ({list.length})</h2>
	{#if list.length === 0}
		<p class="empty">Belum ada akun.</p>
	{:else}
		<div class="akun-list">
			{#each list as a}
				<div class="akun-row">
					<div class="akun-avatar">{(a.nama || '?')[0].toUpperCase()}</div>
					<div class="akun-info">
						<p class="akun-nama">{a.nama || '—'}</p>
						<div class="akun-meta">
							<span class="role-badge role-{a.role}">{roleLabel[a.role] ?? a.role}</span>
							{#if a.unit}<span class="unit-tag">{a.unit}</span>{/if}
						</div>
					</div>
					<div class="akun-actions">
						<button onclick={() => mulaiEdit(a)} class="btn btn-secondary btn-sm">Edit</button>
						<form method="POST" action="?/hapus" use:enhance={() => { return async ({ update }) => { await update(); await load(); }; }} style="display:inline">
							<input type="hidden" name="id" value={a.id} />
							<button type="submit" class="btn-hapus" onclick={(e) => { if (!confirm('Hapus akun ini?')) e.preventDefault(); }}>Hapus</button>
						</form>
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
	.akun-list { display: flex; flex-direction: column; gap: 0.5rem; }
	.akun-row { display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1rem; background: #f8fafc; border-radius: 0.75rem; border: 1px solid rgba(15,23,42,0.06); }
	.akun-avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--orange-500), var(--green-600)); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 0.9rem; flex-shrink: 0; }
	.akun-info { flex: 1; min-width: 0; }
	.akun-nama { margin: 0 0 0.3rem; font-size: 0.9rem; font-weight: 700; color: var(--ink); }
	.akun-meta { display: flex; gap: 0.5rem; flex-wrap: wrap; }
	.role-badge { font-size: 0.72rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 999px; }
	.role-superadmin { background: rgba(234,88,12,0.1); color: var(--orange-600); border: 1px solid rgba(234,88,12,0.2); }
	.role-admin_berita { background: rgba(99,102,241,0.1); color: #6366f1; border: 1px solid rgba(99,102,241,0.2); }
	.role-kontributor { background: rgba(22,163,74,0.1); color: var(--green-700); border: 1px solid rgba(22,163,74,0.2); }
	.unit-tag { font-size: 0.72rem; font-weight: 600; color: #6366f1; background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.2); padding: 0.2rem 0.55rem; border-radius: 999px; }
	.akun-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
	.btn-hapus { padding: 0.45rem 0.85rem; border-radius: 0.6rem; font-size: 0.82rem; font-weight: 600; color: #dc2626; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); cursor: pointer; }
	.btn-hapus:hover { background: rgba(239,68,68,0.15); }
	.empty { color: var(--muted); font-size: 0.9rem; }
</style>
