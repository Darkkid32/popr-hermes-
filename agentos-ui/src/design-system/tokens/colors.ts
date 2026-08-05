// Design System Color Tokens
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

export const colorTokens = {
  // Base backgrounds
  background: {
    base: '#020617',        // Absolute Black - lowest level
    workspace: '#0d1322',   // Deep Navy - workspace background
    elevated: '#0B1120',    // Elevated surfaces (sidebar, cards)
    overlay: 'rgba(2, 6, 23, 0.9)', // Modal/overlay backdrop
  },

  // Surface layers
  surface: {
    level0: '#020617',      // Base background
    level1: '#0B1120',      // Card/surface with 1px border
    level2: '#0B1120',      // Popovers/modals with cyan glow
    container: '#191f2f',   // Main content containers
    containerLow: '#151b2b',
    containerHigh: '#242a3a',
    containerHighest: '#2f3445',
    bright: '#33394a',
    dim: '#0d1322',
  },

  // Borders
  border: {
    primary: '#1E293B',     // Standard border
    secondary: '#3c4a46',   // Subtle border
    focus: '#2DD4BF',       // Focus ring
    error: '#FFB4AB',       // Error border
  },

  // Semantic colors
  primary: {
    base: '#2DD4BF',        // Cyan/Teal - primary action
    container: '#2DD4BF',
    onPrimary: '#003731',
    onContainer: '#00574D',
    fixed: '#62FAE3',
    fixedDim: '#3CDDC7',
    onFixed: '#00201C',
    onFixedVariant: '#005047',
    glow: 'rgba(45, 212, 191, 0.15)',
    glowStrong: 'rgba(45, 212, 191, 0.3)',
  },

  secondary: {
    base: '#D946EF',        // Magenta - secondary/high-priority
    container: '#AE05C6',
    onSecondary: '#580065',
    onContainer: '#FFD8FD',
    fixed: '#FFD6FD',
    fixedDim: '#FBABFF',
    onFixed: '#36003E',
    onFixedVariant: '#7C008E',
  },

  tertiary: {
    base: '#10B981',        // Emerald - success
    container: '#44D69B',
    onTertiary: '#003824',
    onContainer: '#00593B',
    fixed: '#6FFBBE',
    fixedDim: '#4EDEA3',
    onFixed: '#002113',
    onFixedVariant: '#005236',
  },

  error: {
    base: '#FFB4AB',
    container: '#93000A',
    onError: '#690005',
    onContainer: '#FFDAD6',
  },

  success: {
    base: '#10B981',
    container: '#064E3B',
    onSuccess: '#D1FAE5',
    onContainer: '#064E3B',
  },

  warning: {
    base: '#F59E0B',
    container: '#78350F',
    onWarning: '#FEF3C7',
    onContainer: '#78350F',
  },

  info: {
    base: '#0EA5E9',
    container: '#0C4A6E',
    onInfo: '#E0F2FE',
    onContainer: '#0C4A6E',
  },

  // Text colors
  text: {
    primary: '#DDE2F8',
    secondary: '#BACAC5',
    tertiary: '#859490',
    disabled: '#585858',
    inverse: '#2A3040',
    link: '#57F1DB',
    linkHover: '#62FAE3',
  },

  // Code syntax colors
  code: {
    primary: '#66F3B6',
    secondary: '#FBABFF',
    keyword: '#D946EF',
    string: '#2DD4BF',
    number: '#F59E0B',
    comment: '#585858',
  },

  // Chart colors
  chart: {
    series: [
      '#2DD4BF',  // Cyan
      '#D946EF',  // Magenta
      '#10B981',  // Emerald
      '#F59E0B',  // Amber
      '#0EA5E9',  // Sky
      '#8B5CF6',  // Violet
      '#EC4899',  // Pink
      '#14B8A6',  // Teal
    ],
  },
} as const;

export type ColorTokens = typeof colorTokens;

// CSS Variable Generator
export function generateColorCSSVariables(): string {
  const vars: string[] = [];

  function addVars(prefix: string, obj: Record<string, unknown>, depth = 0): void {
    for (const [key, value] of Object.entries(obj)) {
      const cssKey = `--color-${prefix}-${key}`.replace(/_/g, '-');
      if (typeof value === 'object' && value !== null) {
        addVars(`${prefix}-${key}`, value as Record<string, unknown>, depth + 1);
      } else {
        vars.push(`  ${cssKey}: ${value};`);
      }
    }
  }

  addVars('', colorTokens as Record<string, unknown>);

  return vars.join('\n');
}

// Type-safe color access
export const colors = {
  // Backgrounds
  bg: {
    base: colorTokens.background.base,
    workspace: colorTokens.background.workspace,
    elevated: colorTokens.background.elevated,
    overlay: colorTokens.background.overlay,
  },
  // Surfaces
  surface: colorTokens.surface,
  // Borders
  border: colorTokens.border,
  // Primary
  primary: colorTokens.primary,
  secondary: colorTokens.secondary,
  tertiary: colorTokens.tertiary,
  // Semantic
  error: colorTokens.error,
  success: colorTokens.success,
  warning: colorTokens.warning,
  info: colorTokens.info,
  // Text
  text: colorTokens.text,
  // Code
  code: colorTokens.code,
  // Charts
  chart: colorTokens.chart,
};