import { MODEL_PROVIDERS, MODELS, MODEL_USAGE_HISTORY } from '../lib/models-data'
import { Canvas } from '../components/Canvas'
import { useCallback } from 'react'

const STATUS_COLOR: Record<string, string> = {
  connected: '#22d97a',
  disconnected: '#ff4d6d',
  degraded: '#ffb347',
}

const TYPE_ICON: Record<string, string> = {
  chat: '◌',
  embedding: '◉',
  completion: '◧',
  multimodal: '◬',
}

export function ModelsOverview() {
  const totalModels = MODELS.length
  const availableModels = MODELS.filter((m) => m.status === 'available').length
  const localModels = MODELS.filter((m) => m.tags.includes('local')).length
  const cloudModels = MODELS.filter((m) => m.tags.includes('cloud')).length
  const totalCost = MODEL_USAGE_HISTORY[MODEL_USAGE_HISTORY.length - 1]?.cost ?? 0

  const drawUsageChart = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
    ctx.clearRect(0, 0, W, H)
    const data = MODEL_USAGE_HISTORY.slice(-7)
    const maxCost = Math.max(...data.map((d) => d.cost))
    const maxRequests = Math.max(...data.map((d) => d.requests))

    // Cost line
    ctx.beginPath()
    data.forEach((d, i) => {
      const x = (i / (data.length - 1)) * W
      const y = H - (d.cost / maxCost) * (H - 40) - 20
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.strokeStyle = '#d946ef'
    ctx.lineWidth = 2
    ctx.stroke()

    // Requests line (secondary axis)
    ctx.beginPath()
    data.forEach((d, i) => {
      const x = (i / (data.length - 1)) * W
      const y = H - (d.requests / maxRequests) * (H - 40) - 20
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.strokeStyle = '#00e5ff'
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 4])
    ctx.stroke()
    ctx.setLineDash([])

    // Labels
    data.forEach((d, i) => {
      const x = (i / (data.length - 1)) * W
      ctx.fillStyle = '#6b7494'
      ctx.font = '9px JetBrains Mono, monospace'
      ctx.textAlign = 'center'
      ctx.fillText(d.date.slice(5), x, H - 4)
    })
  }, [])

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> {availableModels} available</span>
        <span className="badge badge-cyan"><span className="mono">{totalModels} models total</span></span>
        <span className="badge badge-purple"><span className="mono">{localModels} local · {cloudModels} cloud</span></span>
        <span className="badge badge-gray"><span className="mono">$${totalCost.toFixed(2)} today</span></span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 20 }}>
        <div className="col-stack">
          <div className="panel">
            <div className="section-label"><span className="ico">∿</span> USAGE TREND (7 DAYS)</div>
            <div className="canvas-wrap" style={{ height: 180 }}>
              <Canvas id="usage-chart" height={180} draw={drawUsageChart} />
            </div>
            <div className="row" style={{ marginTop: 12, gap: 16, fontSize: 10, color: '#6b7494' }}>
              <span style={{ color: '#d946ef' }}>● Cost ($)</span>
              <span style={{ color: '#00e5ff' }}>● Requests</span>
            </div>
          </div>

          <div className="panel">
            <div className="section-label"><span className="ico">⊕</span> PROVIDERS · {MODEL_PROVIDERS.length}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {MODEL_PROVIDERS.map((p) => (
                <div key={p.id} className="table-row" style={{ cursor: 'pointer' }}>
                  <span style={{ fontSize: 18, color: p.iconColor, width: 24, textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif' }}>{p.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#e8eaf6', flex: 1 }}>{p.name}</span>
                  <span className="badge badge-gray">{p.modelsCount} models</span>
                  <span className="badge" style={{ background: `${STATUS_COLOR[p.status]}22`, color: STATUS_COLOR[p.status] }}>{p.status}</span>
                  <span style={{ fontSize: 10, color: '#6b7494', fontFamily: 'JetBrains Mono, monospace', minWidth: 200 }}>{p.apiEndpoint}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-stack">
          <div className="panel">
            <div className="section-label"><span className="ico">◈</span> MODEL TYPES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(['chat', 'embedding', 'completion', 'multimodal'] as const).map((type) => {
                const count = MODELS.filter((m) => m.type === type).length
                const available = MODELS.filter((m) => m.type === type && m.status === 'available').length
                return (
                  <div key={type}>
                    <div className="row" style={{ marginBottom: 6 }}>
                      <span style={{ fontSize: 18, color: '#00e5ff' }}>{TYPE_ICON[type]}</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#e8eaf6', textTransform: 'capitalize' }}>{type}</span>
                      <div className="spacer" />
                      <span className="badge badge-green">{available} ready</span>
                      <span className="badge badge-gray">{count} total</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: count > 0 ? (available / count) * 100 : 0 + '%', background: '#00e5ff' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="panel">
            <div className="section-label"><span className="ico">◉</span> TOP MODELS BY USAGE</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {MODELS.sort((a, b) => b.usage.requests - a.usage.requests).slice(0, 5).map((m) => (
                <div key={m.id} className="table-row">
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#e8eaf6', minWidth: 140 }}>{m.name}</span>
                  <span className="badge badge-purple">{m.provider}</span>
                  <span style={{ fontSize: 11, color: '#9ba4c0', fontFamily: 'JetBrains Mono, monospace' }}>{m.usage.requests.toLocaleString()} req</span>
                  <span style={{ fontSize: 11, color: '#6b7494', fontFamily: 'JetBrains Mono, monospace' }}>{m.usage.cost}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="section-label"><span className="ico">⚙</span> QUICK ACTIONS</div>
            <div className="grid2">
              <button className="btn-secondary" style={{ justifyContent: 'flex-start', gap: 8 }}><span style={{ fontSize: 16 }}>➕</span> Add Provider</button>
              <button className="btn-secondary" style={{ justifyContent: 'flex-start', gap: 8 }}><span style={{ fontSize: 16 }}>↻</span> Refresh All</button>
              <button className="btn-secondary" style={{ justifyContent: 'flex-start', gap: 8 }}><span style={{ fontSize: 16 }}>📊</span> Run Benchmarks</button>
              <button className="btn-secondary" style={{ justifyContent: 'flex-start', gap: 8 }}><span style={{ fontSize: 16 }}>🔧</span> Configure Routing</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}