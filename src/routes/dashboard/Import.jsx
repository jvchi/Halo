import { useMemo, useRef, useState } from "react";
import { PageHeading } from "@/components/ui";
import { HaloIcon } from "@/components/dashboard/HaloIcon.jsx";
import { cn } from "@/lib/cn";

const importMethods = [
  {
    id: "auto",
    icon: "zap",
    title: "Auto-import",
    copy: "Connect review and community sources, then pull new proof into Halo automatically.",
    detail: "21 source templates",
  },
  {
    id: "web",
    icon: "globe",
    title: "Import from web",
    copy: "Paste a public review, social post, product listing, or community thread URL.",
    detail: "URL scanner",
  },
  {
    id: "spreadsheet",
    icon: "upload",
    title: "Upload spreadsheet",
    copy: "Bring in CSV, XLS, or XLSX files with names, ratings, sources, tags, and quotes.",
    detail: "Bulk importer",
  },
  {
    id: "manual",
    icon: "manualImport",
    title: "Manual import",
    copy: "Add text, video, image, or screengrab proof and keep the original source attached.",
    detail: "Text + media",
  },
  {
    id: "migrate",
    icon: "copy",
    title: "Migrate a wall",
    copy: "Paste a public testimonial wall URL and map the imported testimonials into Halo.",
    detail: "Wall migration",
  },
  {
    id: "extension",
    icon: "wand",
    title: "Browser capture",
    copy: "Clip proof from the web into a review queue without leaving your current workflow.",
    detail: "Chrome workflow",
  },
];

const sourceGroups = [
  "X",
  "LinkedIn",
  "Google",
  "Trustpilot",
  "G2",
  "Product Hunt",
  "Reddit",
  "Capterra",
  "App Store",
  "Play Store",
  "YouTube",
  "TikTok",
  "Slack",
  "Discord",
  "Shopify",
  "Amazon",
  "Yelp",
  "Fiverr",
];

function ImportMethodCard({ method, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(method.id)}
      className={cn("halo-feature-card halo-import-method", active && "is-active")}
    >
      <span className="halo-feature-icon" aria-hidden="true">
        <HaloIcon name={method.icon} size={20} />
      </span>
      <span>
        <strong>{method.title}</strong>
        <small>{method.detail}</small>
      </span>
      <p>{method.copy}</p>
    </button>
  );
}

export default function Import() {
  const [activeMethod, setActiveMethod] = useState("web");
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const fileRef = useRef(null);
  const selected = importMethods.find((method) => method.id === activeMethod) ?? importMethods[0];

  const previewRows = useMemo(
    () => [
      { name: "Ari Dawson", source: selected.id === "spreadsheet" ? "CSV" : "LinkedIn", status: "Ready" },
      { name: "Maya Chen", source: selected.id === "web" ? "Product Hunt" : "Google", status: "Needs review" },
      { name: "Noah Bell", source: selected.id === "manual" ? "Manual" : "X", status: "Ready" },
    ],
    [selected.id]
  );

  return (
    <div className="halo-page">
      <header className="halo-page-header">
        <PageHeading
          title="Import"
          info="Bring existing testimonials, reviews, feedback, and social proof into Halo."
        />
      </header>

      <section className="halo-import-method-list" aria-label="Import methods">
        {importMethods.map((method) => (
          <ImportMethodCard
            key={method.id}
            method={method}
            active={activeMethod === method.id}
            onSelect={setActiveMethod}
          />
        ))}
      </section>

      <div className="halo-workbench-grid">
        <section className="halo-panel">
          <header className="halo-panel-header">
            <span>{selected.title}</span>
            <small>{selected.detail}</small>
          </header>

          {activeMethod === "spreadsheet" ? (
            <div className="halo-import-dropzone">
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.xls,.xlsx"
                className="sr-only"
                onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
              />
              <span className="halo-feature-icon" aria-hidden="true">
                <HaloIcon name="upload" size={22} />
              </span>
              <strong>{fileName || "Choose a spreadsheet"}</strong>
              <p>Map columns to name, quote, source, rating, URL, and tags before importing.</p>
              <button type="button" className="halo-copy-button" onClick={() => fileRef.current?.click()}>
                Browse files
              </button>
            </div>
          ) : (
            <label className="grid gap-2 text-[12px] font-medium text-halo-fg-2">
              {activeMethod === "manual" ? "Proof note" : "Source URL"}
              <div className="halo-input-with-icon">
                <HaloIcon name={activeMethod === "manual" ? "proof" : "globe"} size={16} />
                <input
                  className="halo-field"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder={activeMethod === "manual" ? "Paste the testimonial text..." : "https://"}
                />
              </div>
            </label>
          )}

          <div className="halo-import-preview">
            <span>Import preview</span>
            {previewRows.map((row) => (
              <div key={row.name} className="halo-compact-row">
                <span>{row.name}</span>
                <small>{row.source}</small>
                <em>{row.status}</em>
              </div>
            ))}
          </div>
        </section>

        <aside className="halo-panel">
          <header className="halo-panel-header">
            <span>Supported sources</span>
            <small>{sourceGroups.length} common sources</small>
          </header>
          <div className="halo-source-cloud">
            {sourceGroups.map((source) => (
              <span key={source}>{source}</span>
            ))}
          </div>
          <div className="halo-callout">
            <HaloIcon name="check" size={18} />
            <p>Imported proof lands in the Proof queue first, so nothing is published until you approve it.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
