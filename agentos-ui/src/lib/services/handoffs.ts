import { LiveSourceMissingError, isConfigured } from './config'
import { subscribe, send } from './ws'

export interface Handoff {
  id: string
  ts: number
  from: string
  to: string
  reason: string
  payload?: string
}

export function subscribeHandoffs(
  listener: (handoff: Handoff) => void,
): () => void {
  if (!isConfigured()) {
    throw new LiveSourceMissingError()
  }
  return subscribe('handoffs.stream', (event) => {
    if (event.type !== 'handoff') return
    const payload = event.payload as Partial<Handoff> | undefined
    if (!payload || typeof payload !== 'object') return
    if (
      typeof payload.id !== 'string' ||
      typeof payload.ts !== 'number' ||
      typeof payload.from !== 'string' ||
      typeof payload.to !== 'string' ||
      typeof payload.reason !== 'string'
    ) return
    listener(payload as Handoff)
  })
}

export function sendHandoff(handoff: Handoff): void {
  send({ type: 'handoff', payload: handoff })
}