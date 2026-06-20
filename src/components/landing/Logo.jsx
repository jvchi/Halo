import { cn } from "@/lib/cn";

// Halo wordmark for the product app surfaces (dashboard, pricing chrome).
// The reference landing keeps its own original wordmark via the embedded markup.
export function Logo({ className, onDark = false }) {
  return (
    <span
      className={cn(
        "select-none text-[19px] font-medium tracking-[-0.03em]",
        onDark ? "text-white" : "text-halo-fg-1",
        className
      )}
    >
      Halo
    </span>
  );
}
