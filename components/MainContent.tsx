import React, { useState, useMemo, useRef } from 'react';
import BookCard from './BookCard';
import BookReader from './BookReader';
import type { Book, Collection } from '../types';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { UploadIcon } from './icons/UploadIcon';

interface MainContentProps {
  activeView: string;
  books: Book[];
  collections: Collection[];
  bookmarks: { [bookId: number]: number[] };
  onToggleFavorite: (id: number) => void;
  onAddBook: (book: Book) => void;
  onCreateCollection: (name: string) => number;
  onToggleBookInCollection: (bookId: number, collectionId: number) => void;
  onToggleBookmark: (bookId: number, pageNum: number) => void;
}

const MainContent: React.FC<MainContentProps> = ({ 
  activeView, 
  books,
  collections,
  bookmarks,
  onToggleFavorite,
  onAddBook,
  onCreateCollection,
  onToggleBookInCollection,
  onToggleBookmark
}) => {
  const [sortBy, setSortBy] = useState<'lastRead' | 'title' | 'progress'>('lastRead');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredBooks = useMemo(() => {
    if (activeView.startsWith('collection-')) {
      const collectionId = parseInt(activeView.split('-')[1], 10);
      return books.filter(book => book.collectionIds?.includes(collectionId));
    }
    switch (activeView) {
      case 'Favorites':
        return books.filter(book => book.isFavorite);
      case 'Reading Now':
      case 'Books & documents':
        return books;
      default:
        return [];
    }
  }, [books, activeView]);

  const sortedBooks = useMemo(() => {
    const sorted = [...filteredBooks];
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
  }, [filteredBooks, sortBy]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const fileName = file.name;
    const lastDot = fileName.lastIndexOf('.');
    let title = lastDot > 0 ? fileName.substring(0, lastDot) : fileName;
    const format = lastDot > 0 ? fileName.substring(lastDot + 1).toUpperCase() : 'N/A';
    const sizeMB = parseFloat((file.size / (1024 * 1024)).toFixed(2));
    let author: string | undefined = undefined;

    if (format === 'PDF') {
      try {
        const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
          fileReader.onerror = (e) => reject(e);
          fileReader.readAsArrayBuffer(file);
        });
        
        const typedArray = new Uint8Array(arrayBuffer);
        const loadingTask = (window as any).pdfjsLib.getDocument(typedArray);
        const pdf = await loadingTask.promise;
        const metadata = await pdf.getMetadata();

        if (metadata.info.Title) {
          title = metadata.info.Title;
        }
        if (metadata.info.Author) {
          author = metadata.info.Author;
        }
      } catch (e) {
        console.error("Failed to parse PDF metadata:", e);
      }
    }

    const newBook: Book = {
      id: Date.now(),
      title: title,
      author: author,
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
      collectionIds: [],
    };
    
    onAddBook(newBook);

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
  
  const currentViewTitle = useMemo(() => {
    if (activeView.startsWith('collection-')) {
      const collectionId = parseInt(activeView.split('-')[1], 10);
      return collections.find(c => c.id === collectionId)?.name || 'Collection';
    }
    return activeView;
  }, [activeView, collections]);

  const showBookContent = !['Authors', 'Series', 'Formats', 'Folders', 'Downloads', 'Trash'].includes(activeView);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-slate-900">{currentViewTitle}</h1>
        {showBookContent && (
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
        )}
      </div>

      {showBookContent ? (
        sortedBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedBooks.map(book => (
              <BookCard 
                key={book.id} 
                book={book} 
                collections={collections}
                onToggleFavorite={onToggleFavorite} 
                onOpenReader={handleOpenReader} 
                onCreateCollection={onCreateCollection}
                onToggleBookInCollection={onToggleBookInCollection}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-500">No books in this view.</p>
          </div>
        )
      ) : (
        <div className="text-center py-20">
          <p className="text-slate-500">This feature is coming soon!</p>
        </div>
      )}


      {isReaderOpen && selectedBook && (
        <BookReader 
          book={selectedBook} 
          onClose={handleCloseReader} 
          bookmarks={bookmarks[selectedBook.id] || []}
          onToggleBookmark={(pageNum) => onToggleBookmark(selectedBook.id, pageNum)}
        />
      )}
    </div>
  );
};

export default MainContent;
