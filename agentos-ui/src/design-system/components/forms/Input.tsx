// Input Component
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { forwardRef, useId, useState, useEffect } from 'react';
import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'suffix'> {
  label?: string;
  hint?: string;
  error?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  clearable?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-4 text-base',
};

const iconSize = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-5 h-5',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      prefix,
      suffix,
      clearable,
      size = 'md',
      className,
      style,
      id,
      disabled,
      readOnly,
      onChange,
      onBlur,
      onFocus,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const [isFocused, setIsFocused] = useState(false);
    const [showClear, setShowClear] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (clearable) setShowClear(e.target.value.length > 0);
      onChange?.(e);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onChange?.({ target: { value: '', name: props.name } } as React.ChangeEvent<HTMLInputElement>);
      setShowClear(false);
      (ref as React.RefObject<HTMLInputElement>).current?.focus();
    };

    const hasPrefix = !!prefix;
    const hasSuffix = !!suffix || clearable;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-[var(--text-label-md)] text-[var(--color-text-primary)] mb-1.5',
              disabled && 'opacity-50'
            )}
          >
            {label}
            {props.required && <span className="text-[var(--color-error-base)] ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          {hasPrefix && (
            <div
              className={cn(
                'absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none',
                iconSize[size]
              )}
              aria-hidden="true"
            >
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-[var(--color-background-base)] border-[var(--color-border-primary)]',
              'text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)]',
              'rounded-[var(--radius-input)] transition-all duration-[var(--motion-snap)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'read-only:bg-[var(--color-surface-container-low)]',
              'hover:border-[var(--color-border-secondary)]',
              error && 'border-[var(--color-border-error)] focus-visible:ring-[var(--color-border-error)]',
              isFocused && !error && 'border-[var(--color-border-focus)] ring-2 ring-[var(--color-border-focus)]/20',
              sizeStyles[size],
              hasPrefix && 'pl-10',
              hasSuffix && 'pr-10',
              className
            )}
            style={style}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={cn(hintId, errorId)}
            onChange={handleChange}
            onBlur={(e) => { setIsFocused(false); onBlur?.(e); }}
            onFocus={(e) => { setIsFocused(true); onFocus?.(e); }}
            value={value}
            defaultValue={defaultValue}
            {...props}
          />
          {hasSuffix && (
            <div className={cn('absolute inset-y-0 right-0 flex items-center pr-3', iconSize[size])}>
              {clearable && showClear && !disabled && !readOnly && (
                <button
                  type="button"
                  className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors p-0.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-container)]"
                  onMouseDown={handleClear}
                  aria-label="Clear input"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
              {suffix && !clearable && <span aria-hidden="true">{suffix}</span>}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-[var(--text-label-md)] text-[var(--color-error-base)] flex items-center gap-1" role="alert">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={hintId} className="mt-1.5 text-[var(--text-label-md)] text-[var(--color-text-tertiary)]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea Component
export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  minRows?: number;
  maxRows?: number;
  autoResize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      hint,
      error,
      size = 'md',
      minRows = 3,
      maxRows,
      autoResize = false,
      className,
      style,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const hintId = hint ? `${textareaId}-hint` : undefined;
    const errorId = error ? `${textareaId}-error` : undefined;

    const textareaRef = ref as React.RefObject<HTMLTextAreaElement>;

    useEffect(() => {
      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [autoResize, props.value, props.defaultValue]);

    const textareaStyle = {
      ...style,
      minHeight: `${minRows * 1.5}rem`,
      maxHeight: maxRows ? `${maxRows * 1.5}rem` : undefined,
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              'block text-[var(--text-label-md)] text-[var(--color-text-primary)] mb-1.5',
              disabled && 'opacity-50'
            )}
          >
            {label}
            {props.required && <span className="text-[var(--color-error-base)] ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={textareaRef}
          id={textareaId}
          className={cn(
            'w-full bg-[var(--color-background-base)] border-[var(--color-border-primary)]',
            'text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)]',
            'rounded-[var(--radius-input)] transition-all duration-[var(--motion-snap)] resize-none',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'hover:border-[var(--color-border-secondary)]',
            error && 'border-[var(--color-border-error)] focus-visible:ring-[var(--color-border-error)]',
            sizeStyles[size],
            className
          )}
          style={textareaStyle}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={cn(hintId, errorId)}
          rows={minRows}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-[var(--text-label-md)] text-[var(--color-error-base)] flex items-center gap-1" role="alert">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={hintId} className="mt-1.5 text-[var(--text-label-md)] text-[var(--color-text-tertiary)]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';