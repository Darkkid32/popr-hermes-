// MemoryTimeline - Shared AI Component
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState, useMemo, useCallback } from 'react'
import { Badge } from '../data-display/Badge'
import { Button } from '../data-display/Button'
import { Input } from '../forms/Input'
import { Select } from '../forms/Select'

export interface TimelineItem {
  id: string
  title: string
  description?: string
  timestamp: string
  type: 'note' | 'sync' | 'source' | 'graph' | 'note_created' | 'note_modified' | 'source_added' | 'graph_updated'
  source?: string
  sourceId?: string
  metadata?: Record<string, any>
  tags?: string[]
  icon?: string
  color?: string
}

export type TimelineGroupBy = 'day' | 'week' | 'month' | 'auto'

export interface MemoryTimelineProps {
  items: TimelineItem[]
  groupBy?: TimelineGroupBy
  onItemClick?: (item: TimelineItem) => void
  showFilters?: boolean
  showGrouping?: boolean
  maxHeight?: number
  emptyMessage?: string
  showPagination?: boolean
  pageSize?: number
}

export function MemoryTimeline({
  items,
  groupBy = 'auto',
  onItemClick,
  showFilters = true,
  showGrouping = true,
  maxHeight = 600,
  emptyMessage = 'No timeline activity',
  showPagination = false,
  pageSize = 50,
}: MemoryTimelineProps) {
  const [filterType, setFilterType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)

  const getTypeConfig = (type: string) => {
    const configs: Record<string, { icon: string; color: string; label: string }> = {
      note_created: { icon: '✎', color: '#22d97a', label: 'Note Created' },
      note_modified: { icon: '✎', color: '#7c6cf5', label: 'Note Modified' },
      note: { icon: '◧', color: '#00e5ff', label: 'Note' },
      sync: { icon: '↻', color: '#ffb347', label: 'Sync' },
      source_added: { icon: '⊕', color: '#22d97a', label: 'Source Added' },
      source: { icon: '⊕', color: '#00e5ff', label: 'Source' },
      graph_updated: { icon: '◬', color: '#d946ef', label: 'Graph Updated' },
      graph: { icon: '◬', color: '#d946ef', label: 'Graph' },
    }
    return configs[type] || { icon: '●', color: '#9ba4c0', label: type }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesType = filterType === 'all' || item.type === filterType
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesType && matchesSearch
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [items, filterType, searchQuery])

  const groupedItems = useMemo(() => {
    if (!showGrouping || groupBy === 'auto') {
      return { 'All': filteredItems }
    }

    const groups: Record<string, TimelineItem[]> = {}
    filteredItems.forEach(item => {
      const date = new Date(item.timestamp)
      let groupKey: string

      switch (groupBy) {
        case 'day':
          groupKey = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
          break
        case 'week':
          const weekStart = new Date(date)
          weekStart.setDate(date.getDate() - date.getDay())
          groupKey = `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
          break
        case 'month':
          groupKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
          break
        default:
          groupKey = 'All'
      }

      if (!groups[groupKey]) groups[groupKey] = []
      groups[groupKey].push(item)
    })

    return groups
  }, [filteredItems, groupBy, showGrouping])

  const toggleGroup = useCallback((groupKey: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(groupKey)) {
        next.delete(groupKey)
      } else {
        next.add(groupKey)
      }
      return next
    })
  }, [])

  const totalPages = Math.ceil(filteredItems.length / pageSize)

  const renderGroup = ({ groupKey, groupItems }: { groupKey: string; groupItems: TimelineItem[] }) => {
    const isExpanded = expandedGroups.has(groupKey)
    return (
      <div key={groupKey} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
        <button
          onClick={() => toggleGroup(groupKey)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-3)',
            padding: 'var(--spacing-2) var(--spacing-3)',
            backgroundColor: 'var(--color-surface-container)',
            border: '1px solid var(--color-border-primary)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
            transition: 'all var(--motion-duration-snap) var(--motion-easing-standard)',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{
              color: 'var(--color-text-tertiary)',
              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform var(--motion-duration-snap) var(--motion-easing-standard)',
              flexShrink: 0,
            }}
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
          <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-body-sm)' }}>
            {groupKey}
          </span>
          <span style={{ fontSize: 'var(--text-label-xs)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>
            {groupItems.length} events
          </span>
        </button>
        {isExpanded && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', paddingLeft: 'var(--spacing-3)' }}>
            {groupItems.map((item, index) => (
              <div
                key={`${groupKey}-${index}`}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--spacing-3)',
                  padding: 'var(--spacing-3)',
                  backgroundColor: 'var(--color-surface-container)',
                  border: '1px solid var(--color-border-primary)',
                  borderRadius: 'var(--radius-md)',
                  cursor: onItemClick ? 'pointer' : 'default',
                  transition: 'all var(--motion-duration-snap) var(--motion-easing-standard)',
                }}
                onClick={() => onItemClick?.(item)}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: getTypeConfig(item.type).color + '22',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: getTypeConfig(item.type).color,
                    fontSize: 'var(--text-body-sm)',
                    flexShrink: 0,
                  }}
                >
                  {getTypeConfig(item.type).icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-body-md)' }}>
                      {item.title}
                    </div>
                    <span style={{ fontSize: 'var(--text-label-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>
                      {formatTimestamp(item.timestamp)}
                    </span>
                    <Badge
                      variant="default"
                      size="sm"
                      style={{ backgroundColor: getTypeConfig(item.type).color + '22', color: getTypeConfig(item.type).color }}
                    >
                      {getTypeConfig(item.type).label}
                    </Badge>
                    {item.source && (
                      <Badge variant="info" size="sm">{item.source}</Badge>
                    )}
                  </div>
                  {item.description && (
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-1)' }}>
                      {item.description}
                    </div>
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)' }}>
                      {item.tags.slice(0, 5).map(tag => (
                        <Badge key={tag} variant="default" size="sm">#{tag}</Badge>
                      ))}
                      {item.tags.length > 5 && <Badge variant="default" size="sm">+{item.tags.length - 5}</Badge>}
                    </div>
                  )}
                  {item.metadata && Object.keys(item.metadata).length > 0 && (
                    <details style={{ marginTop: 'var(--spacing-2)' }}>
                      <summary style={{ fontSize: 'var(--text-label-xs)', color: 'var(--color-text-tertiary)', cursor: 'pointer' }}>
                        Metadata
                      </summary>
                      <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)', marginTop: 'var(--spacing-1)' }}>
                        {JSON.stringify(item.metadata, null, 2)}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: maxHeight, gap: 'var(--spacing-4)' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
            ACTIVITY TIMELINE
          </span>
          <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', marginLeft: 'var(--spacing-2)' }}>
            {filteredItems.length} events
          </span>
        </div>

        {showFilters && (
          <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', minWidth: 240 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-quaternary)', pointerEvents: 'none' }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16" y2="16"></line>
              </svg>
              <Input
                placeholder="Filter timeline..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '40px', width: '100%' }}
                size="sm"
              />
            </div>
            <Select
              value={filterType}
              onChangeRaw={(e) => setFilterType(e.target.value)}
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'note', label: 'Notes' },
                { value: 'sync', label: 'Sync Events' },
                { value: 'source', label: 'Source Events' },
                { value: 'graph', label: 'Graph Updates' },
              ]}
              size="sm"
              style={{ minWidth: 160 }}
            />
          </div>
        )}
      </div>

      {/* Timeline */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        {Object.keys(groupedItems).length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-tertiary)' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: 'var(--spacing-4)', opacity: 0.5 }}>
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <p style={{ fontSize: 'var(--text-body-md)', marginBottom: 'var(--spacing-2)' }}>
              {emptyMessage}
            </p>
            <p style={{ fontSize: 'var(--text-body-sm)', maxWidth: 300, textAlign: 'center' }}>
              No activity matches your current filters
            </p>
          </div>
        ) : (
          Object.entries(groupedItems).map(([groupKey, groupItems]) => renderGroup({ groupKey, groupItems }))
        )}
      </div>

      {showPagination && totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--color-border-primary)' }}>
          <Button variant="ghost" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
            Previous
          </Button>
          <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
            Page {currentPage} of {totalPages}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
      )}
    </div>
  )
}