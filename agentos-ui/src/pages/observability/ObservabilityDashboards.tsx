import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { TimeSeriesChart } from '../../components/observability';
import { useObservabilityStore } from '../../stores/observabilityStore';

export function ObservabilityDashboards() {
  const dashboards = useObservabilityStore((s) => s.dashboards);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Dashboards</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Pre-built and custom dashboards for observability.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dashboards.map(d => (
          <Card key={d.id} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">{d.name}</h4>
                <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mt-1">{d.description}</p>
              </div>
              {d.isDefault && <Badge size="xs" variant="brand">Default</Badge>}
            </div>
            <div className="pt-3 border-t border-[var(--color-surface-border)]">
              <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] mb-2">
                {d.metricIds.length} metrics · Updated {d.updatedAt}
              </p>
              <TimeSeriesChart
                title={`${d.name} Preview`}
                points={d.metricIds.slice(0, 1).map(_mid => ({ timestamp: 'now', value: 0 }))}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
