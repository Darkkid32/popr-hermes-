import { useState } from 'react';
import { clsx } from 'clsx';
import { Card } from '../../components/ui/Card';
import { ActivityTimeline } from '../../components/organization';
import { useOrganizationStore } from '../../stores/organizationStore';
import type { ActivityType } from '../../stores/organizationStore';

const TYPE_FILTERS: { key: ActivityType | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'member', label: 'Members' },
  { key: 'team', label: 'Teams' },
  { key: 'project', label: 'Projects' },
  { key: 'environment', label: 'Environments' },
  { key: 'license', label: 'Licenses' },
  { key: 'security', label: 'Security' },
  { key: 'billing', label: 'Billing' },
  { key: 'settings', label: 'Settings' },
];

export function OrganizationActivity() {
  const activity = useOrganizationStore((s) => s.activity);
  const [filter, setFilter] = useState<ActivityType | 'all'>('all');

  const filtered = filter === 'all' ? activity : activity.filter((e) => e.type === filter);

  const byOutcome = {
    success: activity.filter((e) => e.outcome === 'success').length,
    warning: activity.filter((e) => e.outcome === 'warning').length,
    error: activity.filter((e) => e.outcome === 'error').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Activity</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Full audit trail of organization events.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Events</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-primary)] mt-1">{activity.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Warnings</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-warning)] mt-1">{byOutcome.warning}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Errors</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-error)] mt-1">{byOutcome.error}</p>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex flex-wrap gap-2 mb-5">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={clsx(
                'px-3 py-1.5 rounded-[var(--radius-md)] text-[var(--text-xs)] font-medium capitalize transition-colors',
                filter === f.key
                  ? 'bg-[var(--color-brand-500)] text-[var(--color-text-inverse)]'
                  : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <ActivityTimeline events={filtered} />
        {filtered.length === 0 && (
          <p className="py-10 text-center text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
            No events for this filter.
          </p>
        )}
      </Card>
    </div>
  );
}
