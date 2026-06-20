import { cn } from "@/lib/cn";

// .aave-card and variants. Glass = translucent partner card with subtle lift;
// dark = low-opacity white fill for near-black product sections.
const variants = {
  default: "bg-halo-stat-card",
  glass:
    "bg-halo-glass transition-[background-color,transform] duration-[220ms] ease-snappy hover:bg-halo-glass-hover hover:-translate-y-0.5",
  dark: "bg-halo-dark-card text-white",
};

export function Card({
  as: As = "div",
  variant = "default",
  className,
  children,
  ...props
}) {
  return (
    <As
      className={cn("rounded-xl px-6 py-8", variants[variant], className)}
      {...props}
    >
      {children}
    </As>
  );
}
