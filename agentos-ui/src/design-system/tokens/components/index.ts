// Design System Component-Specific Tokens
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

// Button tokens
export const buttonTokens = {
  height: {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 56,
  },
  padding: {
    sm: '8px 16px',
    md: '10px 20px',
    lg: '12px 24px',
    xl: '14px 28px',
  },
  iconGap: 8,
  iconSize: 16,
  fontSize: {
    sm: '12px',
    md: '14px',
    lg: '16px',
    xl: '16px',
  },
  fontWeight: 600,
  borderRadius: 6,
} as const;

// Input tokens
export const inputTokens = {
  height: {
    sm: 36,
    md: 44,
    lg: 52,
  },
  padding: '0 16px',
  iconGap: 12,
  iconSize: 18,
  fontSize: '14px',
  borderRadius: 4,
  borderWidth: 1,
} as const;

// Table tokens
export const tableTokens = {
  rowHeight: {
    compact: 40,
    normal: 48,
    comfortable: 56,
  },
  cellPadding: '0 16px',
  headerHeight: 44,
  borderWidth: 1,
  borderColor: '#1E293B',
} as const;

// Modal/Drawer tokens
export const modalTokens = {
  maxWidth: {
    sm: 400,
    md: 560,
    lg: 720,
    xl: 960,
    full: '100%',
  },
  padding: 24,
  headerHeight: 56,
  footerHeight: 64,
  borderRadius: 12,
} as const;

export const drawerTokens = {
  width: {
    sm: 320,
    md: 400,
    lg: 520,
    full: '100%',
  },
  padding: 24,
  borderRadius: 12,
} as const;

// Icon tokens
export const iconTokens = {
  size: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    '2xl': 32,
  },
  semantic: {
    button: 16,
    input: 18,
    header: 20,
    sidebar: 20,
    card: 24,
    emptyState: 64,
    loading: 24,
  },
  strokeWidth: {
    thin: 1.5,
    normal: 2,
    thick: 2.5,
  },
} as const;

// Component tokens aggregate
export const componentTokens = {
  button: buttonTokens,
  input: inputTokens,
  table: tableTokens,
  modal: modalTokens,
  drawer: drawerTokens,
  icon: iconTokens,
} as const;

export type ComponentTokens = typeof componentTokens;

// CSS Variable Generator for all component tokens
export function generateComponentCSSVariables(): string {
  const vars: string[] = [];

  // Button
  Object.entries(buttonTokens.height).forEach(([key, value]) => {
    vars.push(`  --button-height-${key}: ${value}px;`);
  });
  Object.entries(buttonTokens.padding).forEach(([key, value]) => {
    vars.push(`  --button-padding-${key}: ${value};`);
  });
  vars.push(`  --button-icon-gap: ${buttonTokens.iconGap}px;`);
  vars.push(`  --button-icon-size: ${buttonTokens.iconSize}px;`);
  vars.push(`  --button-border-radius: ${buttonTokens.borderRadius}px;`);

  // Input
  Object.entries(inputTokens.height).forEach(([key, value]) => {
    vars.push(`  --input-height-${key}: ${value}px;`);
  });
  vars.push(`  --input-padding: ${inputTokens.padding};`);
  vars.push(`  --input-icon-gap: ${inputTokens.iconGap}px;`);
  vars.push(`  --input-icon-size: ${inputTokens.iconSize}px;`);
  vars.push(`  --input-border-radius: ${inputTokens.borderRadius}px;`);

  // Table
  Object.entries(tableTokens.rowHeight).forEach(([key, value]) => {
    vars.push(`  --table-row-height-${key}: ${value}px;`);
  });
  vars.push(`  --table-cell-padding: ${tableTokens.cellPadding};`);
  vars.push(`  --table-header-height: ${tableTokens.headerHeight}px;`);
  vars.push(`  --table-border-width: ${tableTokens.borderWidth}px;`);
  vars.push(`  --table-border-color: ${tableTokens.borderColor};`);

  // Modal
  Object.entries(modalTokens.maxWidth).forEach(([key, value]) => {
    vars.push(`  --modal-max-width-${key}: ${value};`);
  });
  vars.push(`  --modal-padding: ${modalTokens.padding}px;`);
  vars.push(`  --modal-header-height: ${modalTokens.headerHeight}px;`);
  vars.push(`  --modal-footer-height: ${modalTokens.footerHeight}px;`);
  vars.push(`  --modal-border-radius: ${modalTokens.borderRadius}px;`);

  // Drawer
  Object.entries(drawerTokens.width).forEach(([key, value]) => {
    vars.push(`  --drawer-width-${key}: ${value};`);
  });
  vars.push(`  --drawer-padding: ${drawerTokens.padding}px;`);
  vars.push(`  --drawer-border-radius: ${drawerTokens.borderRadius}px;`);

  // Icon
  Object.entries(iconTokens.size).forEach(([key, value]) => {
    vars.push(`  --icon-size-${key}: ${value}px;`);
  });
  Object.entries(iconTokens.semantic).forEach(([key, value]) => {
    vars.push(`  --icon-size-${key}: ${value}px;`);
  });
  Object.entries(iconTokens.strokeWidth).forEach(([key, value]) => {
    vars.push(`  --icon-stroke-${key}: ${value};`);
  });

  return vars.join('\n');
}