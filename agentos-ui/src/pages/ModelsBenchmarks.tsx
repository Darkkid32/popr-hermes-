import { MODEL_BENCHMARKS } from '../lib/models-data'
import { Canvas } from '../components/Canvas'
import { useCallback, useState } from 'react'

const PROVIDER_COLOR: Record<string, string> = {
  OpenAI: '#7c6cf5',
  Anthropic: '#ff4d6d',
  Ollama: '#00e5ff',
  Groq: '#ffb347',
  Google: '#f06292',
  Together: '#00e5ff',
}

export function ModelsBenchmarks() {
  const [selectedMetric, setSelectedMetric] = useState<'mmlu' | 'humaneval' | 'gsm8k' | 'bbh' | 'latency' | 'cost'>('mmlu')
  const [sortDesc, setSortDesc] = useState(true)

  const sortedBenchmarks = [...MODEL_BENCHMARKS].sort((a, b) => {
    if (selectedMetric === 'latency') {
      return sortDesc ? parseFloat(b.latency) - parseFloat(a.latency) : parseFloat(a.latency) - parseFloat(b.latency)
    }
    if (selectedMetric === 'cost') {
      const aCost = parseFloat(a.costPer1k.replace('$', ''))
      const bCost = parseFloat(b.costPer1k.replace('$', ''))
      return sortDesc ? bCost - aCost : aCost - bCost
    }
    const aVal = (a as any)[selectedMetric]
    const bVal = (b as any)[selectedMetric]
    return sortDesc ? bVal - aVal : aVal - bVal
  })

  const drawRadarChart = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
    ctx.clearRect(0, 0, W, H)
    const metrics = ['mmlu', 'humaneval', 'gsm8k', 'bbh']
    const models = sortedBenchmarks.slice(0, 6)
    const centerX = W / 2
    const centerY = H / 2
    const radius = Math.min(W, H) / 2 - 40

    // Draw axes
    metrics.forEach((_m, i) => {
      const angle = (i / metrics.length) * Math.PI * 2 - Math.PI / 2
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.strokeStyle = 'rgba(255,255,255,0.10)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Label
      ctx.fillStyle = '#9ba4c0'
      ctx.font = '9px JetBrains Mono, monospace'
      ctx.textAlign = 'center'
      ctx.fillText(_m.toUpperCase(), centerX + Math.cos(angle) * (radius + 25), centerY + Math.sin(angle) * (radius + 25) + 4)
    })

    // Draw rings
    for (let r = 1; r <= 4; r++) {
      ctx.beginPath()
      metrics.forEach((_m2, i) => {
        const angle = (i / metrics.length) * Math.PI * 2 - Math.PI / 2
        const x = centerX + Math.cos(angle) * (radius * r / 4)
        const y = centerY + Math.sin(angle) * (radius * r / 4)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      })
      ctx.closePath()
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Draw models
    models.forEach((model) => {
      const color = PROVIDER_COLOR[model.provider] || '#9ba4c0'
      ctx.beginPath()
      metrics.forEach((_m3, i) => {
        const value = (model as any)[_m3] / 100
        const angle = (i / metrics.length) * Math.PI * 2 - Math.PI / 2
        const x = centerX + Math.cos(angle) * radius * value
        const y = centerY + Math.sin(angle) * radius * value
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      })
      ctx.closePath()
      ctx.fillStyle = color + '33'
      ctx.fill()
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.stroke()
    })

    // Legend
    models.forEach((model, i) => {
      const color = PROVIDER_COLOR[model.provider] || '#9ba4c0'
      const y = 20 + i * 18
      ctx.fillStyle = color
      ctx.fillRect(10, y, 12, 12)
      ctx.fillStyle = '#e8eaf6'
      ctx.font = '10px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(model.modelName, 28, y + 9)
    })
  }, [sortedBenchmarks])

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> benchmarks loaded</span>
        <span className="badge badge-cyan"><span className="mono">{MODEL_BENCHMARKS.length} models</span></span>
        <span className="badge badge-purple"><span className="mono">4 metrics</span></span>
        <span className="badge badge-gray"><span className="mono">auto-refreshed</span></span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12, marginBottom: 20 }}>
        <div className="col-stack">
          <div className="panel">
            <div className="section-label"><span className="ico">∿</span> MULTI-METRIC RADAR (TOP 6)</div>
            <div className="canvas-wrap" style={{ height: 300 }}>
              <Canvas id="radar-chart" height={300} draw={drawRadarChart} />
            </div>
          </div>

          <div className="panel">
            <div className="section-label"><span className="ico">◉</span> DETAILED SCORES</div>
            <div style={{ padding: '4px 0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '180px 60px 60px 60px 60px 80px 80px', gap: 8, padding: '8px 0', fontSize: 9.5, color: '#6b7494', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }} className="mono">
                <span>MODEL</span>
                <span>MMLU</span>
                <span>HUMANEVAL</span>
                <span>GSM8K</span>
                <span>BBH</span>
                <span>LATENCY</span>
                <span>COST/1K</span>
              </div>
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {sortedBenchmarks.map((b) => (
                  <div key={b.modelId} style={{ display: 'grid', gridTemplateColumns: '180px 60px 60px 60px 60px 80px 80px', gap: 8, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: PROVIDER_COLOR[b.provider] || '#9ba4c0' }} />
                      <span style={{ fontSize: 12, fontWeight: 500, color: '#e8eaf6' }}>{b.modelName}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{b.mmlu}%</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{b.humaneval}%</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{b.gsm8k}%</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{b.bbh}%</span>
                    <span style={{ fontSize: 11, color: '#9ba4c0', fontFamily: 'JetBrains Mono, monospace' }}>{b.latency}</span>
                    <span style={{ fontSize: 11, color: '#9ba4c0', fontFamily: 'JetBrains Mono, monospace' }}>{b.costPer1k}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-stack">
          <div className="panel">
            <div className="section-label"><span className="ico">⌘</span> METRIC SELECTOR</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(['mmlu', 'humaneval', 'gsm8k', 'bbh', 'latency', 'cost'] as const).map((metric) => (
                <button
                  key={metric}
                  className={'ws-tab ' + (selectedMetric === metric ? 'active' : '')}
                  onClick={() => setSelectedMetric(metric)}
                  style={{ justifyContent: 'space-between', textAlign: 'left' }}
                >
                  <span>{metric.toUpperCase()}</span>
                  <span style={{ fontSize: 10, color: '#6b7494' }}>{metric === 'latency' ? 'ms (lower=better)' : metric === 'cost' ? '$/1k (lower=better)' : '% (higher=better)'}</span>
                </button>
              ))}
              <button className="btn-secondary" style={{ marginTop: 8, justifyContent: 'center' }} onClick={() => setSortDesc(!sortDesc)}>
                {sortDesc ? 'Descending' : 'Ascending'}
              </button>
            </div>
          </div>

          <div className="panel">
            <div className="section-label"><span className="ico">◈</span> TOP PERFORMERS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(['mmlu', 'humaneval', 'gsm8k', 'bbh'] as const).map((metric: 'mmlu' | 'humaneval' | 'gsm8k' | 'bbh') => {
                const top = sortedBenchmarks[0]
                return (
                  <div key={metric} className="panel-sm">
                    <div className="row">
                      <span style={{ fontSize: 12, fontWeight: 500, color: '#e8eaf6', minWidth: 60 }}>{metric.toUpperCase()}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#e8eaf6', fontFamily: 'Space Grotesk, sans-serif' }}>{(top as any)[metric]}%</span>
                      <div className="spacer" />
                      <span style={{ fontSize: 12, fontWeight: 500, color: PROVIDER_COLOR[top.provider] }}>{top.modelName}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="panel">
            <div className="section-label"><span className="ico">⚙</span> BENCHMARK CONFIG</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 11, color: '#9ba4c0' }}>
              <div className="panel-sm"><div className="stat-label">MMLU</div><div>Massive Multitask Language Understanding (57 tasks)</div></div>
              <div className="panel-sm"><div className="stat-label">HUMANEVAL</div><div>Code generation correctness (164 problems)</div></div>
              <div className="panel-sm"><div className="stat-label">GSM8K</div><div>Multi-step math reasoning (8.5K problems)</div></div>
              <div className="panel-sm"><div className="stat-label">BBH</div><div>Big-Bench Hard (23 challenging tasks)</div></div>
              <div className="panel-sm"><div className="stat-label">LATENCY</div><div>P50 response time for 100 token completion</div></div>
              <div className="panel-sm"><div className="stat-label">COST/1K</div><div>Blended input/output cost per 1K tokens</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}