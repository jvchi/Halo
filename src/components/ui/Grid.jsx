import { cn } from "@/lib/cn";

// .aave-grid variants. Two- and auto-grids collapse to one column below 768px.
const variants = {
  two: "grid-cols-2 max-md:grid-cols-1",
  auto: "[grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] max-md:grid-cols-1",
};

export function Grid({ variant = "auto", className, children, ...props }) {
  return (
    <div className={cn("grid gap-6", variants[variant], className)} {...props}>
      {children}
    </div>
  );
}
