import { Check, X } from "lucide-react";
import type { CountrySpec } from "@/lib/countrySpecs";

/**
 * "Get accepted" pre-upload guidance — the honest version of competitors'
 * do/don't sample-photo strips. Instead of stock example faces, it derives the
 * do's and don'ts from THIS country's actual spec (background, glasses,
 * expression), so an anxious applicant self-checks against the real rules
 * before they even upload — the moment that pre-empts the rejection fear.
 */
export function AcceptanceTips({ spec }: { spec: CountrySpec }) {
  const glassesAllowed =
    spec.glasses === true ||
    (typeof spec.glasses === "string" && /allowed|permitted/i.test(spec.glasses));

  const dos = [
    // The tool applies the required background colour; the user just needs a
    // plain, evenly-lit one to start — so we don't try to name grey/white/cream.
    "A plain, evenly lit background to start (we apply the official colour)",
    "Face the camera straight on, both ears roughly visible",
    "Neutral expression, mouth closed, eyes open",
    "A recent photo, taken within the last 6 months",
  ];
  const donts = [
    "Shadows on your face or the wall behind you",
    glassesAllowed
      ? "Glare or tint on glasses"
      : "Glasses — remove them unless they're medically required",
    "Hair across the eyes, hats or caps",
    "Filters, beauty smoothing, or a cropped group photo",
  ];

  return (
    <section className="rounded-xl border border-hairline bg-card p-5">
      <h2 className="text-sm font-semibold tracking-tight text-ink">
        Before you upload — what gets {spec.label} photos accepted
      </h2>
      <div className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
        <ul className="space-y-1.5">
          {dos.map((d) => (
            <li key={d} className="flex items-start gap-2 text-sm text-ink-soft">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(142_55%_34%)]" strokeWidth={2.25} />
              {d}
            </li>
          ))}
        </ul>
        <ul className="space-y-1.5">
          {donts.map((d) => (
            <li key={d} className="flex items-start gap-2 text-sm text-ink-soft">
              <X className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(0_70%_50%)]" strokeWidth={2.25} />
              {d}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
