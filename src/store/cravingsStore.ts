import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TRIGGER_OPTIONS, TriggerKey } from '../core/triggers';

export interface CravingEntry {
  id: string;
  intensity: number;       // 1 a 10
  trigger: string;         // clave normalizada del disparador, ej: "estres"
  triggerLabel: string;    // etiqueta visual, ej: "😤 Estrés"
  customText?: string;     // solo cuando trigger === "otro"
  createdAt: string;       // ISO (la hora se registra automáticamente)
  place?: string;          // etiqueta visual del lugar, ej: "🏠 Casa"
  placeText?: string;      // texto libre cuando place === "📍 Otro lugar"
  note?: string;           // legacy: antojos viejos con texto libre
}

export const PLACE_OPTIONS = [
  { id: 'casa', emoji: '🏠', label: 'Casa' },
  { id: 'trabajo', emoji: '💼', label: 'Trabajo' },
  { id: 'calle', emoji: '🚶', label: 'Calle' },
  { id: 'auto', emoji: '🚗', label: 'Auto' },
  { id: 'bar', emoji: '🍻', label: 'Bar o restaurante' },
  { id: 'fiesta', emoji: '🎉', label: 'Fiesta o social' },
  { id: 'otro', emoji: '📍', label: 'Otro lugar' },
];

export function placeLabelFor(key: string | undefined): string | undefined {
  if (!key) return undefined;
  const option = PLACE_OPTIONS.find((o) => o.id === key);
  return option ? `${option.emoji} ${option.label}` : key;
}

interface CravingsState {
  entries: CravingEntry[];
  addEntry: (
    intensity: number,
    trigger: TriggerKey,
    triggerLabel: string,
    customText?: string,
    place?: string,
    placeText?: string
  ) => void;
  removeEntry: (id: string) => void;
  clearEntries: () => void;
}

export const useCravingsStore = create<CravingsState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (intensity, trigger, triggerLabel, customText, place, placeText) =>
        set((state) => ({
          entries: [
            {
              id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
              intensity,
              trigger,
              triggerLabel,
              customText: customText?.trim() ? customText.trim() : undefined,
              createdAt: new Date().toISOString(),
              place,
              placeText: placeText?.trim() ? placeText.trim() : undefined,
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
