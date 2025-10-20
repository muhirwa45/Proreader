import React, { useContext } from 'react';
import {
  ReadingNowIcon, BookOpenIcon, FavoritesIcon, ClockIcon, HaveReadIcon, UserIcon, SeriesIcon,
  CollectionsIcon, FormatsIcon, FolderIcon, DownloadIcon, TrashIcon, SettingsIcon
} from './icons/index';
import { ThemeContext } from '../App';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface SidebarProps {
  isOpen: boolean;
}

const navItems = [
  { icon: ReadingNowIcon, label: 'Reading Now', active: true },
  { icon: BookOpenIcon, label: 'Books & documents' },
  { icon: FavoritesIcon, label: 'Favorites' },
  { icon: ClockIcon, label: 'To Read' },
  { icon: HaveReadIcon, label: 'Have Read' },
  { icon: UserIcon, label: 'Authors' },
  { icon: SeriesIcon, label: 'Series' },
  { icon: CollectionsIcon, label: 'Collections' },
  { icon: FormatsIcon, label: 'Formats' },
  { icon: FolderIcon, label: 'Folders' },
  { icon: DownloadIcon, label: 'Downloads' },
  { icon: TrashIcon, label: 'Trash' },
];

const NavItem: React.FC<{ icon: React.ElementType, label: string, active?: boolean }> = ({ icon: Icon, label, active }) => {
  return (
    <a href="#" className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md group ${active ? 'bg-brand-teal-50 text-brand-teal-600' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
      <div className={`absolute left-0 w-1 h-6 rounded-r-full ${active ? 'bg-brand-teal-500' : 'bg-transparent'}`}></div>
      <Icon className={`mr-3 h-5 w-5 ${active ? 'text-brand-teal-500' : 'text-slate-400 group-hover:text-slate-500'}`} />
      {label}
    </a>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <aside className={`bg-white border-r border-slate-200 flex-shrink-0 w-64 p-4 flex-col ${isOpen ? 'flex' : 'hidden'} lg:flex`}>
      <nav className="flex-1 space-y-1">
        {navItems.map(item => <NavItem key={item.label} icon={item.icon} label={item.label} active={item.active} />)}
      </nav>
      <div className="mt-auto">
        <div className="border-t border-slate-200 -mx-4 my-4"></div>
        <div className="px-4 py-2.5">
          <label htmlFor="theme-select" className="flex items-center text-sm font-medium text-slate-600 group mb-2">
            <SettingsIcon className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500" />
            <span>Theme</span>
          </label>
          <div className="relative">
            <select
              id="theme-select"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full appearance-none bg-white border border-slate-300 rounded-md py-2 pl-3 pr-10 text-sm font-medium text-slate-700 hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-teal-500 focus:border-brand-teal-500"
              aria-label="Select theme"
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
              <option value="dark-blue">Dark Blue Mode</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <ChevronDownIcon className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;