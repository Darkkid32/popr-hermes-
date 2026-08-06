// RoutingRuleCard - Shared AI Component
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { Card } from '../data-display/Card'
import { Badge } from '../data-display/Badge'
import { Button } from '../data-display/Button'
import { Input } from '../forms/Input'
import { Select } from '../forms/Select'

export interface Model {
  id: string
  name: string
  provider: string
  providerId: string
  status: string
}

export interface RoutingRule {
  id: string
  name: string
  condition: string
  targetModel: string
  fallbackModel: string | null
  priority: number
  enabled: boolean
}

interface RoutingRuleCardProps {
  rule: RoutingRule
  models: Model[]
  priority: number
  isEditing?: boolean
  onEdit?: () => void
  onSave?: () => void
  onCancel?: () => void
  onDelete?: () => void
  onChange?: (field: string, value: any) => void
}

const availableModels = (models: Model[]) => models.filter(m => m.status === 'available')

export function RoutingRuleCard({
  rule,
  models,
  priority,
  isEditing = false,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onChange,
}: RoutingRuleCardProps) {
  const targetModel = models.find(m => m.id === rule.targetModel)
  const fallbackModel = rule.fallbackModel ? models.find(m => m.id === rule.fallbackModel) : null
  const modelOptions = availableModels(models)

  const handleChange = (field: string, value: any) => {
    onChange?.(field, value)
  }

  if (isEditing) {
    return (
      <Card variant="outlined" style={{ borderLeft: '3px solid var(--color-purple-base)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)' }}>
          <Input
            label="Rule Name"
            value={rule.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Code tasks → DeepSeek Coder"
          />
          <Select
            label="Target Model"
            value={rule.targetModel}
            onChangeRaw={(e) => handleChange('targetModel', e.target.value)}
            placeholder="Select target model"
            options={modelOptions.map(m => ({ value: m.id, label: `${m.name} (${m.provider})` }))}
          />
        </div>

        <Input
          label="Condition (JavaScript expression)"
          value={rule.condition}
          onChange={(e) => handleChange('condition', e.target.value)}
          placeholder="e.g., task.type === 'code' && context.length < 4000"
          type="textarea"
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)' }}>
          <Select
            label="Fallback Model (optional)"
            value={rule.fallbackModel || ''}
            onChangeRaw={(e) => handleChange('fallbackModel', e.target.value || null)}
            placeholder="No fallback"
            options={[
              { value: '', label: 'No fallback' },
              ...modelOptions.map(m => ({ value: m.id, label: `${m.name} (${m.provider})` })),
            ]}
          />
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-1)' }}>Priority</label>
            <Input
              type="number"
              min={1}
              max={100}
              value={rule.priority}
              onChange={(e) => handleChange('priority', parseInt(e.target.value))}
              placeholder="Priority"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-primary)' }}>
              <input
                type="checkbox"
                checked={rule.enabled}
                onChange={(e) => handleChange('enabled', e.target.checked)}
              />
              Enabled
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-2)' }}>
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" onClick={onSave}>Save</Button>
        </div>
      </Card>
    )
  }

  return (
    <Card variant="outlined" style={{ marginBottom: 'var(--spacing-2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-2)' }}>
        <Badge variant="default" size="sm" style={{ minWidth: 30, textAlign: 'center', fontSize: 'var(--text-label-xs)', backgroundColor: 'var(--color-purple-base)/15', color: 'var(--color-purple-base)' }}>
          #{priority}
        </Badge>
        <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', flex: 1 }}>{rule.name}</span>
        <Badge variant={rule.enabled ? 'success' : 'default'} size="sm">
          {rule.enabled ? 'ON' : 'OFF'}
        </Badge>
        <Button variant="ghost" size="sm" onClick={onEdit} style={{ fontSize: 'var(--text-label-xs)', padding: '2px 8px' }}>
          Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete} style={{ fontSize: 'var(--text-label-xs)', padding: '2px 8px', color: 'var(--color-error-base)', borderColor: 'var(--color-error-base)' }}>
          Delete
        </Button>
      </div>
      <div style={{ fontSize: 'var(--text-label-xs)', color: 'var(--color-text-tertiary)', marginLeft: 'calc(30px + var(--spacing-3) + var(--spacing-3))', fontFamily: 'var(--font-mono)', marginBottom: 'var(--spacing-1)' }}>
        IF {rule.condition}
      </div>
      <div style={{ fontSize: 'var(--text-label-xs)', color: 'var(--color-info-base)', marginLeft: 'calc(30px + var(--spacing-3) + var(--spacing-3))', fontFamily: 'var(--font-mono)' }}>
        → {targetModel?.name || rule.targetModel}
        {fallbackModel && <span style={{ color: 'var(--color-warning-base)' }}> ↳ {fallbackModel.name}</span>}
      </div>
    </Card>
  )
}

// RoutingRuleFlow - Visual flow representation
export function RoutingRuleFlow({
  rules,
  models,
}: {
  rules: RoutingRule[]
  models: Model[]
}) {
  const sortedRules = [...rules].sort((a, b) => a.priority - b.priority)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
      {sortedRules.map((rule, i) => {
        const targetModel = models.find(m => m.id === rule.targetModel)
        const fallbackModel = rule.fallbackModel ? models.find(m => m.id === rule.fallbackModel) : null

        return (
          <div key={rule.id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <Badge variant="default" size="sm" style={{ minWidth: 30, textAlign: 'center', backgroundColor: 'var(--color-purple-base)/15', color: 'var(--color-purple-base)' }}>
                #{rule.priority}
              </Badge>
              <span style={{ fontWeight: 500, color: 'var(--color-text-primary)', flex: 1 }}>{rule.name}</span>
              <Badge variant={rule.enabled ? 'success' : 'default'} size="sm">
                {rule.enabled ? 'ON' : 'OFF'}
              </Badge>
            </div>
            <div style={{ fontSize: 'var(--text-label-xs)', color: 'var(--color-text-tertiary)', marginLeft: 'calc(30px + var(--spacing-2) + var(--spacing-2))', fontFamily: 'var(--font-mono)' }}>
              IF {rule.condition}
            </div>
            <div style={{ fontSize: 'var(--text-label-xs)', color: 'var(--color-info-base)', marginLeft: 'calc(30px + var(--spacing-2) + var(--spacing-2))', fontFamily: 'var(--font-mono)' }}>
              → {targetModel?.name || rule.targetModel}
              {fallbackModel && <span style={{ color: 'var(--color-warning-base)' }}> ↳ {fallbackModel.name}</span>}
            </div>
            {i < sortedRules.length - 1 && (
              <div style={{ marginLeft: 'calc(30px + var(--spacing-2) + var(--spacing-2) + 10px)', borderLeft: '1px dashed var(--color-border-primary)', height: '16px' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}