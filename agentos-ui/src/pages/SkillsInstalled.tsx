import { useState } from 'react'
import { SKILLS } from '../lib/skills-data'
import { useSkillsStore } from '../stores/SkillsStore'

const STATUS_BADGE: Record<string, string> = {
  enabled: 'green',
  disabled: 'gray',
  error: 'red',
  draft: 'amber',
}

const CATEGORY_BADGE: Record<string, string> = {
  automation: 'amber',
  coding: 'red',
  analysis: 'pink',
  communication: 'cyan',
  data: 'purple',
  utility: 'green',
}

export function SkillsInstalled() {
  const { view, setView, filter, setFilter, selectedSkill, setSelectedSkill } = useSkillsStore()
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'status' | 'version' | 'runs' | 'success'>('name')

  const allCategories = [...new Set(SKILLS.map((s) => s.category))].sort()

  const filteredSkills = SKILLS.filter((s) => {
    const matchCategory = filter.category === 'all' || s.category === filter.category
    const matchStatus = filter.status === 'all' || s.status === filter.status
    const matchSearch = !filter.search || s.name.toLowerCase().includes(filter.search.toLowerCase()) || s.description.toLowerCase().includes(filter.search.toLowerCase())
    return matchCategory && matchStatus && matchSearch
  })

  const sortedSkills = [...filteredSkills].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'category') return a.category.localeCompare(b.category)
    if (sortBy === 'status') return a.status.localeCompare(b.status)
    if (sortBy === 'version') return b.version.localeCompare(a.version)
    if (sortBy === 'runs') return b.runCount - a.runCount
    if (sortBy === 'success') return b.successRate - a.successRate
    return 0
  })

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> {SKILLS.filter((s) => s.status === 'enabled').length} enabled</span>
        <span className="badge badge-cyan"><span className="mono">{filteredSkills.length} filtered</span></span>
        <span className="badge badge-purple"><span className="mono">{allCategories.length} categories</span></span>
        <span className="badge badge-gray"><span className="mono">view: {view}</span></span>
      </div>

      <div className="row" style={{ marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#141830', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, padding: '8px 12px', flex: 1, minWidth: 240 }}>
          <span style={{ color: '#6b7494', fontSize: 14 }}>⌕</span>
          <input
            value={filter.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            placeholder="Search skills..."
            style={{ flex: 1, background: 'transparent', fontSize: 13, color: '#e8eaf6', border: 'none', outline: 'none' }}
          />
          <span style={{ fontSize: 10, color: '#4a5170' }} className="mono">⌘F</span>
        </div>

        <select value={filter.category} onChange={(e) => setFilter({ category: e.target.value })} className="field-input" style={{ width: 'auto', minWidth: 160, padding: '6px 12px', fontSize: 12 }}>
          <option value="all">All Categories</option>
          {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={filter.status} onChange={(e) => setFilter({ status: e.target.value })} className="field-input" style={{ width: 'auto', minWidth: 140, padding: '6px 12px', fontSize: 12 }}>
          <option value="all">All Status</option>
          <option value="enabled">Enabled</option>
          <option value="disabled">Disabled</option>
          <option value="error">Error</option>
          <option value="draft">Draft</option>
        </select>

        <div className="row" style={{ gap: 4 }}>
          <button className={'ws-tab ' + (view === 'grid' ? 'active' : '')} onClick={() => setView('grid')} style={{ padding: '6px 10px' }}><span style={{ fontSize: 14 }}>⊞</span></button>
          <button className={'ws-tab ' + (view === 'list' ? 'active' : '')} onClick={() => setView('list')} style={{ padding: '6px 10px' }}><span style={{ fontSize: 14 }}>☰</span></button>
        </div>
      </div>

      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 12 }}>
          {sortedSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} isSelected={selectedSkill?.id === skill.id} onClick={() => setSelectedSkill(skill)} />
          ))}
        </div>
      ) : (
        <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 12, fontSize: 9.5, color: '#6b7494', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 600 }} className="mono">
            <span style={{ minWidth: 200, cursor: 'pointer' }} onClick={() => setSortBy('name')}>NAME</span>
            <span style={{ minWidth: 100, cursor: 'pointer' }} onClick={() => setSortBy('category')}>CATEGORY</span>
            <span style={{ minWidth: 100, cursor: 'pointer' }} onClick={() => setSortBy('status')}>STATUS</span>
            <span style={{ minWidth: 80, cursor: 'pointer' }} onClick={() => setSortBy('runs')}>RUNS</span>
            <span style={{ minWidth: 80, cursor: 'pointer' }} onClick={() => setSortBy('success')}>SUCCESS</span>
            <span style={{ flex: 1 }}>ACTIONS</span>
          </div>
          <div style={{ padding: '4px 16px', maxHeight: 600, overflowY: 'auto' }}>
            {sortedSkills.map((skill) => (
              <div key={skill.id} className="table-row" style={{ cursor: 'pointer', background: selectedSkill?.id === skill.id ? 'rgba(217, 70, 239, 0.08)' : 'transparent' }} onClick={() => setSelectedSkill(skill)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 200 }}>
                  <span style={{ fontSize: 18, color: skill.iconColor }}>{skill.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#e8eaf6' }}>{skill.name}</span>
                </div>
                <span className={'badge badge-' + CATEGORY_BADGE[skill.category]} style={{ minWidth: 100, fontSize: 9.5 }}>{skill.category}</span>
                <span style={{ minWidth: 100 }}><span className={'badge badge-' + STATUS_BADGE[skill.status]}>{skill.status}</span></span>
                <span style={{ minWidth: 80, fontSize: 11, color: '#9ba4c0', fontFamily: 'JetBrains Mono, monospace' }}>{skill.runCount}</span>
                <span style={{ minWidth: 80, fontSize: 11, color: '#9ba4c0', fontFamily: 'JetBrains Mono, monospace' }}>{skill.successRate.toFixed(1)}%</span>
                <div style={{ flex: 1, display: 'flex', gap: 8 }}>
                  <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 8px' }} onClick={(e) => { e.stopPropagation(); }}>{skill.status === 'enabled' ? 'Disable' : 'Enable'}</button>
                  <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 8px' }} onClick={(e) => { e.stopPropagation(); }}>Run Now</button>
                  <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 8px' }} onClick={(e) => { e.stopPropagation(); }}>Configure</button>
                  <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 8px', color: '#ff4d6d', borderColor: '#ff4d6d' }} onClick={(e) => { e.stopPropagation(); }}>Uninstall</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedSkill && <SkillDetailDrawer skill={selectedSkill} onClose={() => setSelectedSkill(null)} />}
    </div>
  )
}

function SkillCard({ skill, isSelected, onClick }: { skill: any; isSelected: boolean; onClick: () => void }) {
  return (
    <div
      className={'panel ' + (isSelected ? 'selected' : '')}
      style={{ cursor: 'pointer', borderLeft: `3px solid ${skill.iconColor}`, transition: 'all 0.15s' }}
      onClick={onClick}
    >
      <div className="row" style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 22, color: skill.iconColor }}>{skill.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#e8eaf6', fontFamily: 'Space Grotesk, sans-serif' }}>{skill.name}</div>
          <span className={'badge badge-' + CATEGORY_BADGE[skill.category]} style={{ fontSize: 9.5 }}>{skill.category}</span>
        </div>
        <span className={'badge badge-' + STATUS_BADGE[skill.status]} style={{ fontSize: 9.5 }}>{skill.status}</span>
      </div>

      <div style={{ fontSize: 11, color: '#9ba4c0', marginBottom: 10, lineHeight: 1.5 }}>{skill.description}</div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
        {skill.tags.slice(0, 4).map((tag: string) => (
          <span key={tag} className="collab-chip" style={{ fontSize: 9.5 }}>{tag}</span>
        ))}
        {skill.tags.length > 4 && <span className="collab-chip" style={{ fontSize: 9.5 }}>+{skill.tags.length - 4}</span>}
      </div>

      <div className="row" style={{ fontSize: 10.5, color: '#6b7494', gap: 16 }}>
        <span className="mono">v{skill.version}</span>
        <span className="mono">{skill.size}</span>
        <span className="mono">{skill.runCount} runs</span>
        <span className="mono">{skill.successRate.toFixed(1)}% success</span>
      </div>

      <div className="row" style={{ fontSize: 10.5, color: '#6b7494', gap: 16, marginTop: 4 }}>
        <span className="mono">avg: {skill.avgDuration}</span>
        <span className="mono">last: {skill.lastRun || 'never'}</span>
        {skill.nextRun && <span className="mono">next: {skill.nextRun}</span>}
      </div>

      <div className="row" style={{ marginTop: 8, gap: 8 }}>
        <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 8px', flex: 1 }} onClick={(e) => { e.stopPropagation(); }}>{skill.status === 'enabled' ? 'Disable' : 'Enable'}</button>
        <button className="btn-primary" style={{ fontSize: 10, padding: '3px 8px' }} onClick={(e) => { e.stopPropagation(); }}>Run Now</button>
        <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 8px' }} onClick={(e) => { e.stopPropagation(); }}>Configure</button>
      </div>
    </div>
  )
}

function SkillDetailDrawer({ skill, onClose }: { skill: any; onClose: () => void }) {
  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
      <div className="drawer-header">
        <div>
          <div style={{ fontSize: 12, color: skill.iconColor, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>{skill.icon} {skill.category.toUpperCase()}</div>
          <h2>{skill.name}</h2>
        </div>
        <button className="drawer-close" onClick={onClose}>✕</button>
      </div>
      <div className="drawer-body">
        <div className="grid2" style={{ marginBottom: 16 }}>
          <div><div className="stat-label">VERSION</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6' }}>{skill.version}</div></div>
          <div><div className="stat-label">AUTHOR</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6' }}>{skill.author}</div></div>
          <div><div className="stat-label">STATUS</div><span className={'badge badge-' + STATUS_BADGE[skill.status]}>{skill.status}</span></div>
          <div><div className="stat-label">CATEGORY</div><span className={'badge badge-' + CATEGORY_BADGE[skill.category]}>{skill.category}</span></div>
          <div><div className="stat-label">INSTALLED</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{skill.installDate}</div></div>
          <div><div className="stat-label">UPDATED</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{skill.lastUpdate}</div></div>
          <div><div className="stat-label">SIZE</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6' }}>{skill.size}</div></div>
          <div><div className="stat-label">RUNS</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{skill.runCount} ({skill.successRate.toFixed(1)}% success)</div></div>
        </div>

        <div className="section-label"><span className="ico">⌘</span> TRIGGERS</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {skill.triggers.map((trigger: string, i: number) => (
            <span key={i} className="badge badge-cyan" style={{ fontSize: 10 }}>{trigger}</span>
          ))}
        </div>

        <div className="section-label"><span className="ico">⚡</span> ACTIONS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          {skill.manifest.actions.map((action: any) => (
            <div key={action.name} className="panel-sm">
              <div className="row">
                <span style={{ fontSize: 12, fontWeight: 500, color: '#e8eaf6', minWidth: 140 }}>{action.name}</span>
                <span style={{ fontSize: 10.5, color: '#9ba4c0', flex: 1 }}>{action.description}</span>
              </div>
              <div style={{ fontSize: 9, color: '#6b7494', marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>
                params: {JSON.stringify(action.params)} → returns: {action.returns}
              </div>
            </div>
          ))}
        </div>

        <div className="section-label"><span className="ico">⚠</span> PERMISSIONS</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {skill.manifest.permissions.map((perm: string) => (
            <span key={perm} className="badge badge-amber" style={{ fontSize: 9.5 }}>{perm}</span>
          ))}
        </div>

        {skill.schedule && (
          <>
            <div className="section-label"><span className="ico">◴</span> SCHEDULE</div>
            <div className="panel-sm" style={{ marginBottom: 16 }}>
              <div className="row">
                <span style={{ fontSize: 12, fontWeight: 500, color: '#e8eaf6', minWidth: 100 }}>Cron</span>
                <span className="mono" style={{ fontSize: 12 }}>{skill.schedule}</span>
              </div>
              <div className="row" style={{ marginTop: 4 }}>
                <span style={{ fontSize: 11, color: '#6b7494', minWidth: 100 }}>Last run</span>
                <span style={{ fontSize: 11, color: '#9ba4c0' }}>{skill.lastRun || 'never'}</span>
              </div>
              <div className="row">
                <span style={{ fontSize: 11, color: '#6b7494', minWidth: 100 }}>Next run</span>
                <span style={{ fontSize: 11, color: '#00e5ff' }}>{skill.nextRun || 'unscheduled'}</span>
              </div>
            </div>
          </>
        )}

        <div className="section-label"><span className="ico">◴</span> CHANGELOG</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16, fontSize: 11, color: '#9ba4c0' }}>
          <div className="row"><span style={{ color: '#00e5ff' }}>•</span> <span>v{skill.version}: Latest update</span></div>
        </div>

        <div className="row" style={{ gap: 8, marginTop: 24 }}>
          <button className="btn-primary" onClick={onClose}>Close</button>
          <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); }}>{skill.status === 'enabled' ? 'Disable' : 'Enable'}</button>
          <button className="btn-primary" onClick={(e) => { e.stopPropagation(); }}>Run Now</button>
          <button className="btn-secondary" style={{ color: '#ff4d6d', borderColor: '#ff4d6d' }} onClick={(e) => { e.stopPropagation(); }}>Uninstall</button>
        </div>
      </div>
    </div>
    </>
  )
}