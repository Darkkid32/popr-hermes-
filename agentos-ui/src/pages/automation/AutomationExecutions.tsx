import { ExecutionTimeline } from '../../components/automation';

export function AutomationExecutions() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Executions</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">Live and recent execution runs with step details.</p>
      </div>
      <ExecutionTimeline />
    </div>
  );
}
