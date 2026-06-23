// Workspace brand identity. This is the *customer's* brand — the name, logo, and
// accent colour shown on the surfaces their respondents and visitors see (the
// collection form, widgets, walls) — not Halo's own product chrome. Settings
// edits this; the form/studio/walls consume it. Same seam as the other stores:
// swap the default for a fetched `workspaces` row when a backend exists
// (docs/PRODUCT_BUILD_BLUEPRINT.md §10).

import { slugify } from "@/lib/forms";

export { slugify };

export const defaultBrand = {
  workspaceName: "Halo",
  slug: "halo",
  website: "halo.app",
  brandColor: "#0071e3",
  logoImage: null, // data/object URL once a logo is uploaded; null = monogram
};

// Curated starting palette so the colour control reads as branded swatches
// instead of a raw picker. Custom hex is still accepted alongside these.
export const brandColorPresets = [
  { name: "Halo Blue", value: "#0071e3" },
  { name: "Indigo", value: "#5856d6" },
  { name: "Violet", value: "#7c5cff" },
  { name: "Emerald", value: "#10b981" },
  { name: "Teal", value: "#0ea5a4" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Ink", value: "#111111" },
];

// First letter of the workspace name, for the fallback logo disc.
export function monogramOf(name) {
  return (name || "").trim().charAt(0).toUpperCase() || "•";
}

const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
export const isHex = (value) => HEX.test(value);

// Brand-token overrides for a scoped subtree. Setting these on a container
// recolours everything that reads --halo-primary (the form's stars, submit
// button, monogram) to the workspace accent — without touching the global
// dashboard chrome. Inline on the element so it wins over the :root P3 block.
export function brandCssVars(color) {
  return {
    "--halo-primary": color,
    "--halo-primary-soft": color,
    "--halo-primary-wash": `color-mix(in srgb, ${color} 16%, #fff)`,
    "--halo-primary-tint": `color-mix(in srgb, ${color} 6%, #fff)`,
    "--halo-blue-1": `color-mix(in srgb, ${color} 82%, #000)`,
    "--halo-focus": color,
  };
}

// A widget theme preset derived from the workspace accent, so the Widget Studio
// and Walls "consume the brand tokens" (ROADMAP Phase A) — new widgets start on
// brand instead of a generic preset. Mirrors the `style` shape in presets.js.
export function brandWidgetPreset(color) {
  return {
    id: "brand",
    name: "Brand",
    accent: color,
    background: "#ffffff",
    cardBackground: "#f5f5f7",
    textColor: "#1d1d1f",
    radius: 16,
    shadow: "none",
    fontFamily: "Inter, system-ui, sans-serif",
  };
}
