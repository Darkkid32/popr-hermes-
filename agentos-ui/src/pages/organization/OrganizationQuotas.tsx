import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { QuotaCharts } from '../../components/organization';
import { useOrganizationStore } from '../../stores/organizationStore';

export function OrganizationQuotas() {
  const quotas = useOrganizationStore((s) => s.quotas);
  const usagePct = useOrganizationStore((s) => s.usagePct);

  const nearCap = quotas.filter((q) => usagePct(q.id) >= 80).length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Quotas</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Plan limits per resource with live utilization.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant={nearCap > 0 ? 'warning' : 'success'} size="sm" dot>
          {nearCap > 0 ? `${nearCap} resource${nearCap > 1 ? 's' : ''} at ≥80% capacity` : 'All resources healthy'}
        </Badge>
      </div>

      <QuotaCharts />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quotas.map((q) => {
          const pct = usagePct(q.id);
          const tone = pct >= 90 ? 'error' : pct >= 80 ? 'warning' : 'success';
          return (
            <Card key={q.id} className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]">{q.label}</p>
                <span className="text-[var(--text-xs)] font-mono text-[var(--color-text-tertiary)]">
                  {q.used} / {q.limit} {q.unit}
                </span>
              </div>
              <div className="h-1.5 bg-[var(--color-surface-tertiary)] rounded-full overflow-hidden mt-3" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${q.label} utilization`}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: pct + '%',
                    background:
                      tone === 'error'
                        ? 'var(--color-status-error)'
                        : tone === 'warning'
                          ? 'var(--color-status-warning)'
                          : q.color,
                  }}
                />
              </div>
              <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] mt-1.5">{pct}% used</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
