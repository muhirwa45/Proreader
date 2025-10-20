import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  effective: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
};

const getSystemPreference = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

const applyThemeClass = (mode: 'light' | 'dark') => {
  if (typeof document === 'undefined') return;
  if (mode === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem('theme') as Theme | null;
      return stored || 'system';
    } catch {
      return 'system';
    }
  });

  useEffect(() => {
    const effective = theme === 'system' ? getSystemPreference() : theme;
    applyThemeClass(effective);

    try {
      localStorage.setItem('theme', theme);
    } catch {}

    let mql: MediaQueryList | null = null;
    const handleSystemChange = () => {
      if (theme === 'system') {
        applyThemeClass(getSystemPreference());
      }
    };

    if (theme === 'system' && typeof window !== 'undefined' && window.matchMedia) {
      mql = window.matchMedia('(prefers-color-scheme: dark)');
      if (mql.addEventListener) {
        mql.addEventListener('change', handleSystemChange);
      } else {
        mql.addListener(handleSystemChange);
      }
    }

    return () => {
      if (mql) {
        if (mql.removeEventListener) {
          mql.removeEventListener('change', handleSystemChange);
        } else {
          mql.removeListener(handleSystemChange);
        }
      }
    };
  }, [theme]);

  const effective = typeof window !== 'undefined' && theme === 'system' ? getSystemPreference() : (theme === 'system' ? 'light' : theme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, effective }}>
      {children}
    </ThemeContext.Provider>
  );
};
