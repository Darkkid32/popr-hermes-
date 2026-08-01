import { Card } from '../../components/ui/Card';
import { WorkspaceCards } from '../../components/organization';
import { useOrganizationStore } from '../../stores/organizationStore';

export function OrganizationWorkspaces() {
  const workspaces = useOrganizationStore((s) => s.workspaces);

  const byRegion = workspaces.reduce<Record<string, number>>((acc, ws) => {
    acc[ws.region] = (acc[ws.region] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Workspaces</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Isolated environments for teams, projects, and agent runtimes.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Total</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-primary)] mt-1">{workspaces.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Active</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-success)] mt-1">
            {workspaces.filter((w) => w.status === 'active').length}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Regions</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-primary)] mt-1">{Object.keys(byRegion).length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Seats used</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-primary)] mt-1">
            {workspaces.reduce((acc, w) => acc + w.memberCount, 0)}
          </p>
        </Card>
      </div>

      <WorkspaceCards />
    </div>
  );
}
