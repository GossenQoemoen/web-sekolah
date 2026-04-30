<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';

	let form = $state({
		nama: '', npsn: '', bentuk_pendidikan: '', kepala_sekolah: '',
		email_kepsek: '', telepon_kepsek: '', sumber_listrik: '', daya_listrik: '',
		internet_jenis: '', internet_kecepatan: '', internet_operator: '',
		total_siswa: 0, jumlah_rombel: 0, jumlah_kelas: 0,
		alamat: '', koordinat: '', akreditasi: '', visi: '', misi: ''
	});
	let profilId = $state<number | null>(null);
	let loading = $state(false);
	let msg = $state('');

	onMount(async () => {
		const { data } = await supabase.from('profil').select('*').single();
		if (data) {
			profilId = data.id;
			form = { ...form, ...data };
		}
	});

	async function simpan(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		if (profilId) {
			await supabase.from('profil').update(form).eq('id', profilId);
		} else {
			await supabase.from('profil').insert(form);
		}
		msg = 'Profil berhasil disimpan.';
		loading = false;
		setTimeout(() => msg = '', 3000);
	}
</script>

<div class="page-head">
	<h1 class="page-title">Edit Profil Sekolah</h1>
</div>

{#if msg}
	<div class="success-msg">{msg}</div>
{/if}

<form onsubmit={simpan} class="form-wrap">
	{#each [
		['Identitas', [
			['nama','Nama Sekolah','text'],
			['npsn','NPSN','text'],
			['bentuk_pendidikan','Bentuk Pendidikan','text'],
			['akreditasi','Akreditasi','text'],
		]],
		['Kepala Sekolah', [
			['kepala_sekolah','Nama Kepala Sekolah','text'],
			['email_kepsek','Email','email'],
			['telepon_kepsek','Telepon/WA','text'],
		]],
		['Infrastruktur', [
			['sumber_listrik','Sumber Listrik','text'],
			['daya_listrik','Daya Listrik','text'],
			['internet_jenis','Jenis Internet','text'],
			['internet_kecepatan','Kecepatan Internet','text'],
			['internet_operator','Operator Internet','text'],
		]],
		['Data Siswa', [
			['total_siswa','Total Peserta Didik','number'],
			['jumlah_rombel','Jumlah Rombel','number'],
			['jumlah_kelas','Jumlah Kelas','number'],
		]],
		['Lokasi', [
			['alamat','Alamat Lengkap','text'],
			['koordinat','Koordinat','text'],
		]],
	] as [section, fields]}
		<div class="card">
			<h2 class="card-title">{section}</h2>
			<div class="fields-grid">
				{#each fields as [key, label, type]}
					<div class="field">
						<label class="field-label" for={key}>{label}</label>
						<input id={key} {type} bind:value={form[key as keyof typeof form]} class="cek-input" />
					</div>
				{/each}
			</div>
		</div>
	{/each}

	<div class="card">
		<h2 class="card-title">Visi & Misi</h2>
		<div class="field">
			<label class="field-label" for="visi">Visi</label>
			<textarea id="visi" rows="3" bind:value={form.visi} class="cek-input"></textarea>
		</div>
		<div class="field" style="margin-top:1rem">
			<label class="field-label" for="misi">Misi</label>
			<textarea id="misi" rows="5" bind:value={form.misi} class="cek-input"></textarea>
		</div>
	</div>

	<button type="submit" class="btn btn-primary" disabled={loading}>
		{loading ? 'Menyimpan...' : 'Simpan Profil'}
	</button>
</form>

<style>
	.page-head { margin-bottom: 1.5rem; }
	.page-title { margin: 0; font-size: 1.5rem; font-weight: 800; color: var(--ink); }
	.form-wrap { display: flex; flex-direction: column; gap: 1.25rem; }
	.card { background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 8px -2px rgba(15,23,42,0.08); }
	.card-title { margin: 0 0 1.25rem; font-size: 1rem; font-weight: 800; color: var(--green-900); }
	.fields-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); gap: 1rem; }
	.field { display: grid; gap: 0.4rem; }
	.field-label { font-size: 0.85rem; font-weight: 700; color: var(--green-900); }
	textarea { resize: vertical; }
	.success-msg { background: rgba(22,163,74,0.08); border: 1px solid rgba(22,163,74,0.25); color: var(--green-700); border-radius: 0.75rem; padding: 0.75rem 1rem; font-size: 0.88rem; margin-bottom: 1.25rem; }
</style>
