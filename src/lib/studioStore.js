import { useMemo } from "react";
import { useDashboardData } from "@/lib/dashboardData.jsx";

export function useStudio() {
  const dashboard = useDashboardData();
  return useMemo(
    () => ({
      folders: dashboard.data.folders,
      widgets: dashboard.data.widgets,
      walls: dashboard.data.walls,
      assets: [...dashboard.data.widgets, ...dashboard.data.walls],
      async createFolder(name) {
        const folder = await dashboard.request("/api/studio/folders", {
          method: "POST",
          body: JSON.stringify({ name }),
        });
        dashboard.replace("folders", (current) => [...current, folder]);
        return folder;
      },
      async saveAsset(fields) {
        const asset = await dashboard.request("/api/studio/assets", {
          method: "PUT",
          body: JSON.stringify(fields),
        });
        const key = asset.kind === "wall" ? "walls" : "widgets";
        dashboard.replace(key, (current) => {
          const index = current.findIndex((item) => item.id === asset.id);
          return index < 0
            ? [asset, ...current]
            : current.map((item) => (item.id === asset.id ? asset : item));
        });
        return asset;
      },
    }),
    [dashboard]
  );
}
