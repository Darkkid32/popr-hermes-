# Hermes AI OS - Design Tokens Specification

**Source**: Google Stitch Project `projects/10866743485103090405`  
**Design System**: Hermes AI OS (assets/2345a4dfe28c4014b186fe47beb50965)  
**Version**: 1.0  
**Status**: Approved - Single Source of Truth

---

## Color Tokens

### Core Palette (Dark Theme - Primary)

```json
{
  "color": {
    "background": {
      "base": "#020617",
      "workspace": "#0d1322",
      "elevated": "#0B1120",
      "overlay": "rgba(2, 6, 23, 0.9)"
    },
    "surface": {
      "level0": "#020617",
      "level1": "#0B1120",
      "level2": "#0B1120",
      "container": "#191f2f",
      "containerLow": "#151b2b",
      "containerHigh": "#242a3a",
      "containerHighest": "#2f3445",
      "bright": "#33394a",
      "dim": "#0d1322"
    },
    "border": {
      "primary": "#1E293B",
      "secondary": "#3c4a46",
      "focus": "#2DD4BF",
      "error": "#FFB4AB"
    }
  }
}
```

### Semantic Colors

```json
{
  "color": {
    "primary": {
      "base": "#2DD4BF",
      "container": "#2DD4BF",
      "onPrimary": "#003731",
      "onContainer": "#00574D",
      "fixed": "#62FAE3",
      "fixedDim": "#3CDDC7",
      "onFixed": "#00201C",
      "onFixedVariant": "#005047",
      "glow": "rgba(45, 212, 191, 0.15)",
      "glowStrong": "rgba(45, 212, 191, 0.3)"
    },
    "secondary": {
      "base": "#D946EF",
      "container": "#AE05C6",
      "onSecondary": "#580065",
      "onContainer": "#FFD8FD",
      "fixed": "#FFD6FD",
      "fixedDim": "#FBABFF",
      "onFixed": "#36003E",
      "onFixedVariant": "#7C008E"
    },
    "tertiary": {
      "base": "#10B981",
      "container": "#44D69B",
      "onTertiary": "#003824",
      "onContainer": "#00593B",
      "fixed": "#6FFBBE",
      "fixedDim": "#4EDEA3",
      "onFixed": "#002113",
      "onFixedVariant": "#005236"
    },
    "error": {
      "base": "#FFB4AB",
      "container": "#93000A",
      "onError": "#690005",
      "onContainer": "#FFDAD6"
    },
    "success": {
      "base": "#10B981",
      "container": "#064E3B",
      "onSuccess": "#D1FAE5",
      "onContainer": "#064E3B"
    },
    "warning": {
      "base": "#F59E0B",
      "container": "#78350F",
      "onWarning": "#FEF3C7",
      "onContainer": "#78350F"
    },
    "info": {
      "base": "#0EA5E9",
      "container": "#0C4A6E",
      "onInfo": "#E0F2FE",
      "onContainer": "#0C4A6E"
    }
  }
}
```

### Text Colors

```json
{
  "color": {
    "text": {
      "primary": "#DDE2F8",
      "secondary": "#BACAC5",
      "tertiary": "#859490",
      "disabled": "#585858",
      "inverse": "#2A3040",
      "link": "#57F1DB",
      "linkHover": "#62FAE3"
    },
    "code": {
      "primary": "#66F3B6",
      "secondary": "#FBABFF",
      "keyword": "#D946EF",
      "string": "#2DD4BF",
      "number": "#F59E0B",
      "comment": "#585858"
    }
  }
}
```

### Chart/Data Visualization Colors

```json
{
  "color": {
    "chart": {
      "series": [
        "#2DD4BF",
        "#D946EF",
        "#10B981",
        "#F59E0B",
        "#0EA5E9",
        "#8B5CF6",
        "#EC4899",
        "#14B8A6"
      ],
      "sequential": {
        "cyan": ["#080E1A", "#0B1120", "#0D1322", "#151B2B", "#191F2F", "#242A3A", "#2F3445", "#33394A", "#859490", "#DDE2F8"],
        "magenta": ["#0E0614", "#1A0D26", "#2C1A3A", "#3D254D", "#4E305E", "#5F3B6F", "#704680", "#815192", "#D946EF", "#F5D0FD"],
        "emerald": ["#020C09", "#051A11", "#062816", "#09361B", "#0C4420", "#0F5225", "#10B981", "#34D399", "#6EE7B7", "#D1FAE5"]
      ]
    }
  }
}
```

---

## Typography Tokens

### Font Families

```json
{
  "fontFamily": {
    "heading": "Space Grotesk, system-ui, sans-serif",
    "body": "Inter, system-ui, sans-serif",
    "mono": "JetBrains Mono, Consolas, monospace",
    "ui": "Inter, system-ui, sans-serif"
  }
}
```

### Type Scale

```json
{
  "fontSize": {
    "display-lg": { "size": "48px", "lineHeight": "56px", "letterSpacing": "-0.02em", "weight": 700 },
    "display-md": { "size": "36px", "lineHeight": "44px", "letterSpacing": "-0.015em", "weight": 700 },
    "display-sm": { "size": "28px", "lineHeight": "36px", "letterSpacing": "-0.01em", "weight": 600 },
    "headline-lg": { "size": "32px", "lineHeight": "40px", "letterSpacing": "-0.01em", "weight": 600 },
    "headline-md": { "size": "24px", "lineHeight": "32px", "letterSpacing": "-0.005em", "weight": 600 },
    "headline-sm": { "size": "20px", "lineHeight": "28px", "letterSpacing": "0", "weight": 600 },
    "title-lg": { "size": "18px", "lineHeight": "24px", "letterSpacing": "0", "weight": 600 },
    "title-md": { "size": "16px", "lineHeight": "24px", "letterSpacing": "0", "weight": 600 },
    "title-sm": { "size": "14px", "lineHeight": "20px", "letterSpacing": "0", "weight": 600 },
    "body-lg": { "size": "18px", "lineHeight": "28px", "letterSpacing": "0", "weight": 400 },
    "body-md": { "size": "16px", "lineHeight": "24px", "letterSpacing": "0", "weight": 400 },
    "body-sm": { "size": "14px", "lineHeight": "20px", "letterSpacing": "0", "weight": 400 },
    "body-xs": { "size": "12px", "lineHeight": "16px", "letterSpacing": "0", "weight": 400 },
    "label-lg": { "size": "14px", "lineHeight": "20px", "letterSpacing": "0", "weight": 500 },
    "label-md": { "size": "12px", "lineHeight": "16px", "letterSpacing": "0.02em", "weight": 500 },
    "label-sm": { "size": "11px", "lineHeight": "16px", "letterSpacing": "0.03em", "weight": 500 },
    "label-caps": { "size": "12px", "lineHeight": "16px", "letterSpacing": "0.05em", "weight": 600, "textTransform": "uppercase" },
    "code-md": { "size": "14px", "lineHeight": "20px", "letterSpacing": "0", "weight": 400 },
    "code-sm": { "size": "12px", "lineHeight": "18px", "letterSpacing": "0", "weight": 400 }
  }
}
```

### Font Weights

```json
{
  "fontWeight": {
    "light": 300,
    "normal": 400,
    "medium": 500,
    "semibold": 600,
    "bold": 700,
    "extrabold": 800
  }
}
```

---

## Spacing Tokens

### Base Unit: 4px

```json
{
  "spacing": {
    "unit": 4,
    "scale": {
      "0": 0,
      "1": 4,
      "2": 8,
      "3": 12,
      "4": 16,
      "5": 20,
      "6": 24,
      "7": 28,
      "8": 32,
      "10": 40,
      "12": 48,
      "14": 56,
      "16": 64,
      "20": 80,
      "24": 96,
      "32": 128
    },
    "semantic": {
      "xs": 4,
      "sm": 8,
      "md": 16,
      "lg": 24,
      "xl": 32,
      "2xl": 48,
      "3xl": 64,
      "gutter": 24,
      "margin": 32,
      "container": 32,
      "section": 48
    },
    "layout": {
      "sidebar": 280,
      "sidebarCollapsed": 72,
      "topbar": 44,
      "rightPanel": 320,
      "modal": 560,
      "drawer": 400,
      "tooltip": 280,
      "dropdown": 320
    }
  }
}
```

---

## Border Radius Tokens

```json
{
  "borderRadius": {
    "none": 0,
    "xs": 2,
    "sm": 4,
    "md": 6,
    "lg": 8,
    "xl": 12,
    "2xl": 16,
    "full": 9999,
    "semantic": {
      "input": 4,
      "button": 6,
      "card": 8,
      "modal": 12,
      "tooltip": 6,
      "dropdown": 8,
      "avatar": "full",
      "chip": 4,
      "progress": 2
    }
  }
}
```

---

## Shadow & Elevation Tokens

```json
{
  "shadow": {
    "level0": "none",
    "level1": "0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 1px rgba(0, 0, 0, 0.2)",
    "level2": "0 4px 8px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)",
    "level3": "0 10px 20px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.2)",
    "level4": "0 20px 40px rgba(0, 0, 0, 0.5), 0 8px 16px rgba(0, 0, 0, 0.3)",
    "cyan": {
      "glow": "0 0 20px rgba(45, 212, 191, 0.15)",
      "glowStrong": "0 0 40px rgba(45, 212, 191, 0.3)",
      "focus": "0 0 0 2px #2DD4BF, 0 0 0 4px rgba(45, 212, 191, 0.2)",
      "focusInset": "inset 0 0 0 2px #2DD4BF"
    },
    "magenta": {
      "glow": "0 0 20px rgba(217, 70, 239, 0.15)",
      "focus": "0 0 0 2px #D946EF, 0 0 0 4px rgba(217, 70, 239, 0.2)"
    },
    "inset": {
      "sm": "inset 0 1px 2px rgba(0, 0, 0, 0.2)",
      "md": "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
      "border": "inset 0 0 0 1px rgba(255, 255, 255, 0.05)"
    }
  }
}
```

---

## Motion Tokens

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
    },
    "easing": {
      "linear": "linear",
      "easeIn": "cubic-bezier(0.4, 0, 1, 1)",
      "easeOut": "cubic-bezier(0, 0, 0.2, 1)",
      "easeInOut": "cubic-bezier(0.4, 0, 0.2, 1)",
      "snap": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      "spring": "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
    },
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
      "skeleton": { "duration": 1500, "easing": "easeInOut", "iterations": "infinite" }
    }
  }
}
```

---

## Breakpoint Tokens

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
    "desktop2xl": 2560,
    "semantic": {
      "mobileOnly": "(max-width: 767px)",
      "tabletOnly": "(min-width: 768px) and (max-width: 1023px)",
      "desktopOnly": "(min-width: 1024px)",
      "mobileAndTablet": "(max-width: 1023px)",
      "tabletAndDesktop": "(min-width: 768px)"
    }
  }
}
```

---

## Z-Index Tokens

```json
{
  "zIndex": {
    "base": 0,
    "dropdown": 100,
    "sticky": 200,
    "fixed": 300,
    "modalBackdrop": 400,
    "modal": 500,
    "popover": 600,
    "tooltip": 700,
    "toast": 800,
    "commandPalette": 900,
    "loadingOverlay": 1000
  }
}
```

---

## Component-Specific Tokens

### Button

```json
{
  "button": {
    "height": {
      "sm": 32,
      "md": 40,
      "lg": 48,
      "xl": 56
    },
    "padding": {
      "sm": "8 16",
      "md": "10 20",
      "lg": "12 24",
      "xl": "14 28"
    },
    "iconGap": 8,
    "iconSize": 16
  }
}
```

### Input

```json
{
  "input": {
    "height": {
      "sm": 36,
      "md": 44,
      "lg": 52
    },
    "padding": "0 16",
    "iconGap": 12,
    "iconSize": 18
  }
}
```

### Table

```json
{
  "table": {
    "rowHeight": {
      "compact": 40,
      "normal": 48,
      "comfortable": 56
    },
    "cellPadding": "0 16",
    "headerHeight": 44,
    "borderWidth": 1
  }
}
```

### Modal/Drawer

```json
{
  "modal": {
    "maxWidth": {
      "sm": 400,
      "md": 560,
      "lg": 720,
      "xl": 960,
      "full": "100%"
    },
    "padding": 24,
    "headerHeight": 56,
    "footerHeight": 64
  },
  "drawer": {
    "width": {
      "sm": 320,
      "md": 400,
      "lg": 520,
      "full": "100%"
    },
    "padding": 24
  }
}
```

---

## Icon Tokens

```json
{
  "icon": {
    "size": {
      "xs": 12,
      "sm": 16,
      "md": 20,
      "lg": 24,
      "xl": 28,
      "2xl": 32
    },
    "semantic": {
      "button": 16,
      "input": 18,
      "header": 20,
      "sidebar": 20,
      "card": 24,
      "emptyState": 64,
      "loading": 24
    },
    "strokeWidth": {
      "thin": 1.5,
      "normal": 2,
      "thick": 2.5
    }
  }
}
```

---

## CSS Variable Output

```css
:root {
  /* Colors */
  --color-bg-base: #020617;
  --color-bg-workspace: #0d1322;
  --color-bg-elevated: #0B1120;
  --color-surface-level0: #020617;
  --color-surface-level1: #0B1120;
  --color-surface-level2: #0B1120;
  --color-surface-container: #191f2f;
  --color-surface-container-low: #151b2b;
  --color-surface-container-high: #242a3a;
  --color-surface-container-highest: #2f3445;
  --color-border-primary: #1E293B;
  --color-border-focus: #2DD4BF;
  
  --color-primary: #2DD4BF;
  --color-primary-container: #2DD4BF;
  --color-on-primary: #003731;
  --color-secondary: #D946EF;
  --color-tertiary: #10B981;
  --color-error: #FFB4AB;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  
  --color-text-primary: #DDE2F8;
  --color-text-secondary: #BACAC5;
  --color-text-tertiary: #859490;
  
  /* Typography */
  --font-heading: 'Space Grotesk', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', Consolas, monospace;
  
  --text-display-lg: 48px;
  --text-headline-lg: 32px;
  --text-headline-md: 24px;
  --text-title-lg: 18px;
  --text-body-lg: 18px;
  --text-body-md: 16px;
  --text-body-sm: 14px;
  --text-label-md: 12px;
  --text-code-md: 14px;
  
  /* Spacing */
  --space-unit: 4px;
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-gutter: 24px;
  --space-margin: 32px;
  
  /* Border Radius */
  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;
  --radius-input: 4px;
  --radius-button: 6px;
  --radius-card: 8px;
  
  /* Shadows */
  --shadow-level1: 0 1px 2px rgba(0,0,0,0.3), 0 1px 1px rgba(0,0,0,0.2);
  --shadow-level2: 0 4px 8px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2);
  --shadow-cyan-glow: 0 0 20px rgba(45,212,191,0.15);
  --shadow-cyan-focus: 0 0 0 2px #2DD4BF, 0 0 0 4px rgba(45,212,191,0.2);
  
  /* Motion */
  --motion-snap: 150ms;
  --motion-fast: 200ms;
  --motion-normal: 300ms;
  --motion-slow: 400ms;
  --easing-snap: cubic-bezier(0.34, 1.56, 0.64, 1);
  --easing-ease-out: cubic-bezier(0, 0, 0.2, 1);
  
  /* Breakpoints */
  --bp-mobile: 375px;
  --bp-tablet: 768px;
  --bp-desktop: 1280px;
  
  /* Z-Index */
  --z-dropdown: 100;
  --z-modal: 500;
  --z-tooltip: 700;
  --z-toast: 800;
}
```

---

## TypeScript Types

```typescript
// design-tokens.ts
export interface ColorTokens {
  background: {
    base: string;
    workspace: string;
    elevated: string;
    overlay: string;
  };
  surface: {
    level0: string;
    level1: string;
    level2: string;
    container: string;
    containerLow: string;
    containerHigh: string;
    containerHighest: string;
    bright: string;
    dim: string;
  };
  border: {
    primary: string;
    secondary: string;
    focus: string;
    error: string;
  };
  primary: ColorScale;
  secondary: ColorScale;
  tertiary: ColorScale;
  error: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  text: TextColors;
}

export interface ColorScale {
  base: string;
  container: string;
  onPrimary: string;
  onContainer: string;
  fixed: string;
  fixedDim: string;
  onFixed: string;
  onFixedVariant: string;
}

export interface TextColors {
  primary: string;
  secondary: string;
  tertiary: string;
  disabled: string;
  inverse: string;
  link: string;
  linkHover: string;
}

export interface SpacingTokens {
  unit: number;
  scale: Record<string, number>;
  semantic: SpacingSemantic;
  layout: LayoutSpacing;
}

export interface SpacingSemantic {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  gutter: number;
  margin: number;
  container: number;
  section: number;
}

export interface LayoutSpacing {
  sidebar: number;
  sidebarCollapsed: number;
  topbar: number;
  rightPanel: number;
  modal: number;
  drawer: number;
  tooltip: number;
  dropdown: number;
}

export interface TypographyTokens {
  fontFamily: FontFamilies;
  fontSize: Record<string, FontSizeToken>;
  fontWeight: FontWeights;
}

export interface FontFamilies {
  heading: string;
  body: string;
  mono: string;
  ui: string;
}

export interface FontSizeToken {
  size: string;
  lineHeight: string;
  letterSpacing: string;
  weight: number;
  textTransform?: string;
}

export interface FontWeights {
  light: number;
  normal: number;
  medium: number;
  semibold: number;
  bold: number;
  extrabold: number;
}

export interface BorderRadiusTokens {
  none: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  full: number;
  semantic: RadiusSemantic;
}

export interface RadiusSemantic {
  input: number;
  button: number;
  card: number;
  modal: number;
  tooltip: number;
  dropdown: number;
  avatar: string;
  chip: number;
  progress: number;
}

export interface ShadowTokens {
  level0: string;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
  cyan: CyanShadows;
  magenta: MagentaShadows;
  inset: InsetShadows;
}

export interface CyanShadows {
  glow: string;
  glowStrong: string;
  focus: string;
  focusInset: string;
}

export interface MotionTokens {
  duration: MotionDurations;
  easing: MotionEasings;
  semantic: MotionSemantic;
}

export interface MotionDurations {
  instant: number;
  snap: number;
  fast: number;
  normal: number;
  slow: number;
  slowest: number;
}

export interface MotionEasings {
  linear: string;
  easeIn: string;
  easeOut: string;
  easeInOut: string;
  snap: string;
  spring: string;
}

export interface MotionSemantic {
  hover: MotionToken;
  press: MotionToken;
  focus: MotionToken;
  panelSlide: MotionToken;
  modalEnter: MotionToken;
  modalExit: MotionToken;
  tooltip: MotionToken;
  dropdown: MotionToken;
  drawer: MotionToken;
  aiScanning: MotionToken;
  pulse: MotionToken;
  skeleton: MotionToken;
}

export interface MotionToken {
  duration: number;
  easing: string;
  iterations?: number | string;
}

export interface BreakpointTokens {
  mobile: number;
  mobileLg: number;
  tablet: number;
  tabletLg: number;
  desktop: number;
  desktopLg: number;
  desktopXl: number;
  desktop2xl: number;
  semantic: Record<string, string>;
}

export interface ZIndexTokens {
  base: number;
  dropdown: number;
  sticky: number;
  fixed: number;
  modalBackdrop: number;
  modal: number;
  popover: number;
  tooltip: number;
  toast: number;
  commandPalette: number;
  loadingOverlay: number;
}

export interface ComponentTokens {
  button: ButtonTokens;
  input: InputTokens;
  table: TableTokens;
  modal: ModalTokens;
  icon: IconTokens;
}

export interface ButtonTokens {
  height: Record<string, number>;
  padding: Record<string, string>;
  iconGap: number;
  iconSize: number;
}

export interface InputTokens {
  height: Record<string, number>;
  padding: string;
  iconGap: number;
  iconSize: number;
}

export interface TableTokens {
  rowHeight: Record<string, number>;
  cellPadding: string;
  headerHeight: number;
  borderWidth: number;
}

export interface ModalTokens {
  maxWidth: Record<string, number | string>;
  padding: number;
  headerHeight: number;
  footerHeight: number;
}

export interface IconTokens {
  size: Record<string, number>;
  semantic: Record<string, number>;
  strokeWidth: Record<string, number>;
}
```

---

## Usage Guidelines

### Do's
- ✅ Use semantic tokens (`--color-primary`) not raw values
- ✅ Use spacing scale (`--space-md`) not arbitrary pixels
- ✅ Use motion tokens (`--motion-normal`) for all animations
- ✅ Reference component tokens for sizing
- ✅ Use semantic color names (`primary`, `error`, `success`)

### Don'ts
- ❌ Hardcode hex values in components
- ❌ Use arbitrary pixel values for spacing
- ❌ Create custom animation durations
- ❌ Override border radius per component
- ❌ Use raw z-index values

### Dark Mode Only
This design system is **dark-mode only**. Light mode is not supported in v1.

### Accessibility
- All color pairs meet WCAG AA (4.5:1 for text, 3:1 for UI)
- Focus indicators use cyan glow (not outline)
- Motion respects `prefers-reduced-motion`
- Touch targets minimum 44×44px