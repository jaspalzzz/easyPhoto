import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { SignatureKbTool } from "@/components/tools/SignatureKbTool";
import { getPortalSpec, specProvenance } from "@/lib/specRegistry";
import { portalFaqItems } from "@/lib/faqs";
import { Info } from "lucide-react";

const spec = getPortalSpec("upsc")!;
const prov = specProvenance(spec);

export const metadata = pageMetadata({
  title: "UPSC Signature Resizer — Compress Signature to 20–300 KB",
  description: `Crop and compress your signature scan to under ${spec.sigLimitKb} KB (${spec.sigMinKb}–${spec.sigLimitKb} KB) and exact specs (${spec.sigWidthPx}x${spec.sigHeightPx}px) for the UPSC application form. 100% private.`,
  path: "/upsc-signature-resizer/",
});

export default function Page() {
  return (
    <ToolPage
      title="UPSC Signature Resizer"
      slug="upsc-signature-resizer"
      faqItems={portalFaqItems(spec)}
      path="/upsc-signature-resizer/"
      blurb={`Resize, clean, and compress your signature to under ${spec.sigLimitKb} KB (${spec.sigMinKb}–${spec.sigLimitKb} KB) and standard dimensions (minimum ${spec.sigWidthPx}×${spec.sigHeightPx}px) for the Union Public Service Commission portal.`}
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

      <SignatureKbTool kb={spec.sigLimitKb || 300} toolName="upsc-signature-resizer" />
    </ToolPage>
  );
}
