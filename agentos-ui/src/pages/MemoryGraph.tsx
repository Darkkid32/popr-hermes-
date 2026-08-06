// Memory Graph - Migrated to use shared AI components
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { MEMORY_STATS, GRAPH_COMMUNITIES } from '../lib/memory-data'
import { KnowledgeGraphViewer, type GraphNode, type GraphEdge, type GraphCommunity } from '../design-system/components/specialized/KnowledgeGraphViewer'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'

export function MemoryGraph() {
  const centralNodes: GraphNode[] = [
    { id: 'hermes', label: 'Hermes', x: 0.50, y: 0.50, r: 18, color: '#7c6cf5' },
    { id: 'vault', label: 'Vault', x: 0.28, y: 0.32, r: 14, color: '#00e5ff' },
    { id: 'claude', label: 'Claude', x: 0.72, y: 0.34, r: 14, color: '#22d97a' },
    { id: 'opencode', label: 'OpenCode', x: 0.25, y: 0.68, r: 12, color: '#ffb347' },
    { id: 'openclaw', label: 'OpenClaw', x: 0.75, y: 0.66, r: 12, color: '#ff4d6d' },
    { id: 'goals', label: 'Goals', x: 0.50, y: 0.20, r: 10, color: '#f06292' },
    { id: 'memory', label: 'Memory', x: 0.50, y: 0.82, r: 10, color: '#d946ef' },
  ]

  const communityNodes: GraphNode[] = GRAPH_COMMUNITIES.flatMap((community, ci) => {
    const angle = (ci / GRAPH_COMMUNITIES.length) * Math.PI * 2
    const radius = 0.35
    const centerX = 0.5 + Math.cos(angle) * radius
    const centerY = 0.5 + Math.sin(angle) * radius

    return Array.from({ length: community.nodes }, (_, ni) => {
      const nodeAngle = (ni / community.nodes) * Math.PI * 2
      const nodeRadius = 0.08 + Math.random() * 0.04
      return {
        id: `${community.id}-${ni}`,
        label: `${community.label}-${ni + 1}`,
        x: Math.max(0.1, Math.min(0.9, centerX + Math.cos(nodeAngle) * nodeRadius)),
        y: Math.max(0.1, Math.min(0.9, centerY + Math.sin(nodeAngle) * nodeRadius)),
        r: 6 + Math.random() * 8,
        color: community.color,
        community: ci,
      }
    })
  })

  const allNodes = [...centralNodes, ...communityNodes]

  const edges: GraphEdge[] = []

  // Community edges (within community)
  communityNodes.forEach((n) => {
    const communityNodes2 = communityNodes.filter((_, ni) => Math.floor(ni / GRAPH_COMMUNITIES[0].nodes) === n.community)
    communityNodes2.forEach((target, ti) => {
      if (ti <= communityNodes2.indexOf(n)) return
      const targetIndex = allNodes.indexOf(target)
      if (targetIndex === -1) return
      edges.push({ source: allNodes.indexOf(n), target: targetIndex, color: n.color + '15', weight: 0.5 })
    })
  })

  // Central edges
  centralNodes.forEach((cn, ci) => {
      communityNodes.forEach((n) => {
      if (n.community === ci % GRAPH_COMMUNITIES.length && Math.random() < 0.3) {
        const targetIndex = allNodes.indexOf(n)
        if (targetIndex === -1) return
        edges.push({ source: allNodes.indexOf(cn), target: targetIndex, color: cn.color + '20', weight: 0.8 })
      }
    })
  })

  // Cross-community edges
  for (let i = 0; i < 15; i++) {
    const a = allNodes[Math.floor(Math.random() * allNodes.length)]
    const b = allNodes[Math.floor(Math.random() * allNodes.length)]
    if (a === b) continue
    edges.push({ source: allNodes.indexOf(a), target: allNodes.indexOf(b), color: 'rgba(124, 108, 245, 0.08)', weight: 0.5 })
  }

  const communities: GraphCommunity[] = GRAPH_COMMUNITIES.map(c => ({
    id: c.id,
    label: c.label,
    color: c.color,
    nodes: c.nodes,
    edges: c.edges,
    centralNode: c.centralNode,
  }))

  return (
    <div className="page-body">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
        <Badge variant="success" size="md" dot>{MEMORY_STATS.graphNodes} nodes</Badge>
        <Badge variant="info" size="md" dot>{MEMORY_STATS.graphEdges} edges</Badge>
        <Badge variant="primary" size="md" dot>{MEMORY_STATS.communities} communities</Badge>
        <Badge variant="default" size="md" dot>live layout</Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--spacing-3)' }}>
        <Card variant="elevated" style={{ padding: 0, overflow: 'hidden', height: 'calc(100vh - 200px)', minHeight: 500, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
            <KnowledgeGraphViewer
              nodes={allNodes}
              edges={edges}
              communities={communities}
              height={500}
              showLabels={true}
              showCommunities={true}
              animate={true}
            />
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          <Card variant="outlined">
            <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-3)' }}>
              GRAPH STATISTICS
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)' }}>
              <div className="panel-sm">
                <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>NODES</div>
                <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>{MEMORY_STATS.graphNodes.toLocaleString()}</div>
              </div>
              <div className="panel-sm">
                <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>EDGES</div>
                <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>{MEMORY_STATS.graphEdges.toLocaleString()}</div>
              </div>
              <div className="panel-sm">
                <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>COMMUNITIES</div>
                <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>{MEMORY_STATS.communities.toString()}</div>
              </div>
              <div className="panel-sm">
                <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>DENSITY</div>
                <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>0.004</div>
              </div>
            </div>
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
              CENTRALITY TOP 5
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              {['Hermes', 'Vault', 'Claude', 'Goals', 'OpenCode'].map((n, i) => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', fontSize: 'var(--text-body-sm)' }}>
                  <span style={{ color: '#00e5ff' }}>{i + 1}.</span>
                  <span style={{ fontWeight: 500, color: 'var(--color-text-primary)', flex: 1 }}>{n}</span>
                  <span style={{ color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>{(0.15 - i * 0.02).toFixed(3)}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="outlined">
            <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-3)' }}>
              COMMUNITIES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              {GRAPH_COMMUNITIES.map((c) => (
                <div key={c.id} className="panel-sm">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                    <span style={{ width: 12, height: 12, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-text-primary)', flex: 1 }}>{c.label}</span>
                    <span style={{ color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>{c.nodes} / {c.edges}</span>
                  </div>
                  <div style={{ height: 4, backgroundColor: 'var(--color-border-primary)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: (c.nodes / MEMORY_STATS.graphNodes) * 100 + '%', height: '100%', background: c.color, transition: 'width var(--motion-duration-smooth) var(--motion-easing-standard)' }} />
                  </div>
                  <div style={{ fontSize: 'var(--text-label-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--spacing-1)' }}>Central: {c.centralNode}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="outlined">
            <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-3)' }}>
              LAYOUT CONTROLS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}><input type="checkbox" defaultChecked /> Force-directed</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}><input type="checkbox" defaultChecked /> Show communities</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}><input type="checkbox" /> Show labels</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}><input type="checkbox" defaultChecked /> Animate</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <span style={{ fontSize: 'var(--text-label-xs)', color: 'var(--color-text-quaternary)', minWidth: 60 }}>Repulsion</span>
                <input type="range" min="10" max="200" defaultValue="100" style={{ flex: 1 }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <span style={{ fontSize: 'var(--text-label-xs)', color: 'var(--color-text-quaternary)', minWidth: 60 }}>Attraction</span>
                <input type="range" min="10" max="200" defaultValue="50" style={{ flex: 1 }} />
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-2)' }}>
                <Button variant="secondary" size="sm">Reset View</Button>
                <Button variant="secondary" size="sm">Center</Button>
                <Button variant="secondary" size="sm">Export PNG</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}