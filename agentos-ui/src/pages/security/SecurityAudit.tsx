import { Card } from '../../components/ui/Card';
import { AuditLogTable } from '../../components/security';
import { useSecurityStore } from '../../stores/securityStore';

export function SecurityAudit() {
  const audit = useSecurityStore((s) => s.audit);

  const criticals = audit.filter((e) => e.severity === 'critical').length;
  const warnings = audit.filter((e) => e.severity === 'warning').length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Audit log</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Immutable trail of security-relevant events across the organization.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Events</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-primary)] mt-1">{audit.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Warnings</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-warning)] mt-1">{warnings}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Critical</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-error)] mt-1">{criticals}</p>
        </Card>
      </div>

      <AuditLogTable />
    </div>
  );
}
