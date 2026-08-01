import { clsx } from 'clsx';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useOrganizationStore } from '../../stores/organizationStore';
import type { ReactNode } from 'react';

export function OrgCard() {
  const settings = useOrganizationStore((s) => s.settings);
  const members = useOrganizationStore((s) => s.members);
  const workspaces = useOrganizationStore((s) => s.workspaces);
  const projects = useOrganizationStore((s) => s.projects);

  const activeMembers = members.filter((m) => m.status === 'active').length;
  const activeWorkspaces = workspaces.filter((w) => w.status === 'active').length;

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div
          className="h-14 w-14 rounded-[var(--radius-xl)] flex items-center justify-center text-[var(--color-text-inverse)] font-semibold text-xl shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--color-brand-500), var(--color-accent-cyan-500))' }}
          aria-hidden="true"
        >
          H
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">
              {settings.orgName}
            </h3>
            <Badge variant="brand" size="sm">{settings.plan}</Badge>
          </div>
          <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mt-0.5">
            {settings.slug} · {settings.region} · {settings.timezone}
          </p>
          <div className="flex flex-wrap gap-2 mt-3 text-[var(--text-xs)] text-[var(--color-text-secondary)]">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-status-success)]" aria-hidden="true" />
              {activeMembers}/{members.length} members active
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-500)]" aria-hidden="true" />
              {activeWorkspaces} workspaces live
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-cyan-500)]" aria-hidden="true" />
              {projects.length} projects
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: 'up' | 'down' | 'neutral';
  icon?: ReactNode;
  accent?: string;
}

export function StatCard({ label, value, delta, deltaTone = 'up', icon, accent = 'var(--color-brand-500)' }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">
            {label}
          </p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-primary)] mt-1">
            {value}
          </p>
          {delta && (
            <p
              className={clsx(
                'text-[var(--text-xs)] font-medium mt-1',
                deltaTone === 'up' && 'text-[var(--color-status-success)]',
                deltaTone === 'down' && 'text-[var(--color-status-error)]',
                deltaTone === 'neutral' && 'text-[var(--color-text-tertiary)]'
              )}
            >
              {delta}
            </p>
          )}
        </div>
        {icon && (
          <div
            className="h-9 w-9 rounded-[var(--radius-lg)] flex items-center justify-center text-sm shrink-0"
            style={{ color: accent, background: 'color-mix(in oklab, ' + accent + ' 15%, transparent)' }}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
