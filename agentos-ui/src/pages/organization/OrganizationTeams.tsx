import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { TeamTree } from '../../components/organization';
import { useOrganizationStore } from '../../stores/organizationStore';

export function OrganizationTeams() {
  const teams = useOrganizationStore((s) => s.teams);
  const teamMemberCount = useOrganizationStore((s) => s.teamMemberCount);

  const totalMembers = teams.reduce((acc, t) => acc + teamMemberCount(t.id), 0);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Teams</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          {teams.length} teams · {totalMembers} assignments across the organization
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {teams.map((team) => (
          <Card key={team.id} className="p-5">
            <div className="flex items-center gap-3">
              <span
                className="h-9 w-9 rounded-[var(--radius-lg)] flex items-center justify-center text-[var(--text-sm)] font-semibold text-[var(--color-text-inverse)] shrink-0"
                style={{ background: team.color }}
                aria-hidden="true"
              >
                {team.name.slice(0, 1)}
              </span>
              <div className="min-w-0">
                <p className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">{team.name}</p>
                <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">
                  {teamMemberCount(team.id)} members · since {team.createdAt}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <Badge size="xs" variant="neutral">{team.description.length > 60 ? team.description.slice(0, 60) + '…' : team.description}</Badge>
            </div>
          </Card>
        ))}
      </div>

      <div>
        <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)] mb-3">Team structure</h4>
        <TeamTree />
      </div>
    </div>
  );
}
