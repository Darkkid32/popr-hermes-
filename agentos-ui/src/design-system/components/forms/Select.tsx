// Select Component - Native HTML Select (Simplified)
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { forwardRef, useId } from 'react';
import type { SelectHTMLAttributes, ChangeEvent } from 'react';
import { cn } from '../../utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onChangeRaw?: (e: ChangeEvent<HTMLSelectElement>) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const sizeStyles = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-4 text-base',
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      hint,
      error,
      placeholder = 'Select...',
      options,
      value,
      defaultValue,
      onChange,
      onChangeRaw,
      size = 'md',
      disabled,
      className,
      style,
      id,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <div className={cn('w-full', className)} style={style}>
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              'block text-[var(--text-label-md)] text-[var(--color-text-primary)] mb-1.5',
              disabled && 'opacity-50'
            )}
          >
            {label}
            {required && <span className="text-[var(--color-error-base)] ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full appearance-none bg-[var(--color-background-base)] border-[var(--color-border-primary)]',
              'text-[var(--color-text-primary)]',
              'rounded-[var(--radius-input)] transition-all duration-[var(--motion-snap)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'hover:border-[var(--color-border-secondary)]',
              error && 'border-[var(--color-border-error)] focus-visible:ring-[var(--color-border-error)]',
              sizeStyles[size],
              'pr-10'
            )}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={hint ? `${selectId}-hint` : error ? `${selectId}-error` : undefined}
            value={value}
            defaultValue={defaultValue}
            onChange={e => { onChange?.(e.target.value); onChangeRaw?.(e); }}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map(option => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-tertiary)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
        {error && (
          <p id={`${selectId}-error`} className="mt-1.5 text-[var(--text-label-md)] text-[var(--color-error-base)] flex items-center gap-1" role="alert">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${selectId}-hint`} className="mt-1.5 text-[var(--text-label-md)] text-[var(--color-text-tertiary)]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';