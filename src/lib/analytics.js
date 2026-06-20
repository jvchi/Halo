// Deterministic mock analytics. Frontend-only for now; when a backend exists
// this is replaced by aggregated `analytics_daily` rows (blueprint §6.13). The
// seed keeps the series stable across re-renders (no jitter on every paint).
const seeded = (i) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const RANGES = [
  { id: 7, label: "7 days" },
  { id: 30, label: "30 days" },
  { id: 90, label: "90 days" },
];

const fmtDate = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
const sum = (a) => a.reduce((s, x) => s + x, 0);
const pct = (c, p) => (p ? Math.round(((c - p) / p) * 100) : 0);

// Build a current + previous window so trend deltas are real comparisons.
export function buildAnalytics(range, approved = []) {
  const n = range;
  const base = 90;
  const amp = 55;
  const growth = range <= 7 ? 6 : 1.4;

  const raw = [];
  for (let i = 0; i < 2 * n; i++) {
    const v = base + growth * i + amp * Math.sin(i / Math.max(3, n / 9)) + (seeded(i) - 0.5) * amp * 1.1;
    raw.push(Math.max(8, Math.round(v)));
  }
  const prev = raw.slice(0, n);
  const curr = raw.slice(n);

  const views = sum(curr);
  const prevViews = sum(prev);
  const clicks = Math.round(views * 0.17);
  const prevClicks = Math.round(prevViews * 0.19);
  const wallViews = Math.round(views * 0.42);
  const prevWall = Math.round(prevViews * 0.38);
  const conversions = Math.round(clicks * 0.23);
  const prevConv = Math.round(prevClicks * 0.2);

  const today = new Date();
  const dateAt = (i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (n - 1 - i));
    return d;
  };
  const tickCount = Math.min(4, n);
  const ticks = Array.from({ length: tickCount }, (_, k) => {
    const i = Math.round((k * (n - 1)) / Math.max(1, tickCount - 1));
    return { i, label: fmtDate(dateAt(i)) };
  });

  const metrics = [
    { key: "views", label: "Widget views", value: views, delta: pct(views, prevViews), series: curr },
    { key: "clicks", label: "CTA clicks", value: clicks, delta: pct(clicks, prevClicks), series: curr.map((v) => Math.round(v * 0.17)) },
    { key: "wall", label: "Wall views", value: wallViews, delta: pct(wallViews, prevWall), series: curr.map((v) => Math.round(v * 0.42)) },
    { key: "conv", label: "Conversions", value: conversions, delta: pct(conversions, prevConv), series: curr.map((v) => Math.round(v * 0.04) + 1) },
  ];

  // Activity-ring style goal progress. Two-stop hue gradients per ring.
  const rings = [
    { label: "Views goal", value: views, goal: Math.round(views * 1.25), color: "var(--halo-primary)", color2: "var(--halo-primary-soft)" },
    { label: "Click goal", value: clicks, goal: Math.round(clicks * 1.4), color: "var(--halo-teal)", color2: "var(--halo-primary-soft)" },
    { label: "Conversion goal", value: conversions, goal: Math.round(conversions * 1.65), color: "var(--halo-green)", color2: "#7be39a" },
  ];

  const sources = [
    ["X", "x"],
    ["LinkedIn", "linkedin"],
    ["Google", "google"],
    ["Form", "form"],
  ]
    .map(([label], k) => ({ label, value: Math.round(views * (0.12 + seeded(k + 1) * 0.18)) }))
    .sort((a, b) => b.value - a.value);

  const topTestimonials = approved
    .map((t, k) => ({
      id: t.id,
      name: t.name,
      company: t.company,
      views: 40 + Math.round(seeded(k + 3) * (views * 0.06)),
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return { series: curr, ticks, metrics, rings, sources, topTestimonials };
}
