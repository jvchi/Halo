import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// .aave-newsletter — compact split-pill capture. Mirrors the clone's
// setupNewsletter validation: inline status + error dot, no real network call.
export function Newsletter({ title, placeholder = "Email address", className }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // { ok: boolean, message: string }
  const inputId = useId();

  function handleSubmit(event) {
    event.preventDefault();
    const ok = EMAIL_RE.test(email.trim());
    setStatus({ ok, message: ok ? "Signed up" : "Enter a valid email" });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "w-full max-w-newsletter rounded-md bg-halo-newsletter-card p-8 max-md:p-6",
        className
      )}
      noValidate
    >
      {title ? (
        <h3 className="m-0 text-[24px] font-[450] leading-[1.5] tracking-[-0.02em] text-halo-fg-1">
          {title}
        </h3>
      ) : null}

      <div className="mt-5 grid grid-cols-[1fr_auto] gap-0 max-md:grid-cols-1 max-md:gap-2">
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          aria-invalid={status ? !status.ok : undefined}
          className="h-10 min-w-0 rounded-[20px_6px_6px_20px] border-0 bg-white px-4 py-2.5 text-[16px] text-halo-fg-1 outline-none placeholder:text-halo-fg-3 max-md:rounded-pill"
        />
        <button
          type="submit"
          className="h-10 cursor-pointer rounded-[6px_20px_20px_6px] border-0 bg-halo-fg-1 px-4 text-[14px] font-medium text-white max-md:rounded-pill"
        >
          Sign Up
        </button>
      </div>

      <AnimatePresence>
        {status ? (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "m-0 mt-3 min-h-[21px] text-[14px]",
              status.ok ? "text-halo-green" : "text-halo-red"
            )}
            role="status"
          >
            {status.message}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </form>
  );
}
