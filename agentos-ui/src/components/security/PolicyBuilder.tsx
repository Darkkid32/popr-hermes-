import { clsx } from 'clsx';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { useSecurityStore } from '../../stores/securityStore';
import type { PolicyStatus } from '../../stores/securityStore';

const STATUS_VARIANT = {
  enforced: 'success' as const,
  recommended: 'warning' as const,
  disabled: 'neutral' as const,
};

export function PolicyBuilder() {
  const policies = useSecurityStore((s) => s.policies);
  const updatePolicyStatus = useSecurityStore((s) => s.updatePolicyStatus);

  const setStatus = (id: string, status: PolicyStatus) => updatePolicyStatus(id, status);

  return (
    <div className="space-y-4">
      {policies.map((policy) => (
        <Card key={policy.id} className="p-5">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">{policy.name}</h4>
                <Badge size="xs" variant="neutral">{policy.category}</Badge>
              </div>
              <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mt-1">{policy.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {policy.controls.map((c) => (
                  <Badge key={c} size="xs" variant="default">{c}</Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0" role="radiogroup" aria-label={`${policy.name} status`}>
              {(['enforced', 'recommended', 'disabled'] as const).map((status) => (
                <button
                  key={status}
                  role="radio"
                  aria-checked={policy.status === status}
                  onClick={() => setStatus(policy.id, status)}
                  className={clsx(
                    'px-3 py-1.5 rounded-[var(--radius-md)] text-[var(--text-xs)] font-medium capitalize transition-colors',
                    policy.status === status
                      ? status === 'enforced'
                        ? 'bg-[var(--color-status-success)] text-[var(--color-text-inverse)]'
                        : status === 'recommended'
                          ? 'bg-[var(--color-status-warning)] text-[var(--color-text-inverse)]'
                          : 'bg-[var(--color-surface-tertiary)] text-[var(--color-text-tertiary)]'
                      : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--color-surface-border)]">
            <Badge size="xs" variant={STATUS_VARIANT[policy.status]} dot>
              {policy.status === 'enforced' ? 'Actively enforced across the org' : policy.status === 'recommended' ? 'Recommended — not enforced' : 'Disabled'}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}
