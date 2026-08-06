// Models Overview - Migrated to use shared AI components
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { MODEL_PROVIDERS, MODELS, MODEL_USAGE_HISTORY } from '../lib/models-data'
import { Canvas } from '../components/Canvas'
import { useCallback } from 'react'
import { StatusPills, SectionLabel } from '../components/ui'
import { ModelCard } from '../design-system/components/specialized/ModelCard'
import { TokenUsageCard } from '../design-system/components/specialized/TokenUsageCard'
import { CostCard } from '../design-system/components/specialized/CostCard'
import { BenchmarkChart } from '../design-system/components/specialized/BenchmarkChart'

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
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.strokeStyle = '#d946ef'
      ctx.lineWidth = 2
      ctx.stroke()

      // Requests line (secondary axis)
      ctx.beginPath()
      data.forEach((d, i) => {
        const x = (i / (data.length - 1)) * W
        const y = H - (d.requests / maxRequests) * (H - 40) - 20
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
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

  // Prepare benchmark data
  const benchmarkData = MODELS.filter(m => m.status === 'available').slice(0, 6).map(m => ({
    modelId: m.id,
    modelName: m.name,
    provider: m.provider,
    mmlu: 85, // Placeholder - would come from benchmark data
    humaneval: 80,
    gsm8k: 75,
    bbh: 78,
    latency: '120ms',
    costPer1k: '$0.002',
  }))

  // Token usage
  const tokenUsage = {
    prompt: 1250000,
    completion: 890000,
    total: 2140000,
    cost: 15.23,
  }

  // Cost breakdown
  const costBreakdown = [
    { label: 'OpenAI GPT-4o', cost: 8.45, percentage: 55.4, color: '#7c6cf5' },
    { label: 'Anthropic Claude 3.5', cost: 4.12, percentage: 27.0, color: '#ff4d6d' },
    { label: 'Groq Llama 3', cost: 1.89, percentage: 12.4, color: '#ffb347' },
    { label: 'Local (Ollama)', cost: 0.77, percentage: 5.2, color: '#00e5ff' },
  ]

  return (
    <div className="page-body">
      <StatusPills pills={[
        { label: <><span className="dot dot-green" aria-hidden="true" /> {availableModels} available</>, tone: 'green', dot: true },
        { label: <><span className="mono">{totalModels} models total</span></>, tone: 'cyan' },
        { label: <><span className="mono">{localModels} local · {cloudModels} cloud</span></>, tone: 'purple' },
        { label: <><span className="mono">$${totalCost.toFixed(2)} today</span></>, tone: 'gray' },
      ]} className="status-pills-custom" />

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
            <SectionLabel icon="⊕">PROVIDERS · {MODEL_PROVIDERS.length}</SectionLabel>
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
            <SectionLabel icon="◈">MODEL TYPES</SectionLabel>
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
            <SectionLabel icon="◉">TOP MODELS BY USAGE</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {MODELS.sort((a, b) => b.usage.requests - a.usage.requests).slice(0, 5).map((m) => (
                <ModelCard
                  key={m.id}
                  model={m as any}
                  variant="compact"
                  onClick={() => {}}
                />
              ))}
            </div>
          </div>

          <div className="panel">
            <SectionLabel icon="⚙">QUICK ACTIONS</SectionLabel>
            <div className="grid2">
              <button className="btn-secondary" style={{ justifyContent: 'flex-start', gap: 8 }}><span style={{ fontSize: 16 }}>➕</span> Add Provider</button>
              <button className="btn-secondary" style={{ justifyContent: 'flex-start', gap: 8 }}><span style={{ fontSize: 16 }}>↻</span> Refresh All</button>
              <button className="btn-secondary" style={{ justifyContent: 'flex-start', gap: 8 }}><span style={{ fontSize: 16 }}>📊</span> Run Benchmarks</button>
              <button className="btn-secondary" style={{ justifyContent: 'flex-start', gap: 8 }}><span style={{ fontSize: 16 }}>🔧</span> Configure Routing</button>
            </div>
          </div>
        </div>
      </div>

      {/* Token Usage & Cost */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <TokenUsageCard usage={tokenUsage} limit={5000000} period="Today" showBreakdown={true} />
        <CostCard cost={15.23} period="Today" trend="up" trendValue={12.5} breakdown={costBreakdown} budget={50} />
      </div>

      {/* Benchmark Chart */}
      <div style={{ marginBottom: 20 }}>
        <BenchmarkChart
          data={benchmarkData}
          metrics={['mmlu', 'humaneval', 'gsm8k', 'bbh']}
          type="radar"
          maxModels={6}
          height={280}
        />
      </div>
    </div>
  )
}