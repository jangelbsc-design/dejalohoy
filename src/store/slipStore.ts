import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SlipEntry {
  id: string;
  trigger: string;        // clave normalizada del disparador, ej: "estres"
  triggerLabel: string;    // etiqueta visual, ej: "😤 Estrés"
  customText?: string;     // solo cuando trigger === "otro"
  cigarettes: number;      // cuántos cigarros fumó en el tropezón
  createdAt: string;
}

interface SlipsState {
  slips: SlipEntry[];
  addSlip: (trigger: string, triggerLabel: string, customText: string | undefined, cigarettes: number) => void;
  removeSlip: (id: string) => void;
  clearSlips: () => void;
}

export const useSlipsStore = create<SlipsState>()(
  persist(
    (set) => ({
      slips: [],
      addSlip: (trigger, triggerLabel, customText, cigarettes) =>
        set((state) => ({
          slips: [
            {
              id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
              trigger,
              triggerLabel,
              customText: customText?.trim() ? customText.trim() : undefined,
              cigarettes,
              createdAt: new Date().toISOString(),
            },
            ...state.slips,
          ],
        })),
      removeSlip: (id) =>
        set((state) => ({
          slips: state.slips.filter((s) => s.id !== id),
        })),
      clearSlips: () => set({ slips: [] }),
    }),
    { name: 'dejalohoy-slips' }
  )
);
