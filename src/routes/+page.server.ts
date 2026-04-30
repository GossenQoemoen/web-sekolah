import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const { data: berita } = await supabase
		.from('berita')
		.select('id, judul, ringkasan, created_at')
		.order('created_at', { ascending: false })
		.limit(3);

	return { berita: berita ?? [] };
};
