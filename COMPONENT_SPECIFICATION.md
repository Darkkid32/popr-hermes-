# Hermes AI OS - Component Specification

**Source**: Google Stitch Project `projects/10866743485103090405`  
**Design System**: Hermes AI OS  
**Version**: 1.0  
**Status**: Approved - Single Source of Truth

---

## Component Inventory Overview

| Category | Components | Count |
|----------|------------|-------|
| **Layout** | AppShell, Sidebar, TopNav, WorkspaceSwitcher, CommandPalette, NotificationCenter | 6 |
| **Navigation** | Tabs, Breadcrumbs, Pagination, Stepper, TreeView | 5 |
| **Data Display** | Card, Table, MetricCard, StatusBadge, Avatar, Badge, Chip, Progress, Skeleton, Chart, Graph, CodeBlock, Terminal, DataGrid | 14 |
| **Forms** | Button, Input, Textarea, Select, Checkbox, Radio, Switch, Slider, DatePicker, FileUpload, FormField, SearchInput | 12 |
| **Feedback** | Modal, Drawer, Toast, Tooltip, Popover, Alert, EmptyState, LoadingOverlay, ConfirmDialog | 9 |
| **Overlay** | Dropdown, Menu, ContextMenu, Popover | 4 |
| **Specialized** | WorkflowCanvas, KnowledgeGraph, ServiceTopology, AgentCard, SkillCard, PluginCard, ModelCard, MCPServerCard | 8 |

**Total**: 58 Components

---

## 1. Layout Components

### AppShell
**Purpose**: Root layout wrapper for all workspaces  
**Props**:
```typescript
interface AppShellProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  topNav: React.ReactNode;
  rightPanel?: React.ReactNode;
  isSidebarCollapsed: boolean;
  onSidebarToggle: () => void;
}
```
**States**: Default, SidebarCollapsed, RightPanelOpen, MobileDrawer  
**Responsive**: 
- Desktop: Fixed sidebar + fluid main + optional right panel
- Tablet: Collapsible sidebar drawer
- Mobile: Hamburger menu → full-screen drawer

**Accessibility**: 
- `role="navigation"` on sidebar
- `role="main"` on content area
- Skip link for keyboard users
- Focus trap in mobile drawer

---

### Sidebar
**Purpose**: Primary workspace navigation  
**Variants**: Default (280px), Collapsed (72px), Mobile Drawer (100vw)  
**Props**:
```typescript
interface SidebarProps {
  items: NavItem[];
  activeItem: string;
  onItemClick: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  user: User;
}
```
**States**: Default, Hover, Active, Collapsed, Loading, Error  
**Items**: Workspace icon + label, badge counts, nested sections  
**Keyboard**: Arrow keys navigation, Enter to activate, Escape to collapse  

---

### TopNav
**Purpose**: Contextual actions, search, notifications, user menu  
**Props**:
```typescript
interface TopNavProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  actions: ActionItem[];
  searchPlaceholder: string;
  onSearch: (query: string) => void;
  notifications: Notification[];
  onNotificationClick: (id: string) => void;
  user: User;
  onUserMenuAction: (action: string) => void;
}
```
**States**: Default, SearchFocused, NotificationsOpen, UserMenuOpen  
**Height**: 44px (desktop), 48px (mobile)  
**Responsive**: Actions collapse into overflow menu on tablet/mobile  

---

### WorkspaceSwitcher
**Purpose**: Switch between 12 workspaces  
**Props**:
```typescript
interface WorkspaceSwitcherProps {
  workspaces: Workspace[];
  activeWorkspace: string;
  onSwitch: (id: string) => void;
  recentWorkspaces: string[];
}
```
**Variants**: Dropdown (top nav), Modal (⌘K), Sidebar section  
**Keyboard**: ⌘K to open, arrow keys, Enter to select, Escape to close  

---

### CommandPalette
**Purpose**: Global command interface (⌘⇧P)  
**Props**:
```typescript
interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: Command[];
  onExecute: (command: Command) => void;
  recentCommands: string[];
}
```
**Features**: Fuzzy search, keyboard shortcuts display, categories, recent  
**Accessibility**: Role=dialog, aria-modal=true, focus trap, Escape to close  

---

### NotificationCenter
**Purpose**: Centralized notification management (⌘⇧N)  
**Props**:
```typescript
interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onAction: (notification: Notification, action: string) => void;
}
```
**Variants**: Inline (toast), Panel (notification center), Modal (critical)  
**States**: Unread, Read, Dismissed, ActionRequired  

---

## 2. Navigation Components

### Tabs
**Purpose**: Sub-view navigation within workspace  
**Variants**: Default, Underline, Pill, Icon+Label, Scrollable  
**Props**:
```typescript
interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  variant: 'default' | 'underline' | 'pill';
  scrollable: boolean;
}
```
**States**: Default, Hover, Active, Focus, Disabled  
**Keyboard**: Arrow keys, Home/End, Enter/Space to activate  

---

### Breadcrumbs
**Purpose**: Hierarchical location indicator  
**Props**:
```typescript
interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator: React.ReactNode;
  maxItems: number;
  onItemClick: (item: BreadcrumbItem) => void;
}
```
**Responsive**: Collapse middle items with ellipsis on mobile  
**Accessibility**: `aria-label="Breadcrumb"`, current page `aria-current="page"`  

---

### Pagination
**Purpose**: Large dataset navigation  
**Variants**: Default, Compact, Simple (prev/next only)  
**Props**:
```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  showPageSize: boolean;
}
```
**States**: Default, Hover, Active, Disabled, Loading  

---

### Stepper
**Purpose**: Multi-step workflows (wizards, onboarding)  
**Variants**: Horizontal, Vertical, Compact  
**Props**:
```typescript
interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (index: number) => void;
  orientation: 'horizontal' | 'vertical';
  variant: 'default' | 'compact';
}
```
**Step States**: Pending, Active, Complete, Error, Disabled  
**Keyboard**: Arrow keys between steps, Enter to activate  

---

### TreeView
**Purpose**: Hierarchical navigation (team topology, file tree, knowledge graph)  
**Props**:
```typescript
interface TreeViewProps {
  data: TreeNode[];
  expandedKeys: string[];
  selectedKeys: string[];
  onExpand: (keys: string[]) => void;
  onSelect: (keys: string[]) => void;
  renderNode: (node: TreeNode) => React.ReactNode;
  allowDragDrop: boolean;
  onDrop: (dragNode: TreeNode, dropNode: TreeNode, position: number) => void;
}
```
**Features**: Checkbox selection, drag-drop reorder, async loading, virtualization  
**Keyboard**: Arrow keys, Enter/Space to expand, Ctrl+Click multi-select  

---

## 3. Data Display Components

### Card
**Purpose**: Content container with consistent elevation  
**Variants**: Default, Elevated, Outlined, Glass, Interactive  
**Props**:
```typescript
interface CardProps {
  variant: 'default' | 'elevated' | 'outlined' | 'glass' | 'interactive';
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  elevation: 0 | 1 | 2;
}
```
**States**: Default, Hover, Active, Loading, Disabled  
**Elevation Levels**: 
- Level 0: Flat (no shadow)
- Level 1: Card surface (1px border)
- Level 2: Popover/Modal (cyan glow shadow)

---

### Table
**Purpose**: High-density tabular data  
**Variants**: Default, Striped, Bordered, Compact, Virtualized  
**Props**:
```typescript
interface TableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  rowKey: keyof T | ((row: T) => string);
  selection?: {
    mode: 'single' | 'multiple';
    selectedKeys: string[];
    onChange: (keys: string[]) => void;
  };
  sorting?: {
    column: string;
    direction: 'asc' | 'desc';
    onChange: (column: string, direction: 'asc' | 'desc') => void;
  };
  filtering?: {
    filters: Record<string, any>;
    onChange: (filters: Record<string, any>) => void;
  };
  pagination?: PaginationProps;
  virtualized?: boolean;
  rowHeight?: number;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyState?: React.ReactNode;
}
```
**Features**: Column resize, reorder, pin, virtualization (10k+ rows), row actions  
**Keyboard**: Arrow keys navigation, Space to select, Enter to open, Ctrl+A select all  

---

### MetricCard
**Purpose**: KPI display with trend, sparkline, threshold  
**Variants**: Default, Compact, Detailed, Comparison  
**Props**:
```typescript
interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    period: string;
  };
  sparkline?: number[];
  threshold?: {
    warning: number;
    critical: number;
    current: number;
  };
  status?: 'normal' | 'warning' | 'critical';
  onClick?: () => void;
}
```
**States**: Default, Warning (amber), Critical (red), Loading (skeleton)  

---

### StatusBadge
**Purpose**: Semantic status indicator  
**Variants**: Default, Dot, Pill, Outline, Icon  
**Props**:
```typescript
interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'warning' | 'error' | 'success' | 'info' | 'running' | 'stopped' | 'deploying';
  label?: string;
  variant: 'default' | 'dot' | 'pill' | 'outline' | 'icon';
  size: 'sm' | 'md' | 'lg';
  animated?: boolean; // for pulsing states
}
```
**Color Mapping**:
- Active/Running/Success: Emerald (#10B981)
- Pending/Deploying/Info: Cyan (#2DD4BF)
- Warning: Amber (#F59E0B)
- Error/Stopped: Red (#FFB4AB)
- Inactive: Slate (#859490)

---

### Avatar
**Purpose**: User, agent, workspace representation  
**Variants**: Image, Initials, Icon, Status  
**Props**:
```typescript
interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  initials?: string;
  icon?: React.ReactNode;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape: 'circle' | 'square';
  status?: 'online' | 'away' | 'busy' | 'offline';
  statusPosition?: 'bottom-right' | 'top-right';
  onClick?: () => void;
}
```
**Sizes**: xs(24), sm(32), md(40), lg(48), xl(56), 2xl(72)  
**Status Indicator**: 8px dot with 2px border  

---

### Badge
**Purpose**: Count, label, category indicator  
**Variants**: Default, Count, Category, Removable  
**Props**:
```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant: 'default' | 'count' | 'category' | 'removable';
  color?: 'default' | 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error';
  size: 'sm' | 'md' | 'lg';
  onRemove?: () => void;
  max?: number; // for count badges (show 99+)
}
```

---

### Chip
**Purpose**: Filter, tag, input token  
**Variants**: Default, Filter, Input, Removable, Clickable  
**Props**:
```typescript
interface ChipProps {
  label: string;
  icon?: React.ReactNode;
  variant: 'default' | 'filter' | 'input' | 'removable' | 'clickable';
  color?: 'default' | 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error';
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
}
```

---

### Progress
**Purpose**: Task, upload, process completion  
**Variants**: Linear, Circular, Indeterminate, Buffer, Steps  
**Props**:
```typescript
interface ProgressProps {
  value: number;
  max?: number;
  variant: 'linear' | 'circular' | 'indeterminate' | 'buffer' | 'steps';
  size: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  steps?: StepProgress[];
}
```

---

### Skeleton
**Purpose**: Loading placeholder matching content structure  
**Variants**: Text, Card, Table, Avatar, Chart, Custom  
**Props**:
```typescript
interface SkeletonProps {
  variant: 'text' | 'card' | 'table' | 'avatar' | 'chart' | 'custom';
  lines?: number;
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}
```
**Animation**: 1500ms ease-in-out infinite wave/pulse  

---

### Chart
**Purpose**: Data visualization (line, bar, area, pie, gauge)  
**Variants**: Line, Bar, Area, Pie, Donut, Gauge, Sparkline, Heatmap  
**Props**:
```typescript
interface ChartProps {
  type: 'line' | 'bar' | 'area' | 'pie' | 'donut' | 'gauge' | 'sparkline' | 'heatmap';
  data: ChartData;
  options: ChartOptions;
  width?: number;
  height?: number;
  responsive?: boolean;
  loading?: boolean;
  error?: string;
  onDataPointClick?: (point: ChartDataPoint) => void;
}
```
**Library**: Recharts (primary), Chart.js (fallback)  
**Theme**: Dark mode colors, cyan primary series, semantic colors for thresholds  

---

### Graph
**Purpose**: Node-edge visualization (topology, knowledge graph, workflow)  
**Variants**: Force-directed, Hierarchical, Circular, Grid  
**Props**:
```typescript
interface GraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  layout: 'force' | 'hierarchical' | 'circular' | 'grid';
  nodeRenderer: (node: GraphNode) => React.ReactNode;
  edgeRenderer?: (edge: GraphEdge) => React.ReactNode;
  onNodeClick?: (node: GraphNode) => void;
  onEdgeClick?: (edge: GraphEdge) => void;
  onNodeDrag?: (node: GraphNode, position: { x: number; y: number }) => void;
  zoomable?: boolean;
  panable?: boolean;
  minZoom?: number;
  maxZoom?: number;
  fitView?: boolean;
}
```
**Library**: React Flow (workflows), Cytoscape (topology), Sigma.js (knowledge graph)  

---

### CodeBlock
**Purpose**: Syntax-highlighted code display  
**Variants**: Inline, Block, Copyable, Editable, Terminal  
**Props**:
```typescript
interface CodeBlockProps {
  code: string;
  language: string;
  theme: 'dark' | 'light';
  showLineNumbers: boolean;
  highlightLines?: number[];
  copyable: boolean;
  editable?: boolean;
  onChange?: (code: string) => void;
  maxHeight?: number;
  wordWrap?: boolean;
}
```
**Library**: Shiki / Prism.js  
**Theme**: Hermes dark (JetBrains Mono, cyan accents)  

---

### Terminal
**Purpose**: Interactive shell emulation  
**Props**:
```typescript
interface TerminalProps {
  prompt: string;
  history: TerminalLine[];
  onCommand: (command: string) => Promise<TerminalLine[]>;
  placeholder: string;
  maxHistory?: number;
  welcomeMessage?: string;
  fontSize?: number;
  fontFamily?: string;
}
```
**Features**: Command history (↑/↓), Tab completion, ANSI colors, WebSocket streaming  

---

### DataGrid
**Purpose**: Spreadsheet-like editing experience  
**Props**:
```typescript
interface DataGridProps<T> {
  columns: GridColumnDef<T>[];
  rows: T[];
  onRowUpdate: (row: T, changes: Partial<T>) => Promise<void>;
  onRowAdd: (row: Partial<T>) => Promise<T>;
  onRowDelete: (row: T) => Promise<void>;
  editable?: boolean;
  selection?: GridSelectionModel;
  onSelectionChange?: (selection: GridSelectionModel) => void;
  clipboard?: boolean;
  undoRedo?: boolean;
}
```
**Library**: TanStack Table + custom editing  

---

## 4. Form Components

### Button
**Purpose**: Primary action trigger  
**Variants**: Primary, Secondary, Tertiary, Ghost, Danger, Link  
**Sizes**: sm(32px), md(40px), lg(48px), xl(56px)  
**Props**:
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger' | 'link';
  size: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition: 'start' | 'end';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}
```
**States**: Default, Hover, Active, Focus, Loading, Disabled  
**Loading**: Spinner replaces content, width preserved  

---

### Input
**Purpose**: Single-line text entry  
**Variants**: Default, Search, Password, Prefix/Suffix, Clearable  
**Sizes**: sm(36px), md(44px), lg(52px)  
**Props**:
```typescript
interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'url';
  size: 'sm' | 'md' | 'lg';
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  clearable?: boolean;
  error?: string;
  hint?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  maxLength?: number;
  onBlur?: () => void;
  onFocus?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}
```
**States**: Default, Hover, Focus, Error, Disabled, ReadOnly, Loading  

---

### Textarea
**Purpose**: Multi-line text entry  
**Props**:
```typescript
interface TextareaProps extends Omit<InputProps, 'type' | 'prefix' | 'suffix' | 'clearable'> {
  rows?: number;
  minRows?: number;
  maxRows?: number;
  autoResize?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}
```

---

### Select
**Purpose**: Single selection from options  
**Variants**: Default, Searchable, Multi, Async, Grouped  
**Props**:
```typescript
interface SelectProps<T> {
  value: T | null;
  onChange: (value: T | null) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  searchable?: boolean;
  multi?: boolean;
  grouped?: boolean;
  async?: boolean;
  loadOptions?: (query: string) => Promise<SelectOption<T>[]>;
  disabled?: boolean;
  error?: string;
  hint?: string;
  label?: string;
  required?: boolean;
  maxSelected?: number;
  renderOption?: (option: SelectOption<T>) => React.ReactNode;
  renderValue?: (value: T) => React.ReactNode;
}
```
**Keyboard**: Type to filter, Arrow keys, Enter to select, Escape to close  

---

### Checkbox
**Purpose**: Boolean or multi-select  
**Variants**: Default, Indeterminate, Toggle  
**Props**:
```typescript
interface CheckboxProps {
  checked: boolean | 'indeterminate';
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  error?: string;
  size: 'sm' | 'md' | 'lg';
}
```

---

### Radio
**Purpose**: Single selection from mutually exclusive options  
**Variants**: Default, Card, Button  
**Props**:
```typescript
interface RadioProps<T> {
  value: T;
  onChange: (value: T) => void;
  options: RadioOption<T>[];
  orientation: 'horizontal' | 'vertical';
  variant: 'default' | 'card' | 'button';
  disabled?: boolean;
  error?: string;
}
```

---

### Switch
**Purpose**: Binary on/off toggle  
**Variants**: Default, WithLabels, Size variants  
**Props**:
```typescript
interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
}
```
**Animation**: 150ms snap transition  

---

### Slider
**Purpose**: Range selection  
**Variants**: Single, Range, Stepped, Marks  
**Props**:
```typescript
interface SliderProps {
  value: number | [number, number];
  onChange: (value: number | [number, number]) => void;
  min: number;
  max: number;
  step?: number;
  marks?: SliderMark[];
  range?: boolean;
  disabled?: boolean;
  showTooltip?: boolean;
  formatTooltip?: (value: number) => string;
}
```

---

### DatePicker
**Purpose**: Date/date-range selection  
**Variants**: Single, Range, Month, Year, DateTime  
**Props**:
```typescript
interface DatePickerProps {
  value: Date | Date[] | null;
  onChange: (value: Date | Date[] | null) => void;
  mode: 'single' | 'range' | 'month' | 'year' | 'datetime';
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  format?: string;
  timePicker?: boolean;
  showWeekNumbers?: boolean;
}
```

---

### FileUpload
**Purpose**: File selection with drag-drop  
**Variants**: Single, Multiple, Folder, Dropzone  
**Props**:
```typescript
interface FileUploadProps {
  onFilesSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // bytes
  disabled?: boolean;
  dropzone?: boolean;
  showFileList?: boolean;
  onFileRemove?: (file: File) => void;
}
```

---

### FormField
**Purpose**: Composed label + input + hint + error  
**Props**:
```typescript
interface FormFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  htmlFor?: string;
  layout?: 'vertical' | 'horizontal';
  labelWidth?: number;
}
```

---

### SearchInput
**Purpose**: Specialized search with shortcuts, history, suggestions  
**Props**:
```typescript
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  shortcuts: KeyboardShortcut[];
  recentSearches: string[];
  suggestions?: SearchSuggestion[];
  onSearch: (query: string) => void;
  onClear: () => void;
  loading?: boolean;
  width?: number;
}
```
**Keyboard**: ⌘K to focus, ↑/↓ for suggestions, Enter to search, Escape to clear  

---

## 5. Feedback Components

### Modal
**Purpose**: Focused task completion, confirmation, forms  
**Variants**: Default, Fullscreen, SidePanel, Confirmation, Alert  
**Props**:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  focusTrap?: boolean;
  restoreFocus?: boolean;
}
```
**Animation**: 250ms enter (scale + fade), 200ms exit  
**Accessibility**: Role=dialog, aria-modal=true, aria-labelledby, focus trap  

---

### Drawer
**Purpose**: Side panel for contextual content  
**Variants**: Left, Right, Bottom, FullHeight  
**Props**:
```typescript
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position: 'left' | 'right' | 'bottom';
  title?: string;
  children: React.ReactNode;
  size: 'sm' | 'md' | 'lg' | 'full';
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showHandle?: boolean;
}
```
**Animation**: 300ms slide (transform translateX/Y)  
**Responsive**: Bottom drawer on mobile, side drawer on desktop  

---

### Toast
**Purpose**: Transient non-blocking notifications  
**Variants**: Success, Error, Warning, Info, Loading, Custom  
**Props**:
```typescript
interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'loading' | 'custom';
  title: string;
  message?: string;
  duration?: number; // 0 = persistent
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose: (id: string) => void;
  dismissible?: boolean;
}
```
**Position**: Top-right (default), Bottom-right, Top-center  
**Stacking**: Max 5 visible, older push up  
**Animation**: 200ms slide + fade  

---

### Tooltip
**Purpose**: Contextual help on hover/focus  
**Variants**: Default, Rich, Interactive  
**Props**:
```typescript
interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
  delay?: number;
  hideDelay?: number;
  interactive?: boolean;
  offset?: number;
  arrow?: boolean;
}
```
**Animation**: 200ms fade + scale  
**Accessibility**: aria-describedby, keyboard accessible (focus shows)  

---

### Popover
**Purpose**: Floating panel with arbitrary content  
**Variants**: Menu, Form, Info, ColorPicker, DatePicker  
**Props**:
```typescript
interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: React.ReactElement;
  content: React.ReactNode;
  position: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  focusTrap?: boolean;
}
```

---

### Alert
**Purpose**: Inline persistent notification  
**Variants**: Success, Error, Warning, Info, Banner  
**Props**:
```typescript
interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'banner';
  title: string;
  message?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  actions?: React.ReactNode;
  icon?: boolean;
}
```
**Banner Variant**: Full-width, top of page, persistent until dismissed  

---

### EmptyState
**Purpose**: No data, no results, first-time experience  
**Variants**: Default, Illustration, Action, Search, Error  
**Props**:
```typescript
interface EmptyStateProps {
  variant: 'default' | 'illustration' | 'action' | 'search' | 'error';
  title: string;
  description?: string;
  illustration?: React.ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  size: 'sm' | 'md' | 'lg';
}
```

---

### LoadingOverlay
**Purpose**: Full-page or container loading  
**Variants**: Fullscreen, Container, Inline, Skeleton  
**Props**:
```typescript
interface LoadingOverlayProps {
  isVisible: boolean;
  variant: 'fullscreen' | 'container' | 'inline' | 'skeleton';
  message?: string;
  progress?: number;
  indeterminate?: boolean;
  children?: React.ReactNode;
}
```

---

### ConfirmDialog
**Purpose**: Destructive action confirmation  
**Props**:
```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  variant: 'danger' | 'warning' | 'info';
  loading?: boolean;
}
```

---

## 6. Overlay Components

### Dropdown
**Purpose**: Action menu, user menu, language selector  
**Variants**: Default, Searchable, Grouped, Checkable, Radio  
**Props**:
```typescript
interface DropdownProps<T> {
  trigger: React.ReactElement;
  items: DropdownItem<T>[];
  onSelect: (item: DropdownItem<T>) => void;
  position?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  searchable?: boolean;
  grouped?: boolean;
  maxHeight?: number;
  closeOnSelect?: boolean;
}
```

---

### Menu
**Purpose**: Context menu, right-click actions  
**Props**:
```typescript
interface MenuProps {
  items: MenuItem[];
  onClose: () => void;
  position: { x: number; y: number };
  onItemClick: (item: MenuItem) => void;
}
```

---

### ContextMenu
**Purpose**: Right-click contextual actions  
**Props**:
```typescript
interface ContextMenuProps {
  items: ContextMenuItem[];
  target: React.RefObject<HTMLElement>;
  onItemClick: (item: ContextMenuItem, event: React.MouseEvent) => void;
}
```
**Keyboard**: Shift+F10 or ContextMenu key to open  

---

## 7. Specialized Components

### WorkflowCanvas
**Purpose**: Visual workflow builder with drag-drop nodes  
**Props**:
```typescript
interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  onNodesChange: (nodes: WorkflowNode[]) => void;
  onEdgesChange: (edges: WorkflowEdge[]) => void;
  onConnect: (connection: EdgeConnection) => void;
  nodeTypes: Record<string, React.ComponentType<WorkflowNodeProps>>;
  edgeTypes: Record<string, React.ComponentType<WorkflowEdgeProps>>;
  readOnly?: boolean;
  minimap?: boolean;
  controls?: boolean;
  background?: BackgroundProps;
}
```
**Library**: React Flow  
**Features**: Grid snap, auto-layout, minimap, controls, keyboard shortcuts  

---

### KnowledgeGraph
**Purpose**: Interactive entity-relationship visualization  
**Props**:
```typescript
interface KnowledgeGraphProps {
  entities: GraphEntity[];
  relationships: GraphRelationship[];
  layout: 'force' | 'hierarchical' | 'circular';
  onEntityClick: (entity: GraphEntity) => void;
  onRelationshipClick: (rel: GraphRelationship) => void;
  searchQuery: string;
  filters: GraphFilters;
  onFiltersChange: (filters: GraphFilters) => void;
  selection: string[];
  onSelectionChange: (ids: string[]) => void;
}
```
**Library**: Cytoscape.js / Sigma.js  
**Features**: Search highlight, filter panels, detail sidebar, export  

---

### ServiceTopology
**Purpose**: Microservice dependency graph  
**Props**:
```typescript
interface ServiceTopologyProps {
  services: TopologyService[];
  dependencies: TopologyDependency[];
  layout: 'hierarchical' | 'force' | 'circular';
  onServiceClick: (service: TopologyService) => void;
  healthFilter: 'all' | 'healthy' | 'degraded' | 'critical';
  trafficAnimation: boolean;
  detailPanel: React.ReactNode;
}
```
**Library**: Cytoscape.js  
**Features**: Health colors, traffic flow animation, metric overlays  

---

### AgentCard
**Purpose**: Agent representation in grids/lists  
**Variants**: Default, Compact, Detailed, Status  
**Props**:
```typescript
interface AgentCardProps {
  agent: Agent;
  variant: 'default' | 'compact' | 'detailed' | 'status';
  onClick?: () => void;
  onAction?: (action: string, agent: Agent) => void;
  actions?: AgentAction[];
  showMetrics?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
}
```

---

### SkillCard / PluginCard / ModelCard / MCPServerCard
**Purpose**: Marketplace/library item cards  
**Shared Props**:
```typescript
interface MarketplaceCardProps<T> {
  item: T;
  variant: 'grid' | 'list' | 'featured' | 'compact';
  installed?: boolean;
  onInstall?: (item: T) => void;
  onConfigure?: (item: T) => void;
  onRemove?: (item: T) => void;
  onClick?: () => void;
  showRating?: boolean;
  showCategory?: boolean;
}
```

---

## Component State Matrix

| Component | Default | Hover | Active | Focus | Loading | Disabled | Error | Success | Warning |
|-----------|---------|-------|--------|-------|---------|----------|-------|---------|---------|
| Button | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | - | - |
| Input | ✅ | ✅ | - | ✅ | ✅ | ✅ | ✅ | - | - |
| Select | ✅ | ✅ | - | ✅ | ✅ | ✅ | ✅ | - | - |
| Checkbox | ✅ | ✅ | - | ✅ | - | ✅ | - | - | - |
| Switch | ✅ | ✅ | - | ✅ | ✅ | ✅ | - | - | - |
| Card | ✅ | ✅ | ✅ | - | ✅ | ✅ | - | - | - |
| Table Row | ✅ | ✅ | ✅ | ✅ | - | - | - | - | - |
| Tab | ✅ | ✅ | - | ✅ | - | ✅ | - | - | - |
| Badge | ✅ | - | - | - | - | - | - | - | - |
| StatusBadge | ✅ | - | - | - | ✅ | - | - | - | - |
| Modal | - | - | - | ✅ | - | - | - | - | - |
| Toast | ✅ | - | - | - | - | - | - | - | - |
| Tooltip | - | ✅ | - | ✅ | - | - | - | - | - |
| Dropdown | ✅ | ✅ | - | ✅ | - | ✅ | - | - | - |
| Avatar | ✅ | - | - | - | - | - | - | - | - |
| Chip | ✅ | ✅ | ✅ | ✅ | - | ✅ | - | - | - |
| Progress | ✅ | - | - | - | ✅ | - | - | ✅ | ✅ |
| Skeleton | - | - | - | - | ✅ | - | - | - | - |

---

## Accessibility Requirements (All Components)

### Keyboard Navigation
- Tab order logical and visible
- Arrow keys for composite widgets
- Escape to close overlays
- Enter/Space to activate
- Home/End for first/last
- Shortcuts documented (⌘K, ⌘⇧P, ⌘⇧N)

### Screen Reader
- Semantic HTML (button, nav, main, aside, dialog)
- ARIA roles where needed (role="dialog", "menu", "tree", "tablist")
- aria-label / aria-labelledby / aria-describedby
- aria-expanded, aria-selected, aria-checked, aria-pressed
- Live regions for dynamic content (toasts, loading)

### Focus Management
- Visible focus ring (cyan glow, 2px)
- Focus trap in modals/drawers
- Restore focus on close
- Skip links for main content

### Color & Contrast
- WCAG AA minimum (4.5:1 text, 3:1 UI)
- Focus indicators not color-only
- Status not color-only (icon + text)
- Dark mode only (no light mode in v1)

### Motion
- Respects `prefers-reduced-motion`
- Essential animations only
- Disableable via settings

---

## Responsive Behavior

| Component | Desktop (≥1024) | Tablet (768-1023) | Mobile (<768) |
|-----------|-----------------|-------------------|---------------|
| Sidebar | Fixed 280px | Collapsible drawer | Hamburger → drawer |
| TopNav | Full actions | Overflow menu | Hamburger + search |
| Tables | Full columns | Horizontal scroll | Card list view |
| Cards | Grid (3-4 col) | Grid (2 col) | Single column |
| Modals | Centered 560px | 90vw, max 560px | 100vw, bottom sheet |
| Drawers | Right 400px | Right 90vw | Bottom 100vh |
| Tooltips | Hover + focus | Focus only | Focus only |
| Dropdowns | Click | Click | Full-screen modal |
| Tabs | All visible | Scrollable | Scrollable |
| Charts | Full size | Responsive | Stacked |
| Graphs | Pan/zoom | Pan/zoom | Pan/zoom |
| Forms | Inline labels | Stacked labels | Stacked labels |

---

## Implementation Priority

### Phase 1 (Foundation)
1. Button, Input, Select, Checkbox, Switch, Radio
2. Card, Badge, Chip, Avatar, StatusBadge
3. Modal, Drawer, Toast, Tooltip, Popover
4. Table (basic), Tabs, Breadcrumbs
5. AppShell, Sidebar, TopNav
6. ThemeProvider, CSS Variables

### Phase 2 (Data Display)
1. MetricCard, Progress, Skeleton, EmptyState
2. Table (virtualized, sorting, filtering, selection)
3. Chart, CodeBlock, Terminal
4. TreeView, Pagination, Stepper
5. Dropdown, Menu, ContextMenu

### Phase 3 (Specialized)
1. WorkflowCanvas (React Flow)
2. KnowledgeGraph (Cytoscape/Sigma)
3. ServiceTopology (Cytoscape)
4. DataGrid (TanStack Table)
5. AgentCard, SkillCard, PluginCard, ModelCard, MCPServerCard
6. CommandPalette, NotificationCenter, WorkspaceSwitcher

### Phase 4 (Advanced Forms)
1. DatePicker, FileUpload, Slider
2. SearchInput (with shortcuts/history)
3. FormField (composed)
4. Select (async, multi, grouped)

---

## Testing Requirements

### Unit Tests (per component)
- Render with all variants
- Props validation
- State transitions
- Event handlers
- Accessibility (axe-core)

### Integration Tests
- Component composition
- Form submission flows
- Modal/Drawer open/close
- Table interactions
- Keyboard navigation

### Visual Regression
- Storybook + Chromatic
- Compare against Stitch screenshots
- All variants, states, sizes
- Dark mode only
- Responsive breakpoints

### E2E Tests
- Critical user journeys
- Workspace switching
- Command palette
- Workflow builder
- Authentication flow

---

## Documentation Per Component

Each component in Storybook must include:
1. **Props Table** (auto-generated from TypeScript)
2. **Variants Gallery** (all visual variants)
3. **States Gallery** (all interactive states)
4. **Responsive Preview** (3 breakpoints)
5. **Accessibility Notes** (keyboard, screen reader)
6. **Usage Examples** (common patterns)
7. **Do/Don't** (design guidelines)
8. **Changelog** (version history)