import { useState } from 'react'
import { MCP_SERVERS } from '../lib/mcp-data'
import { useMCPStore } from '../stores/MCPStore'

const STATUS_BADGE: Record<string, string> = {
  connected: 'green',
  disconnected: 'gray',
  connecting: 'amber',
  error: 'red',
}

const CATEGORY_BADGE: Record<string, string> = {
  filesystem: 'purple',
  database: 'cyan',
  api: 'green',
  tool: 'amber',
  integration: 'pink',
  custom: 'purple',
}

const TRANSPORT_ICON: Record<string, string> = {
  stdio: '📟',
  sse: '📡',
  websocket: '🔌',
}

export function MCPServers() {
  const { view, setView, filter, setFilter, selectedServer, setSelectedServer } = useMCPStore()
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'status' | 'version' | 'requests' | 'latency'>('name')

  const allCategories = [...new Set(MCP_SERVERS.map((s) => s.category))].sort()

  const filteredServers = MCP_SERVERS.filter((s) => {
    const matchCategory = filter.category === 'all' || s.category === filter.category
    const matchStatus = filter.status === 'all' || s.status === filter.status
    const matchSearch = !filter.search || s.name.toLowerCase().includes(filter.search.toLowerCase()) || s.description.toLowerCase().includes(filter.search.toLowerCase())
    return matchCategory && matchStatus && matchSearch
  })

  const sortedServers = [...filteredServers].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'category') return a.category.localeCompare(b.category)
    if (sortBy === 'status') return a.status.localeCompare(b.status)
    if (sortBy === 'version') return b.version.localeCompare(a.version)
    if (sortBy === 'requests') return b.requestsTotal - a.requestsTotal
    if (sortBy === 'latency') return parseFloat(a.avgLatency) - parseFloat(b.avgLatency)
    return 0
  })

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> {MCP_SERVERS.filter((s) => s.status === 'connected').length} connected</span>
        <span className="badge badge-cyan"><span className="mono">{filteredServers.length} filtered</span></span>
        <span className="badge badge-purple"><span className="mono">{allCategories.length} categories</span></span>
        <span className="badge badge-gray"><span className="mono">view: {view}</span></span>
      </div>

      <div className="row" style={{ marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#141830', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, padding: '8px 12px', flex: 1, minWidth: 240 }}>
          <span style={{ color: '#6b7494', fontSize: 14 }}>⌕</span>
          <input
            value={filter.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            placeholder="Search servers..."
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
          <option value="connected">Connected</option>
          <option value="disconnected">Disconnected</option>
          <option value="connecting">Connecting</option>
          <option value="error">Error</option>
        </select>

        <div className="row" style={{ gap: 4 }}>
          <button className={'ws-tab ' + (view === 'grid' ? 'active' : '')} onClick={() => setView('grid')} style={{ padding: '6px 10px' }}><span style={{ fontSize: 14 }}>⊞</span></button>
          <button className={'ws-tab ' + (view === 'list' ? 'active' : '')} onClick={() => setView('list')} style={{ padding: '6px 10px' }}><span style={{ fontSize: 14 }}>☰</span></button>
        </div>
      </div>

      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 12 }}>
          {sortedServers.map((server) => (
            <ServerCard key={server.id} server={server} isSelected={selectedServer?.id === server.id} onClick={() => setSelectedServer(server)} />
          ))}
        </div>
      ) : (
        <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 12, fontSize: 9.5, color: '#6b7494', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 600 }} className="mono">
            <span style={{ minWidth: 200, cursor: 'pointer' }} onClick={() => setSortBy('name')}>NAME</span>
            <span style={{ minWidth: 100, cursor: 'pointer' }} onClick={() => setSortBy('category')}>CATEGORY</span>
            <span style={{ minWidth: 100, cursor: 'pointer' }} onClick={() => setSortBy('status')}>STATUS</span>
            <span style={{ minWidth: 80, cursor: 'pointer' }} onClick={() => setSortBy('requests')}>REQUESTS</span>
            <span style={{ minWidth: 80, cursor: 'pointer' }} onClick={() => setSortBy('latency')}>LATENCY</span>
            <span style={{ flex: 1 }}>ACTIONS</span>
          </div>
          <div style={{ padding: '4px 16px', maxHeight: 600, overflowY: 'auto' }}>
            {sortedServers.map((server) => (
              <div key={server.id} className="table-row" style={{ cursor: 'pointer', background: selectedServer?.id === server.id ? 'rgba(217, 70, 239, 0.08)' : 'transparent' }} onClick={() => setSelectedServer(server)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 200 }}>
                  <span style={{ fontSize: 18, color: server.iconColor }}>{server.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#e8eaf6' }}>{server.name}</span>
                </div>
                <span className={'badge badge-' + CATEGORY_BADGE[server.category]} style={{ minWidth: 100, fontSize: 9.5 }}>{server.category}</span>
                <span style={{ minWidth: 100 }}><span className={'badge badge-' + STATUS_BADGE[server.status]}>{server.status}</span></span>
                <span style={{ minWidth: 80, fontSize: 11, color: '#9ba4c0', fontFamily: 'JetBrains Mono, monospace' }}>{server.requestsTotal.toLocaleString()}</span>
                <span style={{ minWidth: 80, fontSize: 11, color: '#9ba4c0', fontFamily: 'JetBrains Mono, monospace' }}>{server.avgLatency}</span>
                <div style={{ flex: 1, display: 'flex', gap: 8 }}>
                  <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 8px' }} onClick={(e) => { e.stopPropagation(); }}>{server.status === 'connected' ? 'Disconnect' : 'Connect'}</button>
                  <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 8px' }} onClick={(e) => { e.stopPropagation(); }}>Tools</button>
                  <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 8px' }} onClick={(e) => { e.stopPropagation(); }}>Configure</button>
                  <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 8px', color: '#ff4d6d', borderColor: '#ff4d6d' }} onClick={(e) => { e.stopPropagation(); }}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedServer && <ServerDetailDrawer server={selectedServer} onClose={() => setSelectedServer(null)} />}
    </div>
  )
}

function ServerCard({ server, isSelected, onClick }: { server: any; isSelected: boolean; onClick: () => void }) {
  return (
    <div
      className={'panel ' + (isSelected ? 'selected' : '')}
      style={{ cursor: 'pointer', borderLeft: `3px solid ${server.iconColor}`, transition: 'all 0.15s' }}
      onClick={onClick}
    >
      <div className="row" style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 22, color: server.iconColor }}>{server.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#e8eaf6', fontFamily: 'Space Grotesk, sans-serif' }}>{server.name}</div>
          <span className={'badge badge-' + CATEGORY_BADGE[server.category]} style={{ fontSize: 9.5 }}>{server.category}</span>
        </div>
        <span className={'badge badge-' + STATUS_BADGE[server.status]} style={{ fontSize: 9.5 }}>{server.status}</span>
      </div>

      <div style={{ fontSize: 11, color: '#9ba4c0', marginBottom: 10, lineHeight: 1.5 }}>{server.description}</div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
        {server.tags.slice(0, 4).map((tag: string) => (
          <span key={tag} className="collab-chip" style={{ fontSize: 9.5 }}>{tag}</span>
        ))}
        {server.tags.length > 4 && <span className="collab-chip" style={{ fontSize: 9.5 }}>+{server.tags.length - 4}</span>}
      </div>

      <div className="row" style={{ fontSize: 10.5, color: '#6b7494', gap: 16 }}>
        <span className="mono">v{server.version}</span>
        <span className="mono">{TRANSPORT_ICON[server.transport]} {server.transport.toUpperCase()}</span>
        <span className="mono">{server.tools.length} tools</span>
        <span className="mono">{server.resources.length} resources</span>
      </div>

      <div className="row" style={{ fontSize: 10.5, color: '#6b7494', gap: 16, marginTop: 4 }}>
        <span className="mono">{server.requestsTotal.toLocaleString()} req</span>
        <span className="mono">{(server.requestsSuccess / (server.requestsTotal || 1) * 100).toFixed(1)}% ok</span>
        <span className="mono">{server.avgLatency}</span>
        <span className="mono">up: {server.uptime}</span>
      </div>

      <div className="row" style={{ marginTop: 8, gap: 8 }}>
        <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 8px', flex: 1 }} onClick={(e) => { e.stopPropagation(); }}>{server.status === 'connected' ? 'Disconnect' : 'Connect'}</button>
        <button className="btn-primary" style={{ fontSize: 10, padding: '3px 8px' }} onClick={(e) => { e.stopPropagation(); }}>Explore Tools</button>
        <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 8px' }} onClick={(e) => { e.stopPropagation(); }}>Configure</button>
      </div>
    </div>
  )
}

function ServerDetailDrawer({ server, onClose }: { server: any; onClose: () => void }) {
  const successRate = server.requestsTotal > 0 ? (server.requestsSuccess / server.requestsTotal * 100).toFixed(1) : '0.0'

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
      <div className="drawer-header">
        <div>
          <div style={{ fontSize: 12, color: server.iconColor, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>{server.icon} {server.category.toUpperCase()}</div>
          <h2>{server.name}</h2>
        </div>
        <button className="drawer-close" onClick={onClose}>✕</button>
      </div>
      <div className="drawer-body">
        <div className="grid2" style={{ marginBottom: 16 }}>
          <div><div className="stat-label">VERSION</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6' }}>{server.version}</div></div>
          <div><div className="stat-label">AUTHOR</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6' }}>{server.author}</div></div>
          <div><div className="stat-label">STATUS</div><span className={'badge badge-' + STATUS_BADGE[server.status]}>{server.status}</span></div>
          <div><div className="stat-label">CATEGORY</div><span className={'badge badge-' + CATEGORY_BADGE[server.category]}>{server.category}</span></div>
          <div><div className="stat-label">TRANSPORT</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6' }}>{TRANSPORT_ICON[server.transport]} {server.transport.toUpperCase()}</div></div>
          <div><div className="stat-label">ENDPOINT</div><div style={{ fontSize: 12, fontWeight: 500, color: '#9ba4c0', fontFamily: 'JetBrains Mono, monospace' }}>{server.endpoint}</div></div>
          <div><div className="stat-label">INSTALLED</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{server.installDate}</div></div>
          <div><div className="stat-label">UPDATED</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{server.lastUpdate}</div></div>
          <div><div className="stat-label">LAST CONNECTED</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6' }}>{server.lastConnected}</div></div>
          <div><div className="stat-label">UPTIME</div><div style={{ fontSize: 14, fontWeight: 500, color: '#22d97a' }}>{server.uptime}</div></div>
          <div><div className="stat-label">TOTAL REQUESTS</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{server.requestsTotal.toLocaleString()}</div></div>
          <div><div className="stat-label">SUCCESS RATE</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6' }}>{successRate}%</div></div>
          <div><div className="stat-label">AVG LATENCY</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{server.avgLatency}</div></div>
        </div>

        <div className="section-label"><span className="ico">⚙</span> CONFIGURATION</div>
        <div style={{ background: '#0a0d1a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 12, fontSize: 10, color: '#9ba4c0', fontFamily: 'JetBrains Mono, monospace', maxHeight: 150, overflowY: 'auto', whiteSpace: 'pre-wrap', marginBottom: 16 }}>
          {JSON.stringify(server.config, null, 2)}
        </div>

        <div className="section-label"><span className="ico">✦</span> TOOLS · {server.tools.length}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          {server.tools.map((tool: any) => (
            <div key={tool.name} className="panel-sm">
              <div className="row">
                <span style={{ fontSize: 12, fontWeight: 500, color: '#e8eaf6', minWidth: 160, fontFamily: 'JetBrains Mono, monospace' }}>{tool.name}</span>
                <span style={{ fontSize: 10.5, color: '#9ba4c0', flex: 1 }}>{tool.description}</span>
              </div>
              <div style={{ fontSize: 9, color: '#6b7494', marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>
                schema: {JSON.stringify(tool.inputSchema).slice(0, 100)}...
              </div>
            </div>
          ))}
        </div>

        {server.resources.length > 0 && (
          <>
            <div className="section-label"><span className="ico">◧</span> RESOURCES · {server.resources.length}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              {server.resources.map((resource: any) => (
                <div key={resource.uri} className="panel-sm">
                  <div className="row">
                    <span style={{ fontSize: 12, fontWeight: 500, color: '#e8eaf6', minWidth: 160 }}>{resource.name}</span>
                    <span style={{ fontSize: 10.5, color: '#9ba4c0', flex: 1 }}>{resource.description}</span>
                  </div>
                  <div style={{ fontSize: 9, color: '#6b7494', marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>{resource.uri}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {server.prompts.length > 0 && (
          <>
            <div className="section-label"><span className="ico">◉</span> PROMPTS · {server.prompts.length}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              {server.prompts.map((prompt: any) => (
                <div key={prompt.name} className="panel-sm">
                  <div className="row">
                    <span style={{ fontSize: 12, fontWeight: 500, color: '#e8eaf6', minWidth: 160 }}>{prompt.name}</span>
                    <span style={{ fontSize: 10.5, color: '#9ba4c0', flex: 1 }}>{prompt.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="section-label"><span className="ico">⚠</span> CAPABILITIES</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {server.capabilities.map((cap: string) => (
            <span key={cap} className="badge badge-cyan" style={{ fontSize: 10 }}>{cap}</span>
          ))}
        </div>

        <div className="row" style={{ gap: 8, marginTop: 24 }}>
          <button className="btn-primary" onClick={onClose}>Close</button>
          <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); }}>{server.status === 'connected' ? 'Disconnect' : 'Connect'}</button>
          <button className="btn-primary" onClick={(e) => { e.stopPropagation(); }}>Test Connection</button>
          <button className="btn-secondary" style={{ color: '#ff4d6d', borderColor: '#ff4d6d' }} onClick={(e) => { e.stopPropagation(); }}>Remove</button>
        </div>
      </div>
    </div>
    </>
  )
}