import { cn } from "@/lib/cn";

// .aave-button + variants. Pill CTA: min-height 45px, 14px 24px padding,
// 17px/500 type. The pointer-following fill that
// scales in behind the label is applied globally to every button by
// src/lib/snappyFill.js; data-variant selects this button's on-brand fill +
// focus colors (see snappyFill.css).
const variants = {
  primary: "bg-halo-primary text-white",
  secondary:
    "bg-[color-mix(in_srgb,var(--halo-primary)_11%,transparent)] text-halo-primary",
  dark: "bg-halo-fg-1 text-white",
  white: "bg-white text-halo-fg-1",
};

// md is the homepage CTA scale; sm is the compact dashboard action (matches the
// dashboard's 30–34px control rhythm) while keeping the same branded snappy fill.
const sizes = {
  md: "min-h-[45px] gap-2 px-6 py-3.5 text-button-17",
  sm: "min-h-[34px] gap-1.5 px-3.5 text-[13px] font-medium",
};

export function Button({
  as: As = "button",
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) {
  return (
    <As
      data-variant={variant}
      className={cn(
        "halo-btn inline-flex cursor-pointer items-center justify-center",
        "rounded-pill border-0 no-underline",
        "transition-[transform,background-color,color,opacity] duration-[220ms] ease-snappy",
        "active:scale-[0.96]",
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      <span className="halo-fill" aria-hidden="true" />
      <span className="halo-btn-label">{children}</span>
    </As>
  );
}
