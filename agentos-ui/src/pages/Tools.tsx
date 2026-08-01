import { TOOLS, CAPABILITIES } from '../lib/demo-data'

export function Tools() {
  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> {TOOLS.filter((t) => t.status === 'enabled').length} enabled</span>
        <span className="badge badge-cyan"><span className="mono">{TOOLS.length} tools total</span></span>
        <span className="badge badge-purple"><span className="mono">{CAPABILITIES.length} capabilities</span></span>
        <span className="badge badge-gray"><span className="mono">runtime v9.0.0</span></span>
      </div>

      <div className="section-label" style={{ marginBottom: 12 }}>
        <span className="ico">✦</span>
        INSTALLED TOOLS
      </div>
      <div className="grid2">
        {TOOLS.map((tool) => (
          <div key={tool.id} className="panel row" style={{ alignItems: 'flex-start' }}>
            <span style={{ fontSize: 22, color: tool.iconColor, fontWeight: 700, width: 30, textAlign: 'center', flexShrink: 0, fontFamily: 'Space Grotesk, sans-serif' }}>{tool.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e8eaf6', fontFamily: 'Space Grotesk, sans-serif' }}>
                {tool.name} <span style={{ color: '#6b7494', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>v{tool.version}</span>
              </div>
              <div style={{ fontSize: 11.5, color: '#9ba4c0', marginTop: 3, lineHeight: 1.5 }}>{tool.description}</div>
            </div>
            <span className={'badge ' + (tool.status === 'enabled' ? 'badge-green' : 'badge-gray')}>{tool.status}</span>
          </div>
        ))}
      </div>

      <div className="section-label" style={{ margin: '24px 0 12px' }}>
        <span className="ico">⊕</span>
        CAPABILITIES
      </div>
      <div className="grid3">
        {CAPABILITIES.map((cap, i) => (
          <div key={i} className="panel-sm">
            <div className="stat-label">{cap.label}</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#e8eaf6', fontFamily: 'Space Grotesk, sans-serif', marginTop: 4 }}>{cap.value}</div>
            <div style={{ marginTop: 8 }}>
              <span className={'badge badge-' + cap.statusColor} style={{ fontSize: 9.5 }}>{cap.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}