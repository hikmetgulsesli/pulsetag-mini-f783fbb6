---
name: PulseTag Mini
colors:
  surface: '#fcf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#fcf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
  data-mono:
    fontFamily: monospace
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  gutter: 12px
  margin: 16px
---

## Brand & Style

The design system is engineered for high-utility environments where information density and clarity are paramount. It adopts a **Utility-First Minimalism** style, stripping away decorative flourishes to prioritize data legibility and user efficiency. The personality is calm, deterministic, and professional—built for operators who require a reliable interface for monitoring and management.

The aesthetic draws from modern "Pro Tool" interfaces: a neutral foundation allows vibrant status indicators to command attention only when necessary. It utilizes a rigorous 4px grid to maintain alignment and structure across complex data views.

## Colors

The palette is anchored by a sophisticated Slate series for the UI shell and typography. 
- **Foundation:** The background uses a very light neutral gray to reduce eye strain, with borders providing structural definition.
- **Primary:** A deep Navy/Slate (#0F172A) is used for primary actions and key navigation elements to provide a grounded sense of authority.
- **Semantic Status:** Highly saturated Emerald, Amber, and Rose are reserved strictly for system states (Active, Warning, Fail). These must stand out against the neutral backdrop to ensure immediate recognition of system health.
- **Data Visualization:** Use sub-tints of the status colors for backgrounds in badges or table cells to provide context without overwhelming the content.

## Typography

This design system utilizes **Inter** for its exceptional legibility and neutral tone. To support high-density layouts, the type scale is compact. 

- **Numerical Data:** For technical values or IDs within tables, use a monospaced stack or ensure `font-variant-numeric: tabular-nums` is active to maintain vertical alignment in lists.
- **Hierarchy:** Use font weight (SemiBold/600) rather than large size increases to differentiate headers. This preserves vertical space.
- **Labels:** Small, uppercase labels are used for metadata to distinguish it from actionable or primary body text.

## Layout & Spacing

The system follows a strict **4px/8px grid** to facilitate a dense, "pro-tool" feel. 
- **Grid Model:** A 12-column fluid grid is used for main dashboards, while side panels and inspectors utilize fixed-width containers (typically 280px or 320px).
- **Density:** Components use compact padding (e.g., 4px vertical, 8px horizontal for small buttons) to maximize visible data on screen.
- **Mobile Adaptation:** On mobile devices, margins increase to 16px to accommodate touch targets, but internal component density remains high to ensure as much information as possible is visible without scrolling.

## Elevation & Depth

This design system avoids heavy drop shadows in favor of **Tonal Layers and Low-Contrast Outlines**. 
- **Surfaces:** Use background color shifts to indicate nesting. A page background of #F8FAFC might host containers with a pure white (#FFFFFF) background.
- **Borders:** Every container, card, and input uses a subtle 1px border (#E2E8F0). This provides structure without the visual "weight" of shadows.
- **Active States:** Only floating elements like dropdown menus or tooltips should use a subtle, diffused shadow (0px 4px 12px rgba(0,0,0,0.05)) to signify they are on the highest Z-index.

## Shapes

The shape language is **Soft** (4px / 0.25rem radius). This provides a subtle modern touch that softens the "technical" edge of the design without sacrificing the professional, organized feel of a grid-based utility tool. 
- **Small Elements:** Checkboxes, status dots, and small buttons use the base 4px radius.
- **Large Elements:** Main containers or cards may use the `rounded-lg` (8px) setting to create clear containment for grouped data.

## Components

### Buttons
- **Primary:** Solid Slate (#0F172A) with white text. High contrast for the "Final" action.
- **Secondary:** White background with #E2E8F0 border and Slate text.
- **Ghost:** No background or border. Text only. Used for low-priority actions in toolbars.

### Status Badges
- Small, rectangular with a subtle 4px radius. 
- Use a 10% opacity version of the status color for the background and the 100% color for the text and a leading 6px dot.

### Data Tables
- **High Density:** 32px row height. 1px horizontal borders only.
- **Typography:** Use `body-sm` for row content and `label-sm` (uppercase) for headers.
- **Alignment:** Numbers are always right-aligned; text is left-aligned.

### Form Fields
- 32px height for standard inputs.
- **Validation:** 1px solid Rose border for errors, accompanied by a `label-md` error message below the field.
- **Focus:** 1px Slate border with a 2px soft blue outer glow.

### Chips & Tags
- Used for filtering or categories. These should be smaller than buttons, using `label-md` typography and a light gray background (#F1F5F9).