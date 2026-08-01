import { LiveSourceMissingError, isConfigured } from './config'
import { subscribe, send } from './ws'

export interface GraphNode {
  id: string
  label: string
  type: string
  color?: string
  community: number
  incoming: number
  outgoing: number
  weight: number
  x?: number
  y?: number
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

export interface GraphSnapshot {
  nodes: GraphNode[]
  edges: GraphEdge[]
  ts: number
}

export interface GraphMutation {
  kind: 'node.upsert' | 'node.delete' | 'edge.upsert' | 'edge.delete'
  node?: GraphNode
  edge?: GraphEdge
  nodeId?: string
  edgeId?: string
  ts: number
  source?: string
}

export const GRAPH_CHANNELS = {
  snapshot: 'graph.snapshot',
  mutations: 'graph.mutations',
} as const

export async function fetchGraph(
  fetchImpl: typeof fetch = fetch,
  apiBase: string = '',
): Promise<GraphSnapshot> {
  if (!isConfigured()) {
    throw new LiveSourceMissingError()
  }
  const url = `${apiBase}/api/v1/graph`
  const res = await fetchImpl(url)
  if (!res.ok) throw new Error(`graph fetch failed: ${res.status}`)
  const json = (await res.json()) as Partial<GraphSnapshot>
  if (!Array.isArray(json.nodes) || !Array.isArray(json.edges)) {
    return { nodes: [], edges: [], ts: Date.now() }
  }
  return {
    nodes: json.nodes.filter(isValidNode),
    edges: json.edges.filter(isValidEdge),
    ts: typeof json.ts === 'number' ? json.ts : Date.now(),
  }
}

function isValidNode(n: unknown): n is GraphNode {
  if (!n || typeof n !== 'object') return false
  const node = n as Partial<GraphNode>
  return (
    typeof node.id === 'string' &&
    typeof node.label === 'string' &&
    typeof node.type === 'string' &&
    typeof node.community === 'number' &&
    typeof node.incoming === 'number' &&
    typeof node.outgoing === 'number' &&
    typeof node.weight === 'number'
  )
}

function isValidEdge(e: unknown): e is GraphEdge {
  if (!e || typeof e !== 'object') return false
  const edge = e as Partial<GraphEdge>
  return (
    typeof edge.id === 'string' &&
    typeof edge.source === 'string' &&
    typeof edge.target === 'string' &&
    typeof edge.label === 'string' &&
    typeof edge.weight === 'number'
  )
}

export function subscribeGraphSnapshot(
  listener: (snapshot: GraphSnapshot) => void,
): () => void {
  if (!isConfigured()) {
    throw new LiveSourceMissingError()
  }
  return subscribe(GRAPH_CHANNELS.snapshot, (event) => {
    if (event.type !== 'graph.snapshot') return
    const payload = event.payload as Partial<GraphSnapshot> | undefined
    if (!payload || !Array.isArray(payload.nodes) || !Array.isArray(payload.edges)) return
    listener({
      nodes: payload.nodes.filter(isValidNode),
      edges: payload.edges.filter(isValidEdge),
      ts: typeof payload.ts === 'number' ? payload.ts : Date.now(),
    })
  })
}

export function subscribeGraphMutations(
  listener: (mutation: GraphMutation) => void,
): () => void {
  if (!isConfigured()) {
    throw new LiveSourceMissingError()
  }
  return subscribe(GRAPH_CHANNELS.mutations, (event) => {
    if (event.type !== 'graph.mutation') return
    const payload = event.payload as Partial<GraphMutation> | undefined
    if (!payload || typeof payload !== 'object') return
    if (typeof payload.kind !== 'string' || typeof payload.ts !== 'number') return
    listener(payload as GraphMutation)
  })
}

export function sendGraphMutation(mutation: GraphMutation): void {
  send({ type: 'graph.mutation', payload: mutation })
}