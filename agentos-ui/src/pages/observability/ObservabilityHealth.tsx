import { HealthCards } from '../../components/observability';

export function ObservabilityHealth() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Health</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Health check status for all service endpoints.
        </p>
      </div>
      <HealthCards />
    </div>
  );
}
