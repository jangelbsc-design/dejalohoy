import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from './config';

let client: SupabaseClient | null = null;
if (isSupabaseConfigured()) {
  client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export const supabase = client;
