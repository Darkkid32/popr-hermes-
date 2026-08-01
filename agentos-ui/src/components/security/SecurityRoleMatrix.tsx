import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { useSecurityStore } from '../../stores/securityStore';
import { SECURITY_PERMISSION_GROUPS } from '../../stores/securityStore';

export function SecurityRoleMatrix() {
  const roles = useSecurityStore((s) => s.roles);
  const users = useSecurityStore((s) => s.users);
  const total = SECURITY_PERMISSION_GROUPS.reduce((acc, g) => acc + g.permissions.length, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {roles.map((role) => {
        const memberCount = users.filter((u) => u.roleId === role.id).length;
        const pct = Math.round((role.permissions.length / total) * 100);
        return (
          <Card key={role.id} className="p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">{role.name}</h4>
                  {role.isSystem && <Badge size="xs" variant="info">system</Badge>}
                </div>
                <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mt-1">{role.description}</p>
              </div>
              <span
                className="h-8 w-8 rounded-[var(--radius-lg)] flex items-center justify-center text-[var(--text-xs)] font-semibold shrink-0"
                style={{
                  background: 'color-mix(in oklab, var(--color-brand-500) 15%, transparent)',
                  color: 'var(--color-brand-500)',
                }}
              >
                {role.level}
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-[var(--text-xs)] text-[var(--color-text-tertiary)] mb-1.5">
                <span>{role.permissions.length} of {total} permissions</span>
                <span>{memberCount} users</span>
              </div>
              <div className="h-1.5 bg-[var(--color-surface-tertiary)] rounded-full overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${role.name} permission coverage`}>
                <div className="h-full bg-[var(--color-brand-500)] rounded-full" style={{ width: pct + '%' }} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
