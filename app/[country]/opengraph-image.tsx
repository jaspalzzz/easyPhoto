import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import {
  COUNTRY_SPECS,
  LAUNCH_ORDER,
  effectivePrintMm,
} from "@/lib/countrySpecs";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "easyPhoto passport photo maker";

// Static export: one OG image per launch country.
export function generateStaticParams() {
  return LAUNCH_ORDER.map((country) => ({ country }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const spec = COUNTRY_SPECS[country];
  if (!spec) return ogImage({ title: "Passport & Visa Photo Maker" });
  const mm = effectivePrintMm(spec);
  return ogImage({
    title: `${spec.label} Passport Photo`,
    subtitle: `${mm.width}×${mm.height}mm · ${spec.background.description} · compliant & made in your browser.`,
  });
}
