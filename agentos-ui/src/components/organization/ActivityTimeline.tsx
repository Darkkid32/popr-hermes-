import { clsx } from 'clsx';
import { Badge } from '../ui/Badge';
import { useOrganizationStore } from '../../stores/organizationStore';
import type { ActivityEvent } from '../../stores/organizationStore';

const TYPE_STYLES: Record<ActivityEvent['type'], { icon: string; color: string }> = {
  member: { icon: '👤', color: 'var(--color-brand-500)' },
  team: { icon: '👥', color: 'var(--color-accent-cyan-500)' },
  project: { icon: '📦', color: 'var(--color-status-success)' },
  environment: { icon: '🌐', color: 'var(--color-status-info)' },
  license: { icon: '🗝️', color: 'var(--color-status-warning)' },
  security: { icon: '🛡️', color: 'var(--color-status-error)' },
  billing: { icon: '💳', color: 'var(--color-brand-500)' },
  settings: { icon: '⚙️', color: 'var(--color-text-tertiary)' },
};

const OUTCOME_VARIANT = {
  success: 'success' as const,
  warning: 'warning' as const,
  error: 'error' as const,
};

interface ActivityTimelineProps {
  events?: ActivityEvent[];
  limit?: number;
  compact?: boolean;
}

export function ActivityTimeline({ events, limit, compact = false }: ActivityTimelineProps) {
  const storeEvents = useOrganizationStore((s) => s.activity);
  const list = (events ?? storeEvents).slice(0, limit ?? storeEvents.length);

  return (
    <ol className="relative space-y-4" aria-label="Activity timeline">
      {list.map((event, index) => {
        const style = TYPE_STYLES[event.type] ?? TYPE_STYLES.settings;
        const isLast = index === list.length - 1;
        return (
          <li key={event.id} className="relative flex gap-3">
            {!isLast && (
              <span
                className="absolute left-[15px] top-8 bottom-[-8px] w-px"
                style={{ background: 'var(--color-surface-border)' }}
                aria-hidden="true"
              />
            )}
            <span
              className="relative z-10 h-8 w-8 rounded-full flex items-center justify-center text-sm shrink-0 border"
              style={{
                background: 'color-mix(in oklab, ' + style.color + ' 12%, transparent)',
                borderColor: 'color-mix(in oklab, ' + style.color + ' 30%, transparent)',
              }}
              aria-hidden="true"
            >
              {style.icon}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className={clsx('text-[var(--color-text-primary)]', compact ? 'text-[var(--text-xs)]' : 'text-[var(--text-sm)]')}>
                <span className="font-medium">{event.actor}</span>{' '}
                <span className="text-[var(--color-text-tertiary)]">{event.action}</span>{' '}
                <span className="font-medium">{event.target}</span>
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">{event.timestamp}</span>
                <Badge size="xs" variant={OUTCOME_VARIANT[event.outcome]}>{event.outcome}</Badge>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
