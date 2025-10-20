import React, { useState, useEffect, createContext } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Settings from './components/Settings';
import type { Book, Collection } from './types';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
});

const initialBooks: Book[] = [
  {
    id: 1,
    title: 'The Architecture Reference & Specification Book',
    author: 'Julia McMorrough',
    format: 'PDF',
    sizeMB: 9.0,
    progressPercent: 3,
    lastRead: '6/27/2025 09:58 AM',
    isFavorite: false,
    collectionIds: [1],
  },
  {
    id: 2,
    title: 'Design Drawing, Second Edition',
    author: 'Francis D. K. Ching',
    format: 'PDF',
    sizeMB: 81,
    progressPercent: 45,
    lastRead: '6/26/2025 02:30 PM',
    isFavorite: true,
    collectionIds: [1],
  },
  {
    id: 3,
    title: 'Essential Architecture Books v1',
    author: 'Various Authors',
    format: 'PDF',
    sizeMB: 48,
    progressPercent: 78,
    lastRead: '6/25/2025 06:00 PM',
    isFavorite: false,
  },
];

const initialCollections: Collection[] = [
  { id: 1, name: 'Architecture' },
];

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('Reading Now');
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [bookmarks, setBookmarks] = useState<{ [bookId: number]: number[] }>({
    2: [5, 12, 23],
  });
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.className = theme;
  }, [theme]);

  const handleToggleFavorite = (id: number) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === id ? { ...book, isFavorite: !book.isFavorite } : book
      )
    );
  };

  const handleAddBook = (newBook: Book) => {
    setBooks(prevBooks => [newBook, ...prevBooks]);
  };

  const createCollection = (name: string): number => {
    const newCollection: Collection = { id: Date.now(), name };
    setCollections(prev => [...prev, newCollection]);
    return newCollection.id;
  };
  
  const renameCollection = (id: number, newName: string) => {
    setCollections(prev => prev.map(c => c.id === id ? { ...c, name: newName } : c));
  };
  
  const toggleBookInCollection = (bookId: number, collectionId: number) => {
    setBooks(prevBooks => prevBooks.map(book => {
      if (book.id === bookId) {
        const collectionIds = book.collectionIds || [];
        const isInCollection = collectionIds.includes(collectionId);
        const newCollectionIds = isInCollection 
          ? collectionIds.filter(id => id !== collectionId)
          : [...collectionIds, collectionId];
        return { ...book, collectionIds: newCollectionIds };
      }
      return book;
    }));
  };

  const handleToggleBookmark = (bookId: number, pageNum: number) => {
    setBookmarks(prev => {
        const currentBookmarks = prev[bookId] || [];
        const newBookmarks = currentBookmarks.includes(pageNum)
            ? currentBookmarks.filter(p => p !== pageNum)
            : [...currentBookmarks, pageNum].sort((a, b) => a - b);
        return { ...prev, [bookId]: newBookmarks };
    });
  };


  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className="flex h-screen bg-slate-50 text-slate-800">
        <Sidebar 
          isOpen={sidebarOpen} 
          activeView={activeView}
          onNavigate={setActiveView} 
          collections={collections}
          onRenameCollection={renameCollection}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50">
            {activeView === 'Settings' 
              ? <Settings /> 
              : <MainContent 
                  activeView={activeView} 
                  books={books}
                  collections={collections}
                  bookmarks={bookmarks}
                  onToggleFavorite={handleToggleFavorite}
                  onAddBook={handleAddBook}
                  onCreateCollection={createCollection}
                  onToggleBookInCollection={toggleBookInCollection}
                  onToggleBookmark={handleToggleBookmark}
                />
            }
          </main>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
