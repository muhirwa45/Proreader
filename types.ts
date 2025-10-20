export interface Book {
  id: number;
  title: string;
  author?: string;
  format: string;
  sizeMB: number;
  progressPercent: number;
  lastRead: string;
  isFavorite: boolean;
  file?: File;
  collectionIds?: number[];
}

export interface Collection {
  id: number;
  name: string;
}
