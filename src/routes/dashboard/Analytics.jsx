import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { PageHeading } from "@/components/ui";
import { Segmented } from "@/components/dashboard/inspector.jsx";
import { useTestimonials } from "@/lib/testimonialsStore.jsx";
import { buildAnalytics, RANGES } from "@/lib/analytics.js";
import { AreaChart, ActivityRings, Sparkline, Bars, Delta, fmt } from "@/components/analytics/charts.jsx";

// Soft accent wash, the design system's existing gradient language (cf.
// .halo-workflow-panel) — low-opacity primary, not a loud gradient.
const RING_PANEL_BG =
  "radial-gradient(120% 90% at 50% 0%, color-mix(in srgb, var(--halo-primary) 9%, transparent), transparent 62%), var(--halo-bg-1)";

function Panel({ title, subtitle, children, style, className }) {
  return (
    <section
      className={cn("rounded-[8px] border border-halo-border-1 p-5", className)}
      style={style}
    >
      <header className="mb-4 grid gap-0.5">
        <span className="text-[13px] font-medium text-halo-fg-1">{title}</span>
        {subtitle ? <span className="text-[12px] text-halo-fg-3">{subtitle}</span> : null}
      </header>
      {children}
    </section>
  );
}

function MetricCard({ metric }) {
  return (
    <div className="grid gap-2 rounded-[8px] bg-halo-bg-3 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] text-halo-fg-2">{metric.label}</span>
        <Delta value={metric.delta} />
      </div>
      <p className="m-0 text-[26px] font-medium leading-none tracking-[-0.04em] text-halo-fg-1 tabular-nums">
        {fmt(metric.value)}
      </p>
      <div className="mt-1">
        <Sparkline data={metric.series} />
      </div>
    </div>
  );
}

export default function Analytics() {
  const { approved } = useTestimonials();
  const [range, setRange] = useState(30);
  const data = useMemo(() => buildAnalytics(range, approved), [range, approved]);

  return (
    <div className="halo-page">
      <header className="halo-page-header">
        <PageHeading title="Analytics" info="See whether your testimonials are being seen and clicked." />
        <Segmented options={RANGES} value={range} onChange={setRange} />
      </header>

      <div className="grid grid-cols-4 gap-3 max-lg:grid-cols-2">
        {data.metrics.map((m) => (
          <MetricCard key={m.key} metric={m} />
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.7fr_1fr]">
        <Panel title="Widget views" subtitle={`Last ${range} days`} className="bg-halo-bg-1">
          <AreaChart series={data.series} ticks={data.ticks} />
        </Panel>

        <Panel title="Goals" subtitle="Progress toward this period's targets" style={{ background: RING_PANEL_BG }}>
          <div className="grid place-items-center gap-5 py-1">
            <ActivityRings rings={data.rings} />
            <div className="grid w-full gap-2.5">
              {data.rings.map((r) => (
                <div key={r.label} className="flex items-center justify-between gap-3 text-[13px]">
                  <span className="flex items-center gap-2 text-halo-fg-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color }} />
                    {r.label}
                  </span>
                  <span className="tabular-nums text-halo-fg-1">
                    {Math.round(Math.min(1, r.value / r.goal) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Top testimonials" subtitle="By widget views" className="bg-halo-bg-1">
          <Bars
            items={data.topTestimonials.map((t) => ({ id: t.id, label: t.name, sub: t.company, value: t.views }))}
          />
        </Panel>
        <Panel title="Views by source" subtitle="Where impressions come from" className="bg-halo-bg-1">
          <Bars items={data.sources} accent="var(--halo-teal)" />
        </Panel>
      </div>
    </div>
  );
}
