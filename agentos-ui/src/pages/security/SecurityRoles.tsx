import { SecurityRoleMatrix, SecurityPermissionMatrix } from '../../components/security';
import { useSecurityStore } from '../../stores/securityStore';

export function SecurityRoles() {
  const roles = useSecurityStore((s) => s.roles);
  const users = useSecurityStore((s) => s.users);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Roles &amp; permissions</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          {roles.length} security roles across {users.length} users. System roles are locked.
        </p>
      </div>

      <SecurityRoleMatrix />

      <div>
        <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)] mb-3">Permission matrix</h4>
        <SecurityPermissionMatrix />
      </div>
    </div>
  );
}
