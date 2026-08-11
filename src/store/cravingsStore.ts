import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CravingEntry {
  id: string;
  intensity: number;   // 1 a 10
  note?: string;
  createdAt: string;
}

interface CravingsState {
  entries: CravingEntry[];
  addEntry: (intensity: number, note?: string) => void;
  removeEntry: (id: string) => void;
  clearEntries: () => void;
}

export const useCravingsStore = create<CravingsState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (intensity, note) =>
        set((state) => ({
          entries: [
            {
              id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
              intensity,
              note: note?.trim() ? note.trim() : undefined,
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
    { name: 'dejalohoy-cravings' }
  )
);
