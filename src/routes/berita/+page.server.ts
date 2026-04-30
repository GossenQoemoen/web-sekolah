import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const { data: berita } = await supabase
		.from('berita')
		.select('id, judul, ringkasan, foto_url, created_at')
		.eq('status', 'published')
		.order('created_at', { ascending: false });

	return { berita: berita ?? [] };
};
