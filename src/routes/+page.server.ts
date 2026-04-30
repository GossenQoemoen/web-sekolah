import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [{ data: berita }, { data: program }] = await Promise.all([
		supabase.from('berita').select('id, judul, ringkasan, created_at').eq('status', 'published').order('created_at', { ascending: false }).limit(3),
		supabase.from('program_keahlian').select('id, nama, slug, deskripsi, jumlah_siswa').order('nama')
	]);

	return { berita: berita ?? [], program: program ?? [] };
};
