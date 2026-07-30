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
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      resetProfile: () => set({ profile: null }),
    }),
    {
      name: 'dejalohoy-storage', // se guarda automáticamente en localStorage
    }
  )
);
