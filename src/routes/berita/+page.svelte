<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Berita — SMKN 2 Tebo</title>
</svelte:head>

<div class="wrap page-header">
	<p class="eyebrow">📰 Informasi Terkini</p>
	<h1 class="gradient-heading page-title">Berita & Pengumuman</h1>
</div>

<div class="wrap berita-body">
	{#if data.berita.length === 0}
		<div class="section-card empty-state">
			<p class="empty-icon">📭</p>
			<p class="empty-title">Belum ada berita tersedia.</p>
			<p class="empty-sub">Silakan cek kembali nanti.</p>
		</div>
	{:else}
		<div class="berita-list">
			{#each data.berita as item, i}
				<a href="/berita/{item.id}" class="news-card">
					{#if item.foto_url}
						<img src={item.foto_url} alt={item.judul} class="news-thumb" />
					{:else}
						<div class="num-badge">{i + 1}</div>
					{/if}
					<div class="news-content">
						<div class="news-pills">
							<span class="pill pill-sm">📅 {new Date(item.created_at).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })}</span>
							<span class="pill-orange pill-sm">Berita</span>
						</div>
						<h2 class="news-title">{item.judul}</h2>
						<p class="news-desc">{item.ringkasan}</p>
					</div>
					<span aria-hidden="true" class="news-arrow">→</span>
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.page-title  { font-size: clamp(2rem,5vw,3rem); }
	.berita-body { padding-top: 2rem; padding-bottom: 5rem; }
	.berita-list { display: flex; flex-direction: column; gap: 1rem; }

	.empty-state { text-align: center; padding: 4rem 2rem; }
	.empty-icon  { font-size: 3rem; margin: 0 0 0.75rem; }
	.empty-title { font-weight: 700; color: var(--ink); margin: 0 0 0.25rem; }
	.empty-sub   { color: var(--muted); font-size: 0.9rem; margin: 0; }

	.news-content { flex: 1; min-width: 0; }
	.news-pills   { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.5rem; }
	.news-title   { margin: 0 0 0.35rem; font-size: 1rem; font-weight: 800; color: var(--ink); line-height: 1.4; }
	.news-desc    { margin: 0; font-size: 0.88rem; color: var(--muted); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
	.news-arrow   { flex-shrink: 0; font-size: 1.25rem; color: var(--orange-400); align-self: center; }
	.news-thumb   { width: 72px; height: 56px; object-fit: cover; border-radius: 0.65rem; flex-shrink: 0; }
</style>
