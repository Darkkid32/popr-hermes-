// Design System Shadow & Elevation Tokens
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

export const shadowTokens = {
  // Elevation levels
  level0: 'none',
  level1: '0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 1px rgba(0, 0, 0, 0.2)',
  level2: '0 4px 8px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)',
  level3: '0 10px 20px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.2)',
  level4: '0 20px 40px rgba(0, 0, 0, 0.5), 0 8px 16px rgba(0, 0, 0, 0.3)',

  // Cyan-tinted shadows (signature Hermes)
  cyan: {
    glow: '0 0 20px rgba(45, 212, 191, 0.15)',
    glowStrong: '0 0 40px rgba(45, 212, 191, 0.3)',
    focus: '0 0 0 2px #2DD4BF, 0 0 0 4px rgba(45, 212, 191, 0.2)',
    focusInset: 'inset 0 0 0 2px #2DD4BF',
  },

  // Magenta shadows
  magenta: {
    glow: '0 0 20px rgba(217, 70, 239, 0.15)',
    focus: '0 0 0 2px #D946EF, 0 0 0 4px rgba(217, 70, 239, 0.2)',
  },

  // Inset shadows
  inset: {
    sm: 'inset 0 1px 2px rgba(0, 0, 0, 0.2)',
    md: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
    border: 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
  },
} as const;

export type ShadowTokens = typeof shadowTokens;

// CSS Variable Generator
export function generateShadowCSSVariables(): string {
  const vars: string[] = [];

  Object.entries(shadowTokens).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([subKey, subValue]) => {
        vars.push(`  --shadow-${key}-${subKey}: ${subValue};`);
      });
    } else {
      vars.push(`  --shadow-${key}: ${value};`);
    }
  });

  return vars.join('\n');
}

// Type-safe shadow access
export const shadows = shadowTokens;