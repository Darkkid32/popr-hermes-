import { useSearchParams } from 'react-router-dom'
import { MCPOverview } from './MCPOverview'
import { MCPServers } from './MCPServers'
import { MCPMarketplace } from './MCPMarketplace'
import { MCPTools } from './MCPTools'
import { MCPSettings } from './MCPSettings'

type TabId = 'overview' | 'servers' | 'marketplace' | 'tools' | 'settings'

const TABS: Array<{ id: TabId; label: string; icon: string }> = [
  { id: 'overview', label: 'Overview', icon: '◎' },
  { id: 'servers', label: 'Servers', icon: '⬢' },
  { id: 'marketplace', label: 'Marketplace', icon: '⊕' },
  { id: 'tools', label: 'Tools Explorer', icon: '✦' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
]

export function MCP() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = (searchParams.get('tab') as TabId) || 'overview'
  const setTab = (t: string) => setSearchParams({ tab: t })

  return (
    <MCPWorkspace tab={tab} setTab={setTab} />
  )
}

function MCPWorkspace({ tab, setTab }: { tab: string; setTab: (t: string) => void }) {
  return (
    <>
      <div className="status-pills">
        <span className="badge badge-green"><span className="dot dot-green" /> 6 connected</span>
        <span className="badge badge-gray"><span className="mono">1 disconnected</span></span>
        <span className="badge badge-red"><span className="mono">1 error</span></span>
        <span className="badge badge-cyan"><span className="mono">8 servers total</span></span>
      </div>

      <div className="ws-tabs">
        {TABS.map((t) => (
          <button key={t.id} className={'ws-tab ' + (tab === t.id ? 'active' : '')} onClick={() => setTab(t.id)} aria-pressed={tab === t.id}>
            <span className="ico" aria-hidden="true">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="ws-body">
        {tab === 'overview' && <MCPOverview />}
        {tab === 'servers' && <MCPServers />}
        {tab === 'marketplace' && <MCPMarketplace />}
        {tab === 'tools' && <MCPTools />}
        {tab === 'settings' && <MCPSettings />}
      </div>
    </>
  )
}