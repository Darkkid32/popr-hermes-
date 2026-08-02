import { useState } from 'react';
import { clsx } from 'clsx';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useObservabilityStore } from '../../stores/observabilityStore';

const SEVERITY_VARIANT: Record<'critical' | 'high' | 'medium' | 'low', 'error' | 'warning' | 'info' | 'neutral'> = {
  critical: 'error',
  high: 'warning',
  medium: 'info',
  low: 'neutral',
};

const STATE_VARIANT: Record<'firing' | 'pending' | 'resolved' | 'silenced', 'error' | 'warning' | 'success' | 'neutral'> = {
  firing: 'error',
  pending: 'warning',
  resolved: 'success',
  silenced: 'neutral',
};

export function AlertTable() {
  const alerts = useObservabilityStore((s) => s.alerts);
  const ackAlert = useObservabilityStore((s) => s.ackAlert);
  const resolveAlert = useObservabilityStore((s) => s.resolveAlert);
  const silenceAlert = useObservabilityStore((s) => s.silenceAlert);
  const [filterState, setFilterState] = useState<'all' | 'firing' | 'pending' | 'resolved' | 'silenced'>('all');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  const filtered = alerts
    .filter(a => filterState === 'all' || a.state === filterState)
    .filter(a => filterSeverity === 'all' || a.severity === filterSeverity);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(['all', 'firing', 'pending', 'resolved', 'silenced'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilterState(s)}
            className={clsx(
              'px-3 py-1.5 rounded-[var(--radius-md)] text-[var(--text-xs)] font-medium capitalize transition-colors',
              filterState === s
                ? 'bg-[var(--color-brand-500)] text-[var(--color-text-inverse)]'
                : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
            )}
          >
            {s}
          </button>
        ))}
        {(['all', 'critical', 'high', 'medium', 'low'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilterSeverity(s)}
            className={clsx(
              'px-3 py-1.5 rounded-[var(--radius-md)] text-[var(--text-xs)] font-medium capitalize transition-colors',
              filterSeverity === s
                ? 'bg-[var(--color-brand-500)] text-[var(--color-text-inverse)]'
                : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
            )}
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
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Alert</th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Severity</th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">State</th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Service</th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Metric</th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Fired</th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Ack</th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(alert => (
                <AlertRow key={alert.id} alert={alert} onAck={ackAlert} onResolve={resolveAlert} onSilence={silenceAlert} />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
                    No alerts match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">
        Showing {filtered.length} of {alerts.length} alerts
      </p>
    </div>
  );
}

function AlertRow({ alert, onAck, onResolve, onSilence }: { alert: any; onAck: (id: string) => void; onResolve: (id: string) => void; onSilence: (id: string) => void }) {
  return (
    <tr className="border-b border-[var(--color-surface-border)] last:border-b-0 hover:bg-[var(--color-surface-hover)] transition-colors">
      <td className="px-4 py-3 text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]">{alert.name}</td>
      <td className="px-4 py-3">
        <Badge size="xs" variant={SEVERITY_VARIANT[alert.severity as keyof typeof SEVERITY_VARIANT]}>{alert.severity}</Badge>
      </td>
      <td className="px-4 py-3">
        <Badge size="xs" variant={STATE_VARIANT[alert.state as keyof typeof STATE_VARIANT]} dot>{alert.state}</Badge>
      </td>
      <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-secondary)]">{alert.service}</td>
      <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-secondary)]">{alert.metric}</td>
      <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-tertiary)]">{alert.firedAt}</td>
      <td className="px-4 py-3">
        {alert.acknowledged ? (
          <Badge size="xs" variant="success" dot>Yes</Badge>
        ) : (
          <Badge size="xs" variant="neutral" dot>No</Badge>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          {!alert.acknowledged && (
            <Button variant="ghost" size="xs" onClick={() => onAck(alert.id)}>Ack</Button>
          )}
          {alert.state === 'firing' && (
            <Button variant="ghost" size="xs" onClick={() => onResolve(alert.id)}>Resolve</Button>
          )}
          {alert.state !== 'silenced' && (
            <Button variant="ghost" size="xs" onClick={() => onSilence(alert.id)}>Silence</Button>
          )}
        </div>
      </td>
    </tr>
  );
}
