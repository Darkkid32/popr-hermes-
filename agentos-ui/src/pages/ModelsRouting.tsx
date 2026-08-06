// Models Routing - Migrated to use shared AI components
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState } from 'react'
import { MODEL_ROUTING_RULES, MODELS } from '../lib/models-data'
import { useModelsStore } from '../stores/ModelsStore'
import { RoutingRuleCard } from '../design-system/components/specialized/RoutingRuleCard'
import { SearchFilters } from '../design-system/components/specialized/SearchFilters'
import type { RoutingRule } from '../design-system/components/specialized/RoutingRuleCard'

export function ModelsRouting() {
  const { routingRules, addRoutingRule, updateRoutingRule, deleteRoutingRule } = useModelsStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newRule, setNewRule] = useState<RoutingRule>({
      id: '',
      name: '',
      condition: 'true',
      targetModel: '',
      fallbackModel: null,
      priority: 10,
      enabled: true,
    })

  const rules = routingRules.length > 0 ? routingRules : MODEL_ROUTING_RULES

  const handleAdd = () => {
          if (!newRule.name || !newRule.targetModel) return
          const rule = {
            ...newRule,
            id: 'rr-' + Date.now(),
            fallbackModel: newRule.fallbackModel || null,
          }
          addRoutingRule(rule)
          setNewRule({ id: '', name: '', condition: 'true', targetModel: '', fallbackModel: null, priority: 10, enabled: true })
        }

  const handleSave = (id: string) => {
    const rule = rules.find((r) => r.id === id)
    if (rule) {
      updateRoutingRule(id, rule)
      setEditingId(null)
    }
  }

  const handleDelete = (id: string) => {
    deleteRoutingRule(id)
  }

  // SearchFilters configuration
  const filterConfigs = [
    { key: 'search', label: 'Search', type: 'search' as const, placeholder: 'Search routing rules...' },
  ]

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> routing active</span>
        <span className="badge badge-cyan"><span className="mono">{rules.length} rules</span></span>
        <span className="badge badge-purple"><span className="mono">priority ordered</span></span>
        <span className="badge badge-gray"><span className="mono">fallback enabled</span></span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 12 }}>
        <div className="col-stack">
          <div className="panel">
            <div className="section-label"><span className="ico">⌘</span> ROUTING RULES</div>
            <SearchFilters
              filters={filterConfigs}
              values={{ search: '' }}
              onChange={() => {}}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {rules
                .slice()
                .sort((a, b) => a.priority - b.priority)
                .map((rule) => (
                  <RoutingRuleCard
                    key={rule.id}
                    rule={rule}
                    models={MODELS}
                    priority={rule.priority}
                    isEditing={editingId === rule.id}
                    onEdit={() => setEditingId(rule.id)}
                    onSave={() => handleSave(rule.id)}
                    onCancel={() => setEditingId(null)}
                    onDelete={() => handleDelete(rule.id)}
                  />
                ))}
            </div>
          </div>

          <div className="panel">
            <div className="section-label"><span className="ico">⊕</span> ADD NEW RULE</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                className="field-input"
                placeholder="Rule name (e.g., Code tasks → DeepSeek Coder)"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
              />
              <textarea
                className="field-textarea"
                placeholder="Condition (JavaScript expression evaluated at runtime)"
                value={newRule.condition}
                onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                style={{ minHeight: 80 }}
              />
              <div className="grid2">
                <select className="field-input" value={newRule.targetModel} onChange={(e) => setNewRule({ ...newRule, targetModel: e.target.value })}>
                  <option value="">Select target model</option>
                  {MODELS.filter((m) => m.status === 'available').map((m) => (
                    <option key={m.id} value={m.id}>{m.name} ({m.provider})</option>
                  ))}
                </select>
                <select className="field-input" value={newRule.fallbackModel ?? ''} onChange={(e) => setNewRule({ ...newRule, fallbackModel: e.target.value === '' ? null : e.target.value })}>
                                  <option value="">No fallback (optional)</option>
                                  {MODELS.filter((m) => m.status === 'available').map((m) => (
                                    <option key={m.id} value={m.id}>{m.name} ({m.provider})</option>
                                  ))}
                                </select>
              </div>
              <div className="grid2">
                <div>
                  <div className="field-label">Priority (lower = higher priority)</div>
                  <input type="number" className="field-input" min="1" max="100" value={newRule.priority} onChange={(e) => setNewRule({ ...newRule, priority: parseInt(e.target.value) })} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={newRule.enabled} onChange={(e) => setNewRule({ ...newRule, enabled: e.target.checked })} />
                    <span style={{ fontSize: 12, color: '#e8eaf6' }}>Enabled</span>
                  </label>
                </div>
              </div>
              <button className="btn-primary" onClick={handleAdd} disabled={!newRule.name || !newRule.targetModel}>Add Rule</button>
            </div>
          </div>
        </div>

        <div className="col-stack">
          <div className="panel">
            <div className="section-label"><span className="ico">∿</span> RULE FLOW</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rules
                .slice()
                .sort((a, b) => a.priority - b.priority)
                .map((rule, i) => (
                  <div key={rule.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div className="row" style={{ gap: 8 }}>
                      <span className="badge badge-purple" style={{ fontSize: 11, minWidth: 30, textAlign: 'center' }}>#{rule.priority}</span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: '#e8eaf6', flex: 1 }}>{rule.name}</span>
                      <span className={'badge ' + (rule.enabled ? 'badge-green' : 'badge-gray')} style={{ fontSize: 9.5 }}>{rule.enabled ? 'ON' : 'OFF'}</span>
                    </div>
                    <div style={{ fontSize: 10, color: '#6b7494', marginLeft: 40, fontFamily: 'JetBrains Mono, monospace' }}>
                      IF {rule.condition}
                    </div>
                    <div style={{ fontSize: 10, color: '#00e5ff', marginLeft: 40, fontFamily: 'JetBrains Mono, monospace' }}>
                      → {MODELS.find((m) => m.id === rule.targetModel)?.name || rule.targetModel}
                      {rule.fallbackModel ? <span style={{ color: '#ffb347' }}> ↳ {MODELS.find((m) => m.id === rule.fallbackModel)?.name || rule.fallbackModel}</span> : null}
                    </div>
                    {i < rules.length - 1 && <div style={{ marginLeft: 50, borderLeft: '1px dashed rgba(255,255,255,0.10)', height: 16 }} />}
                  </div>
                ))}
            </div>
          </div>

          <div className="panel">
            <div className="section-label"><span className="ico">◉</span> TEST ROUTING</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <textarea
                className="field-textarea"
                placeholder="Enter test context (JSON)..."
                style={{ minHeight: 120, fontSize: 11 }}
                defaultValue={JSON.stringify({ task: { type: 'code', requiresReasoning: false }, context: { length: 5000, hasImages: false } }, null, 2)}
              />
              <button className="btn-secondary" style={{ justifyContent: 'center' }}>Evaluate Rules</button>
              <div className="panel-sm" style={{ textAlign: 'center', color: '#6b7494', fontSize: 12 }}>
                Routing evaluation would run here with live context
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="section-label"><span className="ico">⚙</span> CONDITION VARIABLES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11, color: '#9ba4c0' }}>
              <code>task.type</code> — 'chat' | 'code' | 'embedding' | 'vision' | 'reasoning'
              <code>task.requiresReasoning</code> — boolean
              <code>task.hasImages</code> — boolean
              <code>context.length</code> — number (tokens)
              <code>model.preferredProvider</code> — string (optional)
              <code>model.maxLatency</code> — number (ms, optional)
              <code>model.maxCost</code> — number (per 1k tokens, optional)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}