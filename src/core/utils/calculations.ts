import { differenceInSeconds } from 'date-fns';

export interface FreeTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const calculateFreeTime = (startDate: Date, currentDate: Date = new Date()): FreeTime => {
  const diffInSeconds = differenceInSeconds(currentDate, startDate);
  if (diffInSeconds < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const days = Math.floor(diffInSeconds / (3600 * 24));
  const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = diffInSeconds % 60;

  return { days, hours, minutes, seconds };
};

export const calculateFreeTimeInDays = (startDate: Date, currentDate: Date = new Date()): number => {
  const diffInSeconds = differenceInSeconds(currentDate, startDate);
  if (diffInSeconds < 0) return 0;
  return diffInSeconds / (3600 * 24);
};

export const calculateMoneySaved = (
  freeTimeInDays: number,
  cigsPerDay: number,
  cigsPerPack: number,
  pricePerPack: number
): number => {
  const days = Math.max(0, freeTimeInDays || 0);
  const perDay = Math.max(0, cigsPerDay || 0);
  const perPack = Math.max(0, cigsPerPack || 0);
  const price = Math.max(0, pricePerPack || 0);

  if (perPack === 0 || perDay === 0) return 0;

  const packsAvoided = (days * perDay) / perPack;
  return Math.round(packsAvoided * price * 100) / 100;
};

export const calculateCigsAvoided = (freeTimeInDays: number, cigsPerDay: number): number => {
  const days = Math.max(0, freeTimeInDays || 0);
  const perDay = Math.max(0, cigsPerDay || 0);
  return days * perDay;
};

export interface LifeRecovered {
  days: number;
  hours: number;
  minutes: number;
}

export const calculateLifeRecovered = (cigsAvoided: number): LifeRecovered => {
  const totalMinutes = cigsAvoided * 11;
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = Math.floor(totalMinutes % 60);
  
  return { days, hours, minutes };
};
