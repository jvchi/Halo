import { useEffect, useRef } from "react";
import { NavLink, Link, Outlet } from "react-router-dom";
import { defineElement } from "@lordicon/element";
import { cn } from "@/lib/cn";
import { TestimonialsProvider } from "@/lib/testimonialsStore.jsx";
import { Logo } from "@/components/landing/Logo.jsx";

export const dashboardNav = [
  {
    to: "/dashboard",
    label: "Overview",
    icon: "/lordicons/system-regular/33-speed.json",
    introState: "in-speed",
    hoverState: "hover-speed",
    end: true,
  },
  {
    to: "/dashboard/inbox",
    label: "Inbox",
    icon: "/lordicons/system-regular/9-inbox.json",
    introState: "in-inbox",
    hoverState: "hover-inbox",
  },
  {
    to: "/dashboard/widget-studio",
    label: "Widget Studio",
    icon: "/lordicons/system-regular/63-settings-cog.json",
    introState: "in-cog",
    hoverState: "hover-cog-1",
  },
  {
    to: "/dashboard/walls",
    label: "Walls",
    icon: "/lordicons/system-regular/48-favorite-heart.json",
    introState: "in-reveal",
    hoverState: "hover-pinch",
  },
  {
    to: "/dashboard/analytics",
    label: "Analytics",
    icon: "/lordicons/system-regular/10-analytics.json",
    introState: "in-analytics",
    hoverState: "hover-analytics",
  },
];

let lordiconElementDefined = false;

function defineLordiconElement() {
  if (lordiconElementDefined || typeof window === "undefined") return;
  defineElement();
  lordiconElementDefined = true;
}

function NavLordicon({ src, introState, hoverState }) {
  const iconRef = useRef(null);

  useEffect(() => {
    defineLordiconElement();
  }, []);

  useEffect(() => {
    const icon = iconRef.current;
    if (!icon) return undefined;
    const target = icon.closest("[data-dashboard-nav-item]") ?? icon;

    let playedIntro = false;
    const playState = (state) => {
      const player = icon.playerInstance;
      if (!player) return;
      player.loop = false;
      player.direction = 1;
      player.state = state;
      player.playFromStart();
    };
    const playIntro = () => {
      if (playedIntro) return;
      playedIntro = true;
      playState(introState);
    };
    const playHover = () => playState(hoverState);

    if (icon.ready) {
      playIntro();
    } else {
      icon.addEventListener("ready", playIntro, { once: true });
    }

    target.addEventListener("mouseenter", playHover);
    target.addEventListener("click", playHover);

    return () => {
      icon.removeEventListener("ready", playIntro);
      target.removeEventListener("mouseenter", playHover);
      target.removeEventListener("click", playHover);
    };
  }, [hoverState, introState]);

  return (
    <lord-icon
      ref={iconRef}
      src={src}
      state={introState}
      className="h-6 w-6 shrink-0 bg-transparent"
      style={{ width: "24px", height: "24px" }}
      aria-hidden="true"
    />
  );
}

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
            {dashboardNav.map(({ to, label, icon, introState, hoverState, end }) => (
              <NavLink key={to} to={to} end={end}>
                {({ isActive }) => (
                  <span
                    data-dashboard-nav-item
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] font-medium whitespace-nowrap transition-colors",
                      isActive ? "bg-halo-bg-1 text-halo-fg-1" : "text-halo-fg-2 hover:bg-halo-bg-4"
                    )}
                  >
                    <NavLordicon src={icon} introState={introState} hoverState={hoverState} />
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
