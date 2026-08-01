import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { useOrganizationStore } from '../../stores/organizationStore';

const TYPE_VARIANT = {
  production: 'error' as const,
  staging: 'warning' as const,
  development: 'brand' as const,
  sandbox: 'neutral' as const,
};

const STATUS_VARIANT = {
  healthy: 'success' as const,
  degraded: 'warning' as const,
  offline: 'error' as const,
  provisioning: 'info' as const,
};

export function EnvironmentCards() {
  const environments = useOrganizationStore((s) => s.environments);
  const projects = useOrganizationStore((s) => s.projects);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {environments.map((env) => {
        const project = projects.find((p) => p.id === env.projectId);
        return (
          <Card key={env.id} className="p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)] font-mono truncate">
                  {env.name}
                </h4>
                <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] truncate">
                  {project?.name || 'Unknown project'}
                </p>
              </div>
              <Badge size="xs" variant={STATUS_VARIANT[env.status]} dot>{env.status}</Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Badge size="xs" variant={TYPE_VARIANT[env.type]}>{env.type}</Badge>
              <Badge size="xs" variant="neutral">{env.region}</Badge>
            </div>
            <div className="flex items-center gap-2 text-[var(--text-xs)] text-[var(--color-text-secondary)] pt-3 border-t border-[var(--color-surface-border)]">
              <svg className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <a href={env.url} target="_blank" rel="noreferrer" className="text-[var(--color-brand-500)] hover:underline truncate">
                {env.url.replace('https://', '')}
              </a>
              <span className="ml-auto text-[var(--color-text-tertiary)]">{env.updatedAt}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
