import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfileData {
  startDate: string | null;
  cigsPerDay: number;
  cigsPerPack: number;
  pricePerPack: number;
  yearsSmoking: number;
}

interface AppState {
  profile: UserProfileData | null;
  setProfile: (profile: UserProfileData) => void;
  resetProfile: () => void;
  restartCounter: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      resetProfile: () => set({ profile: null }),
      restartCounter: () =>
        set((state) =>
          state.profile
            ? { profile: { ...state.profile, startDate: new Date().toISOString() } }
            : {}
        ),
    }),
    {
      name: 'dejalohoy-storage', // se guarda automáticamente en localStorage
    }
  )
);
