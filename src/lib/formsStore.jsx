import { createContext, useContext, useMemo, useState } from "react";
import { useDashboardData } from "@/lib/dashboardData.jsx";

const FormsContext = createContext(null);

export function FormsProvider({ children }) {
  const dashboard = useDashboardData();
  const [forms, setForms] = useState(() => dashboard.data.forms);

  const value = useMemo(
    () => ({
      forms,
      async create(overrides = {}) {
        const form = await dashboard.request("/api/forms", {
          method: "POST",
          body: JSON.stringify(overrides),
        });
        setForms((current) => [form, ...current]);
        dashboard.replace("forms", (current) => [form, ...current]);
        return form;
      },
      update(id, patch) {
        setForms((current) =>
          current.map((form) => (form.id === id ? { ...form, ...patch } : form))
        );
      },
      updateConfig(id, patch) {
        setForms((current) =>
          current.map((form) =>
            form.id === id
              ? { ...form, config: { ...form.config, ...patch } }
              : form
          )
        );
      },
      async save(id) {
        const form = forms.find((item) => item.id === id);
        if (!form) return null;
        const saved = await dashboard.request(`/api/forms/${encodeURIComponent(id)}`, {
          method: "PATCH",
          body: JSON.stringify({
            name: form.name,
            slug: form.slug,
            status: form.status,
            config: form.config,
          }),
        });
        setForms((current) =>
          current.map((item) => (item.id === id ? saved : item))
        );
        return saved;
      },
      async setStatus(id, status) {
        const previous = forms.find((form) => form.id === id)?.status;
        setForms((current) =>
          current.map((form) => (form.id === id ? { ...form, status } : form))
        );
        try {
          const saved = await dashboard.request(`/api/forms/${encodeURIComponent(id)}`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
          });
          setForms((current) =>
            current.map((form) => (form.id === id ? saved : form))
          );
          return saved;
        } catch (error) {
          setForms((current) =>
            current.map((form) =>
              form.id === id ? { ...form, status: previous } : form
            )
          );
          throw error;
        }
      },
      async duplicate(id) {
        const form = await dashboard.request(
          `/api/forms/${encodeURIComponent(id)}/duplicate`,
          { method: "POST" }
        );
        setForms((current) => [form, ...current]);
        return form;
      },
      async remove(id) {
        const previous = forms;
        setForms((current) => current.filter((form) => form.id !== id));
        try {
          await dashboard.request(`/api/forms/${encodeURIComponent(id)}`, {
            method: "DELETE",
          });
        } catch (error) {
          setForms(previous);
          throw error;
        }
      },
    }),
    [dashboard, forms]
  );

  return <FormsContext.Provider value={value}>{children}</FormsContext.Provider>;
}

export function useForms() {
  const value = useContext(FormsContext);
  if (!value) throw new Error("useForms must be used within FormsProvider");
  return value;
}
