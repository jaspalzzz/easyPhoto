import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { SignatureKbTool } from "@/components/tools/SignatureKbTool";
import { getPortalSpec, specProvenance } from "@/lib/specRegistry";
import { portalFaqItems } from "@/lib/faqs";
import { ExamSpecTable } from "@/components/site/ExamSpecTable";
import { ExamContext } from "@/components/site/ExamContext";
import { Info } from "lucide-react";

const spec = getPortalSpec("ssc")!;
const prov = specProvenance(spec);
// Only mention pixels when the authority actually publishes them — several
// portals (UPSC/SSC/RRB) publish a KB band but no pixel requirement.
const sigDims =
  spec.sigWidthPx && spec.sigHeightPx
    ? ` and ${spec.sigWidthPx}×${spec.sigHeightPx}px`
    : "";

export const metadata = pageMetadata({
  title: "SSC Signature Resizer — Compress Signature to 10–20 KB",
  description: `Crop and compress your signature scan to the ${spec.sigMinKb}–${spec.sigLimitKb} KB range${sigDims} listed for the SSC application form. 100% private.`,
  path: "/ssc-signature-resizer/",
});

export default function Page() {
  return (
    <ToolPage
      title="SSC Signature Resizer"
      slug="ssc-signature-resizer"
      faqItems={portalFaqItems(spec)}
      path="/ssc-signature-resizer/"
      dateModified={spec.verifiedOn}
      blurb={`Resize, clean, and compress your signature to the ${spec.sigMinKb}–${spec.sigLimitKb} KB range${sigDims} listed for the Staff Selection Commission portal.`}
      footnote="Your signature is processed entirely in your browser. No server uploads."
    >
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

      <SignatureKbTool kb={spec.sigLimitKb || 20} toolName="ssc-signature-resizer" />

      <ExamContext spec={spec} />

      <div className="mt-10">
        <ExamSpecTable spec={spec} />
      </div>
    </ToolPage>
  );
}
