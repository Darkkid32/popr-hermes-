import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useAutomationStore } from '../../stores/automationStore';

const STATUS_VARIANT = { active: 'success' as const, draft: 'neutral' as const, paused: 'warning' as const, archived: 'neutral' as const };
const CAT_COLORS = { deploy: 'var(--color-status-success)', data: 'var(--color-brand-500)', ops: 'var(--color-status-warning)', ai: 'var(--color-brand-500)', integration: 'var(--color-accent-cyan-500)', custom: 'var(--color-text-tertiary)' };

export function WorkflowTable() {
  const workflows = useAutomationStore((s) => s.workflows);
  const setWorkflowStatus = useAutomationStore((s) => s.setWorkflowStatus);
  return (
    <div className="bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] rounded-[var(--radius-lg)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[var(--color-surface-border)] bg-[var(--color-surface-secondary)]">
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Workflow</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Category</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Status</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Runs</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Success</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Avg ms</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Last run</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workflows.map(wf => (
              <tr key={wf.id} className="border-b border-[var(--color-surface-border)] last:border-b-0 hover:bg-[var(--color-surface-hover)]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ background: CAT_COLORS[wf.category] }} aria-hidden="true" />
                    <div><p className="text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]">{wf.name}</p><p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] truncate max-w-[220px]">{wf.description}</p></div>
                  </div>
                </td>
                <td className="px-4 py-3"><Badge size="xs" variant="neutral">{wf.category}</Badge></td>
                <td className="px-4 py-3"><Badge size="xs" variant={STATUS_VARIANT[wf.status]} dot>{wf.status}</Badge></td>
                <td className="px-4 py-3 text-[var(--text-sm)] font-mono">{wf.executionsCount}</td>
                <td className="px-4 py-3 text-[var(--text-sm)] font-mono">{wf.successRate}%</td>
                <td className="px-4 py-3 text-[var(--text-sm)] font-mono">{wf.avgDuration}</td>
                <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-tertiary)]">{wf.lastRun}</td>
                <td className="px-4 py-3 text-right">
                  {wf.status === 'active' && <Button variant="ghost" size="xs" onClick={() => setWorkflowStatus(wf.id, 'paused')}>Pause</Button>}
                  {wf.status === 'paused' && <Button variant="ghost" size="xs" onClick={() => setWorkflowStatus(wf.id, 'active')}>Resume</Button>}
                  {wf.status === 'draft' && <Button variant="ghost" size="xs" onClick={() => setWorkflowStatus(wf.id, 'active')}>Activate</Button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
