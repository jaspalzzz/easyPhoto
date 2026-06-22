import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { ExamResizerSteps } from "@/components/tools/ExamResizerSteps";
import { getPortalSpec, specProvenance } from "@/lib/specRegistry";
import { portalFaqItems, resizerMetaDescription } from "@/lib/faqs";
import { ExamSubmitTips } from "@/components/site/AcceptanceTips";
import { ExamSpecTable } from "@/components/site/ExamSpecTable";
import { ExamContext } from "@/components/site/ExamContext";
import { Info } from "lucide-react";

const spec = getPortalSpec("rbi")!;
const prov = specProvenance(spec);

export const metadata = pageMetadata({
  title: "RBI Grade B Photo Resizer — Compress Photo for RBI Application",
  description: resizerMetaDescription(spec, "RBI"),
  path: "/rbi-photo-resizer/",
});

export default function Page() {
  return (
    <ToolPage
      title="RBI Grade B Photo Resizer"
      slug="rbi-photo-resizer"
      faqItems={portalFaqItems(spec)}
      path="/rbi-photo-resizer/"
      dateModified={spec.verifiedOn}
      blurb={`Resize and compress your photo to ${spec.photoMinKb}–${spec.photoLimitKb} KB and ${spec.photoWidthPx}×${spec.photoHeightPx}px for RBI Grade B and RBI Assistant online applications.`}
      footnote="Your photo is processed entirely in your browser. No server uploads."
    >
      <ExamSubmitTips hasSignature={spec.sigLimitKb !== undefined} className="mb-6" />

      <div className="mb-6 flex gap-2 rounded-md bg-brand-soft/30 border border-brand/10 p-3 text-xs text-ink-soft leading-relaxed max-w-xl">
        <Info className="h-4 w-4 shrink-0 text-brand mt-0.5" />
        <div>
          <span>{prov.label}. </span>
          {prov.url && (
            <a
              href={prov.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline font-medium inline-flex items-center gap-0.5"
            >
              Confirm on official portal
            </a>
          )}
        </div>
      </div>

      <ExamResizerSteps spec={spec} slug="rbi" />

      <ExamContext spec={spec} />

      <div className="mt-10">
        <ExamSpecTable spec={spec} />
      </div>
    </ToolPage>
  );
}
