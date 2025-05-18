'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the theme types
export type ThemeType = 'default' | 'modern' | 'creative';

// Define the theme colors structure
interface ThemeColors {
  name: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  radius: string;
}

// Prebuilt themes
const themes: Record<ThemeType, ThemeColors> = {
  default: {
    name: 'Default',
    description: 'Clean, professional appearance with neutral colors',
    primary: 'oklch(0.205 0 0)',
    secondary: 'oklch(0.97 0 0)',
    accent: 'oklch(0.97 0 0)',
    background: 'oklch(1 0 0)',
    foreground: 'oklch(0.145 0 0)',
    card: 'oklch(1 0 0)',
    cardForeground: 'oklch(0.145 0 0)',
    muted: 'oklch(0.97 0 0)',
    mutedForeground: 'oklch(0.556 0 0)',
    border: 'oklch(0.922 0 0)',
    radius: '0.625rem',
  },
  modern: {
    name: 'Modern',
    description: 'Bold, high-contrast design with vibrant primary colors',
    primary: 'oklch(0.646 0.222 41.116)', // Vibrant blue
    secondary: 'oklch(0.3 0 0)',
    accent: 'oklch(0.8 0.2 60)',
    background: 'oklch(0.98 0 0)',
    foreground: 'oklch(0.1 0 0)',
    card: 'oklch(1 0 0)',
    cardForeground: 'oklch(0.1 0 0)',
    muted: 'oklch(0.95 0 0)',
    mutedForeground: 'oklch(0.45 0 0)',
    border: 'oklch(0.9 0 0)',
    radius: '0.5rem',
  },
  creative: {
    name: 'Creative',
    description: 'Playful, expressive design with vibrant colors',
    primary: 'oklch(0.769 0.188 70.08)', // Vibrant orange
    secondary: 'oklch(0.398 0.07 227.392)', // Soft blue
    accent: 'oklch(0.627 0.265 303.9)', // Purple
    background: 'oklch(0.99 0 0)',
    foreground: 'oklch(0.15 0 0)',
    card: 'oklch(1 0 0)',
    cardForeground: 'oklch(0.15 0 0)',
    muted: 'oklch(0.96 0 0)',
    mutedForeground: 'oklch(0.5 0 0)',
    border: 'oklch(0.93 0 0)',
    radius: '1rem',
  },
};

// Dark mode versions of each theme
const darkThemes: Record<ThemeType, ThemeColors> = {
  default: {
    name: 'Default',
    description: 'Clean, professional appearance with neutral colors',
    primary: 'oklch(0.922 0 0)',
    secondary: 'oklch(0.269 0 0)',
    accent: 'oklch(0.269 0 0)',
    background: 'oklch(0.145 0 0)',
    foreground: 'oklch(0.985 0 0)',
    card: 'oklch(0.205 0 0)',
    cardForeground: 'oklch(0.985 0 0)',
    muted: 'oklch(0.269 0 0)',
    mutedForeground: 'oklch(0.708 0 0)',
    border: 'oklch(1 0 0 / 10%)',
    radius: '0.625rem',
  },
  modern: {
    name: 'Modern',
    description: 'Bold, high-contrast design with vibrant primary colors',
    primary: 'oklch(0.7 0.25 41.116)', // Vibrant blue
    secondary: 'oklch(0.35 0 0)',
    accent: 'oklch(0.85 0.25 60)',
    background: 'oklch(0.13 0 0)',
    foreground: 'oklch(0.98 0 0)',
    card: 'oklch(0.19 0 0)',
    cardForeground: 'oklch(0.98 0 0)',
    muted: 'oklch(0.25 0 0)',
    mutedForeground: 'oklch(0.65 0 0)',
    border: 'oklch(1 0 0 / 15%)',
    radius: '0.5rem',
  },
  creative: {
    name: 'Creative',
    description: 'Playful, expressive design with vibrant colors',
    primary: 'oklch(0.8 0.19 70.08)', // Vibrant orange
    secondary: 'oklch(0.45 0.08 227.392)', // Soft blue
    accent: 'oklch(0.65 0.27 303.9)', // Purple
    background: 'oklch(0.12 0 0)',
    foreground: 'oklch(0.99 0 0)',
    card: 'oklch(0.18 0 0)',
    cardForeground: 'oklch(0.99 0 0)',
    muted: 'oklch(0.24 0 0)',
    mutedForeground: 'oklch(0.7 0 0)',
    border: 'oklch(1 0 0 / 20%)',
    radius: '1rem',
  },
};

interface ThemeContextType {
  currentTheme: ThemeType;
  darkMode: boolean;
  setTheme: (theme: ThemeType) => void;
  toggleDarkMode: () => void;
  themes: Record<ThemeType, ThemeColors>;
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme provider component
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('default');
  const [darkMode, setDarkMode] = useState(false);

  // Apply theme to CSS variables
  useEffect(() => {
    const themeColors = darkMode ? darkThemes[currentTheme] : themes[currentTheme];
    
    // Update CSS variables
    document.documentElement.style.setProperty('--radius', themeColors.radius);
    document.documentElement.style.setProperty('--background', themeColors.background);
    document.documentElement.style.setProperty('--foreground', themeColors.foreground);
    document.documentElement.style.setProperty('--card', themeColors.card);
    document.documentElement.style.setProperty('--card-foreground', themeColors.cardForeground);
    document.documentElement.style.setProperty('--popover', themeColors.card);
    document.documentElement.style.setProperty('--popover-foreground', themeColors.cardForeground);
    document.documentElement.style.setProperty('--primary', themeColors.primary);
    document.documentElement.style.setProperty('--primary-foreground', darkMode ? 'oklch(0.205 0 0)' : 'oklch(0.985 0 0)');
    document.documentElement.style.setProperty('--secondary', themeColors.secondary);
    document.documentElement.style.setProperty('--secondary-foreground', darkMode ? 'oklch(0.985 0 0)' : 'oklch(0.205 0 0)');
    document.documentElement.style.setProperty('--muted', themeColors.muted);
    document.documentElement.style.setProperty('--muted-foreground', themeColors.mutedForeground);
    document.documentElement.style.setProperty('--accent', themeColors.accent);
    document.documentElement.style.setProperty('--accent-foreground', darkMode ? 'oklch(0.985 0 0)' : 'oklch(0.205 0 0)');
    document.documentElement.style.setProperty('--border', themeColors.border);
    
    // Apply dark class if in dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save theme preference to localStorage
    localStorage.setItem('theme-preference', JSON.stringify({ theme: currentTheme, darkMode }));
  }, [currentTheme, darkMode]);
  
  // Load theme preference from localStorage on initial render
  useEffect(() => {
    const savedPreference = localStorage.getItem('theme-preference');
    if (savedPreference) {
      try {
        const { theme, darkMode: isDark } = JSON.parse(savedPreference);
        setCurrentTheme(theme);
        setDarkMode(isDark);
      } catch (e) {
        console.error('Error loading theme preference', e);
      }
    } else {
      // Check for system dark mode preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Theme switching function
  const setTheme = (theme: ThemeType) => {
    setCurrentTheme(theme);
  };

  // Dark mode toggle function
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      darkMode, 
      setTheme, 
      toggleDarkMode, 
      themes
    }}>
      {children}
    </ThemeContext.Provider>
  );
} 