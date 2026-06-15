import type { PortalSpec } from "@/lib/portalPresets";

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
  return min ? `${min}–${max} KB` : `≤ ${max} KB`;
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

  return (
    <section>
      <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-hairline pb-4">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          {label} photo {hasSig && <>&amp; signature </>}specification
        </h2>
        <span className="eyebrow hidden text-ink-soft sm:block">
          Exact requirement
        </span>
      </div>

      <div className={`grid gap-x-10 gap-y-1 ${hasSig ? "sm:grid-cols-2" : ""}`}>
        {/* Photo */}
        <dl>
          <p className="eyebrow mb-1 text-brand">Photograph</p>
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
            <p className="eyebrow mb-1 text-brand">Signature</p>
            <SpecRow
              label="File size"
              value={kbRange(spec.sigMinKb, spec.sigLimitKb!)}
            />
            {sigDim && <SpecRow label="Dimensions" value={sigDim} />}
            <SpecRow label="Format" value="JPG / JPEG" />
          </dl>
        )}
      </div>
    </section>
  );
}
