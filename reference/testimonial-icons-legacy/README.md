# Testimonial Animated Icons

Standalone animated SVG icon pack for a testimonial aggregator SaaS. The style follows the Aave menu icon construction but removes the tile border: transparent 48px SVGs, saturated two-tone filled geometry, soft curves, and restrained staged motion. The metaphors are specific to testimonial collection and presentation.

## Files

- `animated-icons.css` - shared tokens, base icon styling, animation states, and keyframes.
- `icons/collect.svg` - inbound testimonial card.
- `icons/approve.svg` - moderation approval.
- `icons/widget-studio.svg` - widget customization.
- `icons/embed.svg` - embed code.
- `icons/wall-of-love.svg` - showcase wall.
- `icons/analytics.svg` - testimonial analytics.
- `icons/ai-brand-match.svg` - AI brand matching.
- `icons/live-preview.svg` - rounded live preview surfaces.
- `preview.html` - local preview for light, dark, and size checks.

## Usage

Each SVG references the shared stylesheet:

```html
<iframe src="/testimonial-icons/icons/collect.svg" title="Collect testimonials"></iframe>
```

For full CSS control in an app, inline the SVG markup and include the stylesheet once:

```html
<link rel="stylesheet" href="/testimonial-icons/animated-icons.css">

<svg class="ta-icon ta-icon--collect is-idle" viewBox="0 0 48 48" aria-hidden="true">
  <!-- Paste the SVG contents here. -->
</svg>
```

React-style usage:

```jsx
import "./animated-icons.css";

export function CollectIcon({ active = false }) {
  return (
    <svg
      className={`ta-icon ta-icon--collect ${active ? "is-active" : "is-idle"}`}
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      {/* Paste the collect.svg inner markup here. */}
    </svg>
  );
}
```

## Animation States

- `is-idle` - default ambient loop.
- `is-active` - use for hover, focus, selected, or highlighted states.
- `is-paused` - freezes animation while keeping the icon visible.

The SVG root also responds to `:hover` and `:focus-visible`. Reduced motion is handled in CSS:

```css
@media (prefers-reduced-motion: reduce) {
  .ta-icon * {
    animation: none !important;
  }
}
```

## Theme Tokens

Override these custom properties on the SVG root or a parent:

```css
.ta-icon {
  --icon-surface: transparent;
  --icon-border: transparent;
  --icon-purple: #8588ff;
  --icon-purple-soft: #b8c4ff;
  --icon-blue: #0b95e8;
  --icon-blue-soft: #7dd2ff;
  --icon-teal: #159aa6;
  --icon-teal-soft: #35bbc5;
  --icon-orange: #f24b22;
  --icon-orange-soft: #ff875f;
  --icon-dark: #27364a;
}
```

## Design Notes

- Base size is `48x48` with no visible tile frame or border.
- Internal artwork is filled geometry only; the outer tile border is the only stroke.
- Each icon uses one to three bold primitive shapes.
- Negative space is handled with SVG masks where needed, so the artwork stays transparent on any background.
- Animation is per-icon: cards settle, bars rise, brackets wrap inward, widget overlays float, and the AI twinkle pulses.
- No JS runtime is required.
- No external network assets are required.

## Local Preview

Open:

```text
/Users/destiny/Documents/Playground/testimonial-icons/preview.html
```

Or serve the folder with any static server and open `preview.html`.
