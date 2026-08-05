// Theme Provider
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import React, { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';

interface ThemeContextValue {
  theme: 'dark' | 'light' | 'system';
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  reducedMotion: boolean;
  density: 'compact' | 'comfortable' | 'spacious';
  setDensity: (density: 'compact' | 'comfortable' | 'spacious') => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  fontScale: number;
  setFontScale: (scale: number) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  theme: 'hermes-theme',
  density: 'hermes-density',
  accentColor: 'hermes-accent-color',
  fontScale: 'hermes-font-scale',
} as const;

function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function injectCSSVariables(accentColor: string): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.style.setProperty('--color-primary-base', accentColor);
  root.style.setProperty('--color-primary-container', accentColor);
  root.style.setProperty('--color-border-focus', accentColor);
  
  root.style.setProperty('--color-primary-glow', hexToRgba(accentColor, 0.15));
  root.style.setProperty('--color-primary-glow-strong', hexToRgba(accentColor, 0.3));
  root.style.setProperty('--color-primary-focus', `0 0 0 2px ${accentColor}, 0 0 0 4px ${hexToRgba(accentColor, 0.2)}`);
  root.style.setProperty('--color-primary-focus-inset', `inset 0 0 0 2px ${accentColor}`);
}

export function ThemeProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [theme, setThemeState] = useState<'dark' | 'light' | 'system'>(() => {
    if (typeof window === 'undefined') return 'dark';
    return (localStorage.getItem(STORAGE_KEYS.theme) as 'dark' | 'light' | 'system') || 'dark';
  });

  const [density, setDensityState] = useState<'compact' | 'comfortable' | 'spacious'>(() => {
    if (typeof window === 'undefined') return 'comfortable';
    return (localStorage.getItem(STORAGE_KEYS.density) as 'compact' | 'comfortable' | 'spacious') || 'comfortable';
  });

  const [accentColor, setAccentColorState] = useState<string>(() => {
    if (typeof window === 'undefined') return '#2DD4BF';
    return localStorage.getItem(STORAGE_KEYS.accentColor) || '#2DD4BF';
  });

  const [fontScale, setFontScaleState] = useState<number>(() => {
    if (typeof window === 'undefined') return 1;
    return parseFloat(localStorage.getItem(STORAGE_KEYS.fontScale) || '1');
  });

  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-density', density);
    root.style.setProperty('--font-scale', String(fontScale));
    
    localStorage.setItem(STORAGE_KEYS.theme, theme);
    localStorage.setItem(STORAGE_KEYS.density, density);
  }, [theme, density, fontScale]);

  useEffect(() => {
    injectCSSVariables(accentColor);
    localStorage.setItem(STORAGE_KEYS.accentColor, accentColor);
  }, [accentColor]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('reduce-motion', reducedMotion);
  }, [reducedMotion]);

  const setTheme = useCallback((newTheme: 'dark' | 'light' | 'system') => {
    setThemeState(newTheme);
  }, []);

  const setDensity = useCallback((newDensity: 'compact' | 'comfortable' | 'spacious') => {
    setDensityState(newDensity);
  }, []);

  const setAccentColor = useCallback((color: string) => {
    setAccentColorState(color);
  }, []);

  const setFontScale = useCallback((scale: number) => {
    setFontScaleState(Math.max(0.75, Math.min(1.5, scale)));
  }, []);

  const value: ThemeContextValue = {
    theme,
    setTheme,
    reducedMotion,
    density,
    setDensity,
    accentColor,
    setAccentColor,
    fontScale,
    setFontScale,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function getCSSVariable(name: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function setCSSVariable(name: string, value: string): void {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty(name, value);
}