import { cn } from "@/lib/cn";

// Editorial type scale from design/design.md. Letter-spacing tightens as size
// grows; weights stay at 400/450/500 (never bold).

export function Kicker({ className, children, ...props }) {
  return (
    <p
      className={cn(
        "m-0 text-[14px] font-medium leading-none tracking-[-0.01em] text-halo-primary",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function HeadingXL({ as: As = "h1", className, children, ...props }) {
  return (
    <As
      className={cn(
        "m-0 max-w-[940px] font-medium text-[48px] leading-[1.1] tracking-[-0.03em]",
        "md:text-[72px] md:tracking-[-0.05em]",
        className
      )}
      {...props}
    >
      {children}
    </As>
  );
}

export function HeadingLG({ as: As = "h2", className, children, ...props }) {
  return (
    <As
      className={cn(
        "m-0 font-medium text-[32px] leading-[1.18]",
        "md:text-[40px] md:leading-[1.2] md:tracking-[-0.03em]",
        className
      )}
      {...props}
    >
      {children}
    </As>
  );
}

export function HeadingMD({ as: As = "h3", className, children, ...props }) {
  return (
    <As
      className={cn(
        "m-0 font-medium text-[26px] leading-[1.1] tracking-[-0.031em] md:text-[32px]",
        className
      )}
      {...props}
    >
      {children}
    </As>
  );
}

export function Lead({ className, children, ...props }) {
  return (
    <p
      className={cn(
        "m-0 max-w-[680px] text-[18px] font-normal leading-[1.36] tracking-[-0.01em] text-halo-fg-2 md:text-[20px]",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function Body({ className, children, ...props }) {
  return (
    <p className={cn("m-0 text-[16px] leading-[1.5] text-halo-fg-2", className)} {...props}>
      {children}
    </p>
  );
}

export function Muted({ className, children, ...props }) {
  return (
    <p className={cn("m-0 text-[14px] leading-[1.4] text-halo-fg-3", className)} {...props}>
      {children}
    </p>
  );
}
