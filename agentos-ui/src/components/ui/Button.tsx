import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 
      'inline-flex items-center justify-center font-medium transition-all duration-200 ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
      'disabled:opacity-50 disabled:cursor-not-allowed ' +
      'aria-busy:cursor-wait';

    const variantStyles = {
      primary: 'bg-[var(--color-brand-500)] text-[var(--color-text-inverse)] ' +
               'hover:bg-[var(--color-brand-600)] active:bg-[var(--color-brand-700)] ' +
               'shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]',
      secondary: 'bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] ' +
                 'border-[var(--color-surface-border)] ' +
                 'hover:bg-[var(--color-surface-hover)] active:bg-[var(--color-surface-active)]',
      outline: 'border-[var(--color-surface-border)] text-[var(--color-text-primary)] ' +
               'bg-transparent hover:bg-[var(--color-surface-hover)] ' +
               'active:bg-[var(--color-surface-active)]',
      ghost: 'text-[var(--color-text-primary)] bg-transparent ' +
             'hover:bg-[var(--color-surface-hover)] active:bg-[var(--color-surface-active)]',
      destructive: 'bg-[var(--color-status-error)] text-[var(--color-text-inverse)] ' +
                   'hover:opacity-90 active:opacity-90 ' +
                   'shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]',
      link: 'text-[var(--color-text-link)] bg-transparent ' +
            'hover:underline underline-offset-2 ' +
            'hover:text-[var(--color-brand-400)]',
    };

    const sizeStyles = {
      xs: 'px-2 py-1 text-[var(--text-xs)] gap-1',
      sm: 'px-3 py-1.5 text-[var(--text-sm)] gap-1.5',
      md: 'px-4 py-2 text-[var(--text-sm)] gap-2',
      lg: 'px-5 py-2.5 text-[var(--text-base)] gap-2',
      xl: 'px-6 py-3 text-[var(--text-base)] gap-2.5',
      icon: 'p-2',
    };

    const widthStyles = fullWidth ? 'w-full' : '';

    const isLoading = loading || props['aria-busy'] === 'true';

    return (
      <button
        ref={ref}
        className={twMerge(clsx(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          widthStyles,
          className
        ))}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span className={isLoading ? 'sr-only' : ''}>
          {children}
        </span>
        {!isLoading && rightIcon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
