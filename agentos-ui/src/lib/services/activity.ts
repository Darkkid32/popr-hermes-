import { LiveSourceMissingError, isConfigured } from './config'
import { subscribe, send } from './ws'

export type ActivityKind =
  | 'conversation'
  | 'handoff'
  | 'decision'
  | 'memory_write'
  | 'workflow_step'
  | 'knowledge'
  | 'alert'
  | 'graph_mutation'

export interface ActivityItem {
  id: string
  ts: number
  kind: ActivityKind
  agentId?: string
  workflowId?: string
  graphNodeId?: string
  source?: string
  target?: string
  summary: string
}

export function subscribeActivity(
  listener: (item: ActivityItem) => void,
): () => void {
  if (!isConfigured()) {
    throw new LiveSourceMissingError()
  }
  return subscribe('activity.stream', (event) => {
    if (event.type !== 'activity') return
    const payload = event.payload as Partial<ActivityItem> | undefined
    if (!payload || typeof payload !== 'object') return
    if (typeof payload.id !== 'string' || typeof payload.ts !== 'number' || typeof payload.summary !== 'string') return
    listener(payload as ActivityItem)
  })
}

export function sendActivity(item: ActivityItem): void {
  send({ type: 'activity', payload: item })
}