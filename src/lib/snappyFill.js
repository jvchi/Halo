import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import "./snappyFill.css";

gsap.registerPlugin(CustomEase);

// Design-system "snappy" easing — the same cubic-bezier(0.175, 0.885, 0.32, 1.1)
// as --halo-ease-snappy / Tailwind ease-snappy, expressed as a CustomEase curve.
const SNAPPY = CustomEase.create("haloSnappy", "M0,0 C0.175,0.885 0.32,1.1 1,1");

// Snappy fill is opt-in. It mutates the host by wrapping its children in a label
// layer, so applying it to every native <button> breaks segmented controls,
// swatches, profile controls, and card-like dashboard components.
const SELECTOR = ".halo-btn, [data-snappy-fill]";

const EXCLUDED_ROLES = new Set([
  "switch",
  "radio",
  "checkbox",
  "tab",
  "menuitem",
  "menuitemradio",
  "menuitemcheckbox",
]);

function isExcluded(el) {
  if (el.closest("[data-no-fill]")) return true;
  const role = el.getAttribute("role");
  if (role && EXCLUDED_ROLES.has(role)) return true;
  // aria-expanded => disclosure/accordion/menu trigger; aria-pressed => toggle.
  if (el.hasAttribute("aria-expanded") || el.hasAttribute("aria-pressed")) return true;
  return el.matches(
    '.halo-inspector-row, .halo-inspector-toggle, [class*="collapsibleButton"]'
  );
}

const prefersReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// One controller per host, created lazily on first hover and cached.
const hosts = new WeakMap();

function ensureLabelLayer(host, fill) {
  if (host.querySelector(":scope > .halo-btn-label")) return;

  const label = document.createElement("span");
  label.className = "halo-btn-label";

  for (const child of [...host.childNodes]) {
    if (child !== fill) label.appendChild(child);
  }

  host.insertBefore(label, fill);
}

function ensure(host) {
  let api = hosts.get(host);
  if (api) return api;

  host.classList.add("is-snappy-fill");
  let fill = host.querySelector(":scope > .halo-fill");
  if (!fill) {
    fill = document.createElement("span");
    fill.className = "halo-fill";
    fill.setAttribute("aria-hidden", "true");
    host.appendChild(fill);
  }
  ensureLabelLayer(host, fill);

  // GSAP owns the transform: xPercent/yPercent keep the circle centered on its
  // left/top point; scale is what animates 0 -> 1.
  gsap.set(fill, { xPercent: -50, yPercent: -50, scale: 0 });

  // quickSetter writes left/top (as % of the host) directly each frame — no new
  // tween per pointermove.
  const setX = gsap.quickSetter(fill, "left", "%");
  const setY = gsap.quickSetter(fill, "top", "%");

  let exitTween;
  let lx = 50; // last cursor position as 0-100% of the host
  let ly = 50;

  const track = (e) => {
    const r = host.getBoundingClientRect();
    if (!r.width || !r.height) return;
    lx = ((e.clientX - r.left) / r.width) * 100;
    ly = ((e.clientY - r.top) / r.height) * 100;
  };

  const enter = (e) => {
    if (host.disabled || host.getAttribute("aria-disabled") === "true") return;
    exitTween?.kill();
    track(e);
    setX(lx);
    setY(ly);
    // Scale in from the cursor position.
    gsap.to(fill, {
      scale: 1,
      duration: prefersReduced() ? 0 : 0.45,
      ease: SNAPPY,
      overwrite: true,
    });
  };

  const move = (e) => {
    track(e);
    setX(lx);
    setY(ly);
  };

  const leave = () => {
    if (prefersReduced()) {
      gsap.set(fill, { scale: 0 });
      return;
    }
    // Scale out while exiting toward whichever edge the cursor is nearest.
    const toLeft = lx;
    const toRight = 100 - lx;
    const toTop = ly;
    const toBottom = 100 - ly;
    const min = Math.min(toLeft, toRight, toTop, toBottom);
    const ex = min === toLeft ? 0 : min === toRight ? 100 : lx;
    const ey = min === toTop ? 0 : min === toBottom ? 100 : ly;
    exitTween = gsap.to(fill, {
      left: `${ex}%`,
      top: `${ey}%`,
      scale: 0,
      duration: 0.4,
      ease: "power3.out",
      overwrite: true,
    });
  };

  host.addEventListener("pointermove", move);
  host.addEventListener("pointerleave", leave);

  api = { enter };
  hosts.set(host, api);
  return api;
}

let started = false;

// Attaches the effect to every qualifying button via event delegation, so it
// covers React buttons and the embedded (non-React) header CTAs alike, plus any
// buttons mounted later. Call once.
export function initSnappyFill() {
  if (started || typeof document === "undefined") return;
  started = true;

  // pointerenter/leave don't bubble, so we delegate via pointerover and treat a
  // crossing into the host (relatedTarget outside it) as an enter.
  document.addEventListener("pointerover", (e) => {
    const host = e.target.closest?.(SELECTOR);
    if (!host || isExcluded(host)) return;
    if (e.relatedTarget && host.contains(e.relatedTarget)) return; // internal move
    ensure(host).enter(e);
  });
}
