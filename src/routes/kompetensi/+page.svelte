<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	const icons = ['⚙️','🔧','🔩','📊','💰','🎨'];
	const colors = ['var(--orange-500)', 'var(--green-600)', '#6366f1', '#0ea5e9', '#f59e0b', '#ec4899'];
</script>

<svelte:head>
	<title>Kompetensi Keahlian — SMKN 2 Tebo</title>
</svelte:head>

<div class="wrap page-header">
	<div class="pill-row">
		<span class="pill">🎓 Program Keahlian</span>
	</div>
	<h1 class="gradient-heading page-title">Kompetensi Keahlian</h1>
	<p class="page-lead">Program keahlian unggulan SMKN 2 Tebo yang dirancang untuk mencetak lulusan siap kerja sesuai standar industri.</p>
</div>

<div class="wrap page-body">
	<div class="komp-grid">
		{#each data.program as p, i}
			<div class="komp-card" style="--accent: {colors[i % colors.length]}">
				<div class="komp-icon">{icons[i % icons.length]}</div>
				<h2 class="komp-nama">{p.nama}</h2>
				<p class="komp-siswa">👥 {p.jumlah_siswa} siswa aktif</p>
			</div>
		{/each}
	</div>
</div>

<style>
	.page-header { padding: clamp(2rem,5vw,4rem) 0 2rem; }
	.pill-row { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
	.page-title { font-size: clamp(2rem,4vw,2.75rem); margin-bottom: 0.75rem; }
	.page-lead { font-size: 1.05rem; color: var(--muted); max-width: 40rem; margin: 0; line-height: 1.7; }
	.page-body { padding-bottom: 5rem; }
	.komp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap: 1.25rem; margin-top: 2rem; }
	.komp-card {
		padding: 1.75rem 1.5rem;
		border-radius: 1rem;
		background: white;
		border: 1px solid rgba(15,23,42,0.07);
		border-top: 4px solid var(--accent);
		box-shadow: 0 1px 8px -2px rgba(15,23,42,0.07);
		transition: transform 0.15s, box-shadow 0.15s;
	}
	.komp-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px -6px rgba(15,23,42,0.12); }
	.komp-icon { font-size: 2rem; margin-bottom: 1rem; }
	.komp-nama { margin: 0 0 0.6rem; font-size: 1rem; font-weight: 800; color: var(--ink); line-height: 1.4; }
	.komp-siswa { margin: 0; font-size: 0.82rem; color: var(--muted); font-weight: 500; }
</style>
