# Aave-Inspired Design System with Apple-Style Colors

This folder packages the cloned homepage into a reusable CSS design system. It keeps the local font files, spacing, radii, and measured component structure from the clone, then retargets the color layer to an Apple-style palette built around blue, white, near-black, and soft system grays.

## Files

- `tokens.css` - font faces, color primitives, spacing, radii, layout widths, shadows, and motion tokens.
- `components.css` - reusable prefixed classes for layout, typography, buttons, nav, cards, stats, market cards, newsletter forms, and accordions.
- `preview.html` - a local component sheet that demonstrates the system.

## Use

Import tokens before components:

```html
<link rel="stylesheet" href="/design-system/tokens.css">
<link rel="stylesheet" href="/design-system/components.css">
```

Then compose the classes:

```html
<section class="aave-section">
  <div class="aave-section__inner aave-stack">
    <p class="aave-kicker">Markets</p>
    <h1 class="aave-heading-xl">Build with Apple-style color foundations.</h1>
    <p class="aave-text-lead">Use the same font, spacing, radius, and interaction language with an Apple-inspired color layer.</p>
    <a class="aave-button aave-button--primary" href="#">Get started</a>
  </div>
</section>
```

## Core Tokens

| Token | Value | Source usage |
| --- | --- | --- |
| `--aave-font-sans` | Aave Repro | Homepage UI font |
| `--aave-fg-1` | `#1d1d1f` | Apple-style near-black primary text |
| `--aave-fg-2` | `#6e6e73` | Secondary text |
| `--aave-primary` | `#0071e3` | Primary CTAs, links, labels, and focus |
| `--aave-bg-3` | `#f5f5f7` | Soft Apple-style page sections |
| `--aave-border-2` | `#d2d2d7` | FAQ and structural dividers |
| `--aave-container-md` | `986px` | Main content width |
| `--aave-container-lg` | `1082px` | Wide shell and footer width |
| `--aave-radius-xl` | `24px` | Primary card radius |
| `--aave-radius-pill` | `99rem` | Buttons and pills |

## Typography

- Hero: `72px / 1.1`, weight `500`, letter spacing `-0.05em`.
- Mobile hero: `48px / 1.1`, letter spacing `-0.03em`.
- Section heading: `40px / 1.2`, weight `500`.
- Lead text: `20px / 1.36`, muted foreground.
- Body text: `16px / 1.5`, muted foreground.

## Component Notes

- Buttons use 45px minimum height, `14px 24px` padding, `17px` medium text, and full pill radius.
- Cards default to 24px radius and `32px 24px` padding.
- Two-column partner and market grids collapse to one column below `768px`.
- Newsletter inputs keep the original split-pill desktop shape and become full pills on mobile.

## Preview

With the clone dev server running, open:

```text
http://localhost:5178/design-system/preview.html
```
