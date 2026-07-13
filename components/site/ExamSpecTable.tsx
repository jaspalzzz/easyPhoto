import type { PortalSpec } from "@/lib/portalPresets";
import { EmbedSpec } from "@/components/site/EmbedSpec";

/**
 * The exact photo (and signature) specification for an exam/form portal,
 * rendered as a clean two-column register — mirroring the spec table on the
 * country maker pages. Every value comes straight from the verified PortalSpec;
 * nothing is computed or guessed (a wrong number = a rejected application).
 */

function SpecRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-hairline py-2.5 text-sm last:border-0">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="text-right font-mono text-[13px] font-medium tabular-nums">
        {value}
      </dd>
    </div>
  );
}

function kbRange(min: number | undefined, max: number): string {
  // typeof check (not truthiness) so a legitimate min of 0 still renders "0–max".
  return typeof min === "number" ? `${min}–${max} KB` : `≤ ${max} KB`;
}

export function ExamSpecTable({
  spec,
  name,
}: {
  spec: PortalSpec;
  /** Display name override, e.g. "SSC CGL". Defaults to the spec's short name. */
  name?: string;
}) {
  const label = name ?? spec.name.split(" (")[0];
  const hasSig = spec.sigLimitKb !== undefined;
  const photoDim =
    spec.photoWidthPx && spec.photoHeightPx
      ? `${spec.photoWidthPx}×${spec.photoHeightPx} px`
      : null;
  const sigDim =
    spec.sigWidthPx && spec.sigHeightPx
      ? `${spec.sigWidthPx}×${spec.sigHeightPx} px`
      : null;

  // Answer-first prose summary, built from the SAME fields as the register
  // below so the two can never disagree. AI answer engines (ChatGPT, Perplexity,
  // Google AI Overviews) flatten or drop the <dl> register when extracting text;
  // this sentence hands them a clean, citable answer with the recorded numbers —
  // worded the way people ask ("what is the SSC photo size?").
  const photoSentence =
    `The registry lists the ${label} photo as a JPG/JPEG file of ${kbRange(spec.photoMinKb, spec.photoLimitKb)}` +
    (photoDim ? ` at ${photoDim}` : "") +
    (spec.dpi ? ` (${spec.dpi} DPI)` : "") +
    ".";
  const sigSentence = hasSig
    ? ` It lists the signature as a JPG/JPEG file of ${kbRange(spec.sigMinKb, spec.sigLimitKb!)}` +
      (sigDim ? ` at ${sigDim}` : "") +
      "."
    : "";

  return (
    <section>
      <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-hairline pb-4">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          {label} photo {hasSig && <>&amp; signature </>}specification
        </h2>
        <span className="eyebrow hidden text-[#7a5c06] sm:block">
          Recorded requirement
        </span>
      </div>

      <p className="mb-5 text-[15px] leading-relaxed text-ink-soft">
        {photoSentence}
        {sigSentence}
      </p>

      {/* Spec plate — gold crop-mark corners frame the exact spec (the
          "cut to size" motif that runs through the brand). */}
      <div className="relative rounded-lg border border-hairline bg-card px-6 py-5">
        <span aria-hidden className="pointer-events-none absolute left-2 top-2 h-3.5 w-3.5 rounded-tl-[3px] border-l-2 border-t-2 border-[#C9921A]" />
        <span aria-hidden className="pointer-events-none absolute right-2 top-2 h-3.5 w-3.5 rounded-tr-[3px] border-r-2 border-t-2 border-[#C9921A]" />
        <span aria-hidden className="pointer-events-none absolute bottom-2 left-2 h-3.5 w-3.5 rounded-bl-[3px] border-b-2 border-l-2 border-[#C9921A]" />
        <span aria-hidden className="pointer-events-none absolute bottom-2 right-2 h-3.5 w-3.5 rounded-br-[3px] border-b-2 border-r-2 border-[#C9921A]" />

        <div className={`grid gap-x-10 gap-y-1 ${hasSig ? "sm:grid-cols-2" : ""}`}>
          {/* Photo */}
          <dl>
            <p className="eyebrow mb-1 text-[#7a5c06]">Photograph</p>
            <SpecRow
              label="File size"
              value={kbRange(spec.photoMinKb, spec.photoLimitKb)}
            />
            {photoDim && <SpecRow label="Dimensions" value={photoDim} />}
            {spec.dpi && <SpecRow label="Scan DPI" value={spec.dpi} />}
            <SpecRow label="Format" value="JPG / JPEG" />
          </dl>

          {/* Signature */}
          {hasSig && (
            <dl className="mt-6 sm:mt-0">
              <p className="eyebrow mb-1 text-[#7a5c06]">Signature</p>
              <SpecRow
                label="File size"
                value={kbRange(spec.sigMinKb, spec.sigLimitKb!)}
              />
              {sigDim && <SpecRow label="Dimensions" value={sigDim} />}
              <SpecRow label="Format" value="JPG / JPEG" />
            </dl>
          )}
        </div>
      </div>

      <EmbedSpec id={spec.id} name={spec.name} hasSig={hasSig} />
    </section>
  );
}
