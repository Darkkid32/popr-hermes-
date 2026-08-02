import { ExecutionTimeline } from '../../components/automation';
import { Card } from '../../components/ui/Card';
import { useAutomationStore } from '../../stores/automationStore';

export function AutomationHistory() {
  const executions = useAutomationStore((s) => s.executions);
  const completed = executions.filter(e => e.status === 'success').length;
  const failed = executions.filter(e => e.status === 'failed').length;
  const cancelled = executions.filter(e => e.status === 'cancelled').length;
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Execution History</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">Full archive of all workflow executions.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5"><p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Completed</p><p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-success)] mt-1">{completed}</p></Card>
        <Card className="p-5"><p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Failed</p><p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-error)] mt-1">{failed}</p></Card>
        <Card className="p-5"><p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Cancelled</p><p className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-tertiary)] mt-1">{cancelled}</p></Card>
      </div>
      <ExecutionTimeline />
    </div>
  );
}
