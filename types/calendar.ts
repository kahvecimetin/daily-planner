export type ViewType = 'year' | 'month' | 'week' | 'day';

export interface DayData {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasNotes: boolean;
}

export const DAYS_TR = ['Pzt', 'Sal', 'Car', 'Per', 'Cum', 'Cmt', 'Paz'];
export const DAYS_FULL_TR = ['Pazartesi', 'Sali', 'Carsamba', 'Persembe', 'Cuma', 'Cumartesi', 'Pazar'];
export const MONTHS_TR = [
  'Ocak', 'Subat', 'Mart', 'Nisan', 'Mayis', 'Haziran',
  'Temmuz', 'Agustos', 'Eylul', 'Ekim', 'Kasim', 'Aralik'
];
