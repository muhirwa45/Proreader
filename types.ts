
export interface Book {
  id: number;
  title: string;
  format: string;
  sizeMB: number;
  progressPercent: number;
  lastRead: string;
  isFavorite: boolean;
  file?: File;
}