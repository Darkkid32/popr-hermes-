// Design System Spacing Tokens
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

export const spacingTokens = {
  // Base unit: 4px
  unit: 4,

  // Spacing scale
  scale: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    10: 40,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
    24: 96,
    32: 128,
  },

  // Semantic spacing
  semantic: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
    gutter: 24,
    margin: 32,
    container: 32,
    section: 48,
  },

  // Layout dimensions
  layout: {
    sidebar: 280,
    sidebarCollapsed: 72,
    topbar: 44,
    rightPanel: 320,
    modal: 560,
    drawer: 400,
    tooltip: 280,
    dropdown: 320,
  },
} as const;

export type SpacingTokens = typeof spacingTokens;

// CSS Variable Generator
export function generateSpacingCSSVariables(): string {
  const vars: string[] = [];

  vars.push(`  --space-unit: ${spacingTokens.unit}px;`);

  Object.entries(spacingTokens.scale).forEach(([key, value]) => {
    vars.push(`  --space-${key}: ${value}px;`);
  });

  Object.entries(spacingTokens.semantic).forEach(([key, value]) => {
    vars.push(`  --space-${key}: ${value}px;`);
  });

  Object.entries(spacingTokens.layout).forEach(([key, value]) => {
    vars.push(`  --layout-${key}: ${value}px;`);
  });

  return vars.join('\n');
}

// Type-safe spacing access
export const spacing = {
  unit: spacingTokens.unit,
  scale: spacingTokens.scale,
  semantic: spacingTokens.semantic,
  layout: spacingTokens.layout,
};