import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'brand';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      dot = false,
      removable = false,
      onRemove,
      className,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: 'bg-[var(--color-surface-tertiary)] text-[var(--color-text-secondary)] border-[var(--color-surface-border)]',
      success: 'bg-[var(--color-status-success-bg)] text-[var(--color-status-success)] border-[var(--color-status-success)]',
      warning: 'bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning)] border-[var(--color-status-warning)]',
      error: 'bg-[var(--color-status-error-bg)] text-[var(--color-status-error)] border-[var(--color-status-error)]',
      info: 'bg-[var(--color-status-info-bg)] text-[var(--color-status-info)] border-[var(--color-status-info)]',
      neutral: 'bg-[var(--color-surface-tertiary)] text-[var(--color-text-tertiary)] border-[var(--color-surface-border)]',
      brand: 'bg-[var(--color-brand-500)/15] text-[var(--color-brand-500)] border-[var(--color-brand-500)/30]',
    };

    const sizeStyles = {
      xs: 'px-1.5 py-0.5 text-[var(--text-xs)] gap-0.5',
      sm: 'px-2 py-0.5 text-[var(--text-xs)] gap-1',
      md: 'px-2.5 py-1 text-[var(--text-xs)] gap-1.5',
      lg: 'px-3 py-1.5 text-[var(--text-sm)] gap-2',
    };

    const dotSizeStyles = {
      xs: 'h-1 w-1',
      sm: 'h-1.5 w-1.5',
      md: 'h-1.5 w-1.5',
      lg: 'h-2 w-2',
    };

    return (
      <span
        ref={ref}
        className={twMerge(clsx(
          'inline-flex items-center font-medium rounded-[var(--radius-full)] border',
          'transition-colors duration-200',
          variantStyles[variant],
          sizeStyles[size],
          className
        ))}
        {...props}
      >
        {dot && (
          <span
            className={clsx('rounded-full bg-current', dotSizeStyles[size])}
            aria-hidden="true"
          />
        )}
        <span>{children}</span>
        {removable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className="ml-0.5 -mr-1 flex items-center justify-center rounded-full hover:bg-black/10 hover:dark:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
            aria-label="Remove"
          >
            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
