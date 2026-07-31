import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from './config';
import type { AccountData } from '../store/authStore';

export interface RemoteAccount {
  username: string;
  passwordHash: string;
  data: AccountData;
}

async function request(path: string, options: RequestInit = {}): Promise<Response> {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });
}

export async function fetchRemoteAccount(username: string): Promise<RemoteAccount | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const res = await request(
      `profiles?username=eq.${encodeURIComponent(username)}&select=username,passwordHash,data&limit=1`
    );
    if (!res.ok) return null;
    const rows: RemoteAccount[] = await res.json();
    return rows.length > 0 ? rows[0] : null;
  } catch {
    return null;
  }
}

export async function upsertRemoteAccount(account: RemoteAccount): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const res = await request('profiles', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify(account),
    });
    return res.ok;
  } catch {
    return false;
  }
}
