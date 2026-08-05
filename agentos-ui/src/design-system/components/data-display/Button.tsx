// Button Component
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      fullWidth = false,
      icon,
      iconPosition = 'start',
      className,
      style,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center font-semibold transition-all
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      select-none
    `;

    const variantStyles = {
      primary: `
        bg-[var(--color-primary-base)] text-[var(--color-primary-on-primary)]
        hover:bg-[var(--color-primary-fixed-dim)]
        active:bg-[var(--color-primary-fixed)]
        focus-visible:ring-[var(--color-primary-base)]
      `,
      secondary: `
        bg-transparent text-[var(--color-primary-base)] border border-[var(--color-primary-base)]
        hover:bg-[var(--color-primary-glow)]
        active:bg-[var(--color-primary-glow-strong)]
        focus-visible:ring-[var(--color-primary-base)]
      `,
      tertiary: `
        bg-transparent text-[var(--color-text-secondary)]
        hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-container)]
        active:bg-[var(--color-surface-container-high)]
        focus-visible:ring-[var(--color-border-focus)]
      `,
      ghost: `
        bg-transparent text-[var(--color-text-secondary)]
        hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-container)]
        active:bg-[var(--color-surface-container-high)]
        focus-visible:ring-[var(--color-border-focus)]
      `,
      danger: `
        bg-[var(--color-error-base)] text-[var(--color-error-on-error)]
        hover:bg-[var(--color-error-container)]
        active:bg-[var(--color-error-container)]
        focus-visible:ring-[var(--color-error-base)]
      `,
      link: `
        bg-transparent text-[var(--color-text-link)] underline-offset-2
        hover:text-[var(--color-text-link-hover)] no-underline hover:underline
        active:text-[var(--color-text-link)]
        focus-visible:ring-[var(--color-text-link)]
        px-0
      `,
    };

    const sizeStyles = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-12 px-5 text-base gap-2',
      xl: 'h-14 px-6 text-lg gap-2.5',
    };

    const iconSize = {
      sm: 'w-3.5 h-3.5',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        style={style}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin"
            width={iconSize[size].replace('w-', '').replace('h-', '')}
            height={iconSize[size].replace('w-', '').replace('h-', '')}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : icon && iconPosition === 'start' ? (
          <span className={cn('flex-shrink-0', iconSize[size])} aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span className={loading ? 'opacity-0' : ''}>{children}</span>
        {icon && iconPosition === 'end' && !loading && (
          <span className={cn('flex-shrink-0', iconSize[size])} aria-hidden="true">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Icon Button variant
export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'icon' | 'iconPosition'> {
  'aria-label': string;
  children: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ 'aria-label': ariaLabel, children, variant = 'tertiary', size = 'md', ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn('p-0', props.className)}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';