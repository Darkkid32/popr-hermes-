import type { ReactNode, CSSProperties } from 'react'
import { useEffect, useRef } from 'react'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showClose?: boolean
}

const sizeStyles: Record<string, CSSProperties> = {
  sm: { width: 400, maxWidth: '90vw' },
  md: { width: 560, maxWidth: '90vw' },
  lg: { width: 720, maxWidth: '90vw' },
  xl: { width: 900, maxWidth: '95vw' },
}

export function Drawer({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md', 
  showClose = true 
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      <div
        className="drawer-overlay"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          zIndex: 999,
          animation: 'fadeIn 0.2s ease',
        }}
      />
      <div
        ref={drawerRef}
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: sizeStyles[size].width,
          maxWidth: sizeStyles[size].maxWidth,
          maxHeight: '90vh',
          background: 'var(--bg-1)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.4)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.2s ease',
        }}
      >
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translate(-50%, -45%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
          }
        `}</style>
        <div className="drawer-header" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
        }}>
          <h2 id="drawer-title" style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--text)',
            margin: 0,
          }}>
            {title}
          </h2>
          {showClose && (
            <button
              onClick={onClose}
              aria-label="Close drawer"
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                border: 'none',
                background: 'transparent',
                color: 'var(--text-3)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                lineHeight: 1,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              ✕
            </button>
          )}
        </div>
        <div className="drawer-body" style={{
          flex: 1,
          overflow: 'auto',
          padding: 20,
        }}>
          {children}
        </div>
      </div>
    </>
  )
}