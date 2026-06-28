import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BrandMark } from "@/components/dashboard/BrandMark.jsx";
import { brandCssVars } from "@/lib/brand";
import { apiRequest, submitPublicTestimonial } from "@/lib/api.js";
import { CollectionForm } from "@/routes/dashboard/FormBuilder.jsx";

export default function PublicForm() {
  const { formSlug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let active = true;
    apiRequest(`/api/public/forms/${encodeURIComponent(formSlug)}`)
      .then((next) => {
        if (active) setData(next);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      });
    return () => {
      active = false;
    };
  }, [formSlug]);

  if (!data && !error) return null;

  return (
    <main className="min-h-screen bg-halo-bg-2 px-4 py-10">
      <div
        style={brandCssVars(data?.brand?.brandColor ?? "#0071e3")}
        className="halo-form-preview-frame mx-auto"
      >
        {error ? (
          <p role="alert" className="m-0 text-[13px] text-halo-red">
            {error}
          </p>
        ) : submitted ? (
          <div className="grid place-items-center gap-3 py-16 text-center">
            <span className="grid h-11 w-11 place-items-center rounded-pill bg-halo-primary-wash">
              <svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3.5 8.5l3 3 6-6.5" stroke="var(--halo-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="m-0 text-[18px] font-medium leading-snug tracking-[-0.01em] text-halo-fg-1 text-balance">
              {data.form.config.thankYou}
            </p>
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
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <BrandMark brand={data.brand} size={24} />
              <h1 className="m-0 text-[20px] font-medium leading-tight tracking-[-0.01em] text-halo-fg-1">
                {data.form.config.headline}
              </h1>
            </div>
            {data.form.config.description ? (
              <p className="m-0 mt-1.5 text-[14px] leading-relaxed text-halo-fg-2">
                {data.form.config.description}
              </p>
            ) : null}
            <CollectionForm
              form={data.form}
              onSubmitted={() => setSubmitted(true)}
              onSubmitTestimonial={({ photo, ...fields }) =>
                submitPublicTestimonial(formSlug, fields, photo)
              }
            />
          </>
        )}
      </div>
    </main>
  );
}
