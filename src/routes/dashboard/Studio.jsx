import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/cn";
import { HaloIcon } from "@/components/dashboard/HaloIcon.jsx";
import { useTestimonials } from "@/lib/testimonialsStore.jsx";
import { useStudio } from "@/lib/studioStore.js";

const studioModes = [
  { id: "saved", label: "Saved", icon: "copy" },
  { id: "widgets", label: "Widgets", icon: "widget" },
  { id: "sizzle", label: "Sizzle Reels", icon: "wand" },
  { id: "social", label: "Social Videos", icon: "video" },
  { id: "popups", label: "Popups", icon: "feedback" },
  { id: "embeds", label: "Video embeds", icon: "video" },
  { id: "images", label: "Images", icon: "image" },
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
    filters: ["All", "Pro", "Supports images", "Supports video", "Supports filters", "Highlights only", "Great for hero", "Great next to CTA"],
    templates: [
      "Image Gallery",
      "Slab Carousel",
      "Rating Badge",
      "Company Logos",
      "Social Star",
      "Hero Quotes",
      "Highlights Bold",
      "Bricks",
      "Avatars",
      "Avatars Grid",
      "List",
      "Masonry",
      "Bubble List",
      "Carousel",
      "Marquee",
    ],
  },
  sizzle: {
    title: "Sizzle Reels",
    copy: "Create a beautiful, shareable sizzle reel from multiple video testimonials.",
    templates: ["Founder highlight", "Launch reel", "Customer montage"],
  },
  social: {
    title: "Social Videos",
    copy: "Create beautiful, shareable animated videos from your testimonials.",
    templates: ["Quote motion", "Split-screen proof", "Caption stack", "Launch proof", "Customer win", "Founder repost"],
  },
  popups: {
    title: "Popups",
    copy: "Add a testimonial popup to your website without code.",
    templates: ["Testimonial Toast", "Testimonial Popup"],
  },
  embeds: {
    title: "Video embeds",
    copy: "Embed your video testimonials on your website.",
    templates: ["Single Video", "Multiclip Video"],
  },
  images: {
    title: "Images",
    copy: "Create beautiful images from your testimonials for social media and emails.",
    filters: ["All", "Course", "SaaS", "Freelancer", "Newsletter", "Creator", "Digital Product", "Employee", "Sponsor"],
    templates: ["Course Quote", "SaaS Proof", "Freelancer Win", "Newsletter Pullquote", "Creator Card", "Product Launch", "Team Praise", "Sponsor Quote"],
  },
  walls: {
    title: "Walls of Love",
    copy: "Create a beautiful, shareable Wall of Love with your best testimonials.",
    templates: ["Minimal Wall", "Launch Wall", "Masonry Wall", "Hero Wall", "Dark Wall"],
  },
};

function StudioPreview({ mode, template, approved }) {
  const names = approved.slice(0, 3).map((item) => item.name);
  const fallback = ["Ari", "Maya", "Noah"];
  const people = names.length ? names : fallback;

  return (
    <div className={cn("halo-studio-template-preview", `is-${mode}`)}>
      {mode === "widgets" || mode === "saved" ? (
        <>
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
        </>
      ) : null}
      {mode === "images" ? (
        <div className="halo-template-image-card">
          <strong>{template}</strong>
          <span>5.0</span>
        </div>
      ) : null}
      {mode === "social" || mode === "sizzle" || mode === "embeds" ? (
        <div className="halo-template-video-card">
          <span />
          <i />
        </div>
      ) : null}
      {mode === "popups" ? (
        <div className="halo-template-popup-card">
          <span>{people[0].slice(0, 1)}</span>
          <div>
            <i />
            <i />
          </div>
        </div>
      ) : null}
      {mode === "walls" ? (
        <div className="halo-template-wall-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function TemplateCard({ mode, template, active, onUse, approved }) {
  return (
    <button
      type="button"
      className={cn("halo-studio-template-card", active && "is-active")}
      onClick={() => onUse(template)}
    >
      <StudioPreview mode={mode} template={template} approved={approved} />
      <span>
        <strong>{template}</strong>
        {["Image Gallery", "Testimonial Toast", "Course Quote"].includes(template) ? <em>New</em> : null}
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
  const [filter, setFilter] = useState("All");
  const [folderDraft, setFolderDraft] = useState("");
  const [draft, setDraft] = useState(null);
  const [demoSaved, setDemoSaved] = useState([]);
  const folders = studio.folders.map((folder) => folder.name);
  const saved = [
    ...studio.assets.map((asset) => ({
      ...asset,
      type: asset.kind === "wall" ? "Walls of Love" : "Widgets",
      mode: asset.kind === "wall" ? "walls" : "widgets",
      folder:
        studio.folders.find((folder) => folder.id === asset.folderId)?.name ??
        "Default",
    })),
    ...demoSaved,
  ];

  useEffect(() => {
    const nextMode = normalizeMode(modeParam, initialMode);
    setMode((current) => (current === nextMode ? current : nextMode));
    setFilter("All");
  }, [initialMode, modeParam]);

  const meta = modeMeta[mode];
  const templates = useMemo(() => {
    if (mode === "saved") return [];
    const items = meta.templates ?? [];
    if (!meta.filters || filter === "All") return items;
    return items.filter((item, index) => index % 2 === 0 || item.toLowerCase().includes(filter.toLowerCase().split(" ")[0]));
  }, [filter, meta, mode]);

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
    setFilter("All");
    setSearchParams(nextMode === "saved" ? {} : { mode: nextMode });
  }

  function createDraft(template) {
    const nextDraft = { name: template, type: meta.title, mode, folder: folders[0] ?? "Default" };
    setDraft(nextDraft);
    if (!["widgets", "walls"].includes(mode)) {
      setDemoSaved((current) => {
        const name = `${template} draft`;
        if (current.some((item) => item.name === name)) return current;
        return [
          {
            id: `demo-${mode}-${slugify(template)}`,
            name,
            type: meta.title,
            mode,
            folder: folders[0] ?? "Default",
          },
          ...current,
        ];
      });
    }
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
              <select className="halo-field" aria-label="Saved type">
                <option>All Saved</option>
                <option>Widgets</option>
                <option>Sizzle Reels</option>
                <option>Popups</option>
                <option>Video Embeds</option>
                <option>Images</option>
                <option>Walls of Love</option>
              </select>
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
                  <StudioPreview mode={item.type === "Walls of Love" ? "walls" : "widgets"} template={item.name} approved={approved} />
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.type} / {item.folder}</span>
                  </div>
                  <Link
                    to={
                      item.id?.startsWith("demo-")
                        ? `/dashboard/studio?mode=${item.mode ?? "widgets"}`
                        : `/dashboard/studio/${item.mode ?? "widgets"}/${item.id}`
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
          <>
            {meta.filters ? (
              <div className="halo-studio-filter-row" aria-label={`${meta.title} filters`}>
                {meta.filters.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={cn(filter === item && "is-active")}
                    onClick={() => setFilter(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            ) : null}
            <div className={cn("halo-studio-template-grid", mode === "social" && "is-tall")}>
              {templates.map((template) => (
                <TemplateCard
                  key={template}
                  mode={mode}
                  template={template}
                  active={saved.some((item) => item.name === `${template} draft`)}
                  onUse={createDraft}
                  approved={approved}
                />
              ))}
            </div>
            {draft ? (
              <aside className="halo-panel halo-studio-draft-panel" aria-label="Selected Studio draft">
                <header className="halo-panel-header">
                  <span>{draft.name} draft</span>
                  <small>{draft.type}</small>
                </header>
                <div className="halo-studio-draft-preview">
                  <div>
                    <HaloIcon name={draft.mode === "walls" ? "walls" : draft.mode === "images" ? "image" : "widget"} size={22} />
                    <strong>{draft.name}</strong>
                    <p>Choose proof, tune display options, then save or publish from this draft.</p>
                  </div>
                  <div className="halo-studio-proof-strip">
                    <span>{approved.length || 0} approved proof</span>
                    <span>{draft.folder}</span>
                    <span>{draft.type}</span>
                  </div>
                </div>
                <div className="halo-proof-actions">
                  <Link to="/dashboard/proof" className="halo-copy-button">
                    Select testimonials
                  </Link>
                  <button type="button" className="halo-copy-button" onClick={() => selectMode("saved")}>
                    View saved
                  </button>
                </div>
              </aside>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
