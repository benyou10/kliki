'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: Theme | 'system';
  enableSystem?: boolean;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  attribute = 'data-theme',
  defaultTheme = 'dark',
  enableSystem = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme === 'system' ? 'dark' : defaultTheme);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const systemTheme = enableSystem && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const resolvedTheme = storedTheme ?? (defaultTheme === 'system' ? systemTheme : defaultTheme);

    setThemeState(resolvedTheme);
    document.documentElement.setAttribute(attribute, resolvedTheme);
  }, [attribute, defaultTheme, enableSystem]);

  useEffect(() => {
    document.documentElement.setAttribute(attribute, theme);
    localStorage.setItem('theme', theme);
  }, [attribute, theme]);

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme);
  };

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
