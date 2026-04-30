import { supabase } from './supabase';

export async function getProfile() {
	const { data: { session } } = await supabase.auth.getSession();
	if (!session) return null;

	const { data } = await supabase
		.from('profiles')
		.select('id, nama, role, unit')
		.eq('id', session.user.id)
		.single();

	return data;
}

export type Profile = { id: string; nama: string; role: string; unit: string };
