import { cn } from "@/lib/cn";

// Layout primitives ported from design-system components.css (.aave-shell,
// .aave-section, .aave-section__inner, .aave-stack, surface helpers).

export function Shell({ as: As = "div", className, children, ...props }) {
  return (
    <As
      className={cn(
        "mx-auto w-[min(100%-48px,1082px)] max-md:w-[min(100%-40px,1082px)]",
        className
      )}
      {...props}
    >
      {children}
    </As>
  );
}

const surfaces = {
  dark: "bg-halo-dark-surface text-white",
  soft: "bg-halo-bg-3",
};

export function Section({
  as: As = "section",
  compact = false,
  surface,
  className,
  children,
  ...props
}) {
  return (
    <As
      className={cn(
        compact ? "px-12 py-18" : "px-12 py-30",
        "max-md:px-5 max-md:py-12",
        surface && surfaces[surface],
        className
      )}
      {...props}
    >
      {children}
    </As>
  );
}

export function SectionInner({ className, children, ...props }) {
  return (
    <div className={cn("mx-auto w-full max-w-content", className)} {...props}>
      {children}
    </div>
  );
}

export function Stack({ as: As = "div", className, children, ...props }) {
  return (
    <As className={cn("grid gap-6", className)} {...props}>
      {children}
    </As>
  );
}
