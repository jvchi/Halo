import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/cn";
import { TestimonialsProvider } from "@/lib/testimonialsStore.jsx";
import { FormsProvider } from "@/lib/formsStore.jsx";
import { BrandProvider, useBrand } from "@/lib/brandStore.jsx";
import { Logo } from "@/components/landing/Logo.jsx";
import { BrandMark } from "@/components/dashboard/BrandMark.jsx";
import { HaloIcon } from "@/components/dashboard/HaloIcon.jsx";

const dashboardSections = [
  {
    title: "Collect",
    items: [
      { to: "/dashboard/forms", label: "Forms", icon: "forms" },
      { to: "/dashboard/import", label: "Import", icon: "import" },
    ],
  },
  {
    title: "Manage",
    items: [
      { to: "/dashboard/proof", label: "Proof", icon: "proof" },
      { to: "/dashboard/feedback", label: "Feedback", icon: "feedback" },
      { to: "/dashboard/tags", label: "Tags", icon: "tags" },
    ],
  },
  {
    title: "Share",
    items: [
      {
        to: "/dashboard/studio",
        label: "Studio",
        icon: "studio",
        end: true,
        aliases: [
          "/dashboard/widget-studio",
          "/dashboard/walls",
          "/dashboard/studio/widgets",
          "/dashboard/studio/sizzle",
          "/dashboard/studio/social",
          "/dashboard/studio/popups",
          "/dashboard/studio/embeds",
          "/dashboard/studio/images",
          "/dashboard/studio/walls",
        ],
      },
      { to: "/dashboard/studio/brand", label: "Brand", icon: "brand", aliases: ["/dashboard/brand"] },
      { to: "/dashboard/rich-snippet", label: "Rich snippet", icon: "richSnippet" },
    ],
  },
  {
    title: "Analyze",
    items: [{ to: "/dashboard/analyze", label: "Analyze", icon: "analytics", aliases: ["/dashboard/analytics"] }],
  },
  {
    title: "Integrate",
    items: [{ to: "/dashboard/integrations", label: "Integrate Stripe", icon: "integrations" }],
  },
];

const settingsNavItem = { to: "/dashboard/settings", label: "Settings", icon: "settings" };
const hiddenRouteLabels = [
  { to: "/dashboard", label: "Overview", icon: "overview", end: true },
  { to: "/dashboard/inbox", label: "Inbox", icon: "feedback" },
  { to: "/dashboard/widget-studio", label: "Studio", icon: "studio" },
  { to: "/dashboard/walls", label: "Studio", icon: "walls" },
  { to: "/dashboard/brand", label: "Brand", icon: "brand" },
  { to: "/dashboard/analytics", label: "Analyze", icon: "analytics" },
];

export const dashboardNav = [
  ...dashboardSections.flatMap((section) => section.items),
  ...hiddenRouteLabels,
  settingsNavItem,
];

function WorkspaceSwitcher() {
  const { brand } = useBrand();

  return (
    <button type="button" className="halo-sidebar-workspace">
      <BrandMark brand={brand} size={36} className="halo-sidebar-brand-mark" />
      <span>
        <strong>{brand.workspaceName || "Workspace"}</strong>
        <small>Free plan</small>
      </span>
      <HaloIcon name="arrowRight" size={15} strokeWidth={1.8} className="halo-sidebar-workspace-caret" />
    </button>
  );
}

function UpgradeRow() {
  return (
    <Link to="/pricing" className="halo-sidebar-upgrade">
      <span className="halo-sidebar-icon">
        <HaloIcon name="star" size={16} strokeWidth={1.7} />
      </span>
      <span>Upgrade</span>
    </Link>
  );
}

function DashboardNavTree({ onNavigate }) {
  const location = useLocation();
  const isItemActive = (item, isActive) =>
    isActive ||
    item.aliases?.some((alias) => location.pathname === alias || location.pathname.startsWith(`${alias}/`));

  return (
    <nav className="halo-sidebar-nav">
      {dashboardSections.map((section) => (
        <section key={section.title} className="halo-sidebar-section" aria-label={section.title}>
          <p className="halo-sidebar-title">{section.title}</p>
          <div className="halo-sidebar-items">
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) => cn("halo-sidebar-link", isItemActive(item, isActive) && "is-active")}
              >
                <span className="halo-sidebar-icon">
                  <HaloIcon name={item.icon} size={16} strokeWidth={1.7} />
                </span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </section>
      ))}
    </nav>
  );
}

function SidebarBottom() {
  const { brand } = useBrand();

  return (
    <div className="halo-sidebar-bottom">
      <span className="halo-sidebar-bottom-name">{brand.workspaceName || "Workspace"}</span>
      <NavLink
        to={settingsNavItem.to}
        className={({ isActive }) => cn("halo-sidebar-settings", isActive && "is-active")}
        aria-label="Settings"
      >
        <HaloIcon name={settingsNavItem.icon} size={17} strokeWidth={1.7} />
      </NavLink>
    </div>
  );
}

export default function DashboardLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activePageLabel =
    [...dashboardNav].sort((a, b) => b.to.length - a.to.length).find((item) =>
      item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
    )?.label ?? "Dashboard";

  return (
    <BrandProvider>
    <TestimonialsProvider>
      <FormsProvider>
      <div className="halo-doc-shell">
        <header className="halo-doc-header">
          <div className="halo-doc-header-inner">
            <Link to="/" className="halo-doc-logo" aria-label="Halo home">
              <Logo />
              <span className="halo-doc-logo-divider" />
              <span className="halo-doc-logo-context">{activePageLabel}</span>
            </Link>

            <div className="halo-doc-actions">
              <div className="halo-mobile-menu-anchor">
                <button
                  type="button"
                  className="halo-mobile-menu-button"
                  aria-label={mobileMenuOpen ? "Close dashboard menu" : "Open dashboard menu"}
                  aria-expanded={mobileMenuOpen}
                  data-open={mobileMenuOpen}
                  onClick={() => setMobileMenuOpen((open) => !open)}
                />

                <AnimatePresence initial={false}>
                  {mobileMenuOpen ? (
                    <motion.div
                      className="halo-mobile-menu"
                      initial={{ opacity: 0, y: -4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ type: "spring", duration: 0.24, bounce: 0 }}
                    >
                      <WorkspaceSwitcher />
                      <UpgradeRow />
                      <DashboardNavTree onNavigate={() => setMobileMenuOpen(false)} />
                      <SidebarBottom />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <div className="halo-doc-body">
          <aside className="halo-doc-sidebar" aria-label="Dashboard navigation">
            <div className="halo-sidebar-scroll">
              <WorkspaceSwitcher />
              <UpgradeRow />
              <DashboardNavTree />
            </div>
            <SidebarBottom />
          </aside>

          <main className="halo-doc-main">
            <Outlet />
          </main>
        </div>
      </div>
      </FormsProvider>
    </TestimonialsProvider>
    </BrandProvider>
  );
}
