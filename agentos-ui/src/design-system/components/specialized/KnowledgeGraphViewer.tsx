// KnowledgeGraphViewer - Shared AI Component
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useCallback, useMemo, useState } from 'react'
import { Card } from '../data-display/Card'
import { Button } from '../data-display/Button'
import { Canvas } from '../../../components/Canvas'

export interface GraphNode {
  id: string
  label: string
  x: number
  y: number
  r: number
  color: string
  community?: number
  metadata?: Record<string, any>
}

export interface GraphEdge {
  source: number
  target: number
  weight?: number
  color?: string
}

export interface GraphCommunity {
  id: number
  label: string
  color: string
  nodes: number
  edges: number
  centralNode: string
}

export interface KnowledgeGraphViewerProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  communities?: GraphCommunity[]
  onNodeSelect?: (node: GraphNode) => void
  layout?: 'force' | 'hierarchical' | 'circular' | 'community'
  showLabels?: boolean
  showCommunities?: boolean
  animate?: boolean
  height?: number
  onLayoutChange?: (layout: string) => void
}

export function KnowledgeGraphViewer({
  nodes,
  edges,
  communities = [],
  onNodeSelect,
  layout = 'community',
  showLabels = true,
  showCommunities = true,
  animate = true,
  height = 500,
  onLayoutChange,
}: KnowledgeGraphViewerProps) {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [currentLayout, setCurrentLayout] = useState(layout)
  const [showLabelsState, setShowLabelsState] = useState(showLabels)
  const [showCommunitiesState, setShowCommunitiesState] = useState(showCommunities)
  const [animateState, setAnimateState] = useState(animate)
  const [repulsion, setRepulsion] = useState(100)
  const [attraction, setAttraction] = useState(50)

  const allNodes = useMemo(() => nodes, [nodes])
  const allEdges = useMemo(() => edges, [edges])

  const drawGraph = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
    ctx.clearRect(0, 0, W, H)

    // Draw edges
    allEdges.forEach((edge) => {
      const source = allNodes[edge.source]
      const target = allNodes[edge.target]
      if (!source || !target) return

      ctx.beginPath()
      ctx.moveTo(source.x * W, source.y * H)
      ctx.lineTo(target.x * W, target.y * H)
      ctx.strokeStyle = edge.color || 'rgba(124, 108, 245, 0.08)'
      ctx.lineWidth = edge.weight ? Math.max(0.5, Math.min(2, edge.weight)) : 0.5
      ctx.stroke()
    })

    // Draw nodes
    allNodes.forEach((n, index) => {
      const x = n.x * W
      const y = n.y * H
      const r = n.r

      // Glow
      ctx.beginPath()
      ctx.arc(x, y, r * 2, 0, Math.PI * 2)
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r * 2)
      grad.addColorStop(0, n.color + '30')
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fill()

      // Node
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = n.color + 'cc'
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 1
      ctx.stroke()

      // Selection highlight
      if (selectedNode && selectedNode.id === n.id) {
        ctx.beginPath()
        ctx.arc(x, y, r + 3, 0, Math.PI * 2)
        ctx.strokeStyle = 'var(--color-primary-base)'
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // Label
      if (showLabelsState && (r > 8 || index < 10)) {
        ctx.fillStyle = '#e8eaf6'
        ctx.font = '500 9px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(n.label, x, y + r + 7)
      }
    })

    // Community legend overlay
    if (showCommunitiesState && communities.length > 0) {
      communities.forEach((c, i) => {
        const y = 20 + i * 22
        ctx.fillStyle = c.color
        ctx.fillRect(10, y, 12, 12)
        ctx.fillStyle = '#e8eaf6'
        ctx.font = '10px Inter, sans-serif'
        ctx.textAlign = 'left'
        ctx.fillText(`${c.label}: ${c.nodes} nodes`, 28, y + 9)
      })
    }
  }, [allNodes, allEdges, selectedNode, showLabelsState, showCommunitiesState, communities])

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const canvas = target.querySelector('canvas')
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    // Find clicked node
    const clickedNode = allNodes.find(n => {
      const dx = n.x - x
      const dy = n.y - y
      const dist = Math.sqrt(dx * dx + dy * dy)
      return dist < (n.r + 5) / Math.max(window.innerWidth, window.innerHeight)
    })

    if (clickedNode) {
      setSelectedNode(clickedNode)
      onNodeSelect?.(clickedNode)
    } else {
      setSelectedNode(null)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
            KNOWLEDGE GRAPH
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', cursor: 'pointer' }}>
            <input type="checkbox" checked={showLabelsState} onChange={(e) => setShowLabelsState(e.target.checked)} /> Labels
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', cursor: 'pointer' }}>
            <input type="checkbox" checked={showCommunitiesState} onChange={(e) => setShowCommunitiesState(e.target.checked)} /> Communities
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', cursor: 'pointer' }}>
            <input type="checkbox" checked={animateState} onChange={(e) => setAnimateState(e.target.checked)} /> Animate
          </label>
          <select value={currentLayout} onChange={(e) => { setCurrentLayout(e.target.value as any); onLayoutChange?.(e.target.value) }} style={{ padding: 'var(--spacing-1) var(--spacing-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)', backgroundColor: 'var(--color-background-base)', color: 'var(--color-text-primary)', fontSize: 'var(--text-body-sm)' }}>
            <option value="community">Community</option>
            <option value="force">Force-directed</option>
            <option value="hierarchical">Hierarchical</option>
            <option value="circular">Circular</option>
          </select>
        </div>
      </div>

      <Card variant="elevated" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
          <div onClick={handleCanvasClick} style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Canvas
              id="knowledge-graph"
              height={height}
              draw={drawGraph}
            />
          </div>
          {selectedNode && (
            <div style={{
              position: 'absolute',
              bottom: 'var(--spacing-4)',
              left: 'var(--spacing-4)',
              right: 'var(--spacing-4)',
              backgroundColor: 'var(--color-surface-container)',
              border: '1px solid var(--color-border-primary)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-3)',
              boxShadow: 'var(--shadow-level3)',
              zIndex: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-2)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{selectedNode.label}</div>
                  <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                    ID: {selectedNode.id}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedNode(null)}>Close</Button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--spacing-3)' }}>
                {selectedNode.metadata && Object.entries(selectedNode.metadata).map(([key, value]) => (
                  <div key={key} style={{ fontSize: 'var(--text-body-sm)' }}>
                    <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>{key}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>{String(value)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Controls Panel */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-4)', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', flex: 1, minWidth: 200 }}>
          <span style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', minWidth: 60 }}>Repulsion</span>
          <input type="range" min="10" max="200" value={repulsion} onChange={(e) => setRepulsion(Number(e.target.value))} style={{ flex: 1 }} />
          <span style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)', minWidth: 40, textAlign: 'right' }}>{repulsion}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', flex: 1, minWidth: 200 }}>
          <span style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', minWidth: 60 }}>Attraction</span>
          <input type="range" min="10" max="200" value={attraction} onChange={(e) => setAttraction(Number(e.target.value))} style={{ flex: 1 }} />
          <span style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)', minWidth: 40, textAlign: 'right' }}>{attraction}</span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          <Button variant="secondary" size="sm">Reset View</Button>
          <Button variant="secondary" size="sm">Center</Button>
          <Button variant="secondary" size="sm">Export PNG</Button>
        </div>
      </div>
    </div>
  )
}