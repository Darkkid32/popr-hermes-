// Design System Z-Index Tokens
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

export const zIndexTokens = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  toast: 800,
  commandPalette: 900,
  loadingOverlay: 1000,
} as const;

export type ZIndexTokens = typeof zIndexTokens;

// CSS Variable Generator
export function generateZIndexCSSVariables(): string {
  const vars: string[] = [];

  Object.entries(zIndexTokens).forEach(([key, value]) => {
    vars.push(`  --z-${key}: ${value};`);
  });

  return vars.join('\n');
}

// Type-safe z-index access
export const zIndex = zIndexTokens;