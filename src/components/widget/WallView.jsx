import { WidgetRenderer } from "@/components/widget/WidgetRenderer.jsx";

// A hosted Wall of Love page (blueprint §6.8): a themed hero over a masonry of
// approved testimonials. Like WidgetRenderer it themes itself from the preset
// (background / text / accent) with inline styles, so this same component can be
// dropped into a public `/w/{slug}` route later without the dashboard around it.

function Monogram({ name, accent, compact = false }) {
  const letter = (name?.trim()?.[0] ?? "H").toUpperCase();
  return (
    <div
      aria-hidden="true"
      style={{
        width: compact ? 36 : 44,
        height: compact ? 36 : 44,
        borderRadius: compact ? 11 : 13,
        display: "grid",
        placeItems: "center",
        fontSize: compact ? 16 : 18,
        fontWeight: 600,
        color: "#fff",
        background: accent,
      }}
    >
      {letter}
    </div>
  );
}

function EditableText({ as: Component, value, placeholder, onChange, className, style }) {
  const editable = typeof onChange === "function";

  if (!editable) {
    return (
      <Component className={className} style={style}>
        {value || placeholder}
      </Component>
    );
  }

  return (
    <Component
      className={className}
      style={style}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      tabIndex={0}
      data-placeholder={placeholder}
      onBlur={(event) => onChange(event.currentTarget.textContent.trim())}
      onKeyDown={(event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          event.currentTarget.blur();
        }
      }}
    >
      {value}
    </Component>
  );
}

export function WallView({ config, testimonials, hero, compact = false, editable = false, onHeroChange }) {
  const { theme } = config;
  const muted = `color-mix(in srgb, ${theme.textColor} 60%, transparent)`;
  const setHeroField = (key) => (value) => onHeroChange?.(key, value);

  return (
    <div
      style={{
        background: theme.background,
        color: theme.textColor,
        fontFamily: theme.fontFamily,
        paddingBottom: 20,
      }}
    >
      {hero.showHeader ? (
        <header
          style={{
            display: "grid",
            justifyItems: "center",
            gap: compact ? 12 : 16,
            textAlign: "center",
            maxWidth: 640,
            margin: "0 auto",
            padding: compact ? "22px 24px 26px" : "44px 24px 36px",
          }}
        >
          {hero.showLogo ? <Monogram name={hero.workspace} accent={theme.accent} compact={compact} /> : null}
          <div style={{ display: "grid", gap: compact ? 8 : 10 }}>
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
            <EditableText
              as="h1"
              value={hero.title}
              placeholder="Add a title"
              onChange={editable ? setHeroField("title") : undefined}
              className="halo-wall-editable-text"
              style={{
                margin: 0,
                fontSize: compact ? 30 : 34,
                lineHeight: 1.1,
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            />
            {hero.description || editable ? (
              <EditableText
                as="p"
                value={hero.description}
                placeholder="Add a description"
                onChange={editable ? setHeroField("description") : undefined}
                className="halo-wall-editable-text"
                style={{ margin: 0, fontSize: compact ? 15 : 16, lineHeight: 1.45, color: muted }}
              />
            ) : null}
          </div>
          {hero.showCta && (hero.ctaLabel || editable) ? (
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: compact ? 40 : 44,
                padding: compact ? "0 20px" : "0 22px",
                borderRadius: 999,
                background: theme.accent,
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <EditableText
                as="span"
                value={hero.ctaLabel}
                placeholder="Button label"
                onChange={editable ? setHeroField("ctaLabel") : undefined}
                className="halo-wall-editable-text halo-wall-editable-text-on-accent"
              />
            </a>
          ) : null}
        </header>
      ) : null}

      <div style={{ padding: compact ? "0 20px" : "0 24px" }}>
        <WidgetRenderer config={config} testimonials={testimonials} />
      </div>
    </div>
  );
}
