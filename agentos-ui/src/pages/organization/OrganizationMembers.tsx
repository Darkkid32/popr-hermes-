import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { MemberTable } from '../../components/organization';
import { useOrganizationStore } from '../../stores/organizationStore';

export function OrganizationMembers() {
  const inviteMember = useOrganizationStore((s) => s.inviteMember);
  const roles = useOrganizationStore((s) => s.roles);
  const teams = useOrganizationStore((s) => s.teams);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState(roles[2]?.id || roles[0]?.id || '');
  const [teamIds, setTeamIds] = useState<string[]>([]);

  const submit = () => {
    if (!name.trim() || !email.trim() || !roleId) return;
    inviteMember({ name: name.trim(), email: email.trim(), roleId, teamIds });
    setName('');
    setEmail('');
    setTeamIds([]);
    setModalOpen(false);
  };

  const toggleTeam = (id: string) => {
    setTeamIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Members</h3>
          <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
            Manage who has access to the organization and their roles.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} leftIcon={<span aria-hidden="true">+</span>}>
          Invite member
        </Button>
      </div>

      <MemberTable />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Invite member"
        description="They will receive an email invitation with a secure sign-in link."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={submit} disabled={!name.trim() || !email.trim()}>Send invite</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ravi Kumar" fullWidth />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@hermes.local" fullWidth />
          <div>
            <span className="block text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)] mb-2">Role</span>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setRoleId(role.id)}
                  className={
                    'px-3 py-1.5 rounded-[var(--radius-md)] text-[var(--text-xs)] font-medium transition-colors ' +
                    (roleId === role.id
                      ? 'bg-[var(--color-brand-500)] text-[var(--color-text-inverse)]'
                      : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]')
                  }
                >
                  {role.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="block text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)] mb-2">Teams</span>
            <div className="flex flex-wrap gap-2">
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => toggleTeam(team.id)}
                  className={
                    'px-3 py-1.5 rounded-[var(--radius-md)] text-[var(--text-xs)] font-medium transition-colors ' +
                    (teamIds.includes(team.id)
                      ? 'bg-[var(--color-brand-500)] text-[var(--color-text-inverse)]'
                      : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]')
                  }
                >
                  {team.name}
                </button>
              ))}
            </div>
            {teamIds.length === 0 && (
              <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] mt-1">No teams selected</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="info" size="xs" dot>Invitations expire in 7 days</Badge>
          </div>
        </div>
      </Modal>
    </div>
  );
}
