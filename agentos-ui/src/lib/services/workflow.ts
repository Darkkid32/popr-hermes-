import { LiveSourceMissingError, isConfigured } from './config'
import { subscribe, send } from './ws'

export type WorkflowStatus = 'running' | 'queued' | 'paused' | 'failed' | 'completed'

export interface WorkflowStep {
  id: string
  name: string
  agentId?: string
  status: 'pending' | 'running' | 'done' | 'failed' | 'skipped'
  startedAt?: number
  finishedAt?: number
}

export interface Workflow {
  id: string
  name: string
  status: WorkflowStatus
  owner: string
  progress: number
  efficiency: number
  latency?: string
  cost?: string
  runs: number
  failures: number
  steps: WorkflowStep[]
  startedAt?: number
  updatedAt?: number
}

export interface WorkflowEvent {
  workflowId: string
  stepId?: string
  status?: WorkflowStatus | WorkflowStep['status']
  progress?: number
  ts: number
  message?: string
}

export const WORKFLOW_CHANNELS = {
  list: 'workflows.list',
  events: (workflowId: string) => `workflows.${workflowId}`,
  all: 'workflows.*',
} as const

export async function fetchWorkflows(
  fetchImpl: typeof fetch = fetch,
  apiBase: string = '',
): Promise<Workflow[]> {
  if (!isConfigured()) {
    throw new LiveSourceMissingError()
  }
  const url = `${apiBase}/api/v1/workflows`
  const res = await fetchImpl(url)
  if (!res.ok) throw new Error(`workflows fetch failed: ${res.status}`)
  const json = (await res.json()) as { workflows?: Workflow[] }
  if (!json || !Array.isArray(json.workflows)) return []
  return json.workflows
}

export function subscribeWorkflowList(
  listener: (event: { type: 'snapshot' | 'upsert' | 'delete'; workflow?: Workflow; id?: string; ts: number }) => void,
): () => void {
  if (!isConfigured()) {
    throw new LiveSourceMissingError()
  }
  return subscribe(WORKFLOW_CHANNELS.list, (event) => {
    const ts = typeof event.ts === 'number' ? event.ts : Date.now()
    if (event.type === 'workflow.snapshot') {
      const payload = event.payload as { workflows?: Workflow[] } | undefined
      if (!payload || !Array.isArray(payload.workflows)) return
      listener({ type: 'snapshot', workflow: payload.workflows[0], ts })
    } else if (event.type === 'workflow.upsert') {
      const payload = event.payload as Partial<Workflow> | undefined
      if (!payload || typeof payload.id !== 'string') return
      listener({ type: 'upsert', workflow: payload as Workflow, ts })
    } else if (event.type === 'workflow.delete') {
      const payload = event.payload as { id?: string } | undefined
      if (!payload || typeof payload.id !== 'string') return
      listener({ type: 'delete', id: payload.id, ts })
    }
  })
}

export function subscribeWorkflowEvents(
  workflowId: string,
  listener: (event: WorkflowEvent) => void,
): () => void {
  if (!isConfigured()) {
    throw new LiveSourceMissingError()
  }
  return subscribe(WORKFLOW_CHANNELS.events(workflowId), (event) => {
    if (event.type !== 'workflow.event') return
    const payload = event.payload as Partial<WorkflowEvent> | undefined
    if (!payload || typeof payload !== 'object') return
    if (typeof payload.workflowId !== 'string' || typeof payload.ts !== 'number') return
    listener(payload as WorkflowEvent)
  })
}

export function sendWorkflowEvent(event: WorkflowEvent): void {
  send({ type: 'workflow.event', payload: event })
}