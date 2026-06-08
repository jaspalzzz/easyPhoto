import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { NameDatePhotoTool } from "@/components/tools/NameDatePhotoTool";
import { getPortalSpec, specProvenance } from "@/lib/specRegistry";
import { Info } from "lucide-react";

const spec = getPortalSpec("ssc")!;
const prov = specProvenance(spec);

export const metadata = pageMetadata({
  title: "SSC Photo with Name & Date Generator — DOP Resizer",
  description: `Add your name and date to your photograph and resize to under ${spec.photoLimitKb} KB and exact specs (${spec.photoWidthPx}x${spec.photoHeightPx}px) for the SSC application form. 100% private.`,
  path: "/ssc-photo-with-name-date/",
});

export default function Page() {
  return (
    <ToolPage
      title="SSC Photo with Name &amp; Date"
      slug="ssc-photo-with-name-date"
      blurb={`Add custom candidate name and photo printing date (DOP) at the bottom of your photo, resized to under ${spec.photoLimitKb} KB and compliant dimensions (${spec.photoWidthPx}×${spec.photoHeightPx}px) for the Staff Selection Commission.`}
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

      <NameDatePhotoTool defaultPresetId="ssc" />
    </ToolPage>
  );
}
