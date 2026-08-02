import { WorkflowCards } from '../../components/automation';

export function AutomationWorkflows() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Workflows</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">Active, draft, paused, and archived workflows.</p>
      </div>
      <WorkflowCards />
    </div>
  );
}
