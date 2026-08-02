import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useAutomationStore } from '../../stores/automationStore';

const STATUS_VARIANT = { queued: 'info' as const, running: 'warning' as const, completed: 'success' as const, failed: 'error' as const, cancelled: 'neutral' as const };
const PRIORITY_VARIANT = { high: 'error' as const, normal: 'neutral' as const, low: 'info' as const };

export function JobMonitor() {
  const jobs = useAutomationStore((s) => s.jobs);
  const workflows = useAutomationStore((s) => s.workflows);
  const retryJob = useAutomationStore((s) => s.retryJob);
  const cancelJob = useAutomationStore((s) => s.cancelJob);
  return (
    <div className="bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] rounded-[var(--radius-lg)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[var(--color-surface-border)] bg-[var(--color-surface-secondary)]">
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Job</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Workflow</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Status</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Priority</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Attempts</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Owner</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => {
              const wf = workflows.find(w => w.id === job.workflowId);
              return (
                <tr key={job.id} className="border-b border-[var(--color-surface-border)] last:border-b-0 hover:bg-[var(--color-surface-hover)]">
                  <td className="px-4 py-3 text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]">{job.name}</td>
                  <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-secondary)]">{wf?.name || job.workflowId}</td>
                  <td className="px-4 py-3"><Badge size="xs" variant={STATUS_VARIANT[job.status]} dot>{job.status}</Badge></td>
                  <td className="px-4 py-3"><Badge size="xs" variant={PRIORITY_VARIANT[job.priority]}>{job.priority}</Badge></td>
                  <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-secondary)]">{job.attempts}/{job.maxAttempts}</td>
                  <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-secondary)]">{job.owner}</td>
                  <td className="px-4 py-3 text-right">
                    {job.status === 'failed' && <Button variant="ghost" size="xs" onClick={() => retryJob(job.id)}>Retry</Button>}
                    {(job.status === 'queued' || job.status === 'running') && <Button variant="ghost" size="xs" onClick={() => cancelJob(job.id)} className="text-[var(--color-status-error)]">Cancel</Button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
