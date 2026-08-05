// Design System Breakpoint Tokens
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

export const breakpointTokens = {
  mobile: 375,
  mobileLg: 428,
  tablet: 768,
  tabletLg: 1024,
  desktop: 1280,
  desktopLg: 1440,
  desktopXl: 1920,
  desktop2xl: 2560,

  // Semantic media queries
  semantic: {
    mobileOnly: '(max-width: 767px)',
    tabletOnly: '(min-width: 768px) and (max-width: 1023px)',
    desktopOnly: '(min-width: 1024px)',
    mobileAndTablet: '(max-width: 1023px)',
    tabletAndDesktop: '(min-width: 768px)',
  },
} as const;

export type BreakpointTokens = typeof breakpointTokens;

// CSS Variable Generator
export function generateBreakpointCSSVariables(): string {
  const vars: string[] = [];

  Object.entries(breakpointTokens).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([subKey, subValue]) => {
        vars.push(`  --bp-${key}-${subKey}: ${subValue};`);
      });
    } else {
      vars.push(`  --bp-${key}: ${value}px;`);
    }
  });

  return vars.join('\n');
}

// Type-safe breakpoint access
export const breakpoints = breakpointTokens;

// Media query helpers
export const mediaQueries = {
  mobileOnly: `@media ${breakpointTokens.semantic.mobileOnly}`,
  tabletOnly: `@media ${breakpointTokens.semantic.tabletOnly}`,
  desktopOnly: `@media ${breakpointTokens.semantic.desktopOnly}`,
  mobileAndTablet: `@media ${breakpointTokens.semantic.mobileAndTablet}`,
  tabletAndDesktop: `@media ${breakpointTokens.semantic.tabletAndDesktop}`,
};