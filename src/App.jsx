import { Routes, Route, Link, Navigate } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { IllustratedEmptyState } from "@/components/ui";
import Landing from "@/routes/Landing.jsx";
import Pricing from "@/routes/Pricing.jsx";
import Templates from "@/routes/Templates.jsx";
import DashboardLayout from "@/routes/dashboard/DashboardLayout.jsx";
import Overview from "@/routes/dashboard/Overview.jsx";
import Forms from "@/routes/dashboard/Forms.jsx";
import Import from "@/routes/dashboard/Import.jsx";
import FormBuilder from "@/routes/dashboard/FormBuilder.jsx";
import Inbox from "@/routes/dashboard/Inbox.jsx";
import Proof from "@/routes/dashboard/Proof.jsx";
import Feedback from "@/routes/dashboard/Feedback.jsx";
import Tags from "@/routes/dashboard/Tags.jsx";
import Studio from "@/routes/dashboard/Studio.jsx";
import StudioEditor from "@/routes/dashboard/StudioEditor.jsx";
import WidgetStudio from "@/routes/dashboard/WidgetStudio.jsx";
import Walls from "@/routes/dashboard/Walls.jsx";
import BrandKit from "@/routes/dashboard/BrandKit.jsx";
import RichSnippet from "@/routes/dashboard/RichSnippet.jsx";
import Analyze from "@/routes/dashboard/Analyze.jsx";
import Analytics from "@/routes/dashboard/Analytics.jsx";
import Integrations from "@/routes/dashboard/Integrations.jsx";
import Settings from "@/routes/dashboard/Settings.jsx";
import PublicForm from "@/routes/PublicForm.jsx";
import PublicWidget from "@/routes/PublicWidget.jsx";
import PublicWall from "@/routes/PublicWall.jsx";

function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 py-12 text-center">
      <IllustratedEmptyState
        icon="unknown"
        title="Page not found"
        className="border-0 bg-transparent py-0"
        iconClassName="w-[min(260px,70vw)]"
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
        <Route path="/submit/:formSlug" element={<PublicForm />} />
        <Route path="/embed/widgets/:widgetSlug" element={<PublicWidget />} />
        <Route path="/walls/:wallSlug" element={<PublicWall />} />
        <Route path="/w/:workspaceSlug" element={<PublicWall byWorkspace />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="proof" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="forms" element={<Forms />} />
          <Route path="import" element={<Import />} />
          <Route path="import/:methodId" element={<Import />} />
          <Route path="forms/:formId" element={<FormBuilder />} />
          <Route path="proof" element={<Proof />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="tags" element={<Tags />} />
          <Route path="studio" element={<Studio />} />
          <Route path="studio/brand" element={<BrandKit />} />
          <Route path="studio/:assetType/:assetId" element={<StudioEditor />} />
          <Route path="widget-studio" element={<WidgetStudio />} />
          <Route path="walls" element={<Walls />} />
          <Route path="brand" element={<BrandKit />} />
          <Route path="rich-snippet" element={<RichSnippet />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="analyze" element={<Analyze />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/:settingsTab" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MotionConfig>
  );
}
