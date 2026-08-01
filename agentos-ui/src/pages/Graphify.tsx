import { useCallback } from 'react'
import { Canvas } from '../components/Canvas'
import { GF_NODES, GF_EDGES } from '../lib/demo-data'

export function Graphify() {
  const drawGF = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
    ctx.clearRect(0, 0, W, H)
    GF_EDGES.forEach(([a, b]) => {
      const na = GF_NODES[a]
      const nb = GF_NODES[b]
      ctx.beginPath()
      ctx.moveTo(na.x * W, na.y * H)
      ctx.lineTo(nb.x * W, nb.y * H)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.lineWidth = 1
      ctx.setLineDash([2, 4])
      ctx.stroke()
      ctx.setLineDash([])
    })
    GF_NODES.forEach((n) => {
      const x = n.x * W
      const y = n.y * H
      ctx.beginPath()
      ctx.arc(x, y, n.r, 0, Math.PI * 2)
      ctx.fillStyle = n.color + '40'
      ctx.fill()
      ctx.strokeStyle = n.color
      ctx.lineWidth = 1.2
      ctx.stroke()
      ctx.fillStyle = '#e8eaf6'
      ctx.font = `600 ${Math.max(8, n.r * 0.45)}px Inter, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const lbl = n.label.length > 10 ? n.label.slice(0, 9) + '…' : n.label
      ctx.fillText(lbl, x, y)
    })
  }, [])

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> graph live</span>
        <span className="badge badge-cyan"><span className="mono">21 nodes · 29 edges</span></span>
        <span className="badge badge-purple"><span className="mono">3 communities</span></span>
        <span className="badge badge-gray"><span className="mono">density 1.38</span></span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 12, alignItems: 'stretch' }}>
        <div className="panel">
          <div className="grid4" style={{ marginBottom: 14 }}>
            <div><div className="stat-label">NODES</div><div className="stat-val">21</div></div>
            <div><div className="stat-label">EDGES</div><div className="stat-val">29</div></div>
            <div><div className="stat-label">COMMUNITIES</div><div className="stat-val">3</div></div>
            <div><div className="stat-label">DENSITY</div><div className="stat-val">1.38</div></div>
          </div>
          <div className="canvas-wrap" style={{ height: 460 }}>
            <Canvas id="gf-canvas" height={460} draw={drawGF} />
          </div>
        </div>

        <div className="col-stack">
          <div className="panel">
            <div className="section-label"><span className="ico">◉</span> NODE INSPECTOR</div>
            <div className="row" style={{ marginBottom: 12 }}>
              <div className="agent-circle" style={{ background: '#7c6cf5', color: '#fff', borderColor: '#7c6cf5', width: 36, height: 36, fontSize: 13 }}>A</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#e8eaf6', fontFamily: 'Space Grotesk, sans-serif' }}>AgentOS</div>
                <div style={{ fontSize: 10.5, color: '#6b7494' }} className="mono">Community 0 · weight 14.4</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#9ba4c0', marginBottom: 12, lineHeight: 1.55 }}>Central operating system root. Connects to all agents and the memory system.</div>
            <div className="grid3">
              <div><div className="stat-label">INCOMING</div><div style={{ fontSize: 16, fontWeight: 600, color: '#e8eaf6', fontFamily: 'Space Grotesk, sans-serif' }}>9</div></div>
              <div><div className="stat-label">OUTGOING</div><div style={{ fontSize: 16, fontWeight: 600, color: '#e8eaf6', fontFamily: 'Space Grotesk, sans-serif' }}>7</div></div>
              <div><div className="stat-label">DEGREE</div><div style={{ fontSize: 16, fontWeight: 600, color: '#00e5ff', fontFamily: 'Space Grotesk, sans-serif' }}>16</div></div>
            </div>
          </div>

          <div className="panel">
            <div className="section-label"><span className="ico">⇄</span> RELATIONSHIPS</div>
            <div className="row" style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><span className="badge badge-green" style={{ fontSize: 9.5 }}>control</span><span style={{ fontSize: 12, color: '#9ba4c0' }}>agentOS → hermes</span></div>
            <div className="row" style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><span className="badge badge-purple" style={{ fontSize: 9.5 }}>memory</span><span style={{ fontSize: 12, color: '#9ba4c0' }}>memory-system → agentOS</span></div>
            <div className="row" style={{ padding: '8px 0' }}><span className="badge badge-gray" style={{ fontSize: 9.5 }}>context</span><span style={{ fontSize: 12, color: '#9ba4c0' }}>context · weight 2</span></div>
          </div>

          <div className="panel">
            <div className="section-label"><span className="ico">∿</span> GROWTH · 24H</div>
            <div className="row" style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 12 }}><span className="dot dot-cyan" /><span style={{ color: '#9ba4c0' }}>Nodes</span><div className="spacer" /><span className="badge badge-green" style={{ fontSize: 9.5 }}>+8</span></div>
            <div className="row" style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 12 }}><span className="dot dot-purple" /><span style={{ color: '#9ba4c0' }}>Edges</span><div className="spacer" /><span className="badge badge-green" style={{ fontSize: 9.5 }}>+11</span></div>
            <div className="row" style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 12 }}><span className="dot dot-amber" /><span style={{ color: '#9ba4c0' }}>Communities</span><div className="spacer" /><span className="badge badge-green" style={{ fontSize: 9.5 }}>+1</span></div>
            <div className="row" style={{ padding: '6px 0', fontSize: 12 }}><span className="dot dot-green" /><span style={{ color: '#9ba4c0' }}>Memory writes</span><div className="spacer" /><span className="badge badge-green" style={{ fontSize: 9.5 }}>+138</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}