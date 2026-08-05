// Design System Border Radius Tokens
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

export const borderRadiusTokens = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  full: 9999,

  // Semantic border radius
  semantic: {
    input: 4,
    button: 6,
    card: 8,
    modal: 12,
    tooltip: 6,
    dropdown: 8,
    avatar: 'full',
    chip: 4,
    progress: 2,
  },
} as const;

export type BorderRadiusTokens = typeof borderRadiusTokens;

// CSS Variable Generator
export function generateBorderRadiusCSSVariables(): string {
  const vars: string[] = [];

  Object.entries(borderRadiusTokens).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([subKey, subValue]) => {
        vars.push(`  --radius-${key}-${subKey}: ${subValue}px;`);
      });
    } else if (typeof value === 'number') {
      vars.push(`  --radius-${key}: ${value}px;`);
    } else {
      vars.push(`  --radius-${key}: ${value};`);
    }
  });

  return vars.join('\n');
}

// Type-safe border radius access
export const borderRadius = borderRadiusTokens;