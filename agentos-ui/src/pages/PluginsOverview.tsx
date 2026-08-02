import { PLUGINS, PLUGIN_MARKETPLACE } from '../lib/plugins-data'

const STATUS_BADGE: Record<string, string> = {
  enabled: 'green',
  disabled: 'gray',
  error: 'red',
  updating: 'amber',
}

const CATEGORY_ICON: Record<string, string> = {
  tool: '✦',
  integration: '⊕',
  workflow: '⌘',
  ui: '◬',
  utility: '⚙',
  model: '⬢',
}

export function PluginsOverview() {
  const enabledCount = PLUGINS.filter((p) => p.status === 'enabled').length
  const disabledCount = PLUGINS.filter((p) => p.status === 'disabled').length
  const errorCount = PLUGINS.filter((p) => p.status === 'error').length
  const categories = [...new Set(PLUGINS.map((p) => p.category))].length

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> {enabledCount} enabled</span>
        <span className="badge badge-gray"><span className="mono">{disabledCount} disabled</span></span>
        <span className="badge badge-red"><span className="mono">{errorCount} errors</span></span>
        <span className="badge badge-cyan"><span className="mono">{PLUGINS.length} installed · {categories} categories</span></span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 20 }}>
        <div className="col-stack">
          <div className="panel">
            <div className="section-label"><span className="ico">⊕</span> INSTALLED PLUGINS · {PLUGINS.length}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {PLUGINS.slice(0, 8).map((plugin) => (
                <div key={plugin.id} className="table-row" style={{ cursor: 'pointer' }}>
                  <span style={{ fontSize: 18, color: plugin.iconColor, width: 24, textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif' }}>{plugin.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#e8eaf6' }}>{plugin.name}</div>
                    <div style={{ fontSize: 10.5, color: '#6b7494' }}>{plugin.description}</div>
                  </div>
                  <span className={'badge badge-' + STATUS_BADGE[plugin.status]} style={{ fontSize: 9.5 }}>{plugin.status}</span>
                  <span className="badge badge-purple" style={{ fontSize: 9.5 }}>{plugin.version}</span>
                  <span style={{ fontSize: 10, color: '#6b7494', fontFamily: 'JetBrains Mono, monospace', minWidth: 80 }}>{plugin.category}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="section-label"><span className="ico">⌘</span> PLUGIN CATEGORIES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(['tool', 'integration', 'workflow', 'ui', 'utility', 'model'] as const).map((cat) => {
                const plugins = PLUGINS.filter((p) => p.category === cat)
                const enabled = plugins.filter((p) => p.status === 'enabled').length
                return (
                  <div key={cat}>
                    <div className="row" style={{ marginBottom: 6 }}>
                      <span style={{ fontSize: 16, color: '#00e5ff' }}>{CATEGORY_ICON[cat]}</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#e8eaf6', textTransform: 'capitalize' }}>{cat}</span>
                      <div className="spacer" />
                      <span className="badge badge-green">{enabled} enabled</span>
                      <span className="badge badge-gray">{plugins.length} total</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: plugins.length > 0 ? (enabled / plugins.length) * 100 : 0 + '%', background: '#00e5ff' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="col-stack">
          <div className="panel">
            <div className="section-label"><span className="ico">∿</span> MARKETPLACE HIGHLIGHTS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PLUGIN_MARKETPLACE.slice(0, 5).map((p) => (
                <div key={p.id} className="panel-sm">
                  <div className="row" style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 18, color: p.iconColor }}>{p.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 500, color: '#e8eaf6' }}>{p.name}</div>
                      <div style={{ fontSize: 10, color: '#6b7494' }}>{p.description}</div>
                    </div>
                    <span className={'badge ' + (p.verified ? 'badge-green' : 'badge-amber')} style={{ fontSize: 9.5 }}>{p.verified ? 'Verified' : 'Community'}</span>
                    <span className="badge badge-gray" style={{ fontSize: 9.5 }}>{p.price}</span>
                  </div>
                  <div className="row" style={{ gap: 8, fontSize: 10, color: '#6b7494' }}>
                    <span className="mono">{p.downloads.toLocaleString()} downloads</span>
                    <span className="mono">★ {p.rating}</span>
                    <span className="mono">v{p.version}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="section-label"><span className="ico">⚠</span> PERMISSIONS SUMMARY</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11, color: '#9ba4c0' }}>
              <div className="row"><span style={{ color: '#22d97a' }}>●</span> Low risk: 4 permissions</div>
              <div className="row"><span style={{ color: '#ffb347' }}>●</span> Medium risk: 5 permissions</div>
              <div className="row"><span style={{ color: '#ff4d6d' }}>●</span> High risk: 4 permissions</div>
            </div>
          </div>

          <div className="panel">
            <div className="section-label"><span className="ico">⚙</span> QUICK ACTIONS</div>
            <div className="grid2">
              <button className="btn-secondary" style={{ justifyContent: 'flex-start', gap: 8 }}><span style={{ fontSize: 16 }}>➕</span> Browse Marketplace</button>
              <button className="btn-secondary" style={{ justifyContent: 'flex-start', gap: 8 }}><span style={{ fontSize: 16 }}>🔄</span> Check Updates</button>
              <button className="btn-secondary" style={{ justifyContent: 'flex-start', gap: 8 }}><span style={{ fontSize: 16 }}>📦</span> Install from File</button>
              <button className="btn-secondary" style={{ justifyContent: 'flex-start', gap: 8 }}><span style={{ fontSize: 16 }}>🔧</span> Manage Permissions</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}