# Hermes AI OS - Navigation Architecture

**Source**: Google Stitch Project `projects/10866743485103090405`  
**Design System**: Hermes AI OS  
**Version**: 1.0  
**Status**: Approved - Single Source of Truth

---

## Navigation Philosophy

**Fixed-Fluid Hybrid Layout** with three persistent layers:
1. **Global Layer** - Workspace switcher, global search, notifications, user
2. **Workspace Layer** - Sidebar navigation, contextual top bar
3. **Page Layer** - Tabs, breadcrumbs, page actions, content

---

## Global Navigation (Persistent)

### Workspace Switcher
**Trigger**: Top-left logo/name (click) or ⌘K  
**Pattern**: Modal overlay with fuzzy search  
**Content**:
```
┌─────────────────────────────────────┐
│  Workspaces                    ⌘K  │
├─────────────────────────────────────┤
│  Recent                            │
│  ▸ Mission Control        [MC]     │
│  ▸ Organization             [ORG]  │
│  ▸ Security                 [SEC]  │
├─────────────────────────────────────┤
│  All Workspaces                    │
│  ▸ Machine Control           [MC]  │
│  ▸ Organization              [ORG] │
│  ▸ Security                  [SEC] │
│  ▸ Observability             [OBS] │
│  ▸ Automation                [AUT] │
│  ▸ Models                    [MOD] │
│  ▸ Memory & Knowledge        [MEM] │
│  ▸ Plugins                   [PLG] │
│  ▸ Skills                    [SKL] │
│  ▸ MCP                       [MCP] │
│  ▸ Settings                  [SET] │
├─────────────────────────────────────┤
│  Shortcuts                         │
│  ⌘K  Open Workspace Switcher       │
│  ⌘⇧P Open Command Palette          │
│  ⌘⇧N Open Notifications            │
│  ⌘/  Focus Global Search           │
└─────────────────────────────────────┘
```

**Keyboard**: ⌘K to open, ↑/↓ navigate, Enter select, Escape close  
**State**: Remembers last 3 workspaces, shows recent first  

---

### Global Search
**Trigger**: Top bar search input or ⌘/  
**Pattern**: Inline expansion → results panel  
**Scope**: Cross-workspace entity search (agents, models, workflows, skills, docs)  
**Results**: Grouped by type with icons, keyboard navigable  

---

### Command Palette
**Trigger**: ⌘⇧P  
**Pattern**: Modal with categorized commands  
**Categories**:
- Navigation (Go to...)
- Actions (Deploy, Create, Run...)
- Settings (Toggle theme, Density...)
- Developer (Debug, Logs, Console...)
- Help (Shortcuts, Docs, Support)

---

### Notification Center
**Trigger**: Bell icon (top bar) or ⌘⇧N  
**Pattern**: Side panel (desktop), Bottom sheet (mobile)  
**Sections**: Unread, Read, All  
**Actions**: Mark read, Dismiss, Action buttons (View, Resolve, Configure)  

---

### User Menu
**Trigger**: Avatar (top-right)  
**Items**:
- Profile & Preferences
- Appearance (Theme, Density, Font Size)
- Keyboard Shortcuts
- API Keys
- Sessions & Devices
- Sign Out

---

## Workspace Navigation (Contextual)

### Sidebar (Primary Navigation)
**Width**: 280px (expanded), 72px (collapsed)  
**Behavior**: Persistent, collapsible, mobile drawer  
**Structure**:
```
┌─────────────────────────────┐
│  HERMES          [≡]        │  ← Top bar (collapsed state)
├─────────────────────────────┤
│  WORKSPACES                 │
│  ▸ Mission Control          │
│  ▸ Organization             │
│  ▸ Security                 │
│  ▸ Observability            │
│  ▸ Automation               │
│  ▸ Models                   │
│  ▸ Memory & Knowledge       │
│  ▸ Plugins                  │
│  ▸ Skills                   │
│  ▸ MCP                      │
│  ▸ Settings                 │
├─────────────────────────────┤
│  CURRENT WORKSPACE          │
│  Mission Control            │
│  ├── Overview               │
│  ├── Fleet Manager          │
│  └── System Dashboard       │
├─────────────────────────────┤
│  QUICK ACTIONS              │
│  + Deploy Agent             │
│  + Create Workflow          │
│  + Upload Model             │
├─────────────────────────────┤
│  USER                       │
│  [Avatar] John Doe          │
│  Admin ▼                    │
└─────────────────────────────┘
```

**Collapsed State**: Icons only, tooltips on hover  
**Mobile**: Hamburger menu → full-screen drawer overlay  
**Keyboard**: ⌘B to toggle collapse, ↑/↓ navigate, Enter activate  

---

### Top Nav (Contextual)
**Height**: 44px  
**Structure**:
```
┌─────────────────────────────────────────────────────────────────┐
│  ◀ Back    Mission Control > Overview          [Search]  🔔 👤 │
├─────────────────────────────────────────────────────────────────┤
│  Page Title              [Filters] [Actions] [View Options]     │
└─────────────────────────────────────────────────────────────────┘
```

**Elements**:
- **Back Button**: Browser-style, appears on child pages
- **Breadcrumbs**: Workspace > Page > Sub-page (max 3, then ellipsis)
- **Page Title**: H1, matches sidebar selection
- **Global Search**: Always accessible
- **Page Actions**: Primary actions (Deploy, Create, Export)
- **Filters**: Contextual filter chips
- **View Options**: Density, Layout, Columns
- **Notifications**: Badge count, click → Notification Center
- **User Menu**: Avatar, click → User Menu

---

### Workspace Tabs (Sub-navigation)
**Purpose**: Multiple views within a workspace page  
**Variants**: Default (underline), Pill, Segmented  
**Behavior**: 
- Horizontal scroll if overflow
- Keyboard: ←/→ navigate, Home/End, Enter activate
- Persist active tab per workspace in localStorage

---

## Page Navigation (Content)

### Breadcrumbs
**Location**: Top of page content, below top nav  
**Pattern**: Home > Workspace > Page > Sub-page > Current  
**Max Items**: 4 visible + ellipsis  
**Current Page**: Non-clickable, `aria-current="page"`  

---

### In-Page Navigation
- **Anchor Links**: Table of contents for long pages
- **Tabs**: Sub-views (Overview, Metrics, Logs, Config)
- **Steppers**: Multi-step wizards (Deploy Agent, Create Workflow)
- **Accordions**: Collapsible sections

---

## Navigation State Management

### URL Structure
```
/                                    → Mission Control (default)
/mission-control                     → Mission Control Overview
/mission-control/fleet               → Fleet Manager
/mission-control/system              → System Dashboard
/organization                        → Organization Overview
/organization/teams                  → Teams & RBAC
/organization/audit                  → Audit Logs & SSO
/security                            → Security Posture
/security/threats                    → Threat Detection
/security/vulnerabilities            → Vulnerability Management
/security/compliance                 → Compliance Center
/observability                       → Telemetry Overview
/observability/topology              → Service Topology
/observability/metrics               → Metrics Explorer
/observability/logs                  → Log Aggregation
/observability/tracing               → Distributed Tracing
/observability/alerts                → Alert Rules
/observability/dashboards            → Dashboard Builder
/automation                          → Automation Hub
/automation/builder                  → Visual Workflow Builder
/automation/history                  → Execution History
/models                              → Model Catalog
/models/benchmarks                   → Model Benchmarks
/models/routing                      → Routing Rules
/models/endpoints                    → Endpoint Health
/memory                              → Knowledge Graph
/memory/search                       → Vector Search
/memory/notes                        → Notes Editor
/memory/omi                          → Omi Captures
/memory/vault                        → Vault Browser
/plugins                             → Plugin Marketplace
/plugins/installed                   → Installed Plugins
/plugins/development                 → Plugin Development
/skills                              → Skill Marketplace
/skills/builder                      → Skill Builder
/skills/templates                    → Skill Templates
/mcp                                 → MCP Server Registry
/mcp/tools                           → Tools Explorer
/mcp/resources                       → Resources Browser
/mcp/prompts                         → Prompts Library
/settings                            → Settings (General tab)
/settings/appearance                 → Appearance
/settings/integrations               → Integrations
/settings/privacy                    → Privacy
/settings/performance                → Performance
/settings/advanced                   → Advanced
/login                               → Authentication
/sso                                 → SSO Configuration
/mfa                                 → MFA Setup
```

### Route Guards
- **Authentication**: All routes except `/login`, `/sso`, `/mfa`
- **Authorization**: Role-based (Admin, Operator, Viewer, Developer)
- **Workspace Access**: Feature flags per workspace
- **Redirects**: Unauthenticated → `/login?redirect=...`, Unauthorized → 403

### Navigation History
- Browser history API (pushState/replaceState)
- Back/Forward buttons work correctly
- Deep linking supported for all routes
- Refresh preserves state (stores rehydrate)

---

## Keyboard Navigation Map

| Shortcut | Action | Context |
|----------|--------|---------|
| ⌘K | Open Workspace Switcher | Global |
| ⌘⇧P | Open Command Palette | Global |
| ⌘⇧N | Open Notification Center | Global |
| ⌘/ | Focus Global Search | Global |
| ⌘B | Toggle Sidebar Collapse | Global |
| ⌘, | Open Settings | Global |
| ⌘? | Show Keyboard Shortcuts | Global |
| Escape | Close modal/panel/dropdown | Any |
| Tab | Next focusable | Any |
| Shift+Tab | Previous focusable | Any |
| ↑/↓ | Navigate lists/menus | Lists, Menus |
| ←/→ | Navigate tabs/breadcrumbs | Tabs, Breadcrumbs |
| Enter/Space | Activate button/link | Buttons, Links |
| Home/End | First/Last item | Lists, Tabs |
| Ctrl+Click | Multi-select | Tables, Trees |
| Shift+Click | Range select | Tables |
| Ctrl+A | Select all | Tables, Trees |
| / | Focus search (in context) | Pages with search |

---

## Responsive Navigation

### Desktop (≥1024px)
- Full sidebar (280px) + fluid content
- All top nav actions visible
- Hover states for all interactive elements
- Right-click context menus

### Tablet (768-1023px)
- Collapsible sidebar (icon-only when collapsed)
- Top nav actions in overflow menu
- Touch-friendly targets (44×44px min)
- Bottom sheet for drawers/modals

### Mobile (<768px)
- Hamburger menu → full-screen drawer
- Top nav: Logo + Search + Notifications + User only
- Pages: Stacked layout, cards instead of tables
- Modals: Full-screen bottom sheets
- Drawers: Bottom sheets
- Tooltips: Disabled (touch)
- Context menus: Long-press

---

## Navigation Transitions

### Workspace Switch
```
1. Fade out current content (150ms)
2. Update sidebar active state
3. Load new workspace data
4. Fade in new content (150ms)
5. Update URL, breadcrumbs, page title
```

### Page Navigation (Same Workspace)
```
1. Slide out old page (200ms, transform X)
2. Update breadcrumbs, tabs
3. Slide in new page (200ms, transform X)
4. Update URL
```

### Sidebar Collapse
```
1. Animate width (300ms, ease-out)
2. Switch labels → tooltips
3. Adjust content margin
4. Persist state to localStorage
```

### Mobile Drawer
```
1. Fade in backdrop (200ms)
2. Slide in drawer (300ms, transform X)
3. Trap focus
4. Body scroll lock
```

---

## Deep Linking & Shareable URLs

All views must be shareable via URL:
- Workspace + page + sub-page
- Filters, sorts, pagination state
- Selected entities (multi-select via comma-separated IDs)
- Time ranges (observability)
- Search queries

Format: `?filters[status]=active&sort=createdAt:desc&page=2&selection=agent-1,agent-2`

---

## Analytics Events

Track for UX optimization:
- `navigation.workspace_switch` (from, to, method)
- `navigation.page_view` (workspace, page, referrer)
- `navigation.search` (query, results_count, clicked_result)
- `navigation.command_palette` (command, success)
- `navigation.shortcut_used` (shortcut, context)
- `navigation.sidebar_toggle` (state)
- `navigation.breadcrumb_click` (level, destination)

---

## Implementation Notes

### React Router Structure
```tsx
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/sso" element={<SSO />} />
  <Route path="/mfa" element={<MFA />} />
  
  <Route element={<AppShell />}>
    <Route path="/" element={<Navigate to="/mission-control" replace />} />
    
    <Route path="mission-control" element={<MissionControlLayout />}>
      <Route index element={<MissionControlOverview />} />
      <Route path="fleet" element={<FleetManager />} />
      <Route path="system" element={<SystemDashboard />} />
    </Route>
    
    <Route path="organization" element={<OrganizationLayout />}>
      <Route index element={<OrganizationOverview />} />
      <Route path="teams" element={<TeamsRBAC />} />
      <Route path="audit" element={<AuditLogs />} />
    </Route>
    
    {/* ... other workspaces */}
    
    <Route path="settings" element={<SettingsLayout />}>
      <Route index element={<SettingsGeneral />} />
      <Route path="appearance" element={<SettingsAppearance />} />
      {/* ... other tabs */}
    </Route>
  </Route>
  
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Sidebar State (Zustand)
```typescript
interface SidebarState {
  collapsed: boolean;
  mobileOpen: boolean;
  activeWorkspace: string;
  activePage: string;
  toggleCollapse: () => void;
  setMobileOpen: (open: boolean) => void;
  setActiveWorkspace: (id: string) => void;
  setActivePage: (id: string) => void;
}
```

### Breadcrumb Generation
Auto-generated from route hierarchy + page metadata:
```typescript
const breadcrumbs = useBreadcrumbs(); // Derived from router + page config
```

---

## Accessibility Checklist

- [ ] All navigation keyboard accessible
- [ ] Focus indicators visible (cyan glow)
- [ ] Skip to main content link
- [ ] ARIA labels on icon-only buttons
- [ ] ARIA current on active breadcrumb
- [ ] ARIA expanded/collapsed on sidebar
- [ ] Focus trap in modals/drawers
- [ ] Restore focus on close
- [ ] Screen reader announcements for route changes
- [ ] Reduced motion respected
- [ ] Color not sole indicator (icons + text for status)