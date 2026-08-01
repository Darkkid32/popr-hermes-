import { StatCard } from '../organization/OrgCard';

export interface SecurityOverviewCardsProps {
  users: number;
  keys: number;
  sessions: number;
  threats: number;
}

export function SecurityOverviewCards({ users, keys, sessions, threats }: SecurityOverviewCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Users" value={String(users)} delta="access roster" deltaTone="neutral" icon="👤" />
      <StatCard label="API keys" value={String(keys)} delta="active keys" deltaTone="up" icon="🔑" accent="var(--color-status-warning)" />
      <StatCard label="Active sessions" value={String(sessions)} delta="across devices" deltaTone="neutral" icon="🖥️" accent="var(--color-accent-cyan-500)" />
      <StatCard label="Open threats" value={String(threats)} delta="needs review" deltaTone={threats > 0 ? 'down' : 'up'} icon="🚨" accent="var(--color-status-error)" />
    </div>
  );
}
