<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';

	type Berita = { id: number; judul: string; ringkasan: string; unit: string; created_at: string; profiles: { nama: string } | null };

	let list = $state<Berita[]>([]);
	let msg = $state('');

	async function load() {
		const { data, error } = await supabase
			.from('berita')
			.select('id, judul, ringkasan, unit, created_at, profiles(nama)')
			.eq('status', 'draft')
			.order('created_at', { ascending: false });
		if (error) msg = 'Error: ' + error.message;
		list = (data ?? []) as Berita[];
	}

	onMount(load);

	async function publish(id: number) {
		const { error } = await supabase.from('berita').update({ status: 'published' }).eq('id', id);
		if (error) msg = 'Error: ' + error.message;
		else await load();
	}

	async function hapus(id: number) {
		if (!confirm('Hapus berita ini?')) return;
		await supabase.from('berita').delete().eq('id', id);
		await load();
	}
</script>

<div class="page-head">
	<h1 class="page-title">📋 Draft Berita</h1>
	<p class="page-sub">Berita yang menunggu persetujuan untuk dipublikasikan.</p>
</div>

{#if msg}
	<div class="msg-box {msg.startsWith('Error') ? 'error' : 'success'}">{msg}</div>
{/if}

<div class="card">
	{#if list.length === 0}
		<p class="empty">Tidak ada draft berita.</p>
	{:else}
		<div class="list">
			{#each list as b}
				<div class="row">
					<div class="info">
						<p class="judul">{b.judul}</p>
						<div class="meta">
							{#if b.profiles?.nama}<span class="author">👤 {b.profiles.nama}</span>{/if}
							{#if b.unit}<span class="unit-tag">{b.unit}</span>{/if}
							<span class="tgl">{new Date(b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
						</div>
						{#if b.ringkasan}<p class="ringkasan">{b.ringkasan}</p>{/if}
					</div>
					<div class="actions">
						<button onclick={() => publish(b.id)} class="btn-publish">✓ Publish</button>
						<button onclick={() => hapus(b.id)} class="btn-hapus">Hapus</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.page-head { margin-bottom: 1.5rem; }
	.page-title { margin: 0; font-size: 1.5rem; font-weight: 800; color: var(--ink); }
	.page-sub { margin: 0.35rem 0 0; font-size: 0.85rem; color: var(--muted); }
	.card { background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 8px -2px rgba(15,23,42,0.08); }
	.list { display: flex; flex-direction: column; gap: 0.5rem; }
	.row { display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1rem; background: #f8fafc; border-radius: 0.75rem; border: 1px solid rgba(15,23,42,0.06); }
	.info { flex: 1; min-width: 0; }
	.judul { margin: 0 0 0.3rem; font-size: 0.9rem; font-weight: 700; color: var(--ink); }
	.ringkasan { margin: 0.3rem 0 0; font-size: 0.8rem; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
	.meta { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
	.author { font-size: 0.75rem; color: var(--muted); }
	.unit-tag { font-size: 0.72rem; font-weight: 600; color: #6366f1; background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.2); padding: 0.2rem 0.55rem; border-radius: 999px; }
	.tgl { font-size: 0.72rem; color: var(--muted); }
	.actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
	.btn-publish { padding: 0.45rem 0.85rem; border-radius: 0.6rem; font-size: 0.82rem; font-weight: 600; color: var(--green-700); background: rgba(22,163,74,0.08); border: 1px solid rgba(22,163,74,0.2); cursor: pointer; }
	.btn-publish:hover { background: rgba(22,163,74,0.15); }
	.btn-hapus { padding: 0.45rem 0.85rem; border-radius: 0.6rem; font-size: 0.82rem; font-weight: 600; color: #dc2626; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); cursor: pointer; }
	.btn-hapus:hover { background: rgba(239,68,68,0.15); }
	.msg-box { border-radius: 0.75rem; padding: 0.75rem 1rem; font-size: 0.88rem; margin-bottom: 1.25rem; }
	.success { background: rgba(22,163,74,0.08); border: 1px solid rgba(22,163,74,0.25); color: var(--green-700); }
	.error { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); color: #dc2626; }
	.empty { color: var(--muted); font-size: 0.9rem; margin: 0; }
</style>
