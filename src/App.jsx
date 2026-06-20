import { Routes, Route, Link } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { IllustratedEmptyState } from "@/components/ui";
import Landing from "@/routes/Landing.jsx";
import Pricing from "@/routes/Pricing.jsx";
import Templates from "@/routes/Templates.jsx";
import DashboardLayout from "@/routes/dashboard/DashboardLayout.jsx";
import Overview from "@/routes/dashboard/Overview.jsx";
import Inbox from "@/routes/dashboard/Inbox.jsx";
import WidgetStudio from "@/routes/dashboard/WidgetStudio.jsx";
import Walls from "@/routes/dashboard/Walls.jsx";
import Analytics from "@/routes/dashboard/Analytics.jsx";

function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 py-12 text-center">
      <IllustratedEmptyState
        illustration="/illustrations/404-lost-page.png"
        title="Page not found"
        hint="This route does not exist in Halo."
        className="border-0 bg-transparent py-0"
        imageClassName="w-[min(320px,80vw)]"
      >
        <Link to="/" className="mt-1 text-[14px] font-medium text-halo-primary underline underline-offset-4">
          Back to Halo
        </Link>
      </IllustratedEmptyState>
    </main>
  );
}

export default function App() {
  // reducedMotion="user" makes every Motion animation honor prefers-reduced-motion.
  return (
    <MotionConfig reducedMotion="user">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="widget-studio" element={<WidgetStudio />} />
          <Route path="walls" element={<Walls />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MotionConfig>
  );
}
