// Badge Component
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../../utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

const variantStyles = {
  default: 'bg-[var(--color-surface-container-high)] text-[var(--color-text-secondary)] border border-[var(--color-border-primary)]',
  primary: 'bg-[var(--color-primary-glow)] text-[var(--color-primary-base)] border border-[var(--color-primary-base)]/30',
  secondary: 'bg-[var(--color-secondary-base)]/15 text-[var(--color-secondary-base)] border border-[var(--color-secondary-base)]/30',
  success: 'bg-[var(--color-success-base)]/15 text-[var(--color-success-base)] border border-[var(--color-success-base)]/30',
  warning: 'bg-[var(--color-warning-base)]/15 text-[var(--color-warning-base)] border border-[var(--color-warning-base)]/30',
  error: 'bg-[var(--color-error-base)]/15 text-[var(--color-error-base)] border border-[var(--color-error-base)]/30',
  info: 'bg-[var(--color-info-base)]/15 text-[var(--color-info-base)] border border-[var(--color-info-base)]/30',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
  lg: 'px-3 py-1 text-sm gap-2',
};

const dotSize = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
};

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
      style,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-[var(--radius-chip)]',
          'border transition-colors duration-[var(--motion-snap)]',
          variantStyles[variant],
          sizeStyles[size],
          removable && 'pr-1',
          className
        )}
        style={style}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'rounded-full flex-shrink-0',
              dotSize[size],
              variant === 'default' && 'bg-[var(--color-text-tertiary)]',
              variant === 'primary' && 'bg-[var(--color-primary-base)]',
              variant === 'secondary' && 'bg-[var(--color-secondary-base)]',
              variant === 'success' && 'bg-[var(--color-success-base)]',
              variant === 'warning' && 'bg-[var(--color-warning-base)]',
              variant === 'error' && 'bg-[var(--color-error-base)]',
              variant === 'info' && 'bg-[var(--color-info-base)]',
            )}
            aria-hidden="true"
          />
        )}
        <span className="truncate">{children}</span>
        {removable && (
          <button
            type="button"
            className={cn(
              'ml-1 flex items-center justify-center rounded-[var(--radius-sm)]',
              'hover:bg-[var(--color-surface-container-high)]',
              'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]',
              size === 'sm' && 'p-0.5',
              size === 'md' && 'p-1',
              size === 'lg' && 'p-1.5'
            )}
            onClick={onRemove}
            aria-label="Remove"
          >
            <svg width={size === 'sm' ? 10 : size === 'md' ? 12 : 14} height={size === 'sm' ? 10 : size === 'md' ? 12 : 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Status Badge - specialized for status indicators
export interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'running' | 'stopped' | 'deploying' | 'warning' | 'error' | 'success' | 'info';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const statusConfig = {
  active: { variant: 'success' as const, dot: true, animated: true },
  inactive: { variant: 'default' as const, dot: true, animated: false },
  pending: { variant: 'warning' as const, dot: true, animated: true },
  running: { variant: 'primary' as const, dot: true, animated: true },
  stopped: { variant: 'error' as const, dot: true, animated: false },
  deploying: { variant: 'info' as const, dot: true, animated: true },
  warning: { variant: 'warning' as const, dot: true, animated: false },
  error: { variant: 'error' as const, dot: true, animated: false },
  success: { variant: 'success' as const, dot: true, animated: false },
  info: { variant: 'info' as const, dot: true, animated: false },
};

export const StatusBadge = ({ status, label, size = 'md', animated }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const isAnimated = animated ?? config.animated ?? false;

  return (
    <Badge
      variant={config.variant}
      size={size}
      dot={config.dot}
      className={cn(isAnimated && 'animate-pulse')}
    >
      {label || capitalize(status)}
    </Badge>
  );
};

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}