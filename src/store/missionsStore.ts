import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DailyMission {
  id: string;
  emoji: string;
  title: string;
  detail: string;
}

export const DAILY_MISSIONS: DailyMission[] = [
  { id: 'agua', emoji: '💧', title: 'Beber 2 litros de agua', detail: 'Mantené hidratado tu cuerpo mientras se limpia.' },
  { id: 'camina', emoji: '🚶', title: 'Caminar 10 minutos', detail: 'Movimiento libre de humo para despejar la mente.' },
  { id: 'respira', emoji: '🌬️', title: 'Respirar 4-7-8 (3 rondas)', detail: 'Inhalá 4s, retené 7s, exhalá 8s. Repetí 3 veces.' },
  { id: 'diario', emoji: '✍️', title: 'Escribir en el diario', detail: 'Anotá cómo te sentís hoy. Desahogarte libera ansiedad.' },
  { id: 'antojo', emoji: '📋', title: 'Registrar un antojo o disparador', detail: 'Conocer tu enemigo es la mitad de la batalla.' },
  { id: 'manos', emoji: '🎮', title: 'Distracción de 5 minutos', detail: 'Un juego, un rompecabezas o algo con las manos.' },
];

interface MissionsState {
  completed: Record<string, string[]>; // fecha YYYY-MM-DD -> ids de misiones hechas
  toggleMission: (date: string, missionId: string) => void;
  resetAll: () => void;
}

export const useMissionsStore = create<MissionsState>()(
  persist(
    (set) => ({
      completed: {},
      toggleMission: (date, missionId) =>
        set((state) => {
          const done = state.completed[date] || [];
          const next = done.includes(missionId)
            ? done.filter((id) => id !== missionId)
            : [...done, missionId];
          return { completed: { ...state.completed, [date]: next } };
        }),
      resetAll: () => set({ completed: {} }),
    }),
    { name: 'dejalohoy-missions' }
  )
);
