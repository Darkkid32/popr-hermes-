import { LiveSourceMissingError, isConfigured } from './config'
import { subscribe, send } from './ws'

export type LogLevel = 'info' | 'warn' | 'error' | 'debug'

export interface LogEntry {
  id: string
  agentId?: string
  source: string
  level: LogLevel
  message: string
  ts: number
  model?: string
  taskId?: string
}

export async function fetchLogs(
  fetchImpl: typeof fetch = fetch,
  apiBase: string = '',
  query: { agentId?: string; level?: LogLevel; since?: number } = {},
): Promise<LogEntry[]> {
  if (!isConfigured()) {
    throw new LiveSourceMissingError()
  }
  const params = new URLSearchParams()
  if (query.agentId) params.set('agent_id', query.agentId)
  if (query.level) params.set('level', query.level)
  if (typeof query.since === 'number') params.set('since', String(query.since))
  const url = `${apiBase}/api/v1/logs${params.toString() ? `?${params.toString()}` : ''}`
  const res = await fetchImpl(url)
  if (!res.ok) throw new Error(`logs fetch failed: ${res.status}`)
  const json = (await res.json()) as { logs?: LogEntry[] }
  if (!json || !Array.isArray(json.logs)) return []
  return json.logs.filter(isValidLog)
}

function isValidLog(entry: unknown): entry is LogEntry {
  if (!entry || typeof entry !== 'object') return false
  const e = entry as Partial<LogEntry>
  return (
    typeof e.id === 'string' &&
    typeof e.source === 'string' &&
    typeof e.message === 'string' &&
    typeof e.ts === 'number' &&
    (e.level === 'info' || e.level === 'warn' || e.level === 'error' || e.level === 'debug')
  )
}

export function subscribeLogs(
  listener: (entry: LogEntry) => void,
): () => void {
  if (!isConfigured()) {
    throw new LiveSourceMissingError()
  }
  return subscribe('logs.stream', (event) => {
    if (event.type !== 'log') return
    const payload = event.payload as Partial<LogEntry> | undefined
    if (!payload || typeof payload !== 'object') return
    if (!isValidLog(payload)) return
    listener(payload)
  })
}

export function sendLog(entry: LogEntry): void {
  send({ type: 'log', payload: entry })
}