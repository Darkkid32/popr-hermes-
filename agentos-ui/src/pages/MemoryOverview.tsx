import { MEMORY_STATS, GRAPH_COMMUNITIES, MEMORY_NOTES, MEMORY_NAV_LINKS } from '../lib/memory-data'
import { useMemoryStore } from '../stores/MemoryStore'
import { Canvas } from '../components/Canvas'
import { useCallback } from 'react'

export function MemoryOverview() {
  const { activeTab, setActiveTab } = useMemoryStore()

  const drawGraph = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
    ctx.clearRect(0, 0, W, H)

    // Nodes and edges for the mini graph
    const nodes = [
      { x: 0.50, y: 0.50, r: 18, color: '#7c6cf5', label: 'Hermes' },
      { x: 0.28, y: 0.32, r: 14, color: '#00e5ff', label: 'Vault' },
      { x: 0.72, y: 0.34, r: 14, color: '#22d97a', label: 'Claude' },
      { x: 0.25, y: 0.68, r: 12, color: '#ffb347', label: 'OpenCode' },
      { x: 0.75, y: 0.66, r: 12, color: '#ff4d6d', label: 'OpenClaw' },
      { x: 0.50, y: 0.20, r: 10, color: '#f06292', label: 'Goals' },
      { x: 0.50, y: 0.82, r: 10, color: '#d946ef', label: 'Memory' },
      { x: 0.10, y: 0.50, r: 8, color: '#00e5ff', label: 'Omi' },
      { x: 0.90, y: 0.50, r: 8, color: '#7c6cf5', label: 'Graphify' },
      { x: 0.40, y: 0.40, r: 7, color: '#22d97a', label: 'Telegram' },
      { x: 0.60, y: 0.40, r: 7, color: '#ffb347', label: 'Discord' },
      { x: 0.40, y: 0.60, r: 7, color: '#ff4d6d', label: 'GitHub' },
      { x: 0.60, y: 0.60, r: 7, color: '#f06292', label: 'Linear' },
    ]

    const edges: [number, number][] = [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
      [1, 7], [1, 9], [1, 12],
      [2, 10], [2, 11], [2, 8], [2, 12],
      [3, 8], [3, 11],
      [4, 8], [4, 12],
      [5, 9], [5, 10],
      [6, 11], [6, 12],
      [7, 11],
      [9, 10],
    ]

    edges.forEach(([a, b]) => {
      const na = nodes[a]
      const nb = nodes[b]
      ctx.beginPath()
      ctx.moveTo(na.x * W, na.y * H)
      ctx.lineTo(nb.x * W, nb.y * H)
      ctx.strokeStyle = 'rgba(124, 108, 245, 0.10)'
      ctx.lineWidth = 0.8
      ctx.stroke()
    })

    nodes.forEach((n) => {
      const x = n.x * W
      const y = n.y * H
      const r = n.r

      ctx.beginPath()
      ctx.arc(x, y, r * 1.5, 0, Math.PI * 2)
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r * 1.5)
      grad.addColorStop(0, n.color + '30')
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fill()

      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = n.color + 'cc'
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.fillStyle = '#e8eaf6'
      ctx.font = '500 9px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(n.label, x, y + r + 7)
    })
  }, [])

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> {MEMORY_STATS.totalNotes.toLocaleString()} memories</span>
        <span className="badge badge-cyan"><span className="mono">Obsidian Vault</span></span>
        <span className="badge badge-purple"><span className="mono">{MEMORY_STATS.communities} communities</span></span>
        <span className="badge badge-gray"><span className="mono">last sync {MEMORY_STATS.lastSync}</span></span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Notes', val: MEMORY_STATS.totalNotes.toLocaleString(), tone: '#e8eaf6' },
          { label: 'Links', val: MEMORY_STATS.totalLinks.toLocaleString(), tone: '#7c6cf5' },
          { label: 'Tags', val: MEMORY_STATS.totalTags, tone: '#00e5ff' },
          { label: 'Sources', val: MEMORY_STATS.totalSources, tone: '#22d97a' },
        ].map((s) => (
          <div key={s.label} className="panel" style={{ padding: 18 }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-val" style={{ color: s.tone }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="ws-tabs" style={{ paddingLeft: 0, paddingRight: 0, marginBottom: 16 }}>
        {MEMORY_NAV_LINKS.slice(0, 4).map((t) => (
          <button key={t.id} className={'ws-tab ' + (activeTab === t.id ? 'active' : '')} onClick={() => setActiveTab(t.id)}>
            <span className="ico">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 12 }}>
        <div className="panel">
          <div className="section-label">
            <span className="ico">◧</span>
            RECENT NOTES · {MEMORY_NOTES.length}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {MEMORY_NOTES.slice(0, 8).map((n) => (
              <div key={n.id} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>
                <div style={{ fontSize: 13, color: '#e8eaf6', fontWeight: 500, marginBottom: 4 }}>{n.title}</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 4 }}>
                  {n.tags.slice(0, 3).map((t) => (
                    <span key={t} className="collab-chip" style={{ fontSize: 9.5 }}>{t}</span>
                  ))}
                  {n.tags.length > 3 && <span className="collab-chip" style={{ fontSize: 9.5 }}>+{n.tags.length - 3}</span>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#6b7494' }}>
                  <span className="mono">{n.links.length} links</span>
                  <span className="mono">{n.modified}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px 0' }}>
            <div className="section-label">
              <span className="ico">◬</span>
              KNOWLEDGE GRAPH · {MEMORY_STATS.graphNodes} NODES · {MEMORY_STATS.graphEdges} EDGES
            </div>
          </div>
          <div style={{ position: 'relative', height: 460 }}>
            <Canvas id="memory-overview-graph" height={460} draw={drawGraph} />
            <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {GRAPH_COMMUNITIES.map((c) => (
                <span key={c.id} className="badge" style={{ background: `${c.color}22`, color: c.color }}>
                  {c.label}: {c.nodes} nodes
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}