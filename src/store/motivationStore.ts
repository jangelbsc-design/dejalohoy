import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MotivationState {
  photo: string | null;
  photoPos: number;
  text: string;
  setPhoto: (photo: string | null) => void;
  setPhotoPos: (pos: number) => void;
  setText: (text: string) => void;
}

export const useMotivationStore = create<MotivationState>()(
  persist(
    (set) => ({
      photo: null,
      photoPos: 50,
      text: '',
      setPhoto: (photo) => set({ photo, photoPos: 50 }),
      setPhotoPos: (photoPos) => set({ photoPos }),
      setText: (text) => set({ text }),
    }),
    { name: 'dejalohoy-motivation' }
  )
);
