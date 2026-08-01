import React from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'inverse';
  label?: string;
}

export function Spinner({
  size = 'md',
  color = 'primary',
  label = 'Loading...',
  className,
  ...props
}: SpinnerProps) {
  const sizeStyles = {
    xs: 'h-3 w-3 border-1.5',
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-2',
    xl: 'h-12 w-12 border-3',
  };

  const colorStyles = {
    primary: 'border-[var(--color-brand-500)] border-t-transparent',
    secondary: 'border-[var(--color-text-tertiary)] border-t-transparent',
    inverse: 'border-[var(--color-text-inverse)] border-t-transparent',
  };

  return (
    <div
      className={clsx(
        'inline-flex items-center justify-center',
        'animate-spin',
        'rounded-full',
        sizeStyles[size],
        colorStyles[color],
        className
      )}
      role="status"
      aria-label={label}
      {...props}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
}

export interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export function LoadingOverlay({
  isVisible,
  message = 'Loading...',
  size = 'md',
  fullScreen = false
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  const spinnerSizes = {
    sm: '1.5rem',
    md: '2.5rem',
    lg: '3.5rem',
  };

  const overlay = (
    <div
      className={clsx(
        'flex items-center justify-center',
        'bg-[var(--color-surface-primary)/80] backdrop-blur-sm',
        'z-[var(--z-loading)]',
        fullScreen ? 'fixed inset-0' : 'absolute inset-0'
      )}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="animate-spin rounded-full border-2 border-[var(--color-brand-500)] border-t-transparent"
          style={{ width: spinnerSizes[size], height: spinnerSizes[size] }}
          role="status"
          aria-hidden="true"
        />
        <p className="text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)]">
          {message}
        </p>
      </div>
    </div>
  );

  return fullScreen
    ? createPortal(overlay, document.body)
    : overlay;
}

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className,
  ...props
}: SkeletonProps) {
  const variantStyles = {
    text: 'h-4 rounded-[var(--radius-sm)]',
    circular: 'rounded-full',
    rectangular: 'rounded-[var(--radius-md)]',
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-[wave_1.5s_ease-in-out_infinite]',
    none: '',
  };

  return (
    <div
      className={clsx(
        'bg-[var(--color-surface-tertiary)]',
        variantStyles[variant],
        animationStyles[animation],
        className
      )}
      style={{ width, height }}
      aria-hidden="true"
      {...props}
    />
  );
}

export interface LoadingStateProps {
  isLoading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  skeleton?: boolean;
}

export function LoadingState({
  isLoading,
  children,
  fallback,
  skeleton = false
}: LoadingStateProps) {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="animate-fade-in" role="status" aria-live="polite">
      {fallback || (
        <div className="flex items-center justify-center p-8">
          {skeleton ? (
            <div className="flex flex-col items-center gap-3">
              <Skeleton variant="circular" className="h-12 w-12" />
              <Skeleton variant="text" className="w-3/4" />
              <Skeleton variant="text" className="w-1/2" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div
                className="animate-spin rounded-full border-3 border-[var(--color-brand-500)] border-t-transparent"
                style={{ width: '2.5rem', height: '2.5rem' }}
                role="status"
                aria-hidden="true"
              />
              <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
                Loading...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LoadingState;
