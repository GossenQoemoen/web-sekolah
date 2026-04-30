<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(async () => {
		const { data: { session } } = await supabase.auth.getSession();
		if (!session) goto('/admin/login');
	});

	async function logout() {
		await supabase.auth.signOut();
		goto('/admin/login');
	}
</script>

<div class="admin-shell">
	<aside class="sidebar">
		<div class="sidebar-brand">
			<div class="brand-logo">S</div>
			<div>
				<strong>Admin</strong>
				<span class="brand-sub">SMKN 2 Tebo</span>
			</div>
		</div>
		<nav class="sidebar-nav">
			<a href="/admin" class="nav-item">📰 Berita</a>
			<a href="/admin/profil" class="nav-item">🏫 Profil</a>
			<a href="/admin/guru" class="nav-item">👨🏫 Guru & Staf</a>
		</nav>
		<button onclick={logout} class="logout-btn">Keluar →</button>
	</aside>

	<main class="admin-main">
		{@render children()}
	</main>
</div>

<style>
	.admin-shell { display: flex; min-height: 100vh; }

	.sidebar {
		width: 220px; flex-shrink: 0;
		background: white; border-right: 1px solid rgba(15,23,42,0.08);
		display: flex; flex-direction: column; padding: 1.5rem 1rem;
		position: sticky; top: 0; height: 100vh;
	}
	.sidebar-brand { display: flex; align-items: center; gap: 0.65rem; margin-bottom: 2rem; }
	.brand-logo {
		width: 36px; height: 36px; border-radius: 0.65rem;
		background: linear-gradient(135deg, var(--orange-500), var(--green-600));
		display: flex; align-items: center; justify-content: center;
		color: white; font-weight: 800; font-size: 0.85rem; flex-shrink: 0;
	}
	.sidebar-brand strong { display: block; font-size: 0.88rem; font-weight: 800; color: var(--ink); }
	.brand-sub { font-size: 0.7rem; color: var(--muted); }

	.sidebar-nav { display: flex; flex-direction: column; gap: 0.25rem; flex: 1; }
	.nav-item {
		padding: 0.6rem 0.85rem; border-radius: 0.65rem;
		font-size: 0.88rem; font-weight: 600; color: var(--muted);
		text-decoration: none; transition: background 0.15s, color 0.15s;
	}
	.nav-item:hover { background: rgba(249,115,22,0.08); color: var(--ink); }

	.logout-btn {
		margin-top: auto; padding: 0.6rem 0.85rem; border-radius: 0.65rem;
		font-size: 0.85rem; font-weight: 600; color: #dc2626;
		background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.15);
		cursor: pointer; text-align: left;
	}
	.logout-btn:hover { background: rgba(239,68,68,0.12); }

	.admin-main { flex: 1; padding: 2rem; background: #f8fafc; }
</style>
