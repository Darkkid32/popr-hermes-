import { Badge } from '../ui/Badge';
import { useObservabilityStore } from '../../stores/observabilityStore';

const TYPE_STYLES = {
  deploy: { icon: '🚀', color: 'var(--color-status-success)' },
  scale: { icon: '📈', color: 'var(--color-brand-500)' },
  config: { icon: '⚙️', color: 'var(--color-status-info)' },
  restart: { icon: '🔄', color: 'var(--color-status-warning)' },
  alert: { icon: '⚠️', color: 'var(--color-status-error)' },
  user: { icon: '👤', color: 'var(--color-accent-cyan-500)' },
  system: { icon: '💾', color: 'var(--color-text-tertiary)' },
} as const;

interface EventTimelineProps {
  events?: any[];
  limit?: number;
}

export function EventTimeline({ events, limit }: EventTimelineProps) {
  const storeEvents = useObservabilityStore((s) => s.events);
  const list = (events ?? storeEvents).slice(0, limit ?? storeEvents.length);

  return (
    <ol className="relative space-y-4" aria-label="Event timeline">
      {list.map((event, index) => {
        const style = TYPE_STYLES[event.type as keyof typeof TYPE_STYLES] || TYPE_STYLES.system;
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
              <p className="text-[var(--color-text-primary)] text-[var(--text-sm)]">
                <span className="font-medium">{event.title}</span>{' '}
                <span className="text-[var(--color-text-tertiary)]">{event.detail}</span>
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">{event.timestamp}</span>
                <span className="text-[var(--text-xs)] font-mono text-[var(--color-text-secondary)]">{event.service}</span>
                <Badge size="xs" variant="neutral">{event.type}</Badge>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
