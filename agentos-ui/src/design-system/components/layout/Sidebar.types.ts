// Sidebar Types
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

export interface NavBadge {
  label: string;
  variant: 'success' | 'warning' | 'error' | 'info';
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
  badge?: NavBadge;
  children?: NavItem[];
}

export interface WorkspaceNavItem extends NavItem {
  workspace: string;
  route: string;
}