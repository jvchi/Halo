import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/cn";
import { HaloIcon } from "@/components/dashboard/HaloIcon.jsx";
import { useTestimonials } from "@/lib/testimonialsStore.jsx";
import { useStudio } from "@/lib/studioStore.js";

// The studio ships two creation surfaces that have a real editor behind them.
// Future content formats (sizzle reels, social videos, popups, video embeds,
// images) are tracked in docs/PRODUCT_BUILD_BLUEPRINT.md §6.6 and will return
// here once each has a working editor — not as empty galleries.
const studioModes = [
  { id: "saved", label: "Saved", icon: "copy" },
  { id: "widgets", label: "Widgets", icon: "widget" },
  { id: "walls", label: "Walls of Love", icon: "walls" },
];

const studioModeIds = new Set(studioModes.map((mode) => mode.id));

function normalizeMode(value, fallback = "saved") {
  return studioModeIds.has(value) ? value : fallback;
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const modeMeta = {
  saved: {
    title: "Your Saved",
    copy: "All the widgets and Walls of Love you save will show up here.",
  },
  widgets: {
    title: "Widgets",
    copy: "Embed testimonials on your website without code.",
    // Each template is a real starting point: the editor maps it to a layout +
    // card style (see WIDGET_TEMPLATE_PRESETS in StudioEditor.jsx) and the live
    // WidgetRenderer takes it from there.
    templates: [
      "Grid",
      "Masonry",
      "Carousel",
      "Marquee",
      "Single Card",
      "Review Rows",
      "Aurora Cards",
      "Sticker Wall",
    ],
  },
  walls: {
    title: "Walls of Love",
    copy: "Create a beautiful, shareable Wall of Love with your best testimonials.",
    templates: ["Minimal Wall", "Launch Wall", "Masonry Wall", "Hero Wall", "Dark Wall"],
  },
};

function StudioPreview({ mode, approved }) {
  const names = approved.slice(0, 3).map((item) => item.name);
  const fallback = ["Ari", "Maya", "Noah"];
  const people = names.length ? names : fallback;

  if (mode === "walls") {
    return (
      <div className="halo-studio-template-preview is-walls">
        <div className="halo-template-wall-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="halo-studio-template-preview is-widgets">
      <div className="halo-template-quote-row">
        {people.map((name, index) => (
          <span key={`${name}-${index}`}>{name.slice(0, 1)}</span>
        ))}
      </div>
      <div className="halo-template-lines">
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

function TemplateCard({ mode, template, onUse, approved }) {
  return (
    <button
      type="button"
      className="halo-studio-template-card"
      onClick={() => onUse(template)}
    >
      <StudioPreview mode={mode} approved={approved} />
      <span>
        <strong>{template}</strong>
      </span>
    </button>
  );
}

export default function Studio({ initialMode = "saved" }) {
  const { approved } = useTestimonials();
  const studio = useStudio();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const modeParam = searchParams.get("mode");
  const [mode, setMode] = useState(() => normalizeMode(searchParams.get("mode"), initialMode));
  const [folderDraft, setFolderDraft] = useState("");
  const folders = studio.folders.map((folder) => folder.name);
  const saved = studio.assets.map((asset) => ({
    ...asset,
    type: asset.kind === "wall" ? "Walls of Love" : "Widgets",
    mode: asset.kind === "wall" ? "walls" : "widgets",
    folder:
      studio.folders.find((folder) => folder.id === asset.folderId)?.name ??
      "Default",
  }));

  useEffect(() => {
    const nextMode = normalizeMode(modeParam, initialMode);
    setMode((current) => (current === nextMode ? current : nextMode));
  }, [initialMode, modeParam]);

  const meta = modeMeta[mode];
  const templates = mode === "saved" ? [] : meta.templates ?? [];

  async function createFolder() {
    const next = folderDraft.trim();
    if (!next) return;
    try {
      await studio.createFolder(next);
      setFolderDraft("");
    } catch {
      // The existing field remains populated so the user can edit and retry.
    }
  }

  function selectMode(nextMode) {
    setMode(nextMode);
    setSearchParams(nextMode === "saved" ? {} : { mode: nextMode });
  }

  // A template is a starting point; the real editor opens at a stable slug and
  // creates the record on first save.
  function createDraft(template) {
    navigate(`/dashboard/studio/${mode}/${slugify(template) || "untitled"}`);
  }

  return (
    <div className="halo-studio-page">
      <section className="halo-studio-hero" aria-label="Social proof studio">
        <div>
          <h1>Social Proof Studio</h1>
          <p>What would you like to create?</p>
        </div>
        <nav className="halo-studio-mode-bar" aria-label="Studio creation modes">
          {studioModes.map((item) => (
            <button
              key={item.id}
              type="button"
              className={cn(mode === item.id && "is-active")}
              onClick={() => selectMode(item.id)}
            >
              <HaloIcon name={item.icon} size={16} tinted />
              {item.label}
            </button>
          ))}
        </nav>
      </section>

      <section className="halo-studio-library" aria-label={meta.title}>
        <header className="halo-studio-section-head">
          <div>
            <h2>{meta.title}</h2>
            <p>{meta.copy}</p>
          </div>
          {mode === "saved" ? (
            <div className="halo-studio-library-actions">
              <div className="halo-studio-folder-field">
                <input
                  className="halo-field"
                  value={folderDraft}
                  onChange={(event) => setFolderDraft(event.target.value)}
                  placeholder="New folder"
                />
                <button type="button" className="halo-copy-button" onClick={createFolder}>
                  <HaloIcon name="add" size={15} />
                  New folder
                </button>
              </div>
            </div>
          ) : null}
        </header>

        {mode === "saved" ? (
          <div className="halo-studio-saved-grid">
            {saved.length ? (
              saved.map((item) => (
                <article key={item.id} className="halo-studio-saved-card">
                  <StudioPreview mode={item.mode} approved={approved} />
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.type} / {item.folder}</span>
                  </div>
                  <Link
                    to={
                      item.mode === "walls"
                        ? "/dashboard/walls"
                        : `/dashboard/studio/widgets/${item.id}`
                    }
                    className="halo-copy-button"
                  >
                    Open
                  </Link>
                </article>
              ))
            ) : (
              <div className="halo-studio-empty">
                <div className="halo-studio-skeleton-grid" aria-hidden="true">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <span key={index} />
                  ))}
                </div>
                <p>Nothing here, yet.</p>
                <small>To start, select what you would like to create using the menu above.</small>
              </div>
            )}
            <aside className="halo-studio-folder-list">
              <span>Folders</span>
              {folders.map((folder) => (
                <button key={folder} type="button">{folder}</button>
              ))}
            </aside>
          </div>
        ) : (
          <div className="halo-studio-template-grid">
            {templates.map((template) => (
              <TemplateCard
                key={template}
                mode={mode}
                template={template}
                onUse={createDraft}
                approved={approved}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
