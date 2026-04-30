import { supabase } from '$lib/supabase';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { data: berita } = await supabase
		.from('berita')
		.select('id, judul, ringkasan, isi, foto_url, created_at, unit, author_id')
		.eq('id', params.id)
		.single();

	if (!berita) error(404, 'Berita tidak ditemukan');

	let author_nama: string | null = null;
	if (berita.author_id) {
		const { data: profile } = await supabase
			.from('profiles')
			.select('nama')
			.eq('id', berita.author_id)
			.single();
		author_nama = profile?.nama ?? null;
	}

	return { berita: { ...berita, author_nama } };
};
