import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeading } from "@/components/ui";
import { HaloIcon, HaloIconChip } from "@/components/dashboard/HaloIcon.jsx";
import { cn } from "@/lib/cn";

const importMethods = [
  {
    id: "auto",
    route: "auto",
    icon: "zap",
    title: "Auto-import",
    copy: "Connect review and community sources, then pull new proof into Halo automatically.",
    detail: "21 source templates",
  },
  {
    id: "web",
    route: "web",
    icon: "globe",
    title: "Import from web",
    copy: "Paste a public review, social post, product listing, or community thread URL.",
    detail: "URL scanner",
  },
  {
    id: "spreadsheet",
    route: "spreadsheet",
    icon: "upload",
    title: "Upload spreadsheet",
    copy: "Bring in CSV, XLS, or XLSX files with names, ratings, sources, tags, and quotes.",
    detail: "Bulk importer",
  },
  {
    id: "manual",
    route: "manual",
    icon: "manualImport",
    title: "Manual import",
    copy: "Add text, video, image, or screengrab proof and keep the original source attached.",
    detail: "Text + media",
  },
  {
    id: "migrate",
    route: "migrate",
    icon: "copy",
    title: "Migrate a wall",
    copy: "Paste a public testimonial wall URL and map the imported testimonials into Halo.",
    detail: "Wall migration",
  },
  {
    id: "extension",
    route: "extension",
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
      <HaloIconChip name={method.icon} size={20} />
      <span>
        <strong>{method.title}</strong>
        <small>{method.detail}</small>
      </span>
      <p>{method.copy}</p>
    </button>
  );
}

export default function Import() {
  const navigate = useNavigate();
  const { methodId } = useParams();
  const routeMethod = importMethods.some((method) => method.route === methodId) ? methodId : "web";
  const [activeMethod, setActiveMethod] = useState(routeMethod);
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedSources, setSelectedSources] = useState(() => new Set(["X", "LinkedIn", "Google"]));
  const [message, setMessage] = useState("");
  const fileRef = useRef(null);
  const selected = importMethods.find((method) => method.id === activeMethod) ?? importMethods[0];

  useEffect(() => {
    setActiveMethod(routeMethod);
  }, [routeMethod]);

  const previewRows = useMemo(
    () => [
      { name: "Ari Dawson", source: selected.id === "spreadsheet" ? "CSV" : "LinkedIn", status: "Ready" },
      { name: "Maya Chen", source: selected.id === "web" ? "Product Hunt" : "Google", status: "Needs review" },
      { name: "Noah Bell", source: selected.id === "manual" ? "Manual" : "X", status: "Ready" },
    ],
    [selected.id]
  );

  function toggleSource(source) {
    setSelectedSources((current) => {
      const next = new Set(current);
      if (next.has(source)) next.delete(source);
      else next.add(source);
      return next;
    });
  }

  function runImport() {
    const subject =
      activeMethod === "spreadsheet"
        ? fileName || "spreadsheet"
        : activeMethod === "auto"
          ? `${selectedSources.size} sources`
          : url || selected.title.toLowerCase();
    setMessage(`${selected.title} queued from ${subject}`);
    setTimeout(() => setMessage(""), 2200);
  }

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
          <div key={method.id} className="contents">
            <ImportMethodCard
              method={method}
              active={activeMethod === method.id}
              onSelect={(id) => {
                setActiveMethod(id);
                navigate(`/dashboard/import/${id}`);
              }}
            />
            {method.id === "auto" ? (
              <div className="halo-import-or" aria-hidden="true">
                OR
              </div>
            ) : null}
          </div>
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
              <HaloIconChip name="upload" size={22} />
              <strong>{fileName || "Choose a spreadsheet"}</strong>
              <p>Map columns to name, quote, source, rating, URL, and tags before importing.</p>
              <button type="button" className="halo-copy-button" onClick={() => fileRef.current?.click()}>
                Browse files
              </button>
            </div>
          ) : activeMethod === "auto" ? (
            <div className="halo-import-source-picker" aria-label="Auto import sources">
              {sourceGroups.slice(0, 12).map((source) => (
                <button
                  key={source}
                  type="button"
                  className={cn(selectedSources.has(source) && "is-active")}
                  onClick={() => toggleSource(source)}
                >
                  {source}
                </button>
              ))}
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

          <div className="halo-import-action-row">
            <button type="button" className="halo-copy-button is-primary" onClick={runImport}>
              <HaloIcon name="import" size={15} />
              {activeMethod === "auto" ? "Connect selected sources" : "Start import"}
            </button>
            {message ? <span>{message}</span> : null}
          </div>

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
              <button
                key={source}
                type="button"
                className={cn(selectedSources.has(source) && "is-active")}
                onClick={() => toggleSource(source)}
              >
                {source}
              </button>
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
