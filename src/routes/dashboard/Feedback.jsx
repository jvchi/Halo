import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { PageHeading } from "@/components/ui";
import { HaloIcon } from "@/components/dashboard/HaloIcon.jsx";
import { useTestimonials } from "@/lib/testimonialsStore.jsx";

const FEEDBACK_TYPES = {
  all: "All",
  praise: "Praise",
  request: "Requests",
  issue: "Issues",
  question: "Questions",
};

function classify(testimonial) {
  if (testimonial.rating <= 2 || testimonial.status === "rejected") return "issue";
  if (testimonial.status === "pending") return "question";
  if (testimonial.rating === 4) return "request";
  return "praise";
}

function FeedbackCard({ item }) {
  return (
    <article className="halo-feedback-card">
      <div className="halo-feedback-card-header">
        <span className="halo-feature-icon" aria-hidden="true">
          <HaloIcon name={item.type === "praise" ? "star" : item.type === "issue" ? "feedback" : "proof"} size={18} />
        </span>
        <div>
          <strong>{item.name}</strong>
          <small>{[item.role, item.company].filter(Boolean).join(" / ") || item.source}</small>
        </div>
        <em data-tone={item.type}>{FEEDBACK_TYPES[item.type]}</em>
      </div>
      <p>{item.text}</p>
      <div className="halo-proof-meta">
        <span>{item.source}</span>
        <span>{item.rating ? `${item.rating}/5 rating` : "No rating"}</span>
        {item.tags.map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>
    </article>
  );
}

export default function Feedback() {
  const { testimonials } = useTestimonials();
  const [type, setType] = useState("all");
  const [query, setQuery] = useState("");

  const feedback = useMemo(
    () =>
      testimonials.map((testimonial) => ({
        ...testimonial,
        type: classify(testimonial),
      })),
    [testimonials]
  );

  const counts = useMemo(() => {
    const result = { all: feedback.length, praise: 0, request: 0, issue: 0, question: 0 };
    feedback.forEach((item) => {
      result[item.type] += 1;
    });
    return result;
  }, [feedback]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return feedback.filter((item) => {
      if (type !== "all" && item.type !== type) return false;
      if (!term) return true;
      return [item.name, item.company, item.role, item.text, item.source, ...item.tags]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [feedback, query, type]);

  return (
    <div className="halo-page">
      <header className="halo-page-header">
        <PageHeading
          title="Feedback"
          info="Track customer praise, requests, questions, and issues before turning them into public proof."
        />
      </header>

      <section className="halo-feature-grid halo-feature-grid-4" aria-label="Feedback counts">
        {Object.entries(FEEDBACK_TYPES)
          .filter(([id]) => id !== "all")
          .map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setType(id)}
              className={cn("halo-metric-tile", type === id && "is-active")}
            >
              <span>{label}</span>
              <strong>{counts[id]}</strong>
              <small>{id === "praise" ? "Ready to publish" : id === "issue" ? "Needs attention" : "Product signal"}</small>
            </button>
          ))}
      </section>

      <section className="halo-panel">
        <div className="halo-proof-toolbar">
          <label className="halo-input-with-icon halo-proof-search">
            <HaloIcon name="search" size={16} />
            <input
              className="halo-field"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search feedback..."
            />
          </label>

          <div className="halo-pill-tabs" aria-label="Feedback type">
            {Object.entries(FEEDBACK_TYPES).map(([id, label]) => (
              <button key={id} type="button" onClick={() => setType(id)} className={cn(type === id && "is-active")}>
                {label}
                <span>{counts[id]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="halo-feedback-list">
          {filtered.length ? (
            filtered.map((item) => <FeedbackCard key={item.id} item={item} />)
          ) : (
            <p className="halo-empty-inline">No feedback found.</p>
          )}
        </div>
      </section>
    </div>
  );
}
