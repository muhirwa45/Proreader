import React, { useState, useRef, useEffect } from 'react';
import type { Book, Collection } from '../types';
import { CheckIcon } from './icons/CheckIcon';

interface CollectionMenuProps {
  book: Book;
  collections: Collection[];
  onClose: () => void;
  onCreateCollection: (name: string) => number;
  onToggleBookInCollection: (bookId: number, collectionId: number) => void;
}

const CollectionMenu: React.FC<CollectionMenuProps> = ({ book, collections, onClose, onCreateCollection, onToggleBookInCollection }) => {
  const [newCollectionName, setNewCollectionName] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleCreateAndAdd = () => {
    if (newCollectionName.trim()) {
      const newCollectionId = onCreateCollection(newCollectionName.trim());
      onToggleBookInCollection(book.id, newCollectionId);
      setNewCollectionName('');
    }
  };

  return (
    <div
      ref={menuRef}
      className="absolute right-0 bottom-full mb-2 w-64 bg-white rounded-lg shadow-2xl border border-slate-200 z-10 p-2"
    >
      <p className="text-xs font-semibold text-slate-600 px-2 pt-1 pb-2">Add to collection</p>
      <div className="max-h-32 overflow-y-auto pr-1">
        {collections.map(collection => {
          const isChecked = book.collectionIds?.includes(collection.id) ?? false;
          return (
            <label key={collection.id} className="flex items-center w-full px-2 py-1.5 text-sm text-slate-700 rounded-md hover:bg-slate-100 cursor-pointer">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggleBookInCollection(book.id, collection.id)}
                className="h-4 w-4 rounded border-slate-300 text-brand-teal-600 focus:ring-brand-teal-500"
              />
              <span className="ml-3 truncate">{collection.name}</span>
            </label>
          )
        })}
      </div>
      <div className="border-t border-slate-200 my-2"></div>
      <div className="px-2 pb-1">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateAndAdd()}
            placeholder="New collection..."
            className="w-full text-sm border-slate-300 rounded-md shadow-sm focus:ring-brand-teal-500 focus:border-brand-teal-500"
          />
          <button 
            onClick={handleCreateAndAdd}
            className="bg-brand-teal-500 text-white p-2 rounded-md hover:bg-brand-teal-600 disabled:opacity-50"
            disabled={!newCollectionName.trim()}
          >
            <CheckIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionMenu;