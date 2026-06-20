// Registry for the pre-styled review templates. Both the Widget Studio (to list
// them as selectable layout options) and the WidgetRenderer (to render the chosen
// one) read from here, so the id ↔ component mapping lives in a single place.
import { AuroraTemplate, AuroraCard } from "./AuroraTemplate.jsx";
import { StickerTemplate, StickerCard } from "./StickerTemplate.jsx";
import { ReviewRowTemplate, ReviewRowCard } from "./ReviewRowTemplate.jsx";

export const widgetTemplates = [
  { id: "aurora", label: "Aurora", Component: AuroraTemplate },
  { id: "sticker", label: "Sticker", Component: StickerTemplate },
  { id: "rows", label: "Review rows", Component: ReviewRowTemplate },
];

export const templateIds = new Set(widgetTemplates.map((t) => t.id));

export const getTemplate = (id) => widgetTemplates.find((t) => t.id === id);

export {
  AuroraTemplate,
  AuroraCard,
  StickerTemplate,
  StickerCard,
  ReviewRowTemplate,
  ReviewRowCard,
};
