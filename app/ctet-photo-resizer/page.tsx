import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { ExamResizerSteps } from "@/components/tools/ExamResizerSteps";
import { getPortalSpec, photoDimsPx, specProvenance } from "@/lib/specRegistry";
import { portalFaqItems, resizerMetaDescription } from "@/lib/faqs";
import { ExamSubmitTips } from "@/components/site/AcceptanceTips";
import { ExamSpecTable } from "@/components/site/ExamSpecTable";
import { ExamContext } from "@/components/site/ExamContext";
import { Info } from "lucide-react";

const spec = getPortalSpec("ctet")!;
const prov = specProvenance(spec);
const px = photoDimsPx(spec);
const photoDims = px ? ` and ${px}` : "";

export const metadata = pageMetadata({
  title: "CTET Photo Resizer 2026 — Compress Photo for CTET Application",
  description: resizerMetaDescription(spec, "CTET"),
  path: "/ctet-photo-resizer/",
});

export default function Page() {
  return (
    <ToolPage
      title="CTET Photo Resizer"
      slug="ctet-photo-resizer"
      faqItems={portalFaqItems(spec)}
      path="/ctet-photo-resizer/"
      dateModified={spec.verifiedOn}
      blurb={`Resize and compress your passport photo to ${spec.photoMinKb}–${spec.photoLimitKb} KB${photoDims} for the CTET online application on ctet.nic.in.`}
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

      <ExamResizerSteps spec={spec} slug="ctet" />

      <ExamContext spec={spec} />

      <div className="mt-10">
        <ExamSpecTable spec={spec} />
      </div>
    </ToolPage>
  );
}
