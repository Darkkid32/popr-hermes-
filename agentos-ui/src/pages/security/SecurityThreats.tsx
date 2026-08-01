import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ThreatFeed } from '../../components/security';
import { useSecurityStore } from '../../stores/securityStore';

export function SecurityThreats() {
  const threats = useSecurityStore((s) => s.threats);

  const active = threats.filter((t) => t.status === 'active').length;
  const contained = threats.filter((t) => t.status === 'contained').length;
  const resolved = threats.filter((t) => t.status === 'resolved').length;
  const critical = threats.filter((t) => t.severity === 'critical' && t.status !== 'resolved').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Threat monitor</h3>
          <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
            Detections from edge, runtime, and identity surfaces.
          </p>
        </div>
        <Badge variant={critical > 0 ? 'error' : 'success'} size="sm" dot>
          {critical > 0 ? `${critical} critical open` : 'no critical threats'}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Active</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-error)] mt-1">{active}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Contained</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-warning)] mt-1">{contained}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Resolved</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-success)] mt-1">{resolved}</p>
        </Card>
      </div>

      <ThreatFeed />
    </div>
  );
}
