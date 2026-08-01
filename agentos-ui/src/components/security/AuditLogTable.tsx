import { useState } from 'react';
import { Badge } from '../ui/Badge';
import { useSecurityStore } from '../../stores/securityStore';

const SEVERITY_VARIANT = {
  info: 'info' as const,
  warning: 'warning' as const,
  critical: 'error' as const,
};

export function AuditLogTable() {
  const audit = useSecurityStore((s) => s.audit);
  const [filter, setFilter] = useState<'all' | 'info' | 'warning' | 'critical'>('all');

  const filtered = filter === 'all' ? audit : audit.filter((e) => e.severity === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(['all', 'info', 'warning', 'critical'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={
              'px-3 py-1.5 rounded-[var(--radius-md)] text-[var(--text-xs)] font-medium capitalize transition-colors ' +
              (filter === s
                ? 'bg-[var(--color-brand-500)] text-[var(--color-text-inverse)]'
                : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]')
            }
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] rounded-[var(--radius-lg)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--color-surface-border)] bg-[var(--color-surface-secondary)]">
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Time</th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Actor</th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Action</th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Resource</th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">IP</th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Severity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id} className="border-b border-[var(--color-surface-border)] last:border-b-0 hover:bg-[var(--color-surface-hover)] transition-colors">
                  <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-tertiary)] whitespace-nowrap">{entry.timestamp}</td>
                  <td className="px-4 py-3 text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]">{entry.actor}</td>
                  <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-secondary)]">{entry.action}</td>
                  <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-secondary)]">{entry.resource}</td>
                  <td className="px-4 py-3 text-[var(--text-xs)] font-mono text-[var(--color-text-tertiary)]">{entry.ip}</td>
                  <td className="px-4 py-3">
                    <Badge size="xs" variant={SEVERITY_VARIANT[entry.severity]} dot>{entry.severity}</Badge>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
                    No audit entries for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
