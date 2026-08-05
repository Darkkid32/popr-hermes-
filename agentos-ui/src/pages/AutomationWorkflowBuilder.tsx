// Automation Workflow Builder Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'

const NODE_TYPES = [
  { type: 'trigger', label: 'Trigger', icon: '⚡', color: '#00e5ff', inputs: 0, outputs: 1 },
  { type: 'action', label: 'Action', icon: '⚙️', color: '#2dd4bf', inputs: 1, outputs: 1 },
  { type: 'condition', label: 'Condition', icon: '❓', color: '#ffb347', inputs: 1, outputs: 2 },
  { type: 'loop', label: 'Loop', icon: '🔄', color: '#d946ef', inputs: 1, outputs: 1 },
  { type: 'parallel', label: 'Parallel', icon: '⚡', color: '#22d97a', inputs: 1, outputs: 3 },
  { type: 'transform', label: 'Transform', icon: '🔄', color: '#ff4d6d', inputs: 1, outputs: 1 },
]

export function AutomationWorkflowBuilder() {
  const [workflowName, setWorkflowName] = useState('Untitled Workflow')
  const [nodes, setNodes] = useState([
    { id: 'n1', type: 'trigger', label: 'Daily Schedule', position: { x: 200, y: 100 } },
    { id: 'n2', type: 'action', label: 'Fetch Data', position: { x: 200, y: 250 } },
    { id: 'n3', type: 'condition', label: 'Data Valid?', position: { x: 200, y: 400 } },
    { id: 'n4', type: 'action', label: 'Process Data', position: { x: 50, y: 550 } },
    { id: 'n5', type: 'action', label: 'Log Error', position: { x: 350, y: 550 } },
  ])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [mode, setMode] = useState<'select' | 'connect'>('select')

  const addNode = (type: string) => {
    const newNode = {
      id: `n${Date.now()}`,
      type,
      label: NODE_TYPES.find(t => t.type === type)?.label || type,
      position: { x: 200, y: 100 + nodes.length * 150 },
    }
    setNodes([...nodes, newNode])
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 200px)', minHeight: 600 }}>
      {/* Sidebar - Node Palette */}
      <Card variant="outlined" style={{ width: 280, flexShrink: 0, height: '100%', overflow: 'auto' }}>
        <div style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid var(--color-border-primary)' }}>
          <h3 style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
            Nodes
          </h3>
        </div>
        <div style={{ padding: 'var(--spacing-3)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          {NODE_TYPES.map(nodeType => (
            <Button
              key={nodeType.type}
              variant="secondary"
              size="sm"
              style={{ justifyContent: 'flex-start', width: '100%' }}
              onClick={() => addNode(nodeType.type)}
            >
              <span style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: 28, 
                height: 28, 
                borderRadius: 'var(--radius-md)', 
                backgroundColor: `${nodeType.color}/15`, 
                color: nodeType.color,
                marginRight: 'var(--spacing-2)' 
              }}>
                {nodeType.icon}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <span>{nodeType.label}</span>
                <span style={{ 
                  fontSize: 'var(--text-body-xs)', 
                  color: 'var(--color-text-quaternary)', 
                  fontFamily: 'var(--font-mono)' 
                }}>
                  {nodeType.inputs}→{nodeType.outputs}
                </span>
              </span>
            </Button>
          ))}
        </div>
      </Card>

      {/* Canvas */}
      <div style={{ flex: 1, position: 'relative', backgroundColor: 'var(--color-background-base)', overflow: 'hidden' }}>
        {/* Canvas Background */}
        <div 
          style={{ 
            width: '100%', 
            height: '100%', 
            backgroundImage: 'linear-gradient(45deg, var(--color-border-primary) 1px, transparent 1px), linear-gradient(-45deg, var(--color-border-primary) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px',
          }}
        />

        {/* Toolbar */}
        <div style={{ 
          position: 'absolute', 
          top: 'var(--spacing-4)', 
          left: 'var(--spacing-4)', 
          right: 'var(--spacing-4)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="Workflow name"
              style={{ width: 300 }}
            />
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              <Button variant={mode === 'select' ? 'primary' : 'secondary'} size="sm" onClick={() => setMode('select')}>
                👆 Select
              </Button>
              <Button variant={mode === 'connect' ? 'primary' : 'secondary'} size="sm" onClick={() => setMode('connect')}>
                🔗 Connect
              </Button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
            <Button variant="secondary" size="sm">↩️ Undo</Button>
            <Button variant="secondary" size="sm">↪️ Redo</Button>
            <Button variant="secondary" size="sm">🔍 Zoom Fit</Button>
            <Button variant="secondary" size="sm">📋 Validate</Button>
            <Button variant="primary" size="sm">💾 Save</Button>
            <Button variant="primary" size="sm" style={{ backgroundColor: 'var(--color-primary-base)' }}>▶️ Run</Button>
          </div>
        </div>

        {/* Nodes */}
        {nodes.map(node => {
          const nodeType = NODE_TYPES.find(t => t.type === node.type)!
          const isSelected = selectedNode === node.id
          
          return (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: node.position.x,
                top: node.position.y,
                zIndex: isSelected ? 5 : 1,
                cursor: mode === 'connect' ? 'crosshair' : 'grab',
              }}
              onClick={(e) => {
                e.stopPropagation()
                if (mode === 'connect') {
                  // Handle connection logic
                } else {
                  setSelectedNode(node.id)
                }
              }}
              onDragEnd={(e) => {
                setNodes(nodes.map(n => n.id === node.id ? { ...n, position: { x: e.clientX - 90, y: e.clientY - 30 } } : n))
              }}
            >
              <div 
                style={{
                  minWidth: 180,
                  padding: 'var(--spacing-3)',
                  backgroundColor: 'var(--color-surface-container)',
                  border: isSelected ? '2px solid var(--color-primary-base)' : `1px solid ${nodeType.color}`,
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: isSelected ? `0 0 0 2px var(--color-primary-glow), 0 8px 24px rgba(0,0,0,0.3)` : '0 4px 12px rgba(0,0,0,0.2)',
                  transition: 'all var(--motion-duration-snap)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    width: 28, 
                    height: 28, 
                    borderRadius: 'var(--radius-md)', 
                    backgroundColor: `${nodeType.color}/15`, 
                    color: nodeType.color,
                    fontSize: 14,
                  }}>
                    {nodeType.icon}
                  </span>
                  <Input
                    value={node.label}
                    onChange={(e) => setNodes(nodes.map(n => n.id === node.id ? { ...n, label: e.target.value } : n))}
                    style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--color-text-primary)' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-2)', fontSize: 'var(--text-body-xs)', color: 'var(--color-text-quaternary)' }}>
                  <span>📥 {nodeType.inputs}</span>
                  <span>📤 {nodeType.outputs}</span>
                  {node.id !== 'n1' && (
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setNodes(nodes.filter(n => n.id !== node.id)) }}>🗑️</Button>
                  )}
                </div>
                {/* Connection points */}
                <div style={{ position: 'absolute', left: '50%', top: '-6px', transform: 'translateX(-50%)', width: 12, height: 12, borderRadius: '50%', backgroundColor: nodeType.color, border: '2px solid var(--color-surface-container)', opacity: mode === 'connect' ? 1 : 0.5, transition: 'opacity var(--motion-snap)' }} />
                <div style={{ position: 'absolute', left: '50%', bottom: '-6px', transform: 'translateX(-50%)', width: 12, height: 12, borderRadius: '50%', backgroundColor: nodeType.color, border: '2px solid var(--color-surface-container)', opacity: mode === 'connect' ? 1 : 0.5, transition: 'opacity var(--motion-snap)' }} />
              </div>
            </div>
          )
        })}

        {/* Selected Node Properties Panel */}
        {selectedNode && (
          <div style={{ 
            position: 'absolute', 
            right: 'var(--spacing-4)', 
            top: 'var(--spacing-4)', 
            bottom: 'var(--spacing-4)', 
            width: 320,
            backgroundColor: 'var(--color-surface-container)',
            border: '1px solid var(--color-border-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-4)',
            overflow: 'auto',
            zIndex: 20
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)', paddingBottom: 'var(--spacing-3)', borderBottom: '1px solid var(--color-border-primary)' }}>
              <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600 }}>Node Properties</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedNode(null)}>✕</Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>Node Label</label>
                <Input 
                  value={nodes.find(n => n.id === selectedNode)?.label || ''}
                  onChange={(e) => setNodes(nodes.map(n => n.id === selectedNode ? { ...n, label: e.target.value } : n))}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>Configuration</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                  <Input placeholder="API Endpoint" />
                  <Input placeholder="Timeout (ms)" type="number" />
                  <select style={{ padding: 'var(--spacing-2) var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)', backgroundColor: 'var(--color-surface-container)', color: 'var(--color-text-primary)', fontSize: 'var(--text-body-sm)' }}>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button variant="secondary" size="sm" style={{ flex: 1 }}>🧪 Test</Button>
                <Button variant="ghost" size="sm" onClick={() => setNodes(nodes.filter(n => n.id !== selectedNode!))}>🗑️ Delete</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Properties Panel (when no node selected) */}
      {!selectedNode && (
        <div style={{ 
          position: 'absolute', 
          right: 'var(--spacing-4)', 
          top: 'var(--spacing-4)', 
          bottom: 'var(--spacing-4)', 
          width: 320,
          backgroundColor: 'var(--color-surface-container)',
          border: '1px solid var(--color-border-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-4)',
          overflow: 'auto',
          zIndex: 20
        }}>
          <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Workflow Settings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>Name</label>
              <Input value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>Description</label>
              <Input placeholder="Workflow description..." />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>Version</label>
              <Input value="1.0.0" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked />
                <span>Auto-save drafts</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', cursor: 'pointer' }}>
                <input type="checkbox" />
                <span>Validate on save</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked />
                <span>Show execution IDs</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}