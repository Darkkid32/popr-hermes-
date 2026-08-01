/**
 * Hermes Design System - Typography Tokens
 * 
 * Space Grotesk for display/headlines, JetBrains Mono for code/data,
 * Inter for body text (system font fallback).
 */

export const fontFamilies = {
  display:   '"Space Grotesk", "Inter", system-ui, sans-serif',
  body:      '"Inter", "Space Grotesk", system-ui, sans-serif',
  mono:      '"JetBrains Mono", "Fira Code", "SF Mono", "Monaco", monospace',
  ui:        '"Inter", "Space Grotesk", system-ui, sans-serif',
} as const;

export const fontSizes = {
  // Fluid type scale using clamp() for responsive sizing
  xs:      'clamp(0.6875rem, 0.65rem + 0.1875vw, 0.75rem)',    // 11-12px
  sm:      'clamp(0.8125rem, 0.78rem + 0.1625vw, 0.875rem)',    // 13-14px
  base:    'clamp(0.9375rem, 0.9rem + 0.1875vw, 1rem)',         // 15-16px
  lg:      'clamp(1.0625rem, 1.02rem + 0.2125vw, 1.125rem)',    // 17-18px
  xl:      'clamp(1.25rem, 1.18rem + 0.35vw, 1.5rem)',          // 20-24px
  '2xl':   'clamp(1.5rem, 1.4rem + 0.5vw, 1.875rem)',           // 24-30px
  '3xl':   'clamp(1.875rem, 1.7rem + 0.875vw, 2.5rem)',         // 30-40px
  '4xl':   'clamp(2.25rem, 2rem + 1.25vw, 3.5rem)',             // 36-56px
  '5xl':   'clamp(3rem, 2.6rem + 2vw, 5rem)',                   // 48-80px
} as const;

export const fontWeights = {
  thin:      100,
  extralight: 200,
  light:     300,
  normal:    400,
  medium:    500,
  semibold:  600,
  bold:      700,
  extrabold: 800,
  black:     900,
} as const;

export const lineHeights = {
  none:      1,
  tight:     1.1,
  snug:      1.375,
  normal:    1.5,
  relaxed:   1.625,
  loose:     2,
  code:      1.6,
} as const;

export const letterSpacings = {
  tighter:  '-0.05em',
  tight:    '-0.025em',
  normal:   '0',
  wide:     '0.025em',
  wider:    '0.05em',
  widest:   '0.1em',
} as const;

// Semantic typography styles
export const textStyles = {
  // Display styles
  displayXl: { fontFamily: 'var(--font-display)', fontSize: 'var(--text-5xl)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.025em' },
  displayLg: { fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.025em' },
  displayMd: { fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.02em' },
  displaySm: { fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.015em' },

  // Heading styles
  h1: { fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 700, lineHeight: 1.15 },
  h2: { fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 600, lineHeight: 1.2 },
  h3: { fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 600, lineHeight: 1.25 },
  h4: { fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, lineHeight: 1.3 },
  h5: { fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 600, lineHeight: 1.35 },
  h6: { fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 600, lineHeight: 1.4 },

  // Body styles
  bodyLg:  { fontFamily: 'var(--font-body)', fontSize: 'var(--text-lg)', fontWeight: 400, lineHeight: 1.6 },
  body:    { fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 400, lineHeight: 1.6 },
  bodySm:  { fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 400, lineHeight: 1.5 },
  bodyXs:  { fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 400, lineHeight: 1.5 },

  // Label styles
  labelLg: { fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, lineHeight: 1.5, letterSpacing: '0.01em' },
  label:   { fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, lineHeight: 1.5, letterSpacing: '0.01em' },
  labelSm: { fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', fontWeight: 500, lineHeight: 1.5, letterSpacing: '0.015em' },

  // Mono styles
  monoLg:  { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-lg)', fontWeight: 400, lineHeight: 1.6 },
  mono:    { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', fontWeight: 400, lineHeight: 1.6 },
  monoSm:  { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 400, lineHeight: 1.6 },
  monoXs:  { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 400, lineHeight: 1.6 },

  // Special
  eyebrow: { fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', fontWeight: 600, lineHeight: 1.5, letterSpacing: '0.08em', textTransform: 'uppercase' as const },
  caption: { fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', fontWeight: 400, lineHeight: 1.5, color: 'var(--color-text-tertiary)' },
  code:    { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 400, lineHeight: 1.6 },
  link:    { fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, lineHeight: 1.5, textDecoration: 'underline' as const },
} as const;

export type TypographyTokens = {
  fontFamilies: typeof fontFamilies;
  fontSizes: typeof fontSizes;
  fontWeights: typeof fontWeights;
  lineHeights: typeof lineHeights;
  letterSpacings: typeof letterSpacings;
  textStyles: typeof textStyles;
};
