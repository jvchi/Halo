# Halo Product Roadmap

Created: 2026-06-22
Companion to [`PRODUCT_BUILD_BLUEPRINT.md`](./PRODUCT_BUILD_BLUEPRINT.md). The blueprint
is the full spec; this is the sequenced plan for getting from the current
prototype to a shippable product, ordered by what we build next.

## Where we are today

Halo is a **front-end prototype**, not yet a product:

- Vite + React SPA, React Router, Tailwind, GSAP/motion. No backend.
- All data is a client-side mock store (`src/lib/testimonialsStore.jsx`,
  `src/lib/testimonials.js`). Nothing persists.
- Built UI: Landing, Pricing, Templates; dashboard Overview, Inbox, Widget
  Studio, Walls, Analytics; `WidgetRenderer` + 3 templates, `WallView`, presets.
- The **presentation layer is ahead of the spec** — which is the intended moat
  ("design is the product"). The backend is empty.

The honest framing: we've built the *look* of a late-stage product on top of an
empty foundation. The plan below keeps front-end momentum (the part we're good
at and want to keep doing) while sequencing the backend so the design work isn't
wasted.

## Guiding constraints

- **Front-end first.** Keep improving the dashboard on the mock store. Every
  screen below is designed to be built against mock data, then wired to a real
  API later with minimal change. The mock store is already the seam.
- **No Supabase.** Storage limit reached; not paying right now. The backend
  stack below is chosen to be free-tier friendly and Supabase-free.
- **Keep the SPA for now.** Defer the Next.js migration until the embed runtime
  and SEO walls actually need server rendering (Phase C). Don't rewrite early.

## Recommended stack (Supabase-free, free-tier friendly)

Swap-in for the blueprint's Supabase assumptions:

| Concern | Blueprint default | Halo choice | Why |
|---|---|---|---|
| Database | Supabase Postgres | **Neon** (free Postgres) | Generous free tier, branchable, plain Postgres |
| ORM | Drizzle | **Drizzle** (unchanged) | Lightweight, SQL-first |
| Auth | Supabase Auth | **Clerk** free tier *or* **Better Auth** (self-host) | No Supabase dependency; Clerk = fastest, Better Auth = free + owned |
| File/media storage | Supabase Storage | **Cloudflare R2** | 10 GB free, zero egress fees — ideal for avatars/screenshots/video |
| Hosting | Vercel | **Cloudflare Pages/Vercel free** | Free tier covers MVP |
| Email | Resend | **Resend** (free 3k/mo) | Unchanged |
| Background jobs | Inngest/queue table | **Postgres queue table → Inngest free** later | Start simple |

Net: Neon + Drizzle + Clerk/Better Auth + Cloudflare R2 + Resend. None of it
touches Supabase, and the media problem (your storage limit) is solved by R2's
free 10 GB with no egress charges.

---

## Phases

Phases A and B are **pure front-end** — no backend required, built on the mock
store. They're the near-term focus. Phases C onward introduce the backend.

### Phase A — Dashboard completeness (front-end, mock data) ← NEXT

Goal: every dashboard surface in blueprint §15 exists and feels real, still on
mock data. This is the bulk of the remaining front-end work.

Missing surfaces (not in nav / not built):

- [ ] **Collection Forms** list + **Form Builder** — the front door. No form UI
      exists today. Build list view + builder (fields, prompts, thank-you,
      consent toggle) editing a mock `forms` array.
- [ ] **Imports** page — CSV / paste / screenshot-upload UI with a review step
      (queued → needs_review → imported), mock pipeline.
- [ ] **Settings** page — workspace name, logo, website URL, brand colors,
      slug. Drives the brand tokens the studio already consumes.
- [ ] **Billing** page (in-dashboard) — plan cards, current plan, usage meters
      against mock limits. Distinct from the marketing Pricing page.
- [ ] **Testimonial detail drawer** — full record view from the Inbox (Inbox
      currently lists + moderates; no detail/edit surface).
- [ ] **Manual "Add testimonial"** modal/form.
- [ ] **Widget list** — Widget Studio edits one widget; add a list/gallery of
      saved widgets with create/duplicate.
- [ ] **Embed instructions modal** — Studio has a copy button + mock
      `EMBED_CODE`; promote to a proper modal (iframe + script tabs, framework
      snippets).

Polish carried alongside:

- [ ] Empty / loading / error states for every page (blueprint §19, §1
      "more polished than competitors").
- [ ] More widget templates + presets (only 3 templates exist; blueprint §16
      lists 10 starter presets, §6.6 lists 6 widget types).

Exit: a clickable, complete dashboard demoing the whole product story on mock
data — good enough for landing-page screenshots and user feedback.

### Phase B — Front-end realism polish (front-end, mock data)

Goal: make the prototype feel production-grade before backend cost is incurred.

- [ ] Live Website Preview UI (blueprint §6.9) — URL input → static frame →
      overlay widget at chosen position. Mock the screenshot for now.
- [ ] AI Brand Matcher UI shell (blueprint §6.10) — URL → 3 theme suggestions →
      apply. Deterministic/mock generation, no model yet.
- [ ] Motion presets + `prefers-reduced-motion` handling in `WidgetRenderer`.
- [ ] Responsive + mobile-override pass on studio and embeds.

Exit: the differentiators *look* real and demoable; only data is fake.

### Phase C — Backend foundation (blueprint Phase 0)

Goal: real persistence and auth, Supabase-free.

- [ ] Stand up Neon Postgres + Drizzle schema (blueprint §10 tables) +
      migrations.
- [ ] Add API layer. Decision point: add API routes to the SPA via a thin
      Node/Hono service, **or** migrate to Next.js now if SEO walls/SSR embeds
      are imminent. Recommend migrating here, not earlier.
- [ ] Clerk (or Better Auth) auth + workspace model (`workspace_members`).
- [ ] Env validation, error logging.
- [ ] Replace `testimonialsStore` mock reducer with fetched data + API
      dispatches (the seam is already there).

Exit: user signs up, gets a workspace, sees a real (empty) dashboard.

### Phase D — Collection & embeds for real (blueprint Phases 1–2)

The actual product. This is where it stops being a prototype.

- [ ] Public collection form route + submission API (→ `pending`), consent,
      spam protection, R2 signed uploads for avatars.
- [ ] Inbox wired to real moderation (`pending → approved` server-side).
- [ ] `/embed/{widget_id}` iframe route + public widget API + auto-height
      postMessage + copy-embed. **This is the core value prop** — a widget
      embeddable on an external site.
- [ ] Public Wall of Love route with SEO metadata + schema.org review markup
      (competitors rank on this; blueprint §6.8 omits the markup).

Exit: a customer submits via a link, owner approves, widget embeds on a real
external HTML page.

### Phase E — Analytics & billing (blueprint Phases 3–4)

- [ ] Events endpoint (append-only) + `sendBeacon` + daily aggregation job.
- [ ] Wire Analytics page to real data.
- [ ] Stripe Checkout/portal/webhooks + **server-enforced** plan limits.

Exit: user can upgrade; limits enforced; analytics reflect real traffic.

### Phase F — Differentiators & growth (blueprint Phases 5–6 + market gaps)

Now-real versions of Phase B shells, plus competitor parity/leapfrog:

- [ ] AI Brand Matcher (real model behind the UI shell).
- [ ] Screenshot/CSV import (real pipeline behind Phase A UI).
- [ ] Imports from external platforms (Google, G2, Trustpilot — competitor
      table stakes).
- [ ] One-click testimonial → LinkedIn/X social image (Senja ships this).
- [ ] Zapier / webhooks / Slack notifications.
- [ ] Video testimonials + AI video editing (captions, trim, highlight reels —
      the hottest 2026 differentiator; blueprint treats video as post-launch).

---

## Competitor signal (informs Phase F priorities)

From 2026 market research (Senja, Testimonial.to, Shapo, Trustmary, Boast):

**Table stakes we must reach:** 20–30+ platform imports, AI sentiment analysis,
the full widget set (grid/carousel/marquee/badge/toast/wall), generous free tier,
Zapier/Slack/webhooks.

**Our defensible wedge:** none of them lead on *embed design quality*. Our
prototype already renders nicer than the spec — protect and extend that.

**Under-weighted in the blueprint, worth considering:**

- AI video editing (auto-captions, pause removal, highlight reels) — strongest
  2026 trend.
- AI authenticity / fake-detection scoring.
- AI-search / GEO visibility (getting testimonials cited by LLMs — Trustmary's
  angle); novel wedge.
- schema.org review markup on Wall pages for SEO — folded into Phase D above.

Sources: Senja (senja.io), Shapo (shapo.io/blog), wiserreview.com, reviewnexa.com,
storyprompt.com, vocalvideo.com.

---

## Immediate next actions

1. Pick the first Phase A surface to build (suggest: **Collection Forms +
   Form Builder** — it's the missing front door and unblocks the demo story).
2. Keep building on the mock store; preserve the `testimonialsStore` seam.
3. Defer all stack/cost decisions until Phase C.
