import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type FontSize = 'small' | 'medium' | 'large';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  alwaysShowCaptions: boolean;
  setAlwaysShowCaptions: (value: boolean) => void;
  useDyslexiaFriendlyFont: boolean;
  setUseDyslexiaFriendlyFont: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme;
    return saved || 'light';
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const saved = localStorage.getItem('fontSize') as FontSize;
    return saved || 'medium';
  });

  const [alwaysShowCaptions, setAlwaysShowCaptions] = useState<boolean>(() => {
    const saved = localStorage.getItem('alwaysShowCaptions');
    return saved ? JSON.parse(saved) : false;
  });

  const [useDyslexiaFriendlyFont, setUseDyslexiaFriendlyFont] = useState<boolean>(() => {
    const saved = localStorage.getItem('useDyslexiaFriendlyFont');
    return saved ? JSON.parse(saved) : false;
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Apply font size to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing font size classes
    root.classList.remove('text-sm', 'text-base', 'text-lg');
    
    // Add new font size class
    switch (fontSize) {
      case 'small':
        root.classList.add('text-sm');
        break;
      case 'medium':
        root.classList.add('text-base');
        break;
      case 'large':
        root.classList.add('text-lg');
        break;
    }
    
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  // Apply accessibility settings
  useEffect(() => {
    const root = document.documentElement;
    
    if (useDyslexiaFriendlyFont) {
      root.classList.add('dyslexia-friendly');
    } else {
      root.classList.remove('dyslexia-friendly');
    }
    
    localStorage.setItem('useDyslexiaFriendlyFont', JSON.stringify(useDyslexiaFriendlyFont));
  }, [useDyslexiaFriendlyFont]);

  useEffect(() => {
    localStorage.setItem('alwaysShowCaptions', JSON.stringify(alwaysShowCaptions));
  }, [alwaysShowCaptions]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    alwaysShowCaptions,
    setAlwaysShowCaptions,
    useDyslexiaFriendlyFont,
    setUseDyslexiaFriendlyFont,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
