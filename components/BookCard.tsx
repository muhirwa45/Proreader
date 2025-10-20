import React from 'react';
import type { Book } from '../types';
import { FavoritesIcon } from './icons/FavoritesIcon';
import { ClockIcon } from './icons/ClockIcon';
import { CheckIcon } from './icons/CheckIcon';

interface BookCardProps {
  book: Book;
  onToggleFavorite: (id: number) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onToggleFavorite }) => {
  const getInitial = (title: string) => {
    const firstChar = title.charAt(0).toUpperCase();
    return /[a-zA-Z]/.test(firstChar) ? firstChar : title.charAt(1).toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col space-y-3">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-brand-teal-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-2xl font-bold">{getInitial(book.title)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate" title={book.title}>
            {book.title}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {book.format}, {book.sizeMB} MB
          </p>
        </div>
      </div>
      
      <div>
        <div className="w-full bg-slate-200 rounded-full h-1.5">
          <div 
            className="bg-brand-teal-500 h-1.5 rounded-full" 
            style={{ width: `${book.progressPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between text-slate-500">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => onToggleFavorite(book.id)} 
            aria-label={book.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal-500 rounded-full"
          >
            <FavoritesIcon className={`h-5 w-5 cursor-pointer ${book.isFavorite ? 'text-yellow-400 fill-current' : 'hover:text-yellow-400'}`} />
          </button>
          <ClockIcon className="h-5 w-5 cursor-pointer hover:text-slate-700" />
          <CheckIcon className="h-5 w-5 cursor-pointer hover:text-slate-700" />
        </div>
        <p className="text-xs">
          {book.progressPercent}%, {book.lastRead}
        </p>
      </div>
    </div>
  );
};

export default BookCard;
