import { useState } from "react";
import { cn } from "@/lib/cn";
import { PageHeading } from "@/components/ui";
import { HaloIcon, HaloIconChip } from "@/components/dashboard/HaloIcon.jsx";

const integrations = [
  {
    id: "slack",
    name: "Slack",
    icon: "slack",
    copy: "Send new testimonial and feedback alerts to a team channel.",
    automation: "Notify on new proof",
  },
  {
    id: "stripe",
    name: "Stripe",
    icon: "stripe",
    copy: "Request testimonials after successful payments, subscriptions, or invoices.",
    automation: "Payment-triggered invites",
  },
  {
    id: "zapier",
    name: "Zapier",
    icon: "zap",
    copy: "Move proof between Halo, CRMs, forms, support desks, and spreadsheets.",
    automation: "No-code workflows",
  },
  {
    id: "webhook",
    name: "Webhook",
    icon: "webhook",
    copy: "Post signed events to your app when testimonials are submitted or approved.",
    automation: "Developer endpoint",
  },
  {
    id: "api",
    name: "API",
    icon: "api",
    copy: "Read, create, moderate, and publish proof from your own product.",
    automation: "REST access",
  },
  {
    id: "mcp",
    name: "MCP",
    icon: "code",
    copy: "Expose approved proof and analytics to internal AI tools.",
    automation: "Agent-ready data",
  },
];

export default function Integrations() {
  const [connected, setConnected] = useState(() => new Set(["slack"]));
  const [active, setActive] = useState("slack");
  const selected = integrations.find((item) => item.id === active) ?? integrations[0];

  function toggle(id) {
    setConnected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="halo-page">
      <header className="halo-page-header">
        <PageHeading
          title="Integrations"
          info="Connect collection, moderation, notifications, and developer workflows."
        />
      </header>

      <section className="halo-integration-prompt">
        <HaloIconChip name="wand" size={20} />
        <div>
          <strong>Halo should automatically generate case studies for me.</strong>
          <p>Turn multi-step testimonials into case studies and notify your team when proof is ready.</p>
        </div>
      </section>

      <section className="halo-integration-workspace">
        <div className="halo-integration-tabs" aria-label="Integration tabs">
          {integrations.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item.id)}
              className={cn(active === item.id && "is-active")}
            >
              <HaloIcon name={item.icon} size={16} />
              {item.name}
            </button>
          ))}
        </div>

        <div className="halo-integration-body">
          <aside className="halo-integration-list" aria-label="Integration status">
            {integrations.map((item) => {
              const isConnected = connected.has(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(item.id)}
                  className={cn("halo-integration-card", active === item.id && "is-active")}
                >
                  <HaloIconChip name={item.icon} size={20} />
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.automation}</small>
                  </span>
                  <em data-connected={isConnected}>{isConnected ? "Connected" : "Available"}</em>
                </button>
              );
            })}
          </aside>

          <section className="halo-panel">
          <header className="halo-panel-header">
            <span>{selected.name}</span>
            <small>{selected.automation}</small>
          </header>
          <div className="halo-integration-detail">
            <HaloIconChip name={selected.icon} size={26} />
            <p>{selected.copy}</p>
            <button type="button" className="halo-copy-button" onClick={() => toggle(selected.id)}>
              {connected.has(selected.id) ? "Disconnect" : "Connect"}
            </button>
          </div>
          <div className="halo-check-list">
            <p><HaloIcon name="check" size={16} /> Trigger invite flows from external events.</p>
            <p><HaloIcon name="check" size={16} /> Route new proof into Inbox before publishing.</p>
            <p><HaloIcon name="check" size={16} /> Sync approved testimonials back to your stack.</p>
          </div>
          </section>
        </div>
      </section>
    </div>
  );
}
