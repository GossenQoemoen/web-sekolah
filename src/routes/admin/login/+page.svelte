<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function login(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		error = '';
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (err) {
			error = 'Email atau password salah.';
			loading = false;
		} else {
			goto('/admin');
		}
	}
</script>

<svelte:head><title>Login Admin — SMKN 2 Tebo</title></svelte:head>

<div class="login-wrap">
	<div class="float-card login-card">
		<div class="login-brand">
			<div class="login-logo">S</div>
			<div>
				<strong class="brand-name">SMKN 2 Tebo</strong>
				<span class="brand-sub">Admin Panel</span>
			</div>
		</div>

		<h1 class="login-title">Masuk</h1>

		{#if error}
			<div class="error-box">{error}</div>
		{/if}

		<form onsubmit={login} class="login-form">
			<div class="field">
				<label class="field-label" for="email">Email</label>
				<input id="email" type="email" bind:value={email} required placeholder="admin@sekolah.com" class="cek-input" />
			</div>
			<div class="field">
				<label class="field-label" for="password">Password</label>
				<input id="password" type="password" bind:value={password} required placeholder="••••••••" class="cek-input" />
			</div>
			<button type="submit" class="btn btn-primary btn-full" disabled={loading}>
				{loading ? 'Memproses...' : 'Masuk →'}
			</button>
		</form>
	</div>
</div>

<style>
	.login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
	.login-card { width: 100%; max-width: 400px; }
	.login-brand { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.75rem; }
	.login-logo {
		width: 40px; height: 40px; border-radius: 0.75rem;
		background: linear-gradient(135deg, var(--orange-500), var(--green-600));
		display: flex; align-items: center; justify-content: center;
		color: white; font-weight: 800; font-size: 0.9rem;
	}
	.brand-name { display: block; font-size: 0.9rem; font-weight: 800; color: var(--ink); }
	.brand-sub  { display: block; font-size: 0.72rem; color: var(--muted); }
	.login-title { margin: 0 0 1.25rem; font-size: 1.5rem; font-weight: 800; color: var(--ink); }
	.login-form { display: flex; flex-direction: column; gap: 1rem; }
	.field { display: grid; gap: 0.4rem; }
	.field-label { font-size: 0.85rem; font-weight: 700; color: var(--green-900); }
	.btn-full { width: 100%; margin-top: 0.25rem; }
	.error-box { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); color: #dc2626; border-radius: 0.75rem; padding: 0.75rem 1rem; font-size: 0.88rem; margin-bottom: 1rem; }
</style>
