import { useSearchParams } from 'react-router-dom'
import { PluginsOverview } from './PluginsOverview'
import { PluginsInstalled } from './PluginsInstalled'
import { PluginsMarketplace } from './PluginsMarketplace'
import { PluginsPermissions } from './PluginsPermissions'
import { PluginsSettings } from './PluginsSettings'

type TabId = 'overview' | 'installed' | 'marketplace' | 'permissions' | 'settings'

const TABS: Array<{ id: TabId; label: string; icon: string }> = [
  { id: 'overview', label: 'Overview', icon: '◎' },
  { id: 'installed', label: 'Installed', icon: '◧' },
  { id: 'marketplace', label: 'Marketplace', icon: '⊕' },
  { id: 'permissions', label: 'Permissions', icon: '⚠' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
]

export function Plugins() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = (searchParams.get('tab') as TabId) || 'overview'
  const setTab = (t: string) => setSearchParams({ tab: t })

  return (
    <PluginsWorkspace tab={tab} setTab={setTab} />
  )
}

function PluginsWorkspace({ tab, setTab }: { tab: string; setTab: (t: string) => void }) {
  return (
    <>
      <div className="status-pills">
        <span className="badge badge-green"><span className="dot dot-green" /> 9 enabled</span>
        <span className="badge badge-cyan"><span className="mono">3 disabled</span></span>
        <span className="badge badge-red"><span className="mono">1 error</span></span>
        <span className="badge badge-gray"><span className="mono">13 total</span></span>
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
        {tab === 'overview' && <PluginsOverview />}
        {tab === 'installed' && <PluginsInstalled />}
        {tab === 'marketplace' && <PluginsMarketplace />}
        {tab === 'permissions' && <PluginsPermissions />}
        {tab === 'settings' && <PluginsSettings />}
      </div>
    </>
  )
}