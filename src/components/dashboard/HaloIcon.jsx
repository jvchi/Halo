import { HugeiconsIcon } from "@hugeicons/react";
import Add01Icon from "@hugeicons/core-free-icons/Add01Icon";
import Analytics01Icon from "@hugeicons/core-free-icons/Analytics01Icon";
import ApiIcon from "@hugeicons/core-free-icons/ApiIcon";
import ArrowRight02Icon from "@hugeicons/core-free-icons/ArrowRight02Icon";
import BrandfetchIcon from "@hugeicons/core-free-icons/BrandfetchIcon";
import BrickWallIcon from "@hugeicons/core-free-icons/BrickWallIcon";
import BubbleChatDoneIcon from "@hugeicons/core-free-icons/BubbleChatDoneIcon";
import BubbleChatQuestionIcon from "@hugeicons/core-free-icons/BubbleChatQuestionIcon";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import CodeIcon from "@hugeicons/core-free-icons/CodeIcon";
import Copy01Icon from "@hugeicons/core-free-icons/Copy01Icon";
import DashboardSquare01Icon from "@hugeicons/core-free-icons/DashboardSquare01Icon";
import DatabaseImportIcon from "@hugeicons/core-free-icons/DatabaseImportIcon";
import FileImportIcon from "@hugeicons/core-free-icons/FileImportIcon";
import FilterHorizontalIcon from "@hugeicons/core-free-icons/FilterHorizontalIcon";
import FormIcon from "@hugeicons/core-free-icons/FormIcon";
import GlobeIcon from "@hugeicons/core-free-icons/GlobeIcon";
import Image01Icon from "@hugeicons/core-free-icons/Image01Icon";
import LayoutGridIcon from "@hugeicons/core-free-icons/LayoutGridIcon";
import MagicWand01Icon from "@hugeicons/core-free-icons/MagicWand01Icon";
import MoreHorizontalIcon from "@hugeicons/core-free-icons/MoreHorizontalIcon";
import PaintBrush02Icon from "@hugeicons/core-free-icons/PaintBrush02Icon";
import Plug02Icon from "@hugeicons/core-free-icons/Plug02Icon";
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";
import SeoIcon from "@hugeicons/core-free-icons/SeoIcon";
import Setting06Icon from "@hugeicons/core-free-icons/Setting06Icon";
import SlackIcon from "@hugeicons/core-free-icons/SlackIcon";
import SparklesIcon from "@hugeicons/core-free-icons/SparklesIcon";
import StarIcon from "@hugeicons/core-free-icons/StarIcon";
import StripeIcon from "@hugeicons/core-free-icons/StripeIcon";
import TagsIcon from "@hugeicons/core-free-icons/TagsIcon";
import Upload03Icon from "@hugeicons/core-free-icons/Upload03Icon";
import Video01Icon from "@hugeicons/core-free-icons/Video01Icon";
import WebhookIcon from "@hugeicons/core-free-icons/WebhookIcon";
import ZapIcon from "@hugeicons/core-free-icons/ZapIcon";
import { cn } from "@/lib/cn";

export const haloIcons = {
  add: Add01Icon,
  analytics: Analytics01Icon,
  api: ApiIcon,
  arrowRight: ArrowRight02Icon,
  brand: BrandfetchIcon,
  brush: PaintBrush02Icon,
  check: CheckmarkCircle02Icon,
  code: CodeIcon,
  copy: Copy01Icon,
  feedback: BubbleChatQuestionIcon,
  filter: FilterHorizontalIcon,
  forms: FormIcon,
  globe: GlobeIcon,
  image: Image01Icon,
  import: FileImportIcon,
  integrations: Plug02Icon,
  manualImport: DatabaseImportIcon,
  more: MoreHorizontalIcon,
  overview: DashboardSquare01Icon,
  proof: BubbleChatDoneIcon,
  richSnippet: SeoIcon,
  search: Search01Icon,
  settings: Setting06Icon,
  slack: SlackIcon,
  star: StarIcon,
  stripe: StripeIcon,
  studio: SparklesIcon,
  tags: TagsIcon,
  upload: Upload03Icon,
  video: Video01Icon,
  webhook: WebhookIcon,
  widget: LayoutGridIcon,
  walls: BrickWallIcon,
  wand: MagicWand01Icon,
  zap: ZapIcon,
};

// Central icon → tone map. Tones resolve to design-system accents in CSS
// (`[data-tone="…"] { --tone: … }` in styles/index.css). This is the single
// source of truth for "which icon is which color" — call sites never hardcode a
// color, they just render the icon and a tone is assigned here. Default is "blue".
export const haloIconTones = {
  // import / sources
  zap: "yellow",
  globe: "blue",
  upload: "green",
  manualImport: "purple",
  import: "blue",
  brand: "indigo",
  // studio / content creation
  copy: "teal",
  widget: "indigo",
  wand: "pink",
  video: "red",
  image: "pink",
  walls: "orange",
  studio: "purple",
  brush: "purple",
  // proof / feedback
  proof: "green",
  check: "green",
  star: "yellow",
  feedback: "orange",
  forms: "indigo",
  // analyze / data
  analytics: "blue",
  overview: "blue",
  search: "blue",
  tags: "pink",
  richSnippet: "green",
  filter: "teal",
  // integrations
  integrations: "teal",
  api: "indigo",
  code: "teal",
  webhook: "teal",
  slack: "purple",
  stripe: "indigo",
  settings: "blue",
};

export function iconTone(name) {
  return haloIconTones[name] ?? "blue";
}

export function HaloIcon({ name, icon, size = 16, strokeWidth = 1.6, className, tinted = false, tone, ...props }) {
  const resolvedIcon = icon ?? haloIcons[name];
  if (!resolvedIcon) return null;

  return (
    <HugeiconsIcon
      icon={resolvedIcon}
      size={size}
      strokeWidth={strokeWidth}
      color="currentColor"
      className={cn("halo-huge-icon", className)}
      aria-hidden="true"
      data-tone={tinted ? tone ?? iconTone(name) : undefined}
      {...props}
    />
  );
}

// Tinted icon "chip" — the colorful rounded badge used on feature/section cards.
// Tone is derived centrally from the icon name; pass `tone` only to override.
export function HaloIconChip({ name, size = 20, tone, className, strokeWidth, ...props }) {
  return (
    <span className={cn("halo-feature-icon", className)} data-tone={tone ?? iconTone(name)} aria-hidden="true" {...props}>
      <HaloIcon name={name} size={size} strokeWidth={strokeWidth} />
    </span>
  );
}
