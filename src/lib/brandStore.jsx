import { createContext, useContext, useMemo, useReducer } from "react";
import { defaultBrand } from "@/lib/brand";

// Shared client-side store for the workspace brand. Settings patches it; the
// Form Builder, Widget Studio, Walls, and dashboard chrome read it. Same seam as
// the testimonials/forms stores — swap the initial state for a fetched workspace
// row and the dispatch for an API call when a backend exists.
const BrandContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "update":
      return { ...state, ...action.patch };
    default:
      return state;
  }
}

export function BrandProvider({ children }) {
  const [brand, dispatch] = useReducer(reducer, defaultBrand);

  const value = useMemo(
    () => ({
      brand,
      update: (patch) => dispatch({ type: "update", patch }),
    }),
    [brand]
  );

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

export function useBrand() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error("useBrand must be used within a BrandProvider");
  return ctx;
}
