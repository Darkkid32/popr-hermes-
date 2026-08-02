import { AnalyticsPanels } from '../../components/observability';

export function ObservabilityAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Analytics</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Operational metrics and trend analysis.
        </p>
      </div>
      <AnalyticsPanels />
    </div>
  );
}
