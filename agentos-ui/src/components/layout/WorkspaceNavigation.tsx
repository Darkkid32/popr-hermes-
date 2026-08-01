import { useState } from 'react';
import { clsx } from 'clsx';
import { useWorkspaceStore } from '../../stores/workspaceStore';

interface WorkspaceNavigationProps {
  currentWorkspace?: string;
  onWorkspaceChange?: (workspaceId: string) => void;
  onCreateWorkspace?: () => void;
}

export function WorkspaceNavigation({
  currentWorkspace,
  onWorkspaceChange,
  onCreateWorkspace
}: WorkspaceNavigationProps) {
  const { workspaces, setCurrentWorkspaceById } = useWorkspaceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [_showCreateModal, setShowCreateModal] = useState(false);

  const handleWorkspaceSelect = (workspaceId: string) => {
    setCurrentWorkspaceById(workspaceId);
    onWorkspaceChange?.(workspaceId);
  };

  const filteredWorkspaces = workspaces.filter(w =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="workspace-nav flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-surface-border)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">
              Workspaces
            </h2>
            <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">
              {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-tertiary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search workspaces..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--color-surface-secondary)] border border-[var(--color-surface-border)] rounded-[var(--radius-md)] text-[var(--text-sm)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)] focus:border-transparent"
          />
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={clsx(
              'p-2 rounded-[var(--radius-md)] transition-colors',
              viewMode === 'grid'
                ? 'bg-[var(--color-brand-500)/15] text-[var(--color-brand-500)]'
                : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'
            )}
            aria-label="Grid view"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={clsx(
              'p-2 rounded-[var(--radius-md)] transition-colors',
              viewMode === 'list'
                ? 'bg-[var(--color-brand-500)/15] text-[var(--color-brand-500)]'
                : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'
            )}
            aria-label="List view"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Workspace list */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredWorkspaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <svg className="h-12 w-12 text-[var(--color-text-tertiary)] mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
              <path d="M3 15h18" />
            </svg>
            <h3 className="text-[var(--text-lg)] font-medium text-[var(--color-text-secondary)] mb-1">
              No workspaces found
            </h3>
            <p className="text-[var(--color-text-tertiary)] mb-4">
              {searchQuery ? 'Try adjusting your search' : 'Create your first workspace to get started'}
            </p>
            <button
              onClick={() => { onCreateWorkspace?.(); setShowCreateModal(true); }}
              className="px-4 py-2 bg-[var(--color-brand-500)] text-[var(--color-text-inverse)] rounded-[var(--radius-md)] hover:bg-[var(--color-brand-600)] transition-colors"
            >
              Create Workspace
            </button>
          </div>
        ) : (
          <div className={clsx(
            viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'flex flex-col gap-2'
          )}>
            {filteredWorkspaces.map((workspace) => (
              <WorkspaceCard
                key={workspace.id}
                workspace={workspace}
                isActive={currentWorkspace === workspace.id}
                onClick={() => handleWorkspaceSelect(workspace.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface WorkspaceCardProps {
  workspace: {
    id: string;
    name: string;
    displayName: string;
    status: string;
    region?: string;
  };
  isActive: boolean;
  onClick: () => void;
}

function WorkspaceCard({ workspace, isActive, onClick }: WorkspaceCardProps) {
  const statusColors = {
    active: 'badge-green',
    provisioning: 'badge-amber',
    archived: 'badge-gray',
    deleted: 'badge-red',
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'group p-4 rounded-[var(--radius-lg)] transition-all duration-200 cursor-pointer',
        'bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)]',
        'hover:border-[var(--color-brand-500)] hover:shadow-[var(--shadow-md)]',
        'active:scale-[0.98]',
        isActive && 'border-[var(--color-brand-500)] shadow-[var(--shadow-md)]'
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={clsx(
            'w-10 h-10 rounded-[var(--radius-lg)] flex items-center justify-center',
            isActive
              ? 'bg-[var(--color-brand-500)] text-[var(--color-text-inverse)]'
              : 'bg-[var(--color-brand-500)/15] text-[var(--color-brand-500)]'
          )}>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
              <path d="M3 15h18" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-[var(--text-sm)] text-[var(--color-text-primary)]">
              {workspace.displayName}
            </h4>
            <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">
              {workspace.name}
            </p>
          </div>
        </div>
        <span className={clsx(
          'badge badge-xs',
          statusColors[workspace.status as keyof typeof statusColors] || 'badge-gray'
        )}>
          {workspace.status}
        </span>
      </div>

      {workspace.region && (
        <div className="flex items-center gap-1.5 text-[var(--text-xs)] text-[var(--color-text-tertiary)]">
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{workspace.region}</span>
        </div>
      )}
    </div>
  );
}

export default WorkspaceNavigation;
