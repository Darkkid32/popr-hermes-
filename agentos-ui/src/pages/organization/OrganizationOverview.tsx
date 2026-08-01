import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { OrgCard, StatCard, ActivityTimeline, QuotaCharts } from '../../components/organization';
import { useOrganizationStore } from '../../stores/organizationStore';

export function OrganizationOverview() {
  const members = useOrganizationStore((s) => s.members);
  const teams = useOrganizationStore((s) => s.teams);
  const projects = useOrganizationStore((s) => s.projects);
  const environments = useOrganizationStore((s) => s.environments);
  const licenses = useOrganizationStore((s) => s.licenses);
  const utilization = useOrganizationStore((s) => s.utilization());

  const activeMembers = members.filter((m) => m.status === 'active').length;
  const healthyEnvs = environments.filter((e) => e.status === 'healthy').length;
  const onTrack = projects.filter((p) => p.status === 'on-track' || p.status === 'completed').length;
  const activeLicenses = licenses.filter((l) => l.status === 'active').length;

  return (
    <div className="space-y-6">
      <OrgCard />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Members" value={String(activeMembers)} delta={`${members.length} total seats`} deltaTone="neutral" icon="👤" />
        <StatCard label="Teams" value={String(teams.length)} delta="6 active teams" deltaTone="up" icon="👥" accent="var(--color-accent-cyan-500)" />
        <StatCard label="Projects" value={String(projects.length)} delta={`${onTrack} on track`} deltaTone="up" icon="📦" accent="var(--color-status-success)" />
        <StatCard label="Environments" value={String(environments.length)} delta={`${healthyEnvs} healthy`} deltaTone={healthyEnvs >= environments.length * 0.7 ? 'up' : 'down'} icon="🌐" accent="var(--color-status-info)" />
        <StatCard label="Licenses" value={String(activeLicenses)} delta={`${licenses.length} total`} deltaTone="neutral" icon="🗝️" accent="var(--color-status-warning)" />
        <StatCard label="Utilization" value={utilization + '%'} delta="across 8 resources" deltaTone="neutral" icon="📊" accent="var(--color-brand-500)" />
        <StatCard label="Workspaces" value="6" delta="5 live · 1 archived" deltaTone="up" icon="🗂️" accent="var(--color-brand-500)" />
        <StatCard label="Open alerts" value="2" delta="1 at-risk project" deltaTone="down" icon="⚠️" accent="var(--color-status-error)" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <QuotaCharts />
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">Recent activity</h4>
                <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] mt-0.5">Latest organization events</p>
              </div>
              <Badge variant="neutral" size="sm">live</Badge>
            </div>
            <ActivityTimeline limit={6} compact />
          </Card>
        </div>

        <Card className="p-5 h-fit">
          <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)] mb-4">Quick actions</h4>
          <div className="flex flex-col gap-2">
            <Button variant="primary" size="sm" fullWidth>Invite member</Button>
            <Button variant="secondary" size="sm" fullWidth>Create workspace</Button>
            <Button variant="outline" size="sm" fullWidth>Review licenses</Button>
            <Button variant="ghost" size="sm" fullWidth>Export audit trail</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
