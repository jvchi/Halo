import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { PageHeading } from "@/components/ui";
import { BrandMark } from "@/components/dashboard/BrandMark.jsx";
import { HaloIcon } from "@/components/dashboard/HaloIcon.jsx";
import { useBrand } from "@/lib/brandStore.jsx";
import { brandColorPresets, brandCssVars, isHex } from "@/lib/brand";

const fontMoods = ["System clean", "Editorial", "Compact", "Friendly"];
const templates = ["Quote card", "Video lower-third", "Wall hero", "Popup badge"];

function expandHex(short) {
  const [, a, b, c] = short;
  return `#${a}${a}${b}${b}${c}${c}`;
}

export default function BrandKit() {
  const { brand, update } = useBrand();
  const fileRef = useRef(null);
  const [customColor, setCustomColor] = useState(brand.brandColor);
  const [fontMood, setFontMood] = useState(fontMoods[0]);

  function pickLogo(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update({ logoImage: typeof reader.result === "string" ? reader.result : null });
    reader.readAsDataURL(file);
  }

  function updateCustomColor(next) {
    setCustomColor(next);
    if (isHex(next)) update({ brandColor: next.length === 4 ? expandHex(next) : next });
  }

  return (
    <div className="halo-page">
      <header className="halo-page-header">
        <PageHeading
          title="Brand"
          info="Save reusable logos, colors, typography choices, and proof templates."
        />
      </header>

      <section className="halo-brand-hero" style={brandCssVars(brand.brandColor)}>
        <BrandMark brand={brand} size={52} />
        <div>
          <span>Brand kit</span>
          <strong>{brand.workspaceName || "Your workspace"}</strong>
          <p>{brand.website || "Add your website in settings"} / halo.app/p/{brand.slug || "workspace"}</p>
        </div>
      </section>

      <div className="halo-workbench-grid">
        <section className="halo-panel">
          <header className="halo-panel-header">
            <span>Identity assets</span>
            <small>Logo and colors</small>
          </header>

          <div className="halo-brand-asset-row">
            <span style={brandCssVars(brand.brandColor)}>
              <BrandMark brand={brand} size={44} />
            </span>
            <div>
              <strong>Workspace logo</strong>
              <small>{brand.logoImage ? "Custom image uploaded" : "Using generated mark"}</small>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={pickLogo} />
            <button type="button" className="halo-copy-button" onClick={() => fileRef.current?.click()}>
              <HaloIcon name="upload" size={15} />
              {brand.logoImage ? "Change" : "Upload"}
            </button>
          </div>

          <div className="halo-brand-swatch-panel">
            <span>Brand color</span>
            <div className="halo-brand-swatches">
              {brandColorPresets.map((preset) => {
                const active = preset.value.toLowerCase() === brand.brandColor.toLowerCase();
                return (
                  <button
                    key={preset.value}
                    type="button"
                    title={preset.name}
                    aria-label={preset.name}
                    aria-pressed={active}
                    className={cn(active && "is-active")}
                    style={{ background: preset.value }}
                    onClick={() => {
                      update({ brandColor: preset.value });
                      setCustomColor(preset.value);
                    }}
                  />
                );
              })}
            </div>
            <input
              className={cn("halo-field font-mono", customColor && !isHex(customColor) && "text-halo-red")}
              value={customColor}
              onChange={(event) => updateCustomColor(event.target.value.trim())}
              placeholder="#0071e3"
              spellCheck={false}
            />
          </div>
        </section>

        <aside className="halo-panel">
          <header className="halo-panel-header">
            <span>Brand defaults</span>
            <small>Applied in Studio</small>
          </header>
          <div className="halo-brand-options">
            {fontMoods.map((mood) => (
              <button
                key={mood}
                type="button"
                onClick={() => setFontMood(mood)}
                className={cn(fontMood === mood && "is-active")}
              >
                {mood}
              </button>
            ))}
          </div>
          <div className="halo-import-preview">
            {templates.map((template) => (
              <div key={template} className="halo-compact-row">
                <span>{template}</span>
                <small>{fontMood}</small>
                <em>Ready</em>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
