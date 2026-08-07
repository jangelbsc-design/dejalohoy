import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TriggerEntry {
  id: string;
  trigger: string;        // clave normalizada, ej: "estres"
  label: string;          // etiqueta visual, ej: "Estrés"
  customText?: string;    // solo cuando trigger === "otro"
  createdAt: string;
}

interface TriggersState {
  entries: TriggerEntry[];
  addEntry: (trigger: string, label: string, customText?: string) => void;
  removeEntry: (id: string) => void;
  clearEntries: () => void;
}

export const useTriggersStore = create<TriggersState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (trigger, label, customText) =>
        set((state) => ({
          entries: [
            {
              id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
              trigger,
              label,
              customText,
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
    { name: 'dejalohoy-triggers' }
  )
);
