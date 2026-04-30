import { supabase } from '$lib/supabase';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { data: berita } = await supabase
		.from('berita')
		.select('id, judul, ringkasan, isi, foto_url, created_at, unit, profiles!berita_author_profiles_fkey(nama)')
		.eq('id', params.id)
		.single();

	if (!berita) error(404, 'Berita tidak ditemukan');

	return { berita };
};
