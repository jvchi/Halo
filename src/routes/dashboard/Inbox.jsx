import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { IllustratedEmptyState, PageHeading } from "@/components/ui";
import { useTestimonials } from "@/lib/testimonialsStore.jsx";
import { TESTIMONIAL_STATUSES } from "@/lib/testimonials";

const SOURCE_LABELS = {
  form: "Form",
  x: "X",
  linkedin: "LinkedIn",
  google: "Google",
  manual: "Manual",
};

const STATUS_META = {
  pending: { label: "Pending", color: "var(--halo-orange)" },
  approved: { label: "Approved", color: "var(--halo-green)" },
  rejected: { label: "Rejected", color: "var(--halo-red)" },
  archived: { label: "Archived", color: "var(--halo-fg-3)" },
};

function initials(name) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "?"
  );
}

function Avatar({ name }) {
  return (
    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-pill bg-halo-primary-wash text-[12px] font-semibold text-halo-primary">
      {initials(name)}
    </div>
  );
}

function Stars({ rating = 0 }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L10 14.77l-5.2 2.73.99-5.78L1.58 7.62l5.82-.85L10 1.5z"
            fill={i < rating ? "var(--halo-primary)" : "var(--halo-border-2)"}
          />
        </svg>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status];
  return (
    <span
      className="rounded-pill px-2 py-0.5 text-[11px] font-medium"
      style={{ color: meta.color, background: `color-mix(in srgb, ${meta.color} 13%, transparent)` }}
    >
      {meta.label}
    </span>
  );
}

function SourceIcon({ source }) {
  const label = SOURCE_LABELS[source] ?? source;
  const icons = {
    x: (
      <path
        d="M4.6 3.75h2.16l2.06 2.9 2.52-2.9h1.66L9.57 7.69l3.77 5.31h-2.16L8.86 9.73 6.01 13H4.35l3.77-4.34L4.6 3.75Zm1.72.91 5.3 7.43h.72L7.04 4.66h-.72Z"
        fill="currentColor"
      />
    ),
    google: (
      <>
        <path d="M13.25 8.13c0-.42-.04-.72-.12-1.03H8.12v1.94h2.94c-.06.48-.38 1.2-1.1 1.69v1.26h1.62c.95-.88 1.67-2.17 1.67-3.86Z" fill="#4285F4" />
        <path d="M8.12 13.34c1.36 0 2.5-.45 3.34-1.22L9.84 10.86c-.43.3-1.01.51-1.72.51-1.32 0-2.44-.88-2.84-2.09H3.61v1.3a5.04 5.04 0 0 0 4.51 2.76Z" fill="#34A853" />
        <path d="M5.28 9.28A3.11 3.11 0 0 1 5.12 8c0-.44.06-.87.16-1.28v-1.3H3.61A5 5 0 0 0 3.08 8c0 .92.22 1.79.53 2.58l1.67-1.3Z" fill="#FBBC05" />
        <path d="M8.12 4.63c.95 0 1.59.41 1.95.75l1.43-1.4c-.88-.82-2.02-1.32-3.38-1.32a5.04 5.04 0 0 0-4.51 2.76l1.67 1.3c.4-1.21 1.52-2.09 2.84-2.09Z" fill="#EA4335" />
      </>
    ),
    linkedin: (
      <path d="M4.17 6.45h1.72V12H4.17V6.45Zm.86-2.77a.99.99 0 1 1 0 1.98.99.99 0 0 1 0-1.98ZM6.96 6.45h1.65v.76h.02c.23-.43.79-.88 1.63-.88 1.74 0 2.06 1.15 2.06 2.64V12h-1.72V9.31c0-.64-.01-1.47-.9-1.47-.9 0-1.04.7-1.04 1.42V12H6.96V6.45Z" fill="#0A66C2" />
    ),
    form: (
      <>
        <path d="M5 3.5h6a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.35" />
        <path d="M6.2 6.15h3.6M6.2 8h3.6M6.2 9.85h2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.35" />
      </>
    ),
    manual: (
      <>
        <path d="M4.2 11.8l1.1-3.05 4.6-4.6a1.2 1.2 0 0 1 1.7 1.7L7 10.45 4.2 11.8Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.3" />
        <path d="M8.95 5.1l1.95 1.95" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" />
      </>
    ),
  };

  return (
    <span
      className="inline-grid h-6 w-6 shrink-0 place-items-center rounded-pill bg-halo-bg-3 text-halo-fg-2"
      aria-label={`Source: ${label}`}
      title={label}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        {icons[source] ?? icons.manual}
      </svg>
    </span>
  );
}

function MoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 8.1h.01M8 8.1h.01M12 8.1h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function RowButton({ onClick, children, tone = "ghost", className }) {
  const tones = {
    primary: "bg-halo-primary text-white",
    ghost: "bg-halo-bg-3 text-halo-fg-2 hover:text-halo-fg-1",
    danger: "text-halo-red",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-[30px] items-center rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors",
        tones[tone],
        className
      )}
    >
      {children}
    </button>
  );
}

const inputClass =
  "w-full rounded-md border border-halo-border-1 bg-halo-bg-1 px-3 py-2 text-[14px] text-halo-fg-1 outline-none transition-colors focus:border-halo-primary";

function EditCard({ t, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: t.name,
    role: t.role,
    company: t.company,
    rating: t.rating,
    tags: t.tags.join(", "),
    text: t.text,
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function save() {
    onSave({
      name: form.name.trim() || t.name,
      role: form.role.trim(),
      company: form.company.trim(),
      rating: Number(form.rating) || 0,
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
      text: form.text.trim() || t.text,
    });
  }

  return (
    <div className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="grid gap-1 text-[12px] text-halo-fg-3">
          Name
          <input className={inputClass} value={form.name} onChange={set("name")} />
        </label>
        <label className="grid gap-1 text-[12px] text-halo-fg-3">
          Role
          <input className={inputClass} value={form.role} onChange={set("role")} />
        </label>
        <label className="grid gap-1 text-[12px] text-halo-fg-3">
          Company
          <input className={inputClass} value={form.company} onChange={set("company")} />
        </label>
      </div>
      <label className="grid gap-1 text-[12px] text-halo-fg-3">
        Testimonial
        <textarea className={cn(inputClass, "min-h-[88px] resize-y")} value={form.text} onChange={set("text")} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-[12px] text-halo-fg-3">
          Rating
          <select className={inputClass} value={form.rating} onChange={set("rating")}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n} star{n === 1 ? "" : "s"}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-[12px] text-halo-fg-3">
          Tags (comma separated)
          <input className={inputClass} value={form.tags} onChange={set("tags")} placeholder="pricing page, launch" />
        </label>
      </div>
      <div className="flex gap-2">
        <RowButton tone="primary" onClick={save}>Save changes</RowButton>
        <RowButton onClick={onCancel}>Cancel</RowButton>
      </div>
    </div>
  );
}

function TestimonialCard({ t, editing, onEdit, onCancel, setStatus, update }) {
  if (editing) {
    return (
      <div className="rounded-lg border border-halo-border-1 bg-halo-bg-3/40 p-4">
        <EditCard
          t={t}
          onCancel={onCancel}
          onSave={(patch) => {
            update(t.id, patch);
            onCancel();
          }}
        />
      </div>
    );
  }

  const actions = {
    pending: [
      { label: "Approve", tone: "primary", run: () => setStatus(t.id, "approved") },
      { label: "Reject", tone: "danger", run: () => setStatus(t.id, "rejected") },
    ],
    approved: [
      { label: "Unpublish", tone: "ghost", run: () => setStatus(t.id, "archived") },
    ],
    rejected: [
      { label: "Restore", tone: "ghost", run: () => setStatus(t.id, "pending") },
    ],
    archived: [
      { label: "Restore", tone: "ghost", run: () => setStatus(t.id, "pending") },
    ],
  }[t.status];

  return (
    <article className="rounded-lg border border-halo-border-1 bg-halo-bg-3/40 p-4">
      <div className="flex items-start gap-3">
        <Avatar name={t.name} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[14px] font-medium text-halo-fg-1">{t.name}</span>
            {(t.role || t.company) && (
              <span className="text-[13px] text-halo-fg-3">
                {[t.role, t.company].filter(Boolean).join(" · ")}
              </span>
            )}
            <span className="ml-auto flex items-center gap-2">
              <SourceIcon source={t.source} />
              <StatusBadge status={t.status} />
              <details className="group relative">
                <summary className="grid h-7 w-7 cursor-pointer list-none place-items-center rounded-pill text-halo-fg-3 transition-colors hover:bg-halo-bg-4 hover:text-halo-fg-1 [&::-webkit-details-marker]:hidden">
                  <MoreIcon />
                  <span className="sr-only">Review actions</span>
                </summary>
                <div className="absolute right-0 top-[calc(100%+6px)] z-20 grid w-36 gap-1 rounded-lg border border-halo-border-1 bg-halo-bg-1 p-1">
                  {actions.map((a) => (
                    <RowButton
                      key={a.label}
                      tone={a.tone}
                      onClick={a.run}
                      className={cn(
                        "w-full justify-start bg-transparent px-2 py-1.5",
                        a.tone === "primary" && "text-halo-primary"
                      )}
                    >
                      {a.label}
                    </RowButton>
                  ))}
                  <RowButton onClick={onEdit} className="w-full justify-start bg-transparent px-2 py-1.5">
                    Edit
                  </RowButton>
                </div>
              </details>
            </span>
          </div>
          <div className="mt-1.5">
            <Stars rating={t.rating} />
          </div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-halo-fg-2 sm:pr-36">{t.text}</p>
          {t.tags.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {t.tags.map((tag) => (
                <span key={tag} className="rounded-pill bg-halo-bg-4 px-2 py-0.5 text-[11px] text-halo-fg-3">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Inbox() {
  const { testimonials, setStatus, update } = useTestimonials();
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);

  const counts = useMemo(() => {
    const c = { all: testimonials.length };
    for (const s of TESTIMONIAL_STATUSES) c[s] = 0;
    for (const t of testimonials) c[t.status] += 1;
    return c;
  }, [testimonials]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return testimonials.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (!q) return true;
      return [t.name, t.company, t.role, t.text, ...t.tags]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [testimonials, statusFilter, query]);

  const tabs = [{ id: "all", label: "All" }, ...TESTIMONIAL_STATUSES.map((s) => ({ id: s, label: STATUS_META[s].label }))];

  return (
    <div className="halo-page">
      <header className="halo-page-header">
        <PageHeading
          title="Inbox"
          info="Approve, edit, and tag testimonials before they go public. Approved ones flow into your widgets."
        />
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div data-no-fill className="flex flex-wrap gap-0.5 rounded-md bg-halo-bg-3 p-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={cn(
                "rounded-[14px] px-2.5 py-1 text-[12px] font-medium",
                statusFilter === tab.id
                  ? "bg-halo-bg-1 text-halo-fg-1"
                  : "text-halo-fg-2"
              )}
            >
              {tab.label}
              <span className="ml-1.5 text-halo-fg-4">{counts[tab.id]}</span>
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search testimonials…"
          className={cn(inputClass, "ml-auto max-w-[260px]")}
        />
      </div>

      {filtered.length === 0 ? (
        <IllustratedEmptyState
          icon="cards"
          title="Nothing here"
          className="py-16"
        />
      ) : (
        <div className="grid gap-4">
          {filtered.map((t) => (
            <TestimonialCard
              key={t.id}
              t={t}
              editing={editingId === t.id}
              onEdit={() => setEditingId(t.id)}
              onCancel={() => setEditingId(null)}
              setStatus={setStatus}
              update={update}
            />
          ))}
        </div>
      )}
    </div>
  );
}
