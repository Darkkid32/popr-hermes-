// CostCard - Shared AI Component
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { Card } from '../data-display/Card'
import { Badge } from '../data-display/Badge'

export interface CostBreakdown {
  label: string
  cost: number
  percentage: number
  color?: string
}

export interface CostCardProps {
  cost: number
  period: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: number
  breakdown?: CostBreakdown[]
  budget?: number
  variant?: 'default' | 'compact' | 'detailed'
  showTrend?: boolean
}

const formatCost = (cost: number): string => {
  if (cost >= 1) return `$${cost.toFixed(2)}`
  if (cost >= 0.01) return `$${cost.toFixed(4)}`
  return `$${cost.toFixed(6)}`
}

const TREND_ICONS = {
  up: '↗',
  down: '↘',
  stable: '→',
}

export function CostCard({
  cost,
  period,
  trend = 'stable',
  trendValue,
  breakdown,
  budget,
  variant = 'default',
  showTrend = true,
}: CostCardProps) {
  const budgetPercent = budget ? Math.min((cost / budget) * 100, 100) : 0
  const isOverBudget = budget && cost > budget
  const trendIcon = TREND_ICONS[trend]

  if (variant === 'compact') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
          <span style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>
            {period} Cost
          </span>
          <span style={{ fontSize: 'var(--text-body-lg)', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}>
            {formatCost(cost)}
          </span>
        </div>
        {showTrend && trendValue !== undefined && (
          <Badge variant={trend === 'up' ? 'error' : trend === 'down' ? 'success' : 'default'} size="sm">
            {trendIcon} {trendValue > 0 ? '+' : ''}{trendValue.toFixed(1)}%
          </Badge>
        )}
        {budget && (
          <div style={{ width: 80, height: 6, backgroundColor: 'var(--color-border-primary)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${budgetPercent}%`, height: '100%', backgroundColor: isOverBudget ? 'var(--color-error-base)' : 'var(--color-primary-base)', transition: 'width var(--motion-duration-smooth) var(--motion-easing-standard)' }} />
          </div>
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
              Cost {period ? `(${period})` : ''}
            </div>
            {budget && (
              <div style={{ fontSize: 'var(--text-label-xs)', color: 'var(--color-text-quaternary)', marginTop: 'var(--spacing-1)' }}>
                Budget: {formatCost(budget)}
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 'var(--text-display-lg)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
              {formatCost(cost)}
            </div>
            {showTrend && trendValue !== undefined && (
              <Badge variant={trend === 'up' ? 'error' : trend === 'down' ? 'success' : 'default'} size="sm" style={{ marginTop: 'var(--spacing-1)' }}>
                {trendIcon} {trendValue > 0 ? '+' : ''}{trendValue.toFixed(1)}% vs last period
              </Badge>
            )}
          </div>
        </div>

        {budget && (
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-2)' }}>
              <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
                {budgetPercent.toFixed(1)}% of budget
              </span>
              <span style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: isOverBudget ? 'var(--color-error-base)' : 'var(--color-text-tertiary)' }}>
                {formatCost(cost)} / {formatCost(budget)}
              </span>
            </div>
            <div style={{ height: 8, backgroundColor: 'var(--color-border-primary)', borderRadius: 4, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${budgetPercent}%`,
                  height: '100%',
                  backgroundColor: isOverBudget ? 'var(--color-error-base)' : budgetPercent > 80 ? 'var(--color-warning-base)' : 'var(--color-primary-base)',
                  transition: 'width var(--motion-duration-smooth) var(--motion-easing-standard), background-color var(--motion-duration-smooth) var(--motion-easing-standard)',
                }}
              />
            </div>
          </div>
        )}

        {breakdown && breakdown.length > 0 && (
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-3)' }}>
              Breakdown
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              {breakdown.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <div style={{ width: 12, height: 12, borderRadius: 'var(--radius-sm)', backgroundColor: item.color || `hsl(${(i * 360 / breakdown.length)}, 70%, 50%)` }} />
                  <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', flex: 1 }}>{item.label}</span>
                  <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
                    {formatCost(item.cost)}
                  </span>
                  <Badge variant="default" size="sm">
                    {item.percentage.toFixed(1)}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--color-border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
            {budget ? `Budget: ${budgetPercent.toFixed(1)}% used` : 'No budget set'}
          </span>
          {budget && (
            <Badge variant={isOverBudget ? 'error' : budgetPercent > 80 ? 'warning' : 'success'} size="sm">
              {isOverBudget ? 'Over Budget' : budgetPercent > 80 ? 'Near Limit' : 'On Track'}
            </Badge>
          )}
        </div>
      </Card>
    )
  }

  // Default variant
  return (
    <Card variant="elevated">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
        <div>
          <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>
            Cost {period ? `(${period})` : ''}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 'var(--text-body-lg)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            {formatCost(cost)}
          </div>
          {showTrend && trendValue !== undefined && (
            <Badge variant={trend === 'up' ? 'error' : trend === 'down' ? 'success' : 'default'} size="sm">
              {trendIcon} {trendValue > 0 ? '+' : ''}{trendValue.toFixed(1)}%
            </Badge>
          )}
        </div>
      </div>

      {budget && (
        <div style={{ marginBottom: 'var(--spacing-3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-2)' }}>
            <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
              {budgetPercent.toFixed(1)}% of budget
            </span>
            <span style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: isOverBudget ? 'var(--color-error-base)' : 'var(--color-text-tertiary)' }}>
              {formatCost(cost)} / {formatCost(budget)}
            </span>
          </div>
          <div style={{ height: 6, backgroundColor: 'var(--color-border-primary)', borderRadius: 3, overflow: 'hidden' }}>
            <div
              style={{
                width: `${budgetPercent}%`,
                height: '100%',
                backgroundColor: isOverBudget ? 'var(--color-error-base)' : budgetPercent > 80 ? 'var(--color-warning-base)' : 'var(--color-primary-base)',
                transition: 'width var(--motion-duration-smooth) var(--motion-easing-standard), background-color var(--motion-duration-smooth) var(--motion-easing-standard)',
              }}
            />
          </div>
        </div>
      )}

      {breakdown && breakdown.length > 0 && (
        <div style={{ marginBottom: 'var(--spacing-3)' }}>
          <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
            Breakdown
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            {breakdown.slice(0, 4).map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color || `hsl(${(i * 360 / breakdown.length)}, 70%, 50%)` }} />
                <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', flex: 1 }}>{item.label}</span>
                <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {formatCost(item.cost)}
                </span>
              </div>
            ))}
            {breakdown.length > 4 && (
              <div style={{ fontSize: 'var(--text-label-xs)', color: 'var(--color-text-quaternary)' }}>
                +{breakdown.length - 4} more items
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ paddingTop: 'var(--spacing-3)', borderTop: '1px solid var(--color-border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
          {budget ? `Budget: ${budgetPercent.toFixed(1)}% used` : 'No budget set'}
        </span>
        {budget && (
          <Badge variant={isOverBudget ? 'error' : budgetPercent > 80 ? 'warning' : 'success'} size="sm">
            {isOverBudget ? 'Over Budget' : budgetPercent > 80 ? 'Near Limit' : 'On Track'}
          </Badge>
        )}
      </div>
    </Card>
  )
}