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
};

/** Plain icon glyph (no tile). */
export function ToolIcon({ name, className }: { name: string; className?: string }) {
  const Icon = MAP[name] ?? Wrench;
  return <Icon className={className} />;
}

/**
 * Vibrant per-category icon tile — the wayfinding colour that makes the tool grid
 * scannable (the pattern that makes iLovePDF/Smallpdf feel premium). The icon is
 * full-saturation on a soft tint of the same hue. All icon colours pass WCAG AA
 * (≥3:1 non-text contrast) on white.
 */
const TILE_COLORS: Record<ToolColorCategory, string> = {
  photo:
    "bg-[hsl(174_72%_30%/0.12)] text-[hsl(174_72%_30%)] group-hover:bg-[hsl(174_72%_30%/0.18)]",
  pdf:
    "bg-[hsl(8_75%_45%/0.12)] text-[hsl(8_75%_45%)] group-hover:bg-[hsl(8_75%_45%/0.18)]",
  signature:
    "bg-[hsl(245_60%_52%/0.12)] text-[hsl(245_60%_52%)] group-hover:bg-[hsl(245_60%_52%/0.18)]",
  privacy:
    "bg-[hsl(150_60%_32%/0.12)] text-[hsl(150_60%_32%)] group-hover:bg-[hsl(150_60%_32%/0.18)]",
  convert:
    "bg-[hsl(212_80%_42%/0.12)] text-[hsl(212_80%_42%)] group-hover:bg-[hsl(212_80%_42%/0.18)]",
  exam:
    "bg-[hsl(30_85%_38%/0.12)] text-[hsl(30_85%_38%)] group-hover:bg-[hsl(30_85%_38%/0.18)]",
};

export function ToolIconTile({
  name,
  category,
  className,
}: {
  name: string;
  category: ToolColorCategory;
  className?: string;
}) {
  const Icon = MAP[name] ?? Wrench;
  return (
    <span
      className={cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-150",
        TILE_COLORS[category],
        className
      )}
    >
      <Icon className="h-[22px] w-[22px]" strokeWidth={1.9} />
    </span>
  );
}
