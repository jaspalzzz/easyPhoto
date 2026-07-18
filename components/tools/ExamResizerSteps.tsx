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
      minKb={spec.photoMinKb}
      densityDpi={spec.dpi}
      requirementLabel={spec.name.split(" (")[0]}
      toolName={`${slug}-photo-resizer`}
    />
  );

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
        <SignatureKbTool
          kb={spec.sigLimitKb!}
          minKb={spec.sigMinKb}
          requiredWidth={spec.sigWidthPx}
          requiredHeight={spec.sigHeightPx}
          outputFormat={/\b(?:JPG|JPEG)\b/i.test(spec.description) ? "jpeg" : "png"}
          toolName={`${slug}-signature-step`}
        />
      </div>
    </div>
  );
}
