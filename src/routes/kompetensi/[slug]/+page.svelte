<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	const icons: Record<string, string> = {
		'teknik-mesin': '⚙️',
		'teknik-otomotif': '🔧',
		'teknik-pengelasan': '🔩',
		'manajemen-perkantoran': '📊',
		'akuntansi-keuangan': '💰',
		'desain-komunikasi-visual': '🎨'
	};
	const icon = icons[data.program.slug] ?? '🎓';
</script>

<svelte:head>
	<title>{data.program.nama} — SMKN 2 Tebo</title>
</svelte:head>

<!-- Header -->
<div class="wrap page-header">
	<a href="/kompetensi" class="back-link">← Semua Kompetensi</a>
	<div class="pill-row">
		<span class="pill">🎓 Kompetensi Keahlian</span>
	</div>
	<div class="prog-hero">
		<div class="prog-icon">{icon}</div>
		<div>
			<h1 class="gradient-heading page-title">{data.program.nama}</h1>
			<p class="page-lead">{data.program.deskripsi ?? ''}</p>
			<span class="siswa-badge">👥 {data.program.jumlah_siswa} siswa aktif</span>
		</div>
	</div>
</div>

<div class="wrap page-body">

	<!-- Berita terkait -->
	<div class="section-block">
		<div class="section-header">
			<h2 class="section-title">📰 Berita Terkait</h2>
			<a href="/berita" class="btn btn-secondary btn-sm">Semua Berita →</a>
		</div>
		{#if data.berita.length === 0}
			<p class="empty">Belum ada berita untuk kompetensi ini.</p>
		{:else}
			<div class="news-grid">
				{#each data.berita as b, i}
					<a href="/berita/{b.id}" class="news-card">
						{#if b.foto_url}
							<img src={b.foto_url} alt={b.judul} class="news-thumb" />
						{:else}
							<div class="news-thumb-placeholder news-bar-{i % 3}"></div>
						{/if}
						<div class="news-body">
							<span class="news-date">{new Date(b.created_at).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}</span>
							<h3 class="news-judul">{b.judul}</h3>
							<p class="news-ring">{b.ringkasan}</p>
							<span class="news-read">Baca →</span>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Galeri terkait -->
	<div class="section-block">
		<div class="section-header">
			<h2 class="section-title">📸 Galeri Kegiatan</h2>
			<a href="/galeri" class="btn btn-secondary btn-sm">Semua Galeri →</a>
		</div>
		{#if data.galeri.length === 0}
			<p class="empty">Belum ada galeri untuk kompetensi ini.</p>
		{:else}
			<div class="galeri-grid">
				{#each data.galeri as g}
					<a href="/galeri/{g.id}" class="galeri-card">
						<div class="galeri-icon">🖼️</div>
						<div>
							<p class="galeri-judul">{g.judul}</p>
							<p class="galeri-tgl">{new Date(g.created_at).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}</p>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>

</div>

<style>
	.page-header { padding: clamp(2rem,5vw,4rem) 0 2rem; }
	.back-link { font-size: 0.85rem; font-weight: 600; color: var(--orange-600); text-decoration: none; display: inline-block; margin-bottom: 1rem; }
	.back-link:hover { text-decoration: underline; }
	.pill-row { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
	.prog-hero { display: flex; align-items: flex-start; gap: 1.5rem; flex-wrap: wrap; }
	.prog-icon { font-size: 3rem; flex-shrink: 0; }
	.page-title { font-size: clamp(1.75rem,4vw,2.5rem); margin-bottom: 0.75rem; }
	.page-lead { font-size: 1rem; color: var(--muted); max-width: 42rem; margin: 0 0 1rem; line-height: 1.7; }
	.siswa-badge { font-size: 0.82rem; font-weight: 600; color: var(--green-700); background: rgba(22,163,74,0.08); border: 1px solid rgba(22,163,74,0.2); padding: 0.3rem 0.85rem; border-radius: 999px; }

	.page-body { padding-bottom: 5rem; display: flex; flex-direction: column; gap: 3rem; }
	.section-block { background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 8px -2px rgba(15,23,42,0.07); }
	.section-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem; }
	.section-title { margin: 0; font-size: 1.05rem; font-weight: 800; color: var(--green-900); }
	.empty { color: var(--muted); font-size: 0.88rem; margin: 0; }

	.news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); gap: 1rem; }
	.news-card { text-decoration: none; border-radius: 0.85rem; overflow: hidden; border: 1px solid rgba(15,23,42,0.07); background: #f8fafc; transition: transform 0.15s; }
	.news-card:hover { transform: translateY(-2px); }
	.news-thumb { width: 100%; height: 120px; object-fit: cover; display: block; }
	.news-thumb-placeholder { height: 6px; }
	.news-bar-0 { background: linear-gradient(90deg, var(--orange-500), var(--orange-400)); }
	.news-bar-1 { background: linear-gradient(90deg, var(--green-600), #34d399); }
	.news-bar-2 { background: linear-gradient(90deg, #6366f1, #8b5cf6); }
	.news-body { padding: 0.9rem; }
	.news-date { font-size: 0.72rem; color: var(--muted); }
	.news-judul { margin: 0.3rem 0 0.35rem; font-size: 0.88rem; font-weight: 700; color: var(--ink); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
	.news-ring { margin: 0; font-size: 0.78rem; color: var(--muted); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
	.news-read { display: inline-block; margin-top: 0.5rem; font-size: 0.75rem; font-weight: 700; color: var(--orange-600); }

	.galeri-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px,1fr)); gap: 0.75rem; }
	.galeri-card { display: flex; align-items: center; gap: 0.85rem; padding: 0.85rem 1rem; background: #f8fafc; border-radius: 0.75rem; border: 1px solid rgba(15,23,42,0.06); text-decoration: none; transition: background 0.15s; }
	.galeri-card:hover { background: rgba(249,115,22,0.05); }
	.galeri-icon { font-size: 1.5rem; flex-shrink: 0; }
	.galeri-judul { margin: 0 0 0.2rem; font-size: 0.85rem; font-weight: 700; color: var(--ink); }
	.galeri-tgl { margin: 0; font-size: 0.72rem; color: var(--muted); }
</style>
