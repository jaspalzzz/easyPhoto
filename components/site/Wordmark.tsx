import { cn } from "@/lib/utils";

/**
 * Text wordmark matching the logo: "easy" + "Photo" in navy & gold.
 * tone="dark"  → on a light surface: navy "easy" + gold-deep "Photo" (readable).
 * tone="light" → on a navy surface:  white "easy" + gold "Photo".
 */
export function Wordmark({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span className={cn("font-display font-bold tracking-tightest", className)}>
      <span className={tone === "light" ? "text-white" : "text-ink"}>easy</span>
      <span className={tone === "light" ? "text-cta" : "text-[#A87E10]"}>Photo</span>
    </span>
  );
}
