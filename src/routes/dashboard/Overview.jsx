import { Link, useNavigate } from "react-router-dom";
import { PageHeading } from "@/components/ui";
import { useTestimonials } from "@/lib/testimonialsStore.jsx";
import { useForms } from "@/lib/formsStore.jsx";
import { buildAnalytics } from "@/lib/analytics.js";

const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function OverviewPanel({ title, action, children, className }) {
  return (
    <section className={`halo-overview-panel ${className ?? ""}`}>
      <header className="halo-overview-panel-header">
        <h2>{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}

function KpiCard({ label, value, detail, tone = "primary" }) {
  return (
    <article className="halo-overview-kpi" data-tone={tone}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function EmptyPanelMessage({ children }) {
  return <p className="halo-overview-empty">{children}</p>;
}

function MiniStat({ label, value }) {
  return (
    <div className="halo-overview-mini-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function PendingRow({ testimonial }) {
  return (
    <Link to="/dashboard/inbox" className="halo-overview-row">
      <span className="halo-overview-avatar" aria-hidden="true">
        {testimonial.name?.charAt(0) || "T"}
      </span>
      <span className="halo-overview-row-copy">
        <strong>{testimonial.name}</strong>
        <span>{testimonial.text}</span>
      </span>
      <ArrowIcon />
    </Link>
  );
}

function ReadinessItem({ label, value, ready, to }) {
  return (
    <Link to={to} className="halo-overview-readiness" data-ready={ready}>
      <span>
        <strong>{label}</strong>
        <small>{value}</small>
      </span>
      <span className="halo-overview-status-dot" aria-hidden="true" />
    </Link>
  );
}

export default function Overview() {
  const navigate = useNavigate();
  const { testimonials, approved } = useTestimonials();
  const { forms, create } = useForms();

  const pendingTestimonials = testimonials.filter((t) => t.status === "pending");
  const activeForms = forms.filter((f) => f.status === "active");
  const totalResponses = forms.reduce((sum, form) => sum + (form.responses ?? 0), 0);
  const topForm = [...forms].sort((a, b) => (b.responses ?? 0) - (a.responses ?? 0))[0];
  const analytics = buildAnalytics(30, approved);
  const views = analytics.metrics.find((m) => m.key === "views")?.value ?? 0;
  const clicks = analytics.metrics.find((m) => m.key === "clicks")?.value ?? 0;
  const conversions = analytics.metrics.find((m) => m.key === "conv")?.value ?? 0;

  async function createNewForm() {
    const form = await create({ name: "Untitled form" });
    navigate(`/dashboard/forms/${form.id}`);
  }

  return (
    <div className="halo-page">
      <header className="halo-page-header">
        <PageHeading
          title="Overview"
          info="Workspace health, pending work, and publishing status."
        />
        <button type="button" onClick={createNewForm} className="halo-copy-button">
          New form
          <ArrowIcon />
        </button>
      </header>

      <section className="halo-overview-kpi-grid" aria-label="Workspace metrics">
        <KpiCard
          label="Pending approval"
          value={fmt.format(pendingTestimonials.length)}
          detail="Testimonials waiting in Inbox"
          tone={pendingTestimonials.length ? "attention" : "good"}
        />
        <KpiCard
          label="Approved & live"
          value={fmt.format(approved.length)}
          detail="Available to widgets and walls"
          tone="good"
        />
        <KpiCard
          label="Active forms"
          value={fmt.format(activeForms.length)}
          detail={`${fmt.format(totalResponses)} total responses`}
        />
        <KpiCard
          label="30-day widget views"
          value={fmt.format(views)}
          detail={`${fmt.format(clicks)} CTA clicks`}
        />
      </section>

      <div className="halo-overview-grid">
        <OverviewPanel
          title="Needs attention"
          className="halo-overview-panel-large"
          action={
            <Link to="/dashboard/inbox" className="halo-overview-panel-action">
              Open Inbox
            </Link>
          }
        >
          {pendingTestimonials.length ? (
            <div className="halo-overview-list">
              {pendingTestimonials.slice(0, 3).map((testimonial) => (
                <PendingRow key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          ) : (
            <EmptyPanelMessage>Your inbox is clear.</EmptyPanelMessage>
          )}
        </OverviewPanel>

        <OverviewPanel
          title="Collection"
          action={
            <button type="button" onClick={createNewForm} className="halo-overview-panel-action">
              New form
            </button>
          }
        >
          <div className="halo-overview-mini-grid">
            <MiniStat label="Active forms" value={fmt.format(activeForms.length)} />
            <MiniStat label="Responses" value={fmt.format(totalResponses)} />
          </div>
          {topForm ? (
            <Link to={`/dashboard/forms/${topForm.id}`} className="halo-overview-highlight">
              <span>Top form</span>
              <strong>{topForm.name}</strong>
              <small>{fmt.format(topForm.responses ?? 0)} responses</small>
            </Link>
          ) : (
            <EmptyPanelMessage>No collection forms yet.</EmptyPanelMessage>
          )}
        </OverviewPanel>

        <OverviewPanel title="Publishing">
          <div className="halo-overview-readiness-list">
            <ReadinessItem
              label="Widget Studio"
              value={approved.length ? `${approved.length} approved testimonials ready` : "Approve a testimonial first"}
              ready={approved.length > 0}
              to="/dashboard/studio?mode=widgets"
            />
            <ReadinessItem
              label="Wall of Love"
              value={approved.length >= 3 ? "Enough proof for a wall" : "3+ approved testimonials recommended"}
              ready={approved.length >= 3}
              to="/dashboard/studio?mode=walls"
            />
          </div>
        </OverviewPanel>

        <OverviewPanel
          title="Performance"
          action={
            <Link to="/dashboard/analyze" className="halo-overview-panel-action">
              Analyze
            </Link>
          }
        >
          <div className="halo-overview-performance">
            <MiniStat label="Views" value={fmt.format(views)} />
            <MiniStat label="Clicks" value={fmt.format(clicks)} />
            <MiniStat label="Conversions" value={fmt.format(conversions)} />
          </div>
          <p className="halo-overview-note">Last 30 days, based on the current mock analytics model.</p>
        </OverviewPanel>
      </div>
    </div>
  );
}
