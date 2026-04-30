import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const { data: galeri } = await supabase
		.from('galeri')
		.select('id, judul, foto_url, keterangan, created_at')
		.order('created_at', { ascending: false });

	return { galeri: galeri ?? [] };
};
