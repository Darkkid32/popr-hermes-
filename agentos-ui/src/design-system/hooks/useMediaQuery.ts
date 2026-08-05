// useMediaQuery Hook
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState, useEffect } from 'react';
import { breakpoints } from '../tokens/breakpoints';

type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'desktop-lg' | 'desktop-xl' | 'desktop-2xl';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

export function useIsMobile(): boolean {
  return useMediaQuery(breakpoints.semantic.mobileOnly);
}

export function useIsTablet(): boolean {
  return useMediaQuery(breakpoints.semantic.tabletOnly);
}

export function useIsDesktop(): boolean {
  return useMediaQuery(breakpoints.semantic.desktopOnly);
}

export function useIsMobileOrTablet(): boolean {
  return useMediaQuery(breakpoints.semantic.mobileAndTablet);
}

export function useIsTabletOrDesktop(): boolean {
  return useMediaQuery(breakpoints.semantic.tabletAndDesktop);
}

export function useCurrentBreakpoint(): Breakpoint {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  return 'desktop';
}

export function useResponsiveValue<T>(values: Partial<Record<Breakpoint, T>>, defaultValue: T): T {
  const breakpoint = useCurrentBreakpoint();
  
  const breakpointOrder: Breakpoint[] = ['mobile', 'tablet', 'desktop', 'desktop-lg', 'desktop-xl', 'desktop-2xl'];
  const currentIndex = breakpointOrder.indexOf(breakpoint);
  
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (bp in values) {
      return values[bp]!;
    }
  }
  
  for (let i = currentIndex + 1; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (bp in values) {
      return values[bp]!;
    }
  }
  
  return defaultValue;
}

export function useContainerQuery(containerRef: React.RefObject<HTMLElement>, query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    const container = containerRef.current;
    const containerQuery = container.style.containerType ? 
      window.matchMedia(`@container ${query}`) : 
      null;

    if (!containerQuery) return;

    setMatches(containerQuery.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    containerQuery.addEventListener('change', handler);
    return () => containerQuery.removeEventListener('change', handler);
  }, [containerRef, query]);

  return matches;
}

export function useGridColumns(): number {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  if (isMobile) return 1;
  if (isTablet) return 4;
  return 12;
}

export function useGutter(): string {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  if (isMobile) return 'var(--space-md)';
  if (isTablet) return 'var(--space-md)';
  return 'var(--space-gutter)';
}