import { useEffect, useRef } from 'react'

const VAULT_STATS = [
  { label: 'Notes', val: '1,261', tone: '#e8eaf6' },
  { label: 'Links', val: '3,408', tone: '#7c6cf5' },
  { label: 'Tags', val: '142', tone: '#00e5ff' },
  { label: 'Sources', val: '8', tone: '#22d97a' },
]

const TABS = [
  { id: 'recent', label: 'Recent', icon: '◴' },
  { id: 'notes', label: 'Notes', icon: '◧' },
  { id: 'omi', label: 'Omi', icon: '◉' },
  { id: 'graph', label: 'Graph', icon: '◬' },
]

const NOTES = [
  { title: 'Hermes v2 — desktop runtime architecture', tags: ['hermes', 'build'], age: '2h', links: 8 },
  { title: 'Graphify community detection — Louvain vs Leiden', tags: ['graph', 'research'], age: '1d', links: 14 },
  { title: 'OpenClaw connector retry policy', tags: ['openclaw', 'ops'], age: '3d', links: 6 },
  { title: 'Vault compression strategy — IndexedDB partitioning', tags: ['vault', 'build'], age: '5d', links: 11 },
  { title: 'Omi transcript cleanup — heuristic rules', tags: ['omi', 'ml'], age: '1w', links: 4 },
  { title: 'Self · Goals Q3 planning', tags: ['self', 'plan'], age: '1w', links: 7 },
]

const NODES = [
  { x: 0.50, y: 0.50, r: 0.12, color: '#7c6cf5', label: 'Hermes', size: 24 },
  { x: 0.28, y: 0.32, r: 0.10, color: '#00e5ff', label: 'Vault', size: 18 },
  { x: 0.72, y: 0.34, r: 0.10, color: '#22d97a', label: 'Claude', size: 18 },
  { x: 0.25, y: 0.68, r: 0.09, color: '#ffb347', label: 'OpenCode', size: 16 },
  { x: 0.75, y: 0.66, r: 0.09, color: '#ff4d6d', label: 'OpenClaw', size: 16 },
  { x: 0.50, y: 0.20, r: 0.07, color: '#f06292', label: 'Goals', size: 12 },
  { x: 0.50, y: 0.82, r: 0.07, color: '#d946ef', label: 'Memory', size: 12 },
  { x: 0.10, y: 0.50, r: 0.06, color: '#00e5ff', label: 'Omi', size: 10 },
  { x: 0.90, y: 0.50, r: 0.06, color: '#7c6cf5', label: 'Graphify', size: 10 },
  { x: 0.40, y: 0.40, r: 0.05, color: '#22d97a', label: 'Telegram', size: 8 },
  { x: 0.60, y: 0.40, r: 0.05, color: '#ffb347', label: 'Discord', size: 8 },
  { x: 0.40, y: 0.60, r: 0.05, color: '#ff4d6d', label: 'GitHub', size: 8 },
  { x: 0.60, y: 0.60, r: 0.05, color: '#f06292', label: 'Linear', size: 8 },
  { x: 0.20, y: 0.20, r: 0.04, color: '#9ba4c0', label: 'Build', size: 6 },
  { x: 0.80, y: 0.20, r: 0.04, color: '#9ba4c0', label: 'Ship', size: 6 },
  { x: 0.20, y: 0.80, r: 0.04, color: '#9ba4c0', label: 'Growth', size: 6 },
  { x: 0.80, y: 0.80, r: 0.04, color: '#9ba4c0', label: 'Distribution', size: 6 },
]

const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
  [1, 7], [1, 9], [1, 13],
  [2, 10], [2, 11], [2, 8], [2, 14],
  [3, 12], [3, 15],
  [4, 12], [4, 16],
  [5, 13], [5, 14],
  [6, 15], [6, 16],
  [7, 11],
  [9, 10],
]

export function Memory() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const dpr = window.devicePixelRatio || 1
    const W = canvas.clientWidth
    const H = canvas.clientHeight
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)
    let t = 0
    let raf = 0

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      t += 0.005

      EDGES.forEach(([a, b]) => {
        const na = NODES[a]
        const nb = NODES[b]
        ctx.beginPath()
        ctx.moveTo(na.x * W, na.y * H)
        ctx.lineTo(nb.x * W, nb.y * H)
        ctx.strokeStyle = 'rgba(124, 108, 245, 0.10)'
        ctx.lineWidth = 0.8
        ctx.stroke()
      })

      NODES.forEach((n) => {
        const x = n.x * W + Math.sin(t + n.x * 4) * 6
        const y = n.y * H + Math.cos(t + n.y * 4) * 6
        const r = n.size

        ctx.beginPath()
        ctx.arc(x, y, r * 1.8, 0, Math.PI * 2)
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r * 1.8)
        grad.addColorStop(0, n.color + '40')
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
        ctx.font = '500 10px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(n.label, x, y + r + 8)
      })

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> 1,261 memories</span>
        <span className="badge badge-cyan"><span className="mono">Obsidian Vault</span></span>
        <span className="badge badge-purple"><span className="mono">11 notes · 20 links · indexed</span></span>
        <span className="badge badge-gray"><span className="mono">last sync 4m ago</span></span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {VAULT_STATS.map((s) => (
          <div key={s.label} className="panel" style={{ padding: 18 }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-val" style={{ color: s.tone }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="ws-tabs" style={{ paddingLeft: 0, paddingRight: 0, marginBottom: 16 }}>
        {TABS.map((t, i) => (
          <button key={t.id} className={'ws-tab ' + (i === 3 ? 'active' : '')}>
            <span className="ico">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 12 }}>
        <div className="panel">
          <div className="section-label">
            <span className="ico">◧</span>
            NOTES · 1,261
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {NOTES.map((n) => (
              <div key={n.title} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>
                <div style={{ fontSize: 13, color: '#e8eaf6', fontWeight: 500, marginBottom: 4 }}>{n.title}</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 4 }}>
                  {n.tags.map((t) => (
                    <span key={t} className="collab-chip">#{t}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 10, color: '#6b7494' }} className="mono">{n.links} links</span>
                  <span style={{ fontSize: 10, color: '#6b7494' }} className="mono">{n.age}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px 0' }}>
            <div className="section-label">
              <span className="ico">◬</span>
              VAULT GRAPH · 17 NODES · 21 EDGES
            </div>
          </div>
          <div style={{ position: 'relative', height: 460 }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
            <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span className="badge badge-purple">community: agents</span>
              <span className="badge badge-cyan">community: vault</span>
              <span className="badge badge-pink">community: goals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}