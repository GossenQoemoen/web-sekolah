import { supabase } from '$lib/supabase';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { data: album } = await supabase
		.from('album')
		.select('id, judul, keterangan')
		.eq('id', params.id)
		.single();

	if (!album) error(404, 'Album tidak ditemukan');

	const { data: foto } = await supabase
		.from('galeri')
		.select('id, judul, foto_url, keterangan')
		.eq('album_id', params.id)
		.order('id');

	return { album, foto: foto ?? [] };
};
