import React from 'react';
import { useTheme } from './ThemeProvider';

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-4 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm">
      <h3 className="text-lg font-medium mb-3">Appearance</h3>

      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="theme"
            checked={theme === 'light'}
            onChange={() => setTheme('light')}
            className="form-radio"
          />
          <span>Light</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="theme"
            checked={theme === 'dark'}
            onChange={() => setTheme('dark')}
            className="form-radio"
          />
          <span>Dark</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="theme"
            checked={theme === 'system'}
            onChange={() => setTheme('system')}
            className="form-radio"
          />
          <span>System (follow OS)</span>
        </label>
      </div>
    </div>
  );
};

export default Settings;
