import { createContext, useContext, useMemo, useReducer } from "react";
import { sampleForms, createForm } from "@/lib/forms";

// Shared client-side store for collection forms. The Forms list creates/removes
// forms; the Form Builder reads and patches one form's config. This is the same
// seam as the testimonials store — swap the reducer's initial state for fetched
// data and the dispatches for API calls when a backend exists.
const FormsContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "add":
      return [action.form, ...state];
    case "update":
      return state.map((f) => (f.id === action.id ? { ...f, ...action.patch } : f));
    case "updateConfig":
      return state.map((f) =>
        f.id === action.id ? { ...f, config: { ...f.config, ...action.patch } } : f
      );
    case "remove":
      return state.filter((f) => f.id !== action.id);
    default:
      return state;
  }
}

export function FormsProvider({ children }) {
  const [forms, dispatch] = useReducer(reducer, sampleForms);

  const value = useMemo(
    () => ({
      forms,
      create: (overrides) => {
        const form = createForm(overrides);
        dispatch({ type: "add", form });
        return form;
      },
      update: (id, patch) => dispatch({ type: "update", id, patch }),
      updateConfig: (id, patch) => dispatch({ type: "updateConfig", id, patch }),
      setStatus: (id, status) => dispatch({ type: "update", id, patch: { status } }),
      duplicate: (id) => {
        const source = forms.find((f) => f.id === id);
        if (!source) return null;
        const form = createForm({
          name: `${source.name} copy`,
          status: source.status,
          config: source.config,
        });
        dispatch({ type: "add", form });
        return form;
      },
      remove: (id) => dispatch({ type: "remove", id }),
    }),
    [forms]
  );

  return <FormsContext.Provider value={value}>{children}</FormsContext.Provider>;
}

export function useForms() {
  const ctx = useContext(FormsContext);
  if (!ctx) throw new Error("useForms must be used within FormsProvider");
  return ctx;
}
