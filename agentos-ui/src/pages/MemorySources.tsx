import { MEMORY_SOURCES } from '../lib/memory-data'

const SOURCE_TYPE_ICON: Record<string, string> = {
  obsidian: '◧',
  omi: '◉',
  manual: '✎',
  imported: '↻',
  api: '⊕',
}

const SOURCE_TYPE_COLOR: Record<string, string> = {
  obsidian: '#7c6cf5',
  omi: '#00e5ff',
  manual: '#22d97a',
  imported: '#ffb347',
  api: '#f06292',
}

const STATUS_BADGE: Record<string, string> = {
  connected: 'green',
  disconnected: 'red',
  syncing: 'amber',
  error: 'red',
}

export function MemorySources() {
  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> {MEMORY_SOURCES.filter((s) => s.status === 'connected').length} connected</span>
        <span className="badge badge-amber"><span className="mono">{MEMORY_SOURCES.filter((s) => s.status === 'syncing').length} syncing</span></span>
        <span className="badge badge-red"><span className="mono">{MEMORY_SOURCES.filter((s) => s.status === 'disconnected').length} disconnected</span></span>
        <span className="badge badge-cyan"><span className="mono">{MEMORY_SOURCES.length} sources total</span></span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
        {MEMORY_SOURCES.map((source) => (
          <SourceCard key={source.id} source={source} />
        ))}
      </div>

      <div className="panel" style={{ marginTop: 24 }}>
        <div className="section-label"><span className="ico">⌘</span> ADD NEW SOURCE</div>
        <div className="grid3" style={{ marginTop: 12 }}>
          <AddSourceButton type="obsidian" label="Obsidian Vault" description="Local markdown vault" icon="◧" color="#7c6cf5" />
          <AddSourceButton type="omi" label="Omi Device" description="Voice capture device" icon="◉" color="#00e5ff" />
          <AddSourceButton type="github" label="GitHub" description="Import from repositories" icon="⌘" color="#22d97a" />
          <AddSourceButton type="notion" label="Notion" description="Notion workspace sync" icon="◈" color="#f06292" />
          <AddSourceButton type="linear" label="Linear" description="Issue tracker import" icon="◬" color="#ffb347" />
          <AddSourceButton type="readwise" label="Readwise" description="Highlights & notes" icon="◉" color="#ff4d6d" />
          <AddSourceButton type="telegram" label="Telegram" description="Saved messages" icon="➤" color="#2ca5e0" />
          <AddSourceButton type="rss" label="RSS Feeds" description="Blog & newsletter feeds" icon="⊕" color="#22d97a" />
          <AddSourceButton type="api" label="Custom API" description="Generic REST/GraphQL" icon="⌘" color="#9ba4c0" />
        </div>
      </div>
    </div>
  )
}

function SourceCard({ source }: { source: any }) {
  const color = SOURCE_TYPE_COLOR[source.type] || '#9ba4c0'
  const icon = SOURCE_TYPE_ICON[source.type] || '⊕'

  return (
    <div className="panel" style={{ borderLeft: `3px solid ${color}` }}>
      <div className="row" style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 22, color }}>{icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#e8eaf6', fontFamily: 'Space Grotesk, sans-serif' }}>{source.name}</div>
          <span className="badge badge-gray" style={{ fontSize: 9.5 }}>{source.type.toUpperCase()}</span>
        </div>
        <span className={'badge badge-' + STATUS_BADGE[source.status]}>{source.status}</span>
      </div>

      <div className="grid2" style={{ marginBottom: 12 }}>
        <div className="panel-sm"><div className="stat-label">NOTES</div><div className="stat-val" style={{ fontSize: 18 }}>{source.notesCount.toLocaleString()}</div></div>
        <div className="panel-sm"><div className="stat-label">LAST SYNC</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{source.lastSync}</div></div>
      </div>

      <div className="section-label" style={{ marginBottom: 8 }}><span className="ico">⚙</span> CONFIGURATION</div>
      <div style={{ fontSize: 10.5, color: '#9ba4c0', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.8 }}>
        {Object.entries(source.config).map(([k, v]) => (
          <div key={k}><span style={{ color: '#6b7494' }}>{k}:</span> <span>{String(v)}</span></div>
        ))}
        {Object.keys(source.config).length === 0 && <div>No configuration</div>}
      </div>

      <div className="row" style={{ marginTop: 16, gap: 8 }}>
        <button className="btn-secondary" style={{ fontSize: 10, padding: '4px 10px', flex: 1 }}>Sync Now</button>
        <button className="btn-secondary" style={{ fontSize: 10, padding: '4px 10px', flex: 1 }}>Configure</button>
        <button className="btn-secondary" style={{ fontSize: 10, padding: '4px 10px', flex: 1, color: '#ff4d6d', borderColor: '#ff4d6d' }}>Disconnect</button>
      </div>
    </div>
  )
}

function AddSourceButton({ type: _type, label, description, icon, color }: { type: string; label: string; description: string; icon: string; color: string }) {
  return (
    <button className="panel" style={{ cursor: 'pointer', textAlign: 'left', borderColor: color + '44', transition: 'all 0.15s' }}>
      <span style={{ fontSize: 24, color }}>{icon}</span>
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#e8eaf6', fontFamily: 'Space Grotesk, sans-serif' }}>{label}</div>
        <div style={{ fontSize: 11, color: '#6b7494', marginTop: 2 }}>{description}</div>
      </div>
      <span className="badge badge-cyan" style={{ marginTop: 12, fontSize: 9.5 }}>Add</span>
    </button>
  )
}