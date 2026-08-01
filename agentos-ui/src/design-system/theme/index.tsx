/**
 * Hermes Theme Engine
 * 
 * CSS custom properties based theme engine with dark/light mode support.
 * Uses OKLCH colors for perceptual uniformity.
 */

import { colorTokens } from '../tokens/colors';
import { fontFamilies, fontSizes, fontWeights, lineHeights, letterSpacings } from '../tokens/typography';
import { spacing, borderRadius, shadows, zIndex, breakpoints, containerMaxWidth } from '../tokens/spacing';

/**
 * Generate CSS custom properties for a theme
 */
export function generateThemeCSS(mode: 'light' | 'dark' = 'dark'): string {
  const isDark = mode === 'dark';
  const colors = colorTokens;
  
  const cssVars = [
    ':root {',
    '  /* Color mode */',
    `  --color-mode: ${mode};`,
    '',
    '  /* Brand colors */',
    `  --color-brand-50: ${colors.brand[50]};`,
    `  --color-brand-100: ${colors.brand[100]};`,
    `  --color-brand-200: ${colors.brand[200]};`,
    `  --color-brand-300: ${colors.brand[300]};`,
    `  --color-brand-400: ${colors.brand[400]};`,
    `  --color-brand-500: ${colors.brand[500]};`,
    `  --color-brand-600: ${colors.brand[600]};`,
    `  --color-brand-700: ${colors.brand[700]};`,
    `  --color-brand-800: ${colors.brand[800]};`,
    `  --color-brand-900: ${colors.brand[900]};`,
    `  --color-brand-950: ${colors.brand[950]};`,
    '',
    '  /* Accent colors */',
    `  --color-accent-cyan-500: ${colors.accent.cyan[500]};`,
    `  --color-accent-cyan-600: ${colors.accent.cyan[600]};`,
    `  --color-accent-amber-500: ${colors.accent.amber[500]};`,
    `  --color-accent-amber-600: ${colors.accent.amber[600]};`,
    `  --color-accent-emerald-500: ${colors.accent.emerald[500]};`,
    `  --color-accent-emerald-600: ${colors.accent.emerald[600]};`,
    `  --color-accent-rose-500: ${colors.accent.rose[500]};`,
    `  --color-accent-rose-600: ${colors.accent.rose[600]};`,
    '',
    '  /* Status colors */',
    `  --color-status-success: ${colors.status.success[isDark ? 'dark' : 'light']};`,
    `  --color-status-warning: ${colors.status.warning[isDark ? 'dark' : 'light']};`,
    `  --color-status-error: ${colors.status.error[isDark ? 'dark' : 'light']};`,
    `  --color-status-info: ${colors.status.info[isDark ? 'dark' : 'light']};`,
    `  --color-status-neutral: ${colors.status.neutral[isDark ? 'dark' : 'light']};`,
    `  --color-status-success-bg: ${colors.status.success.bg};`,
    `  --color-status-warning-bg: ${colors.status.warning.bg};`,
    `  --color-status-error-bg: ${colors.status.error.bg};`,
    `  --color-status-info-bg: ${colors.status.info.bg};`,
    '',
    '  /* Surface colors */',
    `  --color-surface-primary: ${colors.surface.primary[isDark ? 'dark' : 'light']};`,
    `  --color-surface-secondary: ${colors.surface.secondary[isDark ? 'dark' : 'light']};`,
    `  --color-surface-tertiary: ${colors.surface.tertiary[isDark ? 'dark' : 'light']};`,
    `  --color-surface-hover: ${colors.surface.hover[isDark ? 'dark' : 'light']};`,
    `  --color-surface-active: ${colors.surface.active[isDark ? 'dark' : 'light']};`,
    `  --color-surface-border: ${colors.surface.border[isDark ? 'dark' : 'light']};`,
    `  --color-surface-focus: ${colors.surface.focus[isDark ? 'dark' : 'light']};`,
    '',
    '  /* Text colors */',
    `  --color-text-primary: ${colors.text.primary[isDark ? 'dark' : 'light']};`,
    `  --color-text-secondary: ${colors.text.secondary[isDark ? 'dark' : 'light']};`,
    `  --color-text-tertiary: ${colors.text.tertiary[isDark ? 'dark' : 'light']};`,
    `  --color-text-inverse: ${colors.text.inverse[isDark ? 'dark' : 'light']};`,
    `  --color-text-disabled: ${colors.text.disabled[isDark ? 'dark' : 'light']};`,
    `  --color-text-link: ${colors.text.link[isDark ? 'dark' : 'light']};`,
    '',
    '  /* Typography */',
    `  --font-display: ${fontFamilies.display};`,
    `  --font-body: ${fontFamilies.body};`,
    `  --font-mono: ${fontFamilies.mono};`,
    `  --font-ui: ${fontFamilies.ui};`,
    '',
    '  /* Font sizes */',
    Object.entries(fontSizes).map(([key, value]) => `  --text-${key}: ${value};`).join('\n'),
    '',
    '  /* Font weights */',
    Object.entries(fontWeights).map(([key, value]) => `  --font-weight-${key}: ${value};`).join('\n'),
    '',
    '  /* Line heights */',
    Object.entries(lineHeights).map(([key, value]) => `  --line-height-${key}: ${value};`).join('\n'),
    '',
    '  /* Letter spacings */',
    Object.entries(letterSpacings).map(([key, value]) => `  --letter-spacing-${key}: ${value};`).join('\n'),
    '',
    '  /* Spacing */',
    Object.entries(spacing).map(([key, value]) => `  --space-${key}: ${value};`).join('\n'),
    '',
    '  /* Border radius */',
    Object.entries(borderRadius).map(([key, value]) => `  --radius-${key}: ${value};`).join('\n'),
    '',
    '  /* Shadows */',
    Object.entries(shadows).map(([key, value]) => `  --shadow-${key}: ${value};`).join('\n'),
    '',
    '  /* Z-index */',
    Object.entries(zIndex).map(([key, value]) => `  --z-${key}: ${value};`).join('\n'),
    '',
    '  /* Breakpoints */',
    Object.entries(breakpoints).map(([key, value]) => `  --breakpoint-${key}: ${value};`).join('\n'),
    '',
    '  /* Container */',
    Object.entries(containerMaxWidth).map(([key, value]) => `  --container-${key}: ${value};`).join('\n'),
    '',
    '  /* Transitions */',
    '  --transition-fast: 100ms ease;',
    '  --transition-normal: 200ms ease;',
    '  --transition-slow: 300ms ease;',
    '  --transition-spring: 400ms cubic-bezier(0.34, 1.56, 0.64, 1);',
    '',
    '  /* Animation durations */',
    '  --duration-fast: 100ms;',
    '  --duration-normal: 200ms;',
    '  --duration-slow: 300ms;',
    '  --duration-enter: 200ms;',
    '  --duration-exit: 150ms;',
    '',
    '}',
    '',
    '/* Light mode override */',
    '@media (prefers-color-scheme: light) {',
    '  :root {',
    '    --color-mode: light;',
    '    /* Light mode colors will be applied via class or media query */',
    '  }',
    '}',
    '',
    '/* Dark mode override */',
    '@media (prefers-color-scheme: dark) {',
    '  :root {',
    '    --color-mode: dark;',
    '  }',
    '}',
    '',
    '/* Explicit theme classes */',
    '.theme-light {',
    '  --color-mode: light;',
    '  --color-surface-primary: oklch(1 0 0);',
    '  --color-surface-secondary: oklch(0.98 0.005 260);',
    '  --color-surface-tertiary: oklch(0.95 0.01 260);',
    '  --color-surface-hover: oklch(0.92 0.01 260);',
    '  --color-surface-active: oklch(0.88 0.015 260);',
    '  --color-surface-border: oklch(0.88 0.01 260);',
    '  --color-text-primary: oklch(0.15 0.02 260);',
    '  --color-text-secondary: oklch(0.40 0.02 260);',
    '  --color-text-tertiary: oklch(0.55 0.02 260);',
    '  --color-text-inverse: oklch(1 0 0);',
    '}',
    '',
    '.theme-dark {',
    '  --color-mode: dark;',
    '  --color-surface-primary: oklch(0.15 0.015 260);',
    '  --color-surface-secondary: oklch(0.18 0.015 260);',
    '  --color-surface-tertiary: oklch(0.22 0.015 260);',
    '  --color-surface-hover: oklch(0.25 0.02 260);',
    '  --color-surface-active: oklch(0.28 0.02 260);',
    '  --color-surface-border: oklch(0.30 0.02 260);',
    '  --color-text-primary: oklch(0.98 0.005 260);',
    '  --color-text-secondary: oklch(0.70 0.01 260);',
    '  --color-text-tertiary: oklch(0.55 0.01 260);',
    '  --color-text-inverse: oklch(0.12 0.01 260);',
    '}',
  ].join('\n');

  return cssVars;
}

/**
 * Theme context for React
 */
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children, defaultMode = 'system' }: { children: ReactNode; defaultMode?: ThemeMode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('hermes-theme') as ThemeMode) || defaultMode;
    }
    return defaultMode;
  });
  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const root = document.documentElement;
    let resolved: 'light' | 'dark';

    if (mode === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      resolved = mode;
    }

    setResolvedMode(resolved);
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(`theme-${resolved}`);
    localStorage.setItem('hermes-theme', mode);
  }, [mode]);

  useEffect(() => {
    if (mode !== 'system') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      const resolved = e.matches ? 'dark' : 'light';
      setResolvedMode(resolved);
      document.documentElement.classList.remove('theme-light', 'theme-dark');
      document.documentElement.classList.add(`theme-${resolved}`);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [mode]);

  const toggleTheme = () => {
    setMode(mode === 'dark' ? 'light' : mode === 'light' ? 'system' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ mode, resolvedMode, setMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Inject theme CSS into document
 */
export function injectThemeCSS(mode: 'light' | 'dark' = 'dark'): void {
  if (typeof document === 'undefined') return;
  
  const css = generateThemeCSS(mode);
  const styleId = 'hermes-theme-css';
  let style = document.getElementById(styleId) as HTMLStyleElement;
  
  if (!style) {
    style = document.createElement('style');
    style.id = styleId;
    document.head.appendChild(style);
  }
  style.textContent = css;
}

/**
 * Initialize theme on app startup
 */
export function initTheme(): void {
  if (typeof window === 'undefined') return;
  
  const saved = localStorage.getItem('hermes-theme') as 'light' | 'dark' | 'system' | null;
  const mode = saved || 'system';
  const resolved = mode === 'system' 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : mode;
  
  injectThemeCSS(resolved);
  document.documentElement.classList.add(`theme-${resolved}`);
}
