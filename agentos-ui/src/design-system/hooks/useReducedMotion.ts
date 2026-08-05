// useReducedMotion Hook
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState, useEffect } from 'react';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reduced;
}

interface MotionConfig {
  duration: number;
  easing: string;
  iterations?: number | string;
}

interface MotionTokensReturn {
  reduced: boolean;
  duration: Record<string, number>;
  easing: Record<string, string>;
  semantic: Record<string, MotionConfig>;
}

export function useMotionConfig(): MotionTokensReturn {
  const reduced = useReducedMotion();

  const semantic: Record<string, MotionConfig> = {
    hover: { duration: reduced ? 0 : 150, easing: reduced ? 'linear' : 'easeOut' },
    press: { duration: reduced ? 0 : 100, easing: reduced ? 'linear' : 'easeIn' },
    focus: { duration: reduced ? 0 : 150, easing: reduced ? 'linear' : 'easeOut' },
    panelSlide: { duration: reduced ? 0 : 300, easing: reduced ? 'linear' : 'easeOut' },
    modalEnter: { duration: reduced ? 0 : 250, easing: reduced ? 'linear' : 'easeOut' },
    modalExit: { duration: reduced ? 0 : 200, easing: reduced ? 'linear' : 'easeIn' },
    tooltip: { duration: reduced ? 0 : 200, easing: reduced ? 'linear' : 'easeOut' },
    dropdown: { duration: reduced ? 0 : 200, easing: reduced ? 'linear' : 'easeOut' },
    drawer: { duration: reduced ? 0 : 300, easing: reduced ? 'linear' : 'easeOut' },
    aiScanning: { duration: reduced ? 0 : 2000, easing: 'linear', iterations: 'infinite' },
    pulse: { duration: reduced ? 0 : 1500, easing: reduced ? 'linear' : 'easeInOut', iterations: 'infinite' },
    skeleton: { duration: reduced ? 0 : 1500, easing: reduced ? 'linear' : 'easeInOut', iterations: 'infinite' },
    pageTransition: { duration: reduced ? 0 : 300, easing: reduced ? 'linear' : 'easeInOut' },
    sidebarCollapse: { duration: reduced ? 0 : 300, easing: reduced ? 'linear' : 'easeOut' },
    tabSwitch: { duration: reduced ? 0 : 200, easing: reduced ? 'linear' : 'easeOut' },
    accordion: { duration: reduced ? 0 : 250, easing: reduced ? 'linear' : 'easeOut' },
    progress: { duration: reduced ? 0 : 500, easing: reduced ? 'linear' : 'easeOut' },
    toast: { duration: reduced ? 0 : 200, easing: reduced ? 'linear' : 'easeOut' },
    commandPalette: { duration: reduced ? 0 : 200, easing: reduced ? 'linear' : 'easeOut' },
  };

  return {
    reduced,
    duration: {
      instant: reduced ? 0 : 0,
      snap: reduced ? 0 : 150,
      fast: reduced ? 0 : 200,
      normal: reduced ? 0 : 300,
      slow: reduced ? 0 : 400,
      slowest: reduced ? 0 : 500,
    },
    easing: {
      linear: 'linear',
      easeIn: reduced ? 'linear' : 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: reduced ? 'linear' : 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: reduced ? 'linear' : 'cubic-bezier(0.4, 0, 0.2, 1)',
      snap: reduced ? 'linear' : 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      spring: reduced ? 'linear' : 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    semantic,
  };
}

export function useMotionTransition(key: keyof ReturnType<typeof useMotionConfig>['semantic']) {
  const { semantic, reduced } = useMotionConfig();
  const config = semantic[key];

  if (reduced) {
    return { duration: 0 };
  }

  return {
    duration: config.duration / 1000,
    ease: config.easing,
    ...(config.iterations && { repeat: config.iterations === 'infinite' ? Infinity : config.iterations }),
  };
}