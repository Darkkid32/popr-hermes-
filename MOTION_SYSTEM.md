# Hermes AI OS - Motion System

**Source**: Google Stitch Project `projects/10866743485103090405`  
**Design System**: Hermes AI OS  
**Version**: 1.0  
**Status**: Approved - Single Source of Truth

---

## Motion Philosophy

**"Intelligence in Motion"** - Motion communicates system state, guides attention, and provides feedback. Every animation serves a functional purpose.

### Principles
1. **Purposeful** - No decorative animation
2. **Responsive** - 150ms for micro-interactions, 300ms for transitions
3. **Interruptible** - Animations can be cancelled/reversed
4. **Accessible** - Respects `prefers-reduced-motion`
5. **Performant** - 60fps, GPU-accelerated, no layout thrashing

---

## Duration Tokens

```json
{
  "motion": {
    "duration": {
      "instant": 0,
      "snap": 150,
      "fast": 200,
      "normal": 300,
      "slow": 400,
      "slowest": 500
    }
  }
}
```

| Token | Duration | Use Cases |
|-------|----------|-----------|
| `instant` | 0ms | State changes, focus rings |
| `snap` | 150ms | Hover, press, focus, toggle, tooltip |
| `fast` | 200ms | Dropdown, popover, small panel |
| `normal` | 300ms | Modal, drawer, sidebar, page transition |
| `slow` | 400ms | Complex panel, wizard step |
| `slowest` | 500ms | Full-screen transitions |

---

## Easing Tokens

```json
{
  "motion": {
    "easing": {
      "linear": "linear",
      "easeIn": "cubic-bezier(0.4, 0, 1, 1)",
      "easeOut": "cubic-bezier(0, 0, 0.2, 1)",
      "easeInOut": "cubic-bezier(0.4, 0, 0.2, 1)",
      "snap": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      "spring": "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
    }
  }
}
```

| Token | Curve | Feel | Use Cases |
|-------|-------|------|-----------|
| `linear` | Constant | Mechanical | Progress, scanning |
| `easeIn` | Accelerate | Heavy entering | Modal exit, drawer close |
| `easeOut` | Decelerate | Light exiting | Modal enter, drawer open |
| `easeInOut` | Smooth | Balanced | Page transitions |
| `snap` | Overshoot | Playful, responsive | Button press, toggle, hover |
| `spring` | Bouncy | Organic | Card expand, menu open |

---

## Semantic Motion Tokens

```json
{
  "motion": {
    "semantic": {
      "hover": { "duration": 150, "easing": "easeOut" },
      "press": { "duration": 100, "easing": "easeIn" },
      "focus": { "duration": 150, "easing": "easeOut" },
      "panelSlide": { "duration": 300, "easing": "easeOut" },
      "modalEnter": { "duration": 250, "easing": "easeOut" },
      "modalExit": { "duration": 200, "easing": "easeIn" },
      "tooltip": { "duration": 200, "easing": "easeOut" },
      "dropdown": { "duration": 200, "easing": "easeOut" },
      "drawer": { "duration": 300, "easing": "easeOut" },
      "aiScanning": { "duration": 2000, "easing": "linear", "iterations": "infinite" },
      "pulse": { "duration": 1500, "easing": "easeInOut", "iterations": "infinite" },
      "skeleton": { "duration": 1500, "easing": "easeInOut", "iterations": "infinite" },
      "pageTransition": { "duration": 300, "easing": "easeInOut" },
      "sidebarCollapse": { "duration": 300, "easing": "easeOut" },
      "tabSwitch": { "duration": 200, "easing": "easeOut" },
      "accordion": { "duration": 250, "easing": "easeOut" },
      "progress": { "duration": 500, "easing": "easeOut" },
      "toast": { "duration": 200, "easing": "easeOut" },
      "commandPalette": { "duration": 200, "easing": "easeOut" }
    }
  }
}
```

---

## Component Motion Specifications

### Button
| State | Animation | Duration | Easing |
|-------|-----------|----------|--------|
| Hover | Scale 1.02, bg color shift | 150ms | easeOut |
| Press | Scale 0.98 | 100ms | easeIn |
| Focus | Cyan glow ring (0→2px) | 150ms | easeOut |
| Loading | Spinner fade in, content fade out | 150ms | easeOut |
| Disabled | Opacity 0.5 | instant | - |

### Input / Select
| State | Animation | Duration | Easing |
|-------|-----------|----------|--------|
| Hover | Border color shift | 150ms | easeOut |
| Focus | Border + glow ring (0→2px) | 150ms | easeOut |
| Error | Border red + shake (3px × 3) | 300ms | spring |
| Clear button appear | Fade + scale | 150ms | easeOut |

### Card
| State | Animation | Duration | Easing |
|-------|-----------|----------|--------|
| Hover (interactive) | Elevate (level1→level2), shadow | 150ms | easeOut |
| Press | Scale 0.99 | 100ms | easeIn |
| Loading | Skeleton wave | 1500ms | easeInOut (loop) |

### Table Row
| State | Animation | Duration | Easing |
|-------|-----------|----------|--------|
| Hover | Background color shift | 150ms | easeOut |
| Select | Checkbox + bg color | instant | - |
| Expand (detail) | Height animate + chevron rotate | 250ms | easeOut |
| Sort | Fade out → reorder → fade in | 300ms | easeInOut |

### Modal
| Phase | Animation | Duration | Easing |
|-------|-----------|----------|--------|
| Enter | Backdrop fade (0→1) + Scale (0.95→1) + Slide Y (-20→0) | 250ms | easeOut |
| Exit | Backdrop fade (1→0) + Scale (1→0.95) + Slide Y (0→-20) | 200ms | easeIn |
| Focus Trap | Immediate | instant | - |

### Drawer
| Phase | Animation | Duration | Easing |
|-------|-----------|----------|--------|
| Enter (right) | Backdrop fade + TranslateX (100%→0) | 300ms | easeOut |
| Exit (right) | Backdrop fade + TranslateX (0→100%) | 250ms | easeIn |
| Enter (bottom) | Backdrop fade + TranslateY (100%→0) | 300ms | easeOut |
| Exit (bottom) | Backdrop fade + TranslateY (0→100%) | 250ms | easeIn |

### Sidebar
| Phase | Animation | Duration | Easing |
|-------|-----------|----------|--------|
| Collapse | Width (280→72) + Label fade + Icon center | 300ms | easeOut |
| Expand | Width (72→280) + Label fade in + Icon left | 300ms | easeOut |
| Mobile Open | Backdrop fade + TranslateX (-100%→0) | 300ms | easeOut |
| Mobile Close | Backdrop fade + TranslateX (0→-100%) | 250ms | easeIn |

### Dropdown / Popover / Tooltip
| Phase | Animation | Duration | Easing |
|-------|-----------|----------|--------|
| Enter | Fade (0→1) + Scale (0.95→1) + Slide Y (-8→0) | 200ms | easeOut |
| Exit | Fade (1→0) + Scale (1→0.95) + Slide Y (0→-8) | 150ms | easeIn |
| Reposition | Smooth translate | 150ms | easeOut |

### Tabs
| Action | Animation | Duration | Easing |
|--------|-----------|----------|--------|
| Switch | Indicator slide + Content cross-fade | 200ms | easeOut |
| Scroll | Indicator smooth follow | 150ms | easeOut |

### Toast
| Phase | Animation | Duration | Easing |
|-------|-----------|----------|--------|
| Enter | Slide X (100%→0) + Fade | 200ms | easeOut |
| Exit | Slide X (0→100%) + Fade | 200ms | easeIn |
| Stack | Existing toasts slide Y | 200ms | easeOut |

### Command Palette
| Phase | Animation | Duration | Easing |
|-------|-----------|----------|--------|
| Open | Backdrop fade + Scale (0.95→1) + Slide Y (-20→0) | 200ms | easeOut |
| Close | Backdrop fade + Scale (1→0.95) + Slide Y (0→-20) | 150ms | easeIn |
| Search | Results fade + height animate | 150ms | easeOut |

### Page Transition
| Phase | Animation | Duration | Easing |
|-------|-----------|----------|--------|
| Leave | Fade (1→0) + Slide X (0→-20px) | 200ms | easeIn |
| Enter | Fade (0→1) + Slide X (20px→0) | 300ms | easeOut |
| Cross-fade | Opacity cross-fade | 300ms | easeInOut |

### Accordion
| Phase | Animation | Duration | Easing |
|-------|-----------|----------|--------|
| Open | Height auto (0→scrollHeight) + Chevron rotate | 250ms | easeOut |
| Close | Height (scrollHeight→0) + Chevron rotate | 250ms | easeIn |

### Progress
| Type | Animation | Duration | Easing |
|------|-----------|----------|--------|
| Determinate | Width animate | 500ms | easeOut |
| Indeterminate | Shuttle translate | 1500ms | linear (loop) |
| Buffer | Dual bar animate | 500ms | easeOut |
| Steps | Step indicator pulse | 300ms | easeOut |

### Skeleton
| Variant | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Wave | Gradient translate X (-100%→100%) | 1500ms | easeInOut (loop) |
| Pulse | Opacity (0.4→1→0.4) | 1500ms | easeInOut (loop) |

### Switch / Toggle
| Phase | Animation | Duration | Easing |
|-------|-----------|----------|--------|
| Toggle | Thumb translate + Track color | 150ms | snap |
| Focus | Glow ring | 150ms | easeOut |

### Badge / Chip
| Phase | Animation | Duration | Easing |
|-------|-----------|----------|--------|
| Appear | Scale (0→1) + Fade | 150ms | snap |
| Remove | Scale (1→0) + Fade + Width collapse | 200ms | easeIn |
| Count change | Number flip + pulse | 300ms | snap |

### Avatar
| Phase | Animation | Duration | Easing |
|-------|-----------|----------|--------|
| Status appear | Scale (0→1) | 150ms | snap |
| Status change | Pulse + color shift | 300ms | snap |

### Charts / Graphs
| Action | Animation | Duration | Easing |
|--------|-----------|----------|--------|
| Initial render | Staggered bar/line draw | 800ms | easeOut |
| Data update | Morph paths | 500ms | easeOut |
| Hover highlight | Scale + glow | 150ms | easeOut |
| Filter change | Cross-fade series | 300ms | easeInOut |
| Zoom/pan | Transform translate/scale | 150ms | linear |

### Workflow Canvas (React Flow)
| Action | Animation | Duration | Easing |
|--------|-----------|----------|--------|
| Node drag | Smooth follow cursor | 0ms (direct) | - |
| Edge connect | Bezier curve draw | 200ms | easeOut |
| Auto-layout | Node position tween | 500ms | easeOut |
| Minimap sync | Immediate | instant | - |
| Node select | Glow ring | 150ms | easeOut |

### Knowledge Graph / Topology (Cytoscape/Sigma)
| Action | Animation | Duration | Easing |
|--------|-----------|----------|--------|
| Initial layout | Force-directed settle | 2000ms | easeOut |
| Node expand | Neighbors fade + position | 500ms | easeOut |
| Node collapse | Neighbors fade + remove | 300ms | easeIn |
| Pan/zoom | Transform | 150ms | linear |
| Search highlight | Pulse + center view | 800ms | easeOut |
| Filter change | Nodes fade in/out | 300ms | easeInOut |

---

## Special Motion Patterns

### AI Scanning Bar
```css
@keyframes ai-scan {
  0% { transform: translateX(-100%); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
}
.ai-scanning-bar::after {
  animation: ai-scan 2s linear infinite;
}
```
- **Purpose**: Indicate AI processing, model inference, background computation
- **Duration**: 2000ms linear infinite
- **Color**: Cyan gradient with transparency

### Pulse (Live Indicator)
```css
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.1); }
}
.live-indicator {
  animation: pulse 1.5s ease-in-out infinite;
}
```
- **Purpose**: Real-time data, live connections, streaming
- **Duration**: 1500ms ease-in-out infinite
- **Color**: Emerald (success) or Cyan (processing)

### Skeleton Wave
```css
@keyframes skeleton-wave {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #0B1120 25%, #1E293B 50%, #0B1120 75%);
  background-size: 200% 100%;
  animation: skeleton-wave 1.5s ease-in-out infinite;
}
```
- **Purpose**: Content loading placeholders
- **Duration**: 1500ms ease-in-out infinite

### Focus Ring
```css
.focus-ring:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-primary), 
              0 0 0 4px rgba(45, 212, 191, 0.2);
  transition: box-shadow var(--motion-snap) var(--easing-ease-out);
}
```
- **Purpose**: Keyboard focus indication
- **Duration**: 150ms ease-out
- **Color**: Cyan primary + glow

### Staggered Entrance
```css
.stagger-children > * {
  opacity: 0;
  transform: translateY(20px);
  animation: stagger-in 0.4s ease-out forwards;
}
.stagger-children > *:nth-child(1) { animation-delay: 0ms; }
.stagger-children > *:nth-child(2) { animation-delay: 50ms; }
.stagger-children > *:nth-child(3) { animation-delay: 100ms; }
.stagger-children > *:nth-child(4) { animation-delay: 150ms; }
.stagger-children > *:nth-child(n+5) { animation-delay: 200ms; }

@keyframes stagger-in {
  to { opacity: 1; transform: translateY(0); }
}
```
- **Purpose**: Lists, grids, dashboards loading
- **Delay**: 50ms per item, max 200ms
- **Duration**: 400ms ease-out

---

## Reduced Motion Support

### CSS Media Query
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  .ai-scanning-bar::after,
  .live-indicator,
  .skeleton {
    animation: none !important;
  }
  
  .skeleton {
    background: var(--color-surface-container);
  }
}
```

### JavaScript Hook
```typescript
// hooks/useReducedMotion.ts
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return reduced;
}

// Usage in components
const reducedMotion = useReducedMotion();
const duration = reducedMotion ? 0 : motionTokens.duration.normal;
const easing = reducedMotion ? 'linear' : motionTokens.easing.easeOut;
```

### Component-Level Respect
```typescript
// All motion components must accept reducedMotion prop
interface MotionProps {
  reducedMotion?: boolean;
  // ... other props
}

// Framer Motion example
<motion.div
  animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
  initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
  transition={{ duration: reducedMotion ? 0 : 0.3 }}
/>
```

---

## Performance Guidelines

### GPU Acceleration
- Use `transform` and `opacity` only for animations
- Avoid `width`, `height`, `top`, `left`, `margin`, `padding`
- Use `will-change: transform, opacity` sparingly

### Layout Thrashing Prevention
- Batch DOM reads/writes
- Use `requestAnimationFrame` for measurements
- Prefer CSS animations over JS for simple transitions

### Framer Motion Optimization
```typescript
// Use layout prop for automatic FLIP animations
<motion.div layout />

// Use layoutId for shared element transitions
<motion.div layoutId="card" />

// Avoid layout on frequently updating components
<motion.div animate={{ opacity: value }} /> // No layout
```

### Bundle Size
- Framer Motion: ~50KB gzipped
- Consider `@motionone/dom` (~15KB) for simple animations
- Tree-shake unused features

---

## Implementation Checklist

### Global Setup
- [ ] CSS custom properties for all motion tokens
- [ ] `prefers-reduced-motion` media query in global CSS
- [ ] `useReducedMotion` hook available
- [ ] Framer Motion provider at app root

### Component Level
- [ ] Every interactive component has hover/press/focus states
- [ ] All modals/drawers/tooltips use semantic motion tokens
- [ ] Page transitions implemented
- [ ] Loading states (skeleton, spinner, progress) animated
- [ ] Error states have shake/pulse animation
- [ ] Success states have checkmark animation

### Testing
- [ ] Visual regression for all animated states
- [ ] `prefers-reduced-motion` testing (Chrome DevTools)
- [ ] Performance profiling (60fps target)
- [ ] Mobile device testing (lower GPU)
- [ ] Accessibility audit (no motion sickness triggers)

### Documentation
- [ ] Motion tokens documented in Storybook
- [ ] Component motion specs in Storybook
- [ ] Reduced motion examples
- [ ] Performance budgets documented