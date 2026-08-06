// Models Endpoints - Migrated to use shared AI components
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState } from 'react'
import { MODEL_ENDPOINTS, MODELS, MODEL_PROVIDERS } from '../lib/models-data'
import { useModelsStore } from '../stores/ModelsStore'
import { Canvas } from '../components/Canvas'
import { useCallback } from 'react'
import { EndpointCard } from '../design-system/components/specialized/EndpointCard'
import { ProviderBadge } from '../design-system/components/specialized/ProviderBadge'
import { TokenUsageCard } from '../design-system/components/specialized/TokenUsageCard'
import { CostCard } from '../design-system/components/specialized/CostCard'

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

  // Provider health summary
  const providerHealth = MODEL_PROVIDERS.map((p) => {
    const providerEndpoints = eps.filter((e) => MODELS.find((m) => m.id === e.modelId)?.providerId === p.id)
    const healthy = providerEndpoints.filter((e) => e.status === 'healthy').length
    const total = providerEndpoints.length
    return { provider: p, healthy, total }
  })

  // Auth method breakdown
  const authMethods = ['bearer', 'api-key', 'none'].map((auth) => ({
    auth,
    count: eps.filter((e) => e.auth === auth).length,
  }))

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
                <EndpointCard
                  key={ep.id}
                  endpoint={ep}
                  model={MODELS.find((m) => m.id === ep.modelId)}
                  onTest={() => handleTest(ep.id)}
                  isTesting={testingId === ep.id}
                  variant="row"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="col-stack">
          <div className="panel">
            <div className="section-label"><span className="ico">⚙</span> ENDPOINT HEALTH</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {providerHealth.map(({ provider, healthy, total }) => (
                <div key={provider.id} className="panel-sm">
                  <div className="row" style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 16, color: provider.iconColor }}>{provider.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#e8eaf6' }}>{provider.name}</span>
                    <div className="spacer" />
                    <span className={'badge ' + (healthy === total && total > 0 ? 'badge-green' : healthy > 0 ? 'badge-amber' : 'badge-red')}>
                      {healthy}/{total}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: total > 0 ? (healthy / total) * 100 : 0 + '%', background: healthy === total ? '#22d97a' : healthy > 0 ? '#ffb347' : '#ff4d6d' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="section-label"><span className="ico">◉</span> AUTH METHODS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {authMethods.map(({ auth, count }) => (
                <div key={auth} className="panel-sm">
                  <div className="row">
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#e8eaf6', textTransform: 'uppercase' }}>{auth}</span>
                    <div className="spacer" />
                    <span className="badge badge-gray">{count} endpoints</span>
                  </div>
                </div>
              ))}
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

      {/* Token Usage & Cost Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <TokenUsageCard
          usage={{ prompt: 2500000, completion: 1800000, total: 4300000, cost: 28.45 }}
          limit={10000000}
          period="Today"
          showBreakdown={false}
          variant="compact"
        />
        <CostCard
          cost={28.45}
          period="Today"
          trend="up"
          trendValue={8.2}
          breakdown={[
            { label: 'OpenAI', cost: 15.30, percentage: 53.8, color: '#7c6cf5' },
            { label: 'Anthropic', cost: 7.80, percentage: 27.4, color: '#ff4d6d' },
            { label: 'Groq', cost: 3.20, percentage: 11.2, color: '#ffb347' },
            { label: 'Local', cost: 2.15, percentage: 7.6, color: '#00e5ff' },
          ]}
          budget={100}
          variant="compact"
        />
      </div>

      {/* Provider Config */}
      <div className="panel" style={{ marginTop: 12 }}>
        <div className="section-label"><span className="ico">⊕</span> PROVIDER CONFIG</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <ProviderBadge
            provider={{ id: 'ollama', name: 'Ollama', icon: '◌', iconColor: '#00e5ff', status: 'connected', modelsCount: 5, apiEndpoint: 'http://localhost:11434' }}
            variant="detailed"
            size="md"
          />
          <ProviderBadge
            provider={{ id: 'openai', name: 'OpenAI', icon: '●', iconColor: '#7c6cf5', status: 'connected', modelsCount: 4, apiEndpoint: 'api.openai.com' }}
            variant="detailed"
            size="md"
          />
          <ProviderBadge
            provider={{ id: 'anthropic', name: 'Anthropic', icon: '◐', iconColor: '#ff4d6d', status: 'connected', modelsCount: 3, apiEndpoint: 'api.anthropic.com' }}
            variant="detailed"
            size="md"
          />
          <ProviderBadge
            provider={{ id: 'groq', name: 'Groq', icon: '⚡', iconColor: '#ffb347', status: 'connected', modelsCount: 2, apiEndpoint: 'api.groq.com' }}
            variant="detailed"
            size="md"
          />
          <ProviderBadge
            provider={{ id: 'google', name: 'Google AI', icon: '★', iconColor: '#f06292', status: 'disconnected', modelsCount: 0, apiEndpoint: 'generativelanguage.googleapis.com' }}
            variant="detailed"
            size="md"
          />
          <ProviderBadge
            provider={{ id: 'together', name: 'Together AI', icon: '◆', iconColor: '#00e5ff', status: 'disconnected', modelsCount: 0, apiEndpoint: 'api.together.xyz' }}
            variant="detailed"
            size="md"
          />
        </div>
      </div>
    </div>
  )
}