import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { ExamContext } from "@/components/site/ExamContext";
import { ExamResizerSteps } from "@/components/tools/ExamResizerSteps";
import { getPortalSpec, specProvenance } from "@/lib/specRegistry";
import { portalFaqItems, resizerMetaDescription } from "@/lib/faqs";
import { ExamSubmitTips } from "@/components/site/AcceptanceTips";
import { ExamSpecTable } from "@/components/site/ExamSpecTable";
import { Info } from "lucide-react";

const spec = getPortalSpec("ssc")!;
const prov = specProvenance(spec);

export const metadata = pageMetadata({
  title: `SSC Photo & Signature Resizer 2026 — ${spec.photoLimitKb} KB`,
  titleAbsolute: true,
  description: resizerMetaDescription(spec, "SSC"),
  path: "/ssc-photo-resizer/",
});

export default function Page() {
  return (
    <ToolPage
      title="SSC Photo & Signature Resizer 2026"
      slug="ssc-photo-resizer"
      faqItems={portalFaqItems(spec)}
      path="/ssc-photo-resizer/"
      dateModified={spec.verifiedOn}
      blurb={`Resize and compress your passport photo to under ${spec.photoLimitKb} KB (${spec.photoMinKb}–${spec.photoLimitKb} KB) and standard dimensions (${spec.photoWidthPx}×${spec.photoHeightPx}px) for the Staff Selection Commission portal.`}
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

      <ExamResizerSteps spec={spec} slug="ssc" />

      <ExamContext spec={spec} nameDateHref="/ssc-photo-with-name-date/" />

      <div className="mt-10">
        <ExamSpecTable spec={spec} />
      </div>
    </ToolPage>
  );
}
