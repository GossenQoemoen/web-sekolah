import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

function adminClient() {
	return createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
		auth: { autoRefreshToken: false, persistSession: false }
	});
}

export const actions: Actions = {
	buat: async ({ request }) => {
		const fd = await request.formData();
		const email = fd.get('email') as string;
		const password = fd.get('password') as string;
		const nama = fd.get('nama') as string;
		const role = fd.get('role') as string;
		const unit = fd.get('unit') as string;

		const admin = adminClient();
		const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
		if (error) return fail(400, { msg: error.message });

		await admin.from('profiles').update({ nama, role, unit }).eq('id', data.user.id);
		return { msg: 'Akun berhasil dibuat.' };
	},

	hapus: async ({ request }) => {
		const fd = await request.formData();
		const id = fd.get('id') as string;

		const admin = adminClient();
		const { error } = await admin.auth.admin.deleteUser(id);
		if (error) return fail(400, { msg: error.message });
		return { msg: 'Akun dihapus.' };
	}
};
