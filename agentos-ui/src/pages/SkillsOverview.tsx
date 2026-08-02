import { SKILLS, SKILL_TEMPLATES } from '../lib/skills-data'
import { StatusPills, SectionLabel } from '../components/ui'

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

export function SkillsOverview() {
  const enabledCount = SKILLS.filter((s) => s.status === 'enabled').length
  const disabledCount = SKILLS.filter((s) => s.status === 'disabled').length
  const errorCount = SKILLS.filter((s) => s.status === 'error').length
  const totalRuns = SKILLS.reduce((sum, s) => sum + s.runCount, 0)
  const categories = [...new Set(SKILLS.map((s) => s.category))].length

  return (
    <div className="page-body">
      <StatusPills pills={[
        { label: <><span className="dot dot-green" aria-hidden="true" /> {enabledCount} enabled</>, tone: 'green', dot: true },
        { label: <><span className="mono">{disabledCount} disabled</span></>, tone: 'gray' },
        { label: <><span className="mono">{errorCount} errors</span></>, tone: 'red' },
        { label: <><span className="mono">{SKILLS.length} skills · {categories} categories · {totalRuns} runs</span></>, tone: 'cyan' },
      ]} />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 20 }}>
        <div className="col-stack">
          <div className="panel">
                      <SectionLabel icon="◧">INSTALLED SKILLS · {SKILLS.length}</SectionLabel>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {SKILLS.slice(0, 8).map((skill) => (
                          <div key={skill.id} className="table-row" style={{ cursor: 'pointer' }}>
                            <span style={{ fontSize: 18, color: skill.iconColor, width: 24, textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif' }}>{skill.icon}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 500, color: '#e8eaf6' }}>{skill.name}</div>
                              <div style={{ fontSize: 10.5, color: '#6b7494' }}>{skill.description}</div>
                            </div>
                            <span className={'badge badge-' + STATUS_BADGE[skill.status]} style={{ fontSize: 9.5 }}>{skill.status}</span>
                            <span className="badge badge-purple" style={{ fontSize: 9.5 }}>{skill.version}</span>
                            <span style={{ fontSize: 10, color: '#6b7494', fontFamily: 'JetBrains Mono, monospace', minWidth: 80 }}>{skill.category}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="panel">
                      <SectionLabel icon="⌘">SKILL CATEGORIES</SectionLabel>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {(['automation', 'coding', 'analysis', 'communication', 'data', 'utility'] as const).map((cat) => {
                          const skills = SKILLS.filter((s) => s.category === cat)
                          const enabled = skills.filter((s) => s.status === 'enabled').length
                          return (
                            <div key={cat}>
                              <div className="row" style={{ marginBottom: 6 }}>
                                <span style={{ fontSize: 16, color: '#00e5ff' }}>{cat === 'automation' ? '⚡' : cat === 'coding' ? '⌘' : cat === 'analysis' ? '∿' : cat === 'communication' ? '◌' : cat === 'data' ? '◧' : '⚙'}</span>
                                <span style={{ fontSize: 13, fontWeight: 500, color: '#e8eaf6', textTransform: 'capitalize' }}>{cat}</span>
                                <div className="spacer" />
                                <span className="badge badge-green">{enabled} enabled</span>
                                <span className="badge badge-gray">{skills.length} total</span>
                              </div>
                              <div className="progress-bar">
                                <div className="progress-fill" style={{ width: skills.length > 0 ? (enabled / skills.length) * 100 : 0 + '%', background: '#00e5ff' }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="col-stack">
                    <div className="panel">
                      <SectionLabel icon="⊕">SKILL TEMPLATES · {SKILL_TEMPLATES.length}</SectionLabel>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {SKILL_TEMPLATES.slice(0, 4).map((t) => (
                          <div key={t.id} className="panel-sm">
                            <div className="row" style={{ marginBottom: 8 }}>
                              <span style={{ fontSize: 18, color: t.iconColor }}>{t.icon}</span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 12.5, fontWeight: 500, color: '#e8eaf6' }}>{t.name}</div>
                                <div style={{ fontSize: 10, color: '#6b7494' }}>{t.description}</div>
                              </div>
                              <span className={'badge badge-' + CATEGORY_BADGE[t.category]} style={{ fontSize: 9.5 }}>{t.category}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="panel">
                      <SectionLabel icon="∿">EXECUTION STATS</SectionLabel>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {SKILLS
                          .filter((s) => s.runCount > 0)
                          .sort((a, b) => b.runCount - a.runCount)
                          .slice(0, 5)
                          .map((s) => (
                            <div key={s.id} className="panel-sm">
                              <div className="row" style={{ marginBottom: 4 }}>
                                <span style={{ fontSize: 16, color: s.iconColor }}>{s.icon}</span>
                                <span style={{ fontSize: 12.5, fontWeight: 500, color: '#e8eaf6', flex: 1 }}>{s.name}</span>
                              </div>
                              <div className="row" style={{ gap: 12, fontSize: 10, color: '#6b7494' }}>
                                <span className="mono">{s.runCount} runs</span>
                                <span className="mono">{s.successRate.toFixed(1)}% success</span>
                                <span className="mono">{s.avgDuration} avg</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="panel">
                      <SectionLabel icon="⚙">QUICK ACTIONS</SectionLabel>
                      <div className="grid2">
                        <button className="btn-secondary" style={{ justifyContent: 'flex-start', gap: 8 }}><span style={{ fontSize: 16 }}>➕</span> Create Skill</button>
                        <button className="btn-secondary" style={{ justifyContent: 'flex-start', gap: 8 }}><span style={{ fontSize: 16 }}>📋</span> Browse Templates</button>
                        <button className="btn-secondary" style={{ justifyContent: 'flex-start', gap: 8 }}><span style={{ fontSize: 16 }}>🔧</span> Skill Builder</button>
                        <button className="btn-secondary" style={{ justifyContent: 'flex-start', gap: 8 }}><span style={{ fontSize: 16 }}>📦</span> Install from File</button>
                      </div>
                    </div>
        </div>
      </div>
    </div>
  )
}