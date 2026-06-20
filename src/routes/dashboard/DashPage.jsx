import { IllustratedEmptyState, PageHeading } from "@/components/ui";

// Shared illustrated scaffold for dashboard modules. Real feature UIs (inbox,
// widget studio controls, etc.) are out of scope for this conversion pass.
export function DashPage({ title, description, emptyTitle, emptyHint, emptyIllustration }) {
  return (
    <div className="halo-page">
      <header className="halo-page-header">
        <PageHeading title={title} info={description} />
      </header>

      <IllustratedEmptyState
        illustration={emptyIllustration}
        title={emptyTitle}
        hint={emptyHint}
        className="py-16"
      />
    </div>
  );
}
