import { Card } from '../ui/Card';
import { clsx } from 'clsx';

interface KPICardProps {
  label: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  deltaTone?: 'up' | 'down' | 'neutral';
  icon?: string;
  accent?: string;
}

export function KPICard({ label, value, delta, deltaLabel, deltaTone = 'up', icon, accent = 'var(--color-brand-500)' }: KPICardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">
            {label}
          </p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-primary)] mt-1">
            {value}
          </p>
          {delta !== undefined && (
            <p
              className={clsx(
                'text-[var(--text-xs)] font-medium mt-1 flex items-center gap-1',
                deltaTone === 'up' && 'text-[var(--color-status-success)]',
                deltaTone === 'down' && 'text-[var(--color-status-error)]',
                deltaTone === 'neutral' && 'text-[var(--color-text-tertiary)]'
              )}
            >
              <span>{delta > 0 ? '↑' : delta < 0 ? '↓' : '→'}</span>
              <span>{Math.abs(delta)}%</span>
              {deltaLabel && <span className="text-[var(--color-text-tertiary)]">{deltaLabel}</span>}
            </p>
          )}
        </div>
        {icon && (
          <div
            className="h-10 w-10 rounded-[var(--radius-lg)] flex items-center justify-center text-xl shrink-0"
            style={{ background: `color-mix(in oklab, ${accent} 15%, transparent)`, color: accent }}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
