import { JobMonitor } from '../../components/automation';

export function AutomationJobs() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Jobs</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">Queued, running, completed, and failed jobs.</p>
      </div>
      <JobMonitor />
    </div>
  );
}
