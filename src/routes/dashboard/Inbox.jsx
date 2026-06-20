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

function RowButton({ onClick, children, tone = "ghost" }) {
  const tones = {
    primary: "bg-halo-primary text-white hover:opacity-90",
    ghost: "bg-halo-bg-3 text-halo-fg-2 hover:bg-halo-bg-4 hover:text-halo-fg-1",
    danger:
      "text-halo-red hover:bg-[color-mix(in_srgb,var(--halo-red)_12%,transparent)]",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors",
        tones[tone]
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
    <div className="rounded-lg border border-halo-border-1 bg-halo-bg-3/40 p-4">
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
            <span className="ml-auto flex items-center gap-2.5">
              <span className="text-[12px] text-halo-fg-3">via {SOURCE_LABELS[t.source] ?? t.source}</span>
              <StatusBadge status={t.status} />
            </span>
          </div>
          <div className="mt-1.5">
            <Stars rating={t.rating} />
          </div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-halo-fg-2">{t.text}</p>
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
      <div className="mt-3 flex flex-wrap gap-2 pl-[48px]">
        {actions.map((a) => (
          <RowButton key={a.label} tone={a.tone} onClick={a.run}>{a.label}</RowButton>
        ))}
        <RowButton onClick={onEdit}>Edit</RowButton>
      </div>
    </div>
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
        <div className="flex flex-wrap gap-0.5 rounded-md bg-halo-bg-3 p-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={cn(
                "rounded-[14px] px-2.5 py-1 text-[12px] font-medium transition-colors",
                statusFilter === tab.id
                  ? "bg-halo-bg-1 text-halo-fg-1"
                  : "text-halo-fg-2 hover:text-halo-fg-1"
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
          illustration="/illustrations/empty-inbox.png"
          title="Nothing here"
          hint={query ? "No testimonials match your search." : "No testimonials with this status yet."}
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
