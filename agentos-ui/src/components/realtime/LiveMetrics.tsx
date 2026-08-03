import { useEventBus } from '../../lib/integration/event-bus'
import { useEffect, useRef, useState } from 'react'

interface MetricPoint {
  timestamp: number
  value: number
}

interface LiveMetricsProps {
  className?: string
  metrics?: string[]
  maxPoints?: number
  height?: number
}

export function LiveMetrics({ 
  className = '',
  metrics = ['cpu', 'memory', 'network', 'disk'],
  maxPoints = 60,
  height = 200,
}: LiveMetricsProps) {
  const [metricData, setMetricData] = useState<Record<string, MetricPoint[]>>({})
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  
  // Initialize metric data
  useEffect(() => {
    const initialData: Record<string, MetricPoint[]> = {}
    metrics.forEach((m) => {
      initialData[m] = Array.from({ length: maxPoints }, (_, i) => ({
        timestamp: Date.now() - (maxPoints - i) * 1000,
        value: 0,
      }))
    })
    setMetricData(initialData)
  }, [metrics, maxPoints])
  
  // Subscribe to metrics events
  useEffect(() => {
    const unsubscribe = useEventBus.getState().subscribe('metrics:update', (payload: { metric: string; value: number; timestamp?: number }) => {
      setMetricData((prev) => {
        const metric = payload.metric
        if (!metrics.includes(metric)) return prev
        
        const newPoint: MetricPoint = {
          timestamp: payload.timestamp || Date.now(),
          value: payload.value,
        }
        
        const currentData = prev[metric] || []
        const updatedData = [...currentData, newPoint].slice(-maxPoints)
        
        return { ...prev, [metric]: updatedData }
      })
    })
    
    return unsubscribe
  }, [metrics, maxPoints])
  
  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const render = () => {
      const { width, height: canvasHeight } = canvas
      ctx.clearRect(0, 0, width, canvasHeight)
      
      // Draw grid
      ctx.strokeStyle = 'var(--border-subtle)'
      ctx.lineWidth = 1
      for (let i = 0; i <= 4; i++) {
        const y = (i / 4) * canvasHeight
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
      
      // Draw each metric
      const colorMap = {
        cpu: 'var(--error)',
        memory: 'var(--warning)',
        network: 'var(--brand)',
        disk: 'var(--success)',
      }
      
      metrics.forEach((metric) => {
        const data = metricData[metric]
        if (!data || data.length < 2) return
        
        ctx.strokeStyle = colorMap[metric as keyof typeof colorMap] || 'var(--text)'
        ctx.lineWidth = 2
        ctx.beginPath()
        
        data.forEach((point, index) => {
          const x = (index / (maxPoints - 1)) * width
          const y = canvasHeight - (point.value / 100) * canvasHeight
          if (index === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        })
        
        ctx.stroke()
      })
      
      // Draw legend
      ctx.font = '11px var(--font-family-base)'
      ctx.fillStyle = 'var(--text-2)'
      metrics.forEach((metric, index) => {
        ctx.fillStyle = colorMap[metric as keyof typeof colorMap] || 'var(--text)'
        ctx.fillText(metric.toUpperCase(), 8, 16 + index * 14)
      })
      
      animationRef.current = requestAnimationFrame(render)
    }
    
    animationRef.current = requestAnimationFrame(render)
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [metricData, metrics, maxPoints])
  
  return (
    <div className={`live-metrics ${className}`} style={{ height }}>
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={height}
        style={{ width: '100%', height: '100%', display: 'block' }}
        aria-label="Live metrics chart"
      />
    </div>
  )
}