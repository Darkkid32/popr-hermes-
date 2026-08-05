// Design System Motion Tokens
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

export const motionTokens = {
  duration: {
    instant: 0,
    snap: 150,
    fast: 200,
    normal: 300,
    slow: 400,
    slowest: 500,
  },

  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    snap: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  semantic: {
    hover: { duration: 150, easing: 'easeOut' },
    press: { duration: 100, easing: 'easeIn' },
    focus: { duration: 150, easing: 'easeOut' },
    panelSlide: { duration: 300, easing: 'easeOut' },
    modalEnter: { duration: 250, easing: 'easeOut' },
    modalExit: { duration: 200, easing: 'easeIn' },
    tooltip: { duration: 200, easing: 'easeOut' },
    dropdown: { duration: 200, easing: 'easeOut' },
    drawer: { duration: 300, easing: 'easeOut' },
    aiScanning: { duration: 2000, easing: 'linear' },
    pulse: { duration: 1500, easing: 'easeInOut' },
    skeleton: { duration: 1500, easing: 'easeInOut' },
    pageTransition: { duration: 300, easing: 'easeInOut' },
    sidebarCollapse: { duration: 300, easing: 'easeOut' },
    tabSwitch: { duration: 200, easing: 'easeOut' },
    accordion: { duration: 250, easing: 'easeOut' },
    progress: { duration: 500, easing: 'easeOut' },
    toast: { duration: 200, easing: 'easeOut' },
    commandPalette: { duration: 200, easing: 'easeOut' },
  },
} as const;

export type MotionTokens = typeof motionTokens;

export function generateMotionCSSVariables(): string {
  const vars: string[] = [];

  Object.entries(motionTokens.duration).forEach(([key, value]) => {
    vars.push(`  --motion-${key}: ${value}ms;`);
  });

  Object.entries(motionTokens.easing).forEach(([key, value]) => {
    vars.push(`  --easing-${key}: ${value};`);
  });

  Object.entries(motionTokens.semantic).forEach(([key, value]) => {
    vars.push(`  --motion-${key}-duration: ${value.duration}ms;`);
    vars.push(`  --motion-${key}-easing: ${value.easing};`);
  });

  return vars.join('\n');
}

export const motion = motionTokens;