import { LiveSourceMissingError, isConfigured } from './config'
import { subscribe, send } from './ws'

export type AgentStatus = 'online' | 'busy' | 'offline'

export interface Agent {
  id: string
  name: string
  role: string
  description: string
  icon: string
  color: string
  accent: string
  status: AgentStatus
  health: number
  tools: string[]
  collaborators: string[]
  goals: string[]
  memory: string[]
  currentGoal?: string
  currentWorkflow?: string
  currentAction?: string
  ts: number
}

export interface AgentState {
  agentId: string
  status?: AgentStatus
  currentGoal?: string
  currentWorkflow?: string
  currentAction?: string
  thought?: string
  decision?: string
  ts: number
}

export async function fetchAgents(
  fetchImpl: typeof fetch = fetch,
  apiBase: string = '',
): Promise<Agent[]> {
  if (!isConfigured()) {
    throw new LiveSourceMissingError()
  }
  const url = `${apiBase}/api/v1/agents`
  const res = await fetchImpl(url)
  if (!res.ok) throw new Error(`agents fetch failed: ${res.status}`)
  const json = (await res.json()) as { agents?: Agent[] }
  if (!json || !Array.isArray(json.agents)) return []
  return json.agents.filter(isValidAgent)
}

function isValidAgent(a: unknown): a is Agent {
  if (!a || typeof a !== 'object') return false
  const agent = a as Partial<Agent>
  return (
    typeof agent.id === 'string' &&
    typeof agent.name === 'string' &&
    typeof agent.status === 'string' &&
    (agent.status === 'online' || agent.status === 'busy' || agent.status === 'offline') &&
    typeof agent.ts === 'number'
  )
}

export function subscribeAgentRegistry(
  listener: (event: { type: 'snapshot' | 'upsert' | 'state'; agent?: Agent; state?: AgentState; id?: string; ts: number }) => void,
): () => void {
  if (!isConfigured()) {
    throw new LiveSourceMissingError()
  }
  return subscribe('agents.registry', (event) => {
    const ts = typeof event.ts === 'number' ? event.ts : Date.now()
    if (event.type === 'agents.snapshot') {
      const payload = event.payload as { agents?: Agent[] } | undefined
      if (!payload || !Array.isArray(payload.agents)) return
      const valid = payload.agents.filter(isValidAgent)
      listener({ type: 'snapshot', agent: valid[0], ts })
    } else if (event.type === 'agent.upsert') {
      const payload = event.payload as Partial<Agent> | undefined
      if (!payload || typeof payload.id !== 'string') return
      listener({ type: 'upsert', agent: payload as Agent, ts })
    } else if (event.type === 'agent.state') {
      const payload = event.payload as Partial<AgentState> | undefined
      if (!payload || typeof payload.agentId !== 'string' || typeof payload.ts !== 'number') return
      listener({ type: 'state', state: payload as AgentState, ts })
    }
  })
}

export function subscribeAgentState(
  agentId: string,
  listener: (state: AgentState) => void,
): () => void {
  if (!isConfigured()) {
    throw new LiveSourceMissingError()
  }
  return subscribe(`agents.${agentId}.state`, (event) => {
    if (event.type !== 'agent.state') return
    const payload = event.payload as Partial<AgentState> | undefined
    if (!payload || typeof payload.agentId !== 'string' || typeof payload.ts !== 'number') return
    listener(payload as AgentState)
  })
}

export function sendAgentState(state: AgentState): void {
  send({ type: 'agent.state', payload: state })
}