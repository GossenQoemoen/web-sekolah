<script lang="ts">
	let nama  = $state('');
	let email = $state('');
	let pesan = $state('');
	let status = $state<'idle' | 'success'>('idle');

	async function kirim(e: SubmitEvent) {
		e.preventDefault();
		status = 'success';
		nama = ''; email = ''; pesan = '';
	}
</script>

<svelte:head>
	<title>Kontak — SMKN 2 Tebo</title>
</svelte:head>

<div class="wrap page-header">
	<p class="eyebrow">💬 Hubungi Kami</p>
	<h1 class="gradient-heading page-title">Kontak</h1>
</div>

<div class="wrap kontak-body">
	<div class="kontak-grid">
		<!-- Info -->
		<div class="kontak-info">
			<p class="kontak-lead">
				Jangan ragu untuk menghubungi kami. Tim kami akan merespons dalam <strong>1×24 jam kerja</strong>.
			</p>

			<div class="info-card info-card-orange">
				<span class="info-icon">📍</span>
				<div>
					<p class="info-label">Alamat</p>
					<p class="info-val">Jl. Pendidikan No. 1, Tebo, Jambi</p>
				</div>
			</div>
			<div class="info-card info-card-green">
				<span class="info-icon">✉️</span>
				<div>
					<p class="info-label">Email</p>
					<p class="info-val">info@smkn2tebo.sch.id</p>
				</div>
			</div>
			<div class="info-card info-card-indigo">
				<span class="info-icon">📞</span>
				<div>
					<p class="info-label">Telepon</p>
					<p class="info-val">(0744) 000-0000</p>
				</div>
			</div>
			<div class="info-card info-card-amber">
				<span class="info-icon">🕐</span>
				<div>
					<p class="info-label">Jam Operasional</p>
					<p class="info-val">Senin – Jumat, 07.00 – 15.00 WIB</p>
				</div>
			</div>
		</div>

		<!-- Form -->
		<div class="float-card">
			<h2 class="form-title">Kirim Pesan</h2>

			{#if status === 'success'}
				<div class="success-box">
					<p class="success-icon">✅</p>
					<p class="success-title">Pesan berhasil terkirim!</p>
					<p class="success-desc">Kami akan segera menghubungi Anda.</p>
					<button onclick={() => (status = 'idle')} class="btn btn-secondary btn-sm">
						Kirim Pesan Lain
					</button>
				</div>
			{:else}
				<form onsubmit={kirim} class="kontak-form">
					<div class="field">
						<label class="field-label" for="nama">Nama Lengkap</label>
						<input id="nama" type="text" bind:value={nama} required
							placeholder="Masukkan nama Anda" class="cek-input" />
					</div>
					<div class="field">
						<label class="field-label" for="email">Alamat Email</label>
						<input id="email" type="email" bind:value={email} required
							placeholder="nama@email.com" class="cek-input" />
					</div>
					<div class="field">
						<label class="field-label" for="pesan">Pesan</label>
						<textarea id="pesan" rows="5" bind:value={pesan} required
							placeholder="Tulis pesan Anda di sini..." class="cek-input textarea"></textarea>
					</div>
					<button type="submit" class="btn btn-primary btn-full">Kirim Pesan ✉️</button>
				</form>
				<p class="form-note">* Pesan Anda akan direspons dalam 1×24 jam kerja.</p>
			{/if}
		</div>
	</div>
</div>

<style>
	.page-title   { font-size: clamp(2rem,5vw,3rem); }
	.kontak-body  { padding-top: 2rem; padding-bottom: 5rem; }
	.kontak-grid  { display: grid; gap: 2rem; grid-template-columns: 1fr; }
	.kontak-info  { display: flex; flex-direction: column; gap: 1rem; }
	.kontak-lead  { margin: 0; color: var(--muted); font-size: 0.95rem; line-height: 1.7; }

	.info-icon  { font-size: 1.35rem; flex-shrink: 0; }
	.info-label { margin: 0; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); }
	.info-val   { margin: 0.2rem 0 0; font-size: 0.9rem; font-weight: 600; color: var(--ink); }

	.form-title { margin: 0 0 1.5rem; font-size: 1.15rem; font-weight: 800; color: var(--green-900); }
	.kontak-form { display: grid; gap: 1rem; }
	.field       { display: grid; gap: 0.45rem; }
	.field-label { font-size: 0.85rem; font-weight: 700; color: var(--green-900); }
	.textarea    { resize: none; }
	.btn-full    { width: 100%; margin-top: 0.25rem; }
	.form-note   { margin: 0.85rem 0 0; font-size: 0.82rem; color: var(--muted); }

	.success-icon  { font-size: 2.5rem; margin: 0 0 0.5rem; }
	.success-title { font-weight: 800; color: var(--green-900); margin: 0 0 0.25rem; }
	.success-desc  { color: var(--muted); font-size: 0.88rem; margin: 0 0 1rem; }

	@media (min-width: 900px) {
		.kontak-grid { grid-template-columns: 1fr 1fr; align-items: start; }
	}
</style>
