import { LiveSourceMissingError, isConfigured } from './config'
import { subscribe, send } from './ws'

export interface AnalyticsTick {
  metric: string
  value: number
  ts: number
  tags?: Record<string, string>
}

export interface AnalyticsSeries {
  metric: string
  points: AnalyticsTick[]
}

export const ANALYTICS_CHANNELS = {
  series: (metric: string) => `analytics.series.${metric}`,
  all: 'analytics.*',
} as const

export function subscribeAnalytics(
  metric: string,
  listener: (point: AnalyticsTick) => void,
): () => void {
  if (!isConfigured()) {
    throw new LiveSourceMissingError()
  }
  return subscribe(ANALYTICS_CHANNELS.series(metric), (event) => {
    if (event.type !== 'analytics.tick') return
    const payload = event.payload as Partial<AnalyticsTick> | undefined
    if (!payload || typeof payload !== 'object') return
    if (typeof payload.metric !== 'string' || typeof payload.value !== 'number' || typeof payload.ts !== 'number') return
    listener(payload as AnalyticsTick)
  })
}

export function subscribeAllAnalytics(
  listener: (point: AnalyticsTick) => void,
): () => void {
  if (!isConfigured()) {
    throw new LiveSourceMissingError()
  }
  return subscribe(ANALYTICS_CHANNELS.all, (event) => {
    if (event.type !== 'analytics.tick') return
    const payload = event.payload as Partial<AnalyticsTick> | undefined
    if (!payload || typeof payload !== 'object') return
    if (typeof payload.metric !== 'string' || typeof payload.value !== 'number' || typeof payload.ts !== 'number') return
    listener(payload as AnalyticsTick)
  })
}

export function sendAnalytics(point: AnalyticsTick): void {
  send({ type: 'analytics.tick', payload: point })
}

export async function fetchAnalyticsHistory(
  metric: string,
  fetchImpl: typeof fetch = fetch,
  apiBase: string = '',
): Promise<AnalyticsTick[]> {
  if (!isConfigured()) {
    throw new LiveSourceMissingError()
  }
  const url = `${apiBase}/api/v1/analytics/series/${encodeURIComponent(metric)}`
  const res = await fetchImpl(url)
  if (!res.ok) throw new Error(`analytics fetch failed: ${res.status}`)
  const json = (await res.json()) as { points?: AnalyticsTick[] }
  if (!json || !Array.isArray(json.points)) return []
  return json.points.filter((p) => p && typeof p.value === 'number' && typeof p.ts === 'number')
}