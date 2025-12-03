import { DayData } from '@/types/calendar';

export const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getMonthDays = (year: number, month: number, noteDates: Set<string>): DayData[] => {
  const days: DayData[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(year, month, 1);
  const dayOfWeek = firstDay.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() + diff);

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateKey = formatDateKey(date);

    days.push({
      date,
      isCurrentMonth: date.getMonth() === month,
      isToday: date.toDateString() === today.toDateString(),
      hasNotes: noteDates.has(dateKey),
    });
  }

  return days;
};

export const getWeekDays = (date: Date, noteDates: Set<string>): DayData[] => {
  const days: DayData[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfWeek = getStartOfWeek(date);

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + i);
    const dateKey = formatDateKey(currentDate);

    days.push({
      date: currentDate,
      isCurrentMonth: true,
      isToday: currentDate.toDateString() === today.toDateString(),
      hasNotes: noteDates.has(dateKey),
    });
  }

  return days;
};

export const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

export const getEndOfWeek = (date: Date): Date => {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return end;
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const addYears = (date: Date, years: number): Date => {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
};
