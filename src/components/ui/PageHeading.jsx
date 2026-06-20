// Dashboard page title with an optional info tooltip. Section descriptions live
// behind a small "i" affordance instead of a persistent paragraph, so the header
// stays compact while the context is still one hover/focus away. The tooltip is
// anchored to the heading's left edge (not the icon) so it lines up with the title.
export function PageHeading({ title, info }) {
  return (
    <div className="relative flex items-center gap-1.5">
      <h1>{title}</h1>
      {info ? (
        <>
          <button
            type="button"
            aria-label={info}
            className="peer grid h-4 w-4 place-items-center rounded-pill border border-halo-border-1 text-[10px] font-medium leading-none text-halo-fg-3 transition-colors hover:border-halo-border-2 hover:text-halo-fg-1 focus-visible:text-halo-fg-1"
          >
            i
          </button>
          <span
            role="tooltip"
            className="pointer-events-none absolute left-0 top-full z-30 mt-2 w-max max-w-[240px] rounded-md border border-halo-border-1 bg-halo-bg-1 px-2.5 py-1.5 text-[12px] font-normal leading-snug tracking-normal text-halo-fg-2 opacity-0 transition-opacity duration-150 peer-hover:opacity-100 peer-focus-visible:opacity-100"
          >
            {info}
          </span>
        </>
      ) : null}
    </div>
  );
}
