import { cn } from "@/lib/cn";
import { monogramOf } from "@/lib/brand";

// The workspace logo, as shown on customer-facing surfaces. Renders the uploaded
// image when present, otherwise a monogram disc that fills with the brand accent
// (--halo-primary — set it via brandCssVars on an ancestor to recolour). Takes an
// explicit `brand` so callers can preview an unsaved draft, not just the store.
export function BrandMark({ brand, size = 24, className }) {
  const dim = { width: size, height: size };
  if (brand?.logoImage) {
    return (
      <img
        src={brand.logoImage}
        alt={`${brand.workspaceName} logo`}
        style={dim}
        className={cn("shrink-0 rounded-pill object-cover", className)}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      style={{ ...dim, fontSize: Math.round(size * 0.5) }}
      className={cn(
        "grid shrink-0 place-items-center rounded-pill bg-halo-primary font-semibold leading-none text-white",
        className
      )}
    >
      {monogramOf(brand?.workspaceName)}
    </span>
  );
}
