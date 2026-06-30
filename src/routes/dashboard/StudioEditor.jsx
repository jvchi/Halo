import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import { HaloIcon } from "@/components/dashboard/HaloIcon.jsx";
import { useTestimonials } from "@/lib/testimonialsStore.jsx";
import { useBrand } from "@/lib/brandStore.jsx";
import { brandWidgetPreset } from "@/lib/brand";
import { widgetPresets } from "@/lib/presets";
import { WidgetRenderer } from "@/components/widget/WidgetRenderer.jsx";
import { WallView } from "@/components/widget/WallView.jsx";
import { cardStyles, customCardStyleIds } from "@/components/widget/templates/index.js";
import {
  Disclosure,
  Segmented,
  OptionList,
  SwatchGrid,
  Toggle,
  deviceOptions,
} from "@/components/dashboard/inspector.jsx";
import { useStudio } from "@/lib/studioStore.js";

const assetMeta = {
  widgets: { label: "Widget", plural: "Widgets", icon: "widget", kind: "widget" },
  walls: { label: "Wall of Love", plural: "Walls of Love", icon: "walls", kind: "wall" },
};

// A studio template is just a starting point: it seeds the layout + card style,
// then the live inspector takes over. Keyed by the slug the gallery navigates to.
const WIDGET_TEMPLATE_PRESETS = {
  grid: { type: "grid", cardStyle: "default", columns: 3 },
  masonry: { type: "masonry", cardStyle: "default", columns: 3 },
  carousel: { type: "carousel", cardStyle: "default", columns: 3 },
  marquee: { type: "marquee", cardStyle: "default", columns: 3 },
  "single-card": { type: "single", cardStyle: "default", columns: 1 },
  "review-rows": { type: "grid", cardStyle: "rows", columns: 2 },
  "aurora-cards": { type: "grid", cardStyle: "aurora", columns: 3 },
  "sticker-wall": { type: "masonry", cardStyle: "sticker", columns: 3 },
};

const WALL_TEMPLATE_PRESETS = {
  "minimal-wall": { themeId: "minimal-light", cardStyle: "default", columns: 3 },
  "launch-wall": { themeId: "saas-blue", cardStyle: "default", columns: 3 },
  "masonry-wall": { themeId: "minimal-light", cardStyle: "default", columns: 3 },
  "hero-wall": { themeId: "apple-glass", cardStyle: "default", columns: 3 },
  "dark-wall": { themeId: "minimal-dark", cardStyle: "default", columns: 3 },
};

const LAYOUT_OPTIONS = [
  { id: "grid", label: "Grid" },
  { id: "masonry", label: "Masonry" },
  { id: "carousel", label: "Carousel" },
  { id: "marquee", label: "Marquee" },
  { id: "single", label: "Single" },
];
const LAYOUT_LABELS = Object.fromEntries(LAYOUT_OPTIONS.map((o) => [o.id, o.label]));
const CARD_STYLE_OPTIONS = cardStyles.map((c) => ({ id: c.id, label: c.label }));
const COLUMN_OPTIONS = [2, 3, 4].map((n) => ({ id: n, label: `${n} columns` }));
const MAX_OPTIONS = [6, 9, 12, 24].map((n) => ({ id: n, label: `${n} testimonials` }));

// The desktop preview renders at a realistic page width and scales to fit the
// panel so column proportions stay truthful; mobile renders 1:1 at a phone
// width. Same measurement approach as Walls.jsx.
const DESKTOP_WIDTH = 900;
const MOBILE_WIDTH = 390;
const CANVAS_PAD = 28;

function humanizeSlug(value) {
  return (value || "untitled")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// Branded checkbox (box fills primary with a white check) — the manual proof
// list never uses a native control. The pop animation stays inside its own box.
function AnimatedCheckbox({ checked, onChange }) {
  return (
    <span className="halo-editor-checkbox" data-no-fill>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="halo-editor-checkbox-visual" aria-hidden="true">
        <AnimatePresence initial={false}>
          {checked ? (
            <motion.svg
              key="checked"
              viewBox="0 0 16 16"
              initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            >
              <path d="m4 8.25 2.5 2.5L12 5.5" />
            </motion.svg>
          ) : null}
        </AnimatePresence>
      </span>
    </span>
  );
}

export default function StudioEditor() {
  const { assetType, assetId } = useParams();
  const meta = assetMeta[assetType];
  const isWall = assetType === "walls";
  const { approved } = useTestimonials();
  const { brand } = useBrand();
  const studio = useStudio();

  // The workspace accent leads the theme list so a new asset starts on-brand.
  const presets = useMemo(
    () => [brandWidgetPreset(brand.brandColor), ...widgetPresets],
    [brand.brandColor]
  );

  const existing = studio.assets.find(
    (asset) =>
      asset.kind === (isWall ? "wall" : "widget") &&
      (asset.id === assetId || asset.slug === assetId)
  );
  const existingConfig = existing?.config ?? {};

  // Seed from the saved record when editing, otherwise from the template preset.
  const seed = isWall
    ? WALL_TEMPLATE_PRESETS[assetId] ?? { themeId: "brand", cardStyle: "default", columns: 3 }
    : WIDGET_TEMPLATE_PRESETS[assetId] ?? { type: "grid", cardStyle: "default", columns: 3 };

  const [name, setName] = useState(
    existing?.name ?? (isWall ? "Wall of Love" : humanizeSlug(assetId))
  );
  const [layoutType, setLayoutType] = useState(existingConfig.type ?? seed.type ?? "grid");
  const [themeId, setThemeId] = useState(
    existingConfig.theme?.id ?? seed.themeId ?? "brand"
  );
  const [cardStyle, setCardStyle] = useState(existingConfig.cardStyle ?? seed.cardStyle ?? "default");
  const [columns, setColumns] = useState(existingConfig.columns ?? seed.columns ?? 3);
  const [maxItems, setMaxItems] = useState(existingConfig.maxItems ?? 12);
  const [display, setDisplay] = useState(
    existingConfig.display ?? {
      showAvatar: true,
      showCompany: true,
      showRating: true,
      showSource: true,
    }
  );
  const [hero, setHero] = useState(
    existingConfig.hero ?? {
      title: "Loved by founders and teams",
      description: `Real words from the people who use ${brand.workspaceName} every day.`,
      ctaLabel: "Start collecting",
      showHeader: true,
      showCta: true,
      showLogo: true,
      workspace: brand.workspaceName,
    }
  );

  // Proof selection: auto-include every approved testimonial by default, or
  // hand-pick a set. Manual selection seeds from the saved ids.
  const savedIds = existing?.testimonialIds ?? [];
  const [autoInclude, setAutoInclude] = useState(
    existing ? savedIds.length === 0 || savedIds.length >= approved.length : true
  );
  const [selected, setSelected] = useState(
    () => new Set(savedIds.length ? savedIds : approved.slice(0, 6).map((item) => item.id))
  );

  const [device, setDevice] = useState("desktop");
  const [controlsOpen, setControlsOpen] = useState(false);
  const [open, setOpen] = useState({ layout: !isWall });
  const [recordId, setRecordId] = useState(existing?.id ?? null);
  const [status, setStatus] = useState(existing?.status ?? "draft");
  const [assetSlug] = useState(
    () => existing?.slug ?? `${slugify(assetId) || (isWall ? "wall" : "widget")}-${Math.random().toString(36).slice(2, 7)}`
  );
  const [message, setMessage] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState("");

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

  const theme = presets.find((p) => p.id === themeId) ?? presets[0];
  const proofItems = autoInclude ? approved : approved.filter((t) => selected.has(t.id));
  const effectiveColumns = device === "mobile" ? 1 : columns;
  const isCustomCard = customCardStyleIds.has(cardStyle);

  const config = {
    type: isWall ? "masonry" : layoutType,
    theme,
    cardStyle,
    columns: effectiveColumns,
    display,
    maxItems: isWall ? 60 : maxItems,
  };

  const publicPath = isWall ? `/walls/${assetSlug}` : `/embed/widgets/${assetSlug}`;
  const publicUrl = `https://halo.app${publicPath}`;
  const embedId = `halo-${assetSlug}`;
  const embedCode = `<iframe id="${embedId}" src="${publicUrl}" title="${name}" loading="lazy" style="width:100%;border:0" data-halo-embed></iframe><script>window.addEventListener("message",function(e){if(e.data&&e.data.type==="halo:resize"&&e.data.slug==="${assetSlug}"){document.getElementById("${embedId}").style.height=e.data.height+"px"}})</script>`;

  const toggleSection = (key) => setOpen((o) => ({ ...o, [key]: !o[key] }));
  const setHeroField = (key, value) => setHero((h) => ({ ...h, [key]: value }));
  const setFlag = (key) => (value) => setHero((h) => ({ ...h, [key]: value }));
  const setDisplayFlag = (key) => (value) => setDisplay((d) => ({ ...d, [key]: value }));

  function toggleProof(id) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Build the persisted record. Stored config mirrors what /embed/widgets/:slug
  // and /walls/:slug consume, so the public render matches this preview exactly.
  async function persist(publish = false, { silent = false } = {}) {
    const testimonialIds = autoInclude ? approved.map((t) => t.id) : [...selected];
    const nextStatus = publish ? "published" : status;
    if (!silent) setMessage("Saving…");
    try {
      const saved = await studio.saveAsset({
        ...(recordId ? { id: recordId } : {}),
        kind: meta.kind,
        name: name || humanizeSlug(assetId),
        slug: assetSlug,
        status: nextStatus,
        folderId: existing?.folderId ?? studio.folders[0]?.id ?? null,
        isPrimary: false,
        testimonialIds,
        config: {
          type: isWall ? "masonry" : layoutType,
          theme,
          cardStyle,
          columns,
          maxItems: isWall ? 60 : maxItems,
          display,
          ...(isWall ? { hero } : {}),
        },
      });
      setRecordId(saved.id);
      setStatus(saved.status);
      setMessage("Saved");
      setTimeout(() => setMessage(""), 1500);
      return saved;
    } catch (saveError) {
      setMessage(saveError.message || "Could not save");
      setTimeout(() => setMessage(""), 2200);
      return null;
    }
  }

  // Debounced autosave. The latest persist closure is held in a ref so the
  // effect can stay keyed to a content signature without stale state. The first
  // run (initial hydration) is skipped so merely opening a template doesn't
  // create a record — the record is created on the first real edit or Save.
  const persistRef = useRef(persist);
  persistRef.current = persist;
  const hydratedRef = useRef(false);
  const signature = JSON.stringify({
    name,
    layoutType,
    themeId,
    cardStyle,
    columns,
    maxItems,
    display,
    autoInclude,
    ids: [...selected],
    hero: isWall ? hero : null,
  });
  useEffect(() => {
    if (!hydratedRef.current) {
      hydratedRef.current = true;
      return;
    }
    const timer = setTimeout(() => persistRef.current?.(false, { silent: true }), 600);
    return () => clearTimeout(timer);
  }, [signature]);

  if (!meta) return <Navigate to="/dashboard/studio" replace />;

  function saveChanges() {
    persist(false);
  }

  async function shareAsset() {
    const saved = await persist(true);
    if (!saved) return;
    setShareOpen(true);
    setOpen((o) => ({ ...o, share: true }));
  }

  function copy(kind, value) {
    navigator.clipboard?.writeText(value);
    setCopied(kind);
    setTimeout(() => setCopied(""), 1500);
  }

  function selectAll() {
    setSelected(new Set(approved.map((t) => t.id)));
  }

  return (
    <div className="halo-page">
      <header className="halo-editor-topbar">
        <Link to={`/dashboard/studio?mode=${assetType}`} className="halo-copy-button">
          <HaloIcon name="arrowRight" size={15} />
          {meta.plural}
        </Link>
        <div>
          <span>{meta.label}{status === "published" ? " · Live" : ""}</span>
          <strong>{name || humanizeSlug(assetId)}</strong>
        </div>
        <div className="halo-editor-topbar-actions">
          {message ? <em>{message}</em> : null}
          <button type="button" className="halo-copy-button" onClick={saveChanges}>
            Save changes
          </button>
          <button type="button" className="halo-copy-button is-primary" onClick={shareAsset}>
            Share
          </button>
        </div>
      </header>

      <div className="halo-studio-shell">
        {/* Preview first: the live widget is the object the controls shape. */}
        <section className="halo-studio-preview" aria-label={`${meta.label} preview`}>
          <div className="halo-studio-preview-header">
            <div className="halo-studio-preview-actions">
              <button
                type="button"
                className="halo-studio-controls-toggle"
                aria-controls="studio-settings"
                aria-expanded={controlsOpen}
                onClick={() => setControlsOpen((value) => !value)}
              >
                Settings
              </button>
            </div>
          </div>
          <div
            ref={canvasRef}
            className={cn(
              "halo-studio-preview-canvas",
              isWall ? "halo-wall-preview-canvas" : "halo-widget-preview-canvas"
            )}
            style={{ background: theme.background }}
          >
            <div className="halo-studio-preview-inner" style={{ width: frameWidth, zoom: fit }}>
              {isWall ? (
                <WallView
                  config={config}
                  testimonials={proofItems}
                  hero={hero}
                  compact
                  editable
                  topAligned
                  onHeroChange={setHeroField}
                />
              ) : (
                <WidgetRenderer config={config} testimonials={proofItems} />
              )}
            </div>
          </div>
        </section>

        <button
          type="button"
          className={cn("halo-studio-controls-scrim", controlsOpen && "is-open")}
          aria-label={`Close ${meta.label} settings`}
          onClick={() => setControlsOpen(false)}
        />

        {/* Controls — the shared branded inspector language. */}
        <aside
          id="studio-settings"
          className={cn("halo-studio-controls", controlsOpen && "is-open")}
          aria-label={`${meta.label} settings`}
        >
          <div className="halo-studio-device-control" aria-label="Preview size">
            <Segmented options={deviceOptions} value={device} onChange={setDevice} />
          </div>
          <div className="halo-studio-controls-header">
            <div>
              <span>Settings</span>
            </div>
            <button
              type="button"
              className="halo-studio-controls-close"
              onClick={() => setControlsOpen(false)}
            >
              Close
            </button>
          </div>

          <label className="halo-studio-name-field">
            <span>{meta.label} name</span>
            <input
              className="halo-field"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={meta.label}
            />
          </label>

          {isWall ? (
            <div className="halo-wall-quick-controls" aria-label="Wall visibility">
              <Toggle label="Header" checked={hero.showHeader} onChange={setFlag("showHeader")} />
              <Toggle label="Button" checked={hero.showCta} onChange={setFlag("showCta")} />
            </div>
          ) : null}

          {!isWall ? (
            <Disclosure
              label="Layout"
              value={LAYOUT_LABELS[layoutType] ?? "Grid"}
              open={open.layout}
              onToggle={() => toggleSection("layout")}
            >
              <OptionList options={LAYOUT_OPTIONS} value={layoutType} onChange={setLayoutType} />
            </Disclosure>
          ) : null}

          <Disclosure label="Theme" value={theme.name} open={open.theme} onToggle={() => toggleSection("theme")}>
            <SwatchGrid presets={presets} value={themeId} onChange={setThemeId} />
          </Disclosure>

          <Disclosure
            label="Card style"
            value={CARD_STYLE_OPTIONS.find((c) => c.id === cardStyle)?.label ?? "Default"}
            open={open.cardStyle}
            onToggle={() => toggleSection("cardStyle")}
          >
            <OptionList options={CARD_STYLE_OPTIONS} value={cardStyle} onChange={setCardStyle} />
          </Disclosure>

          {layoutType !== "single" ? (
            <Disclosure
              label="Columns"
              value={String(columns)}
              open={open.columns}
              onToggle={() => toggleSection("columns")}
            >
              <OptionList options={COLUMN_OPTIONS} value={columns} onChange={setColumns} />
            </Disclosure>
          ) : null}

          {!isWall && layoutType !== "single" ? (
            <Disclosure
              label="Max testimonials"
              value={String(maxItems)}
              open={open.maxItems}
              onToggle={() => toggleSection("maxItems")}
            >
              <OptionList options={MAX_OPTIONS} value={maxItems} onChange={setMaxItems} />
            </Disclosure>
          ) : null}

          {!isWall && !isCustomCard ? (
            <Disclosure
              label="Display"
              value={`${[display.showAvatar && "Avatar", display.showRating && "Rating"].filter(Boolean).join(", ") || "Minimal"}`}
              open={open.display}
              onToggle={() => toggleSection("display")}
            >
              <div className="halo-wall-quick-controls">
                <Toggle label="Avatar" checked={display.showAvatar} onChange={setDisplayFlag("showAvatar")} />
                <Toggle label="Rating" checked={display.showRating} onChange={setDisplayFlag("showRating")} />
                <Toggle label="Company" checked={display.showCompany} onChange={setDisplayFlag("showCompany")} />
                <Toggle label="Source" checked={display.showSource} onChange={setDisplayFlag("showSource")} />
              </div>
            </Disclosure>
          ) : null}

          <Disclosure
            label="Testimonials"
            value={autoInclude ? `All approved (${approved.length})` : `${selected.size} selected`}
            open={open.proof}
            onToggle={() => toggleSection("proof")}
          >
            <div className="halo-editor-proof-controls">
              <div className="halo-wall-quick-controls">
                <Toggle label="Auto-include all approved" checked={autoInclude} onChange={setAutoInclude} />
              </div>
              {!autoInclude ? (
                <>
                  <div className="halo-editor-proof-bar">
                    <small>{selected.size} of {approved.length} selected</small>
                    <button type="button" className="halo-text-button" data-no-fill onClick={selectAll}>
                      Select all
                    </button>
                  </div>
                  <div className="halo-editor-proof-list">
                    {approved.map((testimonial) => (
                      <label key={testimonial.id}>
                        <AnimatedCheckbox
                          checked={selected.has(testimonial.id)}
                          onChange={() => toggleProof(testimonial.id)}
                        />
                        <span className="halo-editor-proof-avatar">{testimonial.name.slice(0, 1)}</span>
                        <strong>{testimonial.name}</strong>
                        <small>{testimonial.company || testimonial.source}</small>
                      </label>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </Disclosure>

          <Disclosure
            label="Share"
            value={status === "published" ? "Live" : "Draft"}
            open={open.share || shareOpen}
            onToggle={() => toggleSection("share")}
          >
            <div className="halo-editor-share">
              <label>
                Public URL
                <input className="halo-field font-mono" readOnly value={publicUrl} />
              </label>
              <button type="button" className="halo-copy-button" onClick={() => copy("link", publicUrl)}>
                <HaloIcon name="copy" size={15} />
                {copied === "link" ? "Copied ✓" : "Copy link"}
              </button>
              {!isWall ? (
                <button type="button" className="halo-copy-button" onClick={() => copy("embed", embedCode)}>
                  <HaloIcon name="code" size={15} />
                  {copied === "embed" ? "Copied ✓" : "Copy embed code"}
                </button>
              ) : null}
            </div>
          </Disclosure>
        </aside>
      </div>
    </div>
  );
}
