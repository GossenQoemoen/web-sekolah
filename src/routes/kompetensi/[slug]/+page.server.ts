import { supabase } from '$lib/supabase';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { data: program } = await supabase
		.from('program_keahlian')
		.select('*')
		.eq('slug', params.slug)
		.single();

	if (!program) error(404, 'Kompetensi tidak ditemukan');

	const [{ data: berita }, { data: galeri }] = await Promise.all([
		supabase.from('berita').select('id, judul, ringkasan, created_at, foto_url')
			.eq('status', 'published').eq('unit', program.nama)
			.order('created_at', { ascending: false }).limit(4),
		supabase.from('album').select('id, judul, keterangan, created_at')
			.eq('status', 'published').eq('unit', program.nama)
			.order('created_at', { ascending: false }).limit(4)
	]);

	return { program, berita: berita ?? [], galeri: galeri ?? [] };
};
