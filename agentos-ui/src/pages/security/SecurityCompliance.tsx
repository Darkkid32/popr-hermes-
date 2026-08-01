import { ComplianceDashboard } from '../../components/security';

export function SecurityCompliance() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Compliance</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Framework readiness against SOC 2, ISO 27001, GDPR, and PCI DSS.
        </p>
      </div>
      <ComplianceDashboard />
    </div>
  );
}
