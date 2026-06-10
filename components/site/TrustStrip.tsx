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
  },
  {
    icon: Landmark,
    title: "Built on official requirements",
    body: "Sizes and rules come from each country's government source, linked on every page.",
  },
  {
    icon: BadgeCheck,
    title: "Automatic compliance check",
    body: "Head size, framing and resolution are checked against the spec before you download.",
  },
  {
    icon: Gift,
    title: "Free, no watermark",
    body: "No sign-up, no payment, no watermark on your photo. Ever.",
  },
];

export function TrustStrip() {
  return (
    <div className="grid border-y border-hairline sm:grid-cols-2 lg:grid-cols-4 lg:border-x">
      {SIGNALS.map((s) => (
        <div
          key={s.title}
          className="border-hairline p-6 [&:not(:last-child)]:border-b sm:[&:nth-last-child(-n+2)]:border-b-0 lg:[&:not(:last-child)]:border-b-0 lg:[&:not(:last-child)]:border-r"
        >
          <s.icon className="h-5 w-5 text-brand" strokeWidth={1.75} />
          <h3 className="mt-4 text-[15px] font-semibold tracking-tight">
            {s.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
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
