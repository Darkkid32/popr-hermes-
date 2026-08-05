// useFocusTrap Hook
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useEffect, useRef, useCallback } from 'react';

interface UseFocusTrapOptions {
  enabled?: boolean;
  onEscape?: () => void;
  clickOutsideToClose?: boolean;
}

interface FocusRestore {
  saveFocus: () => void;
  restoreFocus: () => void;
}

export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  options: UseFocusTrapOptions = {}
): void {
  const { enabled = true, onEscape, clickOutsideToClose = false } = options;
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const focusableElementsRef = useRef<HTMLElement[]>([]);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');

    return Array.from(containerRef.current.querySelectorAll<HTMLElement>(focusableSelectors))
      .filter(el => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0);
  }, [containerRef]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled || event.key !== 'Tab') return;

    const focusableElements = focusableElementsRef.current;
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey) {
      // Shift + Tab: move backwards
      if (activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: move forwards
      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }, [enabled]);

  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (!enabled || event.key !== 'Escape') return;
    onEscape?.();
  }, [enabled, onEscape]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (!enabled || !clickOutsideToClose) return;
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      const closeButton = containerRef.current.querySelector('[data-close], [aria-label="Close"]') as HTMLElement;
      closeButton?.click();
    }
  }, [enabled, clickOutsideToClose]);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement;
    focusableElementsRef.current = getFocusableElements();

    if (focusableElementsRef.current.length > 0) {
      focusableElementsRef.current[0].focus();
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleEscape);
    if (clickOutsideToClose) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    const body = document.body;
    const originalOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleEscape);
      if (clickOutsideToClose) {
        document.removeEventListener('mousedown', handleClickOutside);
      }
      body.style.overflow = originalOverflow;

      if (previouslyFocusedRef.current) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [enabled, containerRef, getFocusableElements, handleKeyDown, handleEscape, handleClickOutside, clickOutsideToClose]);
}

export function useFocusRestore(): FocusRestore {
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previouslyFocusedRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previouslyFocusedRef.current) {
      previouslyFocusedRef.current.focus();
      previouslyFocusedRef.current = null;
    }
  }, []);

  return { saveFocus, restoreFocus };
}