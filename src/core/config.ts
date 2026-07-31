export const SUPABASE_URL = '';
export const SUPABASE_ANON_KEY = '';

export function isSupabaseConfigured(): boolean {
  return SUPABASE_URL.startsWith('https://') && SUPABASE_ANON_KEY.length > 20;
}
