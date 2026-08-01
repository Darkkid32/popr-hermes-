import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useSecurityStore } from '../../stores/securityStore';

const STATUS_VARIANT = {
  ok: 'success' as const,
  expiring: 'warning' as const,
  overdue: 'error' as const,
};

const ENV_VARIANT = {
  production: 'error' as const,
  staging: 'warning' as const,
  development: 'brand' as const,
};

export function SecretCards() {
  const secrets = useSecurityStore((s) => s.secrets);
  const rotateSecret = useSecurityStore((s) => s.rotateSecret);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {secrets.map((secret) => (
        <Card key={secret.id} className="p-5 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)] font-mono truncate">
                {secret.name}
              </h4>
              <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] font-mono truncate">{secret.reference}</p>
            </div>
            <Badge size="xs" variant={STATUS_VARIANT[secret.status]} dot>{secret.status}</Badge>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge size="xs" variant={ENV_VARIANT[secret.environment]}>{secret.environment}</Badge>
            <Badge size="xs" variant="neutral">{secret.owner}</Badge>
          </div>
          <div className="flex items-center justify-between text-[var(--text-xs)] text-[var(--color-text-secondary)] pt-3 border-t border-[var(--color-surface-border)]">
            <span>Rotate every <span className="font-mono">{secret.rotationDays}d</span> · last {secret.lastRotated}</span>
            <Button variant="ghost" size="xs" onClick={() => rotateSecret(secret.id)}>Rotate now</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
