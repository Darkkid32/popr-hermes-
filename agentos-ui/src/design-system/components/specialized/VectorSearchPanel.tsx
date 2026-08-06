// VectorSearchPanel - Shared AI Component
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState, useMemo, type ChangeEvent } from 'react'
import { Card } from '../data-display/Card'
import { Badge } from '../data-display/Badge'
import { Button } from '../data-display/Button'
import { Input } from '../forms/Input'
import { Select } from '../forms/Select'
import { Table } from '../data-display/Table'

export interface SearchResult {
  id: string
  title: string
  content: string
  source: string
  score: number
  tags: string[]
  created: string
  modified: string
  metadata?: Record<string, any>
}

export interface DataSource {
  id: string
  name: string
  type: string
  status: 'connected' | 'disconnected' | 'syncing' | 'error'
  documentCount: number
  lastIndexed: string
}

export interface SearchFiltersProps {
  query?: string
  sources?: string[]
  tags?: string[]
  dateRange?: { start?: string; end?: string }
  scoreThreshold?: number
}

export interface VectorSearchPanelProps {
  onSearch: (query: string, filters: SearchFiltersProps) => SearchResult[]
  sources: DataSource[]
  defaultFilters?: SearchFiltersProps
  placeholder?: string
  showFilters?: boolean
  showSources?: boolean
  showScoreThreshold?: boolean
  height?: number
  onResultSelect?: (result: SearchResult) => void
}

export function VectorSearchPanel({
  onSearch,
  sources,
  defaultFilters = {},
  placeholder = 'Search memories...',
  showFilters = true,
  showSources = true,
  showScoreThreshold = true,
  height = 600,
  onResultSelect,
}: VectorSearchPanelProps) {
  const [query, setQuery] = useState(defaultFilters.query || '')
  const [filters, setFilters] = useState<SearchFiltersProps>({
    sources: defaultFilters.sources || ['all'],
    tags: defaultFilters.tags || [],
    dateRange: defaultFilters.dateRange || {},
    scoreThreshold: defaultFilters.scoreThreshold ?? 0.7,
  })
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'relevance'>('score')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const allTags = useMemo(() => {
    // In a real implementation, this would come from the data
    return ['hermes', 'build', 'architecture', 'graph', 'research', 'algorithms', 'openclaw', 'ops', 'reliability', 'vault', 'performance', 'self', 'plan', 'goals', 'ml', 'nlp']
  }, [])

  const handleSearch = async (searchQuery: string, searchFilters: SearchFiltersProps) => {
    setIsSearching(true)
    try {
      const searchResults = onSearch(searchQuery, searchFilters)
      setResults(searchResults)
    } finally {
      setIsSearching(false)
    }
  }

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    // Debounced search would go here
  }

  const handleFilterChange = (newFilters: SearchFiltersProps) => {
    setFilters(newFilters)
    handleSearch(query, newFilters)
  }

  const handleSourceToggle = (sourceId: string) => {
    const currentSources = filters.sources || ['all']
    const newSources = currentSources.includes('all')
      ? [sourceId]
      : currentSources.includes(sourceId)
        ? currentSources.filter(s => s !== sourceId)
        : [...currentSources, sourceId]
    handleFilterChange({ ...filters, sources: newSources.length === sources.length ? ['all'] : newSources })
  }

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || []
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag]
    handleFilterChange({ ...filters, tags: newTags })
  }

  const handleScoreThresholdChange = (value: number) => {
    handleFilterChange({ ...filters, scoreThreshold: value })
  }

  const handleDateRangeChange = (range: { start?: string; end?: string }) => {
    handleFilterChange({ ...filters, dateRange: range })
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(d => d === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(column as any)
      setSortDirection('desc')
    }
  }

  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => {
      let aVal: any, bVal: any
      switch (sortBy) {
        case 'score': aVal = a.score; bVal = b.score; break
        case 'date': aVal = new Date(a.modified).getTime(); bVal = new Date(b.modified).getTime(); break
        case 'relevance': aVal = a.score; bVal = b.score; break
      }
      if (aVal < bVal) return sortDirection === 'desc' ? 1 : -1
      if (aVal > bVal) return sortDirection === 'desc' ? -1 : 1
      return 0
    })
  }, [results, sortBy, sortDirection])

  const connectedSources = sources.filter(s => s.status === 'connected').length
  const totalDocuments = sources.reduce((sum, s) => sum + s.documentCount, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: height, gap: 'var(--spacing-4)' }}>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Total Documents</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                {totalDocuments.toLocaleString()}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-base)', fontSize: 'var(--text-display-sm)' }}>📄</div>
          </div>
        </Card>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Sources</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                {connectedSources} / {sources.length}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-info-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-info-base)', fontSize: 'var(--text-display-sm)' }}>🔗</div>
          </div>
        </Card>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Results</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                {results.length}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-success-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success-base)', fontSize: 'var(--text-display-sm)' }}>✅</div>
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 300, position: 'relative' }}>
          <Input
            placeholder={placeholder}
            value={query}
            onChange={handleQueryChange}
            prefix={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-quaternary)', pointerEvents: 'none' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16" y2="16"></line></svg>}
            size="md"
            style={{ paddingLeft: '44px' }}
          />
          {isSearching && <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: 'var(--text-body-xs)', color: 'var(--color-primary-base)' }}>Searching...</span>}
        </div>
        <Button variant="primary" onClick={() => handleSearch(query, filters)} disabled={isSearching || !query.trim()}>
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card variant="outlined" style={{ padding: 'var(--spacing-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
              FILTERS
            </span>
            <Button variant="ghost" size="sm" onClick={() => setFilters({ sources: ['all'], tags: [], dateRange: {}, scoreThreshold: 0.7 })}>
              Clear All
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
            {/* Sources */}
            {showSources && (
              <div>
                <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
                  Sources
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', fontSize: 'var(--text-body-sm)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={filters.sources?.includes('all')} onChange={() => handleFilterChange({ ...filters, sources: filters.sources?.includes('all') ? [] : ['all'] })} /> All
                  </label>
                  {sources.map(source => (
                    <label key={source.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', fontSize: 'var(--text-body-sm)', cursor: 'pointer' }}>
                      <input type="checkbox" checked={filters.sources?.includes(source.id)} onChange={() => handleSourceToggle(source.id)} />
                      <span>{source.name}</span>
                      <Badge variant="default" size="sm">{source.documentCount}</Badge>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
                Tags
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)', maxHeight: '120px', overflowY: 'auto' }}>
                {allTags.map(tag => (
                  <label key={tag} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', fontSize: 'var(--text-body-xs)', cursor: 'pointer', padding: 'var(--spacing-1) var(--spacing-2)', backgroundColor: filters.tags?.includes(tag) ? 'var(--color-primary-base)/15' : 'var(--color-surface-container)', borderRadius: 'var(--radius-sm)', border: `1px solid ${filters.tags?.includes(tag) ? 'var(--color-primary-base)' : 'var(--color-border-primary)'}` }}>
                    <input type="checkbox" checked={filters.tags?.includes(tag)} onChange={() => handleTagToggle(tag)} style={{ width: 12, height: 12, accentColor: 'var(--color-primary-base)' }} />
                    #{tag}
                  </label>
                ))}
              </div>
            </div>

            {/* Score Threshold */}
            {showScoreThreshold && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-2)' }}>
                  <span style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>
                    Score Threshold
                  </span>
                  <span style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-primary-base)' }}>
                    {((filters.scoreThreshold ?? 0) * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={filters.scoreThreshold}
                  onChange={(e) => handleScoreThresholdChange(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-primary-base)' }}
                />
              </div>
            )}

            {/* Date Range */}
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
                Date Range
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Input
                  type="date"
                  value={filters.dateRange?.start || ''}
                  onChange={(e) => handleDateRangeChange({ ...filters.dateRange, start: e.target.value })}
                  placeholder="Start"
                  size="sm"
                />
                <Input
                  type="date"
                  value={filters.dateRange?.end || ''}
                  onChange={(e) => handleDateRangeChange({ ...filters.dateRange, end: e.target.value })}
                  placeholder="End"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Results */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <span style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              {results.length} results
            </span>
            <Select
              value={sortBy}
              onChangeRaw={(e) => setSortBy(e.target.value as any)}
              options={[
                { value: 'score', label: 'Score' },
                { value: 'date', label: 'Date' },
                { value: 'relevance', label: 'Relevance' },
              ]}
              size="sm"
              style={{ width: 140 }}
            />
            <Button variant="ghost" size="sm" onClick={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}>
              {sortDirection === 'desc' ? 'Desc' : 'Asc'}
            </Button>
          </div>

          <Card variant="elevated" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {results.length === 0 && !isSearching && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-tertiary)' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: 'var(--spacing-4)', opacity: 0.5 }}>
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16" y2="16"></line>
                </svg>
                <p style={{ fontSize: 'var(--text-body-md)', marginBottom: 'var(--spacing-2)' }}>
                  {query ? 'No results found' : 'Enter a search query to begin'}
                </p>
                {query && <p style={{ fontSize: 'var(--text-body-sm)', maxWidth: 300, textAlign: 'center' }}>Try adjusting your filters or search terms</p>}
              </div>
            )}

            {results.length > 0 && (
              <Table
                columns={[
                  { key: 'score', header: 'Score', sortable: true, width: 80, render: (r: SearchResult) => (
                    <Badge variant={r.score > 0.9 ? 'success' : r.score > 0.7 ? 'warning' : 'default'} size="sm">
                      {(r.score * 100).toFixed(0)}%
                    </Badge>
                  )},
                  { key: 'title', header: 'Title', sortable: true, render: (r: SearchResult) => (
                    <div style={{ cursor: 'pointer' }} onClick={() => { setSelectedResult(r); onResultSelect?.(r) }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>{r.title}</div>
                      <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.content.slice(0, 100)}...</div>
                    </div>
                  )},
                  { key: 'source', header: 'Source', sortable: true, render: (r: SearchResult) => (
                    <Badge variant="info" size="sm">{r.source}</Badge>
                  )},
                  { key: 'tags', header: 'Tags', render: (r: SearchResult) => (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)' }}>
                      {r.tags.slice(0, 3).map(t => (
                        <Badge key={t} variant="default" size="sm">#{t}</Badge>
                      ))}
                      {r.tags.length > 3 && <Badge variant="default" size="sm">+{r.tags.length - 3}</Badge>}
                    </div>
                  )},
                  { key: 'modified', header: 'Modified', sortable: true, render: (r: SearchResult) => (
                    <span style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{r.modified}</span>
                  )},
                ]}
                rows={sortedResults}
                sortColumn={sortBy}
                sortDirection={sortDirection}
                onSort={handleSort}
                selectable={false}
                emptyMessage="No results found"
              />
            )}

            {isSearching && results.length === 0 && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-tertiary)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--color-border-primary)', borderTopColor: 'var(--color-primary-base)', borderRadius: '50%' }} />
                  <span>Searching...</span>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Selected Result Detail */}
        {selectedResult && (
          <Card variant="elevated" style={{ marginTop: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>
                  RESULT DETAIL
                </div>
                <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{selectedResult.title}</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedResult(null)}>Close</Button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>Score</div>
                <Badge variant={selectedResult.score > 0.9 ? 'success' : selectedResult.score > 0.7 ? 'warning' : 'default'} size="md">
                  {(selectedResult.score * 100).toFixed(1)}%
                </Badge>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>Source</div>
                <Badge variant="info" size="sm">{selectedResult.source}</Badge>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>Modified</div>
                <span style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>{selectedResult.modified}</span>
              </div>
            </div>
            <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, backgroundColor: 'var(--color-surface-container)', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', maxHeight: 200, overflow: 'auto' }}>
              {selectedResult.content}
            </div>
            {selectedResult.tags.length > 0 && (
              <div style={{ marginTop: 'var(--spacing-3)', display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)' }}>
                {selectedResult.tags.map(tag => (
                  <Badge key={tag} variant="default" size="sm">#{tag}</Badge>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}