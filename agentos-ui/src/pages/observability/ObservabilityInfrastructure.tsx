import { InfrastructureCards } from '../../components/observability';

export function ObservabilityInfrastructure() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Infrastructure</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Compute, storage, network, and database nodes.
        </p>
      </div>
      <InfrastructureCards />
    </div>
  );
}
