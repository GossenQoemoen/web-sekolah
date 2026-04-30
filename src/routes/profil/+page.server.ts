import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const { data: profil } = await supabase
		.from('profil')
		.select('*')
		.single();

	const { data: program } = await supabase
		.from('program_keahlian')
		.select('nama, jumlah_siswa')
		.order('jumlah_siswa', { ascending: false });

	return { profil, program: program ?? [] };
};
