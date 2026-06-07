import { ShieldCheck, BadgeCheck, Landmark, Gift } from "lucide-react";

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
          className="border-hairline p-6 [&:not(:last-child)]:border-b lg:[&:not(:last-child)]:border-b-0 lg:[&:not(:last-child)]:border-r"
        >
          <s.icon className="h-5 w-5 text-ink" strokeWidth={1.75} />
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

/** Compact inline trust row for hero areas. */
export function TrustPills() {
  const pills = [
    { icon: ShieldCheck, label: "100% private" },
    { icon: Gift, label: "Free · no watermark" },
    { icon: BadgeCheck, label: "Compliance-checked" },
    { icon: Landmark, label: "Official sources" },
  ];
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-ink-soft">
      {pills.map((p) => (
        <span key={p.label} className="inline-flex items-center gap-1.5">
          <p.icon className="h-3.5 w-3.5 text-ink" strokeWidth={1.75} />
          {p.label}
        </span>
      ))}
    </div>
  );
}
