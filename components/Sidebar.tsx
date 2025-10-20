import React, { useState } from 'react';
import {
  ReadingNowIcon, BookOpenIcon, FavoritesIcon, ClockIcon, HaveReadIcon, UserIcon, SeriesIcon,
  CollectionsIcon, FormatsIcon, FolderIcon, DownloadIcon, TrashIcon, SettingsIcon, PencilIcon
} from './icons/index';
import type { Collection } from '../types';

interface SidebarProps {
  isOpen: boolean;
  activeView: string;
  onNavigate: (view: string) => void;
  collections: Collection[];
  onRenameCollection: (id: number, newName: string) => void;
}

const navItems = [
  { icon: ReadingNowIcon, label: 'Reading Now' },
  { icon: BookOpenIcon, label: 'Books & documents' },
  { icon: FavoritesIcon, label: 'Favorites' },
  { icon: ClockIcon, label: 'To Read' },
  { icon: HaveReadIcon, label: 'Have Read' },
  { icon: UserIcon, label: 'Authors' },
  { icon: SeriesIcon, label: 'Series' },
  // { icon: CollectionsIcon, label: 'Collections' },
  { icon: FormatsIcon, label: 'Formats' },
];

const systemItems = [
  { icon: FolderIcon, label: 'Folders' },
  { icon: DownloadIcon, label: 'Downloads' },
  { icon: TrashIcon, label: 'Trash' },
  { icon: SettingsIcon, label: 'Settings' },
];

const NavItem: React.FC<{ icon: React.ElementType, label: string, active: boolean, onClick: () => void, children?: React.ReactNode }> = ({ icon: Icon, label, active, onClick, children }) => {
  return (
    <div className="relative">
      <button onClick={onClick} className={`flex w-full items-center px-4 py-2.5 text-sm font-medium rounded-md group text-left ${active ? 'bg-brand-teal-50 text-brand-teal-600' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
        <div className={`absolute left-0 w-1 h-6 rounded-r-full ${active ? 'bg-brand-teal-500' : 'bg-transparent'}`}></div>
        <Icon className={`mr-3 h-5 w-5 ${active ? 'text-brand-teal-500' : 'text-slate-400 group-hover:text-slate-500'}`} />
        {label}
      </button>
      {children && <div className="absolute right-2 top-0 bottom-0 flex items-center">{children}</div>}
    </div>
  );
};


const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeView, onNavigate, collections, onRenameCollection }) => {
  const [editingCollectionId, setEditingCollectionId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleRenameClick = (collection: Collection) => {
    setEditingCollectionId(collection.id);
    setEditingName(collection.name);
  };

  const handleRenameSubmit = () => {
    if (editingCollectionId && editingName.trim()) {
      onRenameCollection(editingCollectionId, editingName.trim());
    }
    setEditingCollectionId(null);
    setEditingName('');
  };

  return (
    <aside className={`bg-white border-r border-slate-200 flex-shrink-0 w-64 p-4 flex-col ${isOpen ? 'flex' : 'hidden'} lg:flex`}>
      <nav className="flex-1 space-y-1">
        {navItems.map(item => <NavItem key={item.label} icon={item.icon} label={item.label} active={activeView === item.label} onClick={() => onNavigate(item.label)} />)}
        
        {/* Collections Section */}
        <div className="pt-2">
            <NavItem 
              key="Collections" 
              icon={CollectionsIcon} 
              label="Collections" 
              active={activeView === 'Collections'} 
              onClick={() => onNavigate('Collections')} 
            />
             <div className="pl-5 mt-1 space-y-1 border-l border-slate-200 ml-4">
               {collections.map(collection => (
                 editingCollectionId === collection.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={handleRenameSubmit}
                    onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
                    className="w-full text-sm p-2 rounded-md border border-brand-teal-500 ring-brand-teal-500 focus:outline-none"
                    autoFocus
                  />
                 ) : (
                  <NavItem 
                    key={collection.id} 
                    icon={() => <span className="w-5 text-center text-slate-400">#</span>} 
                    label={collection.name} 
                    active={activeView === `collection-${collection.id}`} 
                    onClick={() => onNavigate(`collection-${collection.id}`)}
                  >
                    <button onClick={() => handleRenameClick(collection)} className="p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity rounded-full hover:bg-slate-200">
                      <PencilIcon className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  </NavItem>
                 )
              ))}
            </div>
        </div>

      </nav>
      <div className="mt-auto">
        <div className="border-t border-slate-200 -mx-4 my-4"></div>
        <div className="space-y-1">
          {systemItems.map(item => <NavItem key={item.label} icon={item.icon} label={item.label} active={activeView === item.label} onClick={() => onNavigate(item.label)} />)}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;