export interface Note {
  id: string;
  date: string; // YYYY-MM-DD format
  content: string;
  color: string;
  createdAt: Date;
}

export const NOTE_COLORS = [
  '#FFFFFF',
  '#FFF9C4',
  '#FFCCBC',
  '#F8BBD9',
  '#E1BEE7',
  '#C5CAE9',
  '#B3E5FC',
  '#C8E6C9',
];
