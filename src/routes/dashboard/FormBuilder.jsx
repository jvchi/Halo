import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { cn } from "@/lib/cn";
import { PageHeading } from "@/components/ui";
import { useForms } from "@/lib/formsStore.jsx";
import { useTestimonials } from "@/lib/testimonialsStore.jsx";

const inputClass =
  "w-full rounded-md border border-halo-border-1 bg-halo-bg-1 px-3 py-2 text-[14px] text-halo-fg-1 outline-none transition-colors placeholder:text-halo-fg-3 focus:border-halo-primary";
const labelClass = "grid gap-1.5 text-[12px] font-medium text-halo-fg-2";

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((n) => {
        const on = (hover || value) >= n;
        return (
          <button
            key={n}
            type="button"
            data-no-fill
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(n)}
            className="p-0.5"
          >
            <svg width="26" height="26" viewBox="0 0 20 20" aria-hidden="true">
              <path
                d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L10 14.77l-5.2 2.73.99-5.78L1.58 7.62l5.82-.85L10 1.5z"
                fill={on ? "var(--halo-primary)" : "none"}
                stroke={on ? "var(--halo-primary)" : "var(--halo-border-2)"}
                strokeWidth="1.2"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

// The real, working collection form. Fill it in and submit — the testimonial
// lands in the Inbox as `pending`. This same form is what Phase D serves at the
// public /submit/{slug} route.
function CollectionForm({ form, onSubmitted }) {
  const { config } = form;
  const { fields } = config;
  const { addTestimonial } = useTestimonials();

  const [values, setValues] = useState({
    name: "",
    text: "",
    role: "",
    company: "",
    website: "",
    rating: 0,
    consent: false,
  });
  const [error, setError] = useState("");

  const set = (key) => (e) => setValues((s) => ({ ...s, [key]: e.target.value }));

  function submit(e) {
    e.preventDefault();
    if (!values.name.trim() || !values.text.trim()) {
      setError("Please add your name and testimonial.");
      return;
    }
    if (config.requireConsent && !values.consent) {
      setError("Please agree to the consent statement to continue.");
      return;
    }
    addTestimonial({
      name: values.name.trim(),
      text: values.text.trim(),
      role: values.role.trim(),
      company: values.company.trim(),
      rating: fields.rating ? values.rating : 0,
      source: "form",
    });
    onSubmitted();
  }

  return (
    <form onSubmit={submit} noValidate className="mt-5 grid gap-4">
      {fields.rating ? (
        <div className="grid gap-1.5">
          <span className="text-[12px] font-medium text-halo-fg-2">Your rating</span>
          <StarRating value={values.rating} onChange={(n) => setValues((s) => ({ ...s, rating: n }))} />
        </div>
      ) : null}

      <label className={labelClass}>
        {config.prompt || "Your testimonial"}
        <textarea
          className={cn(inputClass, "min-h-[96px] resize-y")}
          value={values.text}
          onChange={set("text")}
          placeholder="Share your experience…"
        />
      </label>

      <label className={labelClass}>
        Your name
        <input className={inputClass} value={values.name} onChange={set("name")} placeholder="Jane Doe" />
      </label>

      {(fields.role || fields.company) && (
        <div className={cn("grid gap-4", fields.role && fields.company && "sm:grid-cols-2")}>
          {fields.role ? (
            <label className={labelClass}>
              Role / title
              <input className={inputClass} value={values.role} onChange={set("role")} placeholder="Founder" />
            </label>
          ) : null}
          {fields.company ? (
            <label className={labelClass}>
              Company
              <input className={inputClass} value={values.company} onChange={set("company")} placeholder="Acme" />
            </label>
          ) : null}
        </div>
      )}

      {fields.website ? (
        <label className={labelClass}>
          Website
          <input className={inputClass} value={values.website} onChange={set("website")} placeholder="acme.com" />
        </label>
      ) : null}

      {fields.avatar ? (
        <label className={labelClass}>
          Photo <span className="font-normal text-halo-fg-3">(optional)</span>
          <input
            type="file"
            accept="image/*"
            className="text-[13px] text-halo-fg-3 file:mr-3 file:rounded-pill file:border-0 file:bg-halo-bg-3 file:px-3 file:py-1.5 file:text-[12px] file:font-medium file:text-halo-fg-1"
          />
        </label>
      ) : null}

      {config.requireConsent ? (
        <label className="flex items-start gap-2.5 text-[12px] leading-relaxed text-halo-fg-2">
          <input
            type="checkbox"
            checked={values.consent}
            onChange={(e) => setValues((s) => ({ ...s, consent: e.target.checked }))}
            className="mt-0.5 h-4 w-4 shrink-0 accent-halo-primary"
          />
          {config.consentText}
        </label>
      ) : null}

      {error ? <p className="m-0 text-[12px] text-halo-red">{error}</p> : null}

      <button
        type="submit"
        className="mt-1 inline-flex min-h-[45px] items-center justify-center rounded-pill bg-halo-primary px-6 text-[15px] font-medium text-white transition-transform duration-[180ms] ease-snappy active:scale-[0.98]"
      >
        {config.submitLabel || "Submit testimonial"}
      </button>
    </form>
  );
}

export default function FormBuilder() {
  const { formId } = useParams();
  const { forms } = useForms();
  const form = forms.find((f) => f.id === formId);

  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!form) return <Navigate to="/dashboard/forms" replace />;

  function copyLink() {
    navigator.clipboard?.writeText(`https://halo.app/submit/${form.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="halo-page">
      <header className="halo-page-header">
        <PageHeading title={form.name} />
        <Link
          to="/dashboard/forms"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-halo-fg-2 transition-colors hover:text-halo-fg-1"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M9.5 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Forms
        </Link>
        <span className="ml-auto truncate text-[13px] text-halo-fg-3">{form.name}</span>
      </header>

      <div className="grid place-items-center rounded-xs bg-halo-bg-3 px-4 py-10 sm:px-8 sm:py-14">
        <div className="w-full max-w-[460px] rounded-lg border border-halo-border-1 bg-halo-bg-1 p-6 sm:p-7">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-pill bg-halo-primary text-[12px] font-semibold text-white">
              H
            </span>
            <span className="text-[13px] font-medium text-halo-fg-2">Halo</span>
          </div>

          {submitted ? (
            <div className="grid place-items-center gap-3 py-10 text-center">
              <span className="grid h-11 w-11 place-items-center rounded-pill bg-halo-primary-wash">
                <svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3.5 8.5l3 3 6-6.5" stroke="var(--halo-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p className="m-0 text-[18px] font-medium leading-snug tracking-[-0.01em] text-halo-fg-1 text-balance">
                {form.config.thankYou}
              </p>
              <p className="m-0 text-[13px] text-halo-fg-3">It’s now waiting for approval in your Inbox.</p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-1 text-[13px] font-medium text-halo-primary"
              >
                Submit another
              </button>
            </div>
          ) : (
            <>
              <h2 className="m-0 mt-4 text-[20px] font-medium leading-tight tracking-[-0.01em] text-halo-fg-1 text-balance">
                {form.config.headline}
              </h2>
              {form.config.description ? (
                <p className="m-0 mt-1.5 text-[14px] leading-relaxed text-halo-fg-2">{form.config.description}</p>
              ) : null}
              <CollectionForm form={form} onSubmitted={() => setSubmitted(true)} />
            </>
          )}
        </div>
      </div>

      <div className="halo-studio-footer-action">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          <span className="font-mono text-[13px] text-halo-fg-3">halo.app/submit/{form.slug}</span>
          <button type="button" onClick={copyLink} className="halo-copy-button">
            {copied ? "Copied ✓" : "Copy form link"}
          </button>
        </div>
      </div>
    </div>
  );
}
