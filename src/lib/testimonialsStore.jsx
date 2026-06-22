import { createContext, useContext, useMemo, useReducer } from "react";
import { sampleTestimonials } from "@/lib/testimonials";

// Shared client-side store for the dashboard's mock testimonials. The Inbox
// mutates moderation status / fields here; the Widget Studio reads the derived
// `approved` list. This is the seam where a backend later plugs in — swap the
// reducer's initial state for fetched data and the dispatches for API calls.
const TestimonialsContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "add":
      return [action.testimonial, ...state];
    case "setStatus":
      return state.map((t) =>
        t.id === action.id ? { ...t, status: action.status } : t
      );
    case "update":
      return state.map((t) =>
        t.id === action.id ? { ...t, ...action.patch } : t
      );
    default:
      return state;
  }
}

const newId = () =>
  globalThis.crypto?.randomUUID?.() ?? `t-${Date.now().toString(36)}`;

export function TestimonialsProvider({ children }) {
  const [testimonials, dispatch] = useReducer(reducer, sampleTestimonials);

  const value = useMemo(
    () => ({
      testimonials,
      approved: testimonials.filter((t) => t.status === "approved"),
      // A new submission always lands as `pending` so it shows up in the Inbox
      // for moderation — never auto-published.
      addTestimonial: (fields) => {
        const testimonial = {
          id: newId(),
          role: "",
          company: "",
          rating: 0,
          source: "form",
          status: "pending",
          tags: [],
          ...fields,
        };
        dispatch({ type: "add", testimonial });
        return testimonial;
      },
      setStatus: (id, status) => dispatch({ type: "setStatus", id, status }),
      update: (id, patch) => dispatch({ type: "update", id, patch }),
    }),
    [testimonials]
  );

  return (
    <TestimonialsContext.Provider value={value}>
      {children}
    </TestimonialsContext.Provider>
  );
}

export function useTestimonials() {
  const ctx = useContext(TestimonialsContext);
  if (!ctx) {
    throw new Error("useTestimonials must be used within a TestimonialsProvider");
  }
  return ctx;
}
