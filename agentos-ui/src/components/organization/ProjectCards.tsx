import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { useOrganizationStore } from '../../stores/organizationStore';
import type { OrgProject } from '../../stores/organizationStore';

const STATUS_VARIANT = {
  'on-track': 'success' as const,
  'at-risk': 'warning' as const,
  blocked: 'error' as const,
  completed: 'info' as const,
};

function budgetPct(project: OrgProject): number {
  if (project.budget === 0) return 0;
  return Math.min(100, Math.round((project.spent / project.budget) * 100));
}

export function ProjectCards() {
  const projects = useOrganizationStore((s) => s.projects);
  const teamById = useOrganizationStore((s) => s.teamById);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id} className="p-5 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ background: project.color }}
                  aria-hidden="true"
                />
                <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)] truncate">
                  {project.name}
                </h4>
              </div>
              <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] mt-0.5 truncate">
                {project.description}
              </p>
            </div>
            <Badge size="xs" variant={STATUS_VARIANT[project.status]}>{project.status}</Badge>
          </div>

          <div>
            <div className="flex items-center justify-between text-[var(--text-xs)] text-[var(--color-text-tertiary)] mb-1.5">
              <span>Progress</span>
              <span className="font-medium text-[var(--color-text-secondary)]">{project.progress}%</span>
            </div>
            <div className="h-1.5 bg-[var(--color-surface-tertiary)] rounded-full overflow-hidden" role="progressbar" aria-valuenow={project.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${project.name} progress`}>
              <div className="h-full rounded-full transition-all duration-300" style={{ width: project.progress + '%', background: project.color }} />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <Badge size="xs" variant="neutral">{teamById(project.teamId)?.name || 'Unassigned'}</Badge>
            <Badge size="xs" variant="neutral">{project.environmentCount} envs</Badge>
            <Badge size="xs" variant="neutral">{project.memberCount} members</Badge>
          </div>

          <div className="flex items-center justify-between text-[var(--text-xs)] text-[var(--color-text-secondary)] pt-3 border-t border-[var(--color-surface-border)]">
            <span>
              Budget <span className="font-mono text-[var(--color-text-primary)]">${(project.spent / 1000).toFixed(1)}k</span> / ${(project.budget / 1000).toFixed(0)}k
            </span>
            <span className={budgetPct(project) > 80 ? 'text-[var(--color-status-error)]' : 'text-[var(--color-text-tertiary)]'}>
              {budgetPct(project)}% used · due {project.deadline}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
