import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/cn";
import { TestimonialsProvider } from "@/lib/testimonialsStore.jsx";
import { Logo } from "@/components/landing/Logo.jsx";

const dashboardSections = [
  {
    title: "Workspace",
    items: [{ to: "/dashboard", label: "Overview", icon: "overview", end: true }],
  },
  {
    title: "Review",
    items: [{ to: "/dashboard/inbox", label: "Inbox", icon: "inbox" }],
  },
  {
    title: "Build",
    items: [
      { to: "/dashboard/widget-studio", label: "Widget Studio", icon: "studio" },
      { to: "/dashboard/walls", label: "Walls", icon: "walls" },
    ],
  },
  {
    title: "Measure",
    items: [{ to: "/dashboard/analytics", label: "Analytics", icon: "analytics" }],
  },
];

export const dashboardNav = dashboardSections.flatMap((section) => section.items);

function SidebarIcon({ name }) {
  const paths = {
    overview: (
      <>
        <path d="M3 11.5h10" />
        <path d="M4 8.5l2.5-3 2 2 3-3.5" />
        <path d="M3.5 2.5h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z" />
      </>
    ),
    inbox: (
      <>
        <path d="M3 3.5h10l1 5v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-4l1-5Z" />
        <path d="M2.25 8.5H5l1 2h4l1-2h2.75" />
      </>
    ),
    studio: (
      <>
        <path d="M8 2.5v11" />
        <path d="M3 4.5h10" />
        <path d="M4.5 8h7" />
        <path d="M5.5 11.5h5" />
      </>
    ),
    walls: (
      <>
        <path d="M3 3.5h4v4H3z" />
        <path d="M9 3.5h4v4H9z" />
        <path d="M3 9.5h4v4H3z" />
        <path d="M9 9.5h4v4H9z" />
      </>
    ),
    analytics: (
      <>
        <path d="M3 13.5V8" />
        <path d="M8 13.5V3" />
        <path d="M13 13.5V6" />
        <path d="M2 13.5h12" />
      </>
    ),
  };

  return (
    <span className="halo-sidebar-icon" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <g
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.45"
        >
          {paths[name]}
        </g>
      </svg>
    </span>
  );
}

function MenuIcon({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      {open ? (
        <>
          <path d="M4 4l8 8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
          <path d="M12 4l-8 8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
        </>
      ) : (
        <>
          <path d="M3 5h10" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
          <path d="M3 11h10" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
        </>
      )}
    </svg>
  );
}

function DashboardNavTree({ onNavigate }) {
  return (
    <nav className="halo-sidebar-nav">
      <div className="halo-sidebar-items">
        {dashboardNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) => cn("halo-sidebar-link", isActive && "is-active")}
          >
            <SidebarIcon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default function DashboardLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <TestimonialsProvider>
      <div className="halo-doc-shell">
        <header className="halo-doc-header">
          <div className="halo-doc-header-inner">
            <Link to="/" className="halo-doc-logo" aria-label="Halo home">
              <Logo />
              <span className="halo-doc-logo-divider" />
              <span className="halo-doc-logo-context">Dashboard</span>
            </Link>

            <div className="halo-doc-actions">
              <div className="halo-mobile-menu-anchor">
                <button
                  type="button"
                  className="halo-mobile-menu-button"
                  aria-label={mobileMenuOpen ? "Close dashboard menu" : "Open dashboard menu"}
                  aria-expanded={mobileMenuOpen}
                  onClick={() => setMobileMenuOpen((open) => !open)}
                >
                  <MenuIcon open={mobileMenuOpen} />
                </button>

                <AnimatePresence initial={false}>
                  {mobileMenuOpen ? (
                    <motion.div
                      className="halo-mobile-menu"
                      initial={{ opacity: 0, y: -4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ type: "spring", duration: 0.24, bounce: 0 }}
                    >
                      <DashboardNavTree onNavigate={() => setMobileMenuOpen(false)} />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <div className="halo-doc-body">
          <aside className="halo-doc-sidebar" aria-label="Dashboard navigation">
            <DashboardNavTree />
            <div className="halo-sidebar-footnote">
              <span>Halo workspace</span>
              <span>Free plan</span>
            </div>
          </aside>

          <main className="halo-doc-main">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ type: "spring", duration: 0.3, bounce: 0 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </TestimonialsProvider>
  );
}
