<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let email = $state('');
	let password = $state('');
	let errorMsg = $state('');
	let loading = $state(false);

	onMount(async () => {
		const { data: { session } } = await supabase.auth.getSession();
		if (session) goto('/admin');
	});

	async function login(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		errorMsg = '';
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			errorMsg = 'Email atau password salah.';
			loading = false;
		} else {
			goto('/admin');
		}
	}
</script>

<svelte:head><title>Login — SMKN 2 Tebo</title></svelte:head>

<div class="login-page">
	<div class="login-card">
		<div class="login-brand">
			<div class="login-logo">S</div>
			<div>
				<strong class="brand-name">SMKN 2 Tebo</strong>
				<span class="brand-sub">Admin Panel</span>
			</div>
		</div>

		<h1 class="login-title">Masuk</h1>
		<p class="login-desc">Masukkan email dan password untuk mengakses dashboard.</p>

		{#if errorMsg}
			<div class="error-box">{errorMsg}</div>
		{/if}

		<form onsubmit={login} class="login-form">
			<div class="field">
				<label class="field-label" for="email">Email</label>
				<input id="email" type="email" bind:value={email} required placeholder="admin@sekolah.com" class="login-input" />
			</div>
			<div class="field">
				<label class="field-label" for="password">Password</label>
				<input id="password" type="password" bind:value={password} required placeholder="••••••••" class="login-input" />
			</div>
			<button type="submit" class="login-btn" disabled={loading}>
				{loading ? 'Memproses...' : 'Masuk →'}
			</button>
		</form>

		<a href="/" class="back-home">← Kembali ke Beranda</a>
	</div>
</div>

<style>
	:global(body) { margin: 0; }

	.login-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		background: linear-gradient(165deg, #fff7ed 0%, #ecfdf5 45%, #ffffff 100%);
		font-family: "Plus Jakarta Sans", system-ui, sans-serif;
	}

	.login-card {
		width: 100%;
		max-width: 420px;
		background: white;
		border-radius: 1.25rem;
		padding: 2rem;
		box-shadow: 0 25px 50px -12px rgba(234,88,12,0.15), 0 0 0 1px rgba(15,23,42,0.06);
	}

	.login-brand { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem; }
	.login-logo {
		width: 44px; height: 44px; border-radius: 0.85rem; flex-shrink: 0;
		background: linear-gradient(135deg, #f97316, #16a34a);
		display: flex; align-items: center; justify-content: center;
		color: white; font-weight: 800; font-size: 1rem;
	}
	.brand-name { display: block; font-size: 0.95rem; font-weight: 800; color: #0f172a; }
	.brand-sub  { display: block; font-size: 0.72rem; color: #64748b; }

	.login-title { margin: 0 0 0.35rem; font-size: 1.6rem; font-weight: 800; color: #0f172a; }
	.login-desc  { margin: 0 0 1.5rem; font-size: 0.88rem; color: #64748b; }

	.login-form { display: flex; flex-direction: column; gap: 1rem; }
	.field { display: grid; gap: 0.4rem; }
	.field-label { font-size: 0.85rem; font-weight: 700; color: #14532d; }
	.login-input {
		width: 100%; box-sizing: border-box;
		border-radius: 0.9rem; border: 1px solid rgba(15,23,42,0.12);
		background: rgba(255,255,255,0.9); padding: 0.85rem 0.95rem;
		font-family: inherit; font-size: 0.95rem; color: #0f172a; outline: none;
		transition: box-shadow 0.15s, border-color 0.15s;
	}
	.login-input:focus {
		border-color: rgba(249,115,22,0.6);
		box-shadow: 0 0 0 4px rgba(249,115,22,0.18);
	}

	.login-btn {
		width: 100%; padding: 0.9rem;
		background: linear-gradient(135deg, #f97316, #ea580c);
		color: white; border: none; border-radius: 1rem;
		font-family: inherit; font-size: 0.95rem; font-weight: 700;
		cursor: pointer; margin-top: 0.25rem;
		box-shadow: 0 12px 28px -8px rgba(234,88,12,0.55);
		transition: transform 0.15s, box-shadow 0.15s;
	}
	.login-btn:hover { transform: translateY(-1px); box-shadow: 0 16px 36px -8px rgba(234,88,12,0.65); }
	.login-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

	.error-box {
		background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25);
		color: #dc2626; border-radius: 0.75rem; padding: 0.75rem 1rem;
		font-size: 0.88rem; margin-bottom: 0.5rem;
	}

	.back-home {
		display: block; text-align: center; margin-top: 1.5rem;
		font-size: 0.85rem; font-weight: 600; color: #64748b; text-decoration: none;
	}
	.back-home:hover { color: #0f172a; }
</style>
