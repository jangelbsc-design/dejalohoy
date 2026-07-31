import { useStore } from '../store/useStore';
import { useDiaryStore } from '../store/diaryStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useMotivationStore } from '../store/motivationStore';
import { useAuthStore, snapshotStores } from '../store/authStore';
import { isCloudReady, cloudSaveData } from './supabase';

let timer: number | null = null;
let saving = false;
let pendingChanges = false;

async function saveToCloud(): Promise<boolean> {
  const auth = useAuthStore.getState();
  if (!isCloudReady() || !auth.userId) return true;
  const payload = snapshotStores();
  return cloudSaveData(payload, auth.userId, auth.currentUser ?? '');
}

async function flushSave() {
  if (saving) {
    pendingChanges = true;
    return;
  }
  saving = true;
  try {
    for (let attempt = 0; attempt < 3; attempt++) {
      const ok = await saveToCloud();
      if (ok) {
        pendingChanges = false;
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
    console.warn('Déjalo Hoy: no se pudo guardar en la nube.');
  } finally {
    saving = false;
    if (pendingChanges) {
      pendingChanges = false;
      void flushSave();
    }
  }
}

function schedulePush() {
  const auth = useAuthStore.getState();
  if (!isCloudReady() || !auth.userId) return;
  if (timer !== null) return;

  timer = window.setTimeout(() => {
    timer = null;
    void flushSave();
  }, 800);
}

useStore.subscribe(schedulePush);
useDiaryStore.subscribe(schedulePush);
useWishlistStore.subscribe(schedulePush);
useMotivationStore.subscribe(schedulePush);

function flushOnLeave() {
  if (timer !== null) {
    window.clearTimeout(timer);
    timer = null;
  }
  if (saving) {
    pendingChanges = true;
    return;
  }
  void flushSave();
}

window.addEventListener('pagehide', flushOnLeave);
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') flushOnLeave();
});

export {};
