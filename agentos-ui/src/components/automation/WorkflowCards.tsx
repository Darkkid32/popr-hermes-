import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useAutomationStore } from '../../stores/automationStore';

const STATUS_VARIANT = { active: 'success' as const, draft: 'neutral' as const, paused: 'warning' as const, archived: 'neutral' as const };
const CAT_COLORS = { deploy: 'var(--color-status-success)', data: 'var(--color-brand-500)', ops: 'var(--color-status-warning)', ai: 'var(--color-brand-500)', integration: 'var(--color-accent-cyan-500)', custom: 'var(--color-text-tertiary)' };

export function WorkflowCards() {
  const workflows = useAutomationStore((s) => s.workflows);
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {workflows.map(wf => (
        <Card key={wf.id} className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: CAT_COLORS[wf.category] }} aria-hidden="true" />
                <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)] truncate">{wf.name}</h4>
              </div>
              <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] mt-0.5">{wf.description}</p>
            </div>
            <Badge size="xs" variant={STATUS_VARIANT[wf.status]} dot>{wf.status}</Badge>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge size="xs" variant="neutral">{wf.category}</Badge>
            <Badge size="xs" variant="neutral">v{wf.version}</Badge>
            <Badge size="xs" variant="neutral">{wf.actionIds.length} steps</Badge>
          </div>
          <div className="flex items-center justify-between text-[var(--text-xs)] text-[var(--color-text-secondary)] pt-3 border-t border-[var(--color-surface-border)]">
            <span>Runs: <span className="font-mono">{wf.executionsCount}</span> · Success: <span className="font-mono">{wf.successRate}%</span></span>
            <span>Avg: <span className="font-mono">{wf.avgDuration}ms</span></span>
          </div>
          <div className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">
            Last run: {wf.lastRun} · Updated: {wf.updatedAt}
          </div>
        </Card>
      ))}
    </div>
  );
}
