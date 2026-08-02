import { useState } from 'react'
import { MEMORY_NOTES, MEMORY_STATS } from '../lib/memory-data'
import { useMemoryStore } from '../stores/MemoryStore'

const SOURCE_BADGE: Record<string, string> = {
  obsidian: 'purple',
  omi: 'cyan',
  manual: 'green',
  imported: 'amber',
  api: 'pink',
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
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> {MEMORY_STATS.totalNotes.toLocaleString()} notes</span>
        <span className="badge badge-cyan"><span className="mono">{filteredNotes.length} filtered</span></span>
        <span className="badge badge-purple"><span className="mono">{allTags.length} tags</span></span>
        <span className="badge badge-gray"><span className="mono">view: {view}</span></span>
      </div>

      <div className="row" style={{ marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#141830', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, padding: '8px 12px', flex: 1, minWidth: 240 }}>
          <span style={{ color: '#6b7494', fontSize: 14 }}>⌕</span>
          <input
            value={filter.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            placeholder="Search notes..."
            style={{ flex: 1, background: 'transparent', fontSize: 13, color: '#e8eaf6', border: 'none', outline: 'none' }}
          />
          <span style={{ fontSize: 10, color: '#4a5170' }} className="mono">⌘F</span>
        </div>

        <select value={filter.source} onChange={(e) => setFilter({ source: e.target.value })} className="field-input" style={{ width: 'auto', minWidth: 140, padding: '6px 12px', fontSize: 12 }}>
          <option value="all">All Sources</option>
          {allSources.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={filter.tag} onChange={(e) => setFilter({ tag: e.target.value })} className="field-input" style={{ width: 'auto', minWidth: 140, padding: '6px 12px', fontSize: 12 }}>
          <option value="all">All Tags</option>
          {allTags.map((t) => <option key={t} value={t}>#{t}</option>)}
        </select>

        <div className="row" style={{ gap: 4 }}>
          <button className={'ws-tab ' + (view === 'list' ? 'active' : '')} onClick={() => setView('list')} style={{ padding: '6px 10px' }}><span style={{ fontSize: 14 }}>☰</span></button>
          <button className={'ws-tab ' + (view === 'grid' ? 'active' : '')} onClick={() => setView('grid')} style={{ padding: '6px 10px' }}><span style={{ fontSize: 14 }}>⊞</span></button>
        </div>
      </div>

      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
          {sortedNotes.map((note) => (
            <NoteCard key={note.id} note={note} isSelected={selectedNote?.id === note.id} onClick={() => setSelectedNote(note)} />
          ))}
        </div>
      ) : (
        <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 12, fontSize: 9.5, color: '#6b7494', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 600 }} className="mono">
            <span style={{ minWidth: 240, cursor: 'pointer' }} onClick={() => setSortBy('title')}>TITLE</span>
            <span style={{ minWidth: 80, cursor: 'pointer' }} onClick={() => setSortBy('source')}>SOURCE</span>
            <span style={{ minWidth: 80, cursor: 'pointer' }} onClick={() => setSortBy('words')}>WORDS</span>
            <span style={{ minWidth: 80, cursor: 'pointer' }} onClick={() => setSortBy('size')}>SIZE</span>
            <span style={{ minWidth: 100, cursor: 'pointer' }} onClick={() => setSortBy('modified')}>MODIFIED</span>
            <span style={{ flex: 1 }}>TAGS</span>
          </div>
          <div style={{ padding: '4px 16px', maxHeight: 600, overflowY: 'auto' }}>
            {sortedNotes.map((note) => (
              <div key={note.id} className="table-row" style={{ cursor: 'pointer', background: selectedNote?.id === note.id ? 'rgba(217, 70, 239, 0.08)' : 'transparent' }} onClick={() => setSelectedNote(note)}>
                <span style={{ fontSize: 12.5, fontWeight: 500, color: '#e8eaf6', minWidth: 240 }}>{note.title}</span>
                <span className={'badge badge-' + SOURCE_BADGE[note.source]} style={{ minWidth: 80, fontSize: 9.5 }}>{note.source}</span>
                <span style={{ minWidth: 80, fontSize: 11, color: '#9ba4c0', fontFamily: 'JetBrains Mono, monospace' }}>{note.wordCount.toLocaleString()}</span>
                <span style={{ minWidth: 80, fontSize: 11, color: '#9ba4c0', fontFamily: 'JetBrains Mono, monospace' }}>{(note.size / 1024).toFixed(1)} KB</span>
                <span style={{ minWidth: 100, fontSize: 11, color: '#6b7494', fontFamily: 'JetBrains Mono, monospace' }}>{note.modified}</span>
                <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {note.tags.slice(0, 5).map((t) => (
                    <span key={t} className="collab-chip" style={{ fontSize: 9.5 }}>{t}</span>
                  ))}
                  {note.tags.length > 5 && <span className="collab-chip" style={{ fontSize: 9.5 }}>+{note.tags.length - 5}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedNote && <NoteDetailDrawer note={selectedNote} onClose={() => setSelectedNote(null)} />}
    </div>
  )
}

function NoteCard({ note, isSelected, onClick }: { note: any; isSelected: boolean; onClick: () => void }) {
  return (
    <div
      className={'panel ' + (isSelected ? 'selected' : '')}
      style={{ cursor: 'pointer', borderLeft: `3px solid ${SOURCE_BADGE_COLOR(note.source)}`, transition: 'all 0.15s' }}
      onClick={onClick}
    >
      <div className="row" style={{ marginBottom: 10 }}>
        <span className={'badge badge-' + SOURCE_BADGE[note.source]} style={{ fontSize: 9.5 }}>{note.source}</span>
        <div className="spacer" />
        <span style={{ fontSize: 10, color: '#6b7494', fontFamily: 'JetBrains Mono, monospace' }}>{note.modified}</span>
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, color: '#e8eaf6', marginBottom: 8, lineHeight: 1.4 }}>{note.title}</div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
        {note.tags.slice(0, 4).map((tag: string) => (
          <span key={tag} className="collab-chip" style={{ fontSize: 9.5 }}>{tag}</span>
        ))}
        {note.tags.length > 4 && <span className="collab-chip" style={{ fontSize: 9.5 }}>+{note.tags.length - 4}</span>}
      </div>

      <div className="row" style={{ fontSize: 10.5, color: '#6b7494', gap: 16 }}>
        <span className="mono">{note.wordCount.toLocaleString()} words</span>
        <span className="mono">{(note.size / 1024).toFixed(1)} KB</span>
        <span className="mono">{note.links.length} links</span>
        <span className="mono">{note.graphNodes} nodes · {note.graphEdges} edges</span>
      </div>

      <div style={{ marginTop: 8, fontSize: 11, color: '#9ba4c0', lineHeight: 1.5 }}>
        {note.content.slice(0, 120)}...
      </div>
    </div>
  )
}

function NoteDetailDrawer({ note, onClose }: { note: any; onClose: () => void }) {
  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <div style={{ fontSize: 12, color: SOURCE_BADGE_COLOR(note.source), fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>{note.source.toUpperCase()}</div>
            <h2 style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{note.title}</h2>
          </div>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>
        <div className="drawer-body">
          <div className="grid2" style={{ marginBottom: 16 }}>
            <div><div className="stat-label">SOURCE</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6' }}>{note.source}</div></div>
            <div><div className="stat-label">CREATED</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{note.created}</div></div>
            <div><div className="stat-label">MODIFIED</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{note.modified}</div></div>
            <div><div className="stat-label">WORDS</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{note.wordCount.toLocaleString()}</div></div>
            <div><div className="stat-label">SIZE</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{(note.size / 1024).toFixed(1)} KB</div></div>
            <div><div className="stat-label">LINKS</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{note.links.length}</div></div>
            <div><div className="stat-label">GRAPH NODES</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{note.graphNodes}</div></div>
            <div><div className="stat-label">GRAPH EDGES</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{note.graphEdges}</div></div>
          </div>

          <div className="section-label"><span className="ico">⌘</span> TAGS</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {note.tags.map((tag: string) => (
              <span key={tag} className="collab-chip">#{tag}</span>
            ))}
          </div>

          <div className="section-label"><span className="ico">⊕</span> LINKED NOTES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            {note.links.map((linkId: string) => {
              const linked = MEMORY_NOTES.find((n) => n.id === linkId)
              return linked ? (
                <div key={linkId} className="table-row" style={{ cursor: 'pointer' }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#e8eaf6', flex: 1 }}>{linked.title}</span>
                  <span className={'badge badge-' + SOURCE_BADGE[linked.source]} style={{ fontSize: 9.5 }}>{linked.source}</span>
                </div>
              ) : null
            })}
            {note.links.length === 0 && <div style={{ color: '#6b7494', fontSize: 12, padding: 8 }}>No linked notes</div>}
          </div>

          <div className="section-label"><span className="ico">◧</span> CONTENT PREVIEW</div>
          <div style={{ background: '#0a0d1a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 16, maxHeight: 200, overflowY: 'auto', fontSize: 12.5, color: '#e8eaf6', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {note.content}
          </div>

          <div className="row" style={{ gap: 8, marginTop: 24 }}>
            <button className="btn-primary" onClick={onClose}>Close</button>
            <button className="btn-secondary">Open in Editor</button>
            <button className="btn-secondary">View Graph</button>
          </div>
        </div>
      </div>
    </>
  )
}

function SOURCE_BADGE_COLOR(source: string) {
  const colors: Record<string, string> = {
    obsidian: '#7c6cf5',
    omi: '#00e5ff',
    manual: '#22d97a',
    imported: '#ffb347',
    api: '#f06292',
  }
  return colors[source] || '#9ba4c0'
}