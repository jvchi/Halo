import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/cn";
import { IllustratedEmptyState, PageHeading, Button } from "@/components/ui";
import { useForms } from "@/lib/formsStore.jsx";

const STATUS_META = {
  active: { label: "Active", color: "var(--halo-green)" },
  paused: { label: "Paused", color: "var(--halo-orange)" },
  archived: { label: "Archived", color: "var(--halo-fg-3)" },
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status] ?? STATUS_META.active;
  return (
    <span
      className="rounded-pill px-2 py-0.5 text-[11px] font-medium"
      style={{ color: meta.color, background: `color-mix(in srgb, ${meta.color} 13%, transparent)` }}
    >
      {meta.label}
    </span>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6 6V4.2a1.2 1.2 0 0 1 1.2-1.2h4.6A1.2 1.2 0 0 1 13 4.2v4.6A1.2 1.2 0 0 1 11.8 10H10"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.2 6h4.6A1.2 1.2 0 0 1 10 7.2v4.6A1.2 1.2 0 0 1 8.8 13H4.2A1.2 1.2 0 0 1 3 11.8V7.2A1.2 1.2 0 0 1 4.2 6Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 8.1h.01M8 8.1h.01M12 8.1h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
    </svg>
  );
}

function CopyLinkButton({ url }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      data-no-fill
      onClick={() => {
        navigator.clipboard?.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      aria-label={copied ? "Link copied" : "Copy form link"}
      title={copied ? "Copied" : "Copy link"}
      className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-halo-fg-3 transition-colors hover:bg-halo-bg-3 hover:text-halo-fg-1"
    >
      {copied ? (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3.5 8.5l3 3 6-6.5" stroke="var(--halo-green)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <CopyIcon />
      )}
    </button>
  );
}

function MenuItem({ onClick, danger, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-md px-2 py-1.5 text-left text-[12px] font-medium transition-colors hover:bg-halo-bg-3",
        danger ? "text-halo-red" : "text-halo-fg-2 hover:text-halo-fg-1"
      )}
    >
      {children}
    </button>
  );
}

function FormCard({ form, onDuplicate, onToggleStatus, onDelete }) {
  const url = `https://halo.app/submit/${form.slug}`;
  return (
    <article className="rounded-[12px] border border-halo-border-1 bg-halo-bg-3/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/dashboard/forms/${form.id}`}
              className="text-[14px] font-medium text-halo-fg-1 transition-colors hover:text-halo-primary"
            >
              {form.name}
            </Link>
            <StatusBadge status={form.status} />
          </div>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="truncate font-mono text-[12px] text-halo-fg-3">/submit/{form.slug}</span>
            <CopyLinkButton url={url} />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden text-[12px] text-halo-fg-3 sm:inline">
            {form.responses} {form.responses === 1 ? "response" : "responses"}
          </span>
          <Link
            to={`/dashboard/forms/${form.id}`}
            className="inline-flex min-h-[30px] items-center rounded-md bg-halo-bg-3 px-2.5 text-[12px] font-medium text-halo-fg-2 transition-colors hover:text-halo-fg-1"
          >
            Edit
          </Link>
          <details className="group relative">
            <summary className="grid h-7 w-7 cursor-pointer list-none place-items-center rounded-pill text-halo-fg-3 transition-colors hover:bg-halo-bg-4 hover:text-halo-fg-1 [&::-webkit-details-marker]:hidden">
              <MoreIcon />
              <span className="sr-only">Form actions</span>
            </summary>
            <div className="absolute right-0 top-[calc(100%+6px)] z-20 grid w-40 gap-0.5 rounded-lg border border-halo-border-1 bg-halo-bg-1 p-1">
              <MenuItem onClick={() => onDuplicate(form.id)}>Duplicate</MenuItem>
              <MenuItem onClick={() => onToggleStatus(form)}>
                {form.status === "active" ? "Pause collecting" : "Resume collecting"}
              </MenuItem>
              <MenuItem danger onClick={() => onDelete(form.id)}>
                Delete form
              </MenuItem>
            </div>
          </details>
        </div>
      </div>
    </article>
  );
}

export default function Forms() {
  const { forms, create, setStatus, duplicate, remove } = useForms();
  const navigate = useNavigate();

  async function newForm() {
    const form = await create({ name: "Untitled form" });
    navigate(`/dashboard/forms/${form.id}`);
  }

  return (
    <div className="halo-page">
      <header className="halo-page-header">
        <PageHeading
          title="Forms"
          info="Collect testimonials through a shareable link. Submissions land in the Inbox as pending."
        />
        <p>Share a link, collect testimonials, and approve the best ones in your Inbox.</p>
        <Button size="sm" onClick={newForm} className="shrink-0">
          <PlusIcon />
          New form
        </Button>
      </header>

      {forms.length === 0 ? (
        <IllustratedEmptyState icon="form" title="No forms yet" className="py-16">
          <Button size="sm" onClick={newForm} className="mt-2">
            <PlusIcon />
            New form
          </Button>
        </IllustratedEmptyState>
      ) : (
        <div className="grid gap-3">
          {forms.map((form) => (
            <FormCard
              key={form.id}
              form={form}
              onDuplicate={duplicate}
              onToggleStatus={(f) => setStatus(f.id, f.status === "active" ? "paused" : "active")}
              onDelete={remove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
