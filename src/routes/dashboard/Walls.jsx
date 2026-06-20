import { DashPage } from "./DashPage.jsx";
import { WallOfLoveIcon } from "@/components/icons";

export default function Walls() {
  return (
    <DashPage
      icon={<WallOfLoveIcon size={28} />}
      title="Walls"
      description="Hosted Wall of Love pages showcasing your approved testimonials."
      emptyTitle="No walls yet"
      emptyIllustration="/illustrations/empty-walls.png"
    />
  );
}
