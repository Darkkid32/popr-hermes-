import { AnalyticsPanels } from '../../components/automation';

export function AutomationAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Analytics</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">Execution metrics, success rates, and throughput trends.</p>
      </div>
      <AnalyticsPanels />
    </div>
  );
}
