import { cn } from "@/lib/utils";

/**
 * The product's signature motif: registration / crop marks — the corner brackets
 * of a photo guide. Drop into any `relative` container to frame it like a photo
 * being aligned in a bureau. Decorative; aria-hidden.
 */
export function CropMarks({
  className,
  size = 14,
  inset = 0,
}: {
  className?: string;
  /** Bracket arm length in px. */
  size?: number;
  /** Inset from each corner in px. */
  inset?: number;
}) {
  const arm: React.CSSProperties = { width: size, height: size };
  const pos = (v: number) => `${v}px`;
  const corners = [
    { style: { top: pos(inset), left: pos(inset) }, cls: "border-l border-t" },
    { style: { top: pos(inset), right: pos(inset) }, cls: "border-r border-t" },
    { style: { bottom: pos(inset), left: pos(inset) }, cls: "border-l border-b" },
    { style: { bottom: pos(inset), right: pos(inset) }, cls: "border-r border-b" },
  ];
  return (
    <span aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      {corners.map((c, i) => (
        <span
          key={i}
          className={cn("absolute border-ink/35", c.cls)}
          style={{ ...arm, ...c.style }}
        />
      ))}
    </span>
  );
}
