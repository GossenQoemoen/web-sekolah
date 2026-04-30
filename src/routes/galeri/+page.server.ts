import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const { data: album } = await supabase
		.from('album')
		.select('id, judul, keterangan, created_at, galeri(foto_url)')
		.order('created_at', { ascending: false });

	return { album: album ?? [] };
};
