<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { Profile } from '$lib/auth';

	let { children } = $props();
	let profile = $state<Profile | null>(null);

	onMount(async () => {
		const { data: { session } } = await supabase.auth.getSession();
		if (!session) { goto('/admin/login'); return; }

		const { data } = await supabase
			.from('profiles')
			.select('id, nama, role, unit')
			.eq('id', session.user.id)
			.single();

		if (!data) { goto('/admin/login'); return; }
		profile = data;
	});

	async function logout() {
		await supabase.auth.signOut();
		goto('/admin/login');
	}
</script>

{#if profile}
<div class="admin-shell">
	<aside class="sidebar">
		<div class="sidebar-brand">
			<div class="brand-logo">S</div>
			<div>
				<strong>{profile.nama}</strong>
				<span class="brand-sub role-badge role-{profile.role}">{profile.role}</span>
			</div>
		</div>

		<nav class="sidebar-nav">
			<!-- Kontributor & admin_berita & superadmin -->
			<a href="/admin" class="nav-item">📰 Berita</a>
			<a href="/admin/galeri" class="nav-item">📸 Galeri</a>

			<!-- Admin berita & superadmin -->
			{#if profile.role === 'admin_berita' || profile.role === 'superadmin'}
				<div class="nav-divider"></div>
				<p class="nav-section">Moderasi</p>
				<a href="/admin/draft" class="nav-item">📋 Draft Berita</a>
				<a href="/admin/draft-galeri" class="nav-item">🖼️ Draft Galeri</a>
			{/if}

			<!-- Superadmin only -->
			{#if profile.role === 'superadmin'}
				<div class="nav-divider"></div>
				<p class="nav-section">Manajemen</p>
				<a href="/admin/profil" class="nav-item">🏫 Profil Sekolah</a>
				<a href="/admin/guru" class="nav-item">👨🏫 Guru & Staf</a>
				<a href="/admin/program" class="nav-item">🎓 Program Keahlian</a>
				<a href="/admin/unit" class="nav-item">🏢 Unit & Sektor</a>
				<a href="/admin/akun" class="nav-item">👥 Kelola Akun</a>
			{/if}
		</nav>

		<button onclick={logout} class="logout-btn">Keluar →</button>
	</aside>

	<main class="admin-main">
		{@render children()}
	</main>
</div>
{/if}

<style>
	.admin-shell { display: flex; min-height: 100vh; }
	.sidebar {
		width: 220px; flex-shrink: 0;
		background: white; border-right: 1px solid rgba(15,23,42,0.08);
		display: flex; flex-direction: column; padding: 1.5rem 1rem;
		position: sticky; top: 0; height: 100vh; overflow-y: auto;
	}
	.sidebar-brand { display: flex; align-items: center; gap: 0.65rem; margin-bottom: 1.5rem; }
	.brand-logo {
		width: 36px; height: 36px; border-radius: 0.65rem; flex-shrink: 0;
		background: linear-gradient(135deg, var(--orange-500), var(--green-600));
		display: flex; align-items: center; justify-content: center;
		color: white; font-weight: 800; font-size: 0.85rem;
	}
	.sidebar-brand strong { display: block; font-size: 0.82rem; font-weight: 800; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 130px; }
	.brand-sub { font-size: 0.68rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 999px; display: inline-block; margin-top: 0.2rem; }
	.role-superadmin { background: rgba(234,88,12,0.12); color: var(--orange-600); }
	.role-admin_berita { background: rgba(99,102,241,0.12); color: #6366f1; }
	.role-kontributor { background: rgba(22,163,74,0.12); color: var(--green-700); }

	.sidebar-nav { display: flex; flex-direction: column; gap: 0.2rem; flex: 1; }
	.nav-item { padding: 0.55rem 0.85rem; border-radius: 0.65rem; font-size: 0.85rem; font-weight: 600; color: var(--muted); text-decoration: none; transition: background 0.15s, color 0.15s; }
	.nav-item:hover { background: rgba(249,115,22,0.08); color: var(--ink); }
	.nav-divider { height: 1px; background: rgba(15,23,42,0.06); margin: 0.5rem 0; }
	.nav-section { margin: 0 0 0.25rem 0.85rem; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }

	.logout-btn { margin-top: 1rem; padding: 0.6rem 0.85rem; border-radius: 0.65rem; font-size: 0.85rem; font-weight: 600; color: #dc2626; background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.15); cursor: pointer; text-align: left; }
	.logout-btn:hover { background: rgba(239,68,68,0.12); }
	.admin-main { flex: 1; padding: 2rem; background: #f8fafc; overflow-y: auto; }
</style>
