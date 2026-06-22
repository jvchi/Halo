import { Link } from "react-router-dom";
import { Shell, Section, SectionInner, Grid, Card, Button, HeadingXL, Kicker } from "@/components/ui";
import { Logo } from "@/components/landing/Logo.jsx";

// Placeholder pricing built from the blueprint (§6.14). New product surface, so
// it uses the Halo design system rather than the cloned reference.
const plans = [
  { name: "Free", price: "$0", note: "1 workspace, 1 wall, 2 widgets, 15 testimonials. Branding included.", cta: "Start free" },
  { name: "Starter", price: "$19", note: "More testimonials and widgets, remove branding, basic analytics.", cta: "Choose Starter" },
  { name: "Pro", price: "$49", note: "AI brand matcher, screenshot imports, custom domains, video.", cta: "Choose Pro", featured: true },
  { name: "Agency", price: "$99", note: "Multiple workspaces, client management, team seats, white label.", cta: "Choose Agency" },
];

export default function Pricing() {
  return (
    <>
      <header>
        <Shell className="flex min-h-[72px] items-center">
          <Link to="/" aria-label="Halo home">
            <Logo />
          </Link>
        </Shell>
      </header>

      <main>
        <Section>
          <SectionInner className="flex flex-col items-center gap-6 text-center">
            <Kicker>Pricing</Kicker>
            <HeadingXL as="h1" className="mx-auto">
              Start free. Upgrade when it earns its keep.
            </HeadingXL>
          </SectionInner>
          <SectionInner>
            <Grid variant="auto" className="mt-20 max-md:mt-12">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={plan.featured ? "bg-halo-bg-1 ring-2 ring-halo-primary" : "bg-halo-bg-1 ring-1 ring-halo-border-1"}
                >
                  <div className="grid gap-4">
                    <p className="m-0 text-[16px] font-medium text-halo-fg-1">{plan.name}</p>
                    <p className="m-0 text-[40px] font-medium tracking-[-0.03em] text-halo-fg-1">
                      {plan.price}
                      <span className="text-[15px] font-normal text-halo-fg-3"> /mo</span>
                    </p>
                    <p className="m-0 text-[15px] leading-[1.5] text-halo-fg-2">{plan.note}</p>
                    <Button as={Link} to="/dashboard" variant={plan.featured ? "primary" : "secondary"}>
                      {plan.cta}
                    </Button>
                  </div>
                </Card>
              ))}
            </Grid>
          </SectionInner>
        </Section>
      </main>
    </>
  );
}
