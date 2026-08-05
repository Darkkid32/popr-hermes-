// Avatar Component
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { forwardRef, useMemo, useState, Children, cloneElement } from 'react';
import type { HTMLAttributes, ReactNode, ReactElement } from 'react';
import { cn } from '../../utils';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'away' | 'busy' | 'offline';
  statusPosition?: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left';
  fallback?: ReactNode;
}

const sizeStyles = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-[11px]',
  md: 'w-10 h-10 text-[12px]',
  lg: 'w-12 h-12 text-[14px]',
  xl: 'w-16 h-16 text-[18px]',
  '2xl': 'w-24 h-24 text-[24px]',
};

const statusSize = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-3.5 h-3.5',
  '2xl': 'w-4 h-4',
};

const statusPositions = {
  'bottom-right': 'bottom-0 right-0',
  'top-right': 'top-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'top-left': 'top-0 left-0',
};

const statusColors = {
  online: 'bg-[var(--color-success-base)]',
  away: 'bg-[var(--color-warning-base)]',
  busy: 'bg-[var(--color-error-base)]',
  offline: 'bg-[var(--color-text-tertiary)]',
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      name,
      size = 'md',
      shape = 'circle',
      status,
      statusPosition = 'bottom-right',
      fallback,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const initials = useMemo(() => {
      if (!name) return '';
      const parts = name.trim().split(/\s+/);
      if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }, [name]);

    const hasImage = src && !alt?.includes('failed');
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
      setImageError(true);
    };

    const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-[var(--radius-card)]';

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center overflow-hidden bg-[var(--color-surface-container)]',
          'flex-shrink-0',
          shapeClass,
          sizeStyles[size],
          className
        )}
        style={style}
        {...props}
      >
        {(hasImage && !imageError) ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[var(--color-surface-container-high)] text-[var(--color-text-secondary)] font-medium select-none">
            {fallback || initials}
          </div>
        )}
        {status && (
          <span
            className={cn(
              'absolute rounded-full border-2 border-[var(--color-background-workspace)]',
              statusColors[status],
              statusSize[size],
              statusPositions[statusPosition]
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

// Avatar Group
export interface AvatarGroupProps {
  children: ReactNode;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  style?: React.CSSProperties;
  shape?: 'circle' | 'square';
}

export const AvatarGroup = ({ children, max = 5, size = 'md', className, style, shape = 'circle' }: AvatarGroupProps) => {
  const childArray = Children.toArray(children);
  const visibleChildren = childArray.slice(0, max);
  const remainingCount = childArray.length - max;

  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-[var(--radius-card)]';

  return (
    <div className={cn('flex -space-x-2', className)} style={style} aria-label={`${childArray.length} users`}>
      {visibleChildren.map((child, index) =>
        cloneElement(child as ReactElement<any>, {
          key: (child as ReactElement<any>).key ?? index,
          size,
          className: cn('ring-2 ring-[var(--color-background-workspace)]', (child as ReactElement<any>).props.className),
        })
      )}
      {remainingCount > 0 && (
        <div
          className={cn(
            'flex items-center justify-center bg-[var(--color-surface-container-high)] text-[var(--color-text-tertiary)] font-medium',
            'ring-2 ring-[var(--color-background-workspace)]',
            shapeClass,
            sizeStyles[size]
          )}
          aria-label={`${remainingCount} more`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};