import React, { useContext } from 'react';
import { ThemeContext } from '../App';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { SettingsIcon } from './icons/SettingsIcon';

const Settings: React.FC = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Settings</h1>
      
      <div className="max-w-md bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <label htmlFor="theme-select" className="flex items-center text-lg font-medium text-slate-800 group mb-3">
          <SettingsIcon className="mr-3 h-6 w-6 text-slate-500" />
          <span>Theme</span>
        </label>
        <p className="text-sm text-slate-600 mb-4">
          Choose how you want the application to look. Your preference will be saved for your next visit.
        </p>
        <div className="relative">
          <select
            id="theme-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full appearance-none bg-white border border-slate-300 rounded-md py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal-500 focus:border-brand-teal-500"
            aria-label="Select theme"
          >
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
            <option value="dark-blue">Dark Blue Mode</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
            <ChevronDownIcon className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;