import { Check, X } from "lucide-react";
import type { CountrySpec } from "@/lib/countrySpecs";

/**
 * Presentational do/don't strip — the honest version of competitors' do/don't
 * sample-photo rows. A pre-submit self-check, framed in our design language,
 * that pre-empts the rejection fear before the user even uploads.
 */
export function DoDontStrip({
  title,
  dos,
  donts,
}: {
  title: string;
  dos: string[];
  donts: string[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold tracking-tight text-ink">{title}</h3>
      <div className="mt-2.5 grid gap-x-6 gap-y-2 sm:grid-cols-2">
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
    </div>
  );
}

/** Country passport/visa "get accepted" tips, derived from the country's spec. */
export function AcceptanceTips({ spec }: { spec: CountrySpec }) {
  const glassesAllowed =
    spec.glasses === true ||
    (typeof spec.glasses === "string" && /allowed|permitted/i.test(spec.glasses));

  return (
    <section className="rounded-xl border border-hairline bg-card p-5">
      <DoDontStrip
        title={`Before you upload — what gets ${spec.label} photos accepted`}
        dos={[
          "A plain, evenly lit background to start (we apply the official colour)",
          "Face the camera straight on, both ears roughly visible",
          "Neutral expression, mouth closed, eyes open",
          "A recent photo, taken within the last 6 months",
        ]}
        donts={[
          "Shadows on your face or the wall behind you",
          glassesAllowed
            ? "Glare or tint on glasses"
            : "Glasses — remove them unless they're medically required",
          "Hair across the eyes, hats or caps",
          "Filters, beauty smoothing, or a cropped group photo",
        ]}
      />
    </section>
  );
}

/**
 * Exam-form tips — photo AND signature, the two things portals reject most.
 * The signature do/don'ts are the gap competitors' photo-only strips miss
 * (paper/shadow behind the signature is the #1 signature rejection).
 */
export function ExamSubmitTips({ hasSignature }: { hasSignature: boolean }) {
  return (
    <section className="space-y-4 rounded-xl border border-hairline bg-card p-5">
      <DoDontStrip
        title="What gets the photo accepted"
        dos={[
          "Plain, evenly lit light background",
          "Face straight on, neutral expression, both eyes open",
          "A recent, sharp photo — JPG output",
        ]}
        donts={[
          "Shadows behind you or glare on glasses",
          "Hats, caps, or hair across the eyes",
          "Filters, beauty smoothing, or a selfie crop",
        ]}
      />
      {hasSignature && (
        <div className="border-t border-hairline pt-4">
          <DoDontStrip
            title="What gets the signature accepted"
            dos={[
              "Black or blue ink on plain white paper",
              "Signed large and clear, photographed in good light",
              "Clean white background (we remove the paper for you)",
            ]}
            donts={[
              "Grey paper or a shadow showing behind the ink",
              "Faint pencil, or a smudged / cut-off signature",
              "Block capitals or a printed name instead of a signature",
            ]}
          />
        </div>
      )}
    </section>
  );
}
