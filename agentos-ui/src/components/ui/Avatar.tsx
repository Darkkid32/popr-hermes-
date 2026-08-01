import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'busy' | 'away';
  statusPosition?: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left';
}

const sizeStyles = {
  xs: 'h-5 w-5 text-[var(--text-xs)]',
  sm: 'h-6 w-6 text-[var(--text-xs)]',
  md: 'h-8 w-8 text-[var(--text-sm)]',
  lg: 'h-10 w-10 text-[var(--text-base)]',
  xl: 'h-12 w-12 text-[var(--text-lg)]',
  '2xl': 'h-16 w-16 text-[var(--text-2xl)]',
};

const statusSizeStyles = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
  lg: 'h-2.5 w-2.5',
  xl: 'h-3 w-3',
  '2xl': 'h-3.5 w-3.5',
};

const statusPositionStyles = {
  'bottom-right': 'bottom-0 right-0',
  'top-right': 'top-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'top-left': 'top-0 left-0',
};

const statusColorStyles = {
  online: 'bg-[var(--color-status-success)]',
  offline: 'bg-[var(--color-neutral-500)]',
  busy: 'bg-[var(--color-status-warning)]',
  away: 'bg-[var(--color-status-info)]',
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      fallback,
      size = 'md',
      shape = 'circle',
      status,
      statusPosition = 'bottom-right',
      className,
      ...props
    },
    ref
  ) => {
    const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-[var(--radius-md)]';

    return (
      <div
        ref={ref}
        className={clsx(
          'relative inline-flex shrink-0 overflow-hidden',
          sizeStyles[size],
          shapeClass,
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || ''}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className={clsx(
              'flex h-full w-full items-center justify-center bg-[var(--color-surface-tertiary)] text-[var(--color-text-tertiary)] font-medium',
              sizeStyles[size]
            )}
            aria-hidden="true"
          >
            {fallback || alt?.charAt(0).toUpperCase() || '?'}
          </div>
        )}
        {status && (
          <span
            className={clsx(
              'absolute rounded-full border-2 border-[var(--color-surface-primary)]',
              statusSizeStyles[size],
              statusPositionStyles[statusPosition],
              statusColorStyles[status]
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;
