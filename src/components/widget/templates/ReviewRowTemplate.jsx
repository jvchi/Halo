// Review-row card — a full-width bordered row with a hard shadow, a large circular
// initial avatar, and a dark "★ n/5" rating pill. This is the standalone, reusable
// unit: no section heading, page grid, sparkles, or brand footer. The container
// below stacks the rows into a list that simply grows as reviews are added — the
// most naturally stackable of the three. Self-contained inline styles.

const FONT = '"Poppins", "Nunito", "Segoe UI", system-ui, sans-serif';
const INK = "#1c1c1c";
const LIME = "#c6f24e";

// Rows alternate lime / white; avatar color cycles for variety in a long list.
const ROW_BG = [LIME, "#ffffff"];
const AVATAR_BG = ["#f5512a", "#7bb53a", "#1f8fff", "#9b59b6", "#e08a1e"];

function RatingPill({ rating = 5, of = 5 }) {
  return (
    <span
      style={{
        position: "absolute",
        top: 18,
        right: 22,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "#2a2620",
        color: "#fff",
        borderRadius: 999,
        padding: "6px 13px",
        fontSize: 14,
        fontWeight: 600,
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 2l2.94 6.26 6.56.9-4.82 4.66 1.2 6.78L12 17.9 6.12 21.6l1.2-6.78L2.5 9.16l6.56-.9L12 2z"
          fill="#fff"
        />
      </svg>
      {rating}/{of}
    </span>
  );
}

export function ReviewRowCard({ t, i = 0 }) {
  return (
    <figure
      style={{
        margin: 0,
        position: "relative",
        background: ROW_BG[i % ROW_BG.length],
        border: `2px solid ${INK}`,
        borderRadius: 16,
        boxShadow: "6px 8px 0 rgba(0,0,0,0.9)",
        padding: "20px 26px",
        paddingRight: 96,
        fontFamily: FONT,
        display: "flex",
        alignItems: "center",
        gap: 20,
        boxSizing: "border-box",
      }}
    >
      <RatingPill rating={t.rating ?? 5} />
      <span
        aria-hidden="true"
        style={{
          flex: "0 0 auto",
          width: 64,
          height: 64,
          borderRadius: 999,
          display: "grid",
          placeItems: "center",
          background: AVATAR_BG[i % AVATAR_BG.length],
          color: "#fff",
          fontSize: 28,
          fontWeight: 700,
        }}
      >
        {t.name.trim()[0]?.toUpperCase()}
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: INK, lineHeight: 1.15 }}>
          {t.name}
        </div>
        <div style={{ fontSize: 14.5, color: "#4a4a45", margin: "1px 0 6px" }}>
          {t.date || t.role || t.company}
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 14.5,
            lineHeight: 1.42,
            color: INK,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {t.text}
        </p>
      </div>
    </figure>
  );
}

// Container: a simple vertical list that grows as reviews are added.
export function ReviewRowTemplate({ testimonials = [] }) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {testimonials.map((t, i) => (
        <ReviewRowCard key={t.id ? `${t.id}-${i}` : i} t={t} i={i} />
      ))}
    </div>
  );
}
