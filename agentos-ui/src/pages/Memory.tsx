import { useSearchParams } from 'react-router-dom'
import { MemoryOverview } from './MemoryOverview'
import { MemoryNotes } from './MemoryNotes'
import { MemoryOmi } from './MemoryOmi'
import { MemoryGraph } from './MemoryGraph'
import { MemorySources } from './MemorySources'
import { MemorySettings } from './MemorySettings'

type TabId = 'recent' | 'notes' | 'omi' | 'graph' | 'sources' | 'settings'

const TABS: Array<{ id: TabId; label: string; icon: string }> = [
  { id: 'recent', label: 'Recent', icon: '◴' },
  { id: 'notes', label: 'Notes', icon: '◧' },
  { id: 'omi', label: 'Omi', icon: '◉' },
  { id: 'graph', label: 'Graph', icon: '◬' },
  { id: 'sources', label: 'Sources', icon: '⊕' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
]

export function Memory() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = (searchParams.get('tab') as TabId) || 'recent'
  const setTab = (t: string) => setSearchParams({ tab: t })

  return (
    <MemoryWorkspace tab={tab} setTab={setTab} />
  )
}

function MemoryWorkspace({ tab, setTab }: { tab: string; setTab: (t: string) => void }) {
  return (
    <>
      <div className="status-pills">
        <span className="badge badge-green"><span className="dot dot-green" /> 1,261 memories</span>
        <span className="badge badge-cyan"><span className="mono">Obsidian Vault</span></span>
        <span className="badge badge-purple"><span className="mono">7 communities</span></span>
        <span className="badge badge-gray"><span className="mono">last sync 4m ago</span></span>
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
        {tab === 'recent' && <MemoryOverview />}
        {tab === 'notes' && <MemoryNotes />}
        {tab === 'omi' && <MemoryOmi />}
        {tab === 'graph' && <MemoryGraph />}
        {tab === 'sources' && <MemorySources />}
        {tab === 'settings' && <MemorySettings />}
      </div>
    </>
  )
}