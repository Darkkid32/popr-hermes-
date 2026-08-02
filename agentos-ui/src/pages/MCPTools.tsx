import { useState } from 'react'
import { MCP_SERVERS } from '../lib/mcp-data'

export function MCPTools() {
  const allTools = MCP_SERVERS.flatMap((server) =>
    server.tools.map((tool) => ({ ...tool, serverId: server.id, serverName: server.name, serverIcon: server.icon, serverColor: server.iconColor }))
  )

  const allResources = MCP_SERVERS.flatMap((server) =>
    server.resources.map((resource) => ({ ...resource, serverId: server.id, serverName: server.name, serverIcon: server.icon, serverColor: server.iconColor }))
  )

  const allPrompts = MCP_SERVERS.flatMap((server) =>
    server.prompts.map((prompt) => ({ ...prompt, serverId: server.id, serverName: server.name, serverIcon: server.icon, serverColor: server.iconColor }))
  )

  const [tab, setTab] = useState<'tools' | 'resources' | 'prompts'>('tools')
  const [search, setSearch] = useState('')

  const filteredTools = allTools.filter((t) => !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()))
  const filteredResources = allResources.filter((r) => !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()))
  const filteredPrompts = allPrompts.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> {allTools.length} tools</span>
        <span className="badge badge-cyan"><span className="mono">{allResources.length} resources</span></span>
        <span className="badge badge-purple"><span className="mono">{allPrompts.length} prompts</span></span>
        <span className="badge badge-gray"><span className="mono">{MCP_SERVERS.filter(s => s.status === 'connected').length} servers</span></span>
      </div>

      <div className="row" style={{ marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div className="row" style={{ gap: 4 }}>
          <button className={'ws-tab ' + (tab === 'tools' ? 'active' : '')} onClick={() => setTab('tools')}>
            <span className="ico">✦</span> Tools ({filteredTools.length})
          </button>
          <button className={'ws-tab ' + (tab === 'resources' ? 'active' : '')} onClick={() => setTab('resources')}>
            <span className="ico">◧</span> Resources ({filteredResources.length})
          </button>
          <button className={'ws-tab ' + (tab === 'prompts' ? 'active' : '')} onClick={() => setTab('prompts')}>
            <span className="ico">◉</span> Prompts ({filteredPrompts.length})
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#141830', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, padding: '8px 12px', flex: 1, minWidth: 240 }}>
          <span style={{ color: '#6b7494', fontSize: 14 }}>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            style={{ flex: 1, background: 'transparent', fontSize: 13, color: '#e8eaf6', border: 'none', outline: 'none' }}
          />
          <span style={{ fontSize: 10, color: '#4a5170' }} className="mono">⌘F</span>
        </div>
      </div>

      {tab === 'tools' && (
        <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 12, fontSize: 9.5, color: '#6b7494', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 600 }} className="mono">
            <span style={{ minWidth: 180 }}>TOOL</span>
            <span style={{ minWidth: 120 }}>SERVER</span>
            <span style={{ flex: 1 }}>DESCRIPTION</span>
            <span style={{ minWidth: 200 }}>SCHEMA</span>
          </div>
          <div style={{ padding: '4px 16px', maxHeight: 500, overflowY: 'auto' }}>
            {filteredTools.map((tool, i) => (
              <div key={i} className="table-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 180 }}>
                  <span style={{ fontSize: 16, color: tool.serverColor }}>{tool.serverIcon}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{tool.name}</span>
                </div>
                <div style={{ minWidth: 120 }}>
                  <span className="badge badge-purple" style={{ fontSize: 9.5 }}>{tool.serverName}</span>
                </div>
                <span style={{ fontSize: 11, color: '#9ba4c0', flex: 1 }}>{tool.description}</span>
                <div style={{ minWidth: 200, fontSize: 9, color: '#6b7494', fontFamily: 'JetBrains Mono, monospace' }}>
                  {JSON.stringify(tool.inputSchema).slice(0, 100)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'resources' && (
        <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 12, fontSize: 9.5, color: '#6b7494', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 600 }} className="mono">
            <span style={{ minWidth: 180 }}>RESOURCE</span>
            <span style={{ minWidth: 120 }}>SERVER</span>
            <span style={{ flex: 1 }}>DESCRIPTION</span>
            <span style={{ minWidth: 150 }}>URI</span>
            <span style={{ minWidth: 100 }}>MIME TYPE</span>
          </div>
          <div style={{ padding: '4px 16px', maxHeight: 500, overflowY: 'auto' }}>
            {filteredResources.map((resource, i) => (
              <div key={i} className="table-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 180 }}>
                  <span style={{ fontSize: 16, color: resource.serverColor }}>{resource.serverIcon}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: '#e8eaf6' }}>{resource.name}</span>
                </div>
                <div style={{ minWidth: 120 }}>
                  <span className="badge badge-purple" style={{ fontSize: 9.5 }}>{resource.serverName}</span>
                </div>
                <span style={{ fontSize: 11, color: '#9ba4c0', flex: 1 }}>{resource.description}</span>
                <span style={{ minWidth: 150, fontSize: 10, color: '#6b7494', fontFamily: 'JetBrains Mono, monospace' }}>{resource.uri}</span>
                <span style={{ minWidth: 100, fontSize: 10, color: '#6b7494' }}>{resource.mimeType}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'prompts' && (
        <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 12, fontSize: 9.5, color: '#6b7494', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 600 }} className="mono">
            <span style={{ minWidth: 180 }}>PROMPT</span>
            <span style={{ minWidth: 120 }}>SERVER</span>
            <span style={{ flex: 1 }}>DESCRIPTION</span>
            <span style={{ minWidth: 200 }}>ARGUMENTS</span>
          </div>
          <div style={{ padding: '4px 16px', maxHeight: 500, overflowY: 'auto' }}>
            {filteredPrompts.map((prompt, i) => (
              <div key={i} className="table-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 180 }}>
                  <span style={{ fontSize: 16, color: prompt.serverColor }}>{prompt.serverIcon}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{prompt.name}</span>
                </div>
                <div style={{ minWidth: 120 }}>
                  <span className="badge badge-purple" style={{ fontSize: 9.5 }}>{prompt.serverName}</span>
                </div>
                <span style={{ fontSize: 11, color: '#9ba4c0', flex: 1 }}>{prompt.description}</span>
                <div style={{ minWidth: 200, fontSize: 9, color: '#6b7494', fontFamily: 'JetBrains Mono, monospace' }}>
                  {JSON.stringify(prompt.arguments).slice(0, 100)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}