import { LiveSourceMissingError, isConfigured } from './config'
import { subscribe, send } from './ws'

export type IntegrationStatus = 'connected' | 'degraded' | 'disconnected'

export interface Integration {
  id: string
  name: string
  description: string
  status: IntegrationStatus
  version?: string
  accent: string
  lastCheck?: number
  ts: number
}

export interface Channel {
  id: string
  name: string
  kind: 'discord' | 'telegram' | 'scheduler' | 'webhook' | string
  handle: string
  enabled: boolean
  ts: number
}

export async function fetchIntegrations(
  fetchImpl: typeof fetch = fetch,
  apiBase: string = '',
): Promise<{ integrations: Integration[]; channels: Channel[] }> {
  if (!isConfigured()) {
    throw new LiveSourceMissingError()
  }
  const res = await fetchImpl(`${apiBase}/api/v1/integrations`)
  if (!res.ok) throw new Error(`integrations fetch failed: ${res.status}`)
  const json = (await res.json()) as { integrations?: Integration[]; channels?: Channel[] }
  return {
    integrations: Array.isArray(json.integrations) ? json.integrations.filter(isValidIntegration) : [],
    channels: Array.isArray(json.channels) ? json.channels.filter(isValidChannel) : [],
  }
}

function isValidIntegration(i: unknown): i is Integration {
  if (!i || typeof i !== 'object') return false
  const it = i as Partial<Integration>
  return (
    typeof it.id === 'string' &&
    typeof it.name === 'string' &&
    typeof it.status === 'string' &&
    (it.status === 'connected' || it.status === 'degraded' || it.status === 'disconnected') &&
    typeof it.accent === 'string' &&
    typeof it.ts === 'number'
  )
}

function isValidChannel(c: unknown): c is Channel {
  if (!c || typeof c !== 'object') return false
  const ch = c as Partial<Channel>
  return (
    typeof ch.id === 'string' &&
    typeof ch.name === 'string' &&
    typeof ch.kind === 'string' &&
    typeof ch.handle === 'string' &&
    typeof ch.enabled === 'boolean' &&
    typeof ch.ts === 'number'
  )
}

export function subscribeIntegrations(
  listener: (integration: Integration) => void,
): () => void {
  if (!isConfigured()) {
    throw new LiveSourceMissingError()
  }
  return subscribe('integrations.updates', (event) => {
    if (event.type !== 'integration.update') return
    const payload = event.payload as Partial<Integration> | undefined
    if (!payload || !isValidIntegration(payload)) return
    listener(payload)
  })
}

export function sendIntegrationUpdate(integration: Integration): void {
  send({ type: 'integration.update', payload: integration })
}