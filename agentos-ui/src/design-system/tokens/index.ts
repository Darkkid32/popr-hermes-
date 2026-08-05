// Design System Tokens Index
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './motion';
export * from './borderRadius';
export * from './breakpoints';
export * from './zIndex';
export * from './components';

export function generateAllCSSVariables(): string {
  const sections = [
    '/* ============================================',
    ' * HERMES AI OS - DESIGN TOKENS',
    ' * Generated from Google Stitch Project 10866743485103090405',
    ' * ============================================ */',
    ':root {',
    '',
    '  /* --- Colors --- */',
    generateColorCSSVariables(),
    '',
    '  /* --- Typography --- */',
    generateTypographyCSSVariables(),
    '',
    '  /* --- Spacing --- */',
    generateSpacingCSSVariables(),
    '',
    '  /* --- Shadows & Elevation --- */',
    generateShadowCSSVariables(),
    '',
    '  /* --- Motion --- */',
    generateMotionCSSVariables(),
    '',
    '  /* --- Border Radius --- */',
    generateBorderRadiusCSSVariables(),
    '',
    '  /* --- Breakpoints --- */',
    generateBreakpointCSSVariables(),
    '',
    '  /* --- Z-Index --- */',
    generateZIndexCSSVariables(),
    '',
    '  /* --- Component Tokens --- */',
    generateComponentCSSVariables(),
    '',
    '}',
    '',
    '/* --- Reduced Motion --- */',
    '@media (prefers-reduced-motion: reduce) {',
    '  *,',
    '  *::before,',
    '  *::after {',
    '    animation-duration: 0.01ms !important;',
    '    animation-iteration-count: 1 !important;',
    '    transition-duration: 0.01ms !important;',
    '    scroll-behavior: auto !important;',
    '  }',
    '',
    '  .ai-scanning-bar::after,',
    '  .live-indicator,',
    '  .skeleton {',
    '    animation: none !important;',
    '  }',
    '',
    '  .skeleton {',
    '    background: var(--color-surface-container);',
    '  }',
    '}',
    '',
    '/* --- Print Styles --- */',
    '@media print {',
    '  .no-print { display: none !important; }',
    '}',
  ];

  return sections.join('\n');
}

// Import the generators
import { generateColorCSSVariables } from './colors';
import { generateTypographyCSSVariables } from './typography';
import { generateSpacingCSSVariables } from './spacing';
import { generateShadowCSSVariables } from './shadows';
import { generateMotionCSSVariables } from './motion';
import { generateBorderRadiusCSSVariables } from './borderRadius';
import { generateBreakpointCSSVariables } from './breakpoints';
import { generateZIndexCSSVariables } from './zIndex';
import { generateComponentCSSVariables } from './components';