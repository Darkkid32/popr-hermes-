import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAutomationStore } from '../../stores/automationStore';

const STATUS_VARIANT: Record<string, 'warning' | 'success' | 'error' | 'neutral' | 'info'> = { running: 'warning', success: 'success', failed: 'error', cancelled: 'neutral', pending: 'info', skipped: 'neutral' };

export function ExecutionTimeline() {
  const executions = useAutomationStore((s) => s.executions);
  const cancelExecution = useAutomationStore((s) => s.cancelExecution);
  return (
    <div className="space-y-4">
      {executions.map(ex => (
        <Card key={ex.id} className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">{ex.workflowName}</h4>
              <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">Trigger: {ex.trigger} · Initiated by: {ex.initiatedBy}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge size="sm" variant={STATUS_VARIANT[ex.status]} dot>{ex.status}</Badge>
              <span className="text-[var(--text-xs)] font-mono text-[var(--color-text-tertiary)]">{ex.durationMs}ms</span>
              {ex.status === 'running' && <Button variant="ghost" size="xs" onClick={() => cancelExecution(ex.id)} className="text-[var(--color-status-error)]">Cancel</Button>}
            </div>
          </div>
          <div className="space-y-2">
            {ex.steps.map(step => (
              <div key={step.id} className="flex items-center gap-3 text-[var(--text-sm)]">
                <Badge size="xs" variant={STATUS_VARIANT[step.status] || 'neutral'}>{step.status}</Badge>
                <span className="font-mono text-[var(--color-text-primary)]">{step.actionName}</span>
                <span className="text-[var(--color-text-tertiary)]">{step.durationMs}ms</span>
                <span className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">{step.startedAt}</span>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
