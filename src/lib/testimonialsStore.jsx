import { createContext, useContext, useMemo, useState } from "react";
import { useDashboardData } from "@/lib/dashboardData.jsx";

const TestimonialsContext = createContext(null);

export function TestimonialsProvider({ children }) {
  const dashboard = useDashboardData();
  const [testimonials, setTestimonials] = useState(
    () => dashboard.data.testimonials
  );

  const value = useMemo(
    () => ({
      testimonials,
      approved: testimonials.filter((item) => item.status === "approved"),
      async addTestimonial(fields) {
        const testimonial = await dashboard.request("/api/testimonials", {
          method: "POST",
          body: JSON.stringify({ status: "pending", ...fields }),
        });
        setTestimonials((current) => [testimonial, ...current]);
        return testimonial;
      },
      async setStatus(id, status) {
        const previous = testimonials.find((item) => item.id === id)?.status;
        setTestimonials((current) =>
          current.map((item) => (item.id === id ? { ...item, status } : item))
        );
        try {
          const saved = await dashboard.request(
            `/api/testimonials/${encodeURIComponent(id)}`,
            {
              method: "PATCH",
              body: JSON.stringify({ status }),
            }
          );
          setTestimonials((current) =>
            current.map((item) => (item.id === id ? saved : item))
          );
          return saved;
        } catch (error) {
          setTestimonials((current) =>
            current.map((item) =>
              item.id === id ? { ...item, status: previous } : item
            )
          );
          throw error;
        }
      },
      async update(id, patch) {
        const previous = testimonials.find((item) => item.id === id);
        setTestimonials((current) =>
          current.map((item) => (item.id === id ? { ...item, ...patch } : item))
        );
        try {
          const saved = await dashboard.request(
            `/api/testimonials/${encodeURIComponent(id)}`,
            {
              method: "PATCH",
              body: JSON.stringify(patch),
            }
          );
          setTestimonials((current) =>
            current.map((item) => (item.id === id ? saved : item))
          );
          return saved;
        } catch (error) {
          setTestimonials((current) =>
            current.map((item) => (item.id === id ? previous : item))
          );
          throw error;
        }
      },
    }),
    [dashboard, testimonials]
  );

  return (
    <TestimonialsContext.Provider value={value}>
      {children}
    </TestimonialsContext.Provider>
  );
}

export function useTestimonials() {
  const value = useContext(TestimonialsContext);
  if (!value) {
    throw new Error("useTestimonials must be used within TestimonialsProvider");
  }
  return value;
}
