import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useObservabilityStore } from '../../stores/observabilityStore';

const STATUS_VARIANT = {
  healthy: 'success' as const,
  degraded: 'warning' as const,
  down: 'error' as const,
  maintenance: 'info' as const,
};

export function ServiceCards() {
  const services = useObservabilityStore((s) => s.services);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {services.map(service => (
        <Card key={service.id} className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)] truncate">
                {service.name}
              </h4>
              <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] mt-0.5">
                {service.description}
              </p>
            </div>
            <Badge size="xs" variant={STATUS_VARIANT[service.status]} dot>{service.status}</Badge>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <Badge size="xs" variant="neutral">{service.region}</Badge>
            <Badge size="xs" variant="neutral">v{service.version}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--color-surface-border)]">
            <div>
              <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">Uptime</p>
              <p className="text-[var(--text-sm)] font-semibold text-[var(--color-text-primary)]">{service.uptime}%</p>
            </div>
            <div>
              <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">Latency</p>
              <p className="text-[var(--text-sm)] font-semibold text-[var(--color-text-primary)]">{service.latency}ms</p>
            </div>
            <div>
              <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">Error Rate</p>
              <p className="text-[var(--text-sm)] font-semibold text-[var(--color-text-primary)]">{service.errorRate}%</p>
            </div>
            <div>
              <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">Req Rate</p>
              <p className="text-[var(--text-sm)] font-semibold text-[var(--color-text-primary)]">{service.requestRate}/s</p>
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--color-surface-border)]">
            <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">Last deploy: {service.lastDeploy}</p>
            {service.dependencies.length > 0 && (
              <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] mt-1">
                Deps: {service.dependencies.map(d => `<span className="font-mono">${d}</span>`).join(', ')}
              </p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
