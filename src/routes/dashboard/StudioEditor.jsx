import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { cn } from "@/lib/cn";
import { HaloIcon } from "@/components/dashboard/HaloIcon.jsx";
import { useTestimonials } from "@/lib/testimonialsStore.jsx";
import { useBrand } from "@/lib/brandStore.jsx";
import { brandCssVars } from "@/lib/brand";

const assetMeta = {
  widgets: {
    label: "Widget",
    plural: "Widgets",
    icon: "widget",
    templates: ["Image Gallery", "Slab Carousel", "Rating Badge", "Company Logos", "Hero Quotes", "Bricks"],
    layouts: ["Cards", "Carousel", "Marquee", "Badge"],
  },
  sizzle: {
    label: "Sizzle Reel",
    plural: "Sizzle Reels",
    icon: "wand",
    templates: ["Founder highlight", "Launch reel", "Customer montage"],
    layouts: ["Timeline", "Montage", "Highlight reel"],
  },
  social: {
    label: "Social Video",
    plural: "Social Videos",
    icon: "video",
    templates: ["Quote motion", "Split-screen proof", "Caption stack", "Customer win"],
    layouts: ["Square", "Story", "Landscape"],
  },
  popups: {
    label: "Popup",
    plural: "Popups",
    icon: "feedback",
    templates: ["Testimonial Toast", "Testimonial Popup"],
    layouts: ["Bottom left", "Bottom right", "Center modal"],
  },
  embeds: {
    label: "Video Embed",
    plural: "Video embeds",
    icon: "video",
    templates: ["Single Video", "Multiclip Video"],
    layouts: ["Inline", "Playlist", "Featured"],
  },
  images: {
    label: "Image",
    plural: "Images",
    icon: "image",
    templates: ["Course Quote", "SaaS Proof", "Freelancer Win", "Newsletter Pullquote", "Creator Card"],
    layouts: ["Square", "Portrait", "Wide", "Transparent"],
  },
  walls: {
    label: "Wall of Love",
    plural: "Walls of Love",
    icon: "walls",
    templates: ["Minimal Wall", "Launch Wall", "Masonry Wall", "Hero Wall", "Dark Wall"],
    layouts: ["Masonry", "Grid", "Hero", "Compact"],
  },
};

const stepMeta = [
  { id: "testimonials", label: "Select Testimonials", icon: "proof" },
  { id: "templates", label: "Templates", icon: "studio" },
  { id: "design", label: "Design", icon: "brush" },
];

function humanizeSlug(value) {
  return (value || "untitled")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function MiniPreview({ type, selectedTestimonials, template, title, description, layout }) {
  const people = selectedTestimonials.length ? selectedTestimonials : [];

  if (type === "walls") {
    return (
      <div className="halo-editor-wall-preview">
        <header>
          <strong>{title}</strong>
          <span>{description}</span>
        </header>
        <div>
          {(people.length ? people : Array.from({ length: 6 })).slice(0, 8).map((item, index) => (
            <article key={item.id ?? index}>
              <span>{item.name?.slice(0, 1) ?? "H"}</span>
              <p>{item.text ?? "Your best testimonials will appear here once selected."}</p>
              <small>{item.name ?? template}</small>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (["sizzle", "social", "embeds"].includes(type)) {
    return (
      <div className="halo-editor-video-preview">
        <div>
          <span />
          <HaloIcon name="video" size={28} />
        </div>
        <strong>{template}</strong>
        <small>{layout} / {people.length || 0} selected clips</small>
      </div>
    );
  }

  if (type === "images") {
    return (
      <div className="halo-editor-image-preview">
        <span>{template}</span>
        <blockquote>{people[0]?.text ?? "A polished customer quote, ready for social."}</blockquote>
        <small>{people[0]?.name ?? "Halo customer"}</small>
      </div>
    );
  }

  return (
    <div className="halo-editor-widget-preview">
      {(people.length ? people : Array.from({ length: 3 })).slice(0, 3).map((item, index) => (
        <article key={item.id ?? index}>
          <div>
            {Array.from({ length: 5 }).map((_, star) => (
              <HaloIcon key={star} name="star" size={13} strokeWidth={0} />
            ))}
          </div>
          <p>{item.text ?? "Select testimonials to populate this widget."}</p>
          <strong>{item.name ?? ["Ava", "Marcus", "Priya"][index]}</strong>
        </article>
      ))}
    </div>
  );
}

export default function StudioEditor() {
  const { assetType, assetId } = useParams();
  const meta = assetMeta[assetType];
  const { approved } = useTestimonials();
  const { brand } = useBrand();
  const [step, setStep] = useState("testimonials");
  const [selected, setSelected] = useState(() => new Set(approved.slice(0, 3).map((item) => item.id)));
  const [template, setTemplate] = useState(() => humanizeSlug(assetId));
  const [title, setTitle] = useState(meta?.label === "Wall of Love" ? "Wall of Love" : humanizeSlug(assetId));
  const [description, setDescription] = useState("See what our customers are saying about us.");
  const [layout, setLayout] = useState(meta?.layouts?.[0] ?? "Cards");
  const [showAvatars, setShowAvatars] = useState(true);
  const [showRatings, setShowRatings] = useState(true);
  const [message, setMessage] = useState("");
  const [shareOpen, setShareOpen] = useState(false);

  const selectedTestimonials = useMemo(
    () => approved.filter((testimonial) => selected.has(testimonial.id)),
    [approved, selected]
  );

  if (!meta) return <Navigate to="/dashboard/studio" replace />;

  function toggleProof(id) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function saveChanges() {
    setMessage(`${title || template} saved`);
    setTimeout(() => setMessage(""), 1800);
  }

  const publicUrl = `https://halo.app/${assetType}/${slugify(title || template) || assetId}`;

  return (
    <div className="halo-page halo-editor-page">
      <header className="halo-editor-topbar">
        <Link to={`/dashboard/studio?mode=${assetType}`} className="halo-copy-button">
          <HaloIcon name="arrowRight" size={15} />
          {meta.plural}
        </Link>
        <div>
          <span>{meta.label}</span>
          <strong>{title || template}</strong>
        </div>
        <div className="halo-editor-topbar-actions">
          {message ? <em>{message}</em> : null}
          <button type="button" className="halo-copy-button" onClick={saveChanges}>
            Save changes
          </button>
          <button type="button" className="halo-copy-button is-primary" onClick={() => setShareOpen((open) => !open)}>
            Share
          </button>
        </div>
      </header>

      <div className="halo-editor-shell">
        <nav className="halo-editor-steps" aria-label={`${meta.label} editor steps`}>
          {stepMeta.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStep(item.id)}
              className={cn(step === item.id && "is-active")}
            >
              <HaloIcon name={item.icon} size={17} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <main className="halo-editor-preview-pane" style={brandCssVars(brand.brandColor)}>
          <MiniPreview
            type={assetType}
            selectedTestimonials={selectedTestimonials}
            template={template}
            title={title}
            description={description}
            layout={layout}
          />
        </main>

        <aside className="halo-editor-controls" aria-label={`${meta.label} controls`}>
          {shareOpen ? (
            <section className="halo-editor-control-card">
              <header>
                <span>Share</span>
                <button type="button" onClick={() => setShareOpen(false)}>Close</button>
              </header>
              <label>
                Public URL
                <input className="halo-field font-mono" readOnly value={publicUrl} />
              </label>
              <button
                type="button"
                className="halo-copy-button"
                onClick={() => {
                  navigator.clipboard?.writeText(publicUrl);
                  setMessage("Share link copied");
                }}
              >
                <HaloIcon name="copy" size={15} />
                Copy link
              </button>
              <code>{`<script src="https://halo.app/embed/${assetType}/${slugify(title || template)}"></script>`}</code>
            </section>
          ) : null}

          {step === "testimonials" ? (
            <section className="halo-editor-control-card">
              <header>
                <span>Select Testimonials</span>
                <small>{selected.size} selected</small>
              </header>
              <div className="halo-editor-proof-list">
                {approved.map((testimonial) => (
                  <label key={testimonial.id}>
                    <input
                      type="checkbox"
                      checked={selected.has(testimonial.id)}
                      onChange={() => toggleProof(testimonial.id)}
                    />
                    <span>{testimonial.name.slice(0, 1)}</span>
                    <strong>{testimonial.name}</strong>
                    <small>{testimonial.company || testimonial.source}</small>
                  </label>
                ))}
              </div>
              <Link to="/dashboard/proof" className="halo-copy-button">Manage proof</Link>
            </section>
          ) : null}

          {step === "templates" ? (
            <section className="halo-editor-control-card">
              <header>
                <span>Templates</span>
                <small>{meta.templates.length} options</small>
              </header>
              <div className="halo-editor-template-list">
                {meta.templates.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTemplate(item)}
                    className={cn(template === item && "is-active")}
                  >
                    <HaloIcon name={meta.icon} size={15} />
                    {item}
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {step === "design" ? (
            <section className="halo-editor-control-card">
              <header>
                <span>Design</span>
                <small>{layout}</small>
              </header>
              <label>
                Title
                <input className="halo-field" value={title} onChange={(event) => setTitle(event.target.value)} />
              </label>
              <label>
                Description
                <textarea className="halo-field min-h-[82px] resize-y" value={description} onChange={(event) => setDescription(event.target.value)} />
              </label>
              <label>
                Layout
                <select className="halo-field" value={layout} onChange={(event) => setLayout(event.target.value)}>
                  {meta.layouts.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="halo-editor-switch">
                <input type="checkbox" checked={showAvatars} onChange={(event) => setShowAvatars(event.target.checked)} />
                Show avatars
              </label>
              <label className="halo-editor-switch">
                <input type="checkbox" checked={showRatings} onChange={(event) => setShowRatings(event.target.checked)} />
                Show ratings
              </label>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
