import { ResizeKbTool } from "@/components/tools/ResizeKbTool";
import { SignatureKbTool } from "@/components/tools/SignatureKbTool";
import type { PortalSpec } from "@/lib/portalPresets";

/**
 * Exam photo-resizer page body: the photo tool, plus the signature tool inline
 * as "Step 2" when the exam also needs a signature. Exam applicants almost
 * always need BOTH a photo and a signature for the same form, so co-locating
 * them removes a navigate-away drop-off at the highest-stress moment. When the
 * exam has no signature spec, only the photo tool renders (no step labels).
 */
export function ExamResizerSteps({
  spec,
  slug,
}: {
  spec: PortalSpec;
  /** Page slug prefix, e.g. "ssc" → analytics toolName "ssc-photo-resizer". */
  slug: string;
}) {
  const hasSig = spec.sigLimitKb !== undefined;

  const photo = (
    <ResizeKbTool
      defaultKb={spec.photoLimitKb}
      requiredWidth={spec.photoWidthPx}
      requiredHeight={spec.photoHeightPx}
      requiredAspectRatio={spec.photoAspectRatio}
      minKb={spec.photoMinKb}
      densityDpi={spec.dpi}
      requirementLabel={spec.name.split(" (")[0]}
      toolName={`${slug}-photo-resizer`}
    />
  );

  const signature = hasSig ? (
    <SignatureKbTool
      kb={spec.sigLimitKb!}
      minKb={spec.sigMinKb}
      requiredWidth={spec.sigWidthPx}
      requiredHeight={spec.sigHeightPx}
      outputFormat={spec.sigFormat && /\b(?:JPG|JPEG)\b/i.test(spec.sigFormat) ? "jpeg" : "png"}
      toolName={`${slug}-signature-step`}
    />
  ) : null;

  if (spec.isLiveCapture) {
    return (
      <div className="space-y-8" data-live-capture-flow>
        <section className="rounded-xl border border-brand/20 bg-brand-soft/20 p-5">
          <p className="eyebrow mb-2 text-brand">Photo is captured in the application</p>
          <p className="max-w-2xl text-sm leading-relaxed text-ink-soft">
            The current stored instructions use a live photograph instead of a
            prepared-photo upload. Before opening the form, use a working camera,
            clear front lighting, and follow the on-screen framing instructions.
            This page cannot perform or validate the authority&apos;s live capture.
          </p>
        </section>

        {hasSig && (
          <div>
            <p className="eyebrow mb-1 text-brand">Step 1 — Signature file</p>
            <p className="mb-4 max-w-xl text-sm text-ink-soft">
              Prepare the separate signature upload at {spec.sigMinKb ? `${spec.sigMinKb}–` : "under "}
              {spec.sigLimitKb} KB{spec.sigFormat ? ` in ${spec.sigFormat} format` : ""}.
              Follow the current notice&apos;s ink and paper instructions.
            </p>
            {signature}
          </div>
        )}

        <details className="rounded-xl border border-hairline bg-card p-5">
          <summary className="cursor-pointer text-sm font-semibold text-ink">
            Optional compatibility photo tool — not a current portal requirement
          </summary>
          <p className="mb-4 mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
            The stored {spec.photoMinKb ? `${spec.photoMinKb}–` : "under "}
            {spec.photoLimitKb} KB compatibility target remains available for general
            preparation. It does not replace the live-photo step in the current form.
          </p>
          {photo}
        </details>
      </div>
    );
  }

  if (!hasSig) return photo;

  return (
    <div className="space-y-10">
      <div>
        <p className="eyebrow mb-2 text-brand">Step 1 — Photo</p>
        {photo}
      </div>
      <div className="border-t border-hairline pt-8">
        <p className="eyebrow mb-1 text-brand">Step 2 — Signature</p>
        <p className="mb-4 max-w-xl text-sm text-ink-soft">
          The same form needs your signature too. Upload a scan to clean the paper
          background, auto-crop, and compress it to {spec.sigMinKb ? `${spec.sigMinKb}–` : "under "}
          {spec.sigLimitKb} KB — no need to leave this page.
        </p>
        {signature}
      </div>
    </div>
  );
}
