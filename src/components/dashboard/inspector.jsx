import { cn } from "@/lib/cn";

// Shared inspector controls for dashboard creation surfaces (Widget Studio,
// Walls). Keeping them in one place means the two editors stay visually and
// behaviourally identical — same disclosures, swatches, option lists, toggles.

export function Chevron({ open }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      className={cn("transition-transform duration-200", open && "rotate-180")}
      aria-hidden="true"
    >
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Collapsed by default — the header shows the current value so the whole config
// reads at a glance, and options only appear when the user opens a section.
export function Disclosure({ label, value, open, onToggle, children }) {
  return (
    <div className="border-b border-halo-border-1/55 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 py-2.5 text-left"
      >
        <span className="text-[12px] font-medium text-halo-fg-1">{label}</span>
        <span className="flex items-center gap-1.5 text-halo-fg-3">
          <span className="max-w-[110px] truncate text-[12px]">{value}</span>
          <Chevron open={open} />
        </span>
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

export function Segmented({ options, value, onChange, wrap = false }) {
  return (
    <div className={cn("flex gap-0.5 rounded-md bg-halo-bg-3 p-0.5", wrap && "flex-wrap")}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            "rounded-[14px] px-2 py-1 text-[12px] font-medium transition-colors",
            wrap ? "flex-auto" : "flex-1",
            value === o.id
              ? "bg-halo-bg-1 text-halo-fg-1"
              : "text-halo-fg-2 hover:text-halo-fg-1"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({ label, checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between gap-3 text-[13px] text-halo-fg-1"
    >
      <span>{label}</span>
      <span
        className={cn(
          "relative h-[22px] w-[38px] shrink-0 rounded-pill transition-colors",
          checked ? "bg-halo-primary" : "bg-halo-bg-4"
        )}
      >
        <span
          className={cn(
            "absolute top-[2px] h-[18px] w-[18px] rounded-pill bg-white transition-[left] duration-[180ms] ease-snappy",
            checked ? "left-[18px]" : "left-[2px]"
          )}
        />
      </span>
    </button>
  );
}

function Check() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 8.5l3 3 6-6.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Single-select option list — one consistent pattern for layout, card style, and
// columns. Selection reads through the same primary language as the swatches.
export function OptionList({ options, value, onChange }) {
  return (
    <div role="radiogroup" className="grid gap-0.5">
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.id)}
            className={cn(
              "flex items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-left text-[12px] font-medium transition-colors",
              active
                ? "bg-halo-primary-wash text-halo-primary"
                : "text-halo-fg-2 hover:bg-halo-bg-3 hover:text-halo-fg-1"
            )}
          >
            <span>{o.label}</span>
            {active ? <Check /> : null}
          </button>
        );
      })}
    </div>
  );
}

// Theme picker as a swatch grid. Each chip is a two-tone disc — the preset
// surface meets its accent on a diagonal, the conventional theme-swatch read —
// so palettes stay distinguishable without a dot-in-a-ring. The active chip
// carries a primary ring; the current name lives in the disclosure header.
export function SwatchGrid({ presets, value, onChange }) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {presets.map((p) => {
        const active = p.id === value;
        return (
          <button
            key={p.id}
            type="button"
            title={p.name}
            aria-label={p.name}
            aria-pressed={active}
            onClick={() => onChange(p.id)}
            className={cn(
              "aspect-square rounded-full transition-[box-shadow] duration-150",
              active
                ? "ring-2 ring-halo-primary"
                : "ring-1 ring-inset ring-black/10 hover:ring-black/25"
            )}
            style={{
              background: `linear-gradient(135deg, ${p.background} 0 50%, ${p.accent} 50% 100%)`,
            }}
          />
        );
      })}
    </div>
  );
}

// Flat text field, consistent with the inspector's compact scale. Used by the
// Walls editor for hero copy.
export const controlInputClass =
  "w-full rounded-md border border-halo-border-1 bg-halo-bg-1 px-2.5 py-1.5 text-[13px] text-halo-fg-1 outline-none transition-colors placeholder:text-halo-fg-3 focus:border-halo-primary";
