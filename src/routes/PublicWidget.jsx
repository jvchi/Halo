import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { WidgetRenderer } from "@/components/widget/WidgetRenderer.jsx";
import { apiRequest } from "@/lib/api.js";
import { brandWidgetPreset } from "@/lib/brand";

export default function PublicWidget() {
  const { widgetSlug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const rootRef = useRef(null);

  useEffect(() => {
    let active = true;
    apiRequest(`/api/public/widgets/${encodeURIComponent(widgetSlug)}`)
      .then((next) => {
        if (active) setData(next);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      });
    return () => {
      active = false;
    };
  }, [widgetSlug]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !data) return;
    const report = () => {
      const height = Math.ceil(root.getBoundingClientRect().height);
      window.parent?.postMessage(
        { type: "halo:resize", slug: widgetSlug, height },
        "*"
      );
    };
    report();
    const observer = new ResizeObserver(report);
    observer.observe(root);
    return () => observer.disconnect();
  }, [data, widgetSlug]);

  const config = useMemo(() => {
    if (!data) return null;
    return {
      type: "grid",
      theme: brandWidgetPreset(data.brand.brandColor),
      columns: 3,
      display: {
        showAvatar: true,
        showCompany: true,
        showRating: true,
        showSource: true,
      },
      ...data.widget.config,
    };
  }, [data]);

  if (!data && !error) return null;
  return (
    <main ref={rootRef} style={{ padding: 16, background: config?.theme?.background ?? "#fff" }}>
      {error ? (
        <p role="alert" style={{ margin: 0, color: "#ff3b30", font: "14px/20px system-ui" }}>
          {error}
        </p>
      ) : (
        <WidgetRenderer config={config} testimonials={data.testimonials} />
      )}
    </main>
  );
}
