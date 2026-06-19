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
    "bg-[hsl(174_78%_32%/0.18)] text-[hsl(174_82%_28%)] group-hover:bg-[hsl(174_78%_32%/0.28)]",
  pdf:
    "bg-[hsl(8_85%_50%/0.18)] text-[hsl(8_88%_46%)] group-hover:bg-[hsl(8_85%_50%/0.28)]",
  signature:
    "bg-[hsl(248_75%_58%/0.18)] text-[hsl(248_78%_56%)] group-hover:bg-[hsl(248_75%_58%/0.28)]",
  privacy:
    "bg-[hsl(150_70%_36%/0.18)] text-[hsl(150_76%_30%)] group-hover:bg-[hsl(150_70%_36%/0.28)]",
  convert:
    "bg-[hsl(212_88%_48%/0.18)] text-[hsl(212_90%_44%)] group-hover:bg-[hsl(212_88%_48%/0.28)]",
  exam:
    "bg-[hsl(33_92%_46%/0.18)] text-[hsl(30_92%_40%)] group-hover:bg-[hsl(33_92%_46%/0.28)]",
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
