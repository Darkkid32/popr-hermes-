import { clsx } from 'clsx';
import { Button } from '../ui/Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  code?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  showDetails?: boolean;
  details?: string;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  code,
  onRetry,
  onDismiss,
  showDetails = false,
  details,
  className
}: ErrorStateProps) {
  return (
    <div className={clsx(
      'flex flex-col items-center justify-center p-8 text-center',
      'bg-[var(--color-status-error-bg)] rounded-[var(--radius-xl)]',
      'border border-[var(--color-status-error)]',
      'max-w-md mx-auto',
      className
    )}>
      <div className="mb-4 p-3 bg-[var(--color-status-error)]/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
        <svg className="h-6 w-6 text-[var(--color-status-error)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="mt-4 text-[var(--text-lg)] font-semibold text-[var(--color-status-error)]">
        {title}
      </h3>
      <p className="mt-2 text-[var(--text-sm)] text-[var(--color-text-secondary)] max-w-sm mx-auto">
        {message}
      </p>
      {code && (
        <p className="mt-1 text-[var(--text-xs)] font-mono text-[var(--color-text-tertiary)]">
          Error code: <code className="font-mono">{code}</code>
        </p>
      )}
      {details && (
        <details className="mt-4 w-full max-w-sm mx-auto text-left" open={showDetails}>
          <summary className="cursor-pointer text-[var(--text-xs)] font-medium text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] flex items-center gap-1">
            <span>Show details</span>
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.707-3.707a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </summary>
          <pre className="mt-2 p-3 bg-[var(--color-surface-tertiary)] rounded-[var(--radius-md)] text-[var(--text-xs)] font-mono text-[var(--color-text-secondary)] overflow-auto max-h-40">
            {details}
          </pre>
        </details>
      )}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center w-full max-w-sm mx-auto">
        <Button
          variant="primary"
          size="sm"
          onClick={onRetry}
        >
          Try Again
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
}

export default ErrorState;
