import { useState } from 'react'
import { PLUGINS } from '../lib/plugins-data'
import { usePluginsStore } from '../stores/PluginsStore'

const STATUS_BADGE: Record<string, string> = {
  enabled: 'green',
  disabled: 'gray',
  error: 'red',
  updating: 'amber',
}

const CATEGORY_BADGE: Record<string, string> = {
  tool: 'purple',
  integration: 'cyan',
  workflow: 'amber',
  ui: 'pink',
  utility: 'green',
  model: 'cyan',
}

export function PluginsInstalled() {
  const { view, setView, filter, setFilter, selectedPlugin, setSelectedPlugin } = usePluginsStore()
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'status' | 'version' | 'updated'>('name')

  const allCategories = [...new Set(PLUGINS.map((p) => p.category))].sort()

  const filteredPlugins = PLUGINS.filter((p) => {
    const matchCategory = filter.category === 'all' || p.category === filter.category
    const matchStatus = filter.status === 'all' || p.status === filter.status
    const matchSearch = !filter.search || p.name.toLowerCase().includes(filter.search.toLowerCase()) || p.description.toLowerCase().includes(filter.search.toLowerCase())
    return matchCategory && matchStatus && matchSearch
  })

  const sortedPlugins = [...filteredPlugins].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'category') return a.category.localeCompare(b.category)
    if (sortBy === 'status') return a.status.localeCompare(b.status)
    if (sortBy === 'version') return b.version.localeCompare(a.version)
    if (sortBy === 'updated') return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime()
    return 0
  })

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> {PLUGINS.filter((p) => p.status === 'enabled').length} enabled</span>
        <span className="badge badge-cyan"><span className="mono">{filteredPlugins.length} filtered</span></span>
        <span className="badge badge-purple"><span className="mono">{allCategories.length} categories</span></span>
        <span className="badge badge-gray"><span className="mono">view: {view}</span></span>
      </div>

      <div className="row" style={{ marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#141830', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, padding: '8px 12px', flex: 1, minWidth: 240 }}>
          <span style={{ color: '#6b7494', fontSize: 14 }}>⌕</span>
          <input
            value={filter.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            placeholder="Search plugins..."
            style={{ flex: 1, background: 'transparent', fontSize: 13, color: '#e8eaf6', border: 'none', outline: 'none' }}
          />
          <span style={{ fontSize: 10, color: '#4a5170' }} className="mono">⌘F</span>
        </div>

        <select value={filter.category} onChange={(e) => setFilter({ category: e.target.value })} className="field-input" style={{ width: 'auto', minWidth: 160, padding: '6px 12px', fontSize: 12 }}>
          <option value="all">All Categories</option>
          {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={filter.status} onChange={(e) => setFilter({ status: e.target.value })} className="field-input" style={{ width: 'auto', minWidth: 140, padding: '6px 12px', fontSize: 12 }}>
          <option value="all">All Status</option>
          <option value="enabled">Enabled</option>
          <option value="disabled">Disabled</option>
          <option value="error">Error</option>
          <option value="updating">Updating</option>
        </select>

        <div className="row" style={{ gap: 4 }}>
          <button className={'ws-tab ' + (view === 'grid' ? 'active' : '')} onClick={() => setView('grid')} style={{ padding: '6px 10px' }}><span style={{ fontSize: 14 }}>⊞</span></button>
          <button className={'ws-tab ' + (view === 'list' ? 'active' : '')} onClick={() => setView('list')} style={{ padding: '6px 10px' }}><span style={{ fontSize: 14 }}>☰</span></button>
        </div>
      </div>

      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 12 }}>
          {sortedPlugins.map((plugin) => (
            <PluginCard key={plugin.id} plugin={plugin} isSelected={selectedPlugin?.id === plugin.id} onClick={() => setSelectedPlugin(plugin)} />
          ))}
        </div>
      ) : (
        <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 12, fontSize: 9.5, color: '#6b7494', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 600 }} className="mono">
            <span style={{ minWidth: 200, cursor: 'pointer' }} onClick={() => setSortBy('name')}>NAME</span>
            <span style={{ minWidth: 100, cursor: 'pointer' }} onClick={() => setSortBy('category')}>CATEGORY</span>
            <span style={{ minWidth: 100, cursor: 'pointer' }} onClick={() => setSortBy('status')}>STATUS</span>
            <span style={{ minWidth: 80, cursor: 'pointer' }} onClick={() => setSortBy('version')}>VERSION</span>
            <span style={{ minWidth: 100, cursor: 'pointer' }} onClick={() => setSortBy('updated')}>UPDATED</span>
            <span style={{ flex: 1 }}>ACTIONS</span>
          </div>
          <div style={{ padding: '4px 16px', maxHeight: 600, overflowY: 'auto' }}>
            {sortedPlugins.map((plugin) => (
              <div key={plugin.id} className="table-row" style={{ cursor: 'pointer', background: selectedPlugin?.id === plugin.id ? 'rgba(217, 70, 239, 0.08)' : 'transparent' }} onClick={() => setSelectedPlugin(plugin)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 200 }}>
                  <span style={{ fontSize: 18, color: plugin.iconColor }}>{plugin.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#e8eaf6' }}>{plugin.name}</span>
                </div>
                <span className={'badge badge-' + CATEGORY_BADGE[plugin.category]} style={{ minWidth: 100, fontSize: 9.5 }}>{plugin.category}</span>
                <span style={{ minWidth: 100 }}><span className={'badge badge-' + STATUS_BADGE[plugin.status]}>{plugin.status}</span></span>
                <span style={{ minWidth: 80, fontSize: 11, color: '#9ba4c0', fontFamily: 'JetBrains Mono, monospace' }}>{plugin.version}</span>
                <span style={{ minWidth: 100, fontSize: 11, color: '#6b7494', fontFamily: 'JetBrains Mono, monospace' }}>{plugin.lastUpdate}</span>
                <div style={{ flex: 1, display: 'flex', gap: 8 }}>
                  <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 8px' }} onClick={(e) => { e.stopPropagation(); }}>{plugin.status === 'enabled' ? 'Disable' : 'Enable'}</button>
                  <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 8px' }} onClick={(e) => { e.stopPropagation(); }}>Configure</button>
                  <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 8px', color: '#ff4d6d', borderColor: '#ff4d6d' }} onClick={(e) => { e.stopPropagation(); }}>Uninstall</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedPlugin && <PluginDetailDrawer plugin={selectedPlugin} onClose={() => setSelectedPlugin(null)} />}
    </div>
  )
}

function PluginCard({ plugin, isSelected, onClick }: { plugin: any; isSelected: boolean; onClick: () => void }) {
  return (
    <div
      className={'panel ' + (isSelected ? 'selected' : '')}
      style={{ cursor: 'pointer', borderLeft: `3px solid ${plugin.iconColor}`, transition: 'all 0.15s' }}
      onClick={onClick}
    >
      <div className="row" style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 22, color: plugin.iconColor }}>{plugin.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#e8eaf6', fontFamily: 'Space Grotesk, sans-serif' }}>{plugin.name}</div>
          <span className={'badge badge-' + CATEGORY_BADGE[plugin.category]} style={{ fontSize: 9.5 }}>{plugin.category}</span>
        </div>
        <span className={'badge badge-' + STATUS_BADGE[plugin.status]} style={{ fontSize: 9.5 }}>{plugin.status}</span>
      </div>

      <div style={{ fontSize: 11, color: '#9ba4c0', marginBottom: 10, lineHeight: 1.5 }}>{plugin.description}</div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
        {plugin.tags.slice(0, 4).map((tag: string) => (
          <span key={tag} className="collab-chip" style={{ fontSize: 9.5 }}>{tag}</span>
        ))}
        {plugin.tags.length > 4 && <span className="collab-chip" style={{ fontSize: 9.5 }}>+{plugin.tags.length - 4}</span>}
      </div>

      <div className="row" style={{ fontSize: 10.5, color: '#6b7494', gap: 16 }}>
        <span className="mono">v{plugin.version}</span>
        <span className="mono">{(plugin.size)}</span>
        <span className="mono">{plugin.lastUpdate}</span>
        <span className="mono">{plugin.downloads.toLocaleString()} dl</span>
      </div>

      <div className="row" style={{ marginTop: 8, gap: 8 }}>
        <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 8px', flex: 1 }} onClick={(e) => { e.stopPropagation(); }}>{plugin.status === 'enabled' ? 'Disable' : 'Enable'}</button>
        <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 8px' }} onClick={(e) => { e.stopPropagation(); }}>Configure</button>
      </div>
    </div>
  )
}

function PluginDetailDrawer({ plugin, onClose }: { plugin: any; onClose: () => void }) {
  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
      <div className="drawer-header">
        <div>
          <div style={{ fontSize: 12, color: plugin.iconColor, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>{plugin.icon} {plugin.category.toUpperCase()}</div>
          <h2>{plugin.name}</h2>
        </div>
        <button className="drawer-close" onClick={onClose}>✕</button>
      </div>
      <div className="drawer-body">
        <div className="grid2" style={{ marginBottom: 16 }}>
          <div><div className="stat-label">VERSION</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6' }}>{plugin.version}</div></div>
          <div><div className="stat-label">AUTHOR</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6' }}>{plugin.author}</div></div>
          <div><div className="stat-label">STATUS</div><span className={'badge badge-' + STATUS_BADGE[plugin.status]}>{plugin.status}</span></div>
          <div><div className="stat-label">CATEGORY</div><span className={'badge badge-' + CATEGORY_BADGE[plugin.category]}>{plugin.category}</span></div>
          <div><div className="stat-label">INSTALLED</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{plugin.installDate}</div></div>
          <div><div className="stat-label">UPDATED</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{plugin.lastUpdate}</div></div>
          <div><div className="stat-label">SIZE</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6' }}>{plugin.size}</div></div>
          <div><div className="stat-label">RATING</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6' }}>★ {plugin.rating} ({plugin.downloads.toLocaleString()} downloads)</div></div>
        </div>

        <div className="section-label"><span className="ico">⌘</span> CAPABILITIES</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {plugin.capabilities.map((cap: string) => (
            <span key={cap} className="badge badge-cyan" style={{ fontSize: 10 }}>{cap}</span>
          ))}
        </div>

        <div className="section-label"><span className="ico">⚠</span> PERMISSIONS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          {plugin.permissions.map((perm: string) => (
            <div key={perm} className="row">
              <span className="badge badge-amber" style={{ fontSize: 9.5, minWidth: 160 }}>{perm}</span>
              <span style={{ fontSize: 10.5, color: '#9ba4c0', flex: 1 }}>{getPermissionDescription(perm)}</span>
            </div>
          ))}
        </div>

        <div className="section-label"><span className="ico">⊕</span> DEPENDENCIES</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {plugin.dependencies.length > 0 ? (
            plugin.dependencies.map((dep: string) => (
              <span key={dep} className="collab-chip">{dep}</span>
            ))
          ) : (
            <span style={{ color: '#6b7494', fontSize: 12 }}>No dependencies</span>
          )}
        </div>

        <div className="section-label"><span className="ico">◴</span> CHANGELOG</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16, fontSize: 11, color: '#9ba4c0' }}>
          {plugin.changelog.map((entry: string, i: number) => (
            <div key={i} className="row">
              <span style={{ color: '#00e5ff', minWidth: 20 }}>•</span>
              <span>{entry}</span>
            </div>
          ))}
        </div>

        <div className="row" style={{ gap: 8, marginTop: 24 }}>
          <button className="btn-primary" onClick={onClose}>Close</button>
          <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); }}>{plugin.status === 'enabled' ? 'Disable' : 'Enable'}</button>
          <button className="btn-secondary" style={{ color: '#ff4d6d', borderColor: '#ff4d6d' }} onClick={(e) => { e.stopPropagation(); }}>Uninstall</button>
        </div>
      </div>
    </div>
    </>
  )
}

function getPermissionDescription(perm: string) {
  const descriptions: Record<string, string> = {
    'filesystem.read': 'Read files from the workspace',
    'filesystem.write': 'Write files to the workspace',
    'filesystem.full': 'Full filesystem access',
    'git.read': 'Read git repository information',
    'git.full': 'Full git access (commit, push, branch)',
    'network.localhost': 'Access localhost services',
    'network.outbound': 'Make outbound network requests',
    'process.exec': 'Execute shell commands',
    'gpu.access': 'Access GPU for inference',
    'secrets.read': 'Read secrets from vault',
    'schedule.manage': 'Manage scheduled jobs',
    'webhook.receive': 'Receive incoming webhooks',
    'vscode.api': 'Access VS Code extension API',
    'terminal.access': 'Access integrated terminal',
    'bot.token': 'Use bot authentication token',
    'guild.read': 'Read Discord guild information',
    'github.token': 'Use GitHub authentication token',
    'repo.read': 'Read repository data',
    'repo.write': 'Write repository data',
    'linear.token': 'Use Linear authentication token',
    'workspace.read': 'Read workspace data',
    'workspace.write': 'Write workspace data',
    'notion.token': 'Use Notion authentication token',
    'slack.token': 'Use Slack authentication token',
    'channels.read': 'Read Slack channels',
    'chat.write': 'Write Slack messages',
  }
  return descriptions[perm] || 'Custom permission'
}