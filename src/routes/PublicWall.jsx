import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { WallView } from "@/components/widget/WallView.jsx";
import { apiRequest } from "@/lib/api.js";

export default function PublicWall({ byWorkspace = false }) {
  const { wallSlug, workspaceSlug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const endpoint = byWorkspace
      ? `/api/public/workspaces/${encodeURIComponent(workspaceSlug)}/wall`
      : `/api/public/walls/${encodeURIComponent(wallSlug)}`;
    apiRequest(endpoint)
      .then((next) => {
        if (active) setData(next);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      });
    return () => {
      active = false;
    };
  }, [byWorkspace, wallSlug, workspaceSlug]);

  if (!data && !error) return null;
  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-halo-bg-2 px-6">
        <p role="alert" className="m-0 text-[13px] text-halo-red">{error}</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: data.wall.config.theme.background }}>
      <WallView
        config={data.wall.config}
        testimonials={data.testimonials}
        hero={data.wall.config.hero}
      />
    </main>
  );
}
