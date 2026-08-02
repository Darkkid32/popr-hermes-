import { Card } from '../../components/ui/Card';
import { KPICard, EventTimeline, PerformanceCharts } from '../../components/observability';
import { useObservabilityStore } from '../../stores/observabilityStore';

export function ObservabilityOverview() {
  const services = useObservabilityStore((s) => s.services);
  const alerts = useObservabilityStore((s) => s.alerts);
  const incidents = useObservabilityStore((s) => s.incidents);
  const metrics = useObservabilityStore((s) => s.metrics);
  const capacity = useObservabilityStore((s) => s.capacity);
  const settings = useObservabilityStore((s) => s.settings);

  const healthy = services.filter(s => s.status === 'healthy').length;
  const firing = alerts.filter(a => a.state === 'firing').length;
  const openIncidents = incidents.filter(i => i.status !== 'resolved').length;
  const totalMetrics = metrics.length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Services" value={services.length} delta={healthy} deltaLabel={`${healthy} healthy`} deltaTone="up" icon="🖥️" />
        <KPICard label="Firing Alerts" value={firing} delta={firing} deltaLabel={`${firing} active`} deltaTone={firing > 0 ? 'down' : 'up'} icon="🚨" accent="var(--color-status-error)" />
        <KPICard label="Open Incidents" value={openIncidents} delta={openIncidents} deltaLabel={`${openIncidents} open`} deltaTone={openIncidents > 0 ? 'down' : 'up'} icon="📋" accent="var(--color-status-warning)" />
        <KPICard label="Metrics" value={totalMetrics} delta={metrics.filter(m => m.status === 'healthy').length} deltaLabel="healthy" deltaTone="up" icon="📊" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-5">
          <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)] mb-4">Recent Events</h4>
          <EventTimeline limit={5} />
        </Card>

        <Card className="p-5">
          <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)] mb-4">Service Latency (P95)</h4>
          <PerformanceCharts />
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="p-5">
          <h4 className="text-[var(--text-sm)] font-medium text-[var(--color-text-primary)] mb-3">Capacity Warnings</h4>
          <div className="space-y-2">
            {capacity.filter(c => (c.used / c.allocated) > 0.7).map(c => (
              <div key={c.id} className="flex items-center justify-between text-[var(--text-sm)]">
                <span className="text-[var(--color-text-secondary)]">{c.resource}</span>
                <span className="font-mono text-[var(--color-status-warning)]">{Math.round((c.used / c.allocated) * 100)}%</span>
              </div>
            ))}
            {capacity.filter(c => (c.used / c.allocated) <= 0.7).length === capacity.length && (
              <p className="text-[var(--text-sm)] text-[var(--color-status-success)]">All capacity within limits</p>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <h4 className="text-[var(--text-sm)] font-medium text-[var(--color-text-primary)] mb-3">Settings Summary</h4>
          <dl className="space-y-2 text-[var(--text-sm)]">
            <div className="flex justify-between"><dt className="text-[var(--color-text-tertiary)]">Retention</dt><dd className="font-mono">{settings.retentionDays}d</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--color-text-tertiary)]">Sampling</dt><dd className="font-mono">{settings.samplingRate}%</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--color-text-tertiary)]">Tracing</dt><dd className={settings.tracingEnabled ? 'text-[var(--color-status-success)]' : 'text-[var(--color-status-error)]'}>{settings.tracingEnabled ? 'Enabled' : 'Disabled'}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--color-text-tertiary)]">Alert Notifications</dt><dd className={settings.alertNotifications ? 'text-[var(--color-status-success)]' : 'text-[var(--color-status-error)]'}>{settings.alertNotifications ? 'On' : 'Off'}</dd></div>
          </dl>
        </Card>

        <Card className="p-5">
          <h4 className="text-[var(--text-sm)] font-medium text-[var(--color-text-primary)] mb-3">Quick Actions</h4>
          <div className="space-y-2">
            <a href="/observability/alerts" className="flex items-center gap-2 p-2 bg-[var(--color-surface-secondary)] rounded-[var(--radius-md)] hover:bg-[var(--color-surface-hover)] transition-colors text-[var(--text-sm)]">
              <span aria-hidden="true">🚨</span> View Firing Alerts
            </a>
            <a href="/observability/incidents" className="flex items-center gap-2 p-2 bg-[var(--color-surface-secondary)] rounded-[var(--radius-md)] hover:bg-[var(--color-surface-hover)] transition-colors text-[var(--text-sm)]">
              <span aria-hidden="true">📋</span> View Open Incidents
            </a>
            <a href="/observability/logs" className="flex items-center gap-2 p-2 bg-[var(--color-surface-secondary)] rounded-[var(--radius-md)] hover:bg-[var(--color-surface-hover)] transition-colors text-[var(--text-sm)]">
              <span aria-hidden="true">📝</span> Open Log Viewer
            </a>
            <a href="/observability/traces" className="flex items-center gap-2 p-2 bg-[var(--color-surface-secondary)] rounded-[var(--radius-md)] hover:bg-[var(--color-surface-hover)] transition-colors text-[var(--text-sm)]">
              <span aria-hidden="true">🔍</span> View Traces
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
