import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { useObservabilityStore } from '../../stores/observabilityStore';

const SEVERITY_VARIANT = {
  SEV1: 'error' as const,
  SEV2: 'error' as const,
  SEV3: 'warning' as const,
  SEV4: 'info' as const,
};

const STATUS_VARIANT = {
  open: 'error' as const,
  investigating: 'warning' as const,
  identified: 'info' as const,
  monitoring: 'info' as const,
  resolved: 'success' as const,
};

export function IncidentTimeline() {
  const incidents = useObservabilityStore((s) => s.incidents);

  return (
    <div className="space-y-4">
      {incidents.map(incident => (
        <Card key={incident.id} className="p-5">
          <div className="flex flex-col lg:flex-row lg:items-start gap-4 mb-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">
                  {incident.title}
                </h4>
                <Badge size="xs" variant={SEVERITY_VARIANT[incident.severity]}>{incident.severity}</Badge>
                <Badge size="xs" variant={STATUS_VARIANT[incident.status]} dot>{incident.status}</Badge>
              </div>
              <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mt-1">
                Service: <span className="font-mono">{incident.service}</span>
              </p>
              <div className="flex flex-wrap gap-4 mt-2 text-[var(--text-xs)] text-[var(--color-text-tertiary)]">
                <span>Created: {incident.createdAt}</span>
                <span>Updated: {incident.updatedAt}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {incident.updates.map((update, index) => (
              <div key={index} className="relative pl-6">
                <div className="relative flex items-start gap-3">
                  <span
                    className="absolute left-0 top-1 h-2 w-2 rounded-full shrink-0"
                    style={{
                      background:
                        update.status === 'resolved'
                          ? 'var(--color-status-success)'
                          : update.status === 'investigating' || update.status === 'identified'
                            ? 'var(--color-status-warning)'
                            : 'var(--color-status-error)',
                    }}
                    aria-hidden="true"
                  />
                  {index < incident.updates.length - 1 && (
                    <span
                      className="absolute left-[3px] top-3 h-full w-px"
                      style={{ background: 'var(--color-surface-border)' }}
                      aria-hidden="true"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge size="xs" variant={STATUS_VARIANT[update.status as keyof typeof STATUS_VARIANT]}>
                        {update.status}
                      </Badge>
                      <span className="text-[var(--text-xs)] font-mono text-[var(--color-text-tertiary)]">
                        {update.timestamp}
                      </span>
                      <span className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">
                        by {update.author}
                      </span>
                    </div>
                    <p className="text-[var(--text-sm)] text-[var(--color-text-primary)] mt-1">
                      {update.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
