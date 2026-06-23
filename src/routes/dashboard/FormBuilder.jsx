import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Link, useParams, Navigate } from "react-router-dom";
import { cn } from "@/lib/cn";
import { PageHeading, Button } from "@/components/ui";
import { useForms } from "@/lib/formsStore.jsx";
import { useTestimonials } from "@/lib/testimonialsStore.jsx";

const inputClass =
  "w-full rounded-md border border-halo-border-1 bg-halo-bg-1 px-3 py-2 text-[14px] text-halo-fg-1 outline-none transition-colors placeholder:text-halo-fg-3 focus:border-halo-primary";
const labelClass = "grid gap-1.5 text-[12px] font-medium text-halo-fg-2";

// Branded checkbox: a 18px box that fills primary with a white check when on.
// The check is white at all times — invisible on the white resting fill, visible
// once the box turns primary — so no nested peer selector is needed.
function Checkbox({ checked, onChange, children }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 text-[12px] leading-relaxed text-halo-fg-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span className="mt-px grid h-[18px] w-[18px] shrink-0 place-items-center rounded-xs border border-halo-border-2 bg-halo-bg-1 text-white transition-colors peer-checked:border-halo-primary peer-checked:bg-halo-primary peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[3px] peer-focus-visible:outline-halo-focus">
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3.5 8.5l3 3 6-6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span>{children}</span>
    </label>
  );
}

// Photo upload: a hidden file input behind a ghost button, so the control reads
// like the rest of the system instead of a raw browser file picker.
function PhotoField() {
  const ref = useRef(null);
  const [fileName, setFileName] = useState("");
  return (
    <div className="grid gap-1.5">
      <span className="text-[12px] font-medium text-halo-fg-2">
        Photo <span className="font-normal text-halo-fg-3">(optional)</span>
      </span>
      <div className="flex items-center gap-3">
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
        />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="inline-flex min-h-[34px] items-center gap-1.5 rounded-pill bg-halo-bg-3 px-3.5 text-[13px] font-medium text-halo-fg-1 transition-colors hover:bg-halo-bg-4"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 10.5V3.5M5.2 6.3 8 3.5l2.8 2.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.5 10.5v1.2a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-1.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          {fileName ? "Change photo" : "Choose photo"}
        </button>
        {fileName ? <span className="min-w-0 truncate text-[12px] text-halo-fg-3">{fileName}</span> : null}
      </div>
    </div>
  );
}

const STAR_PATH =
  "M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L10 14.77l-5.2 2.73.99-5.78L1.58 7.62l5.82-.85L10 1.5z";

// outline = empty, preview = light hover affordance, filled = committed/active.
function Star({ variant }) {
  const fill =
    variant === "filled" ? "var(--halo-primary)" : variant === "preview" ? "var(--halo-primary-wash)" : "none";
  const stroke =
    variant === "filled"
      ? "var(--halo-primary)"
      : variant === "preview"
        ? "var(--halo-primary-soft)"
        : "var(--halo-border-2)";
  return (
    <svg width="30" height="30" viewBox="0 0 20 20" aria-hidden="true">
      <path d={STAR_PATH} fill={fill} stroke={stroke} strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

// A short particle burst that radiates from the rating's centre — the Duolingo
// "you nailed it" moment, fired only on a perfect 5. Keyed by a counter so it
// replays each time. Particles use the brand blue plus a gold accent.
function Sparkles() {
  const COUNT = 12;
  return (
    <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
      {Array.from({ length: COUNT }).map((_, i) => {
        const angle = (i / COUNT) * Math.PI * 2 + (i % 2) * 0.26;
        const dist = 30 + (i % 3) * 11;
        return (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-pill"
            style={{ background: i % 3 === 0 ? "var(--halo-yellow-2)" : "var(--halo-primary)" }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              scale: [0, 1.2, 0],
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 0.6, ease: "easeOut", delay: (i % 4) * 0.02 }}
          />
        );
      })}
    </div>
  );
}

// Two distinct states, like the Segmented/viewport switch (hover affordance vs
// committed active). Hover = a quiet light wash that fades in (preview). Click =
// the solid primary fill that springs in with a Duolingo-style overshoot,
// staggered left-to-right. The pop only fires on commit, never on hover. A
// perfect 5 also pulses the row and fires a particle burst.
function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const [burst, setBurst] = useState(0);

  function pick(n) {
    onChange(n);
    if (n === 5) setBurst((b) => b + 1);
  }

  return (
    // No layout shift: the celebration is a purely additive overlay. The row
    // box never scales — that would move the stars and reflow neighbours — so
    // the pop and burst stay inside their own boxes.
    <div role="radiogroup" aria-label="Your rating" className="relative inline-flex gap-1">
      {burst > 0 ? <Sparkles key={burst} /> : null}
      {[1, 2, 3, 4, 5].map((n) => {
        const committed = value >= n;
        const preview = !committed && hover >= n;
        return (
          <motion.button
            key={n}
            type="button"
            data-no-fill
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(0)}
            onClick={() => pick(n)}
            whileTap={{ scale: 0.85 }}
            className="relative p-0.5"
          >
            <Star variant="outline" />

            {/* Hover preview — a calm wash that fades in, the quiet affordance. */}
            <span
              className={cn(
                "pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-150",
                preview ? "opacity-100" : "opacity-0"
              )}
            >
              <Star variant="preview" />
            </span>

            {/* Committed — solid fill that springs in on click with a bouncy
                overshoot and a quick settle twist. */}
            <motion.span
              className="pointer-events-none absolute inset-0 grid place-items-center"
              initial={false}
              animate={{ scale: committed ? 1 : 0, rotate: committed ? 0 : -25 }}
              transition={
                committed
                  ? { type: "spring", stiffness: 620, damping: 11, delay: (n - 1) * 0.05 }
                  : { duration: 0.12, ease: "easeIn" }
              }
              style={{ transformOrigin: "center" }}
            >
              <Star variant="filled" />
            </motion.span>
          </motion.button>
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
    <form onSubmit={submit} noValidate className="mt-6 grid gap-5">
      {fields.rating ? (
        <div className="grid gap-1.5">
          <span className="text-[12px] font-medium text-halo-fg-2">Your rating</span>
          <StarRating value={values.rating} onChange={(n) => setValues((s) => ({ ...s, rating: n }))} />
        </div>
      ) : null}

      <label className={labelClass}>
        {config.prompt || "Your testimonial"}
        <textarea
          className={cn(inputClass, "min-h-[140px] resize-y")}
          value={values.text}
          onChange={set("text")}
          placeholder="Share your experience…"
        />
      </label>

      {/* Short fields auto-fill across the width — as many columns as fit, no gaps. */}
      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
        <label className={labelClass}>
          Your name
          <input className={inputClass} value={values.name} onChange={set("name")} placeholder="Jane Doe" />
        </label>
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
        {fields.website ? (
          <label className={labelClass}>
            Website
            <input className={inputClass} value={values.website} onChange={set("website")} placeholder="acme.com" />
          </label>
        ) : null}
      </div>

      {fields.avatar ? <PhotoField /> : null}

      {config.requireConsent ? (
        <Checkbox checked={values.consent} onChange={(v) => setValues((s) => ({ ...s, consent: v }))}>
          {config.consentText}
        </Checkbox>
      ) : null}

      {/* Error sits beside the button (wraps below on mobile) so showing it
          never pushes the submit down — no layout shift. */}
      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Button type="submit" className="w-full sm:w-auto">
          {config.submitLabel || "Submit testimonial"}
        </Button>
        {error ? (
          <p role="alert" className="m-0 text-[12px] text-halo-red">
            {error}
          </p>
        ) : null}
      </div>
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

      <section className="rounded-lg border border-halo-border-1 bg-halo-bg-1 p-6 sm:p-8">
        {submitted ? (
          <div className="grid place-items-center gap-3 py-16 text-center">
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
              data-no-fill
              onClick={() => setSubmitted(false)}
              className="mt-1 rounded-md px-2 py-1 text-[13px] font-medium text-halo-primary transition-colors hover:bg-halo-primary-wash"
            >
              Submit another
            </button>
          </div>
        ) : (
          <>
            {/* Compact header: brand + headline + description on one tight stack
                so it never pushes the inputs down the page. */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="grid h-6 w-6 place-items-center rounded-pill bg-halo-primary text-[12px] font-semibold text-white">
                H
              </span>
              <h2 className="m-0 text-[20px] font-medium leading-tight tracking-[-0.01em] text-halo-fg-1">
                {form.config.headline}
              </h2>
            </div>
            {form.config.description ? (
              <p className="m-0 mt-1.5 text-[14px] leading-relaxed text-halo-fg-2">{form.config.description}</p>
            ) : null}
            <CollectionForm form={form} onSubmitted={() => setSubmitted(true)} />
          </>
        )}
      </section>

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
