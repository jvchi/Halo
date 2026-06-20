import { cn } from "@/lib/cn";

// .aave-stat — proof/trust statistic. Short scannable value + muted label.
export function Stat({ value, label, className, children }) {
  return (
    <div className={cn("grid gap-3", className)}>
      <p className="m-0 text-[32px] font-medium leading-[1.1] tracking-[-0.031em] text-halo-fg-1 max-md:text-[26px]">
        {value}
      </p>
      {label ? <p className="m-0 text-[16px] leading-[1.4] text-halo-fg-2">{label}</p> : null}
      {children}
    </div>
  );
}
