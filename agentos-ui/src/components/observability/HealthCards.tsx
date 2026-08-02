import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useObservabilityStore } from '../../stores/observabilityStore';

const STATUS_VARIANT = {
  passing: 'success' as const,
  failing: 'error' as const,
  degraded: 'warning' as const,
};

export function HealthCards() {
  const health = useObservabilityStore((s) => s.health);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {health.map(check => (
        <Card key={check.id} className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">
                {check.service}
              </h4>
              <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] font-mono">
                {check.endpoint}
              </p>
            </div>
            <Badge size="sm" variant={STATUS_VARIANT[check.status]} dot>
              {check.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--color-surface-border)]">
            <div>
              <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">Latency</p>
              <p className="text-[var(--text-sm)] font-semibold text-[var(--color-text-primary)]">
                {check.latency}ms
              </p>
            </div>
            <div>
              <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">Last check</p>
              <p className="text-[var(--text-sm)] font-semibold text-[var(--color-text-primary)]">
                {check.lastChecked}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">Consecutive fails</p>
              <p className="text-[var(--text-sm)] font-semibold text-[var(--color-text-primary)]">
                {check.consecutiveFails}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
