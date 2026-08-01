import { Card } from '../../components/ui/Card';
import { CertificateTable } from '../../components/security';
import { useSecurityStore } from '../../stores/securityStore';

export function SecurityCertificates() {
  const certificates = useSecurityStore((s) => s.certificates);

  const valid = certificates.filter((c) => c.status === 'valid').length;
  const expiring = certificates.filter((c) => c.status === 'expiring').length;
  const expired = certificates.filter((c) => c.status === 'expired').length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Certificates</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          TLS certificates with expiry tracking for all managed domains.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Valid</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-success)] mt-1">{valid}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Expiring &lt; 30d</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-warning)] mt-1">{expiring}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Expired</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-error)] mt-1">{expired}</p>
        </Card>
      </div>

      <CertificateTable />
    </div>
  );
}
