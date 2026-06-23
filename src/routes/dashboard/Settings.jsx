import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { PageHeading } from "@/components/ui";
import { useBrand } from "@/lib/brandStore.jsx";
import { BrandMark } from "@/components/dashboard/BrandMark.jsx";
import {
  brandColorPresets,
  brandCssVars,
  isHex,
  slugify,
} from "@/lib/brand";

// Settings as an iOS-style grouped list: flat rows, label left, editable value
// right, hairline dividers. Inputs stay inline and always editable — nothing is
// hidden behind a disclosure. Edits autosave to the brand store, so the form,
// widgets, and walls recolour live.

// The two section cards own the borders/dividers; the fields inside are the
// universal grey .halo-field — no borders of their own, text reads left-to-right.
const groupClass = "divide-y divide-[color-mix(in_srgb,var(--halo-border-1)_55%,transparent)] overflow-hidden rounded-lg border border-halo-border-1 bg-halo-bg-1";
const groupHeadClass = "mb-2 px-1 text-[11px] font-medium uppercase tracking-[0.06em] text-halo-fg-3";
const rowClass = "flex items-center gap-3 px-3 py-2.5";
const rowLabelClass = "w-[92px] shrink-0 text-[13px] font-medium text-halo-fg-1";

function expandHex(short) {
  const [, a, b, c] = short; // #abc -> #aabbcc
  return `#${a}${a}${b}${b}${c}${c}`;
}

function TextRow({ label, value, onChange, mono, placeholder }) {
  return (
    <div className={rowClass}>
      <span className={rowLabelClass}>{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className={cn("halo-field", mono && "font-mono")}
      />
    </div>
  );
}

// Logo row: thumbnail + a branded button, inline like an iOS avatar row.
function LogoRow({ brand, onChange }) {
  const ref = useRef(null);
  function pick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  }
  return (
    <div className={rowClass}>
      <span className={rowLabelClass}>Logo</span>
      <div className="ml-auto flex items-center gap-2.5">
        {brand.logoImage ? (
          <button
            type="button"
            data-no-fill
            onClick={() => onChange(null)}
            className="rounded-md px-1.5 py-1 text-[13px] font-medium text-halo-fg-3 transition-colors hover:text-halo-red"
          >
            Remove
          </button>
        ) : null}
        <input ref={ref} type="file" accept="image/*" className="sr-only" onChange={pick} />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="text-[13px] font-medium text-halo-primary transition-opacity hover:opacity-70"
        >
          {brand.logoImage ? "Change" : "Upload"}
        </button>
        <span style={brandCssVars(brand.brandColor)}>
          <BrandMark brand={brand} size={28} />
        </span>
      </div>
    </div>
  );
}

// Brand colour: an inline swatch row (Apple shows colour grids inline, never
// collapsed) plus a hex field for anything off-palette.
function ColorRow({ value, onChange }) {
  const [text, setText] = useState(value);
  function commitText(next) {
    setText(next);
    if (isHex(next)) onChange(next.length === 4 ? expandHex(next) : next);
  }
  return (
    <div className="px-3 py-3">
      <div className="flex items-center gap-3">
        <span className={rowLabelClass}>Colour</span>
        <input
          value={text}
          onChange={(e) => commitText(e.target.value.trim())}
          spellCheck={false}
          aria-label="Custom brand colour (hex)"
          className={cn("halo-field w-[120px] font-mono", text && !isHex(text) && "text-halo-red")}
          placeholder="#0071e3"
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2 pl-[104px]">
        {brandColorPresets.map((p) => {
          const active = p.value.toLowerCase() === value.toLowerCase();
          return (
            <button
              key={p.value}
              type="button"
              title={p.name}
              aria-label={p.name}
              aria-pressed={active}
              onClick={() => {
                onChange(p.value);
                setText(p.value);
              }}
              className={cn(
                "h-7 w-7 rounded-full transition-[box-shadow] duration-150",
                active
                  ? "ring-2 ring-halo-fg-1 ring-offset-2 ring-offset-halo-bg-1"
                  : "ring-1 ring-inset ring-black/10 hover:ring-black/30"
              )}
              style={{ background: p.value }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function Settings() {
  const { brand, update } = useBrand();
  const slugTouched = useRef(false);

  function setName(value) {
    update(slugTouched.current ? { workspaceName: value } : { workspaceName: value, slug: slugify(value) });
  }
  function setSlug(value) {
    slugTouched.current = true;
    update({ slug: slugify(value) });
  }

  return (
    <div className="halo-page">
      <header className="halo-page-header">
        <PageHeading
          title="Settings"
          info="Your workspace identity — name, logo, and brand colour — flows live into your collection form, widgets, and walls."
        />
      </header>

      {/* Live identity strip — doubles as the only preview, recolouring as you edit. */}
      <div
        style={brandCssVars(brand.brandColor)}
        className="flex items-center gap-3 rounded-lg border border-halo-border-1 bg-halo-bg-1 p-4"
      >
        <BrandMark brand={brand} size={40} />
        <div className="min-w-0">
          <p className="m-0 truncate text-[15px] font-medium tracking-[-0.01em] text-halo-fg-1">
            {brand.workspaceName || "Your workspace"}
          </p>
          <p className="m-0 truncate font-mono text-[12px] text-halo-fg-3">halo.app/submit/{brand.slug || "form"}</p>
        </div>
      </div>

      <section>
        <h2 className={groupHeadClass}>Workspace</h2>
        <div className={groupClass}>
          <TextRow label="Name" value={brand.workspaceName} onChange={setName} placeholder="Acme" />
          <TextRow label="Public slug" value={brand.slug} onChange={setSlug} mono placeholder="acme" />
          <TextRow label="Website" value={brand.website} onChange={(v) => update({ website: v })} placeholder="acme.com" />
        </div>
      </section>

      <section>
        <h2 className={groupHeadClass}>Brand</h2>
        <div className={groupClass}>
          <LogoRow brand={brand} onChange={(logoImage) => update({ logoImage })} />
          <ColorRow value={brand.brandColor} onChange={(brandColor) => update({ brandColor })} />
        </div>
      </section>
    </div>
  );
}
