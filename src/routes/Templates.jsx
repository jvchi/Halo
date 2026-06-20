import { sampleTestimonials } from "@/lib/testimonials";
import { AuroraTemplate } from "@/components/widget/templates/AuroraTemplate.jsx";
import { StickerTemplate } from "@/components/widget/templates/StickerTemplate.jsx";
import { ReviewRowTemplate } from "@/components/widget/templates/ReviewRowTemplate.jsx";

// Showcase for the standalone review templates. Each renders transparent, stackable
// cards from the approved testimonials — the frame just supplies a surface to sit on.
const approved = sampleTestimonials.filter((t) => t.status === "approved");
// Repeat the seed so the demo shows the cards stacking/wrapping as the set grows.
const many = Array.from({ length: 6 }, (_, i) => approved[i % approved.length]);

function Frame({ label, bg, children }) {
  return (
    <section>
      <h3
        style={{
          margin: "0 0 12px",
          padding: "0 4px",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#86868b",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {label}
      </h3>
      <div style={{ background: bg, borderRadius: 16, border: "1px solid #e5e5ea", padding: 32 }}>
        {children}
      </div>
    </section>
  );
}

export default function Templates() {
  return (
    <main
      style={{
        maxWidth: 1180,
        margin: "0 auto",
        padding: "48px 24px 96px",
        display: "grid",
        gap: 48,
      }}
    >
      <header style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 600, color: "#1d1d1f" }}>
          Review templates
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: 15, color: "#6e6e73" }}>
          Standalone, stackable cards rendered from your approved testimonials.
        </p>
      </header>

      <Frame label="Aurora — gradient bloom" bg="#f3f3f3">
        <AuroraTemplate testimonials={many} columns={3} />
      </Frame>

      <Frame label="Sticker — bordered cards" bg="#fafafa">
        <StickerTemplate testimonials={many} columns={3} />
      </Frame>

      <Frame label="Review rows — list" bg="#f6f7f4">
        <ReviewRowTemplate testimonials={approved} />
      </Frame>
    </main>
  );
}
