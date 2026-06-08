import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PORTAL_KEYS, PORTAL_PRESETS } from "@/lib/portalPresets";
import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { PortalResizer } from "@/components/tools/PortalResizer";

export function generateStaticParams() {
  return PORTAL_KEYS.map((portal) => ({ portal }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ portal: string }>;
}): Promise<Metadata> {
  const { portal } = await params;
  const spec = PORTAL_PRESETS[portal];
  if (!spec) return {};
  
  const sigText = spec.sigLimitKb ? ` and signature under ${spec.sigLimitKb} KB` : "";
  return pageMetadata({
    title: `Resize Photo & Signature for ${spec.name}`,
    description: `Free online tool to compress your photo under ${spec.photoLimitKb} KB${sigText} for ${spec.name} application forms. 100% private, no upload.`,
    path: `/tools/form-resizer/${portal}/`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ portal: string }>;
}) {
  const { portal } = await params;
  const spec = PORTAL_PRESETS[portal];
  if (!spec) notFound();

  return (
    <ToolPage
      title={`Form Resizer for ${spec.name}`}
      slug={`form-resizer/${portal}`}
      path={`/tools/form-resizer/${portal}/`}
      blurb={`Resize and compress your documents to meet the official requirements for ${spec.name} registration forms.`}
    >
      <PortalResizer portalId={portal} />
    </ToolPage>
  );
}
