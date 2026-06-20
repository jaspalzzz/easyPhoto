import {
  Eraser,
  FileDown,
  Scaling,
  PaintBucket,
  FileStack,
  FileImage,
  PenLine,
  Crop,
  Wrench,
  FileText,
  Scissors,
  RefreshCw,
  RotateCw,
  ArrowUpDown,
  UserSquare,
  IdCard,
  BadgeCheck,
  LockOpen,
  EyeOff,
  Calendar,
  Stamp,
  Hash,
  Printer,
  Camera,
  Gauge,
  Combine,
  Eye,
  type LucideIcon,
} from "lucide-react";
import type { ToolColorCategory } from "@/lib/toolsCatalog";
import { cn } from "@/lib/utils";

const MAP: Record<string, LucideIcon> = {
  Eraser,
  FileDown,
  Scaling,
  PaintBucket,
  FileStack,
  FileImage,
  PenLine,
  Crop,
  FileText,
  Scissors,
  RefreshCw,
  RotateCw,
  ArrowUpDown,
  UserSquare,
  IdCard,
  BadgeCheck,
  LockOpen,
  EyeOff,
  Calendar,
  Stamp,
  Hash,
  Printer,
  Camera,
  Gauge,
  Combine,
  Eye,
};

/** Plain icon glyph (no tile). */
export function ToolIcon({ name, className }: { name: string; className?: string }) {
  const Icon = MAP[name] ?? Wrench;
  return <Icon className={className} />;
}

/**
 * Icon tile in the brand palette: navy glyph on a faint navy tint, with GOLD
 * reserved for the exam category (the core audience). Strictly navy + gold —
 * no rainbow category hues. All colours pass WCAG AA (≥3:1) on white.
 */
const NAVY_TILE =
  "bg-[hsl(var(--brand)/0.12)] text-[hsl(var(--brand))] group-hover:bg-[hsl(var(--brand)/0.2)]";
const TILE_COLORS: Record<ToolColorCategory, string> = {
  photo: NAVY_TILE,
  pdf: NAVY_TILE,
  signature: NAVY_TILE,
  privacy: NAVY_TILE,
  convert: NAVY_TILE,
  exam: "bg-[hsl(var(--cta)/0.22)] text-[#A87E10] group-hover:bg-[hsl(var(--cta)/0.34)]",
};

export function ToolIconTile({
  name,
  category,
  size = "md",
  className,
}: {
  name: string;
  category: ToolColorCategory;
  size?: "sm" | "md";
  className?: string;
}) {
  const Icon = MAP[name] ?? Wrench;
  const tile = size === "sm" ? "h-8 w-8 rounded-lg" : "h-11 w-11 rounded-xl";
  const glyph = size === "sm" ? "h-4 w-4" : "h-[22px] w-[22px]";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center transition-colors duration-150",
        tile,
        TILE_COLORS[category],
        className
      )}
    >
      <Icon className={glyph} strokeWidth={1.9} />
    </span>
  );
}
