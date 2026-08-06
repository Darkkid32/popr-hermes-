// Models Catalog - Migrated to use shared AI components
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState } from 'react'
import { MODELS, MODEL_PROVIDERS } from '../lib/models-data'
import { useModelsStore } from '../stores/ModelsStore'
import { ModelCard } from '../design-system/components/specialized/ModelCard'
import { SearchFilters } from '../design-system/components/specialized/SearchFilters'
import { DetailDrawer } from '../design-system/components/specialized/DetailDrawer'
import { ModelCapabilityBadge } from '../design-system/components/specialized/ModelCapabilityBadge'
import { ProviderBadge } from '../design-system/components/specialized/ProviderBadge'

const TYPE_COLOR: Record<string, string> = {
  chat: '#00e5ff',
  embedding: '#d946ef',
  completion: '#ffb347',
  multimodal: '#22d97a',
}

const TYPE_ICON: Record<string, string> = {
  chat: '◌',
  embedding: '◉',
  completion: '◧',
  multimodal: '◬',
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

  // SearchFilters configuration
  const filterConfigs = [
    { key: 'search', type: 'search' as const, placeholder: 'Search models...' },
    { key: 'provider', type: 'select' as const, label: 'Provider', options: [{ value: 'all', label: 'All Providers' }, ...MODEL_PROVIDERS.map(p => ({ value: p.id, label: p.name }))] },
    { key: 'type', type: 'select' as const, label: 'Type', options: [
      { value: 'all', label: 'All Types' },
      { value: 'chat', label: 'Chat' },
      { value: 'embedding', label: 'Embedding' },
      { value: 'completion', label: 'Completion' },
      { value: 'multimodal', label: 'Multimodal' },
    ]},
    { key: 'status', type: 'select' as const, label: 'Status', options: [
      { value: 'all', label: 'All Status' },
      { value: 'available', label: 'Available' },
      { value: 'busy', label: 'Busy' },
      { value: 'unavailable', label: 'Unavailable' },
      { value: 'deprecated', label: 'Deprecated' },
    ]},
  ]

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> {MODELS.filter((m) => m.status === 'available').length} available</span>
        <span className="badge badge-cyan"><span className="mono">{filteredModels.length} filtered</span></span>
        <span className="badge badge-purple"><span className="mono">{MODEL_PROVIDERS.length} providers</span></span>
        <span className="badge badge-gray"><span className="mono">view: {view}</span></span>
      </div>

      <SearchFilters
        filters={filterConfigs}
        values={filter}
        onChange={setFilter}
        onSearchChange={(value) => setFilter({ search: value })}
        viewMode={view}
        onViewModeChange={setView}
      />

      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
          {sortedModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              isSelected={selectedModel?.id === model.id}
              onClick={() => setSelectedModel(model)}
              onTest={() => {}}
            />
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
                <span style={{ minWidth: 100 }}><ModelCapabilityBadge capability={model.type} size="sm" variant="outline" /></span>
                <span style={{ minWidth: 100 }}><span className={'badge badge-' + STATUS_BADGE[model.status]}>{model.status}</span></span>
                <span style={{ minWidth: 100, fontSize: 11, color: '#9ba4c0', fontFamily: 'JetBrains Mono, monospace' }}>{model.usage.requests.toLocaleString()} req</span>
                <span style={{ fontSize: 11, color: '#6b7494', fontFamily: 'JetBrains Mono, monospace' }}>{model.contextWindow.toLocaleString()} tokens</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedModel && (
        <DetailDrawer
          isOpen={!!selectedModel}
          onClose={() => setSelectedModel(null)}
          title={selectedModel.name}
          subtitle={<ProviderBadge provider={{ id: selectedModel.providerId, name: selectedModel.provider, icon: TYPE_ICON[selectedModel.type] || '◌', iconColor: TYPE_COLOR[selectedModel.type], status: selectedModel.status === 'available' ? 'connected' : 'disconnected', modelsCount: 1 }} variant="compact" size="sm" showStatus={false} showModelCount={false} />}
          size="lg"
          headerIcon={TYPE_ICON[selectedModel.type]}
        >
          <div>
            <div className="grid2" style={{ marginBottom: 16 }}>
              <div><div className="stat-label">PROVIDER</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6' }}>{selectedModel.provider}</div></div>
              <div><div className="stat-label">STATUS</div><span className={'badge badge-' + STATUS_BADGE[selectedModel.status]}>{selectedModel.status}</span></div>
              <div><div className="stat-label">CONTEXT WINDOW</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{selectedModel.contextWindow.toLocaleString()} tokens</div></div>
              <div><div className="stat-label">MAX OUTPUT</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{selectedModel.maxOutput} tokens</div></div>
              <div><div className="stat-label">TOTAL REQUESTS</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{selectedModel.usage.requests.toLocaleString()}</div></div>
              <div><div className="stat-label">TOTAL TOKENS</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{(selectedModel.usage.tokens / 1e6).toFixed(1)}M</div></div>
              <div><div className="stat-label">TOTAL COST</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6' }}>{selectedModel.usage.cost}</div></div>
              <div><div className="stat-label">LAST USED</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6' }}>{selectedModel.lastUsed}</div></div>
            </div>

            <div className="section-label"><span className="ico">◉</span> CAPABILITIES</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              {selectedModel.capabilities.map((cap: string) => (
                <ModelCapabilityBadge key={cap} capability={cap as any} size="sm" />
              ))}
            </div>

            <div className="section-label"><span className="ico">⌘</span> TAGS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              {selectedModel.tags.map((tag: string) => (
                <span key={tag} className="collab-chip">#{tag}</span>
              ))}
            </div>

            {selectedModel.pricing && (
              <>
                <div className="section-label"><span className="ico">$</span> PRICING</div>
                <div className="grid2" style={{ marginBottom: 16 }}>
                  <div className="panel-sm"><div className="stat-label">INPUT</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{selectedModel.pricing.input}</div></div>
                  <div className="panel-sm"><div className="stat-label">OUTPUT</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{selectedModel.pricing.output}</div></div>
                </div>
              </>
            )}

            <div className="row" style={{ gap: 8, marginTop: 24 }}>
              <button className="btn-primary" onClick={() => setSelectedModel(null)}>Close</button>
              <button className="btn-secondary">Test Model</button>
              <button className="btn-secondary">View Endpoints</button>
            </div>
          </div>
        </DetailDrawer>
      )}
    </div>
  )
}