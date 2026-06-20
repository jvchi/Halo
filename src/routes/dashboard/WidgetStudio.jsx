import { useLayoutEffect, useRef, useState } from "react";
import { widgetPresets, getPreset } from "@/lib/presets";
import { useTestimonials } from "@/lib/testimonialsStore.jsx";
import { WidgetRenderer } from "@/components/widget/WidgetRenderer.jsx";
import { cardStyles, customCardStyleIds } from "@/components/widget/templates/index.js";
import { PageHeading } from "@/components/ui";
import { Disclosure, Segmented, Toggle, OptionList, SwatchGrid } from "@/components/dashboard/inspector.jsx";

const LAYOUTS = [
  { id: "single", label: "Single" },
  { id: "grid", label: "Grid" },
  { id: "masonry", label: "Masonry" },
  { id: "carousel", label: "Carousel" },
  { id: "marquee", label: "Marquee" },
];

const CARD_STYLE_OPTIONS = cardStyles.map((c) => ({ id: c.id, label: c.label }));

const COLUMN_LAYOUTS = new Set(["grid", "masonry"]);

// The desktop preview renders at a realistic embed width and is scaled down to
// fit the panel — so column proportions stay truthful instead of being crushed
// into the narrow studio column. Mobile renders 1:1 at a phone width.
const DESKTOP_WIDTH = 900;
const MOBILE_WIDTH = 390;
const CANVAS_PAD = 28;

const DISPLAY_OPTIONS = [
  { key: "showAvatar", label: "Avatar" },
  { key: "showCompany", label: "Role & company" },
  { key: "showRating", label: "Rating" },
  { key: "showSource", label: "Source badge" },
];

const EMBED_CODE = `<iframe src="https://halo.app/embed/WIDGET_ID" width="100%" style="border:0;" loading="lazy"></iframe>`;

export default function WidgetStudio() {
  const [themeId, setThemeId] = useState(widgetPresets[0].id);
  const [type, setType] = useState("grid");
  const [cardStyle, setCardStyle] = useState("default");
  const [columns, setColumns] = useState(3);
  const [device, setDevice] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches
      ? "mobile"
      : "desktop"
  );
  const [display, setDisplay] = useState({
    showAvatar: true,
    showCompany: true,
    showRating: true,
    showSource: true,
  });
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState({});

  // Measure the canvas and scale the desktop preview to fit its real width.
  const canvasRef = useRef(null);
  const [fit, setFit] = useState(1);
  const frameWidth = device === "mobile" ? MOBILE_WIDTH : DESKTOP_WIDTH;
  useLayoutEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const update = () => {
      const avail = el.clientWidth - CANVAS_PAD * 2;
      setFit(Math.min(1, avail / frameWidth));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [frameWidth]);

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
    <div className="halo-page">
      <header className="halo-page-header">
        <PageHeading
          title="Widget Studio"
          info="Design testimonial widgets visually — layout, theme, and display."
        />
        <button
          type="button"
          onClick={copyEmbed}
          className="halo-copy-button"
        >
          {copied ? "Copied ✓" : "Copy embed code"}
        </button>
      </header>

      <div className="halo-studio-shell">
        {/* Live preview stays first: the editor exists to shape this surface. */}
        <section className="halo-studio-preview" aria-label="Live widget preview">
          <div className="halo-studio-preview-header">
            <p>
              {layoutLabel} · {cardStyleLabel} · {frameWidth}px
              {fit < 0.999 ? ` · ${Math.round(fit * 100)}%` : ""}
            </p>
            <Segmented
              options={[
                { id: "desktop", label: "Desktop" },
                { id: "mobile", label: "Mobile" },
              ]}
              value={device}
              onChange={setDevice}
            />
          </div>
          <div
            ref={canvasRef}
            className="halo-studio-preview-canvas"
            style={{ background: theme.background }}
          >
            <div
              className="halo-studio-preview-inner"
              style={{ width: frameWidth, zoom: fit }}
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
        </section>

        {/* Controls — each group collapses so configuration stays secondary. */}
        <aside className="halo-studio-controls" aria-label="Widget controls">
          <div className="halo-studio-controls-header">
            <span>Controls</span>
            <p>Adjust the preview, then copy the embed.</p>
          </div>
          <Disclosure label="Preset" value={theme.name} open={open.preset} onToggle={() => toggle("preset")}>
            <SwatchGrid presets={widgetPresets} value={themeId} onChange={setThemeId} />
          </Disclosure>

          <Disclosure label="Card style" value={cardStyleLabel} open={open.cardStyle} onToggle={() => toggle("cardStyle")}>
            <OptionList options={CARD_STYLE_OPTIONS} value={cardStyle} onChange={setCardStyle} />
          </Disclosure>

          <Disclosure label="Layout" value={layoutLabel} open={open.layout} onToggle={() => toggle("layout")}>
            <OptionList options={LAYOUTS} value={type} onChange={setType} />
          </Disclosure>

          {showColumns && (
            <Disclosure label="Columns" value={String(columns)} open={open.columns} onToggle={() => toggle("columns")}>
              <OptionList
                options={[2, 3, 4].map((n) => ({ id: n, label: `${n} columns` }))}
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
              <div className="grid gap-2.5">
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
        </aside>
      </div>
    </div>
  );
}
