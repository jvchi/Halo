import { useState } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui";
import { WidgetStudioIcon } from "@/components/icons";
import { widgetPresets, getPreset } from "@/lib/presets";
import { useTestimonials } from "@/lib/testimonialsStore.jsx";
import { WidgetRenderer } from "@/components/widget/WidgetRenderer.jsx";
import { cardStyles, customCardStyleIds } from "@/components/widget/templates/index.js";

const LAYOUTS = [
  { id: "single", label: "Single" },
  { id: "grid", label: "Grid" },
  { id: "masonry", label: "Masonry" },
  { id: "carousel", label: "Carousel" },
  { id: "marquee", label: "Marquee" },
];

const CARD_STYLE_OPTIONS = cardStyles.map((c) => ({ id: c.id, label: c.label }));

const COLUMN_LAYOUTS = new Set(["grid", "masonry"]);

const DISPLAY_OPTIONS = [
  { key: "showAvatar", label: "Avatar" },
  { key: "showCompany", label: "Role & company" },
  { key: "showRating", label: "Rating" },
  { key: "showSource", label: "Source badge" },
];

const EMBED_CODE = `<iframe src="https://halo.app/embed/WIDGET_ID" width="100%" style="border:0;" loading="lazy"></iframe>`;

function Chevron({ open }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      className={cn("transition-transform duration-200", open && "rotate-180")}
      aria-hidden="true"
    >
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Collapsed by default — the header shows the current value so the whole config
// reads at a glance, and options only appear when the user opens a section.
function Disclosure({ label, value, open, onToggle, children }) {
  return (
    <div className="overflow-hidden rounded-md border border-halo-border-1">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 bg-halo-bg-1 px-3.5 py-3 text-left transition-colors hover:bg-halo-bg-3"
      >
        <span className="text-[13px] font-medium text-halo-fg-1">{label}</span>
        <span className="flex items-center gap-2 text-halo-fg-3">
          <span className="max-w-[130px] truncate text-[13px]">{value}</span>
          <Chevron open={open} />
        </span>
      </button>
      {open && (
        <div className="border-t border-halo-border-1 bg-halo-bg-3/40 p-3.5">{children}</div>
      )}
    </div>
  );
}

function Segmented({ options, value, onChange, wrap = false }) {
  return (
    <div className={cn("flex gap-1 rounded-md bg-halo-bg-3 p-1", wrap && "flex-wrap")}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            "rounded-[10px] px-3 py-1.5 text-[13px] font-medium transition-colors",
            wrap ? "flex-auto" : "flex-1",
            value === o.id
              ? "bg-halo-bg-1 text-halo-fg-1"
              : "text-halo-fg-2 hover:text-halo-fg-1"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between gap-3 text-[14px] text-halo-fg-1"
    >
      <span>{label}</span>
      <span
        className={cn(
          "relative h-[22px] w-[38px] shrink-0 rounded-pill transition-colors",
          checked ? "bg-halo-primary" : "bg-halo-bg-4"
        )}
      >
        <span
          className={cn(
            "absolute top-[2px] h-[18px] w-[18px] rounded-pill bg-white transition-[left] duration-[180ms] ease-snappy",
            checked ? "left-[18px]" : "left-[2px]"
          )}
        />
      </span>
    </button>
  );
}

function PresetSwatch({ preset, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "grid gap-2 rounded-md border p-2.5 text-left transition-colors",
        active
          ? "border-halo-primary bg-halo-primary-wash"
          : "border-halo-border-1 hover:border-halo-border-2"
      )}
    >
      <span
        className="flex h-9 items-center gap-1.5 rounded-[10px] px-2"
        style={{ background: preset.background }}
      >
        <span
          className="h-4 w-4 rounded-full"
          style={{ background: preset.accent }}
        />
        <span
          className="h-3.5 flex-1 rounded-full"
          style={{ background: preset.cardBackground, border: "1px solid rgba(127,127,127,0.18)" }}
        />
      </span>
      <span className="text-[12px] font-medium text-halo-fg-2">{preset.name}</span>
    </button>
  );
}

export default function WidgetStudio() {
  const [themeId, setThemeId] = useState(widgetPresets[0].id);
  const [type, setType] = useState("grid");
  const [cardStyle, setCardStyle] = useState("default");
  const [columns, setColumns] = useState(3);
  const [device, setDevice] = useState("desktop");
  const [display, setDisplay] = useState({
    showAvatar: true,
    showCompany: true,
    showRating: true,
    showSource: true,
  });
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState({});

  const { approved } = useTestimonials();
  const theme = getPreset(themeId);
  const isCustomStyle = customCardStyleIds.has(cardStyle);
  const showColumns = COLUMN_LAYOUTS.has(type);
  const effectiveColumns = device === "mobile" ? 1 : columns;
  const config = { type, theme, cardStyle, columns: effectiveColumns, display, maxItems: 12 };

  const toggle = (key) => setOpen((o) => ({ ...o, [key]: !o[key] }));
  const layoutLabel = LAYOUTS.find((l) => l.id === type)?.label ?? "Grid";
  const cardStyleLabel = CARD_STYLE_OPTIONS.find((c) => c.id === cardStyle)?.label ?? "Default";
  const shownCount = Object.values(display).filter(Boolean).length;

  function copyEmbed() {
    navigator.clipboard?.writeText(EMBED_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-md bg-halo-bg-3">
          <WidgetStudioIcon size={28} />
        </div>
        <div className="grid gap-1">
          <h1 className="m-0 text-[26px] font-medium tracking-[-0.02em] text-halo-fg-1">
            Widget Studio
          </h1>
          <p className="m-0 text-[15px] text-halo-fg-2">
            Design testimonial widgets visually — layout, theme, and display.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={copyEmbed}
          className="ml-auto max-md:w-full"
        >
          {copied ? "Copied ✓" : "Copy embed code"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Controls — each group collapses into a toggle menu so the panel stays
            quiet; the headers show the current value without expanding. */}
        <div className="grid content-start gap-2.5">
          <Disclosure label="Preset" value={theme.name} open={open.preset} onToggle={() => toggle("preset")}>
            <div className="grid grid-cols-2 gap-2">
              {widgetPresets.map((p) => (
                <PresetSwatch
                  key={p.id}
                  preset={p}
                  active={p.id === themeId}
                  onClick={() => setThemeId(p.id)}
                />
              ))}
            </div>
          </Disclosure>

          <Disclosure label="Card style" value={cardStyleLabel} open={open.cardStyle} onToggle={() => toggle("cardStyle")}>
            <Segmented options={CARD_STYLE_OPTIONS} value={cardStyle} onChange={setCardStyle} wrap />
          </Disclosure>

          <Disclosure label="Layout" value={layoutLabel} open={open.layout} onToggle={() => toggle("layout")}>
            <Segmented options={LAYOUTS} value={type} onChange={setType} wrap />
          </Disclosure>

          {showColumns && (
            <Disclosure label="Columns" value={String(columns)} open={open.columns} onToggle={() => toggle("columns")}>
              <Segmented
                options={[2, 3, 4].map((n) => ({ id: n, label: String(n) }))}
                value={columns}
                onChange={setColumns}
              />
            </Disclosure>
          )}

          {isCustomStyle ? (
            <p className="px-1 text-[12px] leading-relaxed text-halo-fg-3">
              The {cardStyleLabel} card style has its own fixed design — the display
              toggles don&rsquo;t apply.
            </p>
          ) : (
            <Disclosure label="Display" value={`${shownCount} of 4 shown`} open={open.display} onToggle={() => toggle("display")}>
              <div className="grid gap-3.5">
                {DISPLAY_OPTIONS.map((o) => (
                  <Toggle
                    key={o.key}
                    label={o.label}
                    checked={display[o.key]}
                    onChange={(v) => setDisplay((d) => ({ ...d, [o.key]: v }))}
                  />
                ))}
              </div>
            </Disclosure>
          )}
        </div>

        {/* Live preview */}
        <div className="grid content-start gap-3 rounded-xl border border-halo-border-1 bg-halo-bg-3/40 p-3">
          <div className="flex items-center justify-between px-2 pt-1">
            <span className="text-[12px] font-medium uppercase tracking-[0.04em] text-halo-fg-3">
              Live preview
            </span>
            <Segmented
              options={[
                { id: "desktop", label: "Desktop" },
                { id: "mobile", label: "Mobile" },
              ]}
              value={device}
              onChange={setDevice}
            />
          </div>
          <div className="overflow-auto rounded-lg" style={{ background: theme.background }}>
            <div
              className="mx-auto p-6 transition-[max-width] duration-[260ms] ease-snappy"
              style={{ maxWidth: device === "mobile" ? 390 : "100%" }}
            >
              {approved.length === 0 ? (
                <div
                  className="grid place-items-center px-4 py-10 text-center"
                  style={{ color: theme.textColor }}
                >
                  <img
                    src="/illustrations/empty-widget-preview.png"
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-[min(220px,70vw)] max-w-full object-contain"
                  />
                  <p className="m-0 mt-3 text-[15px] font-medium">No approved testimonials yet.</p>
                </div>
              ) : (
                <WidgetRenderer config={config} testimonials={approved} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
