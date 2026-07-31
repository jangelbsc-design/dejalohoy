import { supabase } from './supabaseClient';
import type { AccountData } from '../store/authStore';

const EMAIL_DOMAIN = 'dejalohoy.app';

export function isCloudReady(): boolean {
  return supabase !== null;
}

export function toAuthEmail(identifier: string): string {
  const value = identifier.trim().toLowerCase();
  if (value.includes('@')) return value;
  return `${value}@${EMAIL_DOMAIN}`;
}

export function displayName(email: string): string {
  const local = (email ?? '').split('@')[0] || 'usuario';
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export function usernameFromEmail(email: string): string {
  return (email ?? '').split('@')[0] || 'usuario';
}

export async function cloudRegister(
  identifier: string,
  password: string
): Promise<{ ok: boolean; error?: string; email?: string; id?: string }> {
  if (!supabase) return { ok: false, error: 'La nube no está configurada.' };
  const email = toAuthEmail(identifier);
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes('already registered')) {
      return { ok: false, error: 'Ese usuario ya está registrado. Iniciá sesión.' };
    }
    return { ok: false, error: error.message };
  }
  if (!data.user) return { ok: false, error: 'No se pudo crear la cuenta.' };

  if (data.session) {
    return { ok: true, email, id: data.user.id };
  }

  const signIn = await supabase.auth.signInWithPassword({ email, password });
  if (signIn.error) {
    return {
      ok: false,
      error:
        'Cuenta creada pero aún no confirmada. Revisá el correo o desactivá "Confirm email" en Supabase (Authentication → Email).',
    };
  }
  return { ok: true, email, id: signIn.data.user.id };
}

export async function cloudLogin(
  identifier: string,
  password: string
): Promise<{ ok: boolean; error?: string; email?: string; id?: string }> {
  if (!supabase) return { ok: false, error: 'La nube no está configurada.' };
  const email = toAuthEmail(identifier);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, error: 'Usuario o contraseña incorrectos.' };
  }
  if (!data.user) return { ok: false, error: 'No se pudo iniciar sesión.' };
  return { ok: true, email, id: data.user.id };
}

export async function cloudLogout(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function cloudUpdatePassword(newPassword: string): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: false, error: 'La nube no está configurada.' };
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function cloudResetPassword(identifier: string): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: false, error: 'La nube no está configurada.' };
  const email = toAuthEmail(identifier);
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function cloudSaveData(
  data: AccountData,
  userId: string,
  username: string
): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        username,
        data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
  return !error;
}

export async function cloudLoadData(): Promise<AccountData | null> {
  if (!supabase) return null;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('data')
    .eq('id', session.user.id)
    .maybeSingle();

  if (!data || !data.data || Object.keys(data.data).length === 0) return null;
  return data.data as AccountData;
}
