import React, { useState } from 'react';
import type { Book, Collection } from '../types';
import { FavoritesIcon } from './icons/FavoritesIcon';
import { ClockIcon } from './icons/ClockIcon';
import { CheckIcon } from './icons/CheckIcon';
import { UserIcon } from './icons/UserIcon';
import { MoreVerticalIcon } from './icons/MoreVerticalIcon';
import CollectionMenu from './CollectionMenu';

interface BookCardProps {
  book: Book;
  collections: Collection[];
  onToggleFavorite: (id: number) => void;
  onOpenReader: (book: Book) => void;
  onCreateCollection: (name: string) => number;
  onToggleBookInCollection: (bookId: number, collectionId: number) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, collections, onToggleFavorite, onOpenReader, onCreateCollection, onToggleBookInCollection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getInitial = (title: string) => {
    const firstChar = title.charAt(0).toUpperCase();
    return /[a-zA-Z]/.test(firstChar) ? firstChar : title.charAt(1).toUpperCase();
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(book.id);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(prev => !prev);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col space-y-3"
    >
      <div 
        className="flex-grow cursor-pointer"
        onClick={() => onOpenReader(book)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onOpenReader(book)}
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-brand-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-2xl font-bold">{getInitial(book.title)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate" title={book.title}>
              {book.title}
            </p>
            {book.author && (
              <div className="flex items-center text-xs text-slate-500 mt-1">
                <UserIcon className="w-3 h-3 mr-1.5 flex-shrink-0 text-slate-400" />
                <span className="truncate" title={book.author}>{book.author}</span>
              </div>
            )}
            <p className="text-xs text-slate-500 mt-1">
              {book.format}, {book.sizeMB} MB
            </p>
          </div>
        </div>
        
        <div className="pt-3">
          <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div 
              className="bg-brand-teal-500 h-1.5 rounded-full" 
              style={{ width: `${book.progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-slate-500 pt-2">
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleFavoriteClick} 
            aria-label={book.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal-500 rounded-full p-1"
          >
            <FavoritesIcon className={`h-5 w-5 ${book.isFavorite ? 'text-yellow-400 fill-current' : 'hover:text-yellow-400'}`} />
          </button>
          <ClockIcon className="h-5 w-5" />
          <CheckIcon className="h-5 w-5" />
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs">
            {book.progressPercent}%, {book.lastRead}
          </p>
          <div className="relative">
            <button 
              onClick={handleMenuClick} 
              aria-label="More options"
              className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal-500 rounded-full p-1"
            >
              <MoreVerticalIcon className="h-5 w-5" />
            </button>
            {isMenuOpen && (
              <CollectionMenu
                book={book}
                collections={collections}
                onCreateCollection={onCreateCollection}
                onToggleBookInCollection={onToggleBookInCollection}
                onClose={() => setIsMenuOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
