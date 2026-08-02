import { MetricCard } from '../../components/observability';
import { useObservabilityStore } from '../../stores/observabilityStore';

export function ObservabilityMetrics() {
  const metrics = useObservabilityStore((s) => s.metrics);
  const services = useObservabilityStore((s) => s.services);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Metrics</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Real-time and historical metrics across all services.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {services.map(svc => {
          const svcMetrics = metrics.filter(m => m.serviceId === svc.id);
          return svcMetrics.map(m => (
            <MetricCard key={m.id} metricId={m.id} showSparkline />
          ));
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] rounded-[var(--radius-lg)] p-5">
          <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)] mb-4">All Metrics Table</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--color-surface-border)]">
                  <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Metric</th>
                  <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Service</th>
                  <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Type</th>
                  <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Current</th>
                  <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Status</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map(m => {
                  const svc = services.find(s => s.id === m.serviceId);
                  return (
                    <tr key={m.id} className="border-b border-[var(--color-surface-border)] last:border-b-0">
                      <td className="px-4 py-3 text-[var(--text-sm)] font-medium">{m.name}</td>
                      <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-secondary)]">{svc?.name || m.serviceId}</td>
                      <td className="px-4 py-3 text-[var(--text-xs)] capitalize">{m.type}</td>
                      <td className="px-4 py-3 text-[var(--text-sm)] font-mono">{m.current.toLocaleString()} {m.unit}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-[var(--text-xs)] font-medium ${m.status === 'healthy' ? 'text-[var(--color-status-success)]' : m.status === 'warning' ? 'text-[var(--color-status-warning)]' : 'text-[var(--color-status-error)]'}`}>
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.status === 'healthy' ? 'var(--color-status-success)' : m.status === 'warning' ? 'var(--color-status-warning)' : 'var(--color-status-error)' }} />
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
