import { Card } from '../../components/ui/Card';
import { LicenseCards } from '../../components/organization';
import { useOrganizationStore } from '../../stores/organizationStore';

export function OrganizationLicenses() {
  const licenses = useOrganizationStore((s) => s.licenses);

  const totalSeats = licenses.reduce((acc, l) => acc + l.seats, 0);
  const totalUsed = licenses.reduce((acc, l) => acc + l.used, 0);
  const expiring = licenses.filter((l) => l.status === 'expiring' || l.status === 'expired');
  const annual = licenses.reduce((acc, l) => acc + l.cost, 0);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Licenses</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Seat entitlements, renewal dates, and annual cost.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Seats</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-primary)] mt-1">
            {totalUsed} <span className="text-[var(--text-base)] text-[var(--color-text-tertiary)]">/ {totalSeats}</span>
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Annual cost</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-primary)] mt-1">${(annual / 1000).toFixed(0)}k</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Active</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-success)] mt-1">
            {licenses.filter((l) => l.status === 'active').length}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Needs attention</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-warning)] mt-1">{expiring.length}</p>
        </Card>
      </div>

      <LicenseCards />
    </div>
  );
}
