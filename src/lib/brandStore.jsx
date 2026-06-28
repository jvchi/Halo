import { createContext, useContext, useMemo, useState } from "react";
import { useDashboardData } from "@/lib/dashboardData.jsx";

const BrandContext = createContext(null);

export function BrandProvider({ children }) {
  const dashboard = useDashboardData();
  const [brand, setBrand] = useState(() => dashboard.data.workspace);

  const value = useMemo(
    () => ({
      brand,
      update(patch) {
        setBrand((current) => ({ ...current, ...patch }));
      },
      async save() {
        const payload = {
          workspaceName: brand.workspaceName,
          slug: brand.slug,
          website: brand.website,
          brandColor: brand.brandColor,
          logoAssetId: brand.logoAssetId ?? null,
        };
        const saved = await dashboard.request("/api/workspace", {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setBrand(saved);
        dashboard.patchWorkspace(saved);
        return saved;
      },
      async uploadLogo(file) {
        const upload = await dashboard.uploadLogo(file);
        setBrand((current) => ({
          ...current,
          logoAssetId: upload.mediaId,
          logoImage: URL.createObjectURL(file),
        }));
        return upload;
      },
    }),
    [brand, dashboard]
  );

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

export function useBrand() {
  const value = useContext(BrandContext);
  if (!value) throw new Error("useBrand must be used within BrandProvider");
  return value;
}
