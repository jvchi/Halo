import { DashPage } from "./DashPage.jsx";
import { AnalyticsIcon } from "@/components/icons";

export default function Analytics() {
  return (
    <DashPage
      icon={<AnalyticsIcon size={28} />}
      title="Analytics"
      description="See whether your testimonials are being seen and clicked."
      emptyTitle="No data yet"
      emptyHint="Widget views, wall views, and CTA clicks will appear here once a widget is live."
      emptyIllustration="/illustrations/empty-analytics.png"
    />
  );
}
