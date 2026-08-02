import { SKILL_TEMPLATES } from '../lib/skills-data'
import { useSkillsStore } from '../stores/SkillsStore'

const CATEGORY_BADGE: Record<string, string> = {
  automation: 'amber',
  coding: 'red',
  analysis: 'pink',
  communication: 'cyan',
  data: 'purple',
  utility: 'green',
}

export function SkillsTemplates() {
  const { view, setView, filter, setFilter } = useSkillsStore()

  const allCategories = [...new Set(SKILL_TEMPLATES.map((t) => t.category))].sort()

  const filteredTemplates = SKILL_TEMPLATES.filter((t) => {
    const matchCategory = filter.category === 'all' || t.category === filter.category
    const matchSearch = !filter.search || t.name.toLowerCase().includes(filter.search.toLowerCase()) || t.description.toLowerCase().includes(filter.search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> {SKILL_TEMPLATES.length} templates</span>
        <span className="badge badge-cyan"><span className="mono">{filteredTemplates.length} filtered</span></span>
        <span className="badge badge-purple"><span className="mono">{allCategories.length} categories</span></span>
        <span className="badge badge-gray"><span className="mono">view: {view}</span></span>
      </div>

      <div className="row" style={{ marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#141830', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, padding: '8px 12px', flex: 1, minWidth: 240 }}>
          <span style={{ color: '#6b7494', fontSize: 14 }}>⌕</span>
          <input
            value={filter.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            placeholder="Search templates..."
            style={{ flex: 1, background: 'transparent', fontSize: 13, color: '#e8eaf6', border: 'none', outline: 'none' }}
          />
          <span style={{ fontSize: 10, color: '#4a5170' }} className="mono">⌘F</span>
        </div>

        <select value={filter.category} onChange={(e) => setFilter({ category: e.target.value })} className="field-input" style={{ width: 'auto', minWidth: 160, padding: '6px 12px', fontSize: 12 }}>
          <option value="all">All Categories</option>
          {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="row" style={{ gap: 4 }}>
          <button className={'ws-tab ' + (view === 'grid' ? 'active' : '')} onClick={() => setView('grid')} style={{ padding: '6px 10px' }}><span style={{ fontSize: 14 }}>⊞</span></button>
          <button className={'ws-tab ' + (view === 'list' ? 'active' : '')} onClick={() => setView('list')} style={{ padding: '6px 10px' }}><span style={{ fontSize: 14 }}>☰</span></button>
        </div>
      </div>

      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 12 }}>
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      ) : (
        <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 12, fontSize: 9.5, color: '#6b7494', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 600 }} className="mono">
            <span style={{ minWidth: 200 }}>NAME</span>
            <span style={{ minWidth: 100 }}>CATEGORY</span>
            <span style={{ flex: 1 }}>DESCRIPTION</span>
            <span style={{ minWidth: 120 }}>ACTIONS</span>
          </div>
          <div style={{ padding: '4px 16px', maxHeight: 600, overflowY: 'auto' }}>
            {filteredTemplates.map((template) => (
              <div key={template.id} className="table-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 200 }}>
                  <span style={{ fontSize: 18, color: template.iconColor }}>{template.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#e8eaf6' }}>{template.name}</span>
                </div>
                <span className={'badge badge-' + CATEGORY_BADGE[template.category]} style={{ minWidth: 100, fontSize: 9.5 }}>{template.category}</span>
                <span style={{ fontSize: 11, color: '#9ba4c0', flex: 1 }}>{template.description}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-primary" style={{ fontSize: 10, padding: '3px 8px' }}>Create Skill</button>
                  <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 8px' }}>View Code</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TemplateCard({ template }: { template: any }) {
  return (
    <div className="panel" style={{ cursor: 'pointer', borderLeft: `3px solid ${template.iconColor}`, transition: 'all 0.15s' }}>
      <div className="row" style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 22, color: template.iconColor }}>{template.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#e8eaf6', fontFamily: 'Space Grotesk, sans-serif' }}>{template.name}</div>
          <span className={'badge badge-' + CATEGORY_BADGE[template.category]} style={{ fontSize: 9.5 }}>{template.category}</span>
        </div>
      </div>

      <div style={{ fontSize: 11, color: '#9ba4c0', marginBottom: 10, lineHeight: 1.5 }}>{template.description}</div>

      <div className="section-label" style={{ marginBottom: 8 }}><span className="ico">◧</span> BOILERPLATE</div>
      <div style={{ background: '#0a0d1a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, padding: 12, fontSize: 10, color: '#9ba4c0', fontFamily: 'JetBrains Mono, monospace', maxHeight: 150, overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
        {template.boilerplate}
      </div>

      <div className="row" style={{ gap: 8, marginTop: 12 }}>
        <button className="btn-primary" style={{ fontSize: 10, padding: '3px 10px', flex: 1 }}>Create Skill from Template</button>
        <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 10px' }}>Copy Code</button>
      </div>
    </div>
  )
}