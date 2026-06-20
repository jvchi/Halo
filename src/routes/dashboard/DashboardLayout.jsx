import { NavLink, Link, Outlet } from "react-router-dom";
import { cn } from "@/lib/cn";
import { TestimonialsProvider } from "@/lib/testimonialsStore.jsx";
import { Logo } from "@/components/landing/Logo.jsx";
import {
  LivePreviewIcon,
  CollectIcon,
  WidgetStudioIcon,
  WallOfLoveIcon,
  AnalyticsIcon,
} from "@/components/icons";

export const dashboardNav = [
  { to: "/dashboard", label: "Overview", Icon: LivePreviewIcon, end: true },
  { to: "/dashboard/inbox", label: "Inbox", Icon: CollectIcon },
  { to: "/dashboard/widget-studio", label: "Widget Studio", Icon: WidgetStudioIcon },
  { to: "/dashboard/walls", label: "Walls", Icon: WallOfLoveIcon },
  { to: "/dashboard/analytics", label: "Analytics", Icon: AnalyticsIcon },
];

export default function DashboardLayout() {
  return (
    <TestimonialsProvider>
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="shrink-0 border-b border-halo-border-1 bg-halo-bg-3 md:w-[248px] md:border-b-0 md:border-r">
        <div className="sticky top-0 flex flex-col gap-6 p-5 md:h-screen">
          <Link to="/" aria-label="Halo home">
            <Logo />
          </Link>
          <nav className="flex gap-1 overflow-x-auto md:flex-col">
            {dashboardNav.map(({ to, label, Icon, end }) => (
              <NavLink key={to} to={to} end={end}>
                {({ isActive }) => (
                  <span
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] font-medium whitespace-nowrap transition-colors",
                      isActive ? "bg-halo-bg-1 text-halo-fg-1" : "text-halo-fg-2 hover:bg-halo-bg-4"
                    )}
                  >
                    <Icon size={24} state={isActive ? "active" : "idle"} />
                    {label}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto hidden text-[12px] text-halo-fg-3 md:block">
            Halo workspace · Free plan
          </div>
        </div>
      </aside>

      <main className="flex-1 px-8 py-10 max-md:px-5 max-md:py-8">
        <div className="mx-auto max-w-content">
          <Outlet />
        </div>
      </main>
    </div>
    </TestimonialsProvider>
  );
}
