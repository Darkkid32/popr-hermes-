import React from 'react';
import { clsx } from 'clsx';
import { Button } from '../ui/Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  illustration?: React.ReactNode;
  className?: string;
}

export function EmptyState({ 
  icon,
  title,
  description,
  action,
  illustration,
  className: _className
}: EmptyStateProps) {
  return (
    <div className={clsx(
      'flex flex-col items-center justify-center p-8 text-center',
      'bg-[var(--color-surface-primary)] rounded-[var(--radius-xl)]',
      'border border-[var(--color-surface-border)]',
      _className
    )}>
      {illustration || icon ? (
        <div className="mb-4 flex-shrink-0">
          {illustration || (
            <div className={clsx(
              'inline-flex items-center justify-center',
              'bg-[var(--color-surface-tertiary)]',
              'rounded-full',
              'p-4'
            )}>
              {icon}
            </div>
          )}
        </div>
      ) : null}
      <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)] mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] max-w-sm mx-auto mb-6">
          {description}
        </p>
      )}
      {action && (
        <Button
          variant={action.variant || 'primary'}
          onClick={action.onClick}
          size="md"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
