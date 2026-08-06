// Memory Overview - Migrated to use shared AI components
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { MEMORY_STATS, GRAPH_COMMUNITIES, MEMORY_NOTES, MEMORY_NAV_LINKS } from '../lib/memory-data'
import { useMemoryStore } from '../stores/MemoryStore'
import { KnowledgeGraphViewer, type GraphNode, type GraphEdge, type GraphCommunity } from '../design-system/components/specialized/KnowledgeGraphViewer'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { ProviderBadge } from '../design-system/components/specialized/ProviderBadge'

export function MemoryOverview() {
  const { activeTab, setActiveTab } = useMemoryStore()

  const graphNodes: GraphNode[] = [
    { id: 'hermes', label: 'Hermes', x: 0.50, y: 0.50, r: 18, color: '#7c6cf5' },
    { id: 'vault', label: 'Vault', x: 0.28, y: 0.32, r: 14, color: '#00e5ff' },
    { id: 'claude', label: 'Claude', x: 0.72, y: 0.34, r: 14, color: '#22d97a' },
    { id: 'opencode', label: 'OpenCode', x: 0.25, y: 0.68, r: 12, color: '#ffb347' },
    { id: 'openclaw', label: 'OpenClaw', x: 0.75, y: 0.66, r: 12, color: '#ff4d6d' },
    { id: 'goals', label: 'Goals', x: 0.50, y: 0.20, r: 10, color: '#f06292' },
    { id: 'memory', label: 'Memory', x: 0.50, y: 0.82, r: 10, color: '#d946ef' },
    { id: 'omi', label: 'Omi', x: 0.10, y: 0.50, r: 8, color: '#00e5ff' },
    { id: 'graphify', label: 'Graphify', x: 0.90, y: 0.50, r: 8, color: '#7c6cf5' },
    { id: 'telegram', label: 'Telegram', x: 0.40, y: 0.40, r: 7, color: '#22d97a' },
    { id: 'discord', label: 'Discord', x: 0.60, y: 0.40, r: 7, color: '#ffb347' },
    { id: 'github', label: 'GitHub', x: 0.40, y: 0.60, r: 7, color: '#ff4d6d' },
    { id: 'linear', label: 'Linear', x: 0.60, y: 0.60, r: 7, color: '#f06292' },
  ]

  const graphEdges: GraphEdge[] = [
    { source: 0, target: 1 }, { source: 0, target: 2 }, { source: 0, target: 3 }, { source: 0, target: 4 }, { source: 0, target: 5 }, { source: 0, target: 6 },
    { source: 1, target: 7 }, { source: 1, target: 9 }, { source: 1, target: 12 },
    { source: 2, target: 10 }, { source: 2, target: 11 }, { source: 2, target: 8 }, { source: 2, target: 12 },
    { source: 3, target: 8 }, { source: 3, target: 11 },
    { source: 4, target: 8 }, { source: 4, target: 12 },
    { source: 5, target: 9 }, { source: 5, target: 10 },
    { source: 6, target: 11 }, { source: 6, target: 12 },
    { source: 7, target: 11 },
    { source: 9, target: 10 },
  ]

  const communities: GraphCommunity[] = GRAPH_COMMUNITIES.map(c => ({
    id: c.id,
    label: c.label,
    color: c.color,
    nodes: c.nodes,
    edges: c.edges,
    centralNode: c.centralNode,
  }))

  const statCards = [
    { label: 'Notes', val: MEMORY_STATS.totalNotes.toLocaleString(), tone: 'var(--color-primary-base)' },
    { label: 'Links', val: MEMORY_STATS.totalLinks.toLocaleString(), tone: '#7c6cf5' },
    { label: 'Tags', val: MEMORY_STATS.totalTags, tone: '#00e5ff' },
    { label: 'Sources', val: MEMORY_STATS.totalSources, tone: '#22d97a' },
  ]

  return (
      <div className="page-body">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
          <ProviderBadge simpleProvider={{ name: 'Obsidian', status: 'connected', icon: '◧', iconColor: '#7c6cf5' }} size="md" />
          <ProviderBadge simpleProvider={{ name: 'Vault', status: 'connected', icon: '⊕', iconColor: '#00e5ff' }} size="md" label={`${MEMORY_STATS.communities} communities`} />
          <ProviderBadge simpleProvider={{ name: 'Sync', status: 'connected', icon: '↻', iconColor: '#ffb347' }} size="md" label={`last sync ${MEMORY_STATS.lastSync}`} />
        </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
        {statCards.map((s) => (
          <Card key={s.label} variant="elevated" padding="md">
            <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>
              {s.label}
            </div>
            <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: s.tone }}>
              {s.val}
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>
        {MEMORY_NAV_LINKS.slice(0, 4).map((t) => (
          <Button
            key={t.id}
            variant={activeTab === t.id ? 'primary' : 'tertiary'}
            size="sm"
            onClick={() => setActiveTab(t.id)}
          >
            <span className="ico" aria-hidden="true">{t.icon}</span>
            <span>{t.label}</span>
          </Button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 'var(--spacing-3)' }}>
        <Card variant="outlined">
          <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-3)' }}>
            RECENT NOTES · {MEMORY_NOTES.length}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            {MEMORY_NOTES.slice(0, 8).map((n) => (
              <div key={n.id} style={{ padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)', cursor: 'pointer', transition: 'all var(--motion-duration-snap) var(--motion-easing-standard)' }}>
                <div style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>{n.title}</div>
                <div style={{ display: 'flex', gap: 'var(--spacing-1)', flexWrap: 'wrap', marginBottom: 'var(--spacing-1)' }}>
                  {n.tags.slice(0, 3).map((t) => (
                    <Badge key={t} variant="default" size="sm">{t}</Badge>
                  ))}
                  {n.tags.length > 3 && <Badge variant="default" size="sm">+{n.tags.length - 3}</Badge>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-label-xs)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                  <span>{n.links.length} links</span>
                  <span>{n.modified}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="elevated" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: 'var(--spacing-3) var(--spacing-3) 0' }}>
            <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>
              KNOWLEDGE GRAPH · {MEMORY_STATS.graphNodes} NODES · {MEMORY_STATS.graphEdges} EDGES
            </div>
          </div>
          <div style={{ height: 460 }}>
            <KnowledgeGraphViewer
              nodes={graphNodes}
              edges={graphEdges}
              communities={communities}
              height={460}
              showLabels={true}
              showCommunities={true}
              animate={true}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}