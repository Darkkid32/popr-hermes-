// Portal Component
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  container?: HTMLElement | null;
  closeOnEscape?: boolean;
  onClose?: () => void;
}

export const Portal = ({ children, container: containerProp, closeOnEscape = true, onClose }: PortalProps) => {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    
    const container = containerProp || document.body;
    
    if (!containerRef.current) {
      containerRef.current = document.createElement('div');
      container.appendChild(containerRef.current);
    }

    previousActiveElement.current = document.activeElement as HTMLElement;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      
      if (containerRef.current && containerRef.current.parentNode) {
        containerRef.current.parentNode.removeChild(containerRef.current);
      }
      containerRef.current = null;
      
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [containerProp, closeOnEscape, onClose]);

  if (!mounted || !containerRef.current) {
    return null;
  }

  return createPortal(children, containerRef.current);
};

export function usePortal(container?: HTMLElement | null) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    if (!containerRef.current) {
      containerRef.current = document.createElement('div');
      (container || document.body).appendChild(containerRef.current);
    }
    return () => {
      if (containerRef.current && containerRef.current.parentNode) {
        containerRef.current.parentNode.removeChild(containerRef.current);
      }
      containerRef.current = null;
    };
  }, [container]);

  return { mounted, containerRef };
}

export { createPortal } from 'react-dom';