import { useSearchParams } from 'react-router-dom'
import { SkillsOverview } from './SkillsOverview'
import { SkillsInstalled } from './SkillsInstalled'
import { SkillsTemplates } from './SkillsTemplates'
import { SkillsBuilder } from './SkillsBuilder'
import { SkillsSettings } from './SkillsSettings'

type TabId = 'overview' | 'installed' | 'templates' | 'builder' | 'settings'

const TABS: Array<{ id: TabId; label: string; icon: string }> = [
  { id: 'overview', label: 'Overview', icon: '◎' },
  { id: 'installed', label: 'Installed', icon: '◧' },
  { id: 'templates', label: 'Templates', icon: '⊕' },
  { id: 'builder', label: 'Builder', icon: '⌘' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
]

export function Skills() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = (searchParams.get('tab') as TabId) || 'overview'
  const setTab = (t: string) => setSearchParams({ tab: t })

  return (
    <SkillsWorkspace tab={tab} setTab={setTab} />
  )
}

function SkillsWorkspace({ tab, setTab }: { tab: string; setTab: (t: string) => void }) {
  return (
    <>
      <div className="status-pills">
        <span className="badge badge-green"><span className="dot dot-green" /> 7 enabled</span>
        <span className="badge badge-gray"><span className="mono">2 disabled</span></span>
        <span className="badge badge-red"><span className="mono">1 error</span></span>
        <span className="badge badge-cyan"><span className="mono">10 total skills</span></span>
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
        {tab === 'overview' && <SkillsOverview />}
        {tab === 'installed' && <SkillsInstalled />}
        {tab === 'templates' && <SkillsTemplates />}
        {tab === 'builder' && <SkillsBuilder />}
        {tab === 'settings' && <SkillsSettings />}
      </div>
    </>
  )
}