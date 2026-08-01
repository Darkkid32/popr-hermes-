import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { useOrganizationStore } from '../../stores/organizationStore';

const STATUS_VARIANT = {
  active: 'success' as const,
  expiring: 'warning' as const,
  expired: 'error' as const,
  trial: 'info' as const,
};

export function LicenseCards() {
  const licenses = useOrganizationStore((s) => s.licenses);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {licenses.map((license) => {
        const pct = license.seats === 0 ? 0 : Math.min(100, Math.round((license.used / license.seats) * 100));
        const nearCap = license.used >= license.seats * 0.9;
        return (
          <Card key={license.id} className="p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)] truncate">
                  {license.name}
                </h4>
                <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">{license.tier} tier</p>
              </div>
              <Badge size="xs" variant={STATUS_VARIANT[license.status]} dot>{license.status}</Badge>
            </div>
            <div>
              <div className="flex items-center justify-between text-[var(--text-xs)] text-[var(--color-text-tertiary)] mb-1.5">
                <span>Seat usage</span>
                <span className={nearCap ? 'font-medium text-[var(--color-status-warning)]' : 'font-medium text-[var(--color-text-secondary)]'}>
                  {license.used} / {license.seats}
                </span>
              </div>
              <div className="h-1.5 bg-[var(--color-surface-tertiary)] rounded-full overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${license.name} seat usage`}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: pct + '%',
                    background: license.status === 'expired' ? 'var(--color-status-error)' : nearCap ? 'var(--color-status-warning)' : 'var(--color-brand-500)',
                  }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-[var(--text-xs)] text-[var(--color-text-secondary)] pt-3 border-t border-[var(--color-surface-border)]">
              <span>Expires <span className="font-mono">{license.expiresAt}</span></span>
              <span className="font-mono text-[var(--color-text-primary)]">${(license.cost / 1000).toFixed(1)}k/yr</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
