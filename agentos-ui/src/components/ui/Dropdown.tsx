import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

export interface DropdownItem {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactElement;
  items: DropdownItem[];
  position?: 'bottom' | 'top' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  offset?: number;
}

export function Dropdown({
  trigger,
  items,
  position = 'bottom',
  align = 'start',
  offset = 4
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const positionKey = `${position}-${align}` as const;

  const positionStyles: Record<string, string> = {
    'bottom-start': 'top-full left-0 mt-1',
    'bottom-center': 'top-full left-1/2 -translate-x-1/2 mt-1',
    'bottom-end': 'top-full right-0 mt-1',
    'top-start': 'bottom-full left-0 mb-1',
    'top-center': 'bottom-full left-1/2 -translate-x-1/2 mb-1',
    'top-end': 'bottom-full right-0 mb-1',
    'left-start': 'right-full top-0 ml-1',
    'left-center': 'right-full top-1/2 -translate-y-1/2 ml-1',
    'left-end': 'right-full bottom-0 ml-1',
    'right-start': 'left-full top-0 mr-1',
    'right-center': 'left-full top-1/2 -translate-y-1/2 mr-1',
    'right-end': 'left-full bottom-0 mr-1',
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      {React.cloneElement(trigger, {
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          e.preventDefault();
          toggle();
        },
        'aria-haspopup': true as const,
        'aria-expanded': isOpen,
      } as React.HTMLAttributes<HTMLElement>)}

      {isOpen && (
        <div
          ref={dropdownRef}
          className={clsx(
            'absolute z-[var(--z-dropdown)]',
            'min-w-[12rem]',
            'bg-[var(--color-surface-primary)]',
            'rounded-[var(--radius-lg)]',
            'shadow-[var(--shadow-lg)]',
            'border border-[var(--color-surface-border)]',
            'py-1',
            'overflow-hidden',
            'animate-in zoom-in-95 duration-150',
            positionStyles[positionKey]
          )}
          style={{ margin: offset }}
        >
          {items.map((item, index) => {
            if (item.divider) {
              return <hr key={`divider-${index}`} className="my-1 border-[var(--color-surface-border)]" />;
            }
            return (
              <button
                key={index}
                type="button"
                onClick={() => {
                  item.onClick?.();
                  close();
                }}
                disabled={item.disabled}
                className={clsx(
                  'w-full px-3 py-2 text-left text-[var(--text-sm)]',
                  'flex items-center gap-2',
                  'transition-colors duration-100',
                  'hover:bg-[var(--color-surface-hover)]',
                  'focus:outline-none focus:bg-[var(--color-surface-hover)]',
                  item.disabled && 'opacity-50 cursor-not-allowed',
                  item.danger && 'text-[var(--color-status-error)]'
                )}
              >
                {item.icon && <span className="flex-shrink-0 w-4 h-4">{item.icon}</span>}
                <span className="flex-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
