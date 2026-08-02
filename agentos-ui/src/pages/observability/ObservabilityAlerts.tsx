import { AlertTable } from '../../components/observability';

export function ObservabilityAlerts() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Alerts</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Active and historical alerts across all services.
        </p>
      </div>
      <AlertTable />
    </div>
  );
}
