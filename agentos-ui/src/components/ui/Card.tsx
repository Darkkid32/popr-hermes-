import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      padding = 'md',
      hoverable = false,
      className,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: 'bg-[var(--color-surface-primary)] border-[var(--color-surface-border)] shadow-[var(--shadow-sm)]',
      elevated: 'bg-[var(--color-surface-primary)] shadow-[var(--shadow-lg)] border-none',
      outlined: 'bg-transparent border-[var(--color-surface-border)] shadow-none',
      filled: 'bg-[var(--color-surface-secondary)] border-none',
    };

    const paddingStyles = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    };

    const hoverStyles = hoverable
      ? 'transition-all duration-200 hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5 cursor-pointer'
      : '';

    return (
      <div
        ref={ref}
        className={twMerge(clsx(
          'rounded-[var(--radius-lg)] transition-all duration-200',
          variantStyles[variant],
          paddingStyles[padding],
          hoverStyles,
          className
        ))}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={twMerge(clsx('px-4 py-3 border-b border-[var(--color-surface-border)]', className))}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  subtitle?: string;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, subtitle, className, ...props }, ref) => (
    <div className="flex flex-col gap-0.5">
      <h3 ref={ref} className={twMerge(clsx('text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]', className))} {...props}>
        {children}
      </h3>
      {subtitle && (
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">{subtitle}</p>
      )}
    </div>
  )
);

CardTitle.displayName = 'CardTitle';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={twMerge(clsx('p-4', className))} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={twMerge(clsx(
        'px-4 py-3 border-t border-[var(--color-surface-border)] bg-[var(--color-surface-secondary)] rounded-b-[var(--radius-lg)] flex items-center justify-end gap-2',
        className
      ))}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

export default Card;
