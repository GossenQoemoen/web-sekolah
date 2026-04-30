<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	let aktif = $state<{ foto_url: string; judul: string; keterangan: string } | null>(null);
</script>

<svelte:head>
	<title>Galeri — SMKN 2 Tebo</title>
</svelte:head>

<div class="wrap page-header">
	<p class="eyebrow">📸 Dokumentasi</p>
	<h1 class="gradient-heading page-title">Galeri Foto</h1>
</div>

<div class="wrap galeri-body">
	{#if data.galeri.length === 0}
		<div class="section-card empty-state">
			<p class="empty-icon">📷</p>
			<p class="empty-title">Belum ada foto tersedia.</p>
		</div>
	{:else}
		<div class="galeri-grid">
			{#each data.galeri as g}
				<button class="galeri-item" onclick={() => aktif = g} type="button">
					<img src={g.foto_url} alt={g.judul} class="galeri-img" loading="lazy" />
					<div class="galeri-caption">
						<p class="galeri-judul">{g.judul}</p>
						{#if g.keterangan}<p class="galeri-ket">{g.keterangan}</p>{/if}
					</div>
				</button>
			{/each}
		</div>
	{/if}
</div>

<!-- Lightbox -->
{#if aktif}
	<div class="lightbox" onclick={() => aktif = null} role="dialog" aria-modal="true">
		<div class="lightbox-inner" onclick={(e) => e.stopPropagation()}>
			<button class="lb-close" onclick={() => aktif = null}>✕</button>
			<img src={aktif.foto_url} alt={aktif.judul} class="lb-img" />
			<div class="lb-info">
				<p class="lb-judul">{aktif.judul}</p>
				{#if aktif.keterangan}<p class="lb-ket">{aktif.keterangan}</p>{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.page-title { font-size: clamp(2rem,5vw,3rem); }
	.galeri-body { padding-top: 2rem; padding-bottom: 5rem; }

	.empty-state { text-align: center; padding: 4rem 2rem; }
	.empty-icon  { font-size: 3rem; margin: 0 0 0.5rem; }
	.empty-title { font-weight: 700; color: var(--ink); margin: 0; }

	.galeri-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap: 1rem; }

	.galeri-item {
		position: relative; border: none; padding: 0; cursor: pointer;
		border-radius: 1rem; overflow: hidden;
		box-shadow: 0 4px 14px -6px rgba(15,23,42,0.12);
		transition: transform 0.2s, box-shadow 0.2s;
		background: white;
		text-align: left;
	}
	.galeri-item:hover { transform: translateY(-3px); box-shadow: 0 12px 28px -8px rgba(234,88,12,0.2); }
	.galeri-img { width: 100%; height: 200px; object-fit: cover; display: block; }
	.galeri-caption { padding: 0.85rem 1rem; }
	.galeri-judul { margin: 0; font-size: 0.88rem; font-weight: 700; color: var(--ink); line-height: 1.4; }
	.galeri-ket   { margin: 0.3rem 0 0; font-size: 0.75rem; color: var(--muted); line-height: 1.5; }

	/* Lightbox */
	.lightbox {
		position: fixed; inset: 0; z-index: 100;
		background: rgba(15,23,42,0.85); backdrop-filter: blur(6px);
		display: flex; align-items: center; justify-content: center; padding: 1.5rem;
	}
	.lightbox-inner {
		position: relative; background: white; border-radius: 1.25rem;
		overflow: hidden; max-width: 800px; width: 100%;
		box-shadow: 0 25px 50px -12px rgba(0,0,0,0.4);
	}
	.lb-close {
		position: absolute; top: 0.75rem; right: 0.75rem; z-index: 10;
		width: 32px; height: 32px; border-radius: 50%; border: none;
		background: rgba(15,23,42,0.6); color: white; cursor: pointer;
		font-size: 0.85rem; display: flex; align-items: center; justify-content: center;
	}
	.lb-img { width: 100%; max-height: 70vh; object-fit: contain; display: block; background: #f8fafc; }
	.lb-info { padding: 1rem 1.25rem; }
	.lb-judul { margin: 0; font-size: 1rem; font-weight: 800; color: var(--ink); }
	.lb-ket   { margin: 0.25rem 0 0; font-size: 0.85rem; color: var(--muted); }
</style>
