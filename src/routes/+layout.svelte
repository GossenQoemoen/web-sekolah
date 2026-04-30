<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';

	let { children } = $props();
	let menuOpen = $state(false);

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
				{#each navLinks as link}
					<a href={link.href}
						class="nav-link {$page.url.pathname === link.href ? 'nav-link-active' : ''}">
						{link.label}
					</a>
				{/each}
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
					<a href={link.href}
						class="nav-link {$page.url.pathname === link.href ? 'nav-link-active' : ''}"
						onclick={() => (menuOpen = false)}>
						{link.label}
					</a>
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
