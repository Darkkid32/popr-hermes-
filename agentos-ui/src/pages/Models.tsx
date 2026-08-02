import { useSearchParams } from 'react-router-dom'
import { ModelsOverview } from './ModelsOverview'
import { ModelsCatalog } from './ModelsCatalog'
import { ModelsRouting } from './ModelsRouting'
import { ModelsEndpoints } from './ModelsEndpoints'
import { ModelsBenchmarks } from './ModelsBenchmarks'
import { ModelsSettings } from './ModelsSettings'

type TabId = 'overview' | 'catalog' | 'routing' | 'endpoints' | 'benchmarks' | 'settings'

const TABS: Array<{ id: TabId; label: string; icon: string }> = [
  { id: 'overview', label: 'Overview', icon: '◎' },
  { id: 'catalog', label: 'Catalog', icon: '◧' },
  { id: 'routing', label: 'Routing', icon: '⌘' },
  { id: 'endpoints', label: 'Endpoints', icon: '⊕' },
  { id: 'benchmarks', label: 'Benchmarks', icon: '∿' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
]

export function Models() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = (searchParams.get('tab') as TabId) || 'overview'
  const setTab = (t: string) => setSearchParams({ tab: t })

  return (
    <ModelsWorkspace tab={tab} setTab={setTab} />
  )
}

function ModelsWorkspace({ tab, setTab }: { tab: string; setTab: (t: string) => void }) {
  return (
    <>
      <div className="status-pills">
        <span className="badge badge-green"><span className="dot dot-green" /> models ready</span>
        <span className="badge badge-cyan"><span className="mono">4 providers</span></span>
        <span className="badge badge-purple"><span className="mono">13 models</span></span>
        <span className="badge badge-gray"><span className="mono">$15.23 / day</span></span>
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
        {tab === 'overview' && <ModelsOverview />}
        {tab === 'catalog' && <ModelsCatalog />}
        {tab === 'routing' && <ModelsRouting />}
        {tab === 'endpoints' && <ModelsEndpoints />}
        {tab === 'benchmarks' && <ModelsBenchmarks />}
        {tab === 'settings' && <ModelsSettings />}
      </div>
    </>
  )
}