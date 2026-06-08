import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { ResizeKbTool } from "@/components/tools/ResizeKbTool";
import { getPortalSpec, specProvenance } from "@/lib/specRegistry";
import { portalFaqItems } from "@/lib/faqs";
import { Info } from "lucide-react";

const spec = getPortalSpec("upsc")!;
const prov = specProvenance(spec);

export const metadata = pageMetadata({
  title: "UPSC Photo Resizer — Compress Photo for Union Public Service Commission",
  description: `Compress your passport photo to under ${spec.photoLimitKb} KB and exact specs (${spec.photoWidthPx}x${spec.photoHeightPx}px) for the UPSC application form. 100% private, client-side only.`,
  path: "/upsc-photo-resizer/",
});

export default function Page() {
  return (
    <ToolPage
      title="UPSC Photo Resizer"
      slug="upsc-photo-resizer"
      faqItems={portalFaqItems(spec)}
      path="/upsc-photo-resizer/"
      blurb={`Resize and compress your passport photo to under ${spec.photoLimitKb} KB (${spec.photoMinKb}–${spec.photoLimitKb} KB) and standard dimensions (minimum ${spec.photoWidthPx}×${spec.photoHeightPx}px) for the Union Public Service Commission portal.`}
      footnote="Your photo is processed entirely in your browser. No server uploads."
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

      <ResizeKbTool defaultKb={spec.photoLimitKb} toolName="upsc-photo-resizer" />
    </ToolPage>
  );
}
