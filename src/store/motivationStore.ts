import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MotivationState {
  photo: string | null;
  text: string;
  setPhoto: (photo: string | null) => void;
  setText: (text: string) => void;
}

export const useMotivationStore = create<MotivationState>()(
  persist(
    (set) => ({
      photo: null,
      text: '',
      setPhoto: (photo) => set({ photo }),
      setText: (text) => set({ text }),
    }),
    { name: 'dejalohoy-motivation' }
  )
);
