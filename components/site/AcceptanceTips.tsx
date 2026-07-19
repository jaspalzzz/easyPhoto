import { Check, X } from "lucide-react";
import type { CountrySpec } from "@/lib/countrySpecs";
import type { PortalSpec } from "@/lib/portalPresets";

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
      <h2 className="text-sm font-semibold tracking-tight text-ink">{title}</h2>
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

/** Country passport/visa preparation tips, derived from the country's spec. */
export function AcceptanceTips({ spec }: { spec: CountrySpec }) {
  const glassesAllowed =
    spec.glasses === true ||
    (typeof spec.glasses === "string" && /allowed|permitted/i.test(spec.glasses));

  return (
    <section className="rounded-xl border border-hairline bg-card p-5">
      <DoDontStrip
        title={`Before you upload — ${spec.label} photo preparation checklist`}
        dos={[
          "A plain, evenly lit background to start (we apply the selected colour)",
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
export function ExamSubmitTips({
  spec,
  className = "",
}: {
  spec: PortalSpec;
  className?: string;
}) {
  const hasSignature = spec.sigLimitKb !== undefined;
  const photoDos = [
    spec.isLiveCapture
      ? "Use a working camera and clear, even front lighting"
      : "Use a clear image with even front lighting",
    "Face straight on, neutral expression, both eyes open",
    ...(spec.photoBackground
      ? [`Use the published photo background: ${spec.photoBackground}`]
      : []),
    ...(spec.photoFormat ? [`Export the photo as ${spec.photoFormat}`] : []),
  ];
  const signatureDos = [
    spec.signatureInk
      ? `Follow the published ink instruction: ${spec.signatureInk}`
      : "Check the current form's ink and paper instructions",
    "Sign large and clear, photographed in good light",
    ...(spec.sigFormat ? [`Export the signature as ${spec.sigFormat}`] : []),
  ];

  return (
    <section className={`space-y-4 rounded-xl border border-hairline bg-card p-5 ${className}`}>
      <DoDontStrip
        title={spec.isLiveCapture ? "Before the live-photo step" : "Photo preparation checklist"}
        dos={photoDos}
        donts={[
          "Shadows behind you or glare on glasses",
          "Hats, caps, or hair across the eyes",
          "Filters, beauty smoothing, or a selfie crop",
        ]}
      />
      {hasSignature && (
        <div className="border-t border-hairline pt-4">
          <DoDontStrip
            title="Signature preparation checklist"
            dos={signatureDos}
            donts={[
              "Paper texture or a shadow that reduces legibility",
              "Faint pencil, or a smudged / cut-off signature",
              "Typed text or an image that is not your signature",
            ]}
          />
        </div>
      )}
    </section>
  );
}
