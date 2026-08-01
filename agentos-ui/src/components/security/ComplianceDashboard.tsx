import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { useSecurityStore } from '../../stores/securityStore';

const STATUS_VARIANT = {
  compliant: 'success' as const,
  'in-progress': 'info' as const,
  'at-risk': 'error' as const,
};

export function ComplianceDashboard() {
  const compliance = useSecurityStore((s) => s.compliance);

  const overall = compliance.length
    ? Math.round(compliance.reduce((acc, f) => acc + f.score, 0) / compliance.length)
    : 0;
  const atRisk = compliance.filter((f) => f.status === 'at-risk').length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Frameworks</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-primary)] mt-1">{compliance.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Average score</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-primary)] mt-1">{overall}%</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Controls passed</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-success)] mt-1">
            {compliance.reduce((acc, f) => acc + f.controlsPassed, 0)}
            <span className="text-[var(--text-base)] text-[var(--color-text-tertiary)]"> / {compliance.reduce((acc, f) => acc + f.controlsTotal, 0)}</span>
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">At risk</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-error)] mt-1">{atRisk}</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {compliance.map((framework) => (
          <Card key={framework.id} className="p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">{framework.name}</h4>
                <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] mt-0.5">{framework.standard}</p>
              </div>
              <Badge size="xs" variant={STATUS_VARIANT[framework.status]} dot>{framework.status}</Badge>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-[var(--text-xs)] text-[var(--color-text-tertiary)] mb-1.5">
                <span>Score</span>
                <span className="font-medium text-[var(--color-text-primary)]">{framework.score}%</span>
              </div>
              <div className="h-2 bg-[var(--color-surface-tertiary)] rounded-full overflow-hidden" role="progressbar" aria-valuenow={framework.score} aria-valuemin={0} aria-valuemax={100} aria-label={`${framework.name} score`}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: framework.score + '%',
                    background:
                      framework.score >= 85
                        ? 'var(--color-status-success)'
                        : framework.score >= 70
                          ? 'var(--color-status-warning)'
                          : 'var(--color-status-error)',
                  }}
                />
              </div>
              <div className="flex items-center justify-between mt-3 text-[var(--text-xs)] text-[var(--color-text-tertiary)]">
                <span>{framework.controlsPassed} / {framework.controlsTotal} controls passed</span>
                <span>Due {framework.dueDate}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
