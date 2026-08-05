// Card Component
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../../utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      padding = 'md',
      hoverable = false,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      rounded-[var(--radius-card)]
      transition-all duration-[var(--motion-normal)]
    `;

    const variantStyles = {
      default: `
        bg-[var(--color-surface-container)]
        border border-[var(--color-border-primary)]
      `,
      elevated: `
        bg-[var(--color-surface-container)]
        border border-[var(--color-border-primary)]
        shadow-[var(--shadow-level2)]
        hover:shadow-[var(--shadow-level3)]
      `,
      outlined: `
        bg-transparent
        border-2 border-[var(--color-border-primary)]
        hover:border-[var(--color-border-secondary)]
      `,
      glass: `
        bg-[var(--color-surface-container)]/80
        backdrop-blur-md
        border border-[var(--color-border-primary)]/50
      `,
      interactive: `
        bg-[var(--color-surface-container)]
        border border-[var(--color-border-primary)]
        hover:bg-[var(--color-surface-container-high)]
        hover:border-[var(--color-border-secondary)]
        cursor-pointer
      `,
    };

    const hoverStyles = hoverable && variant !== 'interactive' ? `
      hover:bg-[var(--color-surface-container-high)]
      hover:border-[var(--color-border-secondary)]
      hover:shadow-[var(--shadow-level2)]
      cursor-pointer
    ` : '';

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          paddingStyles[padding],
          hoverStyles,
          className
        )}
        style={style}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Header
export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'border-b border-[var(--color-border-primary)] pb-3 mb-3',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

// Card Title
export const CardTitle = ({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn(
      'text-[var(--text-title-lg)] font-semibold text-[var(--color-text-primary)]',
      className
    )}
    {...props}
  >
    {children}
  </h3>
);

// Card Description
export const CardDescription = ({ children, className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn(
      'text-[var(--text-body-sm)] text-[var(--color-text-secondary)] mt-1',
      className
    )}
    {...props}
  >
    {children}
  </p>
);

// Card Content
export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

// Card Footer
export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'border-t border-[var(--color-border-primary)] pt-3 mt-3 flex items-center gap-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';