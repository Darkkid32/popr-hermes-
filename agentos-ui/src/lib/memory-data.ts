import type { NavLink } from './demo-data'

export interface MemoryNote {
  id: string
  title: string
  content: string
  tags: string[]
  links: string[]
  source: 'obsidian' | 'omi' | 'manual' | 'imported'
  created: string
  modified: string
  size: number
  wordCount: number
  graphNodes: number
  graphEdges: number
}

export const MEMORY_NOTES: MemoryNote[] = [
  {
    id: 'note-1',
    title: 'Hermes v2 — Desktop Runtime Architecture',
    content: 'Full architecture spec for Hermes v2 desktop runtime. Covers agent orchestration, local LLM integration, memory layer, and plugin system.',
    tags: ['hermes', 'build', 'architecture'],
    links: ['note-2', 'note-5', 'note-12'],
    source: 'obsidian',
    created: '2026-07-15',
    modified: '2026-07-30',
    size: 12400,
    wordCount: 2100,
    graphNodes: 8,
    graphEdges: 14,
  },
  {
    id: 'note-2',
    title: 'Graphify Community Detection — Louvain vs Leiden',
    content: 'Comparison of community detection algorithms for the knowledge graph. Louvain is faster but Leiden produces better quality communities.',
    tags: ['graph', 'research', 'algorithms'],
    links: ['note-1', 'note-6'],
    source: 'obsidian',
    created: '2026-07-10',
    modified: '2026-07-28',
    size: 8900,
    wordCount: 1500,
    graphNodes: 6,
    graphEdges: 11,
  },
  {
    id: 'note-3',
    title: 'OpenClaw Connector Retry Policy',
    content: 'Retry policy for OpenClaw cloud connectors. Exponential backoff with jitter, max 3 retries, dead letter queue after exhaustion.',
    tags: ['openclaw', 'ops', 'reliability'],
    links: ['note-7', 'note-14'],
    source: 'obsidian',
    created: '2026-07-05',
    modified: '2026-07-25',
    size: 4200,
    wordCount: 800,
    graphNodes: 4,
    graphEdges: 6,
  },
  {
    id: 'note-4',
    title: 'Vault Compression Strategy — IndexedDB Partitioning',
    content: 'Strategy for compressing and partitioning the Obsidian vault in IndexedDB. Uses LZ4 compression with chunked storage.',
    tags: ['vault', 'build', 'performance'],
    links: ['note-1', 'note-8'],
    source: 'obsidian',
    created: '2026-06-28',
    modified: '2026-07-20',
    size: 15600,
    wordCount: 2800,
    graphNodes: 10,
    graphEdges: 18,
  },
  {
    id: 'note-5',
    title: 'Omi Transcript Cleanup — Heuristic Rules',
    content: 'Heuristic rules for cleaning Omi voice transcripts. Removes filler words, fixes punctuation, segments by speaker.',
    tags: ['omi', 'ml', 'nlp'],
    links: ['note-9'],
    source: 'omi',
    created: '2026-07-01',
    modified: '2026-07-18',
    size: 6700,
    wordCount: 1200,
    graphNodes: 5,
    graphEdges: 8,
  },
  {
    id: 'note-6',
    title: 'Self · Goals Q3 Planning',
    content: 'Q3 2026 goals planning document. Covers Build, Ship, Growth, and Distribution tracks with specific milestones.',
    tags: ['self', 'plan', 'goals'],
    links: ['note-10', 'note-11'],
    source: 'manual',
    created: '2026-07-01',
    modified: '2026-07-29',
    size: 9800,
    wordCount: 1800,
    graphNodes: 7,
    graphEdges: 12,
  },
  {
    id: 'note-7',
    title: 'AgentOS v10 Launch Checklist',
    content: 'Complete launch checklist for AgentOS v10. Includes build verification, smoke tests, rollout plan, and monitoring setup.',
    tags: ['build', 'ship', 'launch'],
    links: ['note-1', 'note-12'],
    source: 'manual',
    created: '2026-07-20',
    modified: '2026-07-31',
    size: 11200,
    wordCount: 2000,
    graphNodes: 9,
    graphEdges: 15,
  },
  {
    id: 'note-8',
    title: 'Graphify CLI — Extraction Pipeline',
    content: 'Documentation for the Graphify CLI extraction pipeline. Covers source parsing, entity extraction, relationship inference, and graph mutation.',
    tags: ['graphify', 'build', 'cli'],
    links: ['note-2', 'note-4'],
    source: 'obsidian',
    created: '2026-06-15',
    modified: '2026-07-10',
    size: 18400,
    wordCount: 3200,
    graphNodes: 12,
    graphEdges: 22,
  },
  {
    id: 'note-9',
    title: 'Omi Capture — Session Notes',
    content: 'Raw Omi capture sessions. Auto-transcribed and linked to relevant project notes.',
    tags: ['omi', 'captures'],
    links: ['note-5'],
    source: 'omi',
    created: '2026-07-25',
    modified: '2026-07-25',
    size: 3400,
    wordCount: 600,
    graphNodes: 3,
    graphEdges: 4,
  },
  {
    id: 'note-10',
    title: 'Affiliate Program — Technical Spec',
    content: 'Technical specification for the affiliate program. Tracking, attribution, payouts, and dashboard integration.',
    tags: ['growth', 'build', 'affiliate'],
    links: ['note-6', 'note-11'],
    source: 'manual',
    created: '2026-07-12',
    modified: '2026-07-22',
    size: 7800,
    wordCount: 1400,
    graphNodes: 6,
    graphEdges: 9,
  },
  {
    id: 'note-11',
    title: 'Distribution Strategy — Content & Channels',
    content: 'Content distribution strategy across channels. Blog, Twitter, YouTube, newsletter, and community platforms.',
    tags: ['distribution', 'growth', 'content'],
    links: ['note-6', 'note-10'],
    source: 'manual',
    created: '2026-07-08',
    modified: '2026-07-18',
    size: 5600,
    wordCount: 1100,
    graphNodes: 5,
    graphEdges: 7,
  },
  {
    id: 'note-12',
    title: 'Hermes Skills System — Design Doc',
    content: 'Design document for the Hermes skills system. Skill manifest, execution sandbox, versioning, and marketplace.',
    tags: ['hermes', 'skills', 'design'],
    links: ['note-1', 'note-7'],
    source: 'obsidian',
    created: '2026-07-18',
    modified: '2026-07-27',
    size: 14200,
    wordCount: 2500,
    graphNodes: 11,
    graphEdges: 19,
  },
  {
    id: 'note-13',
    title: 'MCP Server Registry — Connected Servers',
    content: 'Registry of connected MCP servers. Capabilities, health status, and usage metrics.',
    tags: ['mcp', 'integrations', 'registry'],
    links: ['note-14'],
    source: 'imported',
    created: '2026-07-22',
    modified: '2026-07-22',
    size: 4800,
    wordCount: 900,
    graphNodes: 4,
    graphEdges: 5,
  },
  {
    id: 'note-14',
    title: 'Plugin Manifest Schema v2',
    content: 'Updated plugin manifest schema with new capability declarations, dependency resolution, and security sandbox.',
    tags: ['plugins', 'design', 'schema'],
    links: ['note-3', 'note-13'],
    source: 'obsidian',
    created: '2026-07-14',
    modified: '2026-07-24',
    size: 9200,
    wordCount: 1600,
    graphNodes: 7,
    graphEdges: 10,
  },
]

export interface MemorySource {
  id: string
  name: string
  type: 'obsidian' | 'omi' | 'manual' | 'imported' | 'api'
  status: 'connected' | 'disconnected' | 'syncing' | 'error'
  notesCount: number
  lastSync: string
  config: Record<string, any>
}

export const MEMORY_SOURCES: MemorySource[] = [
  { id: 'obsidian', name: 'Obsidian Vault', type: 'obsidian', status: 'connected', notesCount: 1261, lastSync: '4m ago', config: { path: '~/vault', autoSync: true } },
  { id: 'omi', name: 'Omi Captures', type: 'omi', status: 'connected', notesCount: 342, lastSync: '12m ago', config: { deviceId: 'omi-001', autoTranscribe: true } },
  { id: 'manual', name: 'Manual Entries', type: 'manual', status: 'connected', notesCount: 89, lastSync: 'just now', config: {} },
  { id: 'github', name: 'GitHub Imports', type: 'imported', status: 'connected', notesCount: 156, lastSync: '2h ago', config: { repos: ['hermes', 'agentos-ui'], autoImport: true } },
  { id: 'linear', name: 'Linear Issues', type: 'api', status: 'disconnected', notesCount: 0, lastSync: 'never', config: { apiKey: 'not configured' } },
  { id: 'notion', name: 'Notion Workspace', type: 'api', status: 'disconnected', notesCount: 0, lastSync: 'never', config: { apiKey: 'not configured' } },
  { id: 'readwise', name: 'Readwise Highlights', type: 'api', status: 'connected', notesCount: 234, lastSync: '6h ago', config: { apiKey: 'configured' } },
  { id: 'telegram', name: 'Telegram Saved Messages', type: 'api', status: 'connected', notesCount: 67, lastSync: '30m ago', config: { botToken: 'configured' } },
]

export interface GraphCommunity {
  id: number
  label: string
  color: string
  nodes: number
  edges: number
  centralNode: string
}

export const GRAPH_COMMUNITIES: GraphCommunity[] = [
  { id: 0, label: 'Agents', color: '#7c6cf5', nodes: 8, edges: 14, centralNode: 'Hermes' },
  { id: 1, label: 'Vault', color: '#00e5ff', nodes: 12, edges: 22, centralNode: 'Obsidian' },
  { id: 2, label: 'Goals', color: '#f06292', nodes: 6, edges: 10, centralNode: 'Q3 Planning' },
  { id: 3, label: 'Build', color: '#ffb347', nodes: 9, edges: 16, centralNode: 'AgentOS v10' },
  { id: 4, label: 'Operations', color: '#ff4d6d', nodes: 7, edges: 12, centralNode: 'OpenClaw' },
  { id: 5, label: 'Distribution', color: '#d946ef', nodes: 5, edges: 8, centralNode: 'Content Strategy' },
  { id: 6, label: 'Research', color: '#22d97a', nodes: 4, edges: 6, centralNode: 'Graphify' },
]

export interface MemoryStats {
  totalNotes: number
  totalLinks: number
  totalTags: number
  totalSources: number
  totalWords: number
  totalSize: string
  graphNodes: number
  graphEdges: number
  communities: number
  lastSync: string
}

export const MEMORY_STATS: MemoryStats = {
  totalNotes: 1261,
  totalLinks: 3408,
  totalTags: 142,
  totalSources: 8,
  totalWords: 2450000,
  totalSize: '47.2 MB',
  graphNodes: 1247,
  graphEdges: 3408,
  communities: 7,
  lastSync: '4m ago',
}

export const MEMORY_NAV_LINKS: NavLink[] = [
  { id: 'memory-recent', label: 'Recent', icon: '◴', group: 'self' },
  { id: 'memory-notes', label: 'Notes', icon: '◧', group: 'self' },
  { id: 'memory-omi', label: 'Omi', icon: '◉', group: 'self' },
  { id: 'memory-graph', label: 'Graph', icon: '◬', group: 'self' },
  { id: 'memory-sources', label: 'Sources', icon: '⊕', group: 'self' },
  { id: 'memory-settings', label: 'Settings', icon: '⚙', group: 'self' },
]