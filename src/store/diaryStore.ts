import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DiaryEntry {
  id: string;
  text: string;
  createdAt: string;
}

interface DiaryState {
  entries: DiaryEntry[];
  addEntry: (text: string) => void;
  removeEntry: (id: string) => void;
  clearEntries: () => void;
}

export const useDiaryStore = create<DiaryState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (text) =>
        set((state) => ({
          entries: [
            {
              id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
              text,
              createdAt: new Date().toISOString(),
            },
            ...state.entries,
          ],
        })),
      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),
      clearEntries: () => set({ entries: [] }),
    }),
    { name: 'dejalohoy-diary' }
  )
);
