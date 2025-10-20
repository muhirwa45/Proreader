
import React from 'react';
import { MenuIcon } from './icons/MenuIcon';
import { BookIcon } from './icons/BookIcon';
import { SearchIcon } from './icons/SearchIcon';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="flex-shrink-0 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button onClick={onMenuClick} className="text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-teal-500 lg:hidden">
            <MenuIcon className="h-6 w-6" />
          </button>
          <div className="flex items-center ml-4 lg:ml-0">
            <BookIcon className="h-8 w-8 text-brand-teal-500" />
            <span className="ml-2 text-xl font-semibold text-slate-800">ReadEra</span>
          </div>
        </div>
        <div className="flex items-center">
          <button className="p-2 text-slate-500 rounded-full hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal-500">
            <SearchIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
