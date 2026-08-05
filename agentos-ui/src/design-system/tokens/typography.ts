// Design System Typography Tokens
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

export const typographyTokens = {
  fontFamily: {
    heading: 'Space Grotesk, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, Consolas, monospace',
    ui: 'Inter, system-ui, sans-serif',
  },

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  fontSize: {
    'display-lg': { size: '48px', lineHeight: '56px', letterSpacing: '-0.02em', weight: 700 },
    'display-md': { size: '36px', lineHeight: '44px', letterSpacing: '-0.015em', weight: 700 },
    'display-sm': { size: '28px', lineHeight: '36px', letterSpacing: '-0.01em', weight: 600 },

    'headline-lg': { size: '32px', lineHeight: '40px', letterSpacing: '-0.01em', weight: 600 },
    'headline-md': { size: '24px', lineHeight: '32px', letterSpacing: '-0.005em', weight: 600 },
    'headline-sm': { size: '20px', lineHeight: '28px', letterSpacing: '0', weight: 600 },

    'title-lg': { size: '18px', lineHeight: '24px', letterSpacing: '0', weight: 600 },
    'title-md': { size: '16px', lineHeight: '24px', letterSpacing: '0', weight: 600 },
    'title-sm': { size: '14px', lineHeight: '20px', letterSpacing: '0', weight: 600 },

    'body-lg': { size: '18px', lineHeight: '28px', letterSpacing: '0', weight: 400 },
    'body-md': { size: '16px', lineHeight: '24px', letterSpacing: '0', weight: 400 },
    'body-sm': { size: '14px', lineHeight: '20px', letterSpacing: '0', weight: 400 },
    'body-xs': { size: '12px', lineHeight: '16px', letterSpacing: '0', weight: 400 },

    'label-lg': { size: '14px', lineHeight: '20px', letterSpacing: '0', weight: 500 },
    'label-md': { size: '12px', lineHeight: '16px', letterSpacing: '0.02em', weight: 500 },
    'label-sm': { size: '11px', lineHeight: '16px', letterSpacing: '0.03em', weight: 500 },
    'label-caps': { size: '12px', lineHeight: '16px', letterSpacing: '0.05em', weight: 600 },

    'code-md': { size: '14px', lineHeight: '20px', letterSpacing: '0', weight: 400 },
    'code-sm': { size: '12px', lineHeight: '18px', letterSpacing: '0', weight: 400 },
  },

  fluid: {
    'display-lg': 'clamp(32px, 5vw, 48px)',
    'headline-lg': 'clamp(24px, 3.5vw, 32px)',
    'headline-md': 'clamp(20px, 2.5vw, 24px)',
    'title-lg': 'clamp(16px, 2vw, 18px)',
    'body-lg': 'clamp(16px, 1.5vw, 18px)',
    'body-md': 'clamp(14px, 1vw, 16px)',
    'body-sm': 'clamp(12px, 0.8vw, 14px)',
  },
} as const;

export type TypographyTokens = typeof typographyTokens;

export function generateTypographyCSSVariables(): string {
  const vars: string[] = [];

  vars.push(`  --font-heading: ${typographyTokens.fontFamily.heading};`);
  vars.push(`  --font-body: ${typographyTokens.fontFamily.body};`);
  vars.push(`  --font-mono: ${typographyTokens.fontFamily.mono};`);
  vars.push(`  --font-ui: ${typographyTokens.fontFamily.ui};`);

  Object.entries(typographyTokens.fontWeight).forEach(([key, value]) => {
    vars.push(`  --font-weight-${key}: ${value};`);
  });

  Object.entries(typographyTokens.fontSize).forEach(([key, value]) => {
    const cssKey = `--text-${key}`.replace(/_/g, '-');
    vars.push(`  ${cssKey}: ${value.size};`);
    vars.push(`  ${cssKey}-line-height: ${value.lineHeight};`);
    if (value.letterSpacing) {
      vars.push(`  ${cssKey}-letter-spacing: ${value.letterSpacing};`);
    }
    vars.push(`  ${cssKey}-weight: ${value.weight};`);
  });

  return vars.join('\n');
}

export const typography = {
  fontFamily: typographyTokens.fontFamily,
  fontWeight: typographyTokens.fontWeight,
  fontSize: typographyTokens.fontSize,
  fluid: typographyTokens.fluid,
};