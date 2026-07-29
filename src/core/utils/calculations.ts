import { differenceInSeconds } from 'date-fns';

export interface FreeTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Calcula el tiempo transcurrido desde el inicio.
 */
export const calculateFreeTime = (startDate: Date, currentDate: Date = new Date()): FreeTime => {
  const diffInSeconds = differenceInSeconds(currentDate, startDate);
  if (diffInSeconds < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const days = Math.floor(diffInSeconds / (3600 * 24));
  const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = diffInSeconds % 60;

  return { days, hours, minutes, seconds };
};

/**
 * Calcula el tiempo transcurrido exacto en días (decimal).
 */
export const calculateFreeTimeInDays = (startDate: Date, currentDate: Date = new Date()): number => {
  const diffInSeconds = differenceInSeconds(currentDate, startDate);
  if (diffInSeconds < 0) return 0;
  return diffInSeconds / (3600 * 24);
};

/**
 * Calcula el dinero ahorrado.
 */
export const calculateMoneySaved = (
  freeTimeInDays: number,
  cigsPerDay: number,
  cigsPerPack: number,
  pricePerPack: number
): number => {
  const packsAvoided = (freeTimeInDays * cigsPerDay) / cigsPerPack;
  return packsAvoided * pricePerPack;
};

/**
 * Calcula los cigarrillos NO fumados.
 */
export const calculateCigsAvoided = (freeTimeInDays: number, cigsPerDay: number): number => {
  return freeTimeInDays * cigsPerDay;
};

export interface LifeRecovered {
  days: number;
  hours: number;
  minutes: number;
}

/**
 * Calcula la vida recuperada basándose en 11 min por cigarrillo.
 */
export const calculateLifeRecovered = (cigsAvoided: number): LifeRecovered => {
  const totalMinutes = cigsAvoided * 11;
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = Math.floor(totalMinutes % 60);
  
  return { days, hours, minutes };
};
