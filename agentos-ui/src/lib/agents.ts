import type { Agent } from './services/agent-registry'

/**
 * The four core agents always exist in the OS.
 * They are seeded into the store at boot and merged with live data when the runtime is connected.
 */
export const CORE_AGENTS: Agent[] = [
  {
    id: 'hermes',
    name: 'Hermes',
    icon: 'H',
    color: '#7C5CFC',
    accent: '#A78BFA',
    role: 'Orchestrator',
    description: 'Coordinates every agent, routes prompts, writes memory, and keeps Graphify current.',
    status: 'offline',
    health: 0,
    tools: ['graphify', 'memory', 'router', 'telegram'],
    collaborators: ['claude', 'opencode', 'openclaw'],
    goals: [
      'Coordinate every tool lane',
      'Keep Graphify current',
      'Minimize duplicate agent work',
    ],
    memory: ['System topology', 'Agent tool permissions', 'Escalation rules'],
    currentGoal: 'Coordinate every tool lane',
    currentWorkflow: 'idle',
    currentAction: 'Waiting for runtime',
    ts: 0,
  },
  {
    id: 'claude',
    name: 'Claude Code',
    icon: 'C',
    color: '#5B6CFF',
    accent: '#8B9DFF',
    role: 'Engineer',
    description: 'Deep engineering agent for architecture, refactors, tests, and code review.',
    status: 'offline',
    health: 0,
    tools: ['claude_code', 'tsc', 'tests', 'git'],
    collaborators: ['hermes', 'opencode'],
    goals: [
      'Ship production-grade code',
      'Maintain review discipline',
      'Catch failures before merge',
    ],
    memory: ['React app structure', 'Vite/Tailwind config', 'Recent reviews'],
    currentGoal: 'Ship production UI',
    currentWorkflow: 'idle',
    currentAction: 'Waiting for runtime',
    ts: 0,
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    icon: 'O',
    color: '#10B981',
    accent: '#34D399',
    role: 'Implementer',
    description: 'Fast implementation lane. Executes focused code edits and small features.',
    status: 'offline',
    health: 0,
    tools: ['opencode', 'typescript', 'vite'],
    collaborators: ['hermes', 'claude'],
    goals: [
      'Implement minimal clean changes',
      'Keep iteration speed high',
      'Avoid duplicated UI components',
    ],
    memory: ['Component patterns', 'Known TS errors', 'Build commands'],
    currentGoal: 'Implement minimal clean changes',
    currentWorkflow: 'idle',
    currentAction: 'Waiting for runtime',
    ts: 0,
  },
  {
    id: 'openclaw',
    name: 'OpenClaw',
    icon: 'W',
    color: '#F59E0B',
    accent: '#FBBF24',
    role: 'Connector',
    description: 'Runs cloud-heavy tasks, connectors, and remote automation workflows.',
    status: 'offline',
    health: 0,
    tools: ['cloud', 'connectors', 'scheduler'],
    collaborators: ['hermes'],
    goals: [
      'Maintain connector uptime',
      'Run remote jobs',
      'Detect integration drift',
    ],
    memory: ['Connector contracts', 'Cloud job state', 'Retry windows'],
    currentGoal: 'Maintain connector uptime',
    currentWorkflow: 'idle',
    currentAction: 'Waiting for runtime',
    ts: 0,
  },
]

export const RELATIONSHIPS: Array<{ from: string; to: string; label: string }> = [
  { from: 'hermes', to: 'claude', label: 'delegates' },
  { from: 'hermes', to: 'opencode', label: 'delegates' },
  { from: 'hermes', to: 'openclaw', label: 'monitors' },
  { from: 'claude', to: 'opencode', label: 'reviews' },
  { from: 'opencode', to: 'claude', label: 'reports' },
  { from: 'openclaw', to: 'hermes', label: 'syncs' },
]

export const WORKSPACE_LAYOUT: Record<string, WorkspaceSection[]> = {
  hermes: [
    { id: 'goals', label: 'Goals', summary: 'Strategic and tactical objectives Hermes is driving.' },
    { id: 'memory', label: 'Memory', summary: 'Durable memory records Hermes has indexed.' },
    { id: 'tasks', label: 'Tasks', summary: 'Active tasks owned by Hermes.' },
    { id: 'graph', label: 'Graph', summary: 'Graphify mutations originating from Hermes.' },
    { id: 'handoffs', label: 'Handoffs', summary: 'Recent handoffs into and out of Hermes.' },
  ],
  claude: [
    { id: 'reviews', label: 'Reviews', summary: 'Open and recent code reviews.' },
    { id: 'architecture', label: 'Architecture', summary: 'Architectural decisions and contracts under review.' },
    { id: 'refactors', label: 'Refactors', summary: 'Active refactor proposals and their diffs.' },
    { id: 'analysis', label: 'Analysis', summary: 'Deep analyses of code, performance, and risk.' },
  ],
  opencode: [
    { id: 'implementations', label: 'Implementations', summary: 'In-flight feature implementations.' },
    { id: 'commits', label: 'Commits', summary: 'Recent commits attributed to OpenCode.' },
    { id: 'diffs', label: 'Diffs', summary: 'Active diffs awaiting review.' },
    { id: 'changes', label: 'Changes', summary: 'Pending file changes and patches.' },
  ],
  openclaw: [
    { id: 'connectors', label: 'Connectors', summary: 'External connectors OpenClaw is watching.' },
    { id: 'automations', label: 'Automations', summary: 'Active automation runs.' },
    { id: 'runtime-actions', label: 'Runtime Actions', summary: 'Recent cloud job executions.' },
    { id: 'schedules', label: 'Schedules', summary: 'Scheduled jobs and their next windows.' },
  ],
}

export interface WorkspaceSection {
  id: string
  label: string
  summary: string
}

export function getCoreAgent(id: string): Agent | undefined {
  return CORE_AGENTS.find((a) => a.id === id)
}

export function getCoreAgentSections(id: string): WorkspaceSection[] {
  return WORKSPACE_LAYOUT[id] ?? []
}