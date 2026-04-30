<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	let aktif = $state<{ foto_url: string; judul: string; keterangan: string } | null>(null);
	let aktifIdx = $state(0);

	function buka(i: number) {
		aktifIdx = i;
		aktif = data.foto[i];
	}
	function prev() { if (aktifIdx > 0) { aktifIdx--; aktif = data.foto[aktifIdx]; } }
	function next() { if (aktifIdx < data.foto.length - 1) { aktifIdx++; aktif = data.foto[aktifIdx]; } }
</script>

<svelte:head>
	<title>{data.album.judul} — Galeri SMKN 2 Tebo</title>
</svelte:head>

<div class="wrap page-header">
	<a href="/galeri" class="back-link">← Kembali ke Galeri</a>
	<p class="eyebrow">📸 Album</p>
	<h1 class="gradient-heading page-title">{data.album.judul}</h1>
	{#if data.album.keterangan}<p class="album-ket">{data.album.keterangan}</p>{/if}
</div>

<div class="wrap galeri-body">
	{#if data.foto.length === 0}
		<div class="section-card empty-state">
			<p class="empty-icon">📷</p>
			<p class="empty-title">Belum ada foto di album ini.</p>
		</div>
	{:else}
		<div class="foto-grid">
			{#each data.foto as f, i}
				<button class="foto-item" onclick={() => buka(i)} type="button">
					<img src={f.foto_url} alt={f.judul} class="foto-img" loading="lazy" />
					<div class="foto-caption">
						<p class="foto-judul">{f.judul}</p>
						{#if f.keterangan}<p class="foto-ket">{f.keterangan}</p>{/if}
					</div>
				</button>
			{/each}
		</div>
	{/if}
</div>

{#if aktif}
	<div class="lightbox" onclick={() => aktif = null} role="dialog" aria-modal="true" tabindex="-1" onkeydown={(e) => e.key === 'Escape' && (aktif = null)}>
		<div class="lightbox-inner" onclick={(e) => e.stopPropagation()} role="document">
			<button class="lb-close" onclick={() => aktif = null}>✕</button>
			<img src={aktif.foto_url} alt={aktif.judul} class="lb-img" />
			<div class="lb-info">
				<p class="lb-judul">{aktif.judul}</p>
				{#if aktif.keterangan}<p class="lb-ket">{aktif.keterangan}</p>{/if}
				<div class="lb-nav">
					<button onclick={prev} disabled={aktifIdx === 0} class="lb-btn">← Prev</button>
					<span class="lb-count">{aktifIdx + 1} / {data.foto.length}</span>
					<button onclick={next} disabled={aktifIdx === data.foto.length - 1} class="lb-btn">Next →</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.back-link { font-size: 0.85rem; font-weight: 600; color: var(--orange-600); text-decoration: none; display: inline-block; margin-bottom: 1rem; }
	.back-link:hover { text-decoration: underline; }
	.page-title { font-size: clamp(1.75rem,4vw,2.75rem); }
	.album-ket { margin: 0.75rem 0 0; color: var(--muted); font-size: 0.95rem; }
	.galeri-body { padding-top: 2rem; padding-bottom: 5rem; }
	.empty-state { text-align: center; padding: 4rem 2rem; }
	.empty-icon  { font-size: 3rem; margin: 0 0 0.5rem; }
	.empty-title { font-weight: 700; color: var(--ink); margin: 0; }

	.foto-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px,1fr)); gap: 1rem; }
	.foto-item { border: none; padding: 0; cursor: pointer; border-radius: 1rem; overflow: hidden; background: white; box-shadow: 0 4px 14px -6px rgba(15,23,42,0.1); transition: transform 0.2s, box-shadow 0.2s; text-align: left; }
	.foto-item:hover { transform: translateY(-3px); box-shadow: 0 12px 28px -8px rgba(234,88,12,0.2); }
	.foto-img { width: 100%; height: 200px; object-fit: cover; display: block; }
	.foto-caption { padding: 0.75rem 1rem; }
	.foto-judul { margin: 0; font-size: 0.88rem; font-weight: 700; color: var(--ink); }
	.foto-ket   { margin: 0.25rem 0 0; font-size: 0.75rem; color: var(--muted); }

	.lightbox { position: fixed; inset: 0; z-index: 100; background: rgba(15,23,42,0.88); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
	.lightbox-inner { position: relative; background: white; border-radius: 1.25rem; overflow: hidden; max-width: 800px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.4); }
	.lb-close { position: absolute; top: 0.75rem; right: 0.75rem; z-index: 10; width: 32px; height: 32px; border-radius: 50%; border: none; background: rgba(15,23,42,0.6); color: white; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; }
	.lb-img { width: 100%; max-height: 65vh; object-fit: contain; display: block; background: #f8fafc; }
	.lb-info { padding: 1rem 1.25rem; }
	.lb-judul { margin: 0; font-size: 1rem; font-weight: 800; color: var(--ink); }
	.lb-ket   { margin: 0.25rem 0 0; font-size: 0.85rem; color: var(--muted); }
	.lb-nav { display: flex; align-items: center; gap: 1rem; margin-top: 0.75rem; }
	.lb-btn { padding: 0.4rem 0.85rem; border-radius: 0.6rem; border: 1px solid rgba(15,23,42,0.12); background: #f8fafc; font-size: 0.82rem; font-weight: 600; cursor: pointer; color: var(--ink); }
	.lb-btn:disabled { opacity: 0.35; cursor: not-allowed; }
	.lb-count { font-size: 0.82rem; color: var(--muted); }
</style>
