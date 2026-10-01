import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ieuwkointxafaezfytcn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable__FtLUpyp60T8xZSdmG4vXg_jkQAm2Uc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
