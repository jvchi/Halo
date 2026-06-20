import { IllustratedEmptyState } from "@/components/ui";

// Shared illustrated scaffold for dashboard modules. Real feature UIs (inbox,
// widget studio controls, etc.) are out of scope for this conversion pass.
export function DashPage({ icon, title, description, emptyTitle, emptyHint, emptyIllustration }) {
  return (
    <div className="grid gap-8">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-md bg-halo-bg-3">{icon}</div>
        <div className="grid gap-1">
          <h1 className="m-0 text-[26px] font-medium tracking-[-0.02em] text-halo-fg-1">{title}</h1>
          <p className="m-0 text-[15px] text-halo-fg-2">{description}</p>
        </div>
      </div>

      <IllustratedEmptyState
        illustration={emptyIllustration}
        title={emptyTitle}
        hint={emptyHint}
        className="py-16"
      />
    </div>
  );
}
