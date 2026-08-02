import { useState } from 'react'
import { MODELS, MODEL_PROVIDERS } from '../lib/models-data'
import { useModelsStore } from '../stores/ModelsStore'

const TYPE_COLOR: Record<string, string> = {
  chat: '#00e5ff',
  embedding: '#d946ef',
  completion: '#ffb347',
  multimodal: '#22d97a',
}

const STATUS_BADGE: Record<string, string> = {
  available: 'green',
  busy: 'amber',
  unavailable: 'red',
  deprecated: 'gray',
}

export function ModelsCatalog() {
  const { view, setView, filter, setFilter, selectedModel, setSelectedModel } = useModelsStore()
  const [sortBy, setSortBy] = useState<'name' | 'provider' | 'type' | 'usage' | 'status'>('name')

  const filteredModels = MODELS.filter((m) => {
    const matchProvider = filter.provider === 'all' || m.providerId === filter.provider
    const matchType = filter.type === 'all' || m.type === filter.type
    const matchStatus = filter.status === 'all' || m.status === filter.status
    const matchSearch = !filter.search || m.name.toLowerCase().includes(filter.search.toLowerCase()) || m.provider.toLowerCase().includes(filter.search.toLowerCase())
    return matchProvider && matchType && matchStatus && matchSearch
  })

  const sortedModels = [...filteredModels].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'provider') return a.provider.localeCompare(b.provider)
    if (sortBy === 'type') return a.type.localeCompare(b.type)
    if (sortBy === 'usage') return b.usage.requests - a.usage.requests
    if (sortBy === 'status') return a.status.localeCompare(b.status)
    return 0
  })

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> {MODELS.filter((m) => m.status === 'available').length} available</span>
        <span className="badge badge-cyan"><span className="mono">{filteredModels.length} filtered</span></span>
        <span className="badge badge-purple"><span className="mono">{MODEL_PROVIDERS.length} providers</span></span>
        <span className="badge badge-gray"><span className="mono">view: {view}</span></span>
      </div>

      <div className="row" style={{ marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#141830', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, padding: '8px 12px', flex: 1, minWidth: 240 }}>
          <span style={{ color: '#6b7494', fontSize: 14 }}>⌕</span>
          <input
            value={filter.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            placeholder="Search models..."
            style={{ flex: 1, background: 'transparent', fontSize: 13, color: '#e8eaf6', border: 'none', outline: 'none' }}
          />
          <span style={{ fontSize: 10, color: '#4a5170' }} className="mono">⌘F</span>
        </div>

        <select value={filter.provider} onChange={(e) => setFilter({ provider: e.target.value })} className="field-input" style={{ width: 'auto', minWidth: 160, padding: '6px 12px', fontSize: 12 }}>
          <option value="all">All Providers</option>
          {MODEL_PROVIDERS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <select value={filter.type} onChange={(e) => setFilter({ type: e.target.value })} className="field-input" style={{ width: 'auto', minWidth: 140, padding: '6px 12px', fontSize: 12 }}>
          <option value="all">All Types</option>
          <option value="chat">Chat</option>
          <option value="embedding">Embedding</option>
          <option value="completion">Completion</option>
          <option value="multimodal">Multimodal</option>
        </select>

        <select value={filter.status} onChange={(e) => setFilter({ status: e.target.value })} className="field-input" style={{ width: 'auto', minWidth: 140, padding: '6px 12px', fontSize: 12 }}>
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="busy">Busy</option>
          <option value="unavailable">Unavailable</option>
          <option value="deprecated">Deprecated</option>
        </select>

        <div className="row" style={{ gap: 4 }}>
          <button className={'ws-tab ' + (view === 'grid' ? 'active' : '')} onClick={() => setView('grid')} style={{ padding: '6px 10px' }}><span style={{ fontSize: 14 }}>⊞</span></button>
          <button className={'ws-tab ' + (view === 'list' ? 'active' : '')} onClick={() => setView('list')} style={{ padding: '6px 10px' }}><span style={{ fontSize: 14 }}>☰</span></button>
        </div>
      </div>

      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
          {sortedModels.map((model) => (
            <ModelCard key={model.id} model={model} isSelected={selectedModel?.id === model.id} onClick={() => setSelectedModel(model)} />
          ))}
        </div>
      ) : (
        <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 12, fontSize: 9.5, color: '#6b7494', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 600 }} className="mono">
            <span style={{ minWidth: 200, cursor: 'pointer' }} onClick={() => setSortBy('name')}>MODEL</span>
            <span style={{ minWidth: 100, cursor: 'pointer' }} onClick={() => setSortBy('provider')}>PROVIDER</span>
            <span style={{ minWidth: 100, cursor: 'pointer' }} onClick={() => setSortBy('type')}>TYPE</span>
            <span style={{ minWidth: 100, cursor: 'pointer' }} onClick={() => setSortBy('status')}>STATUS</span>
            <span style={{ minWidth: 100, cursor: 'pointer' }} onClick={() => setSortBy('usage')}>USAGE</span>
            <span style={{ flex: 1 }}>CONTEXT</span>
          </div>
          <div style={{ padding: '4px 16px', maxHeight: 600, overflowY: 'auto' }}>
            {sortedModels.map((model) => (
              <div key={model.id} className="table-row" style={{ cursor: 'pointer', background: selectedModel?.id === model.id ? 'rgba(217, 70, 239, 0.08)' : 'transparent' }} onClick={() => setSelectedModel(model)}>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#e8eaf6', minWidth: 200 }}>{model.name}</span>
                <span className="badge badge-purple" style={{ minWidth: 100 }}>{model.provider}</span>
                <span style={{ minWidth: 100 }}><span className="badge" style={{ background: `${TYPE_COLOR[model.type]}22`, color: TYPE_COLOR[model.type] }}>{model.type}</span></span>
                <span style={{ minWidth: 100 }}><span className={'badge badge-' + STATUS_BADGE[model.status]}>{model.status}</span></span>
                <span style={{ minWidth: 100, fontSize: 11, color: '#9ba4c0', fontFamily: 'JetBrains Mono, monospace' }}>{model.usage.requests.toLocaleString()} req</span>
                <span style={{ fontSize: 11, color: '#6b7494', fontFamily: 'JetBrains Mono, monospace' }}>{model.contextWindow.toLocaleString()} tokens</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedModel && <ModelDetailDrawer model={selectedModel} onClose={() => setSelectedModel(null)} />}
    </div>
  )
}

function ModelCard({ model, isSelected, onClick }: { model: any; isSelected: boolean; onClick: () => void }) {
  return (
    <div
      className={'panel ' + (isSelected ? 'selected' : '')}
      style={{ cursor: 'pointer', borderLeft: `3px solid ${TYPE_COLOR[model.type]}`, transition: 'all 0.15s' }}
      onClick={onClick}
    >
      <div className="row" style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 20, color: TYPE_COLOR[model.type], fontFamily: 'Space Grotesk, sans-serif' }}>{TYPE_COLOR[model.type] === '#00e5ff' ? '◌' : TYPE_COLOR[model.type] === '#d946ef' ? '◉' : TYPE_COLOR[model.type] === '#ffb347' ? '◧' : '◬'}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#e8eaf6', fontFamily: 'Space Grotesk, sans-serif' }}>{model.name}</div>
          <span className="badge badge-purple" style={{ fontSize: 9.5 }}>{model.provider}</span>
        </div>
        <span className={'badge badge-' + STATUS_BADGE[model.status]} style={{ fontSize: 9.5 }}>{model.status}</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
        {model.tags.slice(0, 4).map((tag: string) => (
          <span key={tag} className="collab-chip" style={{ fontSize: 9.5 }}>{tag}</span>
        ))}
        {model.tags.length > 4 && <span className="collab-chip" style={{ fontSize: 9.5 }}>+{model.tags.length - 4}</span>}
      </div>

      <div className="row" style={{ fontSize: 10.5, color: '#6b7494', gap: 16 }}>
        <span className="mono">ctx: {model.contextWindow.toLocaleString()}</span>
        <span className="mono">out: {model.maxOutput}</span>
        <span className="mono">{model.usage.cost}</span>
        <span className="mono">{model.lastUsed}</span>
      </div>

      {model.pricing && (
        <div style={{ marginTop: 8, fontSize: 10, color: '#9ba4c0', fontFamily: 'JetBrains Mono, monospace' }}>
          {model.pricing.input} in · {model.pricing.output} out
        </div>
      )}
    </div>
  )
}

function ModelDetailDrawer({ model, onClose }: { model: any; onClose: () => void }) {
  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <div style={{ fontSize: 12, color: TYPE_COLOR[model.type], fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>{TYPE_COLOR[model.type] === '#00e5ff' ? '◌' : TYPE_COLOR[model.type] === '#d946ef' ? '◉' : TYPE_COLOR[model.type] === '#ffb347' ? '◧' : '◬'} {model.type.toUpperCase()}</div>
            <h2>{model.name}</h2>
          </div>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>
        <div className="drawer-body">
        <div className="grid2" style={{ marginBottom: 16 }}>
          <div><div className="stat-label">PROVIDER</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6' }}>{model.provider}</div></div>
          <div><div className="stat-label">STATUS</div><span className={'badge badge-' + STATUS_BADGE[model.status]}>{model.status}</span></div>
          <div><div className="stat-label">CONTEXT WINDOW</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{model.contextWindow.toLocaleString()} tokens</div></div>
          <div><div className="stat-label">MAX OUTPUT</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{model.maxOutput} tokens</div></div>
          <div><div className="stat-label">TOTAL REQUESTS</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{model.usage.requests.toLocaleString()}</div></div>
          <div><div className="stat-label">TOTAL TOKENS</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{(model.usage.tokens / 1e6).toFixed(1)}M</div></div>
          <div><div className="stat-label">TOTAL COST</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6' }}>{model.usage.cost}</div></div>
          <div><div className="stat-label">LAST USED</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6' }}>{model.lastUsed}</div></div>
        </div>

        <div className="section-label"><span className="ico">◉</span> CAPABILITIES</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {model.capabilities.map((cap: string) => (
            <span key={cap} className="badge badge-cyan" style={{ fontSize: 10 }}>{cap}</span>
          ))}
        </div>

        <div className="section-label"><span className="ico">⌘</span> TAGS</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {model.tags.map((tag: string) => (
            <span key={tag} className="collab-chip">#{tag}</span>
          ))}
        </div>

        {model.pricing && (
          <>
            <div className="section-label"><span className="ico">$</span> PRICING</div>
            <div className="grid2" style={{ marginBottom: 16 }}>
              <div className="panel-sm"><div className="stat-label">INPUT</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{model.pricing.input}</div></div>
              <div className="panel-sm"><div className="stat-label">OUTPUT</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{model.pricing.output}</div></div>
            </div>
          </>
        )}

        <div className="row" style={{ gap: 8, marginTop: 24 }}>
          <button className="btn-primary" onClick={onClose}>Close</button>
          <button className="btn-secondary">Test Model</button>
          <button className="btn-secondary">View Endpoints</button>
        </div>
      </div>
    </div>
    </>
  )
}