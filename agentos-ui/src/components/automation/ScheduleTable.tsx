import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useAutomationStore } from '../../stores/automationStore';

const STATUS_VARIANT = { active: 'success' as const, paused: 'warning' as const, disabled: 'neutral' as const };

export function ScheduleTable() {
  const schedules = useAutomationStore((s) => s.schedules);
  const workflows = useAutomationStore((s) => s.workflows);
  const toggleSchedule = useAutomationStore((s) => s.toggleSchedule);
  return (
    <div className="bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] rounded-[var(--radius-lg)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[var(--color-surface-border)] bg-[var(--color-surface-secondary)]">
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Schedule</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Workflow</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Frequency</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Cron</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Next Run</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Status</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map(sch => {
              const wf = workflows.find(w => w.id === sch.workflowId);
              return (
                <tr key={sch.id} className="border-b border-[var(--color-surface-border)] last:border-b-0 hover:bg-[var(--color-surface-hover)]">
                  <td className="px-4 py-3 text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]">{sch.name}</td>
                  <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-secondary)]">{wf?.name || sch.workflowId}</td>
                  <td className="px-4 py-3"><Badge size="xs" variant="neutral">{sch.frequency}</Badge></td>
                  <td className="px-4 py-3 text-[var(--text-xs)] font-mono text-[var(--color-text-tertiary)]">{sch.cronExpression}</td>
                  <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-secondary)]">{sch.nextRun}</td>
                  <td className="px-4 py-3"><Badge size="xs" variant={STATUS_VARIANT[sch.status]} dot>{sch.status}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="xs" onClick={() => toggleSchedule(sch.id)}>{sch.enabled ? 'Pause' : 'Resume'}</Button>
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
