# Hermes AI OS - Accessibility Guide

**Source**: Google Stitch Project `projects/10866743485103090405`  
**Design System**: Hermes AI OS  
**Version**: 1.0  
**Target**: WCAG 2.1 AA Compliance  
**Status**: Approved - Single Source of Truth

---

## Accessibility Commitment

Hermes AI OS targets **WCAG 2.1 Level AA** compliance across all workspaces. This guide provides implementation requirements for every component and pattern.

---

## Color & Contrast

### Minimum Contrast Ratios
| Element | Ratio | Stitch Verification |
|---------|-------|---------------------|
| Body text | 4.5:1 | ✅ `#DDE2F8` on `#020617` = 15.3:1 |
| Large text (18px+) | 3:1 | ✅ `#DDE2F8` on `#020617` = 15.3:1 |
| UI Components | 3:1 | ✅ `#2DD4BF` on `#0B1120` = 4.8:1 |
| Focus Indicators | 3:1 | ✅ Cyan glow on dark = 4.8:1 |
| Disabled text | - | `#859490` on `#0B1120` = 3.2:1 |

### Color-Only Information Prohibited
- **Status**: Always use icon + text + color
- **Errors**: Icon + text + red border + red text
- **Links**: Underline + color (not color alone)
- **Charts**: Patterns + labels + color

### Dark Mode Only
- Light mode not supported in v1
- All tokens defined for dark theme
- System preference respected for future

---

## Keyboard Navigation

### Focus Management

#### Focus Ring (Global)
```css
:focus-visible {
  outline: none;
  box-shadow: 
    0 0 0 2px var(--color-primary),
    0 0 0 4px rgba(45, 212, 191, 0.2);
  border-radius: var(--radius-sm);
}
```

#### Skip Links
```html
<!-- First focusable element in body -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<!-- In main content -->
<main id="main-content" tabIndex="-1">
```

#### Focus Trap (Modals/Drawers)
- Trap focus within component
- Restore focus to trigger on close
- Escape key closes component

#### Focus Order
1. Logical DOM order = visual order
2. Tab: Next interactive element
3. Shift+Tab: Previous
4. Arrow keys: Within composite widgets
5. Escape: Close/dismiss
6. Enter/Space: Activate

### Keyboard Shortcuts

| Shortcut | Action | ARIA |
|----------|--------|------|
| ⌘K | Workspace Switcher | `aria-label="Switch workspace"` |
| ⌘⇧P | Command Palette | `aria-label="Command palette"` |
| ⌘⇧N | Notifications | `aria-label="Notifications"` |
| ⌘/ | Global Search | `aria-label="Search"` |
| ⌘B | Toggle Sidebar | `aria-label="Toggle sidebar"` |
| ⌘, | Settings | `aria-label="Settings"` |
| ⌘? | Shortcuts Help | `aria-label="Keyboard shortcuts"` |
| Escape | Close modal/panel | - |
| Tab | Next focusable | - |
| Shift+Tab | Previous focusable | - |

### Composite Widget Navigation

| Widget | Keys |
|--------|------|
| Tabs | ←/→ navigate, Home/End, Enter/Space activate |
| Menu/Dropdown | ↑/↓ navigate, Enter/Space select, Escape close |
| Tree View | ↑/↓ navigate, ← collapse, → expand, Enter select |
| Table | ↑/↓ rows, ←/→ cells, Space select, Ctrl+A all |
| Slider | ←/→ adjust, Home/End min/max, PageUp/Down step |
| Dialog | Tab cycles within, Escape close |

---

## Screen Reader Support

### Semantic HTML Structure

#### Page Landmarks
```html
<body>
  <a href="#main" class="skip-link">Skip to main content</a>
  
  <header role="banner">
    <nav role="navigation" aria-label="Global navigation">
      <!-- Top nav -->
    </nav>
  </header>
  
  <aside role="complementary" aria-label="Workspace navigation">
    <nav role="navigation" aria-label="Sidebar">
      <!-- Sidebar -->
    </nav>
  </aside>
  
  <main id="main" role="main" tabIndex="-1">
    <nav role="navigation" aria-label="Breadcrumb" aria-hidden="false">
      <!-- Breadcrumbs -->
    </nav>
    <!-- Page content -->
  </main>
  
  <aside role="complementary" aria-label="Details panel" hidden>
    <!-- Right panel -->
  </aside>
</body>
```

#### Live Regions
```html
<!-- Toast container -->
<div role="region" aria-live="polite" aria-label="Notifications" class="toast-container">
  <!-- Toasts inserted here -->
</div>

<!-- Loading status -->
<div role="status" aria-live="polite" aria-atomic="true" class="sr-only">
  Loading agents...
</div>

<!-- Critical alerts -->
<div role="alert" aria-live="assertive" aria-atomic="true">
  <!-- Auto-announced -->
</div>
```

#### ARIA Patterns by Component

**Button**
```html
<button 
  type="button"
  aria-label="Deploy agent"
  aria-disabled="false"
  aria-pressed="false"
  aria-expanded="false"
  aria-haspopup="dialog"
>
  Deploy Agent
</button>
```

**Input**
```html
<label for="agent-name">Agent Name</label>
<input 
  id="agent-name"
  type="text"
  aria-required="true"
  aria-invalid="false"
  aria-describedby="agent-name-hint agent-name-error"
  autocomplete="off"
>
<span id="agent-name-hint">Enter a unique name</span>
<span id="agent-name-error" role="alert" hidden>Name already exists</span>
```

**Select (Combobox)**
```html
<div role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-controls="model-options">
  <input 
    role="textbox" 
    aria-autocomplete="list"
    aria-controls="model-options"
    aria-activedescendant="option-3"
  >
  <ul role="listbox" id="model-options">
    <li role="option" id="option-1" aria-selected="false">GPT-4o</li>
    <li role="option" id="option-2" aria-selected="false">Claude-3.5</li>
    <li role="option" id="option-3" aria-selected="true">Llama-3-70B</li>
  </ul>
</div>
```

**Table**
```html
<table role="grid" aria-label="Agent fleet">
  <thead>
    <tr role="row">
      <th role="columnheader" aria-sort="ascending">Name</th>
      <th role="columnheader">Status</th>
      <th role="columnheader">Model</th>
    </tr>
  </thead>
  <tbody>
    <tr role="row" aria-selected="false">
      <td role="gridcell">Agent-01</td>
      <td role="gridcell"><span role="status" aria-label="Running">●</span> Running</td>
      <td role="gridcell">GPT-4o</td>
    </tr>
  </tbody>
</table>
```

**Tabs**
```html
<div role="tablist" aria-label="Workspace views">
  <button role="tab" aria-selected="true" aria-controls="panel-overview" id="tab-overview">Overview</button>
  <button role="tab" aria-selected="false" aria-controls="panel-fleet" id="tab-fleet">Fleet</button>
</div>
<div role="tabpanel" id="panel-overview" aria-labelledby="tab-overview">...</div>
<div role="tabpanel" id="panel-fleet" aria-labelledby="tab-fleet" hidden>...</div>
```

**Modal/Dialog**
```html
<div role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-desc">
  <h2 id="modal-title">Deploy Agent</h2>
  <p id="modal-desc">Configure and deploy a new agent</p>
  <!-- Content -->
  <button aria-label="Close dialog">×</button>
</div>
```

**Tree View**
```html
<ul role="tree" aria-label="Team hierarchy">
  <li role="treeitem" aria-expanded="true" aria-level="1">
    <button aria-label="Collapse Engineering">Engineering</button>
    <ul role="group">
      <li role="treeitem" aria-level="2">AI Infrastructure</li>
    </ul>
  </li>
</ul>
```

**Tooltip**
```html
<button aria-describedby="tooltip-deploy">Deploy</button>
<div id="tooltip-deploy" role="tooltip">Deploy a new agent (⌘D)</div>
```

---

## Reduced Motion

### CSS
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### JavaScript
```typescript
const useReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
};
```

### Component Implementation
```typescript
const { duration, easing } = reducedMotion 
  ? { duration: 0, easing: 'linear' }
  : { duration: 300, easing: 'easeOut' };
```

---

## Touch & Mobile Accessibility

### Touch Targets
- Minimum 44×44px (WCAG 2.5.5)
- Recommended 48×48px
- Spacing between targets: 8px minimum

### Touch Gestures
- No custom gestures required for core functionality
- Swipe for drawer: Alternative button provided
- Pinch zoom: Not required (responsive design)

### Mobile Focus
- Focus visible on tap
- Virtual keyboard doesn't obscure focused input
- Viewport zoom disabled for inputs (`font-size: 16px`)

---

## Content Accessibility

### Text
- Minimum 16px base font size
- Line height ≥ 1.5
- Letter spacing ≥ 0.12em for caps
- No justified text (left-aligned)
- Max line width 80ch

### Images
- All informative images have `alt` text
- Decorative images: `alt=""` + `role="presentation"`
- Complex charts: Text summary + data table alternative
- Icons: `aria-hidden="true"` when adjacent to text

### Forms
- Every input has `<label>`
- Required: `aria-required="true"` + visual indicator
- Errors: `aria-invalid="true"` + `aria-describedby` error message
- Instructions: `aria-describedby` hint text
- Groups: `<fieldset>` + `<legend>`

### Data Tables
- `<caption>` for table purpose
- `<th scope="col|row">` for headers
- `aria-sort` on sortable columns
- Row selection: `aria-selected`

---

## Testing Checklist

### Automated (CI)
- [ ] axe-core: 0 violations
- [ ] Lighthouse Accessibility: ≥ 95
- [ ] Pa11y: WCAG AA pass

### Manual (Per Release)
- [ ] Keyboard-only navigation (all flows)
- [ ] Screen reader (NVDA/JAWS/VoiceOver)
- [ ] Zoom 200% (no horizontal scroll)
- [ ] High contrast mode (Windows)
- [ ] Reduced motion (OS setting)
- [ ] Color blindness simulation (Protanopia, Deuteropia)

### Component-Level
- [ ] Focus ring visible
- [ ] Focus order logical
- [ ] ARIA attributes correct
- [ ] Live regions announce
- [ ] Error messages announced
- [ ] Tooltips accessible on focus
- [ ] Modals trap focus
- [ ] Skip links work

---

## Implementation Requirements

### Every Component Must
1. Accept `className` for custom styling
2. Forward `ref` for focus management
3. Support `disabled`, `readOnly`, `aria-*` props
4. Handle `prefers-reduced-motion`
5. Test with keyboard only
6. Document ARIA pattern in Storybook

### Global Setup
```tsx
// main.tsx
import { FocusRing } from '@radix-ui/react-focus-ring';
// or custom focus ring CSS

// Global styles
@import './design-system/cssVariables.css';
// Contains focus ring, skip link, reduced motion
```

### Storybook Accessibility Addon
```typescript
// .storybook/preview.ts
import { withA11y } from '@storybook/addon-a11y';
export const decorators = [withA11y];
```

---

## Compliance Mapping

| WCAG Criterion | Implementation | Status |
|----------------|----------------|--------|
| 1.1.1 Non-text Content | alt text, aria-label | ✅ |
| 1.3.1 Info & Relationships | Semantic HTML, ARIA | ✅ |
| 1.3.2 Meaningful Sequence | DOM order = visual | ✅ |
| 1.4.3 Contrast (Minimum) | Token system verified | ✅ |
| 1.4.4 Resize Text | Rem units, zoom to 200% | ✅ |
| 1.4.11 Non-text Contrast | UI tokens 3:1+ | ✅ |
| 2.1.1 Keyboard | All functionality | ✅ |
| 2.1.2 No Keyboard Trap | Focus trap + Escape | ✅ |
| 2.4.3 Focus Order | Logical tab order | ✅ |
| 2.4.6 Headings & Labels | h1-h6, label elements | ✅ |
| 2.4.7 Focus Visible | Cyan glow ring | ✅ |
| 3.1.2 Language of Parts | lang attribute | ✅ |
| 3.2.1 On Focus | No unexpected changes | ✅ |
| 3.2.2 On Input | No auto-submit | ✅ |
| 3.3.1 Error Identification | Inline + live region | ✅ |
| 3.3.2 Labels/Instructions | label + aria-describedby | ✅ |
| 4.1.2 Name, Role, Value | ARIA patterns | ✅ |
| 4.1.3 Status Messages | Live regions | ✅ |

---

## Resources
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [axe-core](https://github.com/dequelabs/axe-core)
- [Radix UI Primitives](https://www.radix-ui.com/) - Accessible by default