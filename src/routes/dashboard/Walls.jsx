import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { PageHeading } from "@/components/ui";
import { widgetPresets, getPreset } from "@/lib/presets";
import { useTestimonials } from "@/lib/testimonialsStore.jsx";
import { WallView } from "@/components/widget/WallView.jsx";
import { cardStyles } from "@/components/widget/templates/index.js";
import {
  Disclosure,
  Segmented,
  OptionList,
  SwatchGrid,
  Toggle,
  controlInputClass,
} from "@/components/dashboard/inspector.jsx";

const CARD_STYLE_OPTIONS = cardStyles.map((c) => ({ id: c.id, label: c.label }));
const COLUMN_OPTIONS = [2, 3, 4].map((n) => ({ id: n, label: `${n} columns` }));
const WALL_URL = "https://halo.app/w/halo";

// A wall always shows the full testimonial; the display toggles live in Widget
// Studio, not here.
const FULL_DISPLAY = { showAvatar: true, showCompany: true, showRating: true, showSource: true };

// The desktop preview renders at a realistic page width and scales to fit the
// panel, so column proportions stay truthful instead of clipping (matches the
// Widget Studio). Mobile renders 1:1 at a phone width.
const DESKTOP_WIDTH = 900;
const MOBILE_WIDTH = 390;
const CANVAS_PAD = 28;

export default function Walls() {
  const { approved } = useTestimonials();

  const [themeId, setThemeId] = useState("minimal-light");
  const [cardStyle, setCardStyle] = useState("default");
  const [columns, setColumns] = useState(3);
  const [device, setDevice] = useState("desktop");
  const [hero, setHero] = useState({
    title: "Loved by founders and teams",
    description: "Real words from the people who use Halo every day.",
    ctaLabel: "Start collecting",
    showCta: true,
    showLogo: true,
    workspace: "Halo",
  });
  const [open, setOpen] = useState({ hero: true });
  const [copied, setCopied] = useState(false);

  // Measure the canvas and scale the desktop preview to fit its real width.
  const canvasRef = useRef(null);
  const [fit, setFit] = useState(1);
  const frameWidth = device === "mobile" ? MOBILE_WIDTH : DESKTOP_WIDTH;
  useLayoutEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const update = () => setFit(Math.min(1, (el.clientWidth - CANVAS_PAD * 2) / frameWidth));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [frameWidth]);

  const theme = getPreset(themeId);
  const effectiveColumns = device === "mobile" ? 1 : columns;
  const config = {
    type: "masonry",
    theme,
    cardStyle,
    columns: effectiveColumns,
    display: FULL_DISPLAY,
    maxItems: 60,
  };

  const toggle = (key) => setOpen((o) => ({ ...o, [key]: !o[key] }));
  const setField = (key) => (e) => setHero((h) => ({ ...h, [key]: e.target.value }));
  const setFlag = (key) => (v) => setHero((h) => ({ ...h, [key]: v }));
  const cardStyleLabel = CARD_STYLE_OPTIONS.find((c) => c.id === cardStyle)?.label ?? "Default";

  function copyLink() {
    navigator.clipboard?.writeText(WALL_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="halo-page">
      <header className="halo-page-header">
        <PageHeading
          title="Walls"
          info="A hosted Wall of Love page showcasing your approved testimonials."
        />
        <button type="button" onClick={copyLink} className="halo-copy-button">
          {copied ? "Copied ✓" : "Copy wall link"}
        </button>
      </header>

      <div className="halo-studio-shell">
        {/* Preview first: the wall is the object the controls shape. */}
        <section className="halo-studio-preview" aria-label="Wall preview">
          <div className="halo-studio-preview-header">
            <p>
              {approved.length} testimonial{approved.length === 1 ? "" : "s"} · {cardStyleLabel} · {frameWidth}px
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
              <WallView config={config} testimonials={approved} hero={hero} />
            </div>
          </div>
        </section>

        {/* Controls — same inspector language as Widget Studio. */}
        <aside className="halo-studio-controls" aria-label="Wall settings">
          <div className="halo-studio-controls-header">
            <span>Wall settings</span>
            <p>Edit the hero and theme, then share the link.</p>
          </div>

          <Disclosure label="Hero" value={hero.title} open={open.hero} onToggle={() => toggle("hero")}>
            <div className="grid gap-2.5">
              <Toggle label="Show logo" checked={hero.showLogo} onChange={setFlag("showLogo")} />
              <label className="grid gap-1 text-[12px] text-halo-fg-3">
                Title
                <input className={controlInputClass} value={hero.title} onChange={setField("title")} />
              </label>
              <label className="grid gap-1 text-[12px] text-halo-fg-3">
                Description
                <textarea
                  className={cn(controlInputClass, "min-h-[64px] resize-y")}
                  value={hero.description}
                  onChange={setField("description")}
                />
              </label>
            </div>
          </Disclosure>

          <Disclosure label="Call to action" value={hero.showCta ? hero.ctaLabel : "Hidden"} open={open.cta} onToggle={() => toggle("cta")}>
            <div className="grid gap-2.5">
              <Toggle label="Show button" checked={hero.showCta} onChange={setFlag("showCta")} />
              <label className="grid gap-1 text-[12px] text-halo-fg-3">
                Button label
                <input className={controlInputClass} value={hero.ctaLabel} onChange={setField("ctaLabel")} />
              </label>
            </div>
          </Disclosure>

          <Disclosure label="Theme" value={theme.name} open={open.theme} onToggle={() => toggle("theme")}>
            <SwatchGrid presets={widgetPresets} value={themeId} onChange={setThemeId} />
          </Disclosure>

          <Disclosure label="Card style" value={cardStyleLabel} open={open.cardStyle} onToggle={() => toggle("cardStyle")}>
            <OptionList options={CARD_STYLE_OPTIONS} value={cardStyle} onChange={setCardStyle} />
          </Disclosure>

          <Disclosure label="Columns" value={String(columns)} open={open.columns} onToggle={() => toggle("columns")}>
            <OptionList options={COLUMN_OPTIONS} value={columns} onChange={setColumns} />
          </Disclosure>
        </aside>
      </div>
    </div>
  );
}
