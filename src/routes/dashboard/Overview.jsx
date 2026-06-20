import { Link } from "react-router-dom";
import { CollectIcon, WidgetStudioIcon, WallOfLoveIcon } from "@/components/icons";
import { useTestimonials } from "@/lib/testimonialsStore.jsx";
import { PageHeading } from "@/components/ui";

const actions = [
  {
    to: "/dashboard/inbox",
    Icon: CollectIcon,
    title: "Collect testimonials",
    hint: "Review new submissions and move strong quotes into approval.",
  },
  {
    to: "/dashboard/widget-studio",
    Icon: WidgetStudioIcon,
    title: "Design a widget",
    hint: "Tune layout, theme, and display controls before publishing.",
  },
  {
    to: "/dashboard/walls",
    Icon: WallOfLoveIcon,
    title: "Publish a wall",
    hint: "Turn approved testimonials into a hosted proof page.",
  },
];

const workflow = [
  { label: "Collect", detail: "Forms, imports, manual notes" },
  { label: "Approve", detail: "Tags, status, quote cleanup" },
  { label: "Design", detail: "Widgets and brand presets" },
  { label: "Publish", detail: "Walls, embeds, analytics" },
];

function Arrow() {
  return (
    <svg width="44" height="18" viewBox="0 0 44 18" fill="none" aria-hidden="true">
      <path
        d="M1 9h40m0 0-6-6m6 6-6 6"
        stroke="currentColor"
        strokeDasharray="2.5 4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
      />
    </svg>
  );
}

function WorkflowPanel() {
  return (
    <div className="halo-workflow-panel" aria-label="Halo testimonial workflow">
      <div className="halo-workflow-track">
        {workflow.map((step, index) => (
          <div className="halo-workflow-segment" key={step.label}>
            <div className="halo-workflow-node" style={{ "--delay": `${index * 90}ms` }}>
              <span className="halo-workflow-index">{index + 1}</span>
              <span className="halo-workflow-label">{step.label}</span>
              <span className="halo-workflow-detail">{step.detail}</span>
            </div>
            {index < workflow.length - 1 ? <Arrow /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Overview() {
  const { testimonials, approved } = useTestimonials();
  const pending = testimonials.filter((t) => t.status === "pending").length;
  const stats = [
    { value: String(testimonials.length), label: "Testimonials collected" },
    { value: String(pending), label: "Pending approval" },
    { value: String(approved.length), label: "Approved & live" },
  ];

  return (
    <div className="halo-page">
      <header className="halo-page-header">
        <PageHeading
          title="Overview"
          info="Collect, approve, design, and publish premium testimonial widgets."
        />
        <Link to="/dashboard/widget-studio" className="halo-copy-button">
          Open studio
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M6 4l4 4-4 4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.7"
            />
          </svg>
        </Link>
      </header>

      <WorkflowPanel />

      <section className="halo-metric-grid" aria-label="Workspace metrics">
        {stats.map((stat) => (
          <article className="halo-metric-card" key={stat.label}>
            <p>{stat.value}</p>
            <span>{stat.label}</span>
          </article>
        ))}
      </section>

      <section className="halo-action-list" aria-label="Next actions">
        {actions.map(({ to, Icon, title, hint }, index) => (
          <Link
            key={to}
            to={to}
            className="halo-action-row"
            style={{ "--delay": `${220 + index * 80}ms` }}
          >
            <span className="halo-action-icon">
              <Icon size={24} />
            </span>
            <span className="halo-action-copy">
              <strong>{title}</strong>
              <span>{hint}</span>
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M6 4l4 4-4 4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.7"
              />
            </svg>
          </Link>
        ))}
      </section>
    </div>
  );
}
