// Notes - Migrated to use shared AI components
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState } from 'react'
import { MEMORY_NOTES, MEMORY_STATS } from '../lib/memory-data'
import { useMemoryStore } from '../stores/MemoryStore'
import { DetailDrawer } from '../design-system/components/specialized/DetailDrawer'
import { ProviderBadge } from '../design-system/components/specialized/ProviderBadge'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Table } from '../design-system/components/data-display/Table'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'

const SOURCE_TYPE_CONFIG: Record<string, { color: string; icon: string }> = {
  obsidian: { color: '#7c6cf5', icon: '◧' },
  omi: { color: '#00e5ff', icon: '◉' },
  manual: { color: '#22d97a', icon: '✎' },
  imported: { color: '#ffb347', icon: '↻' },
  api: { color: '#f06292', icon: '⊕' },
}

export function MemoryNotes() {
  const { view, setView, filter, setFilter, selectedNote, setSelectedNote } = useMemoryStore()
  const [sortBy, setSortBy] = useState<'modified' | 'created' | 'title' | 'size' | 'words' | 'source'>('modified')

  const allTags = [...new Set(MEMORY_NOTES.flatMap((n) => n.tags))].sort()
  const allSources = [...new Set(MEMORY_NOTES.map((n) => n.source))].sort()

  const filteredNotes = MEMORY_NOTES.filter((n) => {
    const matchSource = filter.source === 'all' || n.source === filter.source
    const matchTag = filter.tag === 'all' || n.tags.includes(filter.tag)
    const matchSearch = !filter.search || n.title.toLowerCase().includes(filter.search.toLowerCase()) || n.content.toLowerCase().includes(filter.search.toLowerCase())
    return matchSource && matchTag && matchSearch
  })

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === 'modified') return new Date(b.modified).getTime() - new Date(a.modified).getTime()
    if (sortBy === 'created') return new Date(b.created).getTime() - new Date(a.created).getTime()
    if (sortBy === 'title') return a.title.localeCompare(b.title)
    if (sortBy === 'size') return b.size - a.size
    if (sortBy === 'words') return b.wordCount - a.wordCount
    if (sortBy === 'source') return a.source.localeCompare(b.source)
    return 0
  })

  return (
    <div className="page-body">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
        <Badge variant="success" size="md" dot>{MEMORY_STATS.totalNotes.toLocaleString()} notes</Badge>
        <Badge variant="info" size="md" dot>{filteredNotes.length} filtered</Badge>
        <Badge variant="primary" size="md" dot>{allTags.length} tags</Badge>
        <Badge variant="default" size="md" dot>view: {view}</Badge>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center', marginBottom: 'var(--spacing-3)' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 280 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-quaternary)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16" y2="16"></line>
          </svg>
          <Input
            placeholder="Search notes..."
            value={filter.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            style={{ paddingLeft: '40px', width: '100%' }}
            size="sm"
          />
        </div>
        <Select
          value={filter.source}
          onChangeRaw={(e) => setFilter({ source: e.target.value })}
          options={[
            { value: 'all', label: 'All Sources' },
            ...allSources.map(s => ({ value: s, label: s })),
          ]}
          size="sm"
          style={{ minWidth: 160 }}
        />
        <Select
          value={filter.tag}
          onChangeRaw={(e) => setFilter({ tag: e.target.value })}
          options={[
            { value: 'all', label: 'All Tags' },
            ...allTags.map(t => ({ value: t, label: `#${t}` })),
          ]}
          size="sm"
          style={{ minWidth: 160 }}
        />
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-3)' }}>
        <Button variant={view === 'list' ? 'primary' : 'tertiary'} size="sm" onClick={() => setView('list')}>☰ List</Button>
        <Button variant={view === 'grid' ? 'primary' : 'tertiary'} size="sm" onClick={() => setView('grid')}>⊞ Grid</Button>
      </div>

      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--spacing-3)' }}>
          {sortedNotes.map((note) => (
            <NoteCard key={note.id} note={note} isSelected={selectedNote?.id === note.id} onClick={() => setSelectedNote(note)} />
          ))}
        </div>
      ) : (
        <Card variant="outlined" style={{ overflow: 'hidden' }}>
          <Table
            columns={[
                          { key: 'title', header: 'TITLE', sortable: true, width: 240, render: (n: any) => (
                            <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{n.title}</span>
                          )},
              { key: 'source', header: 'SOURCE', sortable: true, width: 100, render: (n: any) => (
                <ProviderBadge simpleProvider={{ name: n.source, status: 'connected', icon: SOURCE_TYPE_CONFIG[n.source]?.icon, iconColor: SOURCE_TYPE_CONFIG[n.source]?.color }} size="sm" />
              )},
              { key: 'words', header: 'WORDS', sortable: true, width: 100, align: 'right', render: (n: any) => (
                <span style={{ fontSize: 'var(--text-body-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{n.wordCount.toLocaleString()}</span>
              )},
              { key: 'size', header: 'SIZE', sortable: true, width: 100, align: 'right', render: (n: any) => (
                <span style={{ fontSize: 'var(--text-body-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{(n.size / 1024).toFixed(1)} KB</span>
              )},
              { key: 'modified', header: 'MODIFIED', sortable: true, width: 120, render: (n: any) => (
                <span style={{ fontSize: 'var(--text-body-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{n.modified}</span>
              )},
              { key: 'tags', header: 'TAGS', render: (n: any) => (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)' }}>
                  {n.tags.slice(0, 5).map((t: string) => (
                    <Badge key={t} variant="default" size="sm">{t}</Badge>
                  ))}
                  {n.tags.length > 5 && <Badge variant="default" size="sm">+{n.tags.length - 5}</Badge>}
                </div>
              )},
            ]}
            rows={sortedNotes}
                        sortColumn={sortBy}
                        sortDirection="desc"
                        onSort={(column: string) => setSortBy(column as any)}
                        selectable={false}
                        emptyMessage="No notes found"
          />
        </Card>
      )}

      {selectedNote && (
        <NoteDetailDrawer note={selectedNote} onClose={() => setSelectedNote(null)} />
      )}
    </div>
  )
}

function NoteCard({ note, isSelected, onClick }: { note: any; isSelected: boolean; onClick: () => void }) {
  const sourceConfig = SOURCE_TYPE_CONFIG[note.source] || { color: '#9ba4c0', icon: '⊕' }
  
  return (
    <Card
      variant="outlined"
      style={{
        cursor: 'pointer',
        borderLeft: `3px solid ${sourceConfig.color}`,
        transition: 'all var(--motion-duration-snap) var(--motion-easing-standard)',
        backgroundColor: isSelected ? 'var(--color-primary-base)/05' : 'var(--color-surface-container)',
      }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
        <ProviderBadge simpleProvider={{ name: note.source, status: 'connected', icon: sourceConfig.icon, iconColor: sourceConfig.color }} size="sm" />
        <span style={{ fontSize: 'var(--text-label-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{note.modified}</span>
      </div>

      <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-2)', lineHeight: 1.4 }}>{note.title}</div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)', marginBottom: 'var(--spacing-2)' }}>
        {note.tags.slice(0, 4).map((tag: string) => (
          <Badge key={tag} variant="default" size="sm">{tag}</Badge>
        ))}
        {note.tags.length > 4 && <Badge variant="default" size="sm">+{note.tags.length - 4}</Badge>}
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-3)', fontSize: 'var(--text-label-xs)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
        <span>{note.wordCount.toLocaleString()} words</span>
        <span>{(note.size / 1024).toFixed(1)} KB</span>
        <span>{note.links.length} links</span>
        <span>{note.graphNodes} nodes · {note.graphEdges} edges</span>
      </div>

      <div style={{ marginTop: 'var(--spacing-2)', fontSize: 'var(--text-body-xs)', color: 'var(--color-text-quaternary)', lineHeight: 1.5 }}>
        {note.content.slice(0, 120)}...
      </div>
    </Card>
  )
}

function NoteDetailDrawer({ note, onClose }: { note: any; onClose: () => void }) {
  const sourceConfig = SOURCE_TYPE_CONFIG[note.source] || { color: '#9ba4c0', icon: '⊕' }
  const linkedNotes = note.links.map((linkId: string) => MEMORY_NOTES.find((n) => n.id === linkId)).filter(Boolean)

  return (
    <DetailDrawer
      isOpen={true}
      onClose={onClose}
      title={note.title}
      size="lg"
      headerIcon={<ProviderBadge simpleProvider={{ name: note.source, status: 'connected', icon: sourceConfig.icon, iconColor: sourceConfig.color }} size="sm" />}
      actions={
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          <Button variant="primary" onClick={onClose}>Close</Button>
          <Button variant="secondary">Open in Editor</Button>
          <Button variant="secondary">View Graph</Button>
        </div>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
        <div className="panel-sm">
          <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>SOURCE</div>
          <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{note.source}</div>
        </div>
        <div className="panel-sm">
          <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>CREATED</div>
          <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{note.created}</div>
        </div>
        <div className="panel-sm">
          <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>MODIFIED</div>
          <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{note.modified}</div>
        </div>
        <div className="panel-sm">
          <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>WORDS</div>
          <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{note.wordCount.toLocaleString()}</div>
        </div>
        <div className="panel-sm">
          <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>SIZE</div>
          <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{(note.size / 1024).toFixed(1)} KB</div>
        </div>
        <div className="panel-sm">
          <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>LINKS</div>
          <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{note.links.length}</div>
        </div>
        <div className="panel-sm">
          <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>GRAPH NODES</div>
          <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{note.graphNodes}</div>
        </div>
        <div className="panel-sm">
          <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>GRAPH EDGES</div>
          <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{note.graphEdges}</div>
        </div>
      </div>

      <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
        TAGS
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)', marginBottom: 'var(--spacing-4)' }}>
        {note.tags.map((tag: string) => (
          <Badge key={tag} variant="default" size="sm">#{tag}</Badge>
        ))}
      </div>

      <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
        LINKED NOTES
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)', maxHeight: 200, overflow: 'auto' }}>
        {linkedNotes.length > 0 ? (
                  linkedNotes.map((linked: any) => {
            const linkedSourceConfig = SOURCE_TYPE_CONFIG[linked.source] || { color: '#9ba4c0', icon: '⊕' }
            return (
              <div key={linked.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', padding: 'var(--spacing-2)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                <ProviderBadge simpleProvider={{ name: linked.source, status: 'connected', icon: linkedSourceConfig.icon, iconColor: linkedSourceConfig.color }} size="sm" />
                <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-text-primary)', flex: 1 }}>{linked.title}</span>
              </div>
            )
          })
        ) : (
          <div style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-body-sm)', padding: 'var(--spacing-3)' }}>No linked notes</div>
        )}
      </div>

      <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
        CONTENT PREVIEW
      </div>
      <div style={{ backgroundColor: 'var(--color-background-base)', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3)', maxHeight: 300, overflow: 'auto', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
        {note.content}
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-3)', borderTop: '1px solid var(--color-border-primary)' }}>
        <Button variant="primary" onClick={onClose}>Close</Button>
        <Button variant="secondary">Open in Editor</Button>
        <Button variant="secondary">View Graph</Button>
      </div>
    </DetailDrawer>
  )
}