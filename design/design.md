---
version: alpha
name: Aave Apple Color Variant
description: A structured design system extracted from the cloned Aave homepage, retargeted to an Apple-style color palette with blue, white, near-black, system grays, and semantic accent colors.
source:
  url: "https://aave.com/"
  localClone: "./index.html"
  extractedMetrics: "./references/aave-page-metrics.json"
  assetInventory: "./references/aave-assets-inventory.json"
  generatedAt: "2026-06-18"
fonts:
  sans:
    name: Aave Repro
    cssFamily: "\"Aave Repro\", system-ui, -apple-system, \"system-ui\", sans-serif"
    woff2: "./assets/source/c13a814d15056c2c.woff2"
    woff: "./assets/source/f6f7ae4a32605f06.woff"
    usage: Primary UI, headings, body copy, buttons, navigation, and cards.
  mono:
    name: Aave Repro Mono
    cssFamily: "\"Aave Repro Mono\", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    woff2: "./assets/source/521c5118feb61dfb.woff2"
    woff: "./assets/source/cc917aa4d1cc37a7.woff"
    usage: Numeric data, addresses, code, and tabular figures when needed.
colors:
  primary: "#0071e3"
  primary-soft: "#2997ff"
  primary-wash: "#d6ebff"
  primary-tint: "#f5fbff"
  primary-text: "#ffffff"
  bg-1: "#ffffff"
  bg-2: "#ffffff"
  bg-3: "#f5f5f7"
  bg-4: "#f2f2f7"
  border-1: "#e5e5ea"
  border-2: "#d2d2d7"
  fg-1: "#1d1d1f"
  fg-2: "#6e6e73"
  fg-3: "#86868b"
  fg-4: "#d2d2d7"
  white: "#ffffff"
  black: "#000000"
  dark-surface: "#000000"
  dark-card: "rgba(255, 255, 255, 0.06)"
  glass-card: "rgba(255, 255, 255, 0.72)"
  glass-card-hover: "rgba(255, 255, 255, 0.92)"
  stat-card: "#f5f5f7"
  newsletter-card: "#f5f5f7"
  orange-1: "#ff9500"
  yellow-1: "#ffcc00"
  yellow-2: "#ffd60a"
  yellow-3: "#fff4b8"
  blue-1: "#0066cc"
  blue-2: "#2997ff"
  blue-3: "#d6ebff"
  blue-4: "#f5fbff"
  gho-1: "#34c759"
  green-1: "#34c759"
  red-1: "#ff3b30"
  pink-1: "#ff2d55"
  purple-1: "#af52de"
  indigo-1: "#5856d6"
  teal-1: "#5ac8fa"
  focus: "#0071e3"
  wallet: "#0a84ff"
  account: "#34c759"
  p3:
    fg-1: "color(display-p3 0.114 0.114 0.122)"
    fg-2: "color(display-p3 0.431 0.431 0.451)"
    fg-3: "color(display-p3 0.525 0.525 0.545)"
    fg-4: "color(display-p3 0.824 0.824 0.843)"
    primary: "color(display-p3 0 0.443 0.890)"
    primary-soft: "color(display-p3 0.161 0.592 1)"
    primary-wash: "color(display-p3 0.839 0.922 1)"
    primary-tint: "color(display-p3 0.961 0.984 1)"
    yellow-1: "color(display-p3 1 0.800 0)"
    yellow-2: "color(display-p3 1 0.839 0.039)"
    yellow-3: "color(display-p3 1 0.957 0.722)"
    blue-1: "color(display-p3 0 0.400 0.800)"
    blue-2: "color(display-p3 0.161 0.592 1)"
    blue-3: "color(display-p3 0.839 0.922 1)"
    blue-4: "color(display-p3 0.961 0.984 1)"
    gho-1: "color(display-p3 0.204 0.780 0.349)"
    green-1: "color(display-p3 0.204 0.780 0.349)"
    red-1: "color(display-p3 1 0.231 0.188)"
    pink-1: "color(display-p3 1 0.176 0.333)"
    purple-1: "color(display-p3 0.686 0.322 0.871)"
    indigo-1: "color(display-p3 0.345 0.337 0.839)"
    teal-1: "color(display-p3 0.353 0.784 0.980)"
    orange-1: "color(display-p3 1 0.584 0)"
colorRoles:
  dashboardRatio:
    neutral: "90%"
    actionSelection: "8%"
    semantic: "2%"
  dashboard:
    canvas: "{colors.bg-1}"
    chrome: "{colors.bg-3}"
    panel: "{colors.bg-1}"
    panelMuted: "{colors.bg-3}"
    control: "{colors.bg-3}"
    controlHover: "{colors.bg-4}"
    selectedBackground: "{colors.primary-tint}"
    selectedBorder: "color-mix(in srgb, {colors.primary} 28%, {colors.border-1})"
    selectedStrongBorder: "color-mix(in srgb, {colors.primary} 38%, {colors.border-1})"
    selectedText: "{colors.primary}"
    primaryActionBackground: "{colors.primary}"
    primaryActionText: "{colors.primary-text}"
    textPrimary: "{colors.fg-1}"
    textSecondary: "{colors.fg-2}"
    textTertiary: "{colors.fg-3}"
    textDisabled: "{colors.fg-4}"
    successText: "{colors.green-1}"
    successBackground: "color-mix(in srgb, {colors.green-1} 12%, transparent)"
    warningText: "{colors.orange-1}"
    warningBackground: "color-mix(in srgb, {colors.orange-1} 12%, transparent)"
    dangerText: "{colors.red-1}"
    dangerBackground: "color-mix(in srgb, {colors.red-1} 10%, transparent)"
    neutralBadge: "{colors.bg-4}"
typography:
  display-72:
    fontFamily: Aave Repro
    fontSize: 72px
    fontWeight: 500
    lineHeight: 79.2px
    letterSpacing: -3.6px
    usage: Desktop hero and major campaign headlines.
  display-48:
    fontFamily: Aave Repro
    fontSize: 48px
    fontWeight: 500
    lineHeight: 52.8px
    letterSpacing: -1.44px
    usage: Mobile and tablet hero headlines.
  heading-40:
    fontFamily: Aave Repro
    fontSize: 40px
    fontWeight: 500
    lineHeight: 48px
    letterSpacing: -1.2px
    usage: Section headings and product block titles.
  heading-40-tall:
    fontFamily: Aave Repro
    fontSize: 40px
    fontWeight: 500
    lineHeight: 54px
    letterSpacing: -0.8px
    usage: FAQ rail heading.
  heading-32:
    fontFamily: Aave Repro
    fontSize: 32px
    fontWeight: 500
    lineHeight: 35.2px
    letterSpacing: -1px
    usage: Large card values and emphasized numbers.
  heading-24:
    fontFamily: Aave Repro
    fontSize: 24px
    fontWeight: 500
    lineHeight: 32.4px
    letterSpacing: -0.72px
    usage: Trust statistic values.
  heading-24-loose:
    fontFamily: Aave Repro
    fontSize: 24px
    fontWeight: 450
    lineHeight: 36px
    letterSpacing: -0.47px
    usage: Newsletter title.
  heading-18:
    fontFamily: Aave Repro
    fontSize: 18px
    fontWeight: 500
    lineHeight: 24.48px
    letterSpacing: -0.18px
    usage: Market card titles.
  question-18:
    fontFamily: Aave Repro
    fontSize: 18px
    fontWeight: 450
    lineHeight: 24.3px
    letterSpacing: -0.33px
    usage: FAQ question rows.
  lead-20:
    fontFamily: Aave Repro
    fontSize: 20px
    fontWeight: 400
    lineHeight: 27.2px
    letterSpacing: -0.2px
    usage: Hero descriptions and large explanatory copy.
  body-16:
    fontFamily: Aave Repro
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: -0.16px
    usage: Default body copy, card descriptions, menu descriptions.
  body-14:
    fontFamily: Aave Repro
    fontSize: 14px
    fontWeight: 400
    lineHeight: 19.6px
    letterSpacing: -0.14px
    usage: Metadata, small labels, and secondary footer text.
  label-14:
    fontFamily: Aave Repro
    fontSize: 14px
    fontWeight: 500
    lineHeight: 14.7px
    letterSpacing: -0.09px
    usage: Header CTA, compact buttons, labels.
  nav-14:
    fontFamily: Aave Repro
    fontSize: 14px
    fontWeight: 450
    lineHeight: 14.7px
    letterSpacing: -0.09px
    usage: Header menu buttons.
  button-17:
    fontFamily: Aave Repro
    fontSize: 17px
    fontWeight: 500
    lineHeight: 17px
    letterSpacing: -0.17px
    usage: Primary and secondary homepage CTAs.
spacing:
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  5: 20px
  6: 24px
  8: 32px
  10: 40px
  12: 48px
  18: 72px
  20: 80px
  25: 100px
  30: 120px
rounded:
  xs: 6px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  "2xl": 24px
  pill: 99rem
breakpoints:
  sm: 640px
  md: 768px
  lg: 1024px
layout:
  content: 986px
  wide: 1082px
  newsletter: 493px
  desktopSideMarginAt1440: 176px
  productSectionPaddingDesktop: "0 24px 24px"
  productSectionPaddingMobile: "0 8px 8px"
  faqPaddingDesktop: "120px 48px"
  faqPaddingMobile: "48px 20px"
  newsletterPaddingDesktop: "100px 48px"
  newsletterPaddingMobile: "48px 20px"
  footerPaddingDesktop: "72px 48px"
  footerPaddingMobile: "72px 20px 48px"
motion:
  snappy:
    duration: 750ms
    easing: "cubic-bezier(0.175, 0.885, 0.32, 1.1)"
    usage: Expressive entrances, image/card parallax, and small lift interactions.
  swift:
    duration: 1800ms
    easing: "cubic-bezier(0.19, 1, 0.22, 1)"
    usage: Large page reveals and long transform transitions.
components:
  nav-button:
    typography: "{typography.nav-14}"
    textColor: "{colors.fg-2}"
    hoverTextColor: "{colors.fg-1}"
    backgroundColor: transparent
    hoverBackgroundColor: "{colors.bg-4}"
    rounded: 50px
    padding: "9px 16px"
    height: 32px
  header-cta:
    typography: "{typography.label-14}"
    backgroundColor: "{colors.fg-1}"
    textColor: "#ffffff"
    rounded: 50px
    padding: "9px 16px"
    height: 32px
  button-primary:
    typography: "{typography.button-17}"
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "14px 24px"
    minHeight: 45px
    gap: 8px
  button-secondary:
    typography: "{typography.button-17}"
    backgroundColor: "color-mix(in srgb, {colors.primary} 11%, transparent)"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: "14px 24px"
    minHeight: 45px
    gap: 8px
  card-stat:
    backgroundColor: "{colors.stat-card}"
    rounded: "{rounded.2xl}"
    padding: "32px 24px"
    typographyValue: "{typography.heading-24}"
    typographyBody: "{typography.body-16}"
  card-market:
    backgroundColor: "{colors.dark-card}"
    rounded: "{rounded.2xl}"
    padding: "32px 24px"
    labelColor: "{colors.primary}"
    titleTypography: "{typography.heading-18}"
    bodyColor: "rgba(255, 255, 255, 0.7)"
  card-partner:
    backgroundColor: "{colors.glass-card}"
    hoverBackgroundColor: "{colors.glass-card-hover}"
    rounded: "{rounded.xl}"
    padding: 24px
  newsletter:
    backgroundColor: "{colors.newsletter-card}"
    rounded: "{rounded.lg}"
    padding: 32px
    maxWidth: 493px
  newsletter-input:
    backgroundColor: "#ffffff"
    textColor: "{colors.fg-1}"
    typography: "{typography.body-16}"
    rounded: "20px 6px 6px 20px"
    padding: "10px 16px"
    height: 40px
  newsletter-submit:
    backgroundColor: "{colors.fg-1}"
    textColor: "#ffffff"
    typography: "{typography.label-14}"
    rounded: "6px 20px 20px 6px"
    padding: "0 16px"
    height: 40px
---

# Aave Apple Color Variant

## Overview

Aave's homepage design system is calm, high-trust, and product-led. This variant keeps the cloned structure, local fonts, generous whitespace, oversized editorial typography, soft rounded components, and controlled motion, but replaces the lavender-led palette with Apple-style blue, white, near-black, light gray, and semantic system accents.

This document is based on the local clone of `https://aave.com/`, the extracted CSS variables, bundled fonts, rendered page metrics, and screenshot verification artifacts in `./references`. The homepage uses a light theme by default, then switches to dark, immersive product sections when talking about the full power of DeFi and market strategy.

Use this file as the canonical design brief. Use `./design-system/tokens.css` and `./design-system/components.css` as the implementation layer.

## Source Evidence

The design system was derived from these local artifacts:

- `./assets/source/87989486595822bb.css` contains the core CSS custom properties, including colors, breakpoints, and motion easings.
- `./references/aave-page-metrics.json` contains rendered measurements for headings, buttons, sections, images, and FAQ rows.
- `./references/desktop-1440.png`, `./references/tablet-768.png`, and `./references/mobile-390.png` are source screenshots.
- `./references/local-desktop-1440.png`, `./references/local-tablet-768.png`, and `./references/local-mobile-390.png` are clone screenshots.
- `./references/clone-generation-summary.json` records `99` downloaded local assets from `https://aave.com/`.

### Aave Docs Shell DevTools Addendum

On `2026-06-20`, the dashboard shell direction was re-studied from `https://aave.com/docs/aave-v4` in Chrome DevTools at a `1440px x 754px` viewport. Use these findings for Halo dashboard surfaces; keep Halo-owned labels, routes, icons, and assets.

Static layout:

- Header height is `82.5px`, white, centered inside a `986px` content width. Header background transitions over `400ms ease`.
- Desktop body aligns to the same `986px` width. The left documentation rail is `220px`; the main content starts after a roughly `48px` gutter.
- The sidebar begins below the header at about `135px` from the top of the viewport, which comes from the `82.5px` header plus about `52px` top body padding.
- Main document headings use compact product type: `26px` dashboard/page title scale, medium weight, tight negative tracking, with muted `15px` supporting copy.
- The reference content panel is a very pale `#fafafa` rectangular surface rather than a heavy card.

Sidebar typography and states:

- Section titles are `14px`, weight `500`, color close to `#221d1d`, and letter spacing `-0.09px`.
- Sidebar links are `16px`, weight `500`, letter spacing `-0.09px`, with `30px` to `32px` row height.
- Inactive links use `#8f8e8e`; hover moves toward `#636161`; active links use near-black `#201d1d`.
- Icons are compact `16px` marks. Inactive icon color is muted gray; active icons receive the primary selection color. The reference changes icon fill/stroke variables in `80ms ease-out`.
- Active rows do not need a large filled pill. The feel comes from dark text, a colored icon, and tight spacing.

Header and menu interaction:

- Top nav buttons are `32px` tall, pill radius `50px`, `14px` labels, `9px 16px` padding.
- Nav hover uses a very soft near-black fill at about `6%` opacity, with `background-color 150ms ease` and `color 400ms ease`.
- Filled header CTAs and circular search buttons are `34px` tall, near-black fill, white text/icon, and `150ms ease` opacity/press feedback.
- Floating menu rows in the reference are `64px` tall, `8px` radius, and transition over `200ms ease-out`. External arrows transition `opacity 150ms ease` and `transform 200ms ease-out`, moving about `1px` right and `1px` up on hover.
- The header dropdown arrow uses a `300ms` position transition. Menu open/close also triggers short Web Animations around `400ms` and `500ms`; use them sparingly and only for popovers, not persistent dashboard content.

Dashboard motion translation:

- Use `80ms ease-out` for sidebar icon color changes.
- Use `180ms ease-out` for sidebar link hover and active-state color.
- Use `150ms ease` for compact button opacity/background feedback.
- Use `200ms ease-out` for arrow/icon nudge interactions.
- Use `300ms` zero-bounce spring motion for page route transitions.
- Use split/staggered entrance motion for dashboard panels, with about `80ms` to `100ms` between semantic chunks.
- Respect `prefers-reduced-motion`; the reference has motion density, but Halo should keep the app usable when motion is reduced.

Dashboard semantics:

- Borrow the docs shell structure and motion language, but do not label dashboard navigation like documentation. Use workspace/product labels such as `Workspace`, `Review`, `Build`, and `Measure`.
- The user should always understand they are in an app dashboard, not a protocol documentation site. Avoid copy such as `Introduction`, `Reference`, `Copy for LLM`, or docs-only hierarchy.
- Preserve dashboard actions and outcomes: collect testimonials, approve/reject/edit, configure widgets, publish walls, and inspect analytics.
- On creation surfaces such as Widget Studio, preview is the primary object. Render the live preview before configuration controls, keep controls in a secondary inspector panel, and collapse navigation before it competes with the preview.
- At medium widths, hide the persistent side rail behind the dashboard menu instead of converting it into a large horizontal rail above the workspace. This preserves hierarchy and keeps the active editing surface above the fold.
- Collapsed dashboard navigation should open as a compact header-anchored popover, not an in-flow horizontal strip. It must not push page titles, previews, metric cards, or primary controls down the page.

### Responsive Dashboard Adaptation

Researched and applied on `2026-06-21` from Apple Human Interface Guidelines pages for [Layout](https://developer.apple.com/design/human-interface-guidelines/layout), [Navigation and search](https://developer.apple.com/design/human-interface-guidelines/navigation-and-search), [Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars), [Toolbars](https://developer.apple.com/design/human-interface-guidelines/toolbars), and [Materials](https://developer.apple.com/design/human-interface-guidelines/materials), plus Aave references from [Aave Protocol Documentation](https://aave.com/docs), the [Aave Pro User Guide](https://aave.com/blog/aave-pro-user-guide), the open-source [Aave interface](https://github.com/aave/interface), and the local Aave clone metrics in `reference/metrics`.

Dashboard responsiveness should adapt density and hierarchy, not reorder the app into a long stacked document. Apple describes layout as a consistent structure that adapts across contexts, sidebars as leading navigation for app areas, toolbars as compact access to frequent commands, and materials as layered hierarchy between foreground controls and content. The Halo translation is:

- The primary work object stays in flow and above the fold: dashboard summaries, live widget previews, wall previews, and inbox queues must not be pushed down by navigation or configuration controls.
- Medium-width dashboard navigation is a header-anchored popover. It floats above content, closes on navigation, and uses compact `38px` rows.
- Creation surfaces use a fixed hierarchy: preview first, inspector second. On desktop the inspector is a sticky right rail; on tablet it becomes a right-side floating inspector; on phone it becomes a bottom tray. In all three modes the inspector is outside normal content flow once space is constrained.
- Tablet and phone previews scale the canvas instead of crushing columns. Keep a truthful desktop frame width for desktop preview mode and a truthful phone frame width for mobile preview mode, then fit it inside the viewport with measurement-based scaling.
- Page headers remain two-column on mobile when an action exists. The title/description can wrap, but the primary action remains top-right instead of dropping below the heading.
- Use material only as a functional layer: translucent white, backdrop blur, and a quiet border. Do not add shadows; Halo's flat depth model still applies.
- Prefer truncation for preview metadata and compact segmented controls over wrapping controls into extra rows. Wrapping is allowed only when a control would become smaller than its usable hit area.

## Design Principles

1. Lead with clarity. Use short, declarative headings and avoid decorative clutter around the main proposition.
2. Make finance feel calm. The palette is mostly white, Apple-style light gray, muted text, and blue accents; avoid high-saturation gradients and shadows entirely.
3. Use scale for confidence. Major sections use 72px desktop display headings with large open space.
4. Use data as proof. Statistics are presented in compact, equal cards with clear hierarchy and no chart decoration unless necessary.
5. Let dark sections carry depth. Dark surfaces should be reserved for high-impact protocol/product areas, not every panel.
6. Keep components soft. Pills, rounded cards, and low-contrast dividers are part of the brand expression.

## Colors

The core palette has four jobs: text, surface, primary blue accent, and semantic system accents. Apple recommends system colors because they adapt across backgrounds, appearance modes, vibrancy, and accessibility settings; this web implementation uses fixed CSS tokens that approximate that language.

### Dashboard Color Hierarchy

Halo dashboard color is role-based, not decorative. Use the Apple-style `90 / 8 / 2` rule: roughly `90%` neutral surfaces and text, `8%` blue for action/selection/focus, and `2%` semantic color for status or risk.

- Use `bg-1` for page canvas and normal cards, `bg-3` for app chrome, muted panels, controls, and empty states, and `bg-4` for quiet hover fills.
- Use `fg-1` for titles and selected labels, `fg-2` for default navigation and body copy, `fg-3` for metadata and inactive copy, and `fg-4` only for disabled or low-emphasis marks.
- Use `primary` only for primary CTAs, selected icons/text, links, focus rings, and the most important active control. The surrounding UI should stay neutral so blue has meaning.
- Use `primary-tint` for selected backgrounds and callouts, paired with a blue-tinted border when a selected object needs an edge.
- Use `green-1`, `orange-1`, and `red-1` only for success, warning, danger, trend, or validation states. Never use semantic color as decoration without a label or icon.
- Content previews may use more color because they represent published assets, testimonials, videos, or brand output. App chrome, navigation, settings, and list controls stay quiet.
- Hover states are neutral by default: use `bg-4` or a subtle border shift. A hover should not look selected unless it is on an explicitly primary action.
- The GSAP/snappy fill interaction is reserved for opt-in buttons (`.halo-btn` or `[data-snappy-fill]`). Do not apply it to tabs, cards, nav rows, profile controls, swatches, segmented controls, or dashboard panels.

### Text

- `fg-1` `#1d1d1f` is the primary Apple-style near-black text color on light backgrounds. Use it for headings, body emphasis, nav hover states, and dark filled buttons.
- `fg-2` `#6e6e73` is secondary copy and default navigation text.
- `fg-3` `#86868b` is tertiary metadata, helper text, inactive copy, and low-priority footer details.
- `fg-4` `#d2d2d7` is the quietest foreground token. Use sparingly for disabled or low-emphasis decoration.

### Surfaces

- `bg-1` and `bg-2` are white. Use them for the page base and ordinary card interiors.
- `bg-3` `#f5f5f7` is the soft Apple-style page band.
- `bg-4` `#f2f2f7` is the hover and very soft control background.
- `stat-card` `#f5f5f7` is the light gray surface used by proof/stat cards.
- `newsletter-card` `#f5f5f7` is the newsletter module surface.
- `dark-surface` `#000000` should be reserved for high-impact sections, with white text and translucent card fills.

### Brand Accent

- `primary` `#0071e3` is the Apple-style blue for the most important CTA, product labels, links, selected states, and focus.
- `primary-soft` `#2997ff` supports hover states and dark-section links.
- `primary-wash` `#d6ebff` and `primary-tint` `#f5fbff` are supporting blue backgrounds.
- Do not turn the whole UI blue. Blue should signal action, selection, links, and key emphasis. It earns attention because the surrounding palette is quiet.

### Product Accents

- `green-1` / `gho-1` `#34c759` is the success or positive product accent.
- `red-1` `#ff3b30` is destructive or error.
- `orange-1` `#ff9500` and `yellow-*` are warning, pending, or attention accents.
- `purple-1`, `indigo-1`, `pink-1`, and `teal-1` are available for illustrations, badges, or product-specific contexts.
- `wallet` `#0a84ff` and `account` `#34c759` are product state accents.
- Use accent colors with labels or icons, never as the only indicator of state.

### Icon Tones

Section, feature, and creation-mode icons carry color to add liveliness and aid scanning — each icon reads as a distinct, bright accent rather than uniform grey. This is the one place product accents appear *without* an adjacent status meaning, so it is governed by a tight system:

- **Tone is assigned centrally, never at the call site.** A single map (`haloIconTones` in `src/components/dashboard/HaloIcon.jsx`) pairs every icon name with one of nine tones: `blue` (`primary`), `green`, `yellow`, `orange`, `red`, `pink`, `purple`, `indigo`, `teal`. Call sites just render the icon; the color follows the name. Default is `blue`.
- **One CSS source of truth.** A `data-tone="…"` attribute resolves to the accent via `[data-tone="…"] { --tone: … }` in `styles/index.css`; the colorful chip (`.halo-feature-icon`) derives its soft fill (`color-mix(... 12%)`) and hover/active fill (`color-mix(... 22%)`) from that single `--tone`. Never hardcode an icon color in a component or a one-off gradient.
- **Two carriers.** `HaloIconChip` renders the rounded tinted badge used on feature/section cards (Import methods, Proof publish cards, Integrations, Feedback, Analyze). For bare inline icons (e.g. the Studio mode carousel), pass `tinted` to `HaloIcon` to color the glyph itself. On a filled/selected surface (gradient active tab) the glyph reverts to white for contrast.
- **Keep tones varied but stable.** Related icons may share a tone; the map should stay deterministic so an icon is the same color everywhere it appears. Don't reach past the nine system accents.
- **Chrome stays quiet.** Persistent navigation and dense controls — the sidebar, wizard step rails, table rows, inline button glyphs — keep their neutral/`primary` treatment. Color is for content and feature discovery, not for chrome; this is what keeps the colorful icons feeling intentional rather than noisy. Icons remain `aria-hidden` and always sit beside a text label, so color is never the sole carrier of meaning (see Accessibility).

### Wide Gamut

The source CSS includes Display P3 color variants. Use the sRGB hex values as the default tokens and wrap P3 values in `@supports (color: color(display-p3 1 1 1))`. This keeps the system faithful on modern displays without breaking older browsers.

## Typography

Aave uses `Aave Repro` for nearly everything. The font has a clean, slightly rounded, product-editorial feel. The homepage does not rely on many weights: `400`, `450`, and `500` carry the system.

### Scale

- `display-72`: `72px / 79.2px`, weight `500`, letter spacing `-3.6px`. Use for desktop hero and major campaign section titles.
- `display-48`: `48px / 52.8px`, weight `500`, letter spacing `-1.44px`. Use for mobile and tablet hero titles.
- `heading-40`: `40px / 48px`, weight `500`, letter spacing `-1.2px`. Use for section headings.
- `heading-32`: `32px / 35.2px`, weight `500`, letter spacing around `-1px`. Use for large metric values or emphasized card content.
- `heading-24`: `24px / 32.4px`, weight `500`, letter spacing `-0.72px`. Use for statistic values and compact module titles.
- `heading-18`: `18px / 24.48px`, weight `500`, letter spacing `-0.18px`. Use for card titles in dense sections.
- `lead-20`: `20px / 27.2px`, weight `400`, letter spacing `-0.2px`. Use for hero body text and large supporting descriptions.
- `body-16`: `16px / 24px`, weight `400`, letter spacing around `-0.16px`. Use for general body and descriptions.
- `nav-14`: `14px / 14.7px`, weight `450`, letter spacing `-0.09px`. Use for header menu buttons.
- `button-17`: `17px / 17px`, weight `500`, letter spacing `-0.17px`. Use for primary homepage CTA pills.

### Rules

- Tighten letter spacing as type gets larger. Do not use default browser heading spacing for display text.
- Keep headings weight `500`, not `600` or `700`.
- Use `450` for interactive labels that need more presence than body copy but less mass than CTAs.
- Use body copy in muted foreground (`fg-2`) unless the copy needs to read as a title.
- Avoid mixing more than three text sizes inside a single component.
- Use `Aave Repro Mono` only for data, code, addresses, or aligned numeric values.

## Layout

The homepage uses a centered content model with generous vertical pacing.

### Containers

- Primary content width: `986px`.
- Wide shell and footer width: `1082px`.
- Newsletter module max width: `493px`.
- At a 1440px desktop viewport, wide content sits with about `176px` side margins.
- Main product wrappers use `0 24px 24px` padding on desktop.
- Product wrappers tighten to `0 8px 8px` on mobile.

### Section Rhythm

- Hero/product sections are spacious and should feel like separate scenes.
- FAQ uses `120px 48px` desktop padding and `48px 20px` mobile padding.
- Newsletter uses `100px 48px` desktop padding and `48px 20px` mobile padding.
- Footer uses `72px 48px` desktop padding and `72px 20px 48px` mobile padding.
- Use `24px` as the standard card/grid gap. Use `16px` for tighter repeated card sets.
- Use `80px` top padding for trust/stat card grids when they follow a large heading.

### Breakpoints

- `sm`: `640px`
- `md`: `768px`
- `lg`: `1024px`

Desktop and tablet keep the large editorial structure. Below `768px`, collapse two- and three-column grids to one column, reduce horizontal padding to `20px`, and step hero display type down to `48px`.

## Elevation & Depth

Halo is a flat design system. The cloned reference casts no drop shadows, and neither does Halo — depth is tonal, never elevated.

- **Do not use box-shadows anywhere.** No `shadow-*` utilities, no custom shadow token, no inline `box-shadow`. There is intentionally no shadow primitive in the system; one should not be reintroduced.
- Separate surfaces with borders (`border-1`, `border-2`) and background shifts (`bg-1` → `bg-3` → `bg-4`) instead of elevation.
- For raised or selected states (active tabs, toggles, nav items, knobs), use a brighter fill (`bg-1` on a `bg-3` track) or a hairline border — never a shadow.
- Glass partner cards use `rgba(255,255,255,0.72)`, brightening to `rgba(255,255,255,0.92)` on hover; the lift is the background change (plus at most a `translateY(-1px)`), not a shadow.
- Dark market cards use `rgba(255,255,255,0.06)` on a near-black section.
- Avoid drop shadows, neumorphism, glows, and glossy gradients. The one exception is the sanctioned low-opacity accent gradient language (see "Accent Gradients" below) — soft radial washes and a flat left→right accent fill, never a glossy or high-saturation ramp.

The embeddable testimonial widget keeps a per-preset shadow capability for matching external brands, but Halo's shipped presets are all flat (`shadow: "none"`) and Halo's own dashboard UI never uses it.

## Data Visualization

Analytics borrows Apple's data language (Health, Fitness Activity Rings, Stocks): calm, flat, one accent, the number is the hero.

- **Numbers first.** Lead each metric with a large, tight-tracked value in `tabular-nums`; pair it with a small trend delta — `green-1` for up, `red-1` for down — and a triangle glyph. Never color the number itself.
- **Gradient fills are the one sanctioned gradient.** Charts fill the area under a curve with the accent fading to transparent (`primary` at ~22–24% opacity → 0%). This is low-opacity and accent-derived, so it stays within the "no high-saturation gradients" rule (principle 2) — the same restraint as the `radial-gradient(... primary 7–9% ...)` panel washes already in use. No rainbow ramps, no gradient on text or surfaces.
- **Curves, not spikes.** Smooth line series with Catmull-Rom interpolation and round joins; mark only the latest point (or the hovered one) with a filled dot.
- **Rings for goals.** Goal progress uses concentric rounded-cap rings (Fitness style): a track at the hue's ~14% opacity under a hue-to-hue gradient stroke. Use the semantic accents (`primary`, `teal-1`, `green-1`) across rings, not one flat blue.
- **No chart junk.** A single hairline baseline at most — no gridlines, no axis spines, no shadows. Axis labels are sparse and muted (`fg-3`, ~11px). Bars get rounded ends and a gentle left-to-right accent gradient.
- **Scrub, don't clutter.** Detail appears on hover/touch as a single value callout on a dark pill, not as always-on labels on every point.

## Accent Gradients

The chart gradient language (the area fills, the bar ramps, the `radial-gradient(... primary 9% ...)` panel washes) is the *only* sanctioned gradient family, and it extends beyond charts to a small set of UI surfaces. It exists as reusable tokens in `src/styles/tokens.css` so every surface stays in sync — never hand-roll a one-off gradient; reference the token.

- **Two idioms, both low-opacity and accent-derived.**
  - `--halo-gradient-accent` — a flat left→right `primary → primary+55% white` fill. Used for *committed / selected* controls only: the Studio mode-bar active tab and the active filter pill (text flips to white). This is the same ramp chart bars use. It is the higher-contrast end of the hover→selected model (see "Interaction States"); hover stays a quiet tonal shift, selected commits to the fill.
  - `--halo-wash-accent` / `--halo-wash-accent-strong` — a soft radial bloom from the top edge, layered *over* a base surface: `background: var(--halo-wash-accent), var(--halo-role-panel-muted)`. Used to warm large neutral surfaces with a hint of brand: Studio hero, Studio card preview areas, the active card and draft preview (`-strong`).
- **Tone-matched washes for status surfaces.** `--halo-wash-good` (green) and `--halo-wash-attention` (orange) layer over the matching `success-bg` / `warning-bg` so the Overview KPI tiles keep their semantic tone while gaining the same soft bloom — color is never the *only* status signal (the label and value still carry it).
- **Per-category tone washes.** When a set of count/metric tiles represents distinct categories (e.g. the Feedback praise / request / issue / question tiles), each tile gets a soft top-left radial wash bloomed from its `--tone` (the same `[data-tone]` map that drives icon tones), with hover/active intensifying the *same* hue rather than reverting to generic blue. The big number takes the tone color for pop; labels stay neutral. Reserve this for genuinely categorical tiles — don't rainbow a row of homogeneous KPIs.
- **Restraint is the point.** The fill marks "active/selected"; the wash warms a surface. Keep idle/inactive controls, table rows, body text, and dense data tables flat (`role-panel`, hairline borders) — that contrast is what makes the gradient legible as state rather than decoration. No gradient on text, no ramp above these opacities, no glossy or directional-light look.

## Motion

Motion is soft and physical. The source CSS exposes two named motion profiles:

- `snappy`: `750ms cubic-bezier(0.175, 0.885, 0.32, 1.1)`. Use for small lifts, subtle reveals, and tactile UI transitions.
- `swift`: `1800ms cubic-bezier(0.19, 1, 0.22, 1)`. Use for larger page/image reveals where the movement should feel smooth and premium.

For ordinary UI states, use shorter durations around `180ms` to `220ms`. Reserve the longer source timings for scene-level animation or image treatment. Always honor `prefers-reduced-motion` by disabling nonessential transforms and long animations.

## Layout Stability

**Strict rule: zero unintended layout shift.** The interface must never shift when state changes. Showing an error, toggling a selection, entering a loading state, or running an animation must not reflow or displace existing UI. Layout shift reads as broken and erodes trust.

This is a release gate, not a preference:

- Before and after every interactive state change, existing controls and content that are not intentionally expanding must retain identical `x`, `y`, `width`, and `height` values.
- A toggle, checkbox, tab, hover, selection, counter, icon swap, loading transition, or validation message must produce `0` unexpected `layout-shift` entries and a cumulative layout shift contribution of `0`.
- Conditional visuals must render inside a pre-sized box. Mounting or unmounting an icon, checkmark, badge, spinner, or count must never change grid tracks, line wrapping, row height, or sibling position.
- Lists and previews must reserve their committed dimensions. Removing or adding selected content may update what a slot displays, but must not collapse the slot or recenter neighbouring content.
- Verify each changed interaction at its supported desktop and mobile breakpoints by comparing bounding rectangles before and after the state change. A non-zero delta blocks completion unless the movement is the explicitly requested expand/collapse behavior.

- **Animate transform and opacity only.** Never animate layout properties (`width`, `height`, `margin`, `top`, inserting/removing flow content) in a way that moves neighbours. A press dip, a star pop, a sparkle burst all run on `transform`/`opacity` inside their own box.
- **Celebratory motion stays in its own box.** Do not scale or grow a container if doing so moves the controls inside or beside it. The 5-star rating bursts with an absolutely-positioned particle overlay; the row itself never scales, so the stars never move.
- **Reserve space for conditional content, or place it so it can't displace committed UI.** A validation error sits *beside* the submit button (wrapping below on mobile), never above it pushing it down. Expanding panels push only the content *below* them, not the trigger. Skeletons match the final content's dimensions.
- **Hold dimensions across async states.** Loading → loaded must not change a card's size. Images and media reserve their aspect ratio up front to avoid reflow.

## Shapes

Aave uses soft geometry:

- `6px`: input joins and small asymmetric form corners.
- `8px`: dropdown menu rows and compact interactive surfaces.
- `16px`: newsletter cards and medium modules.
- `20px`: partner/glass cards.
- `24px`: statistic cards, dark market cards, and major repeated panels.
- `99rem` or `50px`: pill buttons and nav controls.

Do not mix sharp corners into Aave-style UI. If a component is interactive and compact, make it pill-shaped or softly rounded. If it is a content card, use `20px` or `24px`.

## Components

The component tokens in the frontmatter are intended as build-ready specs.

### Header

The header is quiet and horizontally balanced:

- Nav row minimum height: about `72px`.
- Nav buttons: transparent, `14px`, weight `450`, `9px 16px`, `50px` radius, `32px` height.
- Default nav text uses `fg-2`; hover moves to `fg-1` with a soft `bg-4` fill.
- The main header CTA uses `fg-1` fill, white text, `14px` weight `500`, and the same `9px 16px` pill geometry.
- Dropdown menu rows use `8px` radius, `8px` padding, and 64px row height in the measured desktop menu.

### Primary CTA Buttons

Use the CTA button pattern for important page actions:

- Height: minimum `45px`.
- Padding: `14px 24px`.
- Radius: `99rem`.
- Typography: `17px / 17px`, weight `500`, letter spacing `-0.17px`.
- Gap: `8px`.
- Primary fill: `primary` with white text.
- Secondary fill: light transparent blue with blue text.
- Dark-section CTA: white fill with `fg-1` or Apple blue text depending on emphasis.

Use one primary CTA per hero/module. Pair it with one secondary action only when the secondary route is genuinely useful.

### Product Sections

Product sections are full-width scenes wrapped in a padded container:

- Desktop wrapper padding: `0 24px 24px`.
- Mobile wrapper padding: `0 8px 8px`.
- Headings sit inside the `986px` content width.
- Use oversized titles, muted descriptions, and a single CTA group.
- If the section is dark, set headings in white, descriptions at `rgba(255,255,255,0.7)`, and use blue for labels.

### Partner Cards

Partner cards support ecosystem credibility:

- Grid: two columns on desktop, one column on mobile.
- Gap: `16px`.
- Card radius: `20px`.
- Padding: `24px`.
- Background: `rgba(255,255,255,0.65)`.
- Hover background: `rgba(255,255,255,0.85)`.
- Use restrained logos or product names. Do not overload the cards with long copy.

### Market Cards

Market cards appear on dark sections:

- Grid: repeat columns with `minmax(300px, 1fr)`.
- Gap: `24px`.
- Card radius: `24px`.
- Padding: `32px 24px`.
- Background: `rgba(255,255,255,0.03)`.
- Label: blue, `14px`, weight `500`.
- Title: white, `18px / 24.48px`, weight `500`.
- Body: white at about `70%` opacity, `16px`.

### Trust Statistic Cards

Statistic cards prove scale and trust:

- Grid: `repeat(auto-fit, minmax(300px, 1fr))`.
- Gap: `24px`.
- Top padding after the section intro: `80px`.
- Card padding: `32px 24px`.
- Radius: `24px`.
- Background: `#f5f5f7`.
- Value: `24px / 32.4px`, weight `500`, tight tracking.
- Label/body: `16px`, muted `fg-2`.

Numbers should be short, scannable, and formatted with clear units: `$3.46T`, `$88.44B`, `6+ Years`, `SOC 2 Type 2`.

### FAQ

The FAQ section uses a two-column desktop layout:

- Section padding: `120px 48px`.
- Left rail heading: `40px / 54px`, weight `500`.
- Question rows: `18px / 24.3px`, weight `450`.
- Use `border-2` for row separators.
- Mobile should become one column with `48px 20px` padding.

Answers should be short and functional. Do not turn FAQ rows into marketing copy.

### Newsletter

Newsletter modules are compact and utilitarian:

- Section padding: `100px 48px` desktop, `48px 20px` mobile.
- Card max width: `493px`.
- Card background: `#f5f5f7`.
- Card radius: `16px`.
- Card padding: `32px`.
- Title: `24px / 36px`, weight `450`.
- Input height: `40px`.
- Input radius: `20px 6px 6px 20px`.
- Submit radius: `6px 20px 20px 6px`.
- Submit fill: `fg-1`, white text.

On mobile, split controls should become stacked or full pill controls to avoid cramped asymmetric corners.

### Footer

The footer is wide but quiet:

- Width: `1082px` on desktop.
- Padding: `72px 48px`.
- Use dividers at `border-2`.
- Use muted text for secondary links.
- Keep link groups dense and scannable.

## Imagery & Assets

The clone includes `99` local assets from the source site. Use real assets from `./assets/source` when reproducing the homepage style. Do not replace product imagery with abstract gradients or unrelated stock visuals.

Asset guidance:

- Use SVG logos and icons at their natural proportions.
- Keep product imagery crisp and centered in its section.
- Do not crop product screenshots so tightly that the object becomes unclear.
- When using dark sections, make sure image edges and shadows remain visible against near-black surfaces.
- Maintain responsive image sizing with stable aspect ratios to avoid layout shift.

## Interaction States

Every interactive element needs a visible hover, active, disabled, and focus state.

- Hover: soft fill shift, slight text darkening, or a subtle `translateY(-1px)` on card-like CTAs.
- Hover and active/selected are distinct states — never render them the same. Hover is a quiet *affordance* that previews the action; the active/selected state is the committed, higher-contrast result. The canonical reference is the segmented / viewport switch (`Segmented` in `src/components/dashboard/inspector.jsx`): inactive `fg-2` → hover darkens to `fg-1` → selected becomes a solid `bg-1` pill. Apply the same model to every stateful control — e.g. the star rating: empty outline → hover light `primary-wash` preview → click solid `primary` fill (with the committed state carrying the celebratory motion, not the hover).
- Active: return transform to neutral and slightly deepen the fill.
- Focus: use a visible `2px` ring in `focus` `#0071e3` with at least `3px` offset.
- Disabled: reduce contrast, remove hover transform, and use a disabled cursor only for actual disabled controls.
- Menus: open below the nav trigger with rounded rows and clear hit areas of at least `44px`.

Do not remove browser focus outlines unless the replacement is at least as visible.

## Accessibility

- Body text should meet WCAG AA contrast against its surface.
- Do not use blue text on very pale blue backgrounds for long copy.
- Pair all color-coded statuses with text or an icon.
- Maintain minimum target size of `44px` for touch controls. Header nav buttons are compact on desktop but mobile menu rows should be larger.
- Keep headings semantically ordered even when the visual size changes.
- Use real buttons for menu toggles and form submits.
- Respect `prefers-reduced-motion`.
- Keep form labels available to screen readers even when using placeholders visually.

## Voice & Content

Aave's homepage copy is short, confident, and direct. It does not over-explain the protocol on first contact.

- Use Title Case for major headings: `Savings for Everyone`, `Build with Aave`, `Trusted by Default`.
- Use sentence case for body copy and helper text.
- Keep CTA labels brief: `Use Aave`, `Get started`, `Start saving`, `Sign up`.
- Prefer concrete protocol language over vague marketing language.
- Use proof points as numbers, not paragraphs.
- Avoid hype words, exclamation marks, and generic claims like `revolutionary`, `best-in-class`, or `seamless`.
- In errors, say what happened and what to do next.
- In loading states, use short present-tense labels: `Loading markets`, `Saving email`, `Opening app`.

## Do's and Don'ts

- Do use `Aave Repro` and the extracted type scale instead of browser defaults.
- Do use `primary` sparingly for CTAs, labels, and selected states.
- Do keep large sections airy with centered `986px` content.
- Do use `20px` and `24px` radii for cards.
- Do use muted neutral surfaces and hairline borders for separation instead of shadows.
- Do collapse grids to one column below `768px`.
- Do keep dark sections reserved for high-emphasis product storytelling.
- Don't make every card blue.
- Don't use box-shadows of any kind, glass blur, bokeh, or decorative orbs.
- Don't set headings in bold weights above `500`.
- Don't stretch logos or icons.
- Don't replace the cloned assets with unrelated imagery.
- Don't use color alone to express status.
- Don't reduce mobile spacing until text wraps awkwardly.

## Implementation

Use the existing CSS package when building:

```html
<link rel="stylesheet" href="/design-system/tokens.css">
<link rel="stylesheet" href="/design-system/components.css">
```

Basic section:

```html
<section class="aave-section">
  <div class="aave-section__inner aave-stack">
    <p class="aave-kicker">Protocol</p>
    <h1 class="aave-heading-xl">Savings for Everyone</h1>
    <p class="aave-text-lead">Access Aave with a calm, clear, trust-focused interface.</p>
    <div class="aave-button-row">
      <a class="aave-button aave-button--primary" href="#">Use Aave</a>
      <a class="aave-button aave-button--secondary" href="#">Learn more</a>
    </div>
  </div>
</section>
```

Dark card grid:

```html
<section class="aave-section aave-surface-dark">
  <div class="aave-section__inner aave-stack">
    <h2 class="aave-heading-lg">Markets for every strategy.</h2>
    <div class="aave-grid aave-grid--auto">
      <article class="aave-card aave-card--dark aave-market">
        <p class="aave-market__label">Main</p>
        <h3 class="aave-market__title">Core liquidity markets</h3>
        <p class="aave-text-body">Use short descriptions and restrained contrast.</p>
      </article>
    </div>
  </div>
</section>
```

Newsletter:

```html
<form class="aave-newsletter">
  <h2 class="aave-heading-md">Be the first to hear about Aave Labs news.</h2>
  <div class="aave-newsletter__form">
    <label class="sr-only" for="aave-email">Email address</label>
    <input class="aave-newsletter__input" id="aave-email" type="email" placeholder="Email address">
    <button class="aave-newsletter__submit" type="submit">Sign up</button>
  </div>
</form>
```

If the target app uses a component framework, map the YAML tokens at the top of this file into the app's theme layer first. Components should consume tokens, not hard-coded one-off values.
