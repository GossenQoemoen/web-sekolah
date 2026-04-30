<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';

	let { children } = $props();
	let menuOpen = $state(false);
	let kompOpen = $state(false);
	let program = $state<{ id: number; nama: string; slug: string }[]>([]);

	onMount(async () => {
		const { data } = await supabase.from('program_keahlian').select('id, nama, slug').order('nama');
		program = data ?? [];
	});

	const navLinks = [
		{ href: '/', label: 'Beranda' },
		{ href: '/profil', label: 'Profil' },
		{ href: '/berita', label: 'Berita' },
		{ href: '/galeri', label: 'Galeri' },
		{ href: '/kontak', label: 'Kontak' }
	];
</script>

<div class="noise"></div>

<div class="site-wrapper">
	<!-- Navbar -->
	<header class="navbar">
		<div class="navbar-inner">
			<!-- Brand -->
			<a href="/" class="brand">
				<div class="brand-logo-wrap">
					<img src="/logo.png" alt="Logo SMKN 2 Tebo" class="brand-logo-img"
						onerror={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
				</div>
				<div>
					<strong class="brand-name">SMKN 2 Tebo</strong>
					<span class="brand-sub">Sistem Informasi Akademik</span>
				</div>
			</a>

			<!-- Desktop Nav -->
			<nav class="desktop-nav">
				<a href="/" class="nav-link {$page.url.pathname === '/' ? 'nav-link-active' : ''}">Beranda</a>
				<a href="/profil" class="nav-link {$page.url.pathname === '/profil' ? 'nav-link-active' : ''}">Profil</a>

				<!-- Kompetensi Dropdown -->
				<div class="nav-dropdown" onmouseenter={() => kompOpen = true} onmouseleave={() => kompOpen = false}>
					<a href="/kompetensi" class="nav-link nav-link-drop {$page.url.pathname.startsWith('/kompetensi') ? 'nav-link-active' : ''}">
						Kompetensi <span class="drop-arrow">▾</span>
					</a>
					{#if kompOpen && program.length > 0}
						<div class="dropdown-menu">
							<a href="/kompetensi" class="dropdown-item dropdown-all">Semua Kompetensi</a>
							<div class="dropdown-divider"></div>
							{#each program as p}
								<a href="/kompetensi/{p.slug}" class="dropdown-item">{p.nama}</a>
							{/each}
						</div>
					{/if}
				</div>

				<a href="/berita" class="nav-link {$page.url.pathname === '/berita' ? 'nav-link-active' : ''}">Berita</a>
				<a href="/galeri" class="nav-link {$page.url.pathname === '/galeri' ? 'nav-link-active' : ''}">Galeri</a>
				<a href="/kontak" class="nav-link {$page.url.pathname === '/kontak' ? 'nav-link-active' : ''}">Kontak</a>
			</nav>

			<!-- Hamburger -->
			<button class="hamburger-btn" onclick={() => (menuOpen = !menuOpen)} aria-label="Toggle menu">
				<span class="ham-line {menuOpen ? 'ham-line-1-open' : ''}"></span>
				<span class="ham-line {menuOpen ? 'ham-line-2-open' : ''}"></span>
				<span class="ham-line {menuOpen ? 'ham-line-3-open' : ''}"></span>
			</button>
		</div>

		<!-- Mobile Menu -->
		{#if menuOpen}
			<nav class="mobile-nav">
				{#each navLinks as link}
					<a href={link.href} class="nav-link {$page.url.pathname === link.href ? 'nav-link-active' : ''}" onclick={() => (menuOpen = false)}>{link.label}</a>
				{/each}
				<div class="mobile-divider"></div>
				<p class="mobile-section">Kompetensi</p>
				<a href="/kompetensi" class="nav-link" onclick={() => (menuOpen = false)}>Semua Kompetensi</a>
				{#each program as p}
					<a href="/kompetensi/{p.slug}" class="nav-link nav-link-sub" onclick={() => (menuOpen = false)}>{p.nama}</a>
				{/each}
			</nav>
		{/if}
	</header>

	<!-- Content -->
	<main class="site-main">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="site-footer">
		<div class="footer-inner">
			<div>
				<div class="footer-brand">
					<div class="footer-logo">S</div>
					<strong class="brand-name">SMKN 2 Tebo</strong>
				</div>
				<p class="footer-desc">Portal resmi informasi akademik, berita, dan pengumuman sekolah.</p>
			</div>
			<div>
				<p class="footer-label">Navigasi</p>
				{#each navLinks as link}
					<a href={link.href} class="footer-link">{link.label}</a>
				{/each}
			</div>
			<div>
				<p class="footer-label">Kontak</p>
				<p class="footer-info">📍 Jl. Pendidikan No. 1, Tebo</p>
				<p class="footer-info">✉️ info@smkn2tebo.sch.id</p>
				<p class="footer-info">📞 (0744) 000-0000</p>
			</div>
		</div>
		<div class="footer-bottom">
			© {new Date().getFullYear()} SMKN 2 Tebo — Sistem Informasi Akademik
		</div>
	</footer>
</div>

<style>
	.site-wrapper {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
	.site-main { flex: 1; }

	/* Brand */
	.brand {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		text-decoration: none;
		color: inherit;
	}
	.brand-logo-wrap {
		width: 44px; height: 44px;
		border-radius: 0.85rem;
		overflow: hidden;
		flex-shrink: 0;
		background: linear-gradient(135deg, var(--orange-500), var(--green-600));
		display: flex; align-items: center; justify-content: center;
		box-shadow: 0 4px 14px -4px rgba(234,88,12,0.4);
	}
	.brand-logo-img { width: 100%; height: 100%; object-fit: cover; }
	.brand-name { display: block; font-size: 0.95rem; letter-spacing: -0.02em; color: var(--ink); font-weight: 800; }
	.brand-sub  { display: block; font-size: 0.72rem; color: var(--muted); font-weight: 500; }

	/* Desktop nav */
	.desktop-nav { display: flex; align-items: center; gap: 0.25rem; }

	/* Dropdown */
	.nav-dropdown { position: relative; }
	.nav-link-drop { display: flex; align-items: center; gap: 0.25rem; }
	.drop-arrow { font-size: 0.65rem; opacity: 0.6; }
	.dropdown-menu {
		position: absolute; top: calc(100% + 0.5rem); left: 50%; transform: translateX(-50%);
		background: white; border-radius: 0.85rem; padding: 0.5rem;
		box-shadow: 0 8px 32px -4px rgba(15,23,42,0.15); border: 1px solid rgba(15,23,42,0.07);
		min-width: 240px; z-index: 100;
	}
	.dropdown-item {
		display: block; padding: 0.55rem 0.85rem; border-radius: 0.55rem;
		font-size: 0.83rem; font-weight: 600; color: var(--muted); text-decoration: none;
		transition: background 0.12s, color 0.12s;
	}
	.dropdown-item:hover { background: rgba(249,115,22,0.07); color: var(--ink); }
	.dropdown-all { color: var(--orange-600) !important; font-weight: 700; }
	.dropdown-divider { height: 1px; background: rgba(15,23,42,0.06); margin: 0.35rem 0; }

	/* Mobile submenu */
	.mobile-divider { height: 1px; background: rgba(15,23,42,0.06); margin: 0.35rem 0; }
	.mobile-section { margin: 0.25rem 0.85rem 0.1rem; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
	.nav-link-sub { padding-left: 1.5rem !important; font-size: 0.82rem !important; }

	/* Hamburger */
	.hamburger-btn {
		display: none;
		padding: 0.5rem; border: none; background: none; cursor: pointer; border-radius: 0.5rem;
		flex-direction: column; gap: 5px;
	}
	.ham-line {
		display: block; width: 22px; height: 2px;
		background: var(--ink); border-radius: 2px; transition: all 0.2s;
	}
	.ham-line-1-open { transform: rotate(45deg) translateY(7px); }
	.ham-line-2-open { opacity: 0; }
	.ham-line-3-open { transform: rotate(-45deg) translateY(-7px); }

	/* Mobile nav */
	.mobile-nav {
		border-top: 1px solid rgba(15,23,42,0.06);
		padding: 0.75rem clamp(1.25rem,4vw,3rem);
		display: flex; flex-direction: column; gap: 0.25rem;
		background: rgba(255,255,255,0.95);
	}

	/* Footer extras */
	.footer-brand { display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.75rem; }
	.footer-logo {
		width: 36px; height: 36px; border-radius: 0.65rem;
		background: linear-gradient(135deg, var(--orange-500), var(--green-600));
		display: flex; align-items: center; justify-content: center;
		color: white; font-weight: 800; font-size: 0.8rem;
	}
	.footer-desc { font-size: 0.82rem; color: var(--muted); margin: 0; max-width: 18rem; line-height: 1.6; }
	.footer-info { font-size: 0.85rem; color: var(--muted); margin: 0 0 0.4rem; }
	.footer-bottom {
		border-top: 1px solid rgba(15,23,42,0.06);
		text-align: center; padding: 1.25rem;
		font-size: 0.8rem; color: var(--muted);
	}

	@media (max-width: 768px) {
		.desktop-nav { display: none; }
		.hamburger-btn { display: flex; }
	}
</style>
