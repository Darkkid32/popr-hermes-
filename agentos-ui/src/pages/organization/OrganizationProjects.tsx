import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ProjectCards } from '../../components/organization';
import { useOrganizationStore } from '../../stores/organizationStore';

export function OrganizationProjects() {
  const projects = useOrganizationStore((s) => s.projects);

  const counts = {
    'on-track': projects.filter((p) => p.status === 'on-track').length,
    'at-risk': projects.filter((p) => p.status === 'at-risk').length,
    blocked: projects.filter((p) => p.status === 'blocked').length,
    completed: projects.filter((p) => p.status === 'completed').length,
  };

  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Projects</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Delivery portfolio across teams with budget and environment tracking.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Total</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-primary)] mt-1">{projects.length}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Health</p>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Badge size="xs" variant="success">{counts['on-track']} on track</Badge>
            <Badge size="xs" variant="warning">{counts['at-risk']} at risk</Badge>
            <Badge size="xs" variant="error">{counts.blocked} blocked</Badge>
            <Badge size="xs" variant="info">{counts.completed} done</Badge>
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Budget</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-primary)] mt-1">${(totalBudget / 1000).toFixed(0)}k</p>
          <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] mt-1">${(totalSpent / 1000).toFixed(0)}k spent</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Avg progress</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-primary)] mt-1">
            {projects.length ? Math.round(projects.reduce((a, p) => a + p.progress, 0) / projects.length) : 0}%
          </p>
        </Card>
      </div>

      <ProjectCards />
    </div>
  );
}
