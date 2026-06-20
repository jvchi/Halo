// Widget theme presets (blueprint §16). Each preset is the `style` half of a
// widget config — the WidgetRenderer turns it into CSS variables so the dashboard
// preview and the future public embed render identically. Layout type and the
// show/hide display flags are chosen separately in the Widget Studio.
export const widgetPresets = [
  { id: "minimal-light", name: "Minimal Light", accent: "#0071e3", background: "#ffffff", cardBackground: "#f5f5f7", textColor: "#1d1d1f", radius: 16, shadow: "none", fontFamily: "Inter, system-ui, sans-serif" },
  { id: "minimal-dark", name: "Minimal Dark", accent: "#2997ff", background: "#000000", cardBackground: "#101114", textColor: "#f4f4f5", radius: 16, shadow: "none", fontFamily: "Inter, system-ui, sans-serif" },
  { id: "linear-dark", name: "Linear Dark", accent: "#5b7cfa", background: "#08090c", cardBackground: "#101114", textColor: "#f4f4f5", radius: 14, shadow: "none", fontFamily: "Inter, system-ui, sans-serif" },
  { id: "stripe-clean", name: "Stripe Clean", accent: "#635bff", background: "#f6f9fc", cardBackground: "#ffffff", textColor: "#1a1f36", radius: 12, shadow: "none", fontFamily: "Inter, system-ui, sans-serif" },
  { id: "apple-glass", name: "Apple Glass", accent: "#0071e3", background: "#f5f5f7", cardBackground: "rgba(255,255,255,0.66)", textColor: "#1d1d1f", radius: 20, shadow: "none", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", glass: true },
  { id: "vercel-mono", name: "Vercel Mono", accent: "#111111", background: "#ffffff", cardBackground: "#ffffff", textColor: "#111111", radius: 10, shadow: "none", fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace" },
  { id: "notion-editorial", name: "Notion Editorial", accent: "#2f2f2f", background: "#ffffff", cardBackground: "#ffffff", textColor: "#37352f", radius: 8, shadow: "none", fontFamily: "Georgia, 'Times New Roman', serif" },
  { id: "saas-blue", name: "SaaS Blue", accent: "#3b82f6", background: "#eff4ff", cardBackground: "#ffffff", textColor: "#0f172a", radius: 16, shadow: "none", fontFamily: "Inter, system-ui, sans-serif" },
  { id: "warm-creator", name: "Warm Creator", accent: "#e8663d", background: "#fbf6f0", cardBackground: "#ffffff", textColor: "#3a2e26", radius: 18, shadow: "none", fontFamily: "Inter, system-ui, sans-serif" },
];

// Shadow keyword → CSS box-shadow. "soft" is tuned for dark surfaces (deeper,
// higher spread) where the light "subtle" shadow would be invisible.
export const shadowCss = {
  none: "none",
  subtle: "0 1px 2px rgba(17,17,19,0.04), 0 8px 24px rgba(17,17,19,0.07)",
  soft: "0 1px 3px rgba(0,0,0,0.28), 0 16px 40px rgba(0,0,0,0.4)",
};

export const getPreset = (id) =>
  widgetPresets.find((p) => p.id === id) ?? widgetPresets[0];
