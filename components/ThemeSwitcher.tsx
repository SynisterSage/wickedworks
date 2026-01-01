
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';

type Theme = 'system' | 'light' | 'dark';

const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement;
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(newTheme);
    }
    localStorage.setItem('theme', newTheme);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const getIndicatorOffset = () => {
    if (theme === 'system') return '0%';
    if (theme === 'light') return '33.333%';
    return '66.666%';
  };

  return (
    <div className="flex items-center gap-6">
      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-text-primary/10 hidden md:block">DISPLAY_CORE</span>
      
      <div className="relative flex items-center bg-bg-contrast-03 w-[120px] h-10 overflow-hidden rounded-sm">
        {/* Sliding Technical Handle */}
        <div 
          className="absolute top-0 bottom-0 w-1/3 bg-neonRed transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-neon z-0"
          style={{
            left: getIndicatorOffset(),
          }}
        />
        
        <button 
          onClick={() => handleThemeChange('system')}
          className={`relative z-10 flex-1 h-full flex items-center justify-center transition-colors duration-500 ${theme === 'system' ? 'text-white' : 'text-text-primary/40 hover:text-text-primary/60'}`}
          aria-label="System Theme"
        >
          <Icons.Monitor />
        </button>
        <button 
          onClick={() => handleThemeChange('light')}
          className={`relative z-10 flex-1 h-full flex items-center justify-center transition-colors duration-500 ${theme === 'light' ? 'text-white' : 'text-text-primary/40 hover:text-text-primary/60'}`}
          aria-label="Light Theme"
        >
          <Icons.Sun />
        </button>
        <button 
          onClick={() => handleThemeChange('dark')}
          className={`relative z-10 flex-1 h-full flex items-center justify-center transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-text-primary/40 hover:text-text-primary/60'}`}
          aria-label="Dark Theme"
        >
          <Icons.Moon />
        </button>
      </div>
    </div>
  );
};

export default ThemeSwitcher;