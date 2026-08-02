import { PLUGIN_PERMISSIONS, PLUGINS } from '../lib/plugins-data'

const RISK_BADGE: Record<string, string> = {
  low: 'green',
  medium: 'amber',
  high: 'red',
}

export function PluginsPermissions() {
  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> 4 low risk</span>
        <span className="badge badge-amber"><span className="mono">5 medium risk</span></span>
        <span className="badge badge-red"><span className="mono">4 high risk</span></span>
        <span className="badge badge-cyan"><span className="mono">13 permissions total</span></span>
      </div>

      <div className="panel">
        <div className="section-label"><span className="ico">⚠</span> PERMISSION MATRIX</div>
        <div style={{ padding: '4px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 80px 1fr 200px', gap: 12, padding: '10px 0', fontSize: 9.5, color: '#6b7494', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }} className="mono">
            <span>PERMISSION</span>
            <span>RISK</span>
            <span>DESCRIPTION</span>
            <span>PLUGINS USING</span>
          </div>
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {PLUGIN_PERMISSIONS.map((perm) => (
              <div key={perm.name} style={{ display: 'grid', gridTemplateColumns: '200px 80px 1fr 200px', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
                <span style={{ fontSize: 11.5, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{perm.name}</span>
                <span className={'badge badge-' + RISK_BADGE[perm.risk]} style={{ fontSize: 9.5 }}>{perm.risk.toUpperCase()}</span>
                <span style={{ fontSize: 11, color: '#9ba4c0' }}>{perm.description}</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {perm.plugins.map((pluginId) => {
                    const plugin = PLUGINS.find((p) => p.id === pluginId)
                    return plugin ? (
                      <span key={pluginId} className={'badge badge-' + (plugin.category === 'tool' ? 'purple' : plugin.category === 'integration' ? 'cyan' : 'amber')} style={{ fontSize: 8.5 }}>{plugin.name}</span>
                    ) : null
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
        <div className="panel">
          <div className="section-label"><span className="ico">⌘</span> PLUGINS BY PERMISSION COUNT</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PLUGINS
              .map((p) => ({ ...p, permCount: p.permissions.length }))
              .sort((a, b) => b.permCount - a.permCount)
              .map((p) => (
                <div key={p.id} className="table-row">
                  <span style={{ fontSize: 16, color: p.iconColor, width: 24, textAlign: 'center' }}>{p.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#e8eaf6', flex: 1 }}>{p.name}</span>
                  <span className="badge badge-gray" style={{ fontSize: 11 }}>{p.permCount} permissions</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {p.permissions.map((perm) => (
                      <span key={perm} className="badge badge-amber" style={{ fontSize: 8 }}>{perm}</span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-label"><span className="ico">⚙</span> PERMISSION POLICIES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { name: 'Auto-approve Low Risk', enabled: true, description: 'Automatically grant low-risk permissions on install' },
              { name: 'Prompt for Medium Risk', enabled: true, description: 'Show confirmation dialog for medium-risk permissions' },
              { name: 'Require Manual Approval for High Risk', enabled: true, description: 'High-risk permissions require explicit operator approval' },
              { name: 'Audit Log All Permission Changes', enabled: true, description: 'Log all permission grants and revocations' },
              { name: 'Auto-revoke on Uninstall', enabled: true, description: 'Remove permissions when plugin is uninstalled' },
              { name: 'Periodic Permission Review', enabled: false, description: 'Quarterly review of all granted permissions' },
            ].map((policy) => (
              <div key={policy.name} className="panel-sm">
                <div className="row">
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 500, color: '#e8eaf6' }}>{policy.name}</div>
                    <div style={{ fontSize: 10.5, color: '#6b7494' }}>{policy.description}</div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked={policy.enabled} />
                    <span className="slider" style={{ width: 40, height: 20, borderRadius: 10, background: policy.enabled ? '#d946ef' : '#4a5170', position: 'relative', marginLeft: 8 }} />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}