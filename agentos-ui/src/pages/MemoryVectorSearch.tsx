// Vector Search - Migrated to use shared AI components
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { MEMORY_SOURCES, MEMORY_STATS } from '../lib/memory-data'
import { VectorSearchPanel, type SearchResult, type DataSource } from '../design-system/components/specialized/VectorSearchPanel'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'

// Mock search function - in production this would call the vector search API
const mockSearch = (query: string, filters: any): SearchResult[] => {
  if (!query.trim()) return []
  
  // Return mock results based on memory notes
  const results: SearchResult[] = [
    {
      id: 'note-1',
      title: 'Hermes v2 — Desktop Runtime Architecture',
      content: 'Full architecture spec for Hermes v2 desktop runtime. Covers agent orchestration, local LLM integration, memory layer, and plugin system.',
      source: 'obsidian',
      score: 0.94,
      tags: ['hermes', 'build', 'architecture'],
      created: '2026-07-15',
      modified: '2026-07-30',
    },
    {
      id: 'note-2',
      title: 'Graphify Community Detection — Louvain vs Leiden',
      content: 'Comparison of community detection algorithms for the knowledge graph. Louvain is faster but Leiden produces better quality communities.',
      source: 'obsidian',
      score: 0.87,
      tags: ['graph', 'research', 'algorithms'],
      created: '2026-07-10',
      modified: '2026-07-28',
    },
    {
      id: 'note-5',
      title: 'Omi Transcript Cleanup — Heuristic Rules',
      content: 'Heuristic rules for cleaning Omi voice transcripts. Removes filler words, fixes punctuation, segments by speaker.',
      source: 'omi',
      score: 0.82,
      tags: ['omi', 'ml', 'nlp'],
      created: '2026-07-01',
      modified: '2026-07-18',
    },
    {
      id: 'note-6',
      title: 'Self · Goals Q3 Planning',
      content: 'Q3 2026 goals planning document. Covers Build, Ship, Growth, and Distribution tracks with specific milestones.',
      source: 'manual',
      score: 0.79,
      tags: ['self', 'plan', 'goals'],
      created: '2026-07-01',
      modified: '2026-07-29',
    },
    {
      id: 'note-13',
      title: 'MCP Server Registry — Connected Servers',
      content: 'Registry of connected MCP servers. Capabilities, health status, and usage metrics.',
      source: 'imported',
      score: 0.75,
      tags: ['mcp', 'integrations', 'registry'],
      created: '2026-07-22',
      modified: '2026-07-22',
    },
  ]
  
  return results.filter(r => {
    const matchesSource = filters.sources?.includes('all') || filters.sources?.includes(r.source)
    const matchesTag = filters.tags?.length === 0 || filters.tags?.some((t: string) => r.tags.includes(t))
    const matchesScore = r.score >= (filters.scoreThreshold || 0)
    return matchesSource && matchesTag && matchesScore
  })
}

const dataSources: DataSource[] = MEMORY_SOURCES.map(s => ({
  id: s.id,
  name: s.name,
  type: s.type,
  status: s.status,
  documentCount: s.notesCount,
  lastIndexed: s.lastSync,
}))

export function MemoryVectorSearch() {
  return (
    <div className="page-body">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
        <Badge variant="success" size="md" dot>{MEMORY_STATS.totalSources} sources</Badge>
        <Badge variant="info" size="md" dot>{dataSources.filter(s => s.status === 'connected').length} connected</Badge>
        <Badge variant="primary" size="md" dot>{MEMORY_STATS.totalNotes.toLocaleString()} documents</Badge>
        <Badge variant="default" size="md" dot>vector index ready</Badge>
      </div>

      <Card variant="elevated" style={{ padding: 'var(--spacing-4)' }}>
        <VectorSearchPanel
          onSearch={mockSearch}
          sources={dataSources}
          defaultFilters={{
            scoreThreshold: 0.7,
          }}
          placeholder="Search memories by meaning..."
          showFilters={true}
          showSources={true}
          showScoreThreshold={true}
          height={650}
          onResultSelect={(result) => {
            console.log('Selected result:', result)
          }}
        />
      </Card>
    </div>
  )
}