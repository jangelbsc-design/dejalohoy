import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TRIGGER_OPTIONS, TriggerKey } from '../core/triggers';

export interface CravingEntry {
  id: string;
  intensity: number;       // 1 a 10
  trigger: string;         // clave normalizada del disparador, ej: "estres"
  triggerLabel: string;    // etiqueta visual, ej: "😤 Estrés"
  customText?: string;     // solo cuando trigger === "otro"
  createdAt: string;
  note?: string;           // legacy: antojos viejos con texto libre
}

interface CravingsState {
  entries: CravingEntry[];
  addEntry: (intensity: number, trigger: TriggerKey, triggerLabel: string, customText?: string) => void;
  removeEntry: (id: string) => void;
  clearEntries: () => void;
}

export const useCravingsStore = create<CravingsState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (intensity, trigger, triggerLabel, customText) =>
        set((state) => ({
          entries: [
            {
              id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
              intensity,
              trigger,
              triggerLabel,
              customText: customText?.trim() ? customText.trim() : undefined,
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

export function triggerLabelFor(key: string): string {
  const option = TRIGGER_OPTIONS.find((o) => o.key === key);
  return option ? option.label : key;
}
