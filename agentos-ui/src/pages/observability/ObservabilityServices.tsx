import { ServiceCards } from '../../components/observability';

export function ObservabilityServices() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Services</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Service inventory with health, latency, and dependencies.
        </p>
      </div>
      <ServiceCards />
    </div>
  );
}
