import { Badge } from '../ui/Badge';
import { useSecurityStore } from '../../stores/securityStore';

const STATUS_VARIANT = {
  valid: 'success' as const,
  expiring: 'warning' as const,
  expired: 'error' as const,
};

export function CertificateTable() {
  const certificates = useSecurityStore((s) => s.certificates);

  return (
    <div className="bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] rounded-[var(--radius-lg)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[var(--color-surface-border)] bg-[var(--color-surface-secondary)]">
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Certificate</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Domain</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Issuer</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Key type</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Expires</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Days left</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Status</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => (
              <tr key={cert.id} className="border-b border-[var(--color-surface-border)] last:border-b-0 hover:bg-[var(--color-surface-hover)] transition-colors">
                <td className="px-4 py-3 text-[var(--text-sm)] font-medium text-[var(--color-text-primary)] font-mono">{cert.name}</td>
                <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-secondary)] font-mono">{cert.domain}</td>
                <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-secondary)]">{cert.issuer}</td>
                <td className="px-4 py-3">
                  <Badge size="xs" variant="neutral">{cert.keyType}</Badge>
                </td>
                <td className="px-4 py-3 text-[var(--text-sm)] font-mono text-[var(--color-text-tertiary)]">{cert.expiresAt}</td>
                <td className="px-4 py-3">
                  <span className={cert.daysLeft < 0 ? 'text-[var(--color-status-error)]' : cert.daysLeft < 30 ? 'text-[var(--color-status-warning)]' : 'text-[var(--color-text-secondary)]'}>
                    {cert.daysLeft < 0 ? `${Math.abs(cert.daysLeft)}d ago` : `${cert.daysLeft}d`}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge size="xs" variant={STATUS_VARIANT[cert.status]} dot>{cert.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
