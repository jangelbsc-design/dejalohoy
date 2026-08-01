import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useStore, UserProfileData } from './useStore';
import { useDiaryStore, DiaryEntry } from './diaryStore';
import { useWishlistStore, WishlistGoal } from './wishlistStore';
import { useMotivationStore } from './motivationStore';
import { isCloudReady } from '../core/supabase';
import {
  cloudRegister,
  cloudLogin,
  cloudLogout,
  cloudUpdatePassword,
  cloudResetPassword,
  cloudSaveData,
  cloudLoadData,
  displayName,
  usernameFromEmail,
} from '../core/supabase';
import { supabase } from '../core/supabaseClient';

export interface AccountData {
  profile: UserProfileData | null;
  diary: DiaryEntry[];
  goals: WishlistGoal[];
  motivationPhoto: string | null;
  motivationText: string;
}

export interface LocalAccount {
  passwordHash: string;
  data: AccountData;
}

interface AuthState {
  currentUser: string | null;
  userId: string | null;
  ready: boolean;
  accounts: Record<string, LocalAccount>;
  register: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<{ ok: boolean; error?: string }>;
  resetPassword: (username: string) => Promise<{ ok: boolean; error?: string }>;
  restoreSession: () => Promise<void>;
}

function hashPassword(password: string): string {
  let h1 = 5381;
  let h2 = 52711;
  for (let i = 0; i < password.length; i++) {
    const c = password.charCodeAt(i);
    h1 = (h1 * 33) ^ c;
    h2 = (h2 * 31) ^ c;
  }
  return (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0');
}

function defaultGoals(): WishlistGoal[] {
  return [
    { id: 'vac', name: 'Vacaciones', targetAmount: 3000 },
    { id: 'ia', name: 'Suscripción a esa IA que tanto quieres', targetAmount: 120 },
    { id: 'eq', name: 'Cuota de ese equipo que necesitas', targetAmount: 5000 },
  ];
}

function emptyData(): AccountData {
  return {
    profile: null,
    diary: [],
    goals: defaultGoals(),
    motivationPhoto: null,
    motivationText: '',
  };
}

function mergeData(cloud: AccountData | null | undefined, local: AccountData | null | undefined): AccountData | null {
  if (!cloud && !local) return null;
  if (!cloud) return local ?? null;
  if (!local) return cloud;

  const byId = new Map<string, DiaryEntry>();
  for (const entry of [...local.diary, ...cloud.diary]) {
    byId.set(entry.id, entry);
  }
  const diary = [...byId.values()].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return {
    profile: cloud.profile ?? local.profile,
    diary,
    goals: cloud.goals.length > 0 ? cloud.goals : local.goals,
    motivationPhoto: cloud.motivationPhoto ?? local.motivationPhoto,
    motivationText: cloud.motivationText || local.motivationText,
  };
}

export function snapshotStores(): AccountData {
  return {
    profile: useStore.getState().profile,
    diary: useDiaryStore.getState().entries,
    goals: useWishlistStore.getState().goals,
    motivationPhoto: useMotivationStore.getState().photo,
    motivationText: useMotivationStore.getState().text,
  };
}

export function loadIntoStores(data: AccountData) {
  useStore.setState({ profile: data.profile });
  useDiaryStore.setState({ entries: data.diary });
  useWishlistStore.setState({ goals: data.goals });
  useMotivationStore.setState({ photo: data.motivationPhoto, text: data.motivationText });
}

function clearStores() {
  useStore.setState({ profile: null });
  useDiaryStore.setState({ entries: [] });
  useWishlistStore.setState({ goals: defaultGoals() });
  useMotivationStore.setState({ photo: null, text: '' });
}

function hasData(data: AccountData | null | undefined): data is AccountData {
  if (!data) return false;
  if (data.profile) return true;
  if (data.diary && data.diary.length > 0) return true;
  if (data.motivationPhoto) return true;
  if (data.motivationText) return true;
  return false;
}

const SHARED_EMAIL = 'progreso@dejalohoy.app';
const SHARED_PASSWORD = 'DejaloHoy2026!';

async function ensureSharedAccount(): Promise<{ id: string; email: string } | null> {
  if (!supabase) return null;

  const signIn = await supabase.auth.signInWithPassword({ email: SHARED_EMAIL, password: SHARED_PASSWORD });
  if (signIn.data.user) {
    return { id: signIn.data.user.id, email: signIn.data.user.email ?? SHARED_EMAIL };
  }

  const signUp = await supabase.auth.signUp({ email: SHARED_EMAIL, password: SHARED_PASSWORD });
  if (signUp.data.user) {
    return { id: signUp.data.user.id, email: signUp.data.user.email ?? SHARED_EMAIL };
  }

  if (!signUp.error) {
    const retry = await supabase.auth.signInWithPassword({ email: SHARED_EMAIL, password: SHARED_PASSWORD });
    if (retry.data.user) {
      return { id: retry.data.user.id, email: retry.data.user.email ?? SHARED_EMAIL };
    }
  }

  return null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accounts: {},
      currentUser: null,
      userId: null,
      ready: false,

      restoreSession: async () => {
        if (isCloudReady() && supabase) {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          let user: { id: string; email: string | undefined } | null = session?.user
            ? { id: session.user.id, email: session.user.email }
            : null;
          if (!user) {
            user = await ensureSharedAccount();
          }
          if (!user) {
            set({ currentUser: null, userId: null, ready: true });
            return;
          }

          const cloud = await cloudLoadData();
          const merged = mergeData(cloud, snapshotStores());
          if (merged) {
            loadIntoStores(merged);
            if (JSON.stringify(merged) !== JSON.stringify(cloud)) {
              await cloudSaveData(merged, user.id, displayName(user.email ?? ''));
            }
          }
          set({
            currentUser: displayName(user.email ?? ''),
            userId: user.id,
            ready: true,
          });
          return;
        }
        set({ ready: true });
      },

      register: async (username, password) => {
        const name = username.trim();
        if (!name) return { ok: false, error: 'Ingresá tu usuario o email.' };
        if (password.length < 4) return { ok: false, error: 'La contraseña debe tener al menos 4 caracteres.' };

        if (isCloudReady()) {
          const res = await cloudRegister(name, password);
          if (!res.ok || !res.id) return { ok: false, error: res.error ?? 'No se pudo crear la cuenta.' };

          const isFirstAccount = Object.keys(get().accounts).length === 0;
          const data = isFirstAccount ? snapshotStores() : emptyData();
          if (hasData(data)) {
            await cloudSaveData(data, res.id, usernameFromEmail(res.email ?? name));
          }

          set({ currentUser: displayName(res.email ?? name), userId: res.id });
          if (!isFirstAccount) clearStores();
          return { ok: true };
        }

        if (get().accounts[name]) return { ok: false, error: 'Ese usuario ya existe. Elegí otro o iniciá sesión.' };
        const isFirstAccount = Object.keys(get().accounts).length === 0;
        const data = isFirstAccount ? snapshotStores() : emptyData();
        set((state) => ({
          accounts: { ...state.accounts, [name]: { passwordHash: hashPassword(password), data } },
          currentUser: name,
          userId: null,
        }));
        if (!isFirstAccount) clearStores();
        return { ok: true };
      },

      login: async (username, password) => {
        const name = username.trim();
        if (!name) return { ok: false, error: 'Ingresá tu usuario o email.' };
        if (password.length < 4) return { ok: false, error: 'La contraseña debe tener al menos 4 caracteres.' };

        if (isCloudReady()) {
          let res = await cloudLogin(name, password);
          if (!res.ok) {
            const local = get().accounts[name];
            if (local && local.passwordHash === hashPassword(password)) {
              const reg = await cloudRegister(name, password);
              if (reg.ok && reg.id) {
                if (hasData(local.data)) {
                  await cloudSaveData(local.data, reg.id, usernameFromEmail(reg.email ?? name));
                }
                res = await cloudLogin(name, password);
                if (res.ok && res.id) {
                  const data = await cloudLoadData();
                  if (data) loadIntoStores(data);
                  set({ currentUser: displayName(res.email ?? name), userId: res.id });
                  return { ok: true };
                }
              }
            }
            return { ok: false, error: res.error ?? 'No se pudo iniciar sesión.' };
          }

          if (!res.id) return { ok: false, error: 'No se pudo iniciar sesión.' };
          const cloud = await cloudLoadData();
          const merged = mergeData(cloud, snapshotStores());
          if (merged) {
            loadIntoStores(merged);
            if (JSON.stringify(merged) !== JSON.stringify(cloud)) {
              await cloudSaveData(merged, res.id, usernameFromEmail(res.email ?? name));
            }
          } else {
            const username = usernameFromEmail(res.email ?? name);
            const local = get().accounts[username] ?? get().accounts[name];
            if (local && hasData(local.data)) {
              await cloudSaveData(local.data, res.id, username);
              loadIntoStores(local.data);
            }
          }
          set({ currentUser: displayName(res.email ?? name), userId: res.id });
          return { ok: true };
        }

        const hash = hashPassword(password);
        const local = get().accounts[name];
        if (!local) return { ok: false, error: 'Ese usuario no existe. Creá una cuenta.' };
        if (local.passwordHash !== hash) return { ok: false, error: 'Contraseña incorrecta.' };
        set({ currentUser: name, userId: null });
        loadIntoStores(local.data);
        return { ok: true };
      },

      logout: async () => {
        const { currentUser, userId, accounts } = get();
        if (!currentUser && !userId) return;
        if (isCloudReady() && userId) {
          await cloudSaveData(snapshotStores(), userId, currentUser ?? '');
          await cloudLogout();
        } else if (currentUser && accounts[currentUser]) {
          set((state) => ({
            accounts: {
              ...state.accounts,
              [currentUser]: { ...state.accounts[currentUser], data: snapshotStores() },
            },
          }));
        }
        set({ currentUser: null, userId: null });
        clearStores();
      },

      changePassword: async (newPassword) => {
        if (newPassword.length < 4) return { ok: false, error: 'La contraseña debe tener al menos 4 caracteres.' };
        if (isCloudReady()) {
          const res = await cloudUpdatePassword(newPassword);
          if (!res.ok) return { ok: false, error: res.error ?? 'Ocurrió un error.' };
          return { ok: true };
        }
        const { currentUser, accounts } = get();
        if (!currentUser) return { ok: false, error: 'No hay sesión activa.' };
        const local = accounts[currentUser];
        if (!local) return { ok: false, error: 'Ese usuario no existe.' };
        set((state) => ({
          accounts: {
            ...state.accounts,
            [currentUser]: { ...local, passwordHash: hashPassword(newPassword) },
          },
        }));
        return { ok: true };
      },

      resetPassword: async (username) => {
        if (isCloudReady()) {
          return cloudResetPassword(username);
        }
        return { ok: false, error: 'La recuperación requiere la nube configurada.' };
      },
    }),
    {
      name: 'dejalohoy-accounts',
      partialize: (state) => ({
        accounts: state.accounts,
        currentUser: state.currentUser,
        userId: state.userId,
      }),
    }
  )
);

function syncAccount() {
  const state = useAuthStore.getState();
  if (!state.currentUser || !state.accounts[state.currentUser]) return;
  const account = state.accounts[state.currentUser];
  const snapshot = snapshotStores();
  if (JSON.stringify(account.data) === JSON.stringify(snapshot)) return;
  useAuthStore.setState({
    accounts: { ...state.accounts, [state.currentUser]: { ...account, data: snapshot } },
  });
}

useStore.subscribe(syncAccount);
useDiaryStore.subscribe(syncAccount);
useWishlistStore.subscribe(syncAccount);
useMotivationStore.subscribe(syncAccount);
