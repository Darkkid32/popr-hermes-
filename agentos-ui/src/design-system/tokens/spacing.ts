/**
 * Hermes Design System - Spacing & Sizing Tokens
 * 
 * 4px base unit scale with fluid responsive values.
 */

export const spacing = {
  0:     '0',
  1:     '0.125rem',   // 2px
  2:     '0.25rem',    // 4px
  3:     '0.375rem',   // 6px
  4:     '0.5rem',     // 8px
  5:     '0.625rem',   // 10px
  6:     '0.75rem',    // 12px
  7:     '0.875rem',   // 14px
  8:     '1rem',       // 16px
  9:     '1.125rem',   // 18px
  10:    '1.25rem',    // 20px
  11:    '1.375rem',   // 22px
  12:    '1.5rem',     // 24px
  14:    '1.75rem',    // 28px
  16:    '2rem',       // 32px
  20:    '2.5rem',     // 40px
  24:    '3rem',       // 48px
  28:    '3.5rem',     // 56px
  32:    '4rem',       // 64px
  36:    '4.5rem',     // 72px
  40:    '5rem',       // 80px
  48:    '6rem',       // 96px
  56:    '7rem',       // 112px
  64:    '8rem',       // 128px
} as const;

// Fluid spacing for responsive layouts
export const fluidSpacing = {
  none:      '0',
  xs:        'clamp(0.25rem, 0.125rem + 0.5vw, 0.5rem)',     // 4-8px
  sm:        'clamp(0.5rem, 0.25rem + 1vw, 1rem)',           // 8-16px
  md:        'clamp(1rem, 0.5rem + 1.5vw, 1.5rem)',          // 16-24px
  lg:        'clamp(1.5rem, 1rem + 1.5vw, 2rem)',            // 24-32px
  xl:        'clamp(2rem, 1.5rem + 2vw, 3rem)',              // 32-48px
  '2xl':     'clamp(3rem, 2rem + 3vw, 5rem)',                // 48-80px
  '3xl':     'clamp(4rem, 3rem + 4vw, 7rem)',                // 64-112px
} as const;

// Component-specific spacing
export const componentSpacing = {
  // Button padding
  button: {
    sm:  { py: '0.375rem', px: '0.75rem' },   // 6px 12px
    md:  { py: '0.5rem', px: '1rem' },         // 8px 16px
    lg:  { py: '0.625rem', px: '1.25rem' },    // 10px 20px
    xl:  { py: '0.75rem', px: '1.5rem' },      // 12px 24px
  },
  // Input padding
  input: {
    sm:  { py: '0.375rem', px: '0.75rem' },
    md:  { py: '0.5rem', px: '0.875rem' },
    lg:  { py: '0.625rem', px: '1rem' },
  },
  // Card/panel padding
  card: {
    none:  '0',
    sm:    '0.5rem',      // 8px
    md:    '1rem',        // 16px
    lg:    '1.5rem',      // 24px
    xl:    '2rem',        // 32px
  },
  // Gap between elements
  gap: {
    none: '0',
    xs:   '0.25rem',   // 4px
    sm:   '0.5rem',    // 8px
    md:   '1rem',      // 16px
    lg:   '1.5rem',    // 24px
    xl:   '2rem',      // 32px
  },
  // Layout spacing
  layout: {
    container: '1.5rem',    // 24px
    section:   '2rem',      // 32px
    page:      '2rem',      // 32px
  },
} as const;

// Border radius
export const borderRadius = {
  none:    '0',
  xs:      '0.125rem',  // 2px
  sm:      '0.25rem',   // 4px
  md:      '0.375rem',  // 6px
  mdlg:    '0.5rem',    // 8px
  lg:      '0.75rem',   // 12px
  xl:      '1rem',      // 16px
  '2xl':   '1.5rem',    // 24px
  full:    '9999px',
} as const;

// Shadows
export const shadows = {
  none:     'none',
  xs:       '0 1px 2px 0 oklch(0 0 0 / 0.05)',
  sm:       '0 1px 3px 0 oklch(0 0 0 / 0.1), 0 1px 2px -1px oklch(0 0 0 / 0.1)',
  md:       '0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1)',
  lg:       '0 10px 15px -3px oklch(0 0 0 / 0.1), 0 4px 6px -4px oklch(0 0 0 / 0.1)',
  xl:       '0 20px 25px -5px oklch(0 0 0 / 0.1), 0 8px 10px -6px oklch(0 0 0 / 0.1)',
  '2xl':    '0 25px 50px -12px oklch(0 0 0 / 0.25)',
  inner:    'inset 0 2px 4px 0 oklch(0 0 0 / 0.05)',
  // Focus ring
  focus:    '0 0 0 2px var(--color-brand-500), 0 0 0 4px var(--color-surface-primary)',
  // Brand focus
  brand:    '0 0 0 2px var(--color-brand-500), 0 0 0 4px var(--color-surface-primary)',
  // Elevation levels for cards/panels
  elevation: {
    0: 'none',
    1: '0 1px 2px 0 oklch(0 0 0 / 0.05)',
    2: '0 1px 3px 0 oklch(0 0 0 / 0.1), 0 1px 2px -1px oklch(0 0 0 / 0.1)',
    3: '0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1)',
    4: '0 10px 15px -3px oklch(0 0 0 / 0.1), 0 4px 6px -4px oklch(0 0 0 / 0.1)',
    5: '0 20px 25px -5px oklch(0 0 0 / 0.1), 0 8px 10px -6px oklch(0 0 0 / 0.1)',
  },
} as const;

// Z-index scale
export const zIndex = {
  hide:       -1,
  base:       0,
  dropdown:   100,
  sticky:     200,
  fixed:      300,
  modal:      400,
  popover:    500,
  tooltip:    600,
  toast:      700,
  max:        9999,
} as const;

// Breakpoints
export const breakpoints = {
  xs:   '320px',
  sm:   '640px',
  md:   '768px',
  lg:   '1024px',
  xl:   '1280px',
  '2xl': '1536px',
} as const;

// Container max widths
export const containerMaxWidth = {
  sm:   '640px',
  md:   '768px',
  lg:   '1024px',
  xl:   '1280px',
  '2xl': '1400px',
  full: '100%',
} as const;
