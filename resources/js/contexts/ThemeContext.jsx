import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = {
  COMIC: 'comic',
  PROFESSIONAL: 'professional',
  HACKER: 'hacker',
  TERMINAL: 'terminal',
  DARK: 'dark',
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app_theme') || THEMES.COMIC;
  });

  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    // Update body class for global styles
    let bodyClass = '';
    switch(theme) {
      case THEMES.PROFESSIONAL: 
        bodyClass = 'font-sans bg-slate-50 text-slate-900 antialiased'; 
        break;
      case THEMES.HACKER: 
        bodyClass = 'font-mono bg-black text-green-500 antialiased selection:bg-green-900 selection:text-white'; 
        break;
      case THEMES.TERMINAL: 
        bodyClass = 'font-mono bg-slate-950 text-amber-500 antialiased selection:bg-amber-900 selection:text-white'; 
        break;
      case THEMES.DARK: 
        bodyClass = 'font-sans bg-gray-900 text-gray-100 antialiased selection:bg-blue-900 selection:text-white'; 
        break;
      default: 
        bodyClass = 'font-comic bg-yellow-50 text-black'; 
        break;
    }
    document.body.className = bodyClass;
  }, [theme]);

  const toggleTheme = () => {
    // Cycle through themes: Comic -> Professional -> Dark -> Hacker -> Terminal
    const themeOrder = [THEMES.COMIC, THEMES.PROFESSIONAL, THEMES.DARK, THEMES.HACKER, THEMES.TERMINAL];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      setTheme,
      THEMES, // Export THEMES constant through context
      isProfessional: theme === THEMES.PROFESSIONAL,
      isComic: theme === THEMES.COMIC,
      isHacker: theme === THEMES.HACKER,
      isTerminal: theme === THEMES.TERMINAL,
      isDark: theme === THEMES.DARK
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
