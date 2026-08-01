export interface Agent {
  id: string
  name: string
  role: string
  description: string
  icon: string
  color: string
  accent: string
  status: 'online' | 'offline' | 'busy'
  health: number
  tasks: number
  queue: number
  latencyMs: number
  tokensToday: number
  costToday: number
  memoryItems: number
  graphEvents: number
  goalProgress: number
  currentAction: string
  currentWorkflow: string
  currentGoal: string
  lastAction: string
  thought: string
  decision: string
  toolUsage: string[]
  execution: string
  tools: string[]
  goals: string[]
  memory: string[]
  collaborators: string[]
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'blocked'

export interface Task {
  id: string
  title: string
  status: TaskStatus
  priority: 'high' | 'medium' | 'low'
  assignee?: string
  description?: string
  dependencies?: string[]
  workflow?: string
  memory?: string
  time?: string
  created_at: string
  updated_at?: string
}

export interface Log {
  id: string
  agent_name: string
  task_description: string
  model_used: string
  status: 'started' | 'completed' | 'failed'
  level: string
  source: string
  message: string
  time: string
  created_at: string
}

export interface Alert {
  id: string
  type: 'critical' | 'warning' | 'info' | 'success'
  title: string
  subtitle: string
  time: string
  source?: string
  owner?: string
  status?: 'open' | 'assigned' | 'resolved'
  trend?: 'up' | 'down' | 'flat'
}

export interface GraphNode {
  id: string
  label: string
  type: string
  color: string
  community: number
  incoming: number
  outgoing: number
  weight: number
  x: number
  y: number
  summary?: string
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  label: string
  weight: number
  type?: string
}

export interface Workflow {
  id: string
  name: string
  status: 'running' | 'queued' | 'failed' | 'completed' | 'paused'
  owner: string
  progress: number
  efficiency: number
  latency: string
  cost: string
  runs: number
  failures: number
  steps: string[]
}

export type AgentEventType = 'task' | 'memory' | 'graph' | 'workflow' | 'alert' | 'chat' | 'handoff'

export interface AgentEvent {
  id: string
  agent: string
  action: string
  target: string
  summary: string
  detail: string
  time: string
  type: AgentEventType
}

export interface ChatMessage {
  id: string
  role: 'operator' | 'agent' | 'system'
  agent?: string
  content: string
  type?: 'message' | 'tool' | 'code' | 'artifact' | 'reasoning'
  artifact?: { label: string; lines: string[]; language?: string }
  time: string
  streaming?: boolean
}

export interface MemoryRecord {
  id: string
  cluster: 'business' | 'research' | 'project' | 'system' | 'learning'
  title: string
  summary: string
  agent: string
  tags: string[]
  updated: string
  evidence: number
}