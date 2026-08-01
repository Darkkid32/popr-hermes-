import { useState, useRef, useEffect } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
  delay?: number;
}

export function Tooltip({
  content,
  children,
  position = 'top',
  offset = 8,
  delay = 200,
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const open = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setIsOpen(true), delay);
  };

  const close = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const positionStyles: Record<string, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2',
    bottom: 'top-full left-1/2 -translate-x-1/2',
    left: 'right-full top-1/2 -translate-y-1/2',
    right: 'left-full top-1/2 -translate-y-1/2',
  };

  const marginStyles: Record<string, CSSProperties> = {
    top: { marginBottom: offset },
    bottom: { marginTop: offset },
    left: { marginRight: offset },
    right: { marginLeft: offset },
  };

  const tooltipContent = (
    <div
      ref={tooltipRef}
      className={clsx(
        'absolute z-[var(--z-tooltip)]',
        'bg-[var(--color-surface-primary)]',
        'rounded-[var(--radius-md)]',
        'shadow-[var(--shadow-lg)]',
        'border border-[var(--color-surface-border)]',
        'whitespace-nowrap',
        'animate-in fade-in-0 zoom-in-95 duration-200',
        positionStyles[position]
      )}
      role="tooltip"
      style={marginStyles[position]}
    >
      <div className="px-2 py-1 text-[var(--text-xs)] text-[var(--color-text-primary)]">
        {content}
      </div>
      <div
        className={clsx(
          'absolute w-0 h-0 border-4 border-transparent',
          {
            top: 'bottom-[-4px] left-1/2 -translate-x-1/2 border-t-[var(--color-surface-border)]',
            bottom: 'top-[-4px] left-1/2 -translate-x-1/2 border-b-[var(--color-surface-border)]',
            left: 'right-[-4px] top-1/2 -translate-y-1/2 border-r-[var(--color-surface-border)]',
            right: 'left-[-4px] top-1/2 -translate-y-1/2 border-l-[var(--color-surface-border)]',
          }[position]
        )}
        aria-hidden="true"
      />
    </div>
  );

  return (
    <div className="relative inline-block" onMouseEnter={open} onMouseLeave={close} onFocus={open} onBlur={close}>
      {children}
      {isOpen && createPortal(tooltipContent, document.body)}
    </div>
  );
}

export default Tooltip;
