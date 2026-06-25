import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { cn } from "@/lib/cn";
import { PageHeading } from "@/components/ui";
import { useBrand } from "@/lib/brandStore.jsx";
import { BrandMark } from "@/components/dashboard/BrandMark.jsx";
import { HaloIcon } from "@/components/dashboard/HaloIcon.jsx";
import {
  brandColorPresets,
  brandCssVars,
  isHex,
  slugify,
} from "@/lib/brand";

// Settings groups: each section card owns the border; the fields inside are the
// universal grey .halo-field with the label stacked on top (matching FormBuilder
// and Inbox). Edits autosave to the brand store, so the form, widgets, and walls
// recolour live.

const groupHeadClass = "mb-2 px-1 text-[11px] font-medium uppercase tracking-[0.06em] text-halo-fg-3";
const cardClass = "grid gap-5 rounded-lg border border-halo-border-1 bg-halo-bg-1 p-5";
const labelClass = "grid gap-1.5 text-[12px] font-medium text-halo-fg-2";
const settingsTabs = [
  { label: "General", slug: "" },
  { label: "Domain", slug: "domain" },
  { label: "Team", slug: "members" },
  { label: "Notifications", slug: "notifications" },
  { label: "Powered By", slug: "powered-by" },
  { label: "Billing", slug: "billing" },
  { label: "Danger Zone", slug: "danger" },
];

function expandHex(short) {
  const [, a, b, c] = short; // #abc -> #aabbcc
  return `#${a}${a}${b}${b}${c}${c}`;
}

function Field({ label, mono, value, onChange, placeholder }) {
  return (
    <label className={labelClass}>
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className={cn("halo-field", mono && "font-mono")}
      />
    </label>
  );
}

// Logo: thumbnail + a branded ghost button (mirrors the Form Builder photo
// field), read to a data URL so it survives the in-memory store.
function LogoField({ brand, onChange }) {
  const ref = useRef(null);
  function pick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  }
  return (
    <div className="grid gap-1.5">
      <span className="text-[12px] font-medium text-halo-fg-2">Logo</span>
      <div className="flex items-center gap-3">
        <span style={brandCssVars(brand.brandColor)}>
          <BrandMark brand={brand} size={40} />
        </span>
        <input ref={ref} type="file" accept="image/*" className="sr-only" onChange={pick} />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="inline-flex min-h-[34px] items-center gap-1.5 rounded-pill bg-halo-bg-3 px-3.5 text-[13px] font-medium text-halo-fg-1 transition-colors hover:bg-halo-bg-4"
        >
          <HaloIcon name="upload" size={14} />
          {brand.logoImage ? "Change" : "Upload"}
        </button>
        {brand.logoImage ? (
          <button
            type="button"
            data-no-fill
            onClick={() => onChange(null)}
            className="rounded-md px-2 py-1 text-[13px] font-medium text-halo-fg-3 transition-colors hover:text-halo-red"
          >
            Remove
          </button>
        ) : null}
      </div>
    </div>
  );
}

// Brand colour: curated swatches plus a hex field for anything off-palette.
function ColorField({ value, onChange }) {
  const [text, setText] = useState(value);
  function commitText(next) {
    setText(next);
    if (isHex(next)) onChange(next.length === 4 ? expandHex(next) : next);
  }
  return (
    <div className="grid gap-2.5">
      <span className="text-[12px] font-medium text-halo-fg-2">Brand colour</span>
      <div className="flex flex-wrap gap-2">
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
              className={cn("halo-brand-color-dot", active && "is-active")}
              style={{ background: p.value }}
            />
          );
        })}
      </div>
      <input
        value={text}
        onChange={(e) => commitText(e.target.value.trim())}
        spellCheck={false}
        aria-label="Custom brand colour (hex)"
        className={cn("halo-field w-[140px] font-mono", text && !isHex(text) && "text-halo-red")}
        placeholder="#0071e3"
      />
    </div>
  );
}

export default function Settings() {
  const { brand, update } = useBrand();
  const slugTouched = useRef(false);
  const { settingsTab } = useParams();
  const activeTab = settingsTabs.find((tab) => tab.slug === (settingsTab ?? ""))?.label ?? "General";
  const [message, setMessage] = useState("");
  const [settingsDrafts, setSettingsDrafts] = useState({
    domain: "",
    invite: "",
    notifications: brand.website || "",
    poweredBy: true,
    billing: "Free",
    danger: false,
  });

  function setName(value) {
    update(slugTouched.current ? { workspaceName: value } : { workspaceName: value, slug: slugify(value) });
  }
  function setSlug(value) {
    slugTouched.current = true;
    update({ slug: slugify(value) });
  }

  function setDraft(key, value) {
    setSettingsDrafts((current) => ({ ...current, [key]: value }));
  }

  function confirmTab(label) {
    setMessage(`${label} updated`);
    setTimeout(() => setMessage(""), 1800);
  }

  return (
    <div className="halo-page">
      <header className="halo-page-header">
        <PageHeading
          title="Project Settings"
          info="Your workspace identity — name, logo, and brand colour — flows live into your collection form, widgets, and walls."
        />
        {message ? <span className="halo-settings-save-state">{message}</span> : null}
      </header>

      <nav className="halo-settings-tabs" aria-label="Project settings tabs">
        {settingsTabs.map((tab) => (
          <Link
            key={tab.label}
            to={tab.slug ? `/dashboard/settings/${tab.slug}` : "/dashboard/settings"}
            className={cn(activeTab === tab.label && "is-active")}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {activeTab === "General" ? (
        <form className="halo-settings-form">
          <div className="halo-settings-row">
            <div>
              <h2>Project Name</h2>
              <p>The name of your product, service, company or organization.</p>
            </div>
            <Field label="Project Name" value={brand.workspaceName} onChange={setName} placeholder="Acme" />
          </div>
          <div className="halo-settings-row">
            <div>
              <h2>Project Slug</h2>
              <p>This will be used in the URLs of your forms, walls of love and testimonials.</p>
            </div>
            <div className="grid gap-2">
              <Field label="Project Slug" mono value={brand.slug} onChange={setSlug} placeholder="acme" />
              <p className="m-0 font-mono text-[12px] text-halo-fg-3">https://halo.app/p/{brand.slug || "workspace"}</p>
            </div>
          </div>
          <div className="halo-settings-row">
            <div>
              <h2>Project URL</h2>
              <p>The URL of your website, product, service, company or organization.</p>
            </div>
            <Field label="Project URL" value={brand.website} onChange={(v) => update({ website: v })} placeholder="https://acme.com" />
          </div>
          <div className="halo-settings-row">
            <div>
              <h2>Brand Assets</h2>
              <p>Your logo and colour sync into forms, widgets, walls, and Studio templates.</p>
            </div>
            <div className={cardClass}>
              <LogoField brand={brand} onChange={(logoImage) => update({ logoImage })} />
              <ColorField value={brand.brandColor} onChange={(brandColor) => update({ brandColor })} />
            </div>
          </div>
          <div className="halo-settings-row">
            <span />
            <button type="button" className="halo-copy-button" onClick={() => confirmTab("General settings")}>Save settings</button>
          </div>
        </form>
      ) : (
        <section className="halo-settings-placeholder">
          <div style={brandCssVars(brand.brandColor)}>
            <BrandMark brand={brand} size={44} />
          </div>
          <h2>{activeTab}</h2>
          <p>
            {activeTab === "Domain"
              ? "Connect a custom domain for your public forms and Walls of Love."
              : activeTab === "Team"
                ? "Invite teammates and manage access to this workspace."
                : activeTab === "Notifications"
                  ? "Choose where Halo sends submission, approval, and billing updates."
                  : activeTab === "Powered By"
                    ? "Control Halo branding on public proof surfaces."
                    : activeTab === "Billing"
                      ? "Manage plan, invoices, and usage limits."
                      : "Delete or archive this workspace after exporting your proof."}
          </p>
          {activeTab === "Domain" ? (
            <label className={labelClass}>
              Custom domain
              <input
                className="halo-field"
                value={settingsDrafts.domain}
                onChange={(event) => setDraft("domain", event.target.value)}
                placeholder="love.acme.com"
              />
            </label>
          ) : null}
          {activeTab === "Team" ? (
            <label className={labelClass}>
              Invite teammate
              <input
                className="halo-field"
                value={settingsDrafts.invite}
                onChange={(event) => setDraft("invite", event.target.value)}
                placeholder="teammate@company.com"
              />
            </label>
          ) : null}
          {activeTab === "Notifications" ? (
            <label className={labelClass}>
              Notification email
              <input
                className="halo-field"
                value={settingsDrafts.notifications}
                onChange={(event) => setDraft("notifications", event.target.value)}
                placeholder="alerts@company.com"
              />
            </label>
          ) : null}
          {activeTab === "Powered By" ? (
            <label className="halo-settings-switch">
              <input
                type="checkbox"
                checked={settingsDrafts.poweredBy}
                onChange={(event) => setDraft("poweredBy", event.target.checked)}
              />
              Show Halo branding on public proof surfaces
            </label>
          ) : null}
          {activeTab === "Billing" ? (
            <div className="halo-settings-plan-picker">
              {["Free", "Pro", "Business"].map((plan) => (
                <button
                  key={plan}
                  type="button"
                  className={cn(settingsDrafts.billing === plan && "is-active")}
                  onClick={() => setDraft("billing", plan)}
                >
                  {plan}
                </button>
              ))}
            </div>
          ) : null}
          {activeTab === "Danger Zone" ? (
            <label className="halo-settings-switch is-danger">
              <input
                type="checkbox"
                checked={settingsDrafts.danger}
                onChange={(event) => setDraft("danger", event.target.checked)}
              />
              I understand this workspace should be archived
            </label>
          ) : null}
          <button type="button" className="halo-copy-button" onClick={() => confirmTab(activeTab)}>
            Save {activeTab}
          </button>
        </section>
      )}
    </div>
  );
}
