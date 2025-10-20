import React, { useState, useMemo, useRef } from 'react';
import BookCard from './BookCard';
import BookReader from './BookReader';
import type { Book } from '../types';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { UploadIcon } from './icons/UploadIcon';

const initialBooks: Book[] = [
  {
    id: 1,
    title: 'The Architecture - Reference + Specification Book',
    format: 'PDF',
    sizeMB: 9.0,
    progressPercent: 3,
    lastRead: '6/27/2025 09:58 AM',
    isFavorite: false,
  },
  {
    id: 2,
    title: 'Design Drawing, Second Edition - Ching, Francis D.',
    format: 'PDF',
    sizeMB: 81,
    progressPercent: 45,
    lastRead: '6/26/2025 02:30 PM',
    isFavorite: true,
  },
  {
    id: 3,
    title: 'essential-architecture-books-v-1',
    format: 'PDF',
    sizeMB: 48,
    progressPercent: 78,
    lastRead: '6/25/2025 06:00 PM',
    isFavorite: false,
  },
];

const MainContent: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [sortBy, setSortBy] = useState<'lastRead' | 'title' | 'progress'>('lastRead');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sortedBooks = useMemo(() => {
    const sorted = [...books];
    switch (sortBy) {
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'progress':
        sorted.sort((a, b) => b.progressPercent - a.progressPercent);
        break;
      case 'lastRead':
      default:
        sorted.sort((a, b) => new Date(b.lastRead).getTime() - new Date(a.lastRead).getTime());
        break;
    }
    return sorted;
  }, [books, sortBy]);

  const handleToggleFavorite = (id: number) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === id ? { ...book, isFavorite: !book.isFavorite } : book
      )
    );
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const fileName = file.name;
    const lastDot = fileName.lastIndexOf('.');
    const title = lastDot > 0 ? fileName.substring(0, lastDot) : fileName;
    const format = lastDot > 0 ? fileName.substring(lastDot + 1).toUpperCase() : 'N/A';
    const sizeMB = parseFloat((file.size / (1024 * 1024)).toFixed(2));

    const newBook: Book = {
      id: Date.now(),
      title: title,
      format: format,
      sizeMB: sizeMB,
      progressPercent: 0,
      lastRead: new Date().toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).replace(',', ''),
      isFavorite: false,
      file: file,
    };
    
    setBooks(prevBooks => [newBook, ...prevBooks]);

    if(event.target) {
        event.target.value = '';
    }
  };

  const handleOpenReader = (book: Book) => {
    setSelectedBook(book);
    setIsReaderOpen(true);
  }

  const handleCloseReader = () => {
    setIsReaderOpen(false);
    setSelectedBook(null);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-slate-900">Reading Now</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleUploadClick}
            className="flex items-center gap-2 bg-brand-teal-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-brand-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal-500 transition-colors"
          >
            <UploadIcon className="w-5 h-5" />
            <span>Upload Book</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.epub,.mobi,.azw3"
          />
          <div className="relative">
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'lastRead' | 'title' | 'progress')}
              className="appearance-none bg-white border border-slate-300 rounded-md py-2 pl-3 pr-10 text-sm font-medium text-slate-700 hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-teal-500 focus:border-brand-teal-500"
              aria-label="Sort books by"
            >
              <option value="lastRead">Last Read</option>
              <option value="title">Title</option>
              <option value="progress">Progress</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <ChevronDownIcon className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedBooks.map(book => (
          <BookCard key={book.id} book={book} onToggleFavorite={handleToggleFavorite} onOpenReader={handleOpenReader} />
        ))}
      </div>

      {isReaderOpen && selectedBook && (
        <BookReader book={selectedBook} onClose={handleCloseReader} />
      )}
    </div>
  );
};

export default MainContent;