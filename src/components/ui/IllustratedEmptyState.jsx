import { cn } from "@/lib/cn";

export function IllustratedEmptyState({
  illustration,
  title,
  children,
  className,
  imageClassName,
}) {
  return (
    <div
      className={cn(
        "grid place-items-center rounded-xl px-6 py-14 text-center",
        className
      )}
    >
      <div className="grid place-items-center gap-4">
        {illustration ? (
          <img
            src={illustration}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className={cn("h-auto w-[min(380px,84vw)] max-w-full object-contain", imageClassName)}
          />
        ) : null}
        <div className="grid place-items-center gap-2">
          {title ? (
            <p className="m-0 text-[16px] font-medium text-halo-fg-1">{title}</p>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
}
