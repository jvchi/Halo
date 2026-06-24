import { useMemo, useState } from "react";
import { PageHeading } from "@/components/ui";
import { HaloIcon } from "@/components/dashboard/HaloIcon.jsx";
import { useTestimonials } from "@/lib/testimonialsStore.jsx";

const tagColors = [
  "var(--halo-primary)",
  "var(--halo-green)",
  "var(--halo-orange)",
  "var(--halo-purple)",
  "var(--halo-teal)",
  "var(--halo-pink)",
];

function normalizeTag(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

export default function Tags() {
  const { testimonials } = useTestimonials();
  const [draft, setDraft] = useState("");
  const [customTags, setCustomTags] = useState([]);

  const tags = useMemo(() => {
    const map = new Map();
    testimonials.forEach((testimonial) => {
      testimonial.tags.forEach((tag) => {
        const current = map.get(tag) ?? { tag, count: 0, approved: 0, sources: new Set() };
        current.count += 1;
        if (testimonial.status === "approved") current.approved += 1;
        current.sources.add(testimonial.source);
        map.set(tag, current);
      });
    });
    customTags.forEach((tag) => {
      if (!map.has(tag)) map.set(tag, { tag, count: 0, approved: 0, sources: new Set() });
    });
    return [...map.values()].sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
  }, [customTags, testimonials]);

  const untagged = testimonials.filter((testimonial) => testimonial.tags.length === 0).length;

  function createTag(event) {
    event.preventDefault();
    const tag = normalizeTag(draft);
    if (!tag) return;
    setCustomTags((current) => (current.includes(tag) ? current : [...current, tag]));
    setDraft("");
  }

  return (
    <div className="halo-page">
      <header className="halo-page-header">
        <PageHeading
          title="Tags"
          info="Organize testimonials by audience, campaign, objection, source, or page."
        />
      </header>

      <div className="halo-workbench-grid">
        <section className="halo-panel">
          <header className="halo-panel-header">
            <span>Tag library</span>
            <small>{tags.length} tags</small>
          </header>

          <form onSubmit={createTag} className="halo-tag-form">
            <label className="halo-input-with-icon">
              <HaloIcon name="tags" size={16} />
              <input
                className="halo-field"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Create a tag..."
              />
            </label>
            <button type="submit" className="halo-copy-button">
              <HaloIcon name="add" size={15} />
              Create
            </button>
          </form>

          <div className="halo-tag-grid">
            {tags.map((item, index) => (
              <article key={item.tag} className="halo-tag-card">
                <span className="halo-tag-dot" style={{ background: tagColors[index % tagColors.length] }} />
                <div>
                  <strong>#{item.tag}</strong>
                  <small>
                    {item.count} total / {item.approved} approved
                  </small>
                </div>
                <p>{item.sources.size ? [...item.sources].join(", ") : "Ready for new proof"}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="halo-panel">
          <header className="halo-panel-header">
            <span>Hygiene</span>
            <small>Keep proof usable</small>
          </header>
          <div className="halo-metric-stack">
            <div className="halo-metric-tile">
              <span>Untagged</span>
              <strong>{untagged}</strong>
              <small>Testimonials without a tag</small>
            </div>
            <div className="halo-callout">
              <HaloIcon name="check" size={18} />
              <p>Use tags for landing pages, customer segments, objections, campaigns, and content formats.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
