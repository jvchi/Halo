// Sticker card — a bold-bordered, hard-shadowed testimonial card in a candy color
// with a subtle tilt. This is the standalone, reusable unit: no section heading,
// background texture, footer, or scattered absolute positioning. The container
// below lays the cards out in a responsive grid that grows as reviews are added.

const FONT = '"Poppins", "Nunito", "Segoe UI", system-ui, sans-serif';
const INK = "#1c1c1c";

// Color + tilt cycle per card, so a stacked set keeps the playful sticker variety.
const CARD_BG = ["#a9f0a0", "#f9a8d4", "#ffffff", "#bfe3ff", "#ffe08a"];
const AVATAR_BG = ["#7bbf74", "#d97aab", "#8a8f99", "#5b9bd5", "#d9a441"];
const TILT = [-2, 1.6, -1.2, 2, -0.8];

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function Stars() {
  return (
    <div aria-hidden="true" style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="20" height="20" viewBox="0 0 24 24">
          <path
            d="M12 2l2.94 6.26 6.56.9-4.82 4.66 1.2 6.78L12 17.9 6.12 21.6l1.2-6.78L2.5 9.16l6.56-.9L12 2z"
            fill={INK}
          />
        </svg>
      ))}
    </div>
  );
}

export function StickerCard({ t, i = 0 }) {
  return (
    <figure
      style={{
        margin: 0,
        height: "100%",
        transform: `rotate(${TILT[i % TILT.length]}deg)`,
        background: CARD_BG[i % CARD_BG.length],
        border: `2.5px solid ${INK}`,
        borderRadius: 18,
        padding: "26px 26px 22px",
        boxShadow: "8px 10px 0 rgba(0,0,0,0.88)",
        fontFamily: FONT,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stars />
      <blockquote
        style={{
          margin: "18px 0 0",
          fontSize: 16.5,
          lineHeight: 1.5,
          fontStyle: "italic",
          color: INK,
          display: "-webkit-box",
          WebkitLineClamp: 6,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {t.text}
      </blockquote>

      <div style={{ height: 1.5, background: INK, margin: "20px 0 16px" }} />

      <figcaption style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 12 }}>
        <span
          aria-hidden="true"
          style={{
            flex: "0 0 auto",
            width: 40,
            height: 40,
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
            background: AVATAR_BG[i % AVATAR_BG.length],
            border: `2px solid ${INK}`,
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {initials(t.name)}
        </span>
        <span style={{ display: "grid", gap: 1, minWidth: 0 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: INK, lineHeight: 1.2 }}>
            {t.name}
          </span>
          {(t.role || t.company) && (
            <span style={{ fontSize: 14, color: INK, lineHeight: 1.2 }}>
              {[t.role, t.company].filter(Boolean).join(", ")}
            </span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}

// Container: a responsive grid that wraps and grows as more reviews come in.
export function StickerTemplate({ testimonials = [], columns = 3 }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 30,
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {testimonials.map((t, i) => (
        <StickerCard key={t.id ? `${t.id}-${i}` : i} t={t} i={i} />
      ))}
    </div>
  );
}
