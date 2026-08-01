/**
 * Hermes Design System - Color Tokens
 * 
 * Semantic color system with dark/light mode support.
 * All colors use OKLCH for perceptual uniformity.
 */

export const colorTokens = {
  // Brand colors - Hermes purple/violet theme
  brand: {
    50:  'oklch(0.96 0.03 285)',
    100: 'oklch(0.92 0.06 285)',
    200: 'oklch(0.85 0.10 285)',
    300: 'oklch(0.75 0.15 285)',
    400: 'oklch(0.65 0.18 285)',
    500: 'oklch(0.55 0.20 285)',  // Primary brand
    600: 'oklch(0.48 0.22 285)',
    700: 'oklch(0.40 0.22 285)',
    800: 'oklch(0.32 0.20 285)',
    900: 'oklch(0.25 0.18 285)',
    950: 'oklch(0.18 0.15 285)',
  },

  // Accent colors
  accent: {
    cyan:    { 500: 'oklch(0.75 0.15 200)', 600: 'oklch(0.65 0.18 200)' },
    amber:   { 500: 'oklch(0.75 0.15 80)',  600: 'oklch(0.65 0.18 80)' },
    emerald: { 500: 'oklch(0.70 0.15 150)', 600: 'oklch(0.60 0.18 150)' },
    rose:    { 500: 'oklch(0.65 0.20 10)',  600: 'oklch(0.55 0.22 10)' },
  },

  // Semantic status colors
  status: {
    success:   { light: 'oklch(0.65 0.15 150)', dark: 'oklch(0.60 0.18 150)', bg: 'oklch(0.30 0.10 150 / 0.3)' },
    warning:   { light: 'oklch(0.75 0.15 80)',  dark: 'oklch(0.70 0.15 80)',  bg: 'oklch(0.30 0.10 80  / 0.3)' },
    error:     { light: 'oklch(0.60 0.22 10)',  dark: 'oklch(0.55 0.20 10)',  bg: 'oklch(0.30 0.12 10  / 0.3)' },
    info:      { light: 'oklch(0.60 0.18 250)', dark: 'oklch(0.65 0.15 250)', bg: 'oklch(0.28 0.10 250 / 0.3)' },
    neutral:   { light: 'oklch(0.55 0.02 250)', dark: 'oklch(0.65 0.02 250)', bg: 'oklch(0.25 0.02 250 / 0.3)' },
  },

  // Neutral/surface colors - Dark mode first
  neutral: {
    0:    'oklch(1 0 0)',      // White
    50:   'oklch(0.98 0.005 260)',
    100:  'oklch(0.95 0.01 260)',
    200:  'oklch(0.90 0.015 260)',
    300:  'oklch(0.82 0.02 260)',
    400:  'oklch(0.70 0.02 260)',
    500:  'oklch(0.55 0.02 260)',
    600:  'oklch(0.45 0.02 260)',
    700:  'oklch(0.35 0.02 260)',
    800:  'oklch(0.25 0.02 260)',
    900:  'oklch(0.18 0.02 260)',
    950:  'oklch(0.12 0.015 260)',
    1000: 'oklch(0.08 0.01 260)', // Near black
  },

  // Surface colors (for cards, panels, modals)
  surface: {
    primary:   { light: 'oklch(1 0 0)',      dark: 'oklch(0.15 0.015 260)' },
    secondary: { light: 'oklch(0.98 0.005 260)', dark: 'oklch(0.18 0.015 260)' },
    tertiary:  { light: 'oklch(0.95 0.01 260)',  dark: 'oklch(0.22 0.015 260)' },
    hover:     { light: 'oklch(0.92 0.01 260)',  dark: 'oklch(0.25 0.02 260)' },
    active:    { light: 'oklch(0.88 0.015 260)', dark: 'oklch(0.28 0.02 260)' },
    border:    { light: 'oklch(0.88 0.01 260)',  dark: 'oklch(0.30 0.02 260)' },
    focus:     { light: 'oklch(0.55 0.20 285)', dark: 'oklch(0.55 0.20 285)' },
  },

  // Text colors
  text: {
    primary:   { light: 'oklch(0.15 0.02 260)', dark: 'oklch(0.98 0.005 260)' },
    secondary: { light: 'oklch(0.40 0.02 260)', dark: 'oklch(0.70 0.01 260)' },
    tertiary:  { light: 'oklch(0.55 0.02 260)', dark: 'oklch(0.55 0.01 260)' },
    inverse:   { light: 'oklch(1 0 0)',        dark: 'oklch(0.12 0.01 260)' },
    disabled:  { light: 'oklch(0.55 0.01 260)', dark: 'oklch(0.45 0.01 260)' },
    link:      { light: 'oklch(0.55 0.20 285)', dark: 'oklch(0.65 0.18 285)' },
  },
} as const;

export type ColorTokens = typeof colorTokens;
