import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { PORTAL_KEYS, PORTAL_PRESETS } from "@/lib/portalPresets";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Form Photo & Signature Resizer — easyPhoto";

export function generateStaticParams() {
  return PORTAL_KEYS.map((portal) => ({ portal }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ portal: string }>;
}) {
  const { portal } = await params;
  const spec = PORTAL_PRESETS[portal];
  return ogImage({
    title: spec ? `${spec.name} Form Resizer` : "Form Photo & Signature Resizer",
    subtitle:
      "Apply selected photo and signature KB targets; confirm the current portal instructions.",
  });
}
