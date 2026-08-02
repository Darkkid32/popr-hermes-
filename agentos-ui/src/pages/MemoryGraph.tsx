import { MEMORY_STATS, GRAPH_COMMUNITIES } from '../lib/memory-data'
import { Canvas } from '../components/Canvas'
import { useCallback } from 'react'

export function MemoryGraph() {
  const drawGraph = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
    ctx.clearRect(0, 0, W, H)

    // Generate deterministic positions for nodes
    const nodes = GRAPH_COMMUNITIES.flatMap((community, ci) => {
      const angle = (ci / GRAPH_COMMUNITIES.length) * Math.PI * 2
      const radius = 0.35
      const centerX = 0.5 + Math.cos(angle) * radius
      const centerY = 0.5 + Math.sin(angle) * radius
      
      return Array.from({ length: community.nodes }, (_, ni) => {
        const nodeAngle = (ni / community.nodes) * Math.PI * 2
        const nodeRadius = 0.08 + Math.random() * 0.04
        return {
          x: Math.max(0.1, Math.min(0.9, centerX + Math.cos(nodeAngle) * nodeRadius)),
          y: Math.max(0.1, Math.min(0.9, centerY + Math.sin(nodeAngle) * nodeRadius)),
          r: 6 + Math.random() * 8,
          color: community.color,
          label: `${community.label}-${ni + 1}`,
          community: ci,
        }
      })
    })

    // Add central nodes
    const centralNodes = [
      { x: 0.50, y: 0.50, r: 18, color: '#7c6cf5', label: 'Hermes' },
      { x: 0.28, y: 0.32, r: 14, color: '#00e5ff', label: 'Vault' },
      { x: 0.72, y: 0.34, r: 14, color: '#22d97a', label: 'Claude' },
      { x: 0.25, y: 0.68, r: 12, color: '#ffb347', label: 'OpenCode' },
      { x: 0.75, y: 0.66, r: 12, color: '#ff4d6d', label: 'OpenClaw' },
      { x: 0.50, y: 0.20, r: 10, color: '#f06292', label: 'Goals' },
      { x: 0.50, y: 0.82, r: 10, color: '#d946ef', label: 'Memory' },
    ]

    const allNodes = [...centralNodes, ...nodes]

    // Community edges (within community)
    nodes.forEach((n, _i) => {
      const communityNodes = nodes.filter((_, _ni) => Math.floor(_ni / GRAPH_COMMUNITIES[0].nodes) === n.community)
      communityNodes.forEach((target, ti) => {
        if (ti <= communityNodes.indexOf(n)) return
        const targetIndex = allNodes.indexOf(target)
        if (targetIndex === -1) return
        ctx.beginPath()
        ctx.moveTo(n.x * W, n.y * H)
        ctx.lineTo(target.x * W, target.y * H)
        ctx.strokeStyle = n.color + '15'
        ctx.lineWidth = 0.5
        ctx.stroke()
      })
    })

    // Central edges
    centralNodes.forEach((cn, _ci) => {
      nodes.forEach((n, _ni) => {
        if (n.community === _ci % GRAPH_COMMUNITIES.length && Math.random() < 0.3) {
          const targetIndex = allNodes.indexOf(n)
          if (targetIndex === -1) return
          ctx.beginPath()
          ctx.moveTo(cn.x * W, cn.y * H)
          ctx.lineTo(n.x * W, n.y * H)
          ctx.strokeStyle = cn.color + '20'
          ctx.lineWidth = 0.8
          ctx.stroke()
        }
      })
    })

    // Cross-community edges
    for (let i = 0; i < 15; i++) {
      const a = allNodes[Math.floor(Math.random() * allNodes.length)]
      const b = allNodes[Math.floor(Math.random() * allNodes.length)]
      if (a === b) continue
      ctx.beginPath()
      ctx.moveTo(a.x * W, a.y * H)
      ctx.lineTo(b.x * W, b.y * H)
      ctx.strokeStyle = 'rgba(124, 108, 245, 0.08)'
      ctx.lineWidth = 0.5
      ctx.stroke()
    }

    // Draw nodes
    allNodes.forEach((n) => {
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

      // Label for larger nodes
      if (r > 8) {
        ctx.fillStyle = '#e8eaf6'
        ctx.font = '500 9px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(n.label, x, y + r + 7)
      }
    })
  }, [])

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> {MEMORY_STATS.graphNodes} nodes</span>
        <span className="badge badge-cyan"><span className="mono">{MEMORY_STATS.graphEdges} edges</span></span>
        <span className="badge badge-purple"><span className="mono">{MEMORY_STATS.communities} communities</span></span>
        <span className="badge badge-gray"><span className="mono">live layout</span></span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 12 }}>
        <div className="panel" style={{ padding: 0, overflow: 'hidden', height: 'calc(100vh - 200px)', minHeight: 500 }}>
          <div style={{ position: 'relative', height: '100%' }}>
            <Canvas id="memory-graph" height={500} draw={drawGraph} />
            <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {GRAPH_COMMUNITIES.map((c) => (
                <span key={c.id} className="badge" style={{ background: `${c.color}22`, color: c.color }}>
                  {c.label}: {c.nodes} nodes
                </span>
              ))}
            </div>
            <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', gap: 8 }}>
              <button className="btn-secondary" style={{ fontSize: 10, padding: '4px 10px' }}>Reset View</button>
              <button className="btn-secondary" style={{ fontSize: 10, padding: '4px 10px' }}>Center</button>
              <button className="btn-secondary" style={{ fontSize: 10, padding: '4px 10px' }}>Export PNG</button>
            </div>
          </div>
        </div>

        <div className="col-stack">
          <div className="panel">
            <div className="section-label"><span className="ico">∿</span> GRAPH STATISTICS</div>
            <div className="grid2" style={{ marginBottom: 16 }}>
              <Stat label="NODES" value={MEMORY_STATS.graphNodes.toLocaleString()} />
              <Stat label="EDGES" value={MEMORY_STATS.graphEdges.toLocaleString()} />
              <Stat label="COMMUNITIES" value={MEMORY_STATS.communities.toString()} />
              <Stat label="DENSITY" value="0.004" />
            </div>
            <div className="section-label"><span className="ico">⌘</span> CENTRALITY TOP 5</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Hermes', 'Vault', 'Claude', 'Goals', 'OpenCode'].map((n, i) => (
                <div key={n} className="row" style={{ fontSize: 11 }}>
                  <span style={{ color: '#00e5ff' }}>{i + 1}.</span>
                  <span style={{ fontWeight: 500, color: '#e8eaf6', flex: 1 }}>{n}</span>
                  <span className="mono" style={{ color: '#9ba4c0' }}>{(0.15 - i * 0.02).toFixed(3)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="section-label"><span className="ico">◈</span> COMMUNITIES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {GRAPH_COMMUNITIES.map((c) => (
                <div key={c.id} className="panel-sm">
                  <div className="row" style={{ marginBottom: 8 }}>
                    <span style={{ width: 12, height: 12, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12.5, fontWeight: 500, color: '#e8eaf6', flex: 1 }}>{c.label}</span>
                    <span className="mono" style={{ color: '#6b7494' }}>{c.nodes} / {c.edges}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: (c.nodes / MEMORY_STATS.graphNodes) * 100 + '%', background: c.color }} />
                  </div>
                  <div style={{ fontSize: 10, color: '#6b7494', marginTop: 4 }}>Central: {c.centralNode}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="section-label"><span className="ico">⚙</span> LAYOUT CONTROLS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 11, color: '#9ba4c0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><input type="checkbox" defaultChecked /> Force-directed</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><input type="checkbox" defaultChecked /> Show communities</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><input type="checkbox" /> Show labels</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><input type="checkbox" defaultChecked /> Animate</label>
              <div className="row" style={{ gap: 8, marginTop: 8 }}>
                <span style={{ fontSize: 10, color: '#6b7494', minWidth: 60 }}>Repulsion</span>
                <input type="range" min="10" max="200" defaultValue="100" style={{ flex: 1 }} />
              </div>
              <div className="row" style={{ gap: 8 }}>
                <span style={{ fontSize: 10, color: '#6b7494', minWidth: 60 }}>Attraction</span>
                <input type="range" min="10" max="200" defaultValue="50" style={{ flex: 1 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel-sm">
      <div className="stat-label">{label}</div>
      <div className="stat-val" style={{ fontSize: 20 }}>{value}</div>
    </div>
  )
}