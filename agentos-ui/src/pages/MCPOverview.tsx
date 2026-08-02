import { MCP_SERVERS, MCP_MARKETPLACE } from '../lib/mcp-data'
import { StatusPills, SectionLabel } from '../components/ui'

const STATUS_BADGE: Record<string, string> = {
  connected: 'green',
  disconnected: 'gray',
  connecting: 'amber',
  error: 'red',
}

export function MCPOverview() {
  const connectedCount = MCP_SERVERS.filter((s) => s.status === 'connected').length
  const disconnectedCount = MCP_SERVERS.filter((s) => s.status === 'disconnected').length
  const errorCount = MCP_SERVERS.filter((s) => s.status === 'error').length
  const totalRequests = MCP_SERVERS.reduce((sum, s) => sum + s.requestsTotal, 0)
  const totalTools = MCP_SERVERS.reduce((sum, s) => sum + s.tools.length, 0)

  return (
    <div className="page-body">
      <StatusPills pills={[
        { label: <><span className="dot dot-green" aria-hidden="true" /> {connectedCount} connected</>, tone: 'green', dot: true },
        { label: <><span className="mono">{disconnectedCount} disconnected</span></>, tone: 'gray' },
        { label: <><span className="mono">{errorCount} errors</span></>, tone: 'red' },
        { label: <><span className="mono">{MCP_SERVERS.length} servers · {totalTools} tools · {totalRequests.toLocaleString()} requests</span></>, tone: 'cyan' },
      ]} />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 20 }}>
        <div className="col-stack">
          <div className="panel">
                      <SectionLabel icon="⬢">CONNECTED SERVERS · {MCP_SERVERS.length}</SectionLabel>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {MCP_SERVERS.slice(0, 8).map((server) => (
                          <div key={server.id} className="table-row" style={{ cursor: 'pointer' }}>
                            <span style={{ fontSize: 18, color: server.iconColor, width: 24, textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif' }}>{server.icon}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 500, color: '#e8eaf6' }}>{server.name}</div>
                              <div style={{ fontSize: 10.5, color: '#6b7494' }}>{server.description}</div>
                            </div>
                            <span className={'badge badge-' + STATUS_BADGE[server.status]} style={{ fontSize: 9.5 }}>{server.status}</span>
                            <span className="badge badge-purple" style={{ fontSize: 9.5 }}>{server.version}</span>
                            <span style={{ fontSize: 10, color: '#6b7494', fontFamily: 'JetBrains Mono, monospace', minWidth: 80 }}>{server.category}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="panel">
                      <SectionLabel icon="✦">TOOLS BY CATEGORY</SectionLabel>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {(['filesystem', 'database', 'api', 'tool', 'integration', 'custom'] as const).map((cat) => {
                          const servers = MCP_SERVERS.filter((s) => s.category === cat)
                          const tools = servers.reduce((sum, s) => sum + s.tools.length, 0)
                          const connected = servers.filter((s) => s.status === 'connected').length
                          return (
                            <div key={cat}>
                              <div className="row" style={{ marginBottom: 6 }}>
                                <span style={{ fontSize: 16, color: '#00e5ff' }}>{cat === 'filesystem' ? '◧' : cat === 'database' ? '⬢' : cat === 'api' ? '⌘' : cat === 'tool' ? '✦' : cat === 'integration' ? '⊕' : '◬'}</span>
                                <span style={{ fontSize: 13, fontWeight: 500, color: '#e8eaf6', textTransform: 'capitalize' }}>{cat}</span>
                                <div className="spacer" />
                                <span className="badge badge-green">{connected} connected</span>
                                <span className="badge badge-gray">{tools} tools</span>
                              </div>
                              <div className="progress-bar">
                                <div className="progress-fill" style={{ width: servers.length > 0 ? (connected / servers.length) * 100 : 0 + '%', background: '#00e5ff' }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="col-stack">
                    <div className="panel">
                      <SectionLabel icon="⊕">MARKETPLACE HIGHLIGHTS</SectionLabel>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {MCP_MARKETPLACE.slice(0, 5).map((s) => (
                          <div key={s.id} className="panel-sm">
                            <div className="row" style={{ marginBottom: 8 }}>
                              <span style={{ fontSize: 18, color: s.iconColor }}>{s.icon}</span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 12.5, fontWeight: 500, color: '#e8eaf6' }}>{s.name}</div>
                                <div style={{ fontSize: 10, color: '#6b7494' }}>{s.description}</div>
                              </div>
                              <span className={'badge ' + (s.verified ? 'badge-green' : 'badge-amber')} style={{ fontSize: 9.5 }}>{s.verified ? 'Verified' : 'Community'}</span>
                              <span className="badge badge-gray" style={{ fontSize: 9.5 }}>{s.price}</span>
                            </div>
                            <div className="row" style={{ gap: 8, fontSize: 10, color: '#6b7494' }}>
                              <span className="mono">{s.downloads.toLocaleString()} downloads</span>
                              <span className="mono">★ {s.rating}</span>
                              <span className="mono">v{s.version}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="panel">
                      <SectionLabel icon="∿">REQUEST VOLUME</SectionLabel>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {MCP_SERVERS
                          .filter((s) => s.requestsTotal > 0)
                          .sort((a, b) => b.requestsTotal - a.requestsTotal)
                          .slice(0, 5)
                          .map((s) => (
                            <div key={s.id} className="panel-sm">
                              <div className="row" style={{ marginBottom: 4 }}>
                                <span style={{ fontSize: 16, color: s.iconColor }}>{s.icon}</span>
                                <span style={{ fontSize: 12.5, fontWeight: 500, color: '#e8eaf6', flex: 1 }}>{s.name}</span>
                              </div>
                              <div className="row" style={{ gap: 12, fontSize: 10, color: '#6b7494' }}>
                                <span className="mono">{s.requestsTotal.toLocaleString()} req</span>
                                <span className="mono">{(s.requestsSuccess / s.requestsTotal * 100).toFixed(1)}% ok</span>
                                <span className="mono">{s.avgLatency}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="panel">
                      <SectionLabel icon="⚙">QUICK ACTIONS</SectionLabel>
                      <div className="grid2">
                        <button className="btn-secondary" style={{ justifyContent: 'flex-start', gap: 8 }}><span style={{ fontSize: 16 }}>➕</span> Add Server</button>
                        <button className="btn-secondary" style={{ justifyContent: 'flex-start', gap: 8 }}><span style={{ fontSize: 16 }}>🔄</span> Reconnect All</button>
                        <button className="btn-secondary" style={{ justifyContent: 'flex-start', gap: 8 }}><span style={{ fontSize: 16 }}>📦</span> Browse Marketplace</button>
                        <button className="btn-secondary" style={{ justifyContent: 'flex-start', gap: 8 }}><span style={{ fontSize: 16 }}>🔧</span> Configure Transports</button>
                      </div>
                    </div>
        </div>
      </div>
    </div>
  )
}