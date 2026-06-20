import { cn } from "@/lib/cn";

// .aave-market — card content for dark product sections: blue label, white
// title, body at ~70% white. Pair with <Card variant="dark">.
export function Market({ label, title, children, className }) {
  return (
    <div className={cn("grid gap-4", className)}>
      {label ? (
        <p className="m-0 text-[14px] font-medium text-halo-primary">{label}</p>
      ) : null}
      {title ? (
        <h3 className="m-0 text-[18px] font-medium leading-[1.25] tracking-[-0.01em] text-white">
          {title}
        </h3>
      ) : null}
      {children ? <p className="m-0 text-[16px] leading-[1.5] text-white/70">{children}</p> : null}
    </div>
  );
}
