import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistGoal {
  id: string;
  name: string;
  targetAmount: number;
}

interface WishlistState {
  goals: WishlistGoal[];
  addGoal: (name: string, targetAmount: number) => void;
  editGoal: (id: string, name: string, targetAmount: number) => void;
  removeGoal: (id: string) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      goals: [
        { id: 'vac', name: 'Vacaciones', targetAmount: 3000 },
        { id: 'ia', name: 'Suscripción a esa IA que tanto quieres', targetAmount: 120 },
        { id: 'eq', name: 'Cuota de ese equipo que necesitas', targetAmount: 5000 },
      ],
      addGoal: (name, targetAmount) =>
        set((state) => ({
          goals: [...state.goals, { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7), name, targetAmount }],
        })),
      editGoal: (id, name, targetAmount) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, name, targetAmount } : g)),
        })),
      removeGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),
    }),
    { name: 'dejalohoy-wishlist' }
  )
);
