import { LiveSourceMissingError, isConfigured } from './config'
import { subscribe, send } from './ws'

export type AlertSeverity = 'critical' | 'warning' | 'info' | 'success'
export type AlertStatus = 'open' | 'assigned' | 'resolved'

export interface Alert {
  id: string
  type: AlertSeverity
  title: string
  subtitle: string
  ts: number
  source?: string
  owner?: string
  status: AlertStatus
  trend?: 'up' | 'down' | 'flat'
}

export interface AlertEvent {
  alertId: string
  status?: AlertStatus
  owner?: string
  note?: string
  ts: number
}

export async function fetchAlerts(
  fetchImpl: typeof fetch = fetch,
  apiBase: string = '',
): Promise<Alert[]> {
  if (!isConfigured()) {
    throw new LiveSourceMissingError()
  }
  const res = await fetchImpl(`${apiBase}/api/v1/alerts`)
  if (!res.ok) throw new Error(`alerts fetch failed: ${res.status}`)
  const json = (await res.json()) as { alerts?: Alert[] }
  if (!json || !Array.isArray(json.alerts)) return []
  return json.alerts.filter(isValidAlert)
}

function isValidAlert(a: unknown): a is Alert {
  if (!a || typeof a !== 'object') return false
  const alert = a as Partial<Alert>
  return (
    typeof alert.id === 'string' &&
    typeof alert.title === 'string' &&
    typeof alert.subtitle === 'string' &&
    (alert.type === 'critical' || alert.type === 'warning' || alert.type === 'info' || alert.type === 'success') &&
    (alert.status === 'open' || alert.status === 'assigned' || alert.status === 'resolved') &&
    typeof alert.ts === 'number'
  )
}

export function subscribeAlerts(
  listener: (event: { type: 'snapshot' | 'upsert' | 'event'; alert?: Alert; alertEvent?: AlertEvent; ts: number }) => void,
): () => void {
  if (!isConfigured()) {
    throw new LiveSourceMissingError()
  }
  return subscribe('alerts.stream', (event) => {
    const ts = typeof event.ts === 'number' ? event.ts : Date.now()
    if (event.type === 'alerts.snapshot') {
      const payload = event.payload as { alerts?: Alert[] } | undefined
      if (!payload || !Array.isArray(payload.alerts)) return
      const valid = payload.alerts.filter(isValidAlert)
      listener({ type: 'snapshot', alert: valid[0], ts })
    } else if (event.type === 'alert.upsert') {
      const payload = event.payload as Partial<Alert> | undefined
      if (!payload || !isValidAlert(payload)) return
      listener({ type: 'upsert', alert: payload, ts })
    } else if (event.type === 'alert.event') {
      const payload = event.payload as Partial<AlertEvent> | undefined
      if (!payload || typeof payload.alertId !== 'string' || typeof payload.ts !== 'number') return
      listener({ type: 'event', alertEvent: payload as AlertEvent, ts })
    }
  })
}

export function sendAlert(alert: Alert): void {
  send({ type: 'alert.upsert', payload: alert })
}