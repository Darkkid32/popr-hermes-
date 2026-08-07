// MCP Marketplace - Migrated to use shared AI components
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState } from 'react'
import { MCP_MARKETPLACE } from '../lib/mcp-data'
import { useMCPStore } from '../stores/MCPStore'
import { SearchFilters } from '../design-system/components/specialized/SearchFilters'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'

const CATEGORY_BADGE: Record<string, 'success' | 'info' | 'warning' | 'default'> = {
  api: 'success',
  database: 'info',
  tool: 'warning',
  filesystem: 'default',
}

export function MCPMarketplace() {
  const { view, setView, filter, setFilter } = useMCPStore()
  const [sortBy, setSortBy] = useState<'downloads' | 'rating' | 'name' | 'updated' | 'category'>('downloads')

  const allCategories = [...new Set(MCP_MARKETPLACE.map((s) => s.category))].sort()

  const filteredServers = MCP_MARKETPLACE.filter((s) => {
    const matchCategory = filter.category === 'all' || s.category === filter.category
    const matchSearch = !filter.search || s.name.toLowerCase().includes(filter.search.toLowerCase()) || s.description.toLowerCase().includes(filter.search.toLowerCase())
    return matchCategory && matchSearch
  })

  const sortedServers = [...filteredServers].sort((a, b) => {
    if (sortBy === 'downloads') return b.downloads - a.downloads
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'category') return a.category.localeCompare(b.category)
    return 0
  })

  return (
    <div className="page-body">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
        <Badge variant="success" size="md" dot>{MCP_MARKETPLACE.filter((s) => s.verified).length} verified</Badge>
        <Badge variant="info" size="md" dot>{filteredServers.length} servers</Badge>
        <Badge variant="primary" size="md" dot>{allCategories.length} categories</Badge>
        <Badge variant="default" size="md" dot>sort: {sortBy}</Badge>
      </div>

      <SearchFilters
        searchPlaceholder="Search marketplace..."
        onSearchChange={(value) => setFilter({ search: value })}
        filters={[
          {
            key: 'category',
            label: 'Category',
            type: 'select',
            options: [
              { value: 'all', label: 'All Categories' },
              ...allCategories.map((c) => ({ value: c, label: c })),
            ],
          },
        ]}
        values={filter}
        onChange={(values) => setFilter(values)}
        viewMode={view}
        onViewModeChange={setView}
      />

      <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-3)', alignItems: 'center' }}>
        <span style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>
          SORT BY
        </span>
        {(['downloads', 'rating', 'name', 'category'] as const).map((key) => (
          <Button key={key} variant={sortBy === key ? 'primary' : 'tertiary'} size="sm" onClick={() => setSortBy(key)}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </Button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--spacing-3)' }}>
        {sortedServers.map((server) => (
          <Card key={server.id} variant="outlined" style={{ cursor: 'pointer', borderLeft: `3px solid ${server.iconColor || '#9ba4c0'}` }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)' }}>
              <span style={{ fontSize: 'var(--text-display-md)', color: server.iconColor || '#9ba4c0', fontFamily: 'var(--font-heading)' }}>
                {server.icon}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-body-md)', fontFamily: 'var(--font-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {server.name}
                  </span>
                  {server.verified && <Badge variant="success" size="sm">✓ Verified</Badge>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-1)' }}>
                  <Badge variant={CATEGORY_BADGE[server.category] || 'default'} size="sm">{server.category}</Badge>
                  <span style={{ fontSize: 'var(--text-label-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>
                    ★ {server.rating.toFixed(1)}
                  </span>
                  <span style={{ fontSize: 'var(--text-label-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>
                    {server.downloads.toLocaleString()} downloads
                  </span>
                </div>
              </div>
            </div>

            <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-3)', lineHeight: 1.5 }}>
              {server.description}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 'var(--text-label-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>
                            v{server.version}
                          </span>
                          <Button variant="primary" size="sm">Install</Button>
                        </div>
          </Card>
        ))}
      </div>
    </div>
  )
}