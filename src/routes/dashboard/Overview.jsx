import { Link } from "react-router-dom";
import { Card, Grid, Stat, Button, IllustratedEmptyState } from "@/components/ui";
import { CollectIcon, WidgetStudioIcon, WallOfLoveIcon } from "@/components/icons";
import { useTestimonials } from "@/lib/testimonialsStore.jsx";

const actions = [
  { to: "/dashboard/inbox", Icon: CollectIcon, title: "Collect testimonials", hint: "Share a public form link." },
  { to: "/dashboard/widget-studio", Icon: WidgetStudioIcon, title: "Design a widget", hint: "Pick a preset and embed." },
  { to: "/dashboard/walls", Icon: WallOfLoveIcon, title: "Publish a wall", hint: "A hosted Wall of Love page." },
];

export default function Overview() {
  const { testimonials, approved } = useTestimonials();
  const stats = [
    { value: String(testimonials.length), label: "Testimonials collected" },
    { value: String(testimonials.filter((t) => t.status === "pending").length), label: "Pending approval" },
    { value: String(approved.length), label: "Approved & live" },
  ];

  return (
    <div className="grid gap-10">
      <div className="grid gap-1">
        <h1 className="m-0 text-[26px] font-medium tracking-[-0.02em] text-halo-fg-1">Welcome to Halo</h1>
        <p className="m-0 text-[15px] text-halo-fg-2">
          Collect, approve, design, and publish premium testimonial widgets.
        </p>
      </div>

      {testimonials.length === 0 ? (
        <IllustratedEmptyState
          illustration="/illustrations/empty-overview.png"
          title="Start with your first testimonial"
          hint="Collect or add one testimonial, approve it, then design the first widget."
        />
      ) : null}

      <Grid variant="auto">
        {stats.map((s) => (
          <Card key={s.label}>
            <Stat value={s.value} label={s.label} />
          </Card>
        ))}
      </Grid>

      <Grid variant="auto">
        {actions.map(({ to, Icon, title, hint }) => (
          <Card key={to} variant="glass" className="ring-1 ring-halo-border-1">
            <div className="grid gap-4">
              <Icon size={40} />
              <div className="grid gap-1">
                <p className="m-0 text-[16px] font-medium text-halo-fg-1">{title}</p>
                <p className="m-0 text-[14px] text-halo-fg-3">{hint}</p>
              </div>
              <Button as={Link} to={to} variant="secondary" className="justify-self-start">
                Open
              </Button>
            </div>
          </Card>
        ))}
      </Grid>
    </div>
  );
}
