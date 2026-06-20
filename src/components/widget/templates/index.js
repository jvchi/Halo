// Card-style registry. A card style is independent of layout: any style renders
// inside any layout container (grid / masonry / carousel / marquee / single).
// "default" is the built-in TestimonialCard; the rest are the pre-styled cards.
// The Widget Studio reads this to list the selectable styles; the WidgetRenderer
// imports the card components directly.
import { AuroraTemplate, AuroraCard } from "./AuroraTemplate.jsx";
import { StickerTemplate, StickerCard } from "./StickerTemplate.jsx";
import { ReviewRowTemplate, ReviewRowCard } from "./ReviewRowTemplate.jsx";

export const cardStyles = [
  { id: "default", label: "Default" },
  { id: "aurora", label: "Aurora", Card: AuroraCard },
  { id: "sticker", label: "Sticker", Card: StickerCard },
  { id: "rows", label: "Review rows", Card: ReviewRowCard },
];

// Ids of the pre-styled cards (everything except the built-in default). Used to
// decide when the display toggles don't apply.
export const customCardStyleIds = new Set(
  cardStyles.filter((c) => c.Card).map((c) => c.id)
);

export const getCardStyle = (id) =>
  cardStyles.find((c) => c.id === id) ?? cardStyles[0];

export {
  AuroraTemplate,
  AuroraCard,
  StickerTemplate,
  StickerCard,
  ReviewRowTemplate,
  ReviewRowCard,
};
