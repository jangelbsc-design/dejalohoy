import { create } from 'zustand';

export interface UserProfileData {
  startDate: string | null; // ISO string
  cigsPerDay: number;
  cigsPerPack: number;
  pricePerPack: number;
  yearsSmoking: number;
}

interface AppState {
  profile: UserProfileData | null;
  isProfileLoaded: boolean;
  setProfile: (profile: UserProfileData) => void;
  setProfileLoaded: (loaded: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  profile: null,
  isProfileLoaded: false,
  setProfile: (profile) => set({ profile }),
  setProfileLoaded: (loaded) => set({ isProfileLoaded: loaded }),
}));
