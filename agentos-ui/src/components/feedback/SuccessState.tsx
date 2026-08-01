import { useEffect } from 'react';
import { clsx } from 'clsx';
import { Button } from '../ui/Button';

export interface SuccessStateProps {
  title?: string;
  message: string;
  onContinue?: () => void;
  onAction?: { label: string; onClick: () => void };
  autoDismiss?: number;
  className?: string;
}

export function SuccessState({ 
  title = 'Success!',
  message,
  onContinue,
  onAction,
  autoDismiss,
  className
}: SuccessStateProps) {
  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        onContinue?.();
      }, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, onContinue]);

  return (
    <div className={clsx(
      'flex flex-col items-center justify-center p-8 text-center',
      'bg-[var(--color-status-success-bg)] rounded-[var(--radius-xl)]',
      'border border-[var(--color-status-success)]',
      'max-w-md mx-auto',
      className
    )}>
      <div className="mb-4 p-3 bg-[var(--color-status-success)]/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
        <svg className="h-6 w-6 text-[var(--color-status-success)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-status-success)] mb-2">
        {title}
      </h3>
      <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] max-w-sm mx-auto mb-6">
        {message}
      </p>
      <div className="w-full flex flex-col sm:flex-row gap-3 justify-center">
        {onContinue && (
          <Button
            variant="primary"
            size="sm"
            onClick={onContinue}
            className="flex-1"
          >
            Continue
          </Button>
        )}
        {onAction && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onAction.onClick}
            className="flex-1"
          >
            {onAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}

export default SuccessState;
