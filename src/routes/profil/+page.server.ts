import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const { data: profil } = await supabase
		.from('profil')
		.select('nama, npsn, alamat, akreditasi, visi, misi')
		.single();

	return { profil };
};
