import { useState } from 'react'
import { MODEL_ENDPOINTS, MODELS, MODEL_PROVIDERS } from '../lib/models-data'
import { useModelsStore } from '../stores/ModelsStore'
import { Canvas } from '../components/Canvas'
import { useCallback } from 'react'

const STATUS_BADGE: Record<string, string> = {
  healthy: 'green',
  degraded: 'amber',
  down: 'red',
}

const TYPE_ICON: Record<string, string> = {
  chat: '◌',
  completion: '◧',
  embedding: '◉',
}

const TYPE_COLOR: Record<string, string> = {
  chat: '#00e5ff',
  completion: '#ffb347',
  embedding: '#d946ef',
}

export function ModelsEndpoints() {
  const { endpoints, testEndpoint } = useModelsStore()
  const eps = endpoints.length > 0 ? endpoints : MODEL_ENDPOINTS
  const [testingId, setTestingId] = useState<string | null>(null)

  const drawLatencyChart = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
    ctx.clearRect(0, 0, W, H)
    const data = eps.map((e) => parseFloat(e.latency))
    const max = Math.max(...data)
    const min = Math.min(...data)

    // Bars
    data.forEach((latency, i) => {
      const x = (i / (data.length - 1)) * W + 20
      const barWidth = (W - 40) / data.length * 0.6
      const h = ((latency - min) / (max - min || 1)) * (H - 40) + 10
      const y = H - h - 20

      ctx.fillStyle = eps[i].status === 'healthy' ? '#22d97a' : eps[i].status === 'degraded' ? '#ffb347' : '#ff4d6d'
      ctx.fillRect(x, y, barWidth, h)

      // Label
      ctx.fillStyle = '#6b7494'
      ctx.font = '8px JetBrains Mono, monospace'
      ctx.textAlign = 'center'
      ctx.fillText(eps[i].latency, x + barWidth / 2, H - 4)
    })

    // Y-axis labels
    ctx.fillStyle = '#4a5170'
    ctx.font = '8px JetBrains Mono, monospace'
    ctx.textAlign = 'right'
    ctx.fillText(max + 'ms', 15, 15)
    ctx.fillText(min + 'ms', 15, H - 25)
  }, [eps])

  const handleTest = async (id: string) => {
    setTestingId(id)
    await testEndpoint(id)
    setTestingId(null)
  }

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> {eps.filter((e) => e.status === 'healthy').length} healthy</span>
        <span className="badge badge-amber"><span className="mono">{eps.filter((e) => e.status === 'degraded').length} degraded</span></span>
        <span className="badge badge-red"><span className="mono">{eps.filter((e) => e.status === 'down').length} down</span></span>
        <span className="badge badge-cyan"><span className="mono">{eps.length} endpoints</span></span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 20 }}>
        <div className="col-stack">
          <div className="panel">
            <div className="section-label"><span className="ico">∿</span> LATENCY DISTRIBUTION</div>
            <div className="canvas-wrap" style={{ height: 180 }}>
              <Canvas id="latency-chart" height={180} draw={drawLatencyChart} />
            </div>
          </div>

          <div className="panel">
            <div className="section-label"><span className="ico">⊕</span> ENDPOINTS · {eps.length}</div>
            <div style={{ padding: '4px 0' }}>
              {eps.map((ep) => (
                <EndpointRow key={ep.id} endpoint={ep} onTest={handleTest} isTesting={testingId === ep.id} models={MODELS} />
              ))}
            </div>
          </div>
        </div>

        <div className="col-stack">
          <div className="panel">
            <div className="section-label"><span className="ico">⚙</span> ENDPOINT HEALTH</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {MODEL_PROVIDERS.map((p) => {
                const providerEndpoints = eps.filter((e) => MODELS.find((m) => m.id === e.modelId)?.providerId === p.id)
                const healthy = providerEndpoints.filter((e) => e.status === 'healthy').length
                const total = providerEndpoints.length
                return (
                  <div key={p.id} className="panel-sm">
                    <div className="row" style={{ marginBottom: 8 }}>
                      <span style={{ fontSize: 16, color: p.iconColor }}>{p.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#e8eaf6' }}>{p.name}</span>
                      <div className="spacer" />
                      <span className={'badge ' + (healthy === total && total > 0 ? 'badge-green' : healthy > 0 ? 'badge-amber' : 'badge-red')}>
                        {healthy}/{total}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: total > 0 ? (healthy / total) * 100 : 0 + '%', background: healthy === total ? '#22d97a' : healthy > 0 ? '#ffb347' : '#ff4d6d' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="panel">
            <div className="section-label"><span className="ico">◉</span> AUTH METHODS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(['bearer', 'api-key', 'none'] as const).map((auth) => {
                const count = eps.filter((e) => e.auth === auth).length
                return (
                  <div key={auth} className="panel-sm">
                    <div className="row">
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#e8eaf6', textTransform: 'uppercase' }}>{auth}</span>
                      <div className="spacer" />
                      <span className="badge badge-gray">{count} endpoints</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="panel">
            <div className="section-label"><span className="ico">⌘</span> QUICK ACTIONS</div>
            <div className="grid2">
              <button className="btn-secondary" style={{ justifyContent: 'flex-start', gap: 8 }}><span style={{ fontSize: 16 }}>➕</span> Add Endpoint</button>
              <button className="btn-secondary" style={{ justifyContent: 'flex-start', gap: 8 }}><span style={{ fontSize: 16 }}>🔄</span> Test All</button>
              <button className="btn-secondary" style={{ justifyContent: 'flex-start', gap: 8 }}><span style={{ fontSize: 16 }}>📋</span> Export Config</button>
              <button className="btn-secondary" style={{ justifyContent: 'flex-start', gap: 8 }}><span style={{ fontSize: 16 }}>🔐</span> Manage Keys</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EndpointRow({ endpoint, onTest, isTesting, models }: { endpoint: any; onTest: (id: string) => void; isTesting: boolean; models: any[] }) {
  const model = models.find((m) => m.id === endpoint.modelId)
  const modelName = model?.name || endpoint.modelId

  return (
    <div className="table-row" style={{ gap: 12 }}>
      <span style={{ fontSize: 16, color: TYPE_COLOR[endpoint.type] }}>{TYPE_ICON[endpoint.type]}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 500, color: '#e8eaf6' }}>{endpoint.name}</div>
        <div style={{ fontSize: 10.5, color: '#6b7494', fontFamily: 'JetBrains Mono, monospace' }}>{modelName} · {endpoint.type}</div>
      </div>
      <span className={'badge badge-' + STATUS_BADGE[endpoint.status]} style={{ fontSize: 9.5 }}>{endpoint.status}</span>
      <span style={{ fontSize: 11, color: '#9ba4c0', fontFamily: 'JetBrains Mono, monospace', minWidth: 80, textAlign: 'right' }}>{endpoint.latency}</span>
      <span style={{ fontSize: 11, color: '#6b7494', fontFamily: 'JetBrains Mono, monospace', minWidth: 60, textAlign: 'right' }}>{endpoint.uptime}</span>
      <span className="badge badge-gray" style={{ fontSize: 9.5, textTransform: 'uppercase' }}>{endpoint.auth}</span>
      <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 8px' }} onClick={() => onTest(endpoint.id)} disabled={isTesting}>
        {isTesting ? 'Testing...' : 'Test'}
      </button>
    </div>
  )
}