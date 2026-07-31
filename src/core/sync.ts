import { useStore } from '../store/useStore';
import { useDiaryStore } from '../store/diaryStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useMotivationStore } from '../store/motivationStore';
import { useAuthStore } from '../store/authStore';
import { isSupabaseConfigured } from './config';
import { upsertRemoteAccount } from './supabase';

let timer: number | null = null;
let dirtyUsername: string | null = null;

function schedulePush() {
  const state = useAuthStore.getState();
  if (!state.currentUser || !state.accounts[state.currentUser]) return;
  if (!isSupabaseConfigured()) return;

  dirtyUsername = state.currentUser;
  if (timer !== null) return;

  timer = window.setTimeout(async () => {
    timer = null;
    const name = dirtyUsername;
    dirtyUsername = null;
    if (!name) return;
    const auth = useAuthStore.getState();
    const account = auth.accounts[name];
    if (!account) return;
    await upsertRemoteAccount({ username: name, passwordHash: account.passwordHash, data: account.data });
  }, 1500);
}

useStore.subscribe(schedulePush);
useDiaryStore.subscribe(schedulePush);
useWishlistStore.subscribe(schedulePush);
useMotivationStore.subscribe(schedulePush);

export {};
