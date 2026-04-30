<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	const icons = ['⚙️','🔧','🔩','📊','💰','🎨'];
	const accents = ['var(--orange-500)','var(--green-600)','#6366f1','#0ea5e9','#f59e0b','#ec4899'];
</script>

<svelte:head>
	<title>Beranda — SMKN 2 Tebo</title>
</svelte:head>

<!-- Hero -->
<section class="hero-section">
	<div class="wrap">
		<div class="hero-grid">
			<div>
				<div class="pill-row">
					<span class="pill">🎓 Tahun Ajaran 2024/2025</span>
					<span class="pill-orange">📢 Informasi Terkini</span>
				</div>
				<h1 class="gradient-heading hero-title">
					Selamat Datang<br/>di SMKN 2 Tebo
				</h1>
				<p class="hero-lead">
					Portal resmi informasi akademik, berita, dan pengumuman SMKN 2 Tebo yang terpercaya dan selalu terkini.
				</p>
				<div class="cta-row">
					<a href="/berita" class="btn btn-primary">Lihat Berita →</a>
					<a href="/profil" class="btn btn-secondary">Profil Sekolah</a>
				</div>
			</div>
			<div class="hero-visual">
				<div class="card-stack">
					<div class="blob blob-hero"></div>
					<div class="float-card">
						<span class="badge-active">✓ Aktif</span>
						<h2 class="card-title">Informasi Sekolah</h2>
						<p class="card-desc">Data akademik, berita, dan pengumuman tersedia secara real-time.</p>
						<div class="stat-grid">
							{#each [['500+','Siswa Aktif'],['40+','Pengajar'],['15+','Tahun'],['A','Akreditasi']] as [val, label]}
								<div class="stat">
									<strong>{val}</strong>
									<span>{label}</span>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Kompetensi Keahlian -->
<section class="section-gap wrap">
	<div class="section-card">
		<p class="eyebrow">🎓 Program Kami</p>
		<div class="section-header">
			<h2 class="section-title">Kompetensi Keahlian</h2>
			<a href="/kompetensi" class="btn btn-secondary btn-sm">Lihat Semua →</a>
		</div>
		<div class="komp-grid">
			{#each data.program as p, i}
				<a href="/kompetensi/{p.slug}" class="komp-card" style="--accent:{accents[i % accents.length]}">
					<div class="komp-icon">{icons[i % icons.length]}</div>
					<h3 class="komp-nama">{p.nama}</h3>
					<p class="komp-desc">{p.deskripsi ?? ''}</p>
					<div class="komp-footer">
						<span class="komp-siswa">👥 {p.jumlah_siswa} siswa</span>
						<span class="komp-read">Selengkapnya →</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- Berita Terbaru -->
<section class="section-gap wrap">
	<div class="section-card">
		<p class="eyebrow">📰 Terkini</p>
		<div class="section-header">
			<h2 class="section-title">Berita Terbaru</h2>
			<a href="/berita" class="btn btn-secondary btn-sm">Lihat Semua →</a>
		</div>
		{#if data.berita.length === 0}
			<div class="empty-state">
				<p class="empty-icon">📭</p>
				<p class="empty-title">Belum ada berita tersedia.</p>
			</div>
		{:else}
			<div class="news-grid">
				{#each data.berita as item, i}
					<a href="/berita/{item.id}" class="news-card-grid">
						<div class="news-card-bar news-card-bar-{i}"></div>
						<div class="news-card-body">
							<span class="pill pill-sm">{new Date(item.created_at).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}</span>
							<h3 class="news-card-title">{item.judul}</h3>
							<p class="news-card-desc">{item.ringkasan}</p>
							<p class="news-card-read">Baca →</p>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>

<!-- CTA -->
<section class="section-gap wrap">
	<div class="cta-dark">
		<p class="eyebrow" style="color:rgba(255,255,255,0.5);">Butuh Bantuan?</p>
		<h2 class="cta-title">Ada Pertanyaan?</h2>
		<p class="cta-desc">Tim kami siap membantu Anda. Hubungi kami dan dapatkan respons dalam 1×24 jam kerja.</p>
		<a href="/kontak" class="btn btn-primary">Hubungi Kami →</a>
	</div>
</section>

<style>
	.hero-section { padding: clamp(2rem,6vw,5rem) 0 4rem; }
	.hero-grid { display: grid; gap: clamp(2.5rem,5vw,4rem); align-items: center; grid-template-columns: 1fr; }
	.pill-row { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem; }
	.hero-title { font-size: clamp(2.25rem,5vw,3.35rem); margin-bottom: 1rem; }
	.hero-lead { font-size: 1.05rem; color: var(--muted); max-width: 32rem; margin: 0 0 1.75rem; line-height: 1.7; }
	.cta-row { display: flex; flex-wrap: wrap; gap: 0.85rem; align-items: center; }
	.hero-visual { position: relative; min-height: 280px; }
	.card-stack { position: relative; width: 100%; max-width: 440px; margin: 0 auto; }
	.blob-hero { width: 88%; height: 88%; left: 6%; top: 6%; }
	.card-title { margin: 0 0 0.5rem; font-size: 1.1rem; color: var(--green-900); font-weight: 800; }
	.card-desc  { margin: 0; font-size: 0.9rem; color: var(--muted); }
	.stat-grid  { display: grid; grid-template-columns: repeat(2,1fr); gap: 0.75rem; margin-top: 1.25rem; }

	.section-gap { padding-bottom: 5rem; }
	.section-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; }
	.section-title { margin: 0; font-size: clamp(1.35rem,3vw,1.65rem); color: var(--green-900); letter-spacing: -0.02em; font-weight: 800; }

	/* Kompetensi */
	.komp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap: 1rem; }
	.komp-card {
		display: flex; flex-direction: column;
		padding: 1.5rem; border-radius: 1rem; text-decoration: none;
		background: white; border: 1px solid rgba(15,23,42,0.07);
		border-top: 4px solid var(--accent);
		box-shadow: 0 1px 8px -2px rgba(15,23,42,0.06);
		transition: transform 0.15s, box-shadow 0.15s;
	}
	.komp-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px -6px rgba(15,23,42,0.12); }
	.komp-icon { font-size: 1.75rem; margin-bottom: 0.75rem; }
	.komp-nama { margin: 0 0 0.5rem; font-size: 0.95rem; font-weight: 800; color: var(--ink); line-height: 1.4; }
	.komp-desc { margin: 0; font-size: 0.82rem; color: var(--muted); line-height: 1.6; flex: 1;
		display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
	.komp-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 1rem; }
	.komp-siswa { font-size: 0.75rem; color: var(--muted); font-weight: 500; }
	.komp-read { font-size: 0.78rem; font-weight: 700; color: var(--orange-600); }

	/* Berita */
	.empty-state { text-align: center; padding: 3rem; color: var(--muted); }
	.empty-icon  { font-size: 2.5rem; margin: 0 0 0.5rem; }
	.empty-title { font-weight: 600; margin: 0; }
	.news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap: 1rem; }
	.news-card-bar { height: 4px; }
	.news-card-bar-0 { background: linear-gradient(90deg, var(--orange-500), var(--orange-400)); }
	.news-card-bar-1 { background: linear-gradient(90deg, var(--green-600), #34d399); }
	.news-card-bar-2 { background: linear-gradient(90deg, #6366f1, #8b5cf6); }
	.news-card-body  { padding: 1.1rem; }
	.news-card-title { margin: 0.5rem 0 0.4rem; font-size: 0.95rem; font-weight: 700; color: var(--ink); line-height: 1.4; }
	.news-card-desc  { margin: 0; font-size: 0.83rem; color: var(--muted); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
	.news-card-read  { margin: 0.75rem 0 0; font-size: 0.8rem; font-weight: 700; color: var(--orange-600); }

	.cta-title { margin: 0 0 0.75rem; font-size: clamp(1.5rem,3vw,2rem); font-weight: 800; letter-spacing: -0.02em; }
	.cta-desc  { margin: 0 auto 1.5rem; color: rgba(255,255,255,0.7); max-width: 32rem; font-size: 0.95rem; }

	@media (min-width: 900px) {
		.hero-grid { grid-template-columns: 1.05fr 0.95fr; }
		.hero-visual { min-height: 420px; }
	}
</style>
