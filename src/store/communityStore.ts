import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CommunityQuote {
  id: string;
  text: string;
  createdAt: string;
}

export const COMMUNITY_QUOTES: string[] = [
  'Un día a la vez. Hoy estuve a punto de fumar y respiré hondo 10 veces. La pasó. Ustedes también pueden.',
  'Dejé hace 3 meses y el antojo ya casi no aparece. Lo que pensé que era imposible, hoy es mi normalidad.',
  'No es fuerza de voluntad, es recordar cada mañana por qué empecé. Mi familia merece verme llegar lejos.',
  'Llevo 47 días y ahorré lo suficiente para un viaje. Cada cigarrillo que no fumé fue un boleto a mi sueño.',
  'El primer día es el más difícil. Si lo estás pasando mal, acordate: esto también va a pasar. No fumes.',
  'Caí a los 20 días y me sentí fracasada. Pero me levanté y llevo 60. Una caída no define tu camino.',
  'Cuando me dan ganas, me tomo un vaso de agua bien fría y salgo a caminar una cuadra. La ansiedad se me pasa.',
  'Mi abuela fumó toda la vida. Lo hago por ella y por mí. Cada día sin fumar es un homenaje a su memoria.',
  'El dinero que ahorro lo separo apenas me llega el sueldo. Ver la meta crecer me da más fuerza que el cigarrillo.',
  'Los primeros días extrañás, después te das cuenta de que solo extrañabas la costumbre, no el cigarro.',
  'Hoy cumplo un año. Si yo pude, que fumé 20 años, vos que recién empezás también podés. Vamos.',
  'No estás perdiendo un placer, estás ganando tu vida. Esa es la verdad que nadie te cuenta.',
];

interface CommunityState {
  myQuotes: CommunityQuote[];
  addQuote: (text: string) => void;
  removeQuote: (id: string) => void;
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set) => ({
      myQuotes: [],
      addQuote: (text) =>
        set((state) => ({
          myQuotes: [
            {
              id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
              text: text.trim(),
              createdAt: new Date().toISOString(),
            },
            ...state.myQuotes,
          ],
        })),
      removeQuote: (id) =>
        set((state) => ({
          myQuotes: state.myQuotes.filter((q) => q.id !== id),
        })),
    }),
    { name: 'dejalohoy-community' }
  )
);
