# Hermes AI OS - Responsive Guide

**Source**: Google Stitch Project `projects/10866743485103090405`  
**Design System**: Hermes AI OS  
**Version**: 1.0  
**Status**: Approved - Single Source of Truth

---

## Breakpoint System

```json
{
  "breakpoint": {
    "mobile": 375,
    "mobileLg": 428,
    "tablet": 768,
    "tabletLg": 1024,
    "desktop": 1280,
    "desktopLg": 1440,
    "desktopXl": 1920,
    "desktop2xl": 2560
  }
}
```

### CSS Variables
```css
:root {
  --bp-mobile: 375px;
  --bp-mobile-lg: 428px;
  --bp-tablet: 768px;
  --bp-tablet-lg: 1024px;
  --bp-desktop: 1280px;
  --bp-desktop-lg: 1440px;
  --bp-desktop-xl: 1920px;
  --bp-desktop-2xl: 2560px;
}
```

### Media Queries
```css
/* Mobile First Approach */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Desktop Large */ }
@media (min-width: 1440px) { /* Desktop XL */ }

/* Max-width for mobile-only styles */
@media (max-width: 767px) { /* Mobile Only */ }
@media (max-width: 1023px) { /* Mobile + Tablet */ }
```

---

## Layout Adaptations

### App Shell

| Breakpoint | Sidebar | Top Nav | Content | Right Panel |
|------------|---------|---------|---------|-------------|
| **Mobile** (<768) | Hamburger → Full-screen drawer | Logo + Search + Notifications + User (4 items) | Full width, stacked | Bottom sheet |
| **Tablet** (768-1023) | Collapsible (icons only when collapsed) | Overflow menu for actions | Fluid, 12-col grid | Side drawer (90vw) |
| **Desktop** (≥1024) | Fixed 280px | All actions visible | Fluid, 12-col grid (24px gutter) | Fixed 320px |
| **Desktop XL** (≥1440) | Fixed 320px | All actions + extra spacing | 12-col grid (32px gutter) | Fixed 360px |

### Grid System
```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-gutter); /* 24px */
}

/* Mobile: 1 column */
@media (max-width: 767px) {
  .grid { grid-template-columns: 1fr; gap: var(--space-md); }
}

/* Tablet: 2-4 columns */
@media (min-width: 768px) and (max-width: 1023px) {
  .grid { grid-template-columns: repeat(4, 1fr); gap: var(--space-md); }
}

/* Desktop: 12 columns */
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(12, 1fr); gap: var(--space-gutter); }
}
```

---

## Component Responsive Specifications

### Navigation

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| **Sidebar** | Hamburger → Drawer (100vw) | Collapsible icons + tooltips | Fixed 280px, labels |
| **Top Nav** | 4-item compact | Overflow menu (⋮) | Full actions |
| **Breadcrumbs** | Collapsed (Home > Current) | 3 items + ellipsis | Full path |
| **Workspace Switcher** | Modal (full-screen) | Modal (centered) | Modal (centered) |
| **Command Palette** | Modal (full-screen) | Modal (centered) | Modal (centered) |

### Data Display

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| **Table** | Card list view (stacked) | Horizontal scroll | Full columns |
| **Data Grid** | Card list | 2-col grid | Full spreadsheet |
| **Metric Cards** | 1-col stack | 2-col grid | 4-col grid |
| **Charts** | Full width, stacked | 2-col grid | 3-4 col grid |
| **Cards** | 1-col stack | 2-col grid | 3-4 col grid |
| **Graphs/Canvas** | Touch pan/zoom, no minimap | Full, touch-optimized | Full + minimap |
| **Code/Terminal** | Full width, horizontal scroll | Full width | Full width |

### Forms

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| **Inputs** | Full width, stacked labels | Full width, stacked labels | Inline labels (160px) |
| **Select** | Full-screen modal | Dropdown (full width) | Dropdown (320px) |
| **Date Picker** | Full-screen modal | Popover | Popover |
| **File Upload** | Full width dropzone | Full width dropzone | 400px dropzone |
| **Modal** | Full-screen bottom sheet | 90vw, max 560px | 560px centered |
| **Drawer** | Bottom sheet (100vh) | Side drawer (90vw) | Right drawer (400px) |
| **Toast** | Bottom center | Top right | Top right |

### Feedback

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| **Tooltip** | Disabled (touch) | Focus only | Hover + focus |
| **Dropdown** | Full-screen modal | Dropdown | Dropdown |
| **Context Menu** | Long press → modal | Long press → modal | Right-click |
| **Toast** | Bottom center stack | Top right stack | Top right stack |

---

## Stitch Screen Coverage

### Current Responsive Screens (2/28)
| Screen | Desktop | Tablet | Mobile |
|--------|---------|--------|--------|
| Mission Control Dashboard | ✅ 2560×2048 | ❌ | ✅ 780×2618 |
| Organization Overview | ✅ 2560×2048 | ✅ 2560×2108 | ❌ |

### Required Responsive Variants (26 screens × 2 = 52)

#### Priority 1 (P0 Workspaces)
| Screen | Tablet | Mobile |
|--------|--------|--------|
| Fleet Manager | Required | Required |
| System Dashboard | Required | Required |
| Users & RBAC Builder | Required | Required |
| Audit Logs & SSO Config | Required | Optional |
| Security Posture | Required | Required |
| Threat Detection | Required | Required |
| Vulnerability Management | Required | Optional |
| Compliance Center | Required | Optional |

#### Priority 1 (P0 Workspaces - Continued)
| Screen | Tablet | Mobile |
|--------|--------|--------|
| Telemetry Overview | Required | Required |
| Service Topology Map | Required | Simplified |
| Metrics Explorer | Required | Required |
| Log Aggregation | Required | Required |
| Distributed Tracing | Required | Simplified |
| Alert Rules | Required | Required |
| Dashboard Builder | Required | Optional |
| Data Streams | Required | Required |

#### Priority 2 (P1 Workspaces)
| Screen | Tablet | Mobile |
|--------|--------|--------|
| Automation Hub | Required | Required |
| Visual Workflow Builder | Required | Simplified |
| Execution History | Required | Required |
| Model Catalog | Required | Required |
| Model Benchmarks | Required | Optional |
| Routing Rules | Required | Required |
| Endpoint Health | Required | Optional |
| Knowledge Graph | Required | Search-first |
| Vector Search | Required | Required |
| Notes Editor | Required | Required |
| Omi Timeline | Required | Required |
| Vault Browser | Required | Required |

#### Priority 2 (P1 Workspaces - Continued)
| Screen | Tablet | Mobile |
|--------|--------|--------|
| Plugin Marketplace | Required | Required |
| Installed Plugins | Required | Required |
| Skill Marketplace | Required | Required |
| Skill Builder | Required | Simplified |
| MCP Server Registry | Required | Required |
| Tools Explorer | Required | Required |

#### Priority 3 (P2)
| Screen | Tablet | Mobile |
|--------|--------|--------|
| Settings (6 tabs) | Required | Required |
| Authentication | Required | Required |
| AI Terminal | Required | Required |

---

## Responsive Patterns

### Table → Card List (Mobile)
```tsx
// Desktop: Table
<table>...</table>

// Mobile: Card List
<div className="card-list" role="list">
  {data.map(row => (
    <Card key={row.id} className="mobile-card">
      <div className="card-row">
        <span className="label">Name</span>
        <span className="value">{row.name}</span>
      </div>
      <div className="card-row">
        <span className="label">Status</span>
        <StatusBadge status={row.status} />
      </div>
      {/* ... */}
    </Card>
  ))}
</div>
```

### Grid Stacking
```css
/* Desktop: 4 columns */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-lg);
}

/* Tablet: 2 columns */
@media (max-width: 1023px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-md);
  }
}

/* Mobile: 1 column */
@media (max-width: 767px) {
  .metrics-grid {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
}
```

### Sidebar Behavior
```tsx
const Sidebar = () => {
  const [collapsed, setCollapsed] = useLocalStorage('sidebar-collapsed', false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');

  // Mobile: drawer overlay
  if (isMobile) {
    return (
      <>
        {mobileOpen && <Backdrop onClick={() => setMobileOpen(false)} />}
        <aside className={`sidebar-drawer ${mobileOpen ? 'open' : ''}`}>
          <SidebarContent collapsed={false} />
        </aside>
      </>
    );
  }

  // Tablet: collapsible
  if (isTablet) {
    return (
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <SidebarContent collapsed={collapsed} />
        <button onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
          <ChevronIcon />
        </button>
      </aside>
    );
  }

  // Desktop: fixed with collapse option
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <SidebarContent collapsed={collapsed} />
      <button onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
        <ChevronIcon />
      </button>
    </aside>
  );
};
```

### Modal/Drawer Responsive
```tsx
const ResponsiveModal = ({ isOpen, onClose, children, size = 'md' }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');

  if (isMobile) {
    // Full-screen bottom sheet
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div className="backdrop" onClick={onClose} />
            <motion.div
              className="bottom-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <SheetHandle />
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  if (isTablet) {
    // 90vw, max 560px, centered
    return (
      <Modal isOpen={isOpen} onClose={onClose} size={size} maxWidth="90vw" />
    );
  }

  // Desktop: standard modal
  return <Modal isOpen={isOpen} onClose={onClose} size={size} />;
};
```

### Chart Responsive
```tsx
const ResponsiveChart = ({ data, type, ...props }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Mobile: simplify chart
  const isMobile = useMediaQuery('(max-width: 767px)');
  const simplifiedData = isMobile ? simplifyData(data) : data;
  const simplifiedType = isMobile && type === 'line' ? 'area' : type;

  return (
    <div ref={containerRef} style={{ width: '100%', height: 300 }}>
      <Chart type={simplifiedType} data={simplifiedData} width={dimensions.width} height={dimensions.height} {...props} />
    </div>
  );
};
```

---

## Typography Responsive

### Fluid Typography
```css
:root {
  --text-display-lg: clamp(32px, 5vw, 48px);
  --text-headline-lg: clamp(24px, 3.5vw, 32px);
  --text-headline-md: clamp(20px, 2.5vw, 24px);
  --text-title-lg: clamp(16px, 2vw, 18px);
  --text-body-lg: clamp(16px, 1.5vw, 18px);
  --text-body-md: clamp(14px, 1vw, 16px);
  --text-body-sm: clamp(12px, 0.8vw, 14px);
}
```

### Line Length Control
```css
.prose {
  max-width: 65ch; /* Optimal reading width */
  margin-inline: auto;
}

@media (max-width: 767px) {
  .prose {
    max-width: 100%;
    padding-inline: var(--space-md);
  }
}
```

---

## Image & Media Responsive

### Responsive Images
```tsx
<picture>
  <source media="(max-width: 767px)" srcSet="/images/dashboard-mobile.webp" type="image/webp" />
  <source media="(max-width: 1023px)" srcSet="/images/dashboard-tablet.webp" type="image/webp" />
  <img src="/images/dashboard-desktop.webp" alt="Mission Control Dashboard" loading="lazy" />
</picture>
```

### Illustration Scaling
```css
.illustration {
  width: 100%;
  max-width: 400px;
  height: auto;
}

@media (max-width: 767px) {
  .illustration {
    max-width: 280px;
  }
}
```

---

## Testing Requirements

### Viewport Testing Matrix
| Device | Width | Height | Orientation | Tests |
|--------|-------|--------|-------------|-------|
| iPhone SE | 375 | 667 | Portrait | All flows |
| iPhone 14 | 390 | 844 | Portrait | All flows |
| iPhone 14 Pro Max | 428 | 926 | Portrait | All flows |
| iPad Mini | 768 | 1024 | Portrait | All flows |
| iPad Pro | 1024 | 1366 | Portrait | All flows |
| Desktop HD | 1366 | 768 | Landscape | All flows |
| Desktop FHD | 1920 | 1080 | Landscape | All flows |
| Desktop 4K | 2560 | 1440 | Landscape | All flows |

### Automated Testing
```typescript
// Playwright visual regression
test.describe('Responsive Visual Regression', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'desktop-xl', width: 1920, height: 1080 },
  ];

  for (const vp of viewports) {
    test(`Matches Stitch at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/mission-control');
      await expect(page).toHaveScreenshot(`mission-control-${vp.name}.png`);
    });
  }
});
```

### Manual Testing Checklist
- [ ] All breakpoints render without horizontal scroll
- [ ] Touch targets ≥ 44×44px on mobile/tablet
- [ ] Text readable at 200% zoom
- [ ] No content clipping
- [ ] Navigation accessible at all sizes
- [ ] Forms usable on mobile (keyboard doesn't obscure)
- [ ] Charts readable on mobile
- [ ] Graphs navigable on touch
- [ ] Modals/drawers appropriate for viewport
- [ ] Performance acceptable on mobile (3G throttle)

---

## Implementation Checklist

### Global
- [ ] Breakpoint CSS variables defined
- [ ] Media query mixins/utilities created
- [ ] `useMediaQuery` hook implemented
- [ ] Container queries where appropriate

### Layout
- [ ] AppShell responsive
- [ ] Sidebar responsive (3 states)
- [ ] TopNav responsive (overflow menu)
- [ ] Grid system responsive

### Components (All 58)
- [ ] Each component has responsive specs
- [ ] Tested at all 4 breakpoints
- [ ] Touch targets verified
- [ ] No horizontal overflow

### Screens (28)
- [ ] All 26 missing responsive variants designed
- [ ] Tablet variants for P0/P1 screens
- [ ] Mobile variants for P0/P1 screens
- [ ] Tablet/Mobile for P2 screens

### Testing
- [ ] Visual regression at 4 viewports
- [ ] Device lab testing (8 devices)
- [ ] Accessibility at all sizes
- [ ] Performance budgets met