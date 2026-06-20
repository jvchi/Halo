import { shadowCss } from "@/lib/presets";

// The shared testimonial renderer (blueprint §6.6). It is intentionally
// self-contained — no Tailwind, no design-system imports — only inline styles
// driven by CSS variables from the theme preset. That keeps the output
// deterministic so the dashboard preview matches the future public iframe embed,
// and lets this component be lifted into the embed runtime untouched.

const SOURCE_LABELS = {
  form: "Via collection form",
  x: "Shared on X",
  linkedin: "Shared on LinkedIn",
  google: "Google review",
  manual: "Added manually",
};

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function Stars({ rating = 5, of = 5 }) {
  return (
    <div
      role="img"
      aria-label={`${rating} out of ${of} stars`}
      style={{ display: "flex", gap: 2 }}
    >
      {Array.from({ length: of }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L10 14.77l-5.2 2.73.99-5.78L1.58 7.62l5.82-.85L10 1.5z"
            fill={i < rating ? "var(--w-accent)" : "var(--w-star-empty)"}
          />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ name }) {
  return (
    <div
      aria-hidden="true"
      style={{
        flex: "0 0 auto",
        width: 36,
        height: 36,
        borderRadius: 999,
        display: "grid",
        placeItems: "center",
        fontSize: 13,
        fontWeight: 600,
        color: "var(--w-accent)",
        background: "color-mix(in srgb, var(--w-accent) 14%, transparent)",
      }}
    >
      {initials(name)}
    </div>
  );
}

function TestimonialCard({ t, display, glass }) {
  return (
    <figure
      style={{
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: 22,
        background: "var(--w-card)",
        color: "var(--w-text)",
        borderRadius: "var(--w-radius)",
        boxShadow: "var(--w-shadow)",
        border: "1px solid var(--w-border)",
        breakInside: "avoid",
        ...(glass
          ? { backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }
          : null),
      }}
    >
      {display.showRating && t.rating ? <Stars rating={t.rating} /> : null}

      <blockquote
        style={{
          margin: 0,
          fontSize: 15,
          lineHeight: 1.55,
          letterSpacing: "-0.01em",
        }}
      >
        “{t.text}”
      </blockquote>

      <figcaption
        style={{
          marginTop: "auto",
          display: "flex",
          alignItems: "flex-start",
          gap: 11,
        }}
      >
        {display.showAvatar && <Avatar name={t.name} />}
        <div style={{ display: "grid", gap: 2, minWidth: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.25 }}>{t.name}</span>
          {display.showCompany && (t.role || t.company) ? (
            <span style={{ fontSize: 12.5, lineHeight: 1.25, color: "var(--w-muted)" }}>
              {[t.role, t.company].filter(Boolean).join(" · ")}
            </span>
          ) : null}
          {display.showSource && t.source ? (
            <span style={{ fontSize: 11, lineHeight: 1.25, color: "var(--w-muted)" }}>
              {SOURCE_LABELS[t.source] ?? t.source}
            </span>
          ) : null}
        </div>
      </figcaption>
    </figure>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        padding: "56px 24px",
        textAlign: "center",
        color: "var(--w-muted)",
        fontSize: 14,
        border: "1px dashed var(--w-border)",
        borderRadius: "var(--w-radius)",
      }}
    >
      No approved testimonials yet.
    </div>
  );
}

const LAYOUT_STYLES = {
  single: { display: "grid", gap: 16, maxWidth: 460, margin: "0 auto" },
  grid: {
    display: "grid",
    gap: 16,
    gridTemplateColumns: "repeat(var(--w-columns), minmax(0, 1fr))",
  },
  masonry: {
    columns: "var(--w-columns)",
    columnGap: 16,
  },
};

const CARD_WIDTH = 320;

// Marquee keyframes live in a scoped <style> so the renderer stays self-contained.
// Each card carries its own right margin (no flex gap) so translateX(-50%) loops
// seamlessly across the duplicated set. Reduced motion stops the animation.
const MARQUEE_CSS = `
@keyframes halo-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.halo-marquee-track { animation: halo-marquee linear infinite; will-change: transform; }
.halo-marquee-viewport:hover .halo-marquee-track { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) { .halo-marquee-track { animation: none; } }
`;

const EDGE_FADE =
  "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)";

export function WidgetRenderer({ config, testimonials = [] }) {
  const { type = "grid", theme, columns = 3, display } = config;
  const items =
    type === "single" ? testimonials.slice(0, 1) : testimonials.slice(0, config.maxItems ?? 12);

  const vars = {
    "--w-accent": theme.accent,
    "--w-card": theme.cardBackground,
    "--w-text": theme.textColor,
    "--w-radius": `${theme.radius}px`,
    "--w-shadow": shadowCss[theme.shadow] ?? "none",
    "--w-columns": String(columns),
    "--w-star-empty": "color-mix(in srgb, var(--w-text) 16%, transparent)",
    "--w-muted": "color-mix(in srgb, var(--w-text) 58%, transparent)",
    "--w-border": "color-mix(in srgb, var(--w-text) 9%, transparent)",
    fontFamily: theme.fontFamily,
  };

  if (items.length === 0) {
    return (
      <div style={vars}>
        <EmptyState />
      </div>
    );
  }

  if (type === "marquee") {
    // Duration scales with item count so speed feels constant regardless of how
    // many testimonials are shown. The set is duplicated for a seamless loop.
    const duration = Math.max(18, items.length * 6);
    return (
      <div style={vars}>
        <style>{MARQUEE_CSS}</style>
        <div
          className="halo-marquee-viewport"
          style={{
            overflow: "hidden",
            maskImage: EDGE_FADE,
            WebkitMaskImage: EDGE_FADE,
          }}
        >
          <div
            className="halo-marquee-track"
            style={{ display: "flex", width: "max-content", animationDuration: `${duration}s` }}
          >
            {[...items, ...items].map((t, i) => (
              <div
                key={`${t.id}-${i}`}
                aria-hidden={i >= items.length || undefined}
                style={{ flex: `0 0 ${CARD_WIDTH}px`, maxWidth: "82vw", marginRight: 16 }}
              >
                <TestimonialCard t={t} display={display} glass={theme.glass} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "carousel") {
    return (
      <div style={vars}>
        <div
          style={{
            display: "flex",
            gap: 16,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingBottom: 8,
          }}
        >
          {items.map((t) => (
            <div
              key={t.id}
              style={{ flex: `0 0 ${CARD_WIDTH}px`, maxWidth: "82vw", scrollSnapAlign: "start" }}
            >
              <TestimonialCard t={t} display={display} glass={theme.glass} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={vars}>
      <div style={LAYOUT_STYLES[type] ?? LAYOUT_STYLES.grid}>
        {items.map((t) => (
          <div
            key={t.id}
            style={
              type === "masonry"
                ? { marginBottom: 16, breakInside: "avoid" }
                : undefined
            }
          >
            <TestimonialCard t={t} display={display} glass={theme.glass} />
          </div>
        ))}
      </div>
    </div>
  );
}
