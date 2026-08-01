import { create } from 'zustand'
import type { Agent } from './services/agent-registry'
import type { GraphEdge, GraphNode } from './services/graph'
import type { ConversationTurn } from './services/conversations'
import type { Handoff } from './services/handoffs'
import type { ActivityItem } from './services/activity'
import { CORE_AGENTS, RELATIONSHIPS } from './agents'

export type { ActivityItem } from './services/activity'
export type { ConversationTurn } from './services/conversations'
export type { Handoff } from './services/handoffs'

interface GraphStoreState {
  agents: Agent[]
  nodes: GraphNode[]
  edges: GraphEdge[]
  activity: ActivityItem[]
  conversations: ConversationTurn[]
  handoffs: Handoff[]
  selectedNodeId: string

  setAgents: (agents: Agent[]) => void
  setGraph: (nodes: GraphNode[], edges: GraphEdge[]) => void
  pushActivity: (a: ActivityItem) => void
  pushConversation: (t: ConversationTurn) => void
  pushHandoff: (h: Handoff) => void
  selectNode: (id: string) => void
  mutateNode: (id: string, patch: Partial<GraphNode>) => void
  clear: () => void
}

const MAX_ACTIVITY = 200
const MAX_CONVERSATIONS = 200
const MAX_HANDOFFS = 100

function seedAgentNodes(): GraphNode[] {
  return CORE_AGENTS.map((agent, index) => ({
    id: `agent-${agent.id}`,
    label: agent.name,
    type: 'agent',
    community: index,
    incoming: 0,
    outgoing: 0,
    weight: 1,
    color: agent.color,
    summary: agent.role,
  }))
}

function seedAgentEdges(): GraphEdge[] {
  return RELATIONSHIPS.map((rel, index) => ({
    id: `rel-${rel.from}-${rel.to}-${index}`,
    source: `agent-${rel.from}`,
    target: `agent-${rel.to}`,
    label: rel.label,
    weight: 1,
    type: 'relationship',
  }))
}

export const useGraphStore = create<GraphStoreState>((set) => ({
  agents: CORE_AGENTS,
  nodes: seedAgentNodes(),
  edges: seedAgentEdges(),
  activity: [],
  conversations: [],
  handoffs: [],
  selectedNodeId: 'agent-hermes',

  setAgents: (incoming) =>
    set((s) => {
      const merged = s.agents.map((existing) => {
        const live = incoming.find((a) => a.id === existing.id)
        if (!live) return existing
        return { ...existing, ...live, id: existing.id }
      })
      incoming.forEach((live) => {
        if (!merged.some((a) => a.id === live.id)) merged.push(live)
      })
      return { agents: merged }
    }),

  setGraph: (nodes, edges) => set({ nodes, edges }),

  pushActivity: (a) =>
    set((s) => ({ activity: [a, ...s.activity].slice(0, MAX_ACTIVITY) })),

  pushConversation: (t) =>
    set((s) => ({ conversations: [...s.conversations, t].slice(-MAX_CONVERSATIONS) })),

  pushHandoff: (h) =>
    set((s) => ({ handoffs: [h, ...s.handoffs].slice(0, MAX_HANDOFFS) })),

  selectNode: (id) => set({ selectedNodeId: id }),

  mutateNode: (id, patch) =>
    set((s) => ({
      nodes: s.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    })),

  clear: () =>
    set({
      agents: CORE_AGENTS,
      nodes: seedAgentNodes(),
      edges: seedAgentEdges(),
      activity: [],
      conversations: [],
      handoffs: [],
      selectedNodeId: 'agent-hermes',
    }),
}))