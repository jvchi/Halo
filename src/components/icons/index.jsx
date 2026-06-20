import { useId } from "react";
import { cn } from "@/lib/cn";
import "./icons.css";

// Animated testimonial icons, ported 1:1 from the legacy SVG pack. Each icon
// shares a transparent 48px tile + title/desc; only the inner geometry differs.
// Pass state="active" (hover/selected) or "paused" to control motion.

function stateClass(state) {
  if (state === "active") return "is-active";
  if (state === "paused") return "is-paused";
  return "is-idle";
}

function IconFrame({ variant, title, desc, state = "idle", size = 48, className, children }) {
  const uid = useId();
  return (
    <svg
      className={cn("ta-icon", `ta-icon--${variant}`, stateClass(state), className)}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-labelledby={`${uid}-t ${uid}-d`}
    >
      <title id={`${uid}-t`}>{title}</title>
      <desc id={`${uid}-d`}>{desc}</desc>
      <rect className="frame" x="0.5" y="0.5" width="47" height="47" rx="3.5" />
      {children}
    </svg>
  );
}

export function CollectIcon(props) {
  const m = useId();
  return (
    <IconFrame variant="collect" title="Collect testimonials" desc="Two bold rounded testimonial cards stacked inside a soft tile." {...props}>
      <defs>
        <mask id={m} maskUnits="userSpaceOnUse">
          <path d="M11 21C11 18.7909 12.7909 17 15 17H31C33.2091 17 35 18.7909 35 21V31C35 33.2091 33.2091 35 31 35H22L16 39V35H15C12.7909 35 11 33.2091 11 31V21Z" fill="#fff" />
          <rect x="16" y="23" width="13" height="4" rx="2" fill="#000" />
          <rect x="16" y="29" width="9" height="4" rx="2" fill="#000" />
        </mask>
      </defs>
      <rect className="purple-soft motion-b" x="15" y="11" width="22" height="20" rx="5" />
      <path className="purple motion-a" mask={`url(#${m})`} d="M11 21C11 18.7909 12.7909 17 15 17H31C33.2091 17 35 18.7909 35 21V31C35 33.2091 33.2091 35 31 35H22L16 39V35H15C12.7909 35 11 33.2091 11 31V21Z" />
    </IconFrame>
  );
}

export function ApproveIcon(props) {
  const m = useId();
  return (
    <IconFrame variant="approve" title="Approve testimonial" desc="A bold shield with a filled approval mark." {...props}>
      <defs>
        <mask id={m} maskUnits="userSpaceOnUse">
          <rect width="48" height="48" fill="#fff" />
          <path d="M20.8 28.2L16.7 24.1C15.9 23.3 15.9 22.1 16.7 21.3C17.5 20.5 18.7 20.5 19.5 21.3L22.1 23.9L29.3 16.7C30.1 15.9 31.3 15.9 32.1 16.7C32.9 17.5 32.9 18.7 32.1 19.5L23.5 28.1C22.8 28.9 21.6 28.9 20.8 28.2Z" fill="#000" />
        </mask>
      </defs>
      <g mask={`url(#${m})`}>
        <path className="teal motion-b" d="M13 14.5C13 12.567 14.567 11 16.5 11H31.5C33.433 11 35 12.567 35 14.5V25.2C35 32.4 29.4 36.6 24 38C18.6 36.6 13 32.4 13 25.2V14.5Z" />
        <path className="teal-soft motion-a" d="M24 11H31.5C33.433 11 35 12.567 35 14.5V25.2C35 32.4 29.4 36.6 24 38V11Z" />
      </g>
    </IconFrame>
  );
}

export function WidgetStudioIcon(props) {
  return (
    <IconFrame variant="studio" title="Widget studio" desc="Three bold vertical style controls with rounded ends." {...props}>
      <rect className="blue motion-a" x="10" y="12" width="10" height="25" rx="3" />
      <rect className="purple motion-b" x="23" y="12" width="7" height="25" rx="2.5" />
      <rect className="purple-soft motion-c" x="34" y="12" width="4" height="25" rx="2" />
    </IconFrame>
  );
}

export function EmbedIcon(props) {
  return (
    <IconFrame variant="embed" title="Embed widget" desc="Two chunky code brackets wrapping an embed space." {...props}>
      <path className="purple motion-a" d="M19 12C20.1046 12 21 12.8954 21 14V18C21 19.1046 20.1046 20 19 20H16V28H19C20.1046 28 21 28.8954 21 30V34C21 35.1046 20.1046 36 19 36H14C11.7909 36 10 34.2091 10 32V16C10 13.7909 11.7909 12 14 12H19Z" />
      <path className="blue motion-b" d="M29 12C27.8954 12 27 12.8954 27 14V18C27 19.1046 27.8954 20 29 20H32V28H29C27.8954 28 27 28.8954 27 30V34C27 35.1046 27.8954 36 29 36H34C36.2091 36 38 34.2091 38 32V16C38 13.7909 36.2091 12 34 12H29Z" />
    </IconFrame>
  );
}

export function WallOfLoveIcon(props) {
  return (
    <IconFrame variant="wall" title="Wall of love" desc="Two bold stacked love-wall arches." {...props}>
      <path className="purple-soft motion-b" d="M12 24C11.4477 24 11 23.5523 11 23C11 19.5522 12.3696 16.2456 14.8076 13.8076C17.2456 11.3696 20.5522 10 24 10C27.4478 10 30.7544 11.3696 33.1924 13.8076C35.6304 16.2456 37 19.5522 37 23C37 23.5523 36.5523 24 36 24H31C30.4477 24 30.0138 23.5481 29.9051 23.0066C29.6559 21.7656 29.0461 20.6191 28.1421 19.7151C27.042 18.615 25.5505 17.997 23.9946 17.997C22.4387 17.997 20.9472 18.615 19.8471 19.7151C18.9431 20.6191 18.3333 21.7656 18.0841 23.0066C17.9754 23.5481 17.5415 24 16.9892 24H12Z" />
      <path className="purple motion-a" d="M12 39C11.4477 39 11 38.5523 11 38C11 34.5522 12.3696 31.2456 14.8076 28.8076C17.2456 26.3696 20.5522 25 24 25C27.4478 25 30.7544 26.3696 33.1924 28.8076C35.6304 31.2456 37 34.5522 37 38C37 38.5523 36.5523 39 36 39H31C30.4477 39 30.0138 38.5481 29.9051 38.0066C29.6559 36.7656 29.0461 35.6191 28.1421 34.7151C27.042 33.615 25.5505 32.997 23.9946 32.997C22.4387 32.997 20.9472 33.615 19.8471 34.7151C18.9431 35.6191 18.3333 36.7656 18.0841 38.0066C17.9754 38.5481 17.5415 39 16.9892 39H12Z" />
    </IconFrame>
  );
}

export function AnalyticsIcon(props) {
  return (
    <IconFrame variant="analytics" title="Analytics" desc="Three bold vertical analytics bars." {...props}>
      <rect className="blue motion-a" x="10" y="22" width="10" height="16" rx="3" />
      <rect className="blue-soft motion-b" x="23" y="14" width="7" height="24" rx="2.5" />
      <rect className="purple motion-c" x="34" y="18" width="4" height="20" rx="2" />
    </IconFrame>
  );
}

export function AiBrandMatchIcon(props) {
  return (
    <IconFrame variant="ai" title="AI brand match" desc="A soft rounded AI twinkle mark." {...props}>
      <rect className="purple-soft motion-b" x="21" y="8" width="7" height="32" rx="3.5" />
      <rect className="purple motion-a" x="8" y="21" width="32" height="7" rx="3.5" />
      <circle className="blue-soft motion-c" cx="24.5" cy="24.5" r="5.5" />
    </IconFrame>
  );
}

export function LivePreviewIcon(props) {
  return (
    <IconFrame variant="preview" title="Live preview" desc="Rounded preview surfaces with a floating live widget." {...props}>
      <rect className="blue-soft motion-a" x="11" y="13" width="24" height="22" rx="6" />
      <rect className="blue motion-a" x="11" y="13" width="24" height="8" rx="4" />
      <rect className="purple motion-b" x="22" y="23" width="17" height="12" rx="5" />
      <rect className="purple-soft motion-b" x="27" y="27" width="7" height="4" rx="2" />
    </IconFrame>
  );
}
