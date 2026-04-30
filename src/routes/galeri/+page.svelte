<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Galeri — SMKN 2 Tebo</title>
</svelte:head>

<div class="wrap page-header">
	<p class="eyebrow">📸 Dokumentasi</p>
	<h1 class="gradient-heading page-title">Galeri Foto</h1>
</div>

<div class="wrap galeri-body">
	{#if data.album.length === 0}
		<div class="section-card empty-state">
			<p class="empty-icon">📷</p>
			<p class="empty-title">Belum ada album tersedia.</p>
		</div>
	{:else}
		<div class="album-grid">
			{#each data.album as a}
				<a href="/galeri/{a.id}" class="album-card">
					<div class="album-cover">
						{#if a.galeri?.[0]?.foto_url}
							<img src={a.galeri[0].foto_url} alt={a.judul} class="cover-img" loading="lazy" />
						{:else}
							<div class="cover-placeholder">📷</div>
						{/if}
						<span class="foto-count">{a.galeri?.length ?? 0} foto</span>
					</div>
					<div class="album-info">
						<p class="album-judul">{a.judul}</p>
						{#if a.keterangan}<p class="album-ket">{a.keterangan}</p>{/if}
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.page-title { font-size: clamp(2rem,5vw,3rem); }
	.galeri-body { padding-top: 2rem; padding-bottom: 5rem; }
	.empty-state { text-align: center; padding: 4rem 2rem; }
	.empty-icon  { font-size: 3rem; margin: 0 0 0.5rem; }
	.empty-title { font-weight: 700; color: var(--ink); margin: 0; }

	.album-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap: 1.25rem; }
	.album-card { text-decoration: none; border-radius: 1rem; overflow: hidden; background: white; box-shadow: 0 4px 14px -6px rgba(15,23,42,0.12); border: 1px solid rgba(15,23,42,0.06); transition: transform 0.2s, box-shadow 0.2s; display: block; }
	.album-card:hover { transform: translateY(-3px); box-shadow: 0 12px 28px -8px rgba(234,88,12,0.2); }

	.album-cover { position: relative; height: 180px; background: #f1f5f9; }
	.cover-img { width: 100%; height: 100%; object-fit: cover; display: block; }
	.cover-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 3rem; }
	.foto-count { position: absolute; bottom: 0.6rem; right: 0.6rem; background: rgba(15,23,42,0.65); color: white; font-size: 0.72rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 999px; }

	.album-info { padding: 0.85rem 1rem; }
	.album-judul { margin: 0; font-size: 0.92rem; font-weight: 700; color: var(--ink); }
	.album-ket   { margin: 0.25rem 0 0; font-size: 0.78rem; color: var(--muted); line-height: 1.5; }
</style>
