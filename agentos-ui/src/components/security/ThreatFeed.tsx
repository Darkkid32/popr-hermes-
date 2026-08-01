import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useSecurityStore } from '../../stores/securityStore';

const SEVERITY_VARIANT = {
  critical: 'error' as const,
  high: 'warning' as const,
  medium: 'info' as const,
  low: 'neutral' as const,
};

const STATUS_VARIANT = {
  active: 'error' as const,
  contained: 'warning' as const,
  blocked: 'info' as const,
  resolved: 'success' as const,
};

export function ThreatFeed() {
  const threats = useSecurityStore((s) => s.threats);
  const resolveThreat = useSecurityStore((s) => s.resolveThreat);

  return (
    <div className="space-y-4">
      {threats.map((threat) => (
        <Card key={threat.id} className="p-5">
          <div className="flex flex-col lg:flex-row lg:items-start gap-4">
            <div
              className="h-10 w-10 rounded-[var(--radius-lg)] flex items-center justify-center text-lg shrink-0"
              style={{
                background:
                  threat.severity === 'critical'
                    ? 'color-mix(in oklab, var(--color-status-error) 15%, transparent)'
                    : threat.severity === 'high'
                      ? 'color-mix(in oklab, var(--color-status-warning) 15%, transparent)'
                      : 'var(--color-surface-tertiary)',
              }}
              aria-hidden="true"
            >
              {threat.severity === 'critical' ? '🚨' : threat.severity === 'high' ? '⚠️' : '🛡️'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">{threat.type}</h4>
                <Badge size="xs" variant={SEVERITY_VARIANT[threat.severity]}>{threat.severity}</Badge>
                <Badge size="xs" variant={STATUS_VARIANT[threat.status]} dot>{threat.status}</Badge>
              </div>
              <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mt-1">{threat.description}</p>
              <div className="flex flex-wrap gap-4 mt-2 text-[var(--text-xs)] text-[var(--color-text-tertiary)]">
                <span>Source: <span className="font-mono">{threat.source}</span></span>
                <span>Target: <span className="font-mono">{threat.target}</span></span>
                <span>Detected: {threat.detectedAt}</span>
              </div>
            </div>
            {threat.status !== 'resolved' && (
              <Button variant="outline" size="sm" onClick={() => resolveThreat(threat.id)}>
                Mark resolved
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
