import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest, uploadImage } from "@/lib/api.js";
import { useAppAuth } from "@/lib/auth.jsx";

const DashboardDataContext = createContext(null);

export function DashboardDataProvider({ children }) {
  const auth = useAppAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth.isLoaded || !auth.isSignedIn) return;
    let active = true;
    apiRequest("/api/bootstrap", { getToken: auth.getToken })
      .then((next) => {
        if (active) setData(next);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      });
    return () => {
      active = false;
    };
  }, [auth.getToken, auth.isLoaded, auth.isSignedIn]);

  const value = useMemo(
    () => ({
      data,
      error,
      ready: Boolean(data),
      request: (path, options) =>
        apiRequest(path, { ...options, getToken: auth.getToken }),
      uploadLogo: (file) =>
        uploadImage(file, { getToken: auth.getToken, kind: "logo" }),
      replace(key, updater) {
        setData((current) =>
          current
            ? {
                ...current,
                [key]:
                  typeof updater === "function" ? updater(current[key]) : updater,
              }
            : current
        );
      },
      patchWorkspace(workspace) {
        setData((current) => (current ? { ...current, workspace } : current));
      },
    }),
    [auth.getToken, data, error]
  );

  return (
    <DashboardDataContext.Provider value={value}>
      {children}
    </DashboardDataContext.Provider>
  );
}

export function DashboardDataGate({ children }) {
  const { ready } = useDashboardData();
  return ready ? children : null;
}

export function useDashboardData() {
  const value = useContext(DashboardDataContext);
  if (!value) {
    throw new Error("useDashboardData must be used within DashboardDataProvider");
  }
  return value;
}
