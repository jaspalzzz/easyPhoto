import { ShieldCheck, BadgeCheck, Landmark, Gift } from "lucide-react";

/**
 * Authentic trust signals — every claim is verifiable from how the app actually
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
    body: "Sizes and rules come from each country's government source — linked on every page.",
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {SIGNALS.map((s) => (
        <div
          key={s.title}
          className="rounded-xl border bg-card p-5"
        >
          <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-muted text-brand">
            <s.icon className="h-5 w-5" />
          </span>
          <h3 className="text-sm font-semibold">{s.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
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
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
      {pills.map((p) => (
        <span key={p.label} className="inline-flex items-center gap-1.5">
          <p.icon className="h-4 w-4 text-brand" />
          {p.label}
        </span>
      ))}
    </div>
  );
}
