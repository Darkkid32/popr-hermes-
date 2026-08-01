import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId = hint ? `${inputId}-hint` : undefined;

    const hasError = Boolean(error);

    return (
      <div className={clsx('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)]"
          >
            {label}
            {required && <span className="text-[var(--color-status-error)] ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[var(--color-text-tertiary)]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={twMerge(clsx(
              'rounded-[var(--radius-md)] border border-[var(--color-surface-border)]',
              'bg-[var(--color-surface-primary)]',
              'text-[var(--color-text-primary)]',
              'placeholder:text-[var(--color-text-tertiary)]',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)] focus:border-transparent',
              'aria-invalid:border-[var(--color-status-error)] aria-invalid:focus:ring-[var(--color-status-error)]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'px-3 py-2 text-[var(--text-sm)]',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              className
            ))}
            disabled={disabled}
            required={required}
            aria-invalid={hasError}
            aria-describedby={errorId || hintId ? (errorId ? `${errorId}${hintId ? ' ' + hintId : ''}` : hintId) : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[var(--color-text-tertiary)] [&_button]:pointer-events-auto [&_button]:cursor-pointer">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-[var(--text-xs)] text-[var(--color-status-error)]" role="alert">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={hintId} className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
