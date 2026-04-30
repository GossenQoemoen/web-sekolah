<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	const p = data.profil;
</script>

<svelte:head>
	<title>Profil — SMKN 2 Tebo</title>
</svelte:head>

<div class="wrap page-header">
	<p class="eyebrow">🏫 Tentang Kami</p>
	<h1 class="gradient-heading page-title">Profil Sekolah</h1>
</div>

<div class="wrap profil-body">
	<div class="profil-grid">
		<!-- Sidebar -->
		<div class="sidebar">
			<div class="float-card text-center">
				<div class="logo-wrap">
					<img src="/logo.png" alt="Logo SMKN 2 Tebo" class="logo-img" />
				</div>
				<h2 class="profil-name">{p?.nama ?? 'SMKN 2 Tebo'}</h2>
				<p class="profil-npsn">NPSN: {p?.npsn ?? '-'}</p>
				{#if p?.akreditasi}
					<span class="pill pill-akreditasi">✓ Akreditasi {p.akreditasi}</span>
				{/if}
			</div>

			<div class="float-card info-list">
				{#each [
					['🏫','Bentuk Pendidikan', p?.bentuk_pendidikan],
					['👤','Kepala Sekolah', p?.kepala_sekolah],
					['✉️','Email Kepsek', p?.email_kepsek],
					['📞','Telepon', p?.telepon_kepsek],
					['📍','Alamat', p?.alamat],
					['🗺️','Koordinat', p?.koordinat],
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

			<!-- Statistik -->
			<div class="section-card">
				<p class="eyebrow">📊 Data Sekolah</p>
				<div class="stats-grid">
					{#each [
						['👨‍🎓', p?.total_siswa ?? '-', 'Total Peserta Didik'],
						['🏫', p?.jumlah_kelas ?? '-', 'Ruang Kelas'],
						['📚', p?.jumlah_rombel ?? '-', 'Rombongan Belajar'],
					] as [icon, val, label]}
						<div class="stat-box">
							<span class="stat-icon">{icon}</span>
							<strong class="stat-val">{val}</strong>
							<span class="stat-label">{label}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Sambutan Kepala Sekolah -->
			{#if p?.sambutan}
				<div class="section-card">
					<p class="eyebrow">🎙️ Sambutan Kepala Sekolah</p>
					<div class="sambutan-wrap">
						<div class="sambutan-avatar">
							<div class="avatar-circle">{p.kepala_sekolah?.[0] ?? 'K'}</div>
							<div>
								<p class="sambutan-nama">{p.kepala_sekolah ?? 'Kepala Sekolah'}</p>
								<p class="sambutan-jabatan">Kepala Sekolah</p>
							</div>
						</div>
						<blockquote class="sambutan-text">"{p.sambutan}"</blockquote>
					</div>
				</div>
			{/if}

			<!-- Visi & Misi -->
			{#if p?.visi || p?.misi}
				<div class="section-card">
					<p class="eyebrow">🎯 Visi & Misi</p>
					{#if p?.visi}
						<p class="vm-label">Visi</p>
						<blockquote class="visi-quote">"{p.visi}"</blockquote>
					{/if}
					{#if p?.misi}
						<p class="vm-label" style="margin-top:1.25rem">Misi</p>
						<p class="misi-text">{p.misi}</p>
					{/if}
				</div>
			{/if}

			<!-- Program Keahlian -->
			{#if data.program.length > 0}
				<div class="section-card">
					<p class="eyebrow">🎓 Program Keahlian</p>
					<div class="program-list">
						{#each data.program as prg}
							<div class="program-row">
								<span class="program-nama">{prg.nama}</span>
								<span class="pill pill-orange">{prg.jumlah_siswa} siswa</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Infrastruktur -->
			<div class="section-card">
				<p class="eyebrow">⚡ Infrastruktur</p>
				<div class="infra-grid">
					<div class="info-card info-card-orange">
						<span class="info-icon">⚡</span>
						<div>
							<p class="info-label">Listrik</p>
							<p class="info-val">{p?.sumber_listrik ?? '-'} · {p?.daya_listrik ?? '-'}</p>
						</div>
					</div>
					<div class="info-card info-card-green">
						<span class="info-icon">🌐</span>
						<div>
							<p class="info-label">Internet</p>
							<p class="info-val">{p?.internet_jenis ?? '-'} · {p?.internet_kecepatan ?? '-'} · {p?.internet_operator ?? '-'}</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Guru & Staf -->
			{#if data.guru.length > 0}
				<div class="section-card">
					<p class="eyebrow">👨‍🏫 Guru & Staf</p>
					<div class="guru-grid">
						{#each data.guru as g}
							<div class="guru-card">
								<div class="guru-avatar">
									{#if g.foto_url}
										<img src={g.foto_url} alt={g.nama} class="guru-foto" />
									{:else}
										<span class="guru-initial">{g.nama[0]}</span>
									{/if}
								</div>
								<div class="guru-info">
									<p class="guru-nama">{g.nama}</p>
									{#if g.jabatan}<p class="guru-jabatan">{g.jabatan}</p>{/if}
									{#if g.mapel}<span class="pill pill-sm">{g.mapel}</span>{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

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

	.stats-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem; margin-top: 0.75rem; }
	.stat-box { text-align: center; padding: 1rem; background: linear-gradient(135deg, var(--orange-50), #f0fdf4); border-radius: 1rem; border: 1px solid rgba(15,23,42,0.06); }
	.stat-icon { font-size: 1.5rem; display: block; margin-bottom: 0.35rem; }
	.stat-val  { display: block; font-size: 1.4rem; font-weight: 800; color: var(--orange-600); }
	.stat-label { font-size: 0.72rem; color: var(--muted); font-weight: 600; }

	/* Sambutan */
	.sambutan-wrap { margin-top: 0.75rem; }
	.sambutan-avatar { display: flex; align-items: center; gap: 0.85rem; margin-bottom: 1rem; }
	.avatar-circle {
		width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0;
		background: linear-gradient(135deg, var(--orange-500), var(--green-600));
		display: flex; align-items: center; justify-content: center;
		color: white; font-weight: 800; font-size: 1.1rem;
	}
	.sambutan-nama { margin: 0; font-size: 0.9rem; font-weight: 800; color: var(--ink); }
	.sambutan-jabatan { margin: 0.1rem 0 0; font-size: 0.75rem; color: var(--muted); }
	.sambutan-text { margin: 0; padding: 1rem 1.25rem; border-left: 4px solid var(--orange-500); background: rgba(249,115,22,0.05); border-radius: 0 0.75rem 0.75rem 0; font-style: italic; color: var(--ink); line-height: 1.8; font-size: 0.95rem; }

	/* Visi Misi */
	.vm-label { margin: 0 0 0.5rem; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--green-700); }
	.misi-text { margin: 0; color: var(--muted); line-height: 1.8; white-space: pre-line; font-size: 0.95rem; }

	/* Program */
	.program-list { display: flex; flex-direction: column; gap: 0.6rem; margin-top: 0.75rem; }
	.program-row { display: flex; align-items: center; justify-content: space-between; padding: 0.65rem 0.85rem; background: rgba(249,115,22,0.04); border-radius: 0.75rem; border: 1px solid rgba(249,115,22,0.1); }
	.program-nama { font-size: 0.88rem; font-weight: 600; color: var(--ink); }

	/* Infrastruktur */
	.infra-grid { display: grid; gap: 0.75rem; margin-top: 0.75rem; }

	/* Guru */
	.guru-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px,1fr)); gap: 1rem; margin-top: 0.75rem; }
	.guru-card { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 1.25rem 1rem; background: #f8fafc; border-radius: 1rem; border: 1px solid rgba(15,23,42,0.06); }
	.guru-avatar { width: 64px; height: 64px; border-radius: 50%; overflow: hidden; margin-bottom: 0.75rem; background: linear-gradient(135deg, var(--orange-50), #f0fdf4); display: flex; align-items: center; justify-content: center; border: 2px solid rgba(249,115,22,0.2); }
	.guru-foto { width: 100%; height: 100%; object-fit: cover; }
	.guru-initial { font-size: 1.4rem; font-weight: 800; color: var(--orange-600); }
	.guru-info { width: 100%; }
	.guru-nama { margin: 0 0 0.2rem; font-size: 0.85rem; font-weight: 700; color: var(--ink); }
	.guru-jabatan { margin: 0 0 0.4rem; font-size: 0.75rem; color: var(--muted); }

	.cta-row-inline { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; text-align: left; }
	.cta-inline-title { margin: 0 0 0.25rem; font-weight: 800; font-size: 1rem; }
	.cta-inline-desc  { margin: 0; font-size: 0.85rem; color: rgba(255,255,255,0.65); }

	@media (min-width: 900px) {
		.profil-grid { grid-template-columns: 280px 1fr; }
		.infra-grid { grid-template-columns: 1fr 1fr; }
	}
</style>
