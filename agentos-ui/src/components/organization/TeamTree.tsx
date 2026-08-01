import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { useOrganizationStore } from '../../stores/organizationStore';

export function TeamTree() {
  const teams = useOrganizationStore((s) => s.teams);
  const memberById = useOrganizationStore((s) => s.memberById);
  const membersByTeam = useOrganizationStore((s) => s.membersByTeam);
  const teamMemberCount = useOrganizationStore((s) => s.teamMemberCount);
  const projectsByTeam = useOrganizationStore((s) => s.projectsByTeam);

  return (
    <div className="space-y-4">
      {teams.map((team) => {
        const lead = memberById(team.leadId);
        const members = membersByTeam(team.id);
        const projects = projectsByTeam(team.id);
        return (
          <Card key={team.id} className="p-5">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div
                className="h-10 w-10 rounded-[var(--radius-lg)] flex items-center justify-center text-sm font-semibold text-[var(--color-text-inverse)] shrink-0"
                style={{ background: team.color }}
                aria-hidden="true"
              >
                {team.name.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">
                    {team.name}
                  </h4>
                  <Badge size="xs" variant="neutral">{teamMemberCount(team.id)} members</Badge>
                  <Badge size="xs" variant="brand">{projects.length} projects</Badge>
                </div>
                <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mt-0.5">
                  {team.description}
                </p>
              </div>
              {lead && (
                <div className="flex items-center gap-2 shrink-0">
                  <Avatar fallback={lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2)} size="sm" />
                  <div className="min-w-0">
                    <p className="text-[var(--text-xs)] font-medium text-[var(--color-text-secondary)]">{lead.name}</p>
                    <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">Team lead</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[var(--color-surface-border)]">
              {members.map((m) => (
                <div key={m.id} className="flex items-center gap-2 px-2.5 py-1.5 bg-[var(--color-surface-secondary)] rounded-[var(--radius-md)]">
                  <Avatar fallback={m.name.split(' ').map((n) => n[0]).join('').slice(0, 2)} size="xs" />
                  <span className="text-[var(--text-xs)] text-[var(--color-text-secondary)]">{m.name}</span>
                </div>
              ))}
              {members.length === 0 && (
                <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">No members assigned yet</p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
