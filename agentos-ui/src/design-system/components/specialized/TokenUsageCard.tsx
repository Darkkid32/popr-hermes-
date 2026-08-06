// TokenUsageCard - Shared AI Component
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { Card } from '../data-display/Card'
import { Badge } from '../data-display/Badge'

export interface TokenUsage {
  prompt: number
  completion: number
  total: number
  cost: number
}

export interface TokenUsageCardProps {
  usage: TokenUsage
  limit?: number
  period?: string
  showCost?: boolean
  showBreakdown?: boolean
  variant?: 'default' | 'compact' | 'detailed'
}

const formatNumber = (num: number): string => {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toLocaleString()
}

const formatCost = (cost: number): string => {
  if (cost >= 1) return `$${cost.toFixed(2)}`
  if (cost >= 0.01) return `$${cost.toFixed(4)}`
  return `$${cost.toFixed(6)}`
}

export function TokenUsageCard({
  usage,
  limit,
  period = 'Today',
  showCost = true,
  showBreakdown = true,
  variant = 'default',
}: TokenUsageCardProps) {
  const usagePercent = limit ? Math.min((usage.total / limit) * 100, 100) : 0
  const isOverLimit = limit && usage.total > limit

  if (variant === 'compact') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
          <span style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>
            {period} Usage
          </span>
          <span style={{ fontSize: 'var(--text-body-lg)', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}>
            {formatNumber(usage.total)} tokens
          </span>
        </div>
        {limit && (
          <div style={{ width: 100, height: 6, backgroundColor: 'var(--color-border-primary)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${usagePercent}%`, height: '100%', backgroundColor: isOverLimit ? 'var(--color-error-base)' : 'var(--color-primary-base)', transition: 'width var(--motion-duration-smooth) var(--motion-easing-standard)' }} />
          </div>
        )}
        {showCost && (
          <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-success-base)', fontFamily: 'var(--font-mono)' }}>
            {formatCost(usage.cost)}
          </span>
        )}
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <Card variant="elevated">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
          <div>
            <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>
              Token Usage {period ? `(${period})` : ''}
            </div>
            {limit && (
              <div style={{ fontSize: 'var(--text-label-xs)', color: 'var(--color-text-quaternary)', marginTop: 'var(--spacing-1)' }}>
                Limit: {formatNumber(limit)} tokens
              </div>
            )}
          </div>
          {showCost && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>
                Estimated Cost
              </div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-success-base)' }}>
                {formatCost(usage.cost)}
              </div>
            </div>
          )}
        </div>

        {limit && (
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-2)' }}>
              <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
                {usagePercent.toFixed(1)}% used
              </span>
              <span style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: isOverLimit ? 'var(--color-error-base)' : 'var(--color-text-tertiary)' }}>
                {formatNumber(usage.total)} / {formatNumber(limit)}
              </span>
            </div>
            <div style={{ height: 8, backgroundColor: 'var(--color-border-primary)', borderRadius: 4, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${usagePercent}%`,
                  height: '100%',
                  backgroundColor: isOverLimit ? 'var(--color-error-base)' : usagePercent > 80 ? 'var(--color-warning-base)' : 'var(--color-primary-base)',
                  transition: 'width var(--motion-duration-smooth) var(--motion-easing-standard), background-color var(--motion-duration-smooth) var(--motion-easing-standard)',
                }}
              />
            </div>
          </div>
        )}

        {showBreakdown && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-3)' }}>
            <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>
                Prompt Tokens
              </div>
              <div style={{ fontSize: 'var(--text-body-lg)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-info-base)' }}>
                {formatNumber(usage.prompt)}
              </div>
            </div>
            <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>
                Completion Tokens
              </div>
              <div style={{ fontSize: 'var(--text-body-lg)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-purple-base)' }}>
                {formatNumber(usage.completion)}
              </div>
            </div>
            <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>
                Total Tokens
              </div>
              <div style={{ fontSize: 'var(--text-body-lg)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                {formatNumber(usage.total)}
              </div>
            </div>
          </div>
        )}

        {showCost && (
          <div style={{ marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--color-border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
              Estimated cost based on model pricing
            </span>
            <Badge variant="success" size="sm">
              {formatCost(usage.cost)}
            </Badge>
          </div>
        )}
      </Card>
    )
  }

  // Default variant
  return (
    <Card variant="elevated">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
        <div>
          <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>
            Token Usage {period ? `(${period})` : ''}
          </div>
        </div>
        {showCost && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>
              Cost
            </div>
            <div style={{ fontSize: 'var(--text-body-lg)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-success-base)' }}>
              {formatCost(usage.cost)}
            </div>
          </div>
        )}
      </div>

      {showBreakdown && (
        <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>
              Prompt
            </div>
            <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--color-info-base)' }}>
              {formatNumber(usage.prompt)}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>
              Completion
            </div>
            <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--color-purple-base)' }}>
              {formatNumber(usage.completion)}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>
              Total
            </div>
            <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
              {formatNumber(usage.total)}
            </div>
          </div>
        </div>
      )}

      {limit && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-2)' }}>
            <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
              {usagePercent.toFixed(1)}% of limit
            </span>
            <span style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: isOverLimit ? 'var(--color-error-base)' : 'var(--color-text-tertiary)' }}>
              {formatNumber(usage.total)} / {formatNumber(limit)}
            </span>
          </div>
          <div style={{ height: 6, backgroundColor: 'var(--color-border-primary)', borderRadius: 3, overflow: 'hidden' }}>
            <div
              style={{
                width: `${usagePercent}%`,
                height: '100%',
                backgroundColor: isOverLimit ? 'var(--color-error-base)' : usagePercent > 80 ? 'var(--color-warning-base)' : 'var(--color-primary-base)',
                transition: 'width var(--motion-duration-smooth) var(--motion-easing-standard), background-color var(--motion-duration-smooth) var(--motion-easing-standard)',
              }}
            />
          </div>
        </div>
      )}
    </Card>
  )
}