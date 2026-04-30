<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Profil — SMKN 2 Tebo</title>
</svelte:head>

<div class="container page-header">
	<p class="eyebrow">🏫 Tentang Kami</p>
	<h1 class="gradient-heading page-title">Profil Sekolah</h1>
</div>

<div class="container profil-body">
	<div class="profil-grid">
		<!-- Sidebar -->
		<div class="sidebar">
			<div class="float-card text-center">
				<div class="logo-wrap">
					<img src="/logo.png" alt="Logo SMKN 2 Tebo" class="logo-img" />
				</div>
				<h2 class="profil-name">{data.profil?.nama ?? 'SMKN 2 Tebo'}</h2>
				<p class="profil-npsn">NPSN: {data.profil?.npsn ?? '-'}</p>
				{#if data.profil?.akreditasi}
					<span class="pill pill-akreditasi">✓ Akreditasi {data.profil.akreditasi}</span>
				{/if}
			</div>

			<div class="float-card info-list">
				{#each [
					['📍','Alamat', data.profil?.alamat],
					['🏆','Akreditasi', data.profil?.akreditasi],
					['🔢','NPSN', data.profil?.npsn]
				] as [icon, label, val]}
					<div class="info-row">
						<span class="info-icon">{icon}</span>
						<div>
							<p class="info-label">{label}</p>
							<p class="info-val">{val ?? '-'}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Main -->
		<div class="profil-main">
			<div class="section-card">
				<p class="eyebrow">🎯 Visi</p>
				<blockquote class="visi-quote">
					"{data.profil?.visi ?? 'Visi sekolah belum diisi.'}"
				</blockquote>
			</div>

			<div class="section-card">
				<p class="eyebrow">🚀 Misi</p>
				<p class="misi-text">{data.profil?.misi ?? 'Misi sekolah belum diisi.'}</p>
			</div>

			<div class="cta-dark cta-row-inline">
				<div>
					<p class="cta-inline-title">Ingin tahu lebih lanjut?</p>
					<p class="cta-inline-desc">Hubungi kami untuk informasi lebih detail.</p>
				</div>
				<a href="/kontak" class="btn btn-primary btn-sm">Kontak Kami →</a>
			</div>
		</div>
	</div>
</div>

<style>
	.page-title { font-size: clamp(2rem,5vw,3rem); margin-bottom: 0; }
	.profil-body { padding-top: 2rem; padding-bottom: 5rem; }

	.profil-grid { display: grid; gap: 1.5rem; grid-template-columns: 1fr; }
	.sidebar { display: flex; flex-direction: column; gap: 1.25rem; }
	.profil-main { display: flex; flex-direction: column; gap: 1.25rem; }

	.text-center { text-align: center; }
	.logo-wrap {
		width: 100px; height: 100px; margin: 0 auto 1rem;
		border-radius: 1.25rem; overflow: hidden;
		background: linear-gradient(135deg, var(--orange-50), #f0fdf4);
		display: flex; align-items: center; justify-content: center;
		border: 1px solid rgba(15,23,42,0.06);
	}
	.logo-img { width: 100%; height: 100%; object-fit: contain; padding: 0.5rem; }
	.profil-name { margin: 0 0 0.25rem; font-size: 1rem; font-weight: 800; color: var(--ink); }
	.profil-npsn { margin: 0; font-size: 0.82rem; color: var(--muted); }
	.pill-akreditasi {
		display: inline-block; margin-top: 0.75rem;
		background: rgba(22,163,74,0.12); color: var(--green-700);
		border: 1px solid rgba(22,163,74,0.28);
		font-size: 0.75rem; font-weight: 700;
		padding: 0.35rem 0.75rem; border-radius: 999px;
	}

	.info-list { display: flex; flex-direction: column; gap: 1rem; }
	.info-row  { display: flex; gap: 0.75rem; align-items: flex-start; }
	.info-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 0.1rem; }
	.info-label { margin: 0; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); }
	.info-val   { margin: 0.15rem 0 0; font-size: 0.88rem; font-weight: 600; color: var(--ink); }

	.misi-text { margin: 0; color: var(--muted); line-height: 1.8; white-space: pre-line; font-size: 0.95rem; }

	.cta-row-inline {
		display: flex; align-items: center; justify-content: space-between;
		flex-wrap: wrap; gap: 1rem; text-align: left;
	}
	.cta-inline-title { margin: 0 0 0.25rem; font-weight: 800; font-size: 1rem; }
	.cta-inline-desc  { margin: 0; font-size: 0.85rem; color: rgba(255,255,255,0.65); }

	@media (min-width: 900px) {
		.profil-grid { grid-template-columns: 280px 1fr; }
	}
</style>
