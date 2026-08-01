import { INTEGRATIONS, OPERATOR_CHANNELS } from '../lib/demo-data'

export function Integrations() {
  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> {INTEGRATIONS.length} connected</span>
        <span className="badge badge-cyan"><span className="mono">0 failing · 0 paused</span></span>
        <span className="badge badge-purple"><span className="mono">8 surfaces</span></span>
        <span className="badge badge-gray"><span className="mono">auto-reconnect on</span></span>
      </div>

      <div className="section-label" style={{ marginBottom: 12 }}>
        <span className="ico">⊕</span>
        ACTIVE INTEGRATIONS
      </div>
      <div className="grid3">
        {INTEGRATIONS.map((integration) => (
          <div key={integration.id} className="panel row" style={{ alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20, color: integration.iconColor, fontWeight: 700, width: 28, textAlign: 'center', flexShrink: 0, fontFamily: 'Space Grotesk, sans-serif' }}>{integration.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e8eaf6', fontFamily: 'Space Grotesk, sans-serif' }}>{integration.name}</div>
              <div style={{ fontSize: 11, color: '#9ba4c0', marginTop: 3, lineHeight: 1.45 }}>{integration.description}</div>
            </div>
            <span className="badge badge-green">connected</span>
          </div>
        ))}
      </div>

      <div className="section-label" style={{ margin: '24px 0 12px' }}>
        <span className="ico">◴</span>
        OPERATOR CHANNELS
      </div>
      <div className="grid4">
        {OPERATOR_CHANNELS.map((channel, i) => (
          <div key={i} className="panel-sm">
            <div className="stat-label">{channel.label}</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: channel.tone === 'green' ? '#22d97a' : channel.tone === 'cyan' ? '#00e5ff' : '#e8eaf6', fontFamily: 'Space Grotesk, sans-serif', marginTop: 4 }}>{channel.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}