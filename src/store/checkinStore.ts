import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CheckInEntry {
  date: string;        // YYYY-MM-DD
  mood: string;        // clave del ánimo, ej: "feliz"
  moodLabel: string;   // etiqueta visual, ej: "😄 Feliz"
  confidence: number;  // 1-5
  createdAt: string;
}

export const MOOD_OPTIONS = [
  { id: 'feliz', emoji: '😄', label: 'Feliz' },
  { id: 'tranquilo', emoji: '😌', label: 'Tranquilo' },
  { id: 'neutral', emoji: '😐', label: 'Neutral' },
  { id: 'ansioso', emoji: '😟', label: 'Ansioso' },
  { id: 'agobiado', emoji: '😩', label: 'Agobiado' },
];

export const CONFIDENCE_OPTIONS = [
  { value: 1, emoji: '😖', label: 'Nada' },
  { value: 2, emoji: '🙁', label: 'Poco' },
  { value: 3, emoji: '😐', label: 'Regular' },
  { value: 4, emoji: '🙂', label: 'Bastante' },
  { value: 5, emoji: '🤩', label: 'Total' },
];

export const todayKey = (d: Date = new Date()): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

interface CheckinsState {
  checkins: Record<string, CheckInEntry>; // fecha YYYY-MM-DD -> check-in
  addCheckIn: (mood: string, moodLabel: string, confidence: number) => void;
  clearCheckins: () => void;
}

export const useCheckinsStore = create<CheckinsState>()(
  persist(
    (set) => ({
      checkins: {},
      addCheckIn: (mood, moodLabel, confidence) =>
        set((state) => {
          const date = todayKey();
          return {
            checkins: {
              ...state.checkins,
              [date]: { date, mood, moodLabel, confidence, createdAt: new Date().toISOString() },
            },
          };
        }),
      clearCheckins: () => set({ checkins: {} }),
    }),
    { name: 'dejalohoy-checkins' }
  )
);
