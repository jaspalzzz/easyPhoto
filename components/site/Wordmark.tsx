import { cn } from "@/lib/utils";

/**
 * Text wordmark matching the logo: "easy" (orange) + "Photo" (blue).
 *
 * When the SVG logo asset lands in /public, swap this for:
 *   <img src="/logo.svg" alt="easyPhoto" className="h-7 w-auto" />
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-bold tracking-tight", className)}>
      <span className="text-cta">easy</span>
      <span className="text-brand">Photo</span>
    </span>
  );
}
