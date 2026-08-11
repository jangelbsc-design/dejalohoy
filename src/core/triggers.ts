import { Wind, UtensilsCrossed, Coffee, Beer, Hourglass, Briefcase, Eye, Activity, Moon, Smartphone, Pencil } from 'lucide-react';

export const TRIGGER_OPTIONS = [
  { key: 'estres',        label: '😤 Estrés',                  tip: 'Respira: inhala 4 seg, retén 7, exhala 8. El antojo pasa en 3-5 min. Una caminata rápida libera la tensión al instante.' },
  { key: 'despues_comer', label: '🍽️ Después de comer',         tip: 'Levántate de la mesa enseguida. Cepíllate los dientes o tomá un vaso de agua fría. El nuevo ritual rompe la asociación.' },
  { key: 'cafe',          label: '☕ Café',                      tip: 'Probá tomarlo en otro lugar o con la otra mano. El contexto nuevo rompe la asociación. Añadí un chicle sin azúcar.' },
  { key: 'alcohol',       label: '🍺 Cerveza / Alcohol',         tip: 'El alcohol baja la guardia. Cambiá tu bebida esta semana o avisale a alguien de confianza tu plan.' },
  { key: 'aburrimiento',  label: '😴 Aburrimiento',              tip: 'Mantén manos y mente ocupadas. Jugá al Tetris, llamá a alguien, hacé algo físico. El aburrimiento dura segundos si lo atacás.' },
  { key: 'trabajo',       label: '💼 Problemas laborales',       tip: 'Salí del lugar 3 minutos. Anotalo en el Diario antes de que el impulso suba. El cigarro no resuelve nada — escribirlo sí.' },
  { key: 'ver_fumar',     label: '👀 Ver a alguien fumar',       tip: 'Alejate físicamente. Recordá: ellos están atrapados, vos estás libre. La imagen pasa, el antojo también.' },
  { key: 'ansiedad',      label: '😰 Ansiedad / Nervios',        tip: 'Técnica 5-4-3-2-1: nombrá 5 cosas que ves, 4 que tocás, 3 que escuchás, 2 que olés, 1 que saboreás. Te ancla al presente.' },
  { key: 'noche',         label: '🌙 Noche / Insomnio',          tip: 'Tomá agua fría, salí al balcón o abrí la ventana, poné música tranquila. El antojo nocturno es corto si no te quedás quieto.' },
  { key: 'redes',         label: '📱 Redes sociales / Pantallas', tip: 'Tomá el teléfono con intención. Poné una alarma de 5 min y hacé otra cosa. El scroll activa el piloto automático.' },
  { key: 'otro',          label: '✏️ Otro...',                    tip: 'Anotaste algo específico. Revisalo en tu historial — ese detalle es clave para conocer tu mapa personal de ansiedad.' },
] as const;

export type TriggerKey = (typeof TRIGGER_OPTIONS)[number]['key'];

export const TRIGGER_ICONS = {
  estres: Wind,
  despues_comer: UtensilsCrossed,
  cafe: Coffee,
  alcohol: Beer,
  aburrimiento: Hourglass,
  trabajo: Briefcase,
  ver_fumar: Eye,
  ansiedad: Activity,
  noche: Moon,
  redes: Smartphone,
  otro: Pencil,
} as const;

export interface TriggerChoice {
  key: string;
  label: string;
  customText?: string;
}
