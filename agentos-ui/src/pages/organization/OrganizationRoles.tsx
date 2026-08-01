import { RoleMatrix, PermissionMatrix } from '../../components/organization';
import { useOrganizationStore } from '../../stores/organizationStore';

export function OrganizationRoles() {
  const roles = useOrganizationStore((s) => s.roles);
  const members = useOrganizationStore((s) => s.members);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Roles &amp; permissions</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          {roles.length} roles defined across {members.length} members.
        </p>
      </div>

      <RoleMatrix />

      <div>
        <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)] mb-3">
          Permission matrix
        </h4>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mb-4">
          Granular access per resource. System roles cannot be edited.
        </p>
        <PermissionMatrix />
      </div>
    </div>
  );
}
