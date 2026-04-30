<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	const b = data.berita;
	const tanggal = new Date(b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
</script>

<svelte:head>
	<title>{b.judul} — SMKN 2 Tebo</title>
</svelte:head>

<div class="wrap page-header">
	<a href="/berita" class="back-link">← Kembali ke Berita</a>
	<div class="meta-row">
		<span class="pill">📅 {tanggal}</span>
		<span class="pill-orange">Berita</span>
	</div>
	<h1 class="gradient-heading detail-title">{b.judul}</h1>
	{#if b.ringkasan}
		<p class="detail-lead">{b.ringkasan}</p>
	{/if}
</div>

<div class="wrap detail-body">
	<div class="section-card">
		{#if b.isi}
			<div class="isi-konten">{b.isi}</div>
		{:else}
			<p class="text-muted">Konten berita belum tersedia.</p>
		{/if}
	</div>

	<div class="cta-dark cta-row-inline">
		<div>
			<p class="cta-inline-title">Ada pertanyaan?</p>
			<p class="cta-inline-desc">Hubungi kami untuk informasi lebih lanjut.</p>
		</div>
		<a href="/kontak" class="btn btn-primary btn-sm">Kontak Kami →</a>
	</div>
</div>

<style>
	.back-link { font-size: 0.85rem; font-weight: 600; color: var(--orange-600); text-decoration: none; display: inline-block; margin-bottom: 1rem; }
	.back-link:hover { text-decoration: underline; }
	.meta-row { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
	.detail-title { font-size: clamp(1.75rem,4vw,2.75rem); }
	.detail-lead { margin: 1rem 0 0; font-size: 1.05rem; color: var(--muted); line-height: 1.7; max-width: 48rem; }

	.detail-body { padding-top: 2rem; padding-bottom: 5rem; display: flex; flex-direction: column; gap: 1.5rem; }
	.isi-konten { font-size: 0.97rem; line-height: 1.9; color: var(--ink); white-space: pre-line; }

	.cta-row-inline { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; text-align: left; }
	.cta-inline-title { margin: 0 0 0.25rem; font-weight: 800; font-size: 1rem; }
	.cta-inline-desc  { margin: 0; font-size: 0.85rem; color: rgba(255,255,255,0.65); }
</style>
