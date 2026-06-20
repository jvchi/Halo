import { WidgetRenderer } from "@/components/widget/WidgetRenderer.jsx";

// A hosted Wall of Love page (blueprint §6.8): a themed hero over a masonry of
// approved testimonials. Like WidgetRenderer it themes itself from the preset
// (background / text / accent) with inline styles, so this same component can be
// dropped into a public `/w/{slug}` route later without the dashboard around it.

function Monogram({ name, accent }) {
  const letter = (name?.trim()?.[0] ?? "H").toUpperCase();
  return (
    <div
      aria-hidden="true"
      style={{
        width: 44,
        height: 44,
        borderRadius: 13,
        display: "grid",
        placeItems: "center",
        fontSize: 18,
        fontWeight: 600,
        color: "#fff",
        background: accent,
      }}
    >
      {letter}
    </div>
  );
}

export function WallView({ config, testimonials, hero }) {
  const { theme } = config;
  const muted = `color-mix(in srgb, ${theme.textColor} 60%, transparent)`;

  return (
    <div
      style={{
        background: theme.background,
        color: theme.textColor,
        fontFamily: theme.fontFamily,
        paddingBottom: 20,
      }}
    >
      <header
        style={{
          display: "grid",
          justifyItems: "center",
          gap: 16,
          textAlign: "center",
          maxWidth: 640,
          margin: "0 auto",
          padding: "44px 24px 36px",
        }}
      >
        {hero.showLogo ? <Monogram name={hero.workspace} accent={theme.accent} /> : null}
        <div style={{ display: "grid", gap: 10 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: theme.accent,
            }}
          >
            Wall of Love
          </span>
          <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.1, fontWeight: 600, letterSpacing: "-0.02em" }}>
            {hero.title}
          </h1>
          {hero.description ? (
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: muted }}>{hero.description}</p>
          ) : null}
        </div>
        {hero.showCta && hero.ctaLabel ? (
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: 44,
              padding: "0 22px",
              borderRadius: 999,
              background: theme.accent,
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {hero.ctaLabel}
          </a>
        ) : null}
      </header>

      <div style={{ padding: "0 24px" }}>
        <WidgetRenderer config={config} testimonials={testimonials} />
      </div>
    </div>
  );
}
