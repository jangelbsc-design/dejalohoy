import { useStore } from '../store/useStore';
import { useDiaryStore } from '../store/diaryStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useMotivationStore } from '../store/motivationStore';
import { useAuthStore, snapshotStores } from '../store/authStore';
import { isCloudReady, cloudSaveData } from './supabase';

let timer: number | null = null;

function schedulePush() {
  const { userId } = useAuthStore.getState();
  if (!isCloudReady() || !userId) return;
  if (timer !== null) return;

  timer = window.setTimeout(async () => {
    timer = null;
    const auth = useAuthStore.getState();
    if (!isCloudReady() || !auth.userId) return;
    await cloudSaveData(snapshotStores(), auth.userId, auth.currentUser ?? '');
  }, 1500);
}

useStore.subscribe(schedulePush);
useDiaryStore.subscribe(schedulePush);
useWishlistStore.subscribe(schedulePush);
useMotivationStore.subscribe(schedulePush);

export {};
