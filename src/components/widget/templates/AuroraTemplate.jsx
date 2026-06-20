// Aurora card — a clean white testimonial card with a soft colored gradient
// blooming up from its base. This is the standalone, reusable unit: no section
// heading, badge, or page background. The container below simply stacks the cards
// in a masonry flow that grows as more reviews are added. Self-contained inline
// styles so it renders identically in the dashboard preview and the embed runtime.

const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';

// Bloom + avatar color cycle per card, so a stacked set stays varied like the
// reference (yellow / blue / red / green / purple) instead of one flat color.
const BLOOMS = [
  "radial-gradient(120% 80% at 38% 122%, rgba(255,210,8,0.95) 0%, rgba(255,225,95,0.5) 30%, transparent 62%)",
  "radial-gradient(120% 82% at 60% 122%, rgba(108,142,206,0.82) 0%, rgba(150,178,224,0.42) 32%, transparent 64%)",
  "radial-gradient(120% 80% at 70% 122%, rgba(255,86,92,0.9) 0%, rgba(255,150,150,0.42) 32%, transparent 64%)",
  "radial-gradient(120% 80% at 45% 122%, rgba(52,199,120,0.8) 0%, rgba(150,224,170,0.4) 32%, transparent 64%)",
  "radial-gradient(120% 80% at 55% 122%, rgba(175,110,222,0.78) 0%, rgba(205,170,235,0.4) 32%, transparent 64%)",
];
const AVATAR_BG = ["#c9a7d6", "#5b9bd5", "#e08585", "#7bbf74", "#caa37a"];

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function AuroraCard({ t, i = 0 }) {
  return (
    <figure
      style={{
        margin: 0,
        position: "relative",
        overflow: "hidden",
        minHeight: 300,
        background: "#ffffff",
        borderRadius: 28,
        padding: "30px 28px",
        boxShadow: "0 18px 50px rgba(20,20,20,0.06)",
        fontFamily: FONT,
        display: "flex",
        flexDirection: "column",
        gap: 22,
        boxSizing: "border-box",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "78%",
          background: BLOOMS[i % BLOOMS.length],
          pointerEvents: "none",
        }}
      />
      <blockquote
        style={{
          position: "relative",
          margin: 0,
          fontSize: 24,
          lineHeight: 1.28,
          letterSpacing: "-0.5px",
          color: "#161616",
          fontWeight: 400,
          display: "-webkit-box",
          WebkitLineClamp: 6,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {"“" + t.text + "”"}
      </blockquote>

      <figcaption
        style={{
          position: "relative",
          marginTop: "auto",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            flex: "0 0 auto",
            width: 44,
            height: 44,
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
            background: AVATAR_BG[i % AVATAR_BG.length],
            color: "#fff",
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          {initials(t.name)}
        </span>
        <span style={{ display: "grid", gap: 2, minWidth: 0 }}>
          <span style={{ fontSize: 16, fontWeight: 500, color: "#161616", lineHeight: 1.2 }}>
            {t.name}
          </span>
          {(t.role || t.company) && (
            <span style={{ fontSize: 13.5, color: "#9a9a9e", lineHeight: 1.2 }}>
              {t.role || t.company}
            </span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}

// Container: a masonry flow (column-count) so cards of varying height pack neatly
// and the set simply grows downward as more reviews are approved.
export function AuroraTemplate({ testimonials = [], columns = 3 }) {
  return (
    <div style={{ columnCount: columns, columnGap: 24 }}>
      {testimonials.map((t, i) => (
        <div key={t.id ? `${t.id}-${i}` : i} style={{ breakInside: "avoid", marginBottom: 24 }}>
          <AuroraCard t={t} i={i} />
        </div>
      ))}
    </div>
  );
}
