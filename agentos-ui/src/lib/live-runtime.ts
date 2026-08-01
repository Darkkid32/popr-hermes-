import { isConfigured, readEnv } from './services/config'
import { fetchAgents, subscribeAgentRegistry, subscribeAgentState, type Agent } from './services/agent-registry'
import {
  fetchGraph,
  subscribeGraphSnapshot,
  subscribeGraphMutations,
  type GraphMutation,
} from './services/graph'
import { subscribeWorkflowList, subscribeWorkflowEvents, fetchWorkflows, type WorkflowEvent } from './services/workflow'
import { subscribeActivity, type ActivityItem } from './services/activity'
import { subscribeConversations, type ConversationTurn } from './services/conversations'
import { subscribeHandoffs, type Handoff } from './services/handoffs'
import { subscribeAlerts } from './services/alerts'
import { subscribeLogs, type LogEntry } from './services/logs'
import { subscribeIntegrations } from './services/integrations'
import { useGraphStore } from './graph-store'

let started = false
const attachedAgentStates = new Set<string>()
const attachedWorkflowStreams = new Set<string>()

function attachAgentState(agentId: string): void {
  if (attachedAgentStates.has(agentId)) return
  attachedAgentStates.add(agentId)
  subscribeAgentState(agentId, (state) => {
    const cur = useGraphStore.getState().agents
    const next = cur.map((a) =>
      a.id === state.agentId
        ? {
            ...a,
            currentGoal: state.currentGoal ?? a.currentGoal,
            currentWorkflow: state.currentWorkflow ?? a.currentWorkflow,
            currentAction: state.currentAction ?? a.currentAction,
            ts: state.ts,
          }
        : a,
    )
    useGraphStore.getState().setAgents(next)
  })
}

function attachWorkflowEvents(workflowId: string): void {
  if (attachedWorkflowStreams.has(workflowId)) return
  attachedWorkflowStreams.add(workflowId)
  subscribeWorkflowEvents(workflowId, (we: WorkflowEvent) => {
    useGraphStore.getState().pushActivity({
      id: `wf-${we.ts}-${we.workflowId}-${Math.random().toString(36).slice(2, 6)}`,
      ts: we.ts,
      kind: 'workflow_step',
      workflowId: we.workflowId,
      summary: we.message ?? `Workflow ${we.workflowId} ${we.status ?? 'update'}`,
    })
  })
}

export function startLiveRuntime(): boolean {
  if (started) return false
  if (!isConfigured()) return false
  started = true

  const env = readEnv()

  // Initial snapshots
  void fetchAgents(fetch, env.apiUrl)
    .then((agents) => {
      useGraphStore.getState().setAgents(agents)
      agents.forEach((a) => attachAgentState(a.id))
    })
    .catch(() => undefined)

  void fetchGraph(fetch, env.apiUrl)
    .then((snapshot) => useGraphStore.getState().setGraph(snapshot.nodes, snapshot.edges))
    .catch(() => undefined)

  void fetchWorkflows(fetch, env.apiUrl)
    .then((workflows) => {
      workflows.forEach((w) => attachWorkflowEvents(w.id))
    })
    .catch(() => undefined)

  // Agent registry
  subscribeAgentRegistry((event) => {
    if (event.type === 'snapshot') {
      void fetchAgents(fetch, env.apiUrl)
        .then((agents) => {
          useGraphStore.getState().setAgents(agents)
          agents.forEach((a) => attachAgentState(a.id))
        })
        .catch(() => undefined)
    } else if (event.type === 'upsert' && event.agent) {
      const agent = event.agent
      attachAgentState(agent.id)
      const cur = useGraphStore.getState().agents
      const exists = cur.some((a: Agent) => a.id === agent.id)
      const next = exists
        ? cur.map((a: Agent) => (a.id === agent.id ? { ...a, ...agent } : a))
        : [...cur, agent]
      useGraphStore.getState().setAgents(next)
    }
  })

  // Graph snapshots + mutations
  subscribeGraphSnapshot((snapshot) => {
    useGraphStore.getState().setGraph(snapshot.nodes, snapshot.edges)
  })
  subscribeGraphMutations((mutation: GraphMutation) => {
    if (mutation.kind === 'node.upsert' && mutation.node) {
      const cur = useGraphStore.getState().nodes
      const exists = cur.some((n) => n.id === mutation.node?.id)
      const next = exists
        ? cur.map((n) => (n.id === mutation.node?.id ? { ...n, ...mutation.node } : n))
        : [...cur, mutation.node]
      useGraphStore.setState({ nodes: next })
    } else if (mutation.kind === 'node.delete' && mutation.nodeId) {
      const cur = useGraphStore.getState().nodes
      useGraphStore.setState({ nodes: cur.filter((n) => n.id !== mutation.nodeId) })
    } else if (mutation.kind === 'edge.upsert' && mutation.edge) {
      const cur = useGraphStore.getState().edges
      const exists = cur.some((e) => e.id === mutation.edge?.id)
      const next = exists
        ? cur.map((e) => (e.id === mutation.edge?.id ? { ...e, ...mutation.edge } : e))
        : [...cur, mutation.edge]
      useGraphStore.setState({ edges: next })
    } else if (mutation.kind === 'edge.delete' && mutation.edgeId) {
      const cur = useGraphStore.getState().edges
      useGraphStore.setState({ edges: cur.filter((e) => e.id !== mutation.edgeId) })
    }
    if (mutation.source) {
      const summary =
        mutation.kind === 'node.upsert' && mutation.node
          ? `Graph node "${mutation.node.label}" upserted`
          : mutation.kind === 'edge.upsert' && mutation.edge
          ? `Edge "${mutation.edge.label}" added`
          : mutation.kind === 'node.delete'
          ? `Graph node "${mutation.nodeId}" removed`
          : `Graph edge "${mutation.edgeId}" removed`
      useGraphStore.getState().pushActivity({
        id: `mutation-${mutation.ts}-${Math.random().toString(36).slice(2, 6)}`,
        ts: mutation.ts,
        kind: 'graph_mutation',
        summary,
        source: mutation.source,
      })
    }
  })

  // Workflows
  subscribeWorkflowList((event) => {
    if (event.type === 'snapshot') {
      void fetchWorkflows(fetch, env.apiUrl)
        .then((workflows) => {
          workflows.forEach((w) => attachWorkflowEvents(w.id))
        })
        .catch(() => undefined)
    } else if (event.type === 'upsert' && event.workflow) {
      attachWorkflowEvents(event.workflow.id)
    }
  })

  // Activity, conversations, handoffs
  subscribeActivity((item: ActivityItem) => {
    useGraphStore.getState().pushActivity(item)
  })
  subscribeConversations((turn: ConversationTurn) => {
    useGraphStore.getState().pushConversation(turn)
  })
  subscribeHandoffs((h: Handoff) => {
    useGraphStore.getState().pushHandoff(h)
    useGraphStore.getState().pushActivity({
      id: `handoff-${h.id}`,
      ts: h.ts,
      kind: 'handoff',
      summary: `Handoff ${h.from} → ${h.to}: ${h.reason}`,
      source: h.from,
      target: h.to,
    })
  })

  // Alerts mirror into activity bus
  subscribeAlerts((event) => {
    if (event.type === 'upsert' && event.alert) {
      useGraphStore.getState().pushActivity({
        id: `alert-${event.alert.id}`,
        ts: event.alert.ts,
        kind: 'alert',
        summary: `${event.alert.title}: ${event.alert.subtitle}`,
        source: event.alert.source,
        target: event.alert.owner,
      })
    }
  })

  // Logs mirror into activity bus
  subscribeLogs((entry: LogEntry) => {
    useGraphStore.getState().pushActivity({
      id: `log-${entry.id}`,
      ts: entry.ts,
      kind: 'decision',
      agentId: entry.agentId,
      summary: `${entry.source}: ${entry.message}`,
      source: entry.source,
    })
  })

  // Integrations mirror into activity
  subscribeIntegrations((integration) => {
    useGraphStore.getState().pushActivity({
      id: `integration-${integration.id}-${integration.ts}`,
      ts: integration.ts,
      kind: 'knowledge',
      summary: `Integration "${integration.name}" → ${integration.status}`,
      source: integration.id,
    })
  })

  return true
}