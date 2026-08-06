// BenchmarkChart - Shared AI Component
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useCallback } from 'react'
import { Canvas } from '../../../components/Canvas'
import { Card } from '../data-display/Card'

export interface BenchmarkData {
  modelId: string
  modelName: string
  provider: string
  mmlu: number
  humaneval: number
  gsm8k: number
  bbh: number
  latency: string
  costPer1k: string
}

export type BenchmarkChartType = 'radar' | 'bar' | 'line'

const METRIC_LABELS: Record<string, string> = {
  mmlu: 'MMLU',
  humaneval: 'HUMANEVAL',
  gsm8k: 'GSM8K',
  bbh: 'BBH',
  latency: 'LATENCY',
  cost: 'COST/1K',
}

const METRIC_DIRECTION: Record<string, 'higher' | 'lower'> = {
  mmlu: 'higher',
  humaneval: 'higher',
  gsm8k: 'higher',
  bbh: 'higher',
  latency: 'lower',
  cost: 'lower',
}

const PROVIDER_COLORS: Record<string, string> = {
  OpenAI: '#7c6cf5',
  Anthropic: '#ff4d6d',
  Ollama: '#00e5ff',
  Groq: '#ffb347',
  Google: '#f06292',
  Together: '#00e5ff',
  Default: '#9ba4c0',
}

interface BenchmarkChartProps {
  data: BenchmarkData[]
  metrics: string[]
  type: BenchmarkChartType
  maxModels?: number
  showLegend?: boolean
  height?: number
}

export function BenchmarkChart({
  data,
  metrics,
  type,
  maxModels = 6,
  showLegend = true,
  height = 300,
}: BenchmarkChartProps) {
  const models = data.slice(0, maxModels)

  const drawRadar = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
    ctx.clearRect(0, 0, W, H)
    const centerX = W / 2
    const centerY = H / 2
    const radius = Math.min(W, H) / 2 - 50

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
      ctx.fillStyle = 'var(--color-text-tertiary)'
      ctx.font = '9px var(--font-mono)'
      ctx.textAlign = 'center'
      ctx.fillText(METRIC_LABELS[_m] || _m.toUpperCase(), centerX + Math.cos(angle) * (radius + 30), centerY + Math.sin(angle) * (radius + 30) + 4)
    })

    // Draw rings
    for (let r = 1; r <= 4; r++) {
      ctx.beginPath()
      metrics.forEach((_m2, i) => {
        const angle = (i / metrics.length) * Math.PI * 2 - Math.PI / 2
        const x = centerX + Math.cos(angle) * (radius * r / 4)
        const y = centerY + Math.sin(angle) * (radius * r / 4)
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.closePath()
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Draw models
    models.forEach((model) => {
      const color = PROVIDER_COLORS[model.provider] || PROVIDER_COLORS.Default
      ctx.beginPath()
      metrics.forEach((_m3, i) => {
        const value = (model as any)[_m3] / 100
        const angle = (i / metrics.length) * Math.PI * 2 - Math.PI / 2
        const x = centerX + Math.cos(angle) * radius * value
        const y = centerY + Math.sin(angle) * radius * value
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.closePath()
      ctx.fillStyle = color + '33'
      ctx.fill()
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.stroke()
    })

    // Legend
    if (showLegend) {
      models.forEach((model, i) => {
        const color = PROVIDER_COLORS[model.provider] || PROVIDER_COLORS.Default
        const y = 20 + i * 20
        ctx.fillStyle = color
        ctx.fillRect(10, y, 12, 12)
        ctx.fillStyle = 'var(--color-text-primary)'
        ctx.font = '10px var(--font-ui)'
        ctx.textAlign = 'left'
        ctx.fillText(model.modelName, 28, y + 9)
      })
    }
  }, [models, metrics, showLegend])

  const drawBar = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
    ctx.clearRect(0, 0, W, H)
    if (metrics.length !== 1) return

    const metric = metrics[0]
    const values = models.map(m => (m as any)[metric])
    const max = Math.max(...values)
    const min = Math.min(...values)

    const barWidth = (W - 60) / models.length * 0.6
    const startX = 40

    models.forEach((model, i) => {
      const value = (model as any)[metric]
      const normalized = max === min ? 0.5 : (value - min) / (max - min)
      const h = normalized * (H - 60) + 10
      const x = startX + i * (W - 60) / models.length
      const y = H - h - 30

      const color = PROVIDER_COLORS[model.provider] || PROVIDER_COLORS.Default

      // Bar
      ctx.fillStyle = color
      ctx.fillRect(x, y, barWidth, h)

      // Value label
      ctx.fillStyle = 'var(--color-text-primary)'
      ctx.font = '10px var(--font-mono)'
      ctx.textAlign = 'center'
      ctx.fillText(String(value), x + barWidth / 2, y - 5)

      // Model name
      ctx.fillStyle = 'var(--color-text-tertiary)'
      ctx.font = '8px var(--font-mono)'
      ctx.fillText(model.modelName, x + barWidth / 2, H - 5)
    })

    // Y-axis labels
    ctx.fillStyle = 'var(--color-text-quaternary)'
    ctx.font = '8px var(--font-mono)'
    ctx.textAlign = 'right'
    ctx.fillText(String(max), 30, 20)
    ctx.fillText(String(min), 30, H - 35)
  }, [models, metrics])

  const drawLine = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
    ctx.clearRect(0, 0, W, H)
    if (metrics.length !== 1) return

    const metric = metrics[0]
    const values = models.map(m => (m as any)[metric])
    const max = Math.max(...values)
    const min = Math.min(...values)

    ctx.beginPath()
    models.forEach((model, i) => {
      const value = (model as any)[metric]
      const normalized = max === min ? 0.5 : (value - min) / (max - min)
      const x = (i / (models.length - 1)) * (W - 40) + 20
      const y = H - normalized * (H - 60) - 30
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    const color = PROVIDER_COLORS[models[0]?.provider] || PROVIDER_COLORS.Default
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.stroke()

    // Points
    models.forEach((model, i) => {
      const value = (model as any)[metric]
      const normalized = max === min ? 0.5 : (value - min) / (max - min)
      const x = (i / (models.length - 1)) * (W - 40) + 20
      const y = H - normalized * (H - 60) - 30
      const color = PROVIDER_COLORS[model.provider] || PROVIDER_COLORS.Default

      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [models, metrics])

  const drawFn = type === 'radar' ? drawRadar : type === 'bar' ? drawBar : drawLine

  return (
    <Card variant="elevated">
      <div style={{ height, position: 'relative' }}>
        <Canvas id={`benchmark-chart-${type}`} height={height} draw={drawFn} />
      </div>
    </Card>
  )
}

// Legend component for external use
export function BenchmarkLegend({ models }: { models: BenchmarkData[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
      {models.slice(0, 6).map((model) => {
        const color = PROVIDER_COLORS[model.provider] || PROVIDER_COLORS.Default
        return (
          <div key={model.modelId} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: color }} />
            <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{model.modelName}</span>
            <span style={{ fontSize: 'var(--text-label-xs)', color: 'var(--color-text-tertiary)' }}>{model.provider}</span>
          </div>
        )
      })}
    </div>
  )
}

// Metric selector component
export function MetricSelector({
  metrics,
  selectedMetric,
  onChange,
  sortDesc,
  onSortToggle,
}: {
  metrics: string[]
  selectedMetric: string
  onChange: (metric: string) => void
  sortDesc: boolean
  onSortToggle: () => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
      {metrics.map((metric) => (
        <button
          key={metric}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--spacing-2) var(--spacing-3)',
            backgroundColor: selectedMetric === metric ? 'var(--color-primary-glow)' : 'transparent',
            border: selectedMetric === metric ? '1px solid var(--color-primary-base)' : '1px solid var(--color-border-primary)',
            borderRadius: 'var(--radius-md)',
            color: selectedMetric === metric ? 'var(--color-primary-base)' : 'var(--color-text-secondary)',
            fontSize: 'var(--text-body-sm)',
            fontWeight: selectedMetric === metric ? 600 : 400,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all var(--motion-duration-snap) var(--motion-easing-standard)',
          }}
          onClick={() => onChange(metric)}
        >
          <span>{METRIC_LABELS[metric] || metric.toUpperCase()}</span>
          <span style={{ fontSize: 'var(--text-label-xs)', color: 'var(--color-text-quaternary)' }}>
            {METRIC_DIRECTION[metric] === 'higher' ? '% (higher=better)' : 'lower=better'}
          </span>
        </button>
      ))}
      <button
        style={{
          padding: 'var(--spacing-2) var(--spacing-3)',
          backgroundColor: 'transparent',
          border: '1px solid var(--color-border-primary)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--text-body-sm)',
          cursor: 'pointer',
          marginTop: 'var(--spacing-2)',
        }}
        onClick={onSortToggle}
      >
        {sortDesc ? 'Descending' : 'Ascending'}
      </button>
    </div>
  )
}