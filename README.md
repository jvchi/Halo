# Halo

Halo is a testimonial aggregator — collect, approve, design, and publish premium
testimonial widgets that look native to your brand. This repo is the React app:
a marketing landing page plus the product dashboard shell.

Built with **React + Vite (JavaScript)**, **Tailwind CSS**, **Motion**, and **React Router**.

## Run

```sh
npm install
npm run dev      # Vite dev server on http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Persistent dashboard setup

Local development uses an in-memory repository and the existing fixtures when
`.dev.vars` contains `APP_ENV=development`. Production requires Neon, Clerk, and
R2 credentials; copy the variable names from `.dev.vars.example`, configure the
R2 and rate-limit bindings in `wrangler.jsonc`, then run:

```sh
npm run db:generate
npm run db:push
npm test
npm run deploy
```

`GET /api/health` returns `503` with the names of missing production bindings,
so an incomplete deployment cannot silently fall back to mock persistence.

## How it's organized

```
src/
  routes/
    Landing.jsx              # marketing landing (see "Landing" below)
    Pricing.jsx              # placeholder pricing
    dashboard/               # product app shell (Overview, Inbox, Widget Studio, Walls, Analytics)
  components/
    ui/                      # design-system primitives (Button, Card, Stat, Accordion, ...)
    icons/                   # 8 animated testimonial SVG icons as React components
    landing/Logo.jsx         # Halo wordmark for product surfaces
  reference-landing/         # the embedded reference landing (see below)
  styles/                    # Tailwind entry + Halo design tokens
  lib/                       # helpers + widget preset stubs
design/                      # design.md brief + design-system notes
docs/                        # product blueprint (PRODUCT_BUILD_BLUEPRINT.md)
public/aave/                 # original cloned assets + CSS served to the landing
reference/                   # frozen source material (out of the build)
```

### Landing page

The landing is a **1:1 copy of the cloned reference homepage** — original markup,
original CSS, and original assets are embedded as-is (`src/reference-landing/`,
served from `public/aave/`). The only change layered on top is
[`halo-recolor.css`](src/reference-landing/halo-recolor.css), which overrides the
cloned palette variables (warm grays + Aave lavender) with the **Apple-style Halo
blue** palette. Interactivity (mega-menu, mobile menu, FAQ accordion, newsletter)
is the original `clone.js` ported to [`cloneScript.js`](src/reference-landing/cloneScript.js).

To re-extract the embedded markup/CSS from the frozen clone, re-run the node step
that produced `src/reference-landing/body.html` + `head.css` from
`reference/aave-clone/index.html`.

### Dashboard

The dashboard is **new product UI** (no reference to copy), built from the Halo
design system in `components/ui/` + the animated icons. Pages are placeholder
shells mapping to the blueprint modules.

## Reference material

`reference/` is frozen and excluded from the build:

- `reference/aave-clone/` — the original static clone (still serves standalone).
- `reference/screenshots/` — source vs. clone screenshots + breakpoint diffs.
- `reference/metrics/` — rendered page metrics, asset inventory, raw HTML.
- `reference/design-system-legacy/` — the original `tokens.css`/`components.css`.
- `reference/testimonial-icons-legacy/` — the source SVG icon pack.

The product spec lives in [docs/PRODUCT_BUILD_BLUEPRINT.md](docs/PRODUCT_BUILD_BLUEPRINT.md);
the design brief in [design/design.md](design/design.md).
