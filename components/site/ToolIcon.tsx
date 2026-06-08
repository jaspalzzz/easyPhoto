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
  type LucideIcon,
} from "lucide-react";

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
};

export function ToolIcon({ name, className }: { name: string; className?: string }) {
  const Icon = MAP[name] ?? Wrench;
  return <Icon className={className} />;
}
