import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { PORTAL_KEYS } from "@/lib/portalPresets";
import { getPortalSpec } from "@/lib/specRegistry";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Exam photo & signature requirements — easyPhoto";

export function generateStaticParams() {
  return PORTAL_KEYS.map((exam) => ({ exam: String(exam) }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ exam: string }>;
}) {
  const { exam } = await params;
  const spec = getPortalSpec(exam);
  if (!spec) return ogImage({ title: "Exam Photo & Signature Requirements" });
  const photo = spec.photoMinKb
    ? `${spec.photoMinKb}–${spec.photoLimitKb} KB`
    : `under ${spec.photoLimitKb} KB`;
  const sig = spec.sigLimitKb
    ? ` · signature ${spec.sigMinKb ? `${spec.sigMinKb}–${spec.sigLimitKb}` : `under ${spec.sigLimitKb}`} KB`
    : "";
  return ogImage({
    title: `${spec.name.split(" (")[0]} Photo & Signature Size`,
    subtitle: `Official requirement: photo ${photo}${sig}. Resize free, in your browser.`,
  });
}
