import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { useOrganizationStore } from '../../stores/organizationStore';
import type { OrgWorkspace } from '../../stores/organizationStore';

const STATUS_VARIANT = {
  active: 'success' as const,
  provisioning: 'info' as const,
  archived: 'neutral' as const,
};

const PLAN_VARIANT = {
  Free: 'neutral' as const,
  Pro: 'brand' as const,
  Enterprise: 'warning' as const,
};

export function WorkspaceCards() {
  const workspaces = useOrganizationStore((s) => s.workspaces);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {workspaces.map((ws) => (
        <WorkspaceCard key={ws.id} workspace={ws} />
      ))}
    </div>
  );
}

function WorkspaceCard({ workspace: ws }: { workspace: OrgWorkspace }) {
  return (
    <Card className="p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)] truncate">{ws.name}</h4>
          <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] font-mono">{ws.slug}</p>
        </div>
        <Badge size="xs" variant={STATUS_VARIANT[ws.status]} dot>{ws.status}</Badge>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <Badge size="xs" variant={PLAN_VARIANT[ws.plan]}>{ws.plan}</Badge>
        <Badge size="xs" variant="neutral">{ws.region}</Badge>
      </div>
      <div className="flex items-center gap-4 text-[var(--text-xs)] text-[var(--color-text-secondary)] pt-3 border-t border-[var(--color-surface-border)]">
        <span className="flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          </svg>
          {ws.memberCount} members
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          {ws.projectCount} projects
        </span>
        <span className="ml-auto text-[var(--color-text-tertiary)]">{ws.createdAt}</span>
      </div>
    </Card>
  );
}
