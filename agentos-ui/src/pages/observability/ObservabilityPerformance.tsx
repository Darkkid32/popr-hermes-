import { PerformanceCharts } from '../../components/observability';

export function ObservabilityPerformance() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Performance</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Latency percentiles, throughput, and saturation metrics.
        </p>
      </div>
      <PerformanceCharts />
    </div>
  );
}
