import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Reminder {
  id: string;
  emoji: string;
  label: string;
  body: string;
  time: string; // 'HH:MM' formato 24h
  days: number[]; // 0 (domingo) a 6 (sábado)
  enabled: boolean;
}

export const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
export const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const DEFAULT_REMINDERS: Reminder[] = [
  {
    id: 'morning',
    emoji: '🌅',
    label: 'Buenos días',
    body: 'Empieza tu día sin fumar. Respira hondo y recuerda por qué lo estás logrando.',
    time: '08:00',
    days: [0, 1, 2, 3, 4, 5, 6],
    enabled: true,
  },
  {
    id: 'craving',
    emoji: '🧘',
    label: '¿Antojo? Respira',
    body: 'Si tienes ganas de fumar, prueba la técnica 4-7-8 o completa tus misiones.',
    time: '15:00',
    days: [0, 1, 2, 3, 4, 5, 6],
    enabled: true,
  },
  {
    id: 'night',
    emoji: '🌙',
    label: 'Check-in de la noche',
    body: 'Cierra tu día con el check-in de ánimo y confianza.',
    time: '21:00',
    days: [0, 1, 2, 3, 4, 5, 6],
    enabled: true,
  },
];

export function formatReminderTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'p. m.' : 'a. m.';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

interface RemindersState {
  reminders: Reminder[];
  addReminder: (r: Omit<Reminder, 'id'>) => void;
  updateReminder: (id: string, patch: Partial<Reminder>) => void;
  removeReminder: (id: string) => void;
  resetReminders: () => void;
}

export const useRemindersStore = create<RemindersState>()(
  persist(
    (set) => ({
      reminders: DEFAULT_REMINDERS,
      addReminder: (data) =>
        set((state) => ({
          reminders: [
            ...state.reminders,
            { ...data, id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7) },
          ],
        })),
      updateReminder: (id, patch) =>
        set((state) => ({
          reminders: state.reminders.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        })),
      removeReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        })),
      resetReminders: () => set({ reminders: DEFAULT_REMINDERS }),
    }),
    { name: 'dejalohoy-reminders' }
  )
);
