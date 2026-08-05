// Automation Templates Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'

const TEMPLATES = [
  { id: 'tpl1', name: 'Daily Data Sync', category: 'data', description: 'Sync data from multiple sources to warehouse', uses: 1247, rating: 4.8, author: 'platform-team', updated: '2d ago', status: 'official' },
  { id: 'tpl2', name: 'Agent Health Monitor', category: 'monitoring', description: 'Comprehensive health checks for all agents', uses: 8760, rating: 4.9, author: 'infra-team', updated: '1w ago', status: 'official' },
  { id: 'tpl3', name: 'Blue-Green Deployment', category: 'deployment', description: 'Zero-downtime deployment with rollback', uses: 567, rating: 4.7, author: 'devops-team', updated: '3d ago', status: 'official' },
  { id: 'tpl4', name: 'Model Retraining Pipeline', category: 'ml', description: 'Automated model training and validation', uses: 234, rating: 4.6, author: 'ml-team', updated: '5d ago', status: 'official' },
  { id: 'tpl5', name: 'Incident Response', category: 'ops', description: 'Standardized incident response workflow', uses: 89, rating: 4.5, author: 'sre-team', updated: '2w ago', status: 'community' },
  { id: 'tpl6', name: 'Log Rotation & Cleanup', category: 'maintenance', description: 'Automated log management', uses: 20160, rating: 4.9, author: 'infra-team', updated: '1d ago', status: 'official' },
  { id: 'tpl7', name: 'Security Scan', category: 'security', description: 'Vulnerability scanning and reporting', uses: 365, rating: 4.7, author: 'security-team', updated: '1w ago', status: 'official' },
  { id: 'tpl8', name: 'Custom Webhook Handler', category: 'integration', description: 'Generic webhook processing template', uses: 1247, rating: 4.4, author: 'dev-team', updated: '3d ago', status: 'community' },
]

const CATEGORIES = ['all', 'data', 'monitoring', 'deployment', 'ml', 'ops', 'maintenance', 'security', 'integration']

export function AutomationTemplates() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const filtered = TEMPLATES.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || t.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', flex: 1, minWidth: 300 }}>
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
            prefix={<span>🔍</span>}
          />
          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={CATEGORIES.map(c => ({ value: c, label: c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1) }))}
            style={{ minWidth: 160 }}
          />
          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={['all', 'official', 'community'].map(s => ({ value: s, label: s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1) }))}
            style={{ minWidth: 140 }}
          />
        </div>
        <Button variant="primary" size="sm">➕ Create Template</Button>
      </div>

      {/* Templates Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 'var(--spacing-4)' }}>
        {filtered.map(template => (
          <Card key={template.id} variant="elevated" padding="md" hoverable>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex.start', marginBottom: 'var(--spacing-3)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>
                  {template.name}
                </h3>
                <Badge variant={template.status === 'official' ? 'info' : 'default'} size="sm">{template.status}</Badge>
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
                <Badge variant="default" size="sm">{template.category}</Badge>
              </div>
            </div>
            <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-3)', lineHeight: 1.5 }}>
              {template.description}
            </p>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)' }}>
              <div><span style={{ color: 'var(--color-text-tertiary)' }}>Uses:</span> <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{template.uses.toLocaleString()}</span></div>
              <div><span style={{ color: 'var(--color-text-tertiary)' }}>Rating:</span> <span style={{ color: 'var(--color-warning-base)' }}>{template.rating} ⭐</span></div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)', fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-3)' }}>
              <span>👤 {template.author}</span>
              <span>🕐 {template.updated}</span>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              <Button variant="primary" size="sm" style={{ flex: 1 }}>🚀 Use Template</Button>
              <Button variant="ghost" size="sm">👁️ Preview</Button>
              <Button variant="ghost" size="sm">📋 Copy</Button>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-12)', color: 'var(--color-text-tertiary)' }}>
          🔍 No templates found
        </div>
      )}
    </div>
  )
}