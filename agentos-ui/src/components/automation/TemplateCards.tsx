import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useAutomationStore } from '../../stores/automationStore';

const CAT_COLORS = { starter: 'var(--color-status-success)', deploy: 'var(--color-brand-500)', data: 'var(--color-accent-cyan-500)', ops: 'var(--color-status-warning)', ai: 'var(--color-brand-500)', integration: 'var(--color-accent-cyan-500)' };

export function TemplateCards() {
  const templates = useAutomationStore((s) => s.templates);
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {templates.map(tpl => (
        <Card key={tpl.id} className="p-5 space-y-3">
          <div>
            <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">{tpl.name}</h4>
            <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mt-0.5">{tpl.description}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge size="xs" style={{ background: `color-mix(in oklab, ${CAT_COLORS[tpl.category]} 15%, transparent)`, color: CAT_COLORS[tpl.category] }}>{tpl.category}</Badge>
            <Badge size="xs" variant="neutral">{tpl.steps} steps</Badge>
            <Badge size="xs" variant="neutral">{tpl.uses} uses</Badge>
          </div>
          <div className="flex items-center gap-1 text-[var(--text-xs)] text-[var(--color-text-secondary)]">
            <span>{'⭐'.repeat(Math.round(tpl.rating))}</span>
            <span className="font-mono">{tpl.rating}</span>
          </div>
          <div className="flex flex-wrap gap-1 pt-2 border-t border-[var(--color-surface-border)]">
            {tpl.tags.map(tag => <span key={tag} className="px-2 py-0.5 bg-[var(--color-surface-tertiary)] rounded-[var(--radius-sm)] text-[var(--text-xs)] text-[var(--color-text-tertiary)]">#{tag}</span>)}
          </div>
        </Card>
      ))}
    </div>
  );
}
