import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useStore, UserProfileData } from './useStore';
import { useDiaryStore, DiaryEntry } from './diaryStore';
import { useWishlistStore, WishlistGoal } from './wishlistStore';
import { useMotivationStore } from './motivationStore';
import { isSupabaseConfigured } from '../core/config';
import { fetchRemoteAccount, upsertRemoteAccount } from '../core/supabase';

export interface AccountData {
  profile: UserProfileData | null;
  diary: DiaryEntry[];
  goals: WishlistGoal[];
  motivationPhoto: string | null;
  motivationText: string;
}

export interface Account {
  passwordHash: string;
  data: AccountData;
}

interface AuthState {
  accounts: Record<string, Account>;
  currentUser: string | null;
  register: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  changePassword: (username: string, newPassword: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
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

function snapshotStores(): AccountData {
  return {
    profile: useStore.getState().profile,
    diary: useDiaryStore.getState().entries,
    goals: useWishlistStore.getState().goals,
    motivationPhoto: useMotivationStore.getState().photo,
    motivationText: useMotivationStore.getState().text,
  };
}

function loadIntoStores(data: AccountData) {
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accounts: {},
      currentUser: null,

      register: async (username, password) => {
        const name = username.trim();
        if (!name) return { ok: false, error: 'Ingresá un nombre de usuario.' };
        if (password.length < 4) return { ok: false, error: 'La contraseña debe tener al menos 4 caracteres.' };
        if (get().accounts[name]) return { ok: false, error: 'Ese usuario ya existe. Elegí otro o iniciá sesión.' };

        if (isSupabaseConfigured()) {
          const remote = await fetchRemoteAccount(name);
          if (remote) return { ok: false, error: 'Ese usuario ya existe en la nube. Iniciá sesión.' };
        }

        const isFirstAccount = Object.keys(get().accounts).length === 0;
        const data = isFirstAccount ? snapshotStores() : emptyData();
        const account = { passwordHash: hashPassword(password), data };

        set((state) => ({
          accounts: { ...state.accounts, [name]: account },
          currentUser: name,
        }));

        if (!isFirstAccount) {
          clearStores();
        }

        if (isSupabaseConfigured()) {
          await upsertRemoteAccount({ username: name, passwordHash: account.passwordHash, data: account.data });
        }
        return { ok: true };
      },

      login: async (username, password) => {
        const name = username.trim();
        if (!name) return { ok: false, error: 'Ingresá un nombre de usuario.' };
        const hash = hashPassword(password);
        const local = get().accounts[name];

        if (local) {
          if (local.passwordHash !== hash) return { ok: false, error: 'Contraseña incorrecta.' };
          set({ currentUser: name });
          loadIntoStores(local.data);

          if (isSupabaseConfigured()) {
            const remote = await fetchRemoteAccount(name);
            if (remote && remote.data && useAuthStore.getState().currentUser === name) {
              loadIntoStores(remote.data);
              set((state) => ({
                accounts: { ...state.accounts, [name]: { ...state.accounts[name], data: remote.data } },
              }));
            }
          }
          return { ok: true };
        }

        if (isSupabaseConfigured()) {
          const remote = await fetchRemoteAccount(name);
          if (remote) {
            if (remote.passwordHash !== hash) return { ok: false, error: 'Contraseña incorrecta.' };
            set((state) => ({
              accounts: { ...state.accounts, [name]: { passwordHash: hash, data: remote.data } },
              currentUser: name,
            }));
            loadIntoStores(remote.data);
            return { ok: true };
          }
        }

        return { ok: false, error: 'Ese usuario no existe. Creá una cuenta.' };
      },

      changePassword: async (username, newPassword) => {
        const name = username.trim();
        if (!name) return { ok: false, error: 'Ingresá tu nombre de usuario.' };
        if (newPassword.length < 4) return { ok: false, error: 'La contraseña debe tener al menos 4 caracteres.' };

        const local = get().accounts[name];
        let remoteData: AccountData | null = null;

        if (!local && isSupabaseConfigured()) {
          const remote = await fetchRemoteAccount(name);
          if (!remote) return { ok: false, error: 'Ese usuario no existe.' };
          remoteData = remote.data;
        }
        if (!local && !remoteData) {
          return { ok: false, error: 'Ese usuario no existe. Creá una cuenta.' };
        }

        const newHash = hashPassword(newPassword);
        set((state) => ({
          accounts: {
            ...state.accounts,
            [name]: {
              passwordHash: newHash,
              data: local?.data ?? remoteData ?? emptyData(),
            },
          },
        }));

        if (isSupabaseConfigured()) {
          const account = useAuthStore.getState().accounts[name];
          await upsertRemoteAccount({ username: name, passwordHash: newHash, data: account.data });
        }
        return { ok: true };
      },

      logout: () => {
        const { currentUser } = get();
        if (currentUser) {
          set((state) => ({
            accounts: { ...state.accounts, [currentUser]: { ...state.accounts[currentUser], data: snapshotStores() } },
          }));
        }
        set({ currentUser: null });
        clearStores();
      },
    }),
    { name: 'dejalohoy-accounts' }
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
