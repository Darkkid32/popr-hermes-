import { useState } from 'react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { useAutomationStore } from '../../stores/automationStore';

const ENV_VARIANT = { production: 'error' as const, staging: 'warning' as const, development: 'info' as const, all: 'neutral' as const };

export function VariableEditor() {
  const variables = useAutomationStore((s) => s.variables);
  const [filter, setFilter] = useState<'all' | 'production' | 'staging' | 'development' | 'all-env'>('all');
  const filtered = variables.filter(v => filter === 'all' || v.environment === filter || (filter === 'all-env' && v.environment === 'all'));
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(['all', 'production', 'staging', 'development', 'all-env'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className="px-3 py-1.5 rounded-[var(--radius-md)] text-[var(--text-xs)] font-medium transition-colors" style={{ background: filter === f ? 'var(--color-brand-500)' : 'var(--color-surface-secondary)', color: filter === f ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)' }}>
            {f}
          </button>
        ))}
      </div>
      {filtered.map(v => (
        <Card key={v.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[var(--text-sm)] font-semibold text-[var(--color-text-primary)]">{v.name}</span>
              {v.sensitive && <Badge size="xs" variant="warning">sensitive</Badge>}
              <Badge size="xs" variant={ENV_VARIANT[v.environment]}>{v.environment}</Badge>
            </div>
            <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] mt-0.5">{v.description}</p>
            <p className="font-mono text-[var(--text-xs)] text-[var(--color-text-secondary)] mt-1">{v.value}</p>
          </div>
          <div className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">
            Updated {v.updatedAt} · Used by {v.usedBy.length} workflows
          </div>
        </Card>
      ))}
    </div>
  );
}
