import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";
import { PageHeading } from "@/components/ui";
import { HaloIcon } from "@/components/dashboard/HaloIcon.jsx";
import { useTestimonials } from "@/lib/testimonialsStore.jsx";
import { TESTIMONIAL_STATUSES } from "@/lib/testimonials";

const STATUS_META = {
  pending: { label: "Pending", tone: "warning" },
  approved: { label: "Approved", tone: "success" },
  rejected: { label: "Rejected", tone: "danger" },
  archived: { label: "Archived", tone: "muted" },
};

const publishCards = [
  {
    title: "Image Gallery",
    copy: "A media-rich grid for proof-heavy landing pages.",
    to: "/dashboard/widget-studio",
    icon: "image",
  },
  {
    title: "Slab Carousel",
    copy: "Compact rotating proof for hero and pricing pages.",
    to: "/dashboard/widget-studio",
    icon: "widget",
  },
  {
    title: "Rating Badge",
    copy: "Small trust badge next to checkout or CTAs.",
    to: "/dashboard/widget-studio",
    icon: "star",
  },
  {
    title: "Wall of Love",
    copy: "A hosted page for all approved proof.",
    to: "/dashboard/walls",
    icon: "walls",
  },
];

function StatusBadge({ status }) {
  const meta = STATUS_META[status] ?? STATUS_META.pending;
  return (
    <span className="halo-status-badge" data-tone={meta.tone}>
      {meta.label}
    </span>
  );
}

function Stars({ value }) {
  return (
    <span className="halo-star-meter" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <HaloIcon
          key={index}
          name="star"
          size={14}
          strokeWidth={index < value ? 0 : 1.4}
          className={index < value ? "is-filled" : ""}
        />
      ))}
    </span>
  );
}

function ProofRow({ testimonial, selected, onSelect, onStatus }) {
  return (
    <article className={cn("halo-proof-row", selected && "is-selected")}>
      <label className="halo-proof-checkbox">
        <input
          type="checkbox"
          checked={selected}
          onChange={(event) => onSelect(event.target.checked)}
          aria-label={`Select ${testimonial.name}`}
        />
      </label>
      <div className="halo-proof-avatar" aria-hidden="true">
        {testimonial.name.slice(0, 1).toUpperCase()}
      </div>
      <div className="halo-proof-copy">
        <div className="halo-proof-heading">
          <strong>{testimonial.name}</strong>
          <span>{[testimonial.role, testimonial.company].filter(Boolean).join(" / ")}</span>
          <StatusBadge status={testimonial.status} />
        </div>
        <p>{testimonial.text}</p>
        <div className="halo-proof-meta">
          <Stars value={testimonial.rating} />
          <span>{testimonial.source}</span>
          {testimonial.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      </div>
      <div className="halo-proof-actions">
        {testimonial.status !== "approved" ? (
          <button type="button" className="halo-copy-button" onClick={() => onStatus("approved")}>
            Approve
          </button>
        ) : (
          <button type="button" className="halo-copy-button" onClick={() => onStatus("archived")}>
            Archive
          </button>
        )}
      </div>
    </article>
  );
}

export default function Proof() {
  const { testimonials, setStatus } = useTestimonials();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [selected, setSelected] = useState(() => new Set());

  const tags = useMemo(() => {
    const all = new Set();
    testimonials.forEach((testimonial) => testimonial.tags.forEach((tag) => all.add(tag)));
    return [...all].sort();
  }, [testimonials]);

  const counts = useMemo(() => {
    const result = { all: testimonials.length };
    TESTIMONIAL_STATUSES.forEach((status) => {
      result[status] = testimonials.filter((testimonial) => testimonial.status === status).length;
    });
    return result;
  }, [testimonials]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return testimonials.filter((testimonial) => {
      if (statusFilter !== "all" && testimonial.status !== statusFilter) return false;
      if (tagFilter !== "all" && !testimonial.tags.includes(tagFilter)) return false;
      if (!term) return true;
      return [testimonial.name, testimonial.role, testimonial.company, testimonial.text, testimonial.source, ...testimonial.tags]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [query, statusFilter, tagFilter, testimonials]);

  const selectedCount = selected.size;
  const allVisibleSelected = filtered.length > 0 && filtered.every((testimonial) => selected.has(testimonial.id));

  function setRowSelected(id, checked) {
    setSelected((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function setAllVisible(checked) {
    setSelected((current) => {
      const next = new Set(current);
      filtered.forEach((testimonial) => {
        if (checked) next.add(testimonial.id);
        else next.delete(testimonial.id);
      });
      return next;
    });
  }

  function bulkStatus(status) {
    selected.forEach((id) => setStatus(id, status));
    setSelected(new Set());
  }

  return (
    <div className="halo-page">
      <section className="halo-proof-widget-strip" aria-label="Publishing shortcuts">
        <div>
          <h2>Add testimonials to your website</h2>
          <p>Pick one of these widgets to add them to your website.</p>
        </div>
        <div className="halo-proof-widget-carousel">
          {publishCards.map((card, index) => (
            <Link key={card.title} to={card.to} className="halo-proof-widget-card">
              <span className="halo-feature-icon" aria-hidden="true">
                <HaloIcon name={card.icon} size={20} />
              </span>
              <strong>{card.title}</strong>
              <small>{card.copy}</small>
              {index === 0 ? <em>New</em> : index === 2 ? <em>Upgrade</em> : null}
            </Link>
          ))}
        </div>
      </section>

      <section className="halo-panel">
        <header className="halo-page-header halo-proof-list-header">
          <PageHeading
            title="Your testimonials"
            info="Search, filter, approve, and publish every testimonial in one place."
          />
          <Link to="/dashboard/forms" className="halo-copy-button">
            <HaloIcon name="forms" size={15} />
            Invite a customer
          </Link>
        </header>

        <div className="halo-proof-toolbar">
          <label className="halo-input-with-icon halo-proof-search">
            <HaloIcon name="search" size={16} />
            <input
              className="halo-field"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for your proof using natural language"
            />
          </label>

          <div className="halo-pill-tabs" aria-label="Status filter">
            {["all", ...TESTIMONIAL_STATUSES].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={cn(statusFilter === status && "is-active")}
              >
                {status === "all" ? "All" : STATUS_META[status].label}
                <span>{counts[status]}</span>
              </button>
            ))}
          </div>

          <select className="halo-field halo-proof-tag-select" value={tagFilter} onChange={(event) => setTagFilter(event.target.value)}>
            <option value="all">All tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </select>
        </div>

        <div className="halo-bulk-bar">
          <label className="halo-proof-checkbox">
            <input
              type="checkbox"
              checked={allVisibleSelected}
              onChange={(event) => setAllVisible(event.target.checked)}
              aria-label="Select visible testimonials"
            />
          </label>
          <span>{selectedCount ? `${selectedCount} selected` : `${filtered.length} visible testimonials`}</span>
          <div>
            <button type="button" className="halo-overview-panel-action" disabled={!selectedCount} onClick={() => bulkStatus("approved")}>
              Approve selected
            </button>
            <button type="button" className="halo-overview-panel-action" disabled={!selectedCount} onClick={() => bulkStatus("archived")}>
              Archive selected
            </button>
            <Link to="/dashboard/import" className="halo-overview-panel-action">
              Import testimonials
            </Link>
          </div>
        </div>

        <div className="halo-proof-list">
          {filtered.length ? (
            filtered.map((testimonial) => (
              <ProofRow
                key={testimonial.id}
                testimonial={testimonial}
                selected={selected.has(testimonial.id)}
                onSelect={(checked) => setRowSelected(testimonial.id, checked)}
                onStatus={(status) => setStatus(testimonial.id, status)}
              />
            ))
          ) : (
            <p className="halo-empty-inline">No proof matches the current filters.</p>
          )}
        </div>
      </section>
    </div>
  );
}
