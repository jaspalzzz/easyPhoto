import { ShieldCheck, BadgeCheck, Landmark, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Authentic trust signals. Every claim is verifiable from how the app actually
 * works (client-side processing, gov-source links, free, no watermark). No
 * fabricated stats or testimonials.
 */
const SIGNALS = [
  {
    icon: ShieldCheck,
    title: "Your photo never leaves your device",
    body: "All processing runs in your browser. Nothing is uploaded or stored.",
    tile: "bg-[hsl(150_70%_36%/0.14)] text-[hsl(150_62%_30%)]",
  },
  {
    icon: Landmark,
    title: "Built on official requirements",
    body: "Sizes and rules come from each country's government source, linked on every page.",
    tile: "bg-[hsl(174_72%_30%/0.14)] text-[hsl(174_72%_28%)]",
  },
  {
    icon: BadgeCheck,
    title: "Automatic compliance check",
    body: "Head size, framing and resolution are checked against the spec before you download.",
    tile: "bg-[hsl(212_88%_48%/0.14)] text-[hsl(212_90%_44%)]",
  },
  {
    icon: Gift,
    title: "Free, no watermark",
    body: "No sign-up, no payment, no watermark on your photo. Ever.",
    tile: "bg-[hsl(22_89%_50%/0.14)] text-[hsl(22_89%_46%)]",
  },
];

export function TrustStrip() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {SIGNALS.map((s) => (
        <div
          key={s.title}
          className="flex flex-col gap-3.5 rounded-xl border border-hairline bg-card p-5 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_2px_8px_rgb(0_0_0/0.04)]"
        >
          <span
            className={cn(
              "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              s.tile
            )}
          >
            <s.icon className="h-[22px] w-[22px]" strokeWidth={1.9} />
          </span>
          <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-ink">
            {s.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {s.body}
          </p>
        </div>
      ))}
    </div>
  );
}

/** Trust signals as compact bordered chips. `className` controls alignment. */
export function TrustPills({ className }: { className?: string }) {
  const pills = [
    { icon: ShieldCheck, label: "100% private" },
    { icon: Gift, label: "Free · no watermark" },
    { icon: BadgeCheck, label: "Compliance-checked" },
    { icon: Landmark, label: "Official sources" },
  ];
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-2", className)}>
      {pills.map((p) => (
        <span
          key={p.label}
          className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-card px-3 py-1.5 text-[13px] font-medium text-ink-soft"
        >
          <p.icon className="h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
          {p.label}
        </span>
      ))}
    </div>
  );
}
