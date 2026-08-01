import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useSecurityStore } from '../../stores/securityStore';

const STATUS_VARIANT = {
  active: 'success' as const,
  revoked: 'neutral' as const,
  expiring: 'warning' as const,
};

export function ApiKeyTable() {
  const apiKeys = useSecurityStore((s) => s.apiKeys);
  const revokeApiKey = useSecurityStore((s) => s.revokeApiKey);
  const rotateApiKey = useSecurityStore((s) => s.rotateApiKey);

  return (
    <div className="bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] rounded-[var(--radius-lg)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[var(--color-surface-border)] bg-[var(--color-surface-secondary)]">
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Name</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Key</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Scopes</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Created by</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Last used</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Expires</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Status</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.map((key) => (
              <tr key={key.id} className="border-b border-[var(--color-surface-border)] last:border-b-0 hover:bg-[var(--color-surface-hover)] transition-colors">
                <td className="px-4 py-3 text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]">{key.name}</td>
                <td className="px-4 py-3">
                  <code className="text-[var(--text-xs)] font-mono text-[var(--color-text-secondary)] bg-[var(--color-surface-tertiary)] px-2 py-1 rounded-[var(--radius-sm)]">
                    {key.prefix}••••••••
                  </code>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1 max-w-[240px]">
                    {key.scopes.map((s) => (
                      <Badge key={s} size="xs" variant="neutral">{s}</Badge>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-secondary)]">{key.createdBy}</td>
                <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-tertiary)]">{key.lastUsed}</td>
                <td className="px-4 py-3 text-[var(--text-sm)] font-mono text-[var(--color-text-tertiary)]">{key.expiresAt}</td>
                <td className="px-4 py-3">
                  <Badge size="xs" variant={STATUS_VARIANT[key.status]} dot>{key.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {key.status !== 'revoked' && (
                      <>
                        <Button variant="ghost" size="xs" onClick={() => rotateApiKey(key.id)}>Rotate</Button>
                        <Button variant="ghost" size="xs" className="text-[var(--color-status-error)]" onClick={() => revokeApiKey(key.id)}>
                          Revoke
                        </Button>
                      </>
                    )}
                    {key.status === 'revoked' && (
                      <span className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">inactive</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
