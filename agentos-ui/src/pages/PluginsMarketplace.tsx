import { useState } from 'react'
import { PLUGIN_MARKETPLACE } from '../lib/plugins-data'
import { usePluginsStore } from '../stores/PluginsStore'

const CATEGORY_BADGE: Record<string, string> = {
  integration: 'cyan',
  tool: 'purple',
  workflow: 'amber',
  utility: 'green',
}

export function PluginsMarketplace() {
  const { view, setView, filter, setFilter } = usePluginsStore()
  const [sortBy, setSortBy] = useState<'downloads' | 'rating' | 'name' | 'updated' | 'category'>('downloads')

  const allCategories = [...new Set(PLUGIN_MARKETPLACE.map((p) => p.category))].sort()

  const filteredPlugins = PLUGIN_MARKETPLACE.filter((p) => {
    const matchCategory = filter.category === 'all' || p.category === filter.category
    const matchSearch = !filter.search || p.name.toLowerCase().includes(filter.search.toLowerCase()) || p.description.toLowerCase().includes(filter.search.toLowerCase())
    return matchCategory && matchSearch
  })

  const sortedPlugins = [...filteredPlugins].sort((a, b) => {
    if (sortBy === 'downloads') return b.downloads - a.downloads
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'category') return a.category.localeCompare(b.category)
    return 0
  })

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> {PLUGIN_MARKETPLACE.filter((p) => p.verified).length} verified</span>
        <span className="badge badge-cyan"><span className="mono">{filteredPlugins.length} plugins</span></span>
        <span className="badge badge-purple"><span className="mono">{allCategories.length} categories</span></span>
        <span className="badge badge-gray"><span className="mono">sort: {sortBy}</span></span>
      </div>

      <div className="row" style={{ marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#141830', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, padding: '8px 12px', flex: 1, minWidth: 240 }}>
          <span style={{ color: '#6b7494', fontSize: 14 }}>⌕</span>
          <input
            value={filter.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            placeholder="Search marketplace..."
            style={{ flex: 1, background: 'transparent', fontSize: 13, color: '#e8eaf6', border: 'none', outline: 'none' }}
          />
          <span style={{ fontSize: 10, color: '#4a5170' }} className="mono">⌘F</span>
        </div>

        <select value={filter.category} onChange={(e) => setFilter({ category: e.target.value })} className="field-input" style={{ width: 'auto', minWidth: 160, padding: '6px 12px', fontSize: 12 }}>
          <option value="all">All Categories</option>
          {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="field-input" style={{ width: 'auto', minWidth: 140, padding: '6px 12px', fontSize: 12 }}>
          <option value="downloads">Most Downloads</option>
          <option value="rating">Highest Rated</option>
          <option value="name">Name A-Z</option>
        </select>

        <div className="row" style={{ gap: 4 }}>
          <button className={'ws-tab ' + (view === 'grid' ? 'active' : '')} onClick={() => setView('grid')} style={{ padding: '6px 10px' }}><span style={{ fontSize: 14 }}>⊞</span></button>
          <button className={'ws-tab ' + (view === 'list' ? 'active' : '')} onClick={() => setView('list')} style={{ padding: '6px 10px' }}><span style={{ fontSize: 14 }}>☰</span></button>
        </div>
      </div>

      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 12 }}>
          {sortedPlugins.map((plugin) => (
            <MarketplaceCard key={plugin.id} plugin={plugin} />
          ))}
        </div>
      ) : (
        <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 12, fontSize: 9.5, color: '#6b7494', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 600 }} className="mono">
            <span style={{ minWidth: 200, cursor: 'pointer' }} onClick={() => setSortBy('name')}>NAME</span>
            <span style={{ minWidth: 100, cursor: 'pointer' }} onClick={() => setSortBy('category')}>CATEGORY</span>
            <span style={{ minWidth: 80, cursor: 'pointer' }} onClick={() => setSortBy('rating')}>RATING</span>
            <span style={{ minWidth: 100, cursor: 'pointer' }} onClick={() => setSortBy('downloads')}>DOWNLOADS</span>
            <span style={{ minWidth: 80 }}>PRICE</span>
            <span style={{ flex: 1 }}>ACTIONS</span>
          </div>
          <div style={{ padding: '4px 16px', maxHeight: 600, overflowY: 'auto' }}>
            {sortedPlugins.map((plugin) => (
              <div key={plugin.id} className="table-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 200 }}>
                  <span style={{ fontSize: 18, color: plugin.iconColor }}>{plugin.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#e8eaf6' }}>{plugin.name}</span>
                </div>
                <span className={'badge badge-' + CATEGORY_BADGE[plugin.category]} style={{ minWidth: 100, fontSize: 9.5 }}>{plugin.category}</span>
                <span style={{ minWidth: 80, fontSize: 12, fontWeight: 600, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>★ {plugin.rating}</span>
                <span style={{ minWidth: 100, fontSize: 11, color: '#9ba4c0', fontFamily: 'JetBrains Mono, monospace' }}>{plugin.downloads.toLocaleString()}</span>
                <span style={{ minWidth: 80 }}><span className={'badge ' + (plugin.price === 'free' ? 'badge-green' : 'badge-amber')} style={{ fontSize: 9.5 }}>{plugin.price}</span></span>
                <div style={{ flex: 1, display: 'flex', gap: 8 }}>
                  <button className="btn-primary" style={{ fontSize: 10, padding: '3px 8px' }}>Install</button>
                  <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 8px' }}>Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MarketplaceCard({ plugin }: { plugin: any }) {
  return (
    <div className="panel" style={{ cursor: 'pointer', borderLeft: `3px solid ${plugin.iconColor}`, transition: 'all 0.15s' }}>
      <div className="row" style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 22, color: plugin.iconColor }}>{plugin.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#e8eaf6', fontFamily: 'Space Grotesk, sans-serif' }}>{plugin.name}</div>
          <span className={'badge badge-' + CATEGORY_BADGE[plugin.category]} style={{ fontSize: 9.5 }}>{plugin.category}</span>
        </div>
        <span className={'badge ' + (plugin.verified ? 'badge-green' : 'badge-amber')} style={{ fontSize: 9.5 }}>{plugin.verified ? 'Verified' : 'Community'}</span>
      </div>

      <div style={{ fontSize: 11, color: '#9ba4c0', marginBottom: 10, lineHeight: 1.5 }}>{plugin.description}</div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
        {plugin.tags.slice(0, 4).map((tag: string) => (
          <span key={tag} className="collab-chip" style={{ fontSize: 9.5 }}>{tag}</span>
        ))}
        {plugin.tags.length > 4 && <span className="collab-chip" style={{ fontSize: 9.5 }}>+{plugin.tags.length - 4}</span>}
      </div>

      <div className="row" style={{ fontSize: 10.5, color: '#6b7494', gap: 16, marginBottom: 10 }}>
        <span className="mono">★ {plugin.rating}</span>
        <span className="mono">{plugin.downloads.toLocaleString()} downloads</span>
        <span className="mono">v{plugin.version}</span>
        <span className={'badge ' + (plugin.price === 'free' ? 'badge-green' : 'badge-amber')} style={{ fontSize: 9.5 }}>{plugin.price}</span>
      </div>

      <div className="row" style={{ gap: 8 }}>
        <button className="btn-primary" style={{ fontSize: 10, padding: '3px 10px', flex: 1 }}>Install</button>
        <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 10px' }}>Details</button>
      </div>
    </div>
  )
}