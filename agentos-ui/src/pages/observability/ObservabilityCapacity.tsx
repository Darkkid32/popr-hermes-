import { CapacityCharts } from '../../components/observability';

export function ObservabilityCapacity() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Capacity</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Resource utilization and capacity planning.
        </p>
      </div>
      <CapacityCharts />
    </div>
  );
}
