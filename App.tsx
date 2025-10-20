import React, { useState, useEffect, createContext } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Settings from './components/Settings';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
});

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('Reading Now');
  const [theme, setTheme] = useState(() => {
    // Get saved theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    // Save theme to localStorage and apply class to <html> element
    localStorage.setItem('theme', theme);
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className="flex h-screen bg-slate-50 text-slate-800">
        <Sidebar 
          isOpen={sidebarOpen} 
          activeView={activeView}
          onNavigate={setActiveView} 
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50">
            {activeView === 'Settings' 
              ? <Settings /> 
              : <MainContent activeView={activeView} />
            }
          </main>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;