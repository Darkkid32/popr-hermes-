import { LiveSourceMissingError, isConfigured } from './config'
import { subscribe, send } from './ws'

export interface TelemetrySample {
  agentId: string
  metric: string
  value: number
  unit?: string
  ts: number
}

export interface AgentHealth {
  agentId: string
  status: 'online' | 'busy' | 'offline'
  health: number
  ts: number
}

export interface AgentTelemetry {
  agentId: string
  health?: AgentHealth
  tokensToday?: number
  costToday?: number
  latencyMs?: number
  memoryItems?: number
  queue?: number
  ts: number
}

export function telemetryChannel(agentId: string): string {
  return `telemetry.agent.${agentId}`
}

export function allTelemetryChannel(): string {
  return 'telemetry.*'
}

export function subscribeTelemetry(
  agentId: string,
  listener: (sample: AgentTelemetry) => void,
): () => void {
  if (!isConfigured()) {
    throw new LiveSourceMissingError()
  }
  return subscribe(telemetryChannel(agentId), (event) => {
    if (event.type !== 'telemetry') return
    const payload = event.payload as Partial<AgentTelemetry> | undefined
    if (!payload || typeof payload !== 'object') return
    if (typeof payload.agentId !== 'string') return
    if (typeof payload.ts !== 'number') return
    listener(payload as AgentTelemetry)
  })
}

export function subscribeAllTelemetry(
  listener: (sample: AgentTelemetry) => void,
): () => void {
  if (!isConfigured()) {
    throw new LiveSourceMissingError()
  }
  return subscribe(allTelemetryChannel(), (event) => {
    if (event.type !== 'telemetry') return
    const payload = event.payload as Partial<AgentTelemetry> | undefined
    if (!payload || typeof payload !== 'object') return
    if (typeof payload.agentId !== 'string') return
    if (typeof payload.ts !== 'number') return
    listener(payload as AgentTelemetry)
  })
}

export function sendTelemetry(sample: AgentTelemetry): void {
  send({ type: 'telemetry', payload: sample })
}