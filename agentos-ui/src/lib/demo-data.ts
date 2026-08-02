export type AgentColor = 'purple' | 'red' | 'amber' | 'cyan'

export interface Agent {
  id: 'hermes' | 'claude' | 'opencode' | 'openclaw'
  name: string
  role: string
  color: AgentColor
  hex: string
  initial: string
  status: 'ONLINE' | 'BUSY' | 'OFFLINE'
  currentGoal: string
  workflow: string
  lastAction: string
  latency: string
  memory: number
  graph: number
  goalPct: number
  goalTone: 'green' | 'amber' | 'red'
  tags: string[]
}

export const AGENTS: Agent[] = [
  {
    id: 'hermes',
    name: 'Hermes Agent',
    role: 'Local LLM orchestration',
    color: 'purple',
    hex: '#7c6cf5',
    initial: 'H',
    status: 'ONLINE',
    currentGoal: 'Coordinate every tool lane',
    workflow: 'Graph Memory Sync',
    lastAction: 'Wrote 3 new records',
    latency: '420ms',
    memory: 412,
    graph: 64,
    goalPct: 78,
    goalTone: 'green',
    tags: ['llama', 'graphify', 'telegram', 'discord'],
  },
  {
    id: 'claude',
    name: 'Claude Code',
    role: 'Deep engineering agent',
    color: 'red',
    hex: '#ff4d6d',
    initial: 'C',
    status: 'ONLINE',
    currentGoal: 'Ship production UI',
    workflow: 'Code Change Verification',
    lastAction: 'Verified React build',
    latency: '860ms',
    memory: 286,
    graph: 31,
    goalPct: 72,
    goalTone: 'green',
    tags: ['claude_code', 'tests', 'git'],
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    role: 'Fast implementation lane',
    color: 'amber',
    hex: '#ffb347',
    initial: 'O',
    status: 'BUSY',
    currentGoal: 'Implement minimal changes',
    workflow: 'Code Change Verification',
    lastAction: 'Compacted workspace panels',
    latency: '310ms',
    memory: 174,
    graph: 22,
    goalPct: 66,
    goalTone: 'amber',
    tags: ['opencode', 'typescript', 'vite'],
  },
  {
    id: 'openclaw',
    name: 'OpenClaw',
    role: 'Cloud execution surface',
    color: 'cyan',
    hex: '#00e5ff',
    initial: 'W',
    status: 'ONLINE',
    currentGoal: 'Maintain connector uptime',
    workflow: 'Connector Health Sweep',
    lastAction: 'Synced retry window',
    latency: '640ms',
    memory: 128,
    graph: 18,
    goalPct: 61,
    goalTone: 'red',
    tags: ['cloud', 'connectors', 'scheduler'],
  },
]

export interface Workflow {
  id: string
  name: string
  description: string
  status: 'RUNNING' | 'QUEUED' | 'FAILED' | 'COMPLETED'
  progress: number
  efficiency: number
  runs: number
  failures: number
  owner: string
  ownerColor: AgentColor
  cost: string
  latency: string
  steps: string[]
}

export const WORKFLOWS: Workflow[] = [
  {
    id: 'wf-1',
    name: 'Prompt to Production',
    description: 'End-to-end pipeline: prompt → plan → implement → verify → deploy.',
    status: 'RUNNING',
    progress: 74,
    efficiency: 88,
    runs: 128,
    failures: 3,
    owner: 'Hermes',
    ownerColor: 'purple',
    cost: '$0.72',
    latency: '3m 42s',
    steps: ['Hermes routes', 'Claude plans', 'OpenCode implements', 'Hermes verifies', 'OpenClaw deploys'],
  },
  {
    id: 'wf-2',
    name: 'Graph Memory Sync',
    description: 'Read logs, extract entities, update the live knowledge graph.',
    status: 'RUNNING',
    progress: 61,
    efficiency: 94,
    runs: 421,
    failures: 1,
    owner: 'Hermes',
    ownerColor: 'purple',
    cost: '$0.11',
    latency: '48s',
    steps: ['Read logs', 'Extract entities', 'Update graph', 'Cluster communities'],
  },
  {
    id: 'wf-3',
    name: 'Code Change Verification',
    description: 'Implement, typecheck, build, review diff. Multi-agent loop.',
    status: 'QUEUED',
    progress: 38,
    efficiency: 76,
    runs: 64,
    failures: 5,
    owner: 'Claude Code',
    ownerColor: 'red',
    cost: '$1.48',
    latency: '11m 12s',
    steps: ['Implement', 'Typecheck', 'Build', 'Review diff'],
  },
  {
    id: 'wf-4',
    name: 'Connector Health Sweep',
    description: 'Ping every connector, classify failures, open alerts.',
    status: 'FAILED',
    progress: 52,
    efficiency: 63,
    runs: 87,
    failures: 9,
    owner: 'OpenClaw',
    ownerColor: 'cyan',
    cost: '$0.39',
    latency: '7m 03s',
    steps: ['Ping connector', 'Collect latency', 'Classify failures', 'Open alert'],
  },
  {
    id: 'wf-5',
    name: 'Launch Sprint Rollup',
    description: 'Read tasks, map goals, summarize blockers, write memory.',
    status: 'COMPLETED',
    progress: 100,
    efficiency: 91,
    runs: 215,
    failures: 2,
    owner: 'Hermes',
    ownerColor: 'purple',
    cost: '$0.22',
    latency: '2m 18s',
    steps: ['Read tasks', 'Map goals', 'Summarize blockers', 'Write memory'],
  },
]

export interface FleetTask {
  title: string
  agent: string
  agentColor: AgentColor
  priority: 'high' | 'medium' | 'low'
  status: 'Todo' | 'In Progress' | 'Blocked' | 'Done'
}

export const FLEET_TASKS: FleetTask[] = [
  { title: 'Launch first affiliate program', agent: 'Hermes Agent', agentColor: 'purple', priority: 'high', status: 'Todo' },
  { title: 'Wire real Graphify API into UI', agent: 'Claude Code', agentColor: 'red', priority: 'high', status: 'In Progress' },
  { title: 'Compact Agent Workspace layout', agent: 'OpenCode', agentColor: 'amber', priority: 'high', status: 'In Progress' },
  { title: 'Resolve OpenClaw connector drift', agent: 'OpenClaw', agentColor: 'cyan', priority: 'high', status: 'Blocked' },
]

export interface FleetHandoff {
  from: Agent
  to: Agent
  summary: string
}

export const FLEET_HANDOFFS: FleetHandoff[] = [
  { from: AGENTS[0], to: AGENTS[1], summary: 'Architecture review requested' },
  { from: AGENTS[1], to: AGENTS[2], summary: 'Implementation approved' },
  { from: AGENTS[2], to: AGENTS[0], summary: 'Build completed' },
  { from: AGENTS[3], to: AGENTS[0], summary: 'Connector synced' },
]

export interface HandoffEntry {
  id: string
  from: Agent
  to: Agent
  reason: string
  age: string
}

export const MISSION_HANDOFFS: HandoffEntry[] = [
  { id: 'h1', from: AGENTS[0], to: AGENTS[1], reason: 'Cross-verify depth + perspective contracts before shipping shell', age: '3m' },
  { id: 'h2', from: AGENTS[1], to: AGENTS[2], reason: 'Hand off sidebar perspective implementation', age: '3m' },
  { id: 'h3', from: AGENTS[0], to: AGENTS[3], reason: 'Stream memory writes to Telegram + Discord', age: '3m' },
]

export interface ActivityEntry {
  id: string
  agent: Agent
  badge: 'amber' | 'green' | 'red' | 'cyan'
  kind: string
  text: string
}

export const ACTIVITY_BUS: ActivityEntry[] = [
  { id: 'a1', agent: AGENTS[3], badge: 'amber', kind: 'MEMORY WRITE', text: 'OpenClaw touched "PRD" on the graph.' },
  { id: 'a2', agent: AGENTS[0], badge: 'green', kind: 'WORKFLOW STEP', text: 'Hermes Agent touched "OpenClaw" on the graph.' },
  { id: 'a3', agent: AGENTS[3], badge: 'amber', kind: 'GRAPH MUTATION', text: 'OpenClaw touched "Claude Code" on the graph.' },
  { id: 'a4', agent: AGENTS[1], badge: 'red', kind: 'WORKFLOW STEP', text: 'Claude Code touched "Connector Drift" on the graph.' },
  { id: 'a5', agent: AGENTS[2], badge: 'cyan', kind: 'TASK', text: 'OpenCode touched "Workspace Redesign" on the graph.' },
  { id: 'a6', agent: AGENTS[1], badge: 'red', kind: 'HANDOFF', text: 'Claude Code handed off sidebar implementation to OpenCode.' },
  { id: 'a7', agent: AGENTS[0], badge: 'green', kind: 'MEMORY WRITE', text: 'Hermes indexed 4 new community nodes.' },
  { id: 'a8', agent: AGENTS[3], badge: 'amber', kind: 'ALERT', text: 'OpenClaw raised connector heartbeat drift.' },
]

export interface DialogueEntry {
  id: string
  agent: Agent
  badge: 'amber' | 'red' | 'green' | 'cyan' | 'purple'
  age: string
  text: string
}

export const DIALOGUE: DialogueEntry[] = [
  { id: 'd1', agent: AGENTS[2], badge: 'amber', age: '3m', text: 'Need your read on node cluster Claude Code.' },
  { id: 'd2', agent: AGENTS[1], badge: 'red', age: '3m', text: 'Reviewing Graph Memory Sync subgraph for drift.' },
  { id: 'd3', agent: AGENTS[0], badge: 'green', age: '3m', text: 'Reviewing Prompt to Production subgraph for drift.' },
  { id: 'd4', agent: AGENTS[3], badge: 'cyan', age: '5m', text: 'Synced retry window for prod-3 heartbeat.' },
]

export interface DecisionEntry {
  id: string
  agent: Agent
  badge: 'amber' | 'red' | 'green' | 'cyan'
  kind: string
  text: string
}

export const DECISION_STREAM: DecisionEntry[] = [
  { id: 'd1', agent: AGENTS[3], badge: 'amber', kind: 'GRAPH MUTATION', text: 'OpenClaw touched "Claude Code" on the graph.' },
  { id: 'd2', agent: AGENTS[0], badge: 'green', kind: 'GRAPH MUTATION', text: 'Hermes Agent touched "Connector Sweep" on the graph.' },
  { id: 'd3', agent: AGENTS[2], badge: 'amber', kind: 'GRAPH MUTATION', text: 'OpenCode touched "Workspace Redesign" on the graph.' },
]

export interface Alert {
  id: string
  type: 'critical' | 'warning' | 'info' | 'success'
  title: string
  subtitle: string
  owner: Agent
  status: 'Assigned' | 'Open' | 'Resolved'
  age: string
  dot: 'red' | 'amber' | 'green' | 'cyan'
  sequence: number
}

export const ALERTS: Alert[] = [
  { id: 'a1', type: 'critical', title: 'OpenClaw connector drift assigned', subtitle: 'Cloud connector heartbeat missed 3 windows.', owner: AGENTS[3], status: 'Assigned', age: 'now', dot: 'red', sequence: 6 },
  { id: 'a2', type: 'warning', title: 'Claude token spend spike acknowledged', subtitle: 'Architecture review exceeded token budget.', owner: AGENTS[1], status: 'Assigned', age: '9m', dot: 'amber', sequence: 5 },
  { id: 'a3', type: 'warning', title: 'OpenCode review queue opened', subtitle: 'Five diffs awaiting architecture review.', owner: AGENTS[2], status: 'Open', age: '14m', dot: 'amber', sequence: 4 },
  { id: 'a4', type: 'info', title: 'Hermes graph community split resolved', subtitle: 'Engineering and orchestration communities separated cleanly.', owner: AGENTS[0], status: 'Resolved', age: '24m', dot: 'green', sequence: 3 },
  { id: 'a5', type: 'success', title: 'Launch sprint rollup completed', subtitle: '5 goals updated, 1 blocker escalated.', owner: AGENTS[0], status: 'Resolved', age: '38m', dot: 'green', sequence: 2 },
  { id: 'a6', type: 'info', title: 'Connector sweep retry policy updated', subtitle: '3 windows escalated, retry extended.', owner: AGENTS[3], status: 'Resolved', age: '54m', dot: 'cyan', sequence: 1 },
]

export interface IncidentTrend {
  label: string
  count: number
  pct: number
  color: string
}

export const INCIDENT_TRENDS: IncidentTrend[] = [
  { label: 'Critical', count: 3, pct: 75, color: '#ff4d6d' },
  { label: 'Warning', count: 5, pct: 55, color: '#ffb347' },
  { label: 'Info', count: 7, pct: 40, color: '#00e5ff' },
  { label: 'Resolved', count: 12, pct: 90, color: '#22d97a' },
]

export interface ResolutionEntry {
  title: string
  owner: string
  resolution: string
  age: string
}

export const RESOLUTIONS: ResolutionEntry[] = [
  { title: 'Graphify community split', owner: 'hermes', resolution: 'resolved with community re-cluster', age: '21m' },
  { title: 'Launch sprint rollup blocker', owner: 'hermes', resolution: 'resolved with goal linkage', age: '34m' },
  { title: 'Build process timeout', owner: 'claude', resolution: 'resolved by process cleanup', age: '1h' },
  { title: 'Memory duplicate writes', owner: 'hermes', resolution: 'resolved by source hash', age: '2h' },
]

export interface LogEntry {
  id: string
  time: string
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
  source: string
  sourceColor: AgentColor
  message: string
}

export const LOGS: LogEntry[] = [
  { id: 'l1', time: '16:46', level: 'INFO', source: 'hermes', sourceColor: 'purple', message: 'Routed redesign request to Claude Code' },
  { id: 'l2', time: '16:44', level: 'INFO', source: 'claude', sourceColor: 'red', message: 'Started graph visual brain review' },
  { id: 'l3', time: '16:41', level: 'ERROR', source: 'openclaw', sourceColor: 'cyan', message: 'Connector heartbeat drift exceeded retry threshold' },
  { id: 'l4', time: '16:28', level: 'DEBUG', source: 'opencode', sourceColor: 'amber', message: 'Compacting dashboard panel density' },
  { id: 'l5', time: '16:22', level: 'INFO', source: 'system', sourceColor: 'amber', message: 'Graph grew by 11 nodes and 18 relationships' },
  { id: 'l6', time: '16:19', level: 'INFO', source: 'dev', sourceColor: 'cyan', message: 'TypeScript build passed after model update' },
  { id: 'l7', time: '16:15', level: 'WARN', source: 'opencode', sourceColor: 'amber', message: 'Memory write conflict detected on node PRD' },
  { id: 'l8', time: '16:08', level: 'INFO', source: 'hermes', sourceColor: 'purple', message: 'Workflow Graph Memory Sync completed run #421' },
  { id: 'l9', time: '15:55', level: 'ERROR', source: 'openclaw', sourceColor: 'cyan', message: 'Telegram bridge retry failed after 3 attempts' },
  { id: 'l10', time: '15:40', level: 'INFO', source: 'claude', sourceColor: 'red', message: 'Code Change Verification workflow step completed' },
  { id: 'l11', time: '15:32', level: 'DEBUG', source: 'hermes', sourceColor: 'purple', message: 'Clustering graph communities' },
  { id: 'l12', time: '15:21', level: 'INFO', source: 'system', sourceColor: 'amber', message: 'Scheduler fired daily digest cron' },
]

export interface Integration {
  id: string
  name: string
  description: string
  status: 'connected'
  icon: string
  iconColor: string
}

export const INTEGRATIONS: Integration[] = [
  { id: 'discord', name: 'Discord', description: 'Operator chat channel.', status: 'connected', icon: '◆', iconColor: '#5865f2' },
  { id: 'telegram', name: 'Telegram', description: 'Operator chat channel.', status: 'connected', icon: '➤', iconColor: '#2ca5e0' },
  { id: 'ollama', name: 'Ollama', description: 'Local LLM runtime.', status: 'connected', icon: '⬢', iconColor: '#00e5ff' },
  { id: 'claude-code', name: 'Claude Code', description: 'Engineering agent.', status: 'connected', icon: '⌘', iconColor: '#ff4d6d' },
  { id: 'opencode', name: 'OpenCode', description: 'Implementation lane.', status: 'connected', icon: '⌥', iconColor: '#ffb347' },
  { id: 'openclaw', name: 'OpenClaw', description: 'Cloud execution surface.', status: 'connected', icon: '☁', iconColor: '#7c6cf5' },
  { id: 'graphify-cli', name: 'Graphify CLI', description: 'Knowledge graph extractor.', status: 'connected', icon: '◉', iconColor: '#f06292' },
]

export interface OperatorChannel {
  label: string
  value: string
  tone: 'cyan' | 'green'
}

export const OPERATOR_CHANNELS: OperatorChannel[] = [
  { label: 'DISCORD', value: 'loopr hermes', tone: 'cyan' },
  { label: 'TELEGRAM', value: '1599829884', tone: 'cyan' },
  { label: 'SCHEDULER', value: 'cron · live', tone: 'green' },
]

export interface Tool {
  id: string
  name: string
  description: string
  version: string
  status: 'enabled' | 'idle'
  icon: string
  iconColor: string
}

export const TOOLS: Tool[] = [
  { id: 'ollama', name: 'Ollama runtime', description: 'Local LLM execution lane.', version: '0.4.3', status: 'enabled', icon: '⬢', iconColor: '#00e5ff' },
  { id: 'graphify-cli', name: 'Graphify CLI', description: 'Knowledge graph extractor.', version: '1.0', status: 'enabled', icon: '◉', iconColor: '#f06292' },
  { id: 'claude-code', name: 'Claude Code CLI', description: 'Deep engineering agent.', version: '1.4.7', status: 'enabled', icon: '⌘', iconColor: '#ff4d6d' },
  { id: 'opencode', name: 'OpenCode', description: 'Fast implementation lane.', version: '0.9.1', status: 'enabled', icon: '⌥', iconColor: '#ffb347' },
  { id: 'openclaw', name: 'OpenClaw', description: 'Cloud execution surface.', version: '1.2.1', status: 'enabled', icon: '☁', iconColor: '#7c6cf5' },
  { id: 'telegram', name: 'Telegram bridge', description: 'Operator chat transport.', version: '0.1', status: 'enabled', icon: '➤', iconColor: '#2ca5e0' },
  { id: 'discord', name: 'Discord bridge', description: 'Operator chat transport.', version: '0.5.2', status: 'enabled', icon: '◆', iconColor: '#5865f2' },
  { id: 'graphify-update', name: 'Graphify update', description: 'Re-extract code graph.', version: '1.0.1', status: 'enabled', icon: '↻', iconColor: '#22d97a' },
]

export interface Capability {
  label: string
  value: string
  status: 'ready' | 'busy'
  statusColor: 'green' | 'amber'
}

export const CAPABILITIES: Capability[] = [
  { label: 'LOCAL LLM', value: 'minimax-m3:cloud', status: 'ready', statusColor: 'green' },
  { label: 'API KEYS', value: '6 active', status: 'ready', statusColor: 'green' },
  { label: 'GRAPHIFY', value: 'extracting', status: 'busy', statusColor: 'amber' },
]

export interface SettingRow {
  label: string
  value: string
  tone: 'cyan' | 'green' | 'dim' | 'default'
}

export const RUNTIME_SETTINGS: SettingRow[] = [
  { label: 'Default LLM model', value: 'minimax-m3:cloud', tone: 'cyan' },
  { label: 'Memory backend', value: 'Graphify · local', tone: 'dim' },
  { label: 'Scheduler', value: 'cron · live', tone: 'green' },
  { label: 'Version', value: 'AgentOS v3.1', tone: 'dim' },
]

export const OPERATOR_SETTINGS: SettingRow[] = [
  { label: 'Name', value: 'Alex Operator', tone: 'dim' },
  { label: 'Role', value: 'System conductor', tone: 'dim' },
  { label: 'Discord channel', value: 'loopr hermes', tone: 'cyan' },
  { label: 'Telegram ID', value: '1599829884', tone: 'cyan' },
]

export interface ExecutionHistory {
  n: number
  ok: boolean
  note?: string
}

export const EXECUTION_HISTORY: ExecutionHistory[] = [
  { n: 128, ok: true },
  { n: 127, ok: true },
  { n: 126, ok: false, note: 'failed at connector retry' },
  { n: 125, ok: true },
  { n: 124, ok: true },
  { n: 123, ok: true },
  { n: 122, ok: true },
  { n: 121, ok: false, note: 'failed at connector retry' },
  { n: 120, ok: true },
]

export interface McNode {
  x: number
  y: number
  label: string
  color: string
}

export const MC_NODES: McNode[] = [
  { x: 0.5, y: 0.35, label: 'AgentOS', color: '#7c6cf5' },
  { x: 0.2, y: 0.25, label: 'Hermes', color: '#7c6cf5' },
  { x: 0.75, y: 0.2, label: 'Claude Code', color: '#ff4d6d' },
  { x: 0.35, y: 0.65, label: 'OpenCode', color: '#ffb347' },
  { x: 0.7, y: 0.65, label: 'OpenClaw', color: '#00e5ff' },
  { x: 0.1, y: 0.6, label: 'Graph Memory', color: 'rgba(255,255,255,0.19)' },
  { x: 0.55, y: 0.8, label: 'Prompt→Prod', color: 'rgba(255,255,255,0.15)' },
  { x: 0.9, y: 0.45, label: 'Workspace', color: 'rgba(255,255,255,0.13)' },
]

export const MC_EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [1, 4], [2, 3], [3, 4], [1, 5], [3, 6], [2, 7],
]

export interface WfStep {
  x: number
  y: number
  label: string
  sub: string
  color: string
}

export const WF_STEPS: WfStep[] = [
  { x: 0.5, y: 0.2, label: 'STEP 4', sub: 'Hermes verifies', color: '#7c6cf5' },
  { x: 0.25, y: 0.5, label: 'STEP 3', sub: 'OpenCode impl.', color: '#ffb347' },
  { x: 0.75, y: 0.5, label: 'STEP 1', sub: 'Hermes routes', color: '#7c6cf5' },
  { x: 0.5, y: 0.95, label: 'STEP 2', sub: 'Claude plans', color: '#ff4d6d' },
  { x: 0.5, y: 0.72, label: 'STEP 5', sub: 'OpenClaw deploys', color: '#00e5ff' },
]

export const WF_FLOW: [number, number][] = [
  [2, 0], [0, 1], [1, 4], [2, 3], [3, 4],
]

export interface GfNode {
  x: number
  y: number
  label: string
  color: string
  r: number
  comm: number
}

export const GF_NODES: GfNode[] = [
  { x: 0.5, y: 0.45, label: 'AgentOS', color: '#7c6cf5', r: 22, comm: 0 },
  { x: 0.38, y: 0.35, label: 'Hermes', color: '#7c6cf5', r: 16, comm: 0 },
  { x: 0.62, y: 0.35, label: 'System Mem', color: '#7c6cf5', r: 14, comm: 0 },
  { x: 0.55, y: 0.58, label: 'Affiliate Pr.', color: '#7c6cf5', r: 12, comm: 0 },
  { x: 0.52, y: 0.72, label: 'Prompt→Pr.', color: '#7c6cf5', r: 10, comm: 0 },
  { x: 0.3, y: 0.6, label: 'Cloud Mem', color: '#00e5ff', r: 16, comm: 1 },
  { x: 0.18, y: 0.38, label: 'ResolvConn.', color: '#ff4d6d', r: 14, comm: 1 },
  { x: 0.2, y: 0.52, label: 'ConnDrift', color: '#ff4d6d', r: 13, comm: 1 },
  { x: 0.15, y: 0.65, label: 'ConnHlthSw.', color: '#00e5ff', r: 12, comm: 1 },
  { x: 0.38, y: 0.72, label: 'OpenClaw', color: '#00e5ff', r: 14, comm: 1 },
  { x: 0.55, y: 0.82, label: 'LaunchMem', color: '#ffb347', r: 12, comm: 2 },
  { x: 0.38, y: 0.85, label: 'agentOS-ui', color: '#ffb347', r: 11, comm: 2 },
  { x: 0.25, y: 0.82, label: 'Op.UI', color: '#ffb347', r: 12, comm: 2 },
  { x: 0.48, y: 0.9, label: 'WorkspRe.', color: '#ffb347', r: 11, comm: 2 },
  { x: 0.7, y: 0.8, label: 'OpenCode', color: '#ffb347', r: 14, comm: 2 },
]

export const GF_EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [1, 9], [5, 6], [6, 7], [7, 8], [8, 9], [3, 10], [10, 11], [11, 12], [12, 13], [14, 13],
]

export interface NavLink {
  id: string
  label: string
  icon?: string
  badge?: string
  badgeColor?: string
  group?: 'self' | 'agent' | 'org' | 'security' | 'observability' | 'automation'
  status?: 'green' | 'amber' | 'red' | 'gray'
}

export const NAV_LINKS: NavLink[] = [
  { id: 'mission', label: 'Machine Control', icon: '◎', group: 'self' },
  { id: 'goals', label: 'Goals', icon: '◈', group: 'self' },
  { id: 'memory', label: 'Memory', icon: '◉', group: 'self', badge: 'cyan' },
  { id: 'workflow', label: 'Workflow Ops', icon: '⌘', group: 'self' },
  { id: 'graphify', label: 'Graphify', icon: '◬', group: 'self' },
  { id: 'analytics', label: 'Analytics', icon: '∿', group: 'self' },
  { id: 'alerts', label: 'Alerts', icon: '⚠', group: 'self', badge: 'amber' },
  { id: 'logs', label: 'Logs', icon: '☰', group: 'self' },
  { id: 'integrations', label: 'Integrations', icon: '⊕', group: 'self' },
  { id: 'tools', label: 'Tools', icon: '✦', group: 'self' },
  { id: 'settings', label: 'Settings', icon: '⚙', group: 'self' },
  { id: 'fleet', label: 'Hermes', icon: 'H', group: 'agent', status: 'green' },
  { id: 'claude', label: 'Claude', icon: 'C', group: 'agent', status: 'green' },
  { id: 'opencode', label: 'OpenCode', icon: 'O', group: 'agent', status: 'amber' },
  { id: 'openclaw', label: 'OpenClaw', icon: 'X', group: 'agent', status: 'red' },
  { id: 'gemini', label: 'Gemini', icon: 'G', group: 'agent', status: 'gray' },
  { id: 'org', label: 'Organization', icon: '◈', group: 'org' },
  { id: 'security', label: 'Security', icon: '🛡', group: 'security' },
  { id: 'observability', label: 'Observability', icon: '📊', group: 'observability' },
  { id: 'automation', label: 'Automation', icon: '🔄', group: 'automation' },
]

export type PageId = NavLink['id']