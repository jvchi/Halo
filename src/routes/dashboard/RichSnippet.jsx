import { useMemo, useState } from "react";
import { PageHeading } from "@/components/ui";
import { HaloIcon } from "@/components/dashboard/HaloIcon.jsx";
import { useBrand } from "@/lib/brandStore.jsx";
import { useTestimonials } from "@/lib/testimonialsStore.jsx";

function ratingSummary(testimonials) {
  const rated = testimonials.filter((testimonial) => testimonial.rating > 0);
  if (!rated.length) return { average: 0, count: 0 };
  const total = rated.reduce((sum, testimonial) => sum + testimonial.rating, 0);
  return { average: total / rated.length, count: rated.length };
}

export default function RichSnippet() {
  const { brand } = useBrand();
  const { approved } = useTestimonials();
  const [schemaType, setSchemaType] = useState("Product");
  const [copied, setCopied] = useState(false);
  const summary = useMemo(() => ratingSummary(approved), [approved]);
  const jsonLd = useMemo(
    () =>
      JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": schemaType,
          name: brand.workspaceName,
          url: brand.website ? `https://${brand.website.replace(/^https?:\/\//, "")}` : "https://example.com",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: summary.average ? summary.average.toFixed(1) : "5.0",
            reviewCount: Math.max(summary.count, approved.length),
          },
          review: approved.slice(0, 3).map((testimonial) => ({
            "@type": "Review",
            author: testimonial.name,
            reviewRating: {
              "@type": "Rating",
              ratingValue: testimonial.rating || 5,
              bestRating: 5,
            },
            reviewBody: testimonial.text,
          })),
        },
        null,
        2
      ),
    [approved, brand.website, brand.workspaceName, schemaType, summary.average, summary.count]
  );

  function copyCode() {
    navigator.clipboard?.writeText(`<script type="application/ld+json">\n${jsonLd}\n</script>`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="halo-page">
      <header className="halo-page-header">
        <PageHeading
          title="Rich snippet"
          info="Generate review schema for eligible pages and keep it aligned with approved proof."
        />
        <button type="button" className="halo-copy-button" onClick={copyCode}>
          <HaloIcon name="copy" size={15} />
          {copied ? "Copied" : "Copy code"}
        </button>
      </header>

      <section className="halo-feature-grid halo-feature-grid-3" aria-label="Snippet readiness">
        <div className="halo-metric-tile">
          <span>Approved reviews</span>
          <strong>{approved.length}</strong>
          <small>Included in schema</small>
        </div>
        <div className="halo-metric-tile">
          <span>Average rating</span>
          <strong>{summary.average ? summary.average.toFixed(1) : "5.0"}</strong>
          <small>Out of 5 stars</small>
        </div>
        <div className="halo-metric-tile">
          <span>Eligibility</span>
          <strong>{approved.length >= 3 ? "Good" : "Draft"}</strong>
          <small>Google decides display timing</small>
        </div>
      </section>

      <div className="halo-workbench-grid">
        <section className="halo-panel">
          <header className="halo-panel-header">
            <span>Schema setup</span>
            <small>Product or organization page</small>
          </header>
          <div className="halo-pill-tabs" aria-label="Schema type">
            {["Product", "Organization", "SoftwareApplication"].map((type) => (
              <button key={type} type="button" onClick={() => setSchemaType(type)} className={schemaType === type ? "is-active" : ""}>
                {type}
              </button>
            ))}
          </div>
          <pre className="halo-snippet-code">
            <code>{jsonLd}</code>
          </pre>
        </section>

        <aside className="halo-panel">
          <header className="halo-panel-header">
            <span>Checklist</span>
            <small>Before publishing</small>
          </header>
          <div className="halo-check-list">
            <p><HaloIcon name="check" size={16} /> Embed a Halo widget on the same page.</p>
            <p><HaloIcon name="check" size={16} /> Keep review text visible to visitors.</p>
            <p><HaloIcon name="check" size={16} /> Use real customer reviews only.</p>
            <p><HaloIcon name="check" size={16} /> Allow 2 to 8 weeks for indexing after deployment.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
