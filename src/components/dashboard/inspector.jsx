import { cn } from "@/lib/cn";

export const deviceOptions = [
  { id: "desktop", label: "Desktop" },
  { id: "mobile", label: "Mobile" },
];

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
    <div className="halo-inspector-group">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="halo-inspector-row"
      >
        <span className="halo-inspector-label">{label}</span>
        <span className="halo-inspector-value">
          <span>{value}</span>
          <Chevron open={open} />
        </span>
      </button>
      {open && <div className="halo-inspector-content">{children}</div>}
    </div>
  );
}

export function Segmented({ options, value, onChange, wrap = false }) {
  return (
    <div className={cn("inline-flex max-w-full gap-1 rounded-pill bg-halo-bg-3 p-1", wrap && "flex-wrap")}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            "min-h-[30px] rounded-pill px-3 py-1.5 text-[13px] font-medium leading-none whitespace-nowrap transition-colors",
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
      className="halo-inspector-toggle"
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
    <div className="flex flex-wrap gap-1.5 p-1">
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
              "h-6 w-6 rounded-full transition-[box-shadow] duration-150",
              active
                ? "ring-2 ring-halo-primary ring-offset-1 ring-offset-halo-bg-1"
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
