import React from 'react';
import {
  ReadingNowIcon, BookOpenIcon, FavoritesIcon, ClockIcon, HaveReadIcon, UserIcon, SeriesIcon,
  CollectionsIcon, FormatsIcon, FolderIcon, DownloadIcon, TrashIcon, SettingsIcon
} from './icons/index';

interface SidebarProps {
  isOpen: boolean;
  activeView: string;
  onNavigate: (view: string) => void;
}

const navItems = [
  { icon: ReadingNowIcon, label: 'Reading Now' },
  { icon: BookOpenIcon, label: 'Books & documents' },
  { icon: FavoritesIcon, label: 'Favorites' },
  { icon: ClockIcon, label: 'To Read' },
  { icon: HaveReadIcon, label: 'Have Read' },
  { icon: UserIcon, label: 'Authors' },
  { icon: SeriesIcon, label: 'Series' },
  { icon: CollectionsIcon, label: 'Collections' },
  { icon: FormatsIcon, label: 'Formats' },
];

const systemItems = [
  { icon: FolderIcon, label: 'Folders' },
  { icon: DownloadIcon, label: 'Downloads' },
  { icon: TrashIcon, label: 'Trash' },
  { icon: SettingsIcon, label: 'Settings' },
];

const NavItem: React.FC<{ icon: React.ElementType, label: string, active: boolean, onClick: () => void }> = ({ icon: Icon, label, active, onClick }) => {
  return (
    <button onClick={onClick} className={`flex w-full items-center px-4 py-2.5 text-sm font-medium rounded-md group text-left ${active ? 'bg-brand-teal-50 text-brand-teal-600' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
      <div className={`absolute left-0 w-1 h-6 rounded-r-full ${active ? 'bg-brand-teal-500' : 'bg-transparent'}`}></div>
      <Icon className={`mr-3 h-5 w-5 ${active ? 'text-brand-teal-500' : 'text-slate-400 group-hover:text-slate-500'}`} />
      {label}
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeView, onNavigate }) => {
  return (
    <aside className={`bg-white border-r border-slate-200 flex-shrink-0 w-64 p-4 flex-col ${isOpen ? 'flex' : 'hidden'} lg:flex`}>
      <nav className="flex-1 space-y-1">
        {navItems.map(item => <NavItem key={item.label} icon={item.icon} label={item.label} active={activeView === item.label} onClick={() => onNavigate(item.label)} />)}
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