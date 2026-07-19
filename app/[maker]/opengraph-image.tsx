import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { effectivePrintMm } from "@/lib/countrySpecs";
import { MAKER_PAGES, getMakerPage, makerSpec } from "@/lib/makerPages";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "easyPhoto passport & visa photo maker";

export function generateStaticParams() {
  return MAKER_PAGES.map((m) => ({ maker: m.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ maker: string }>;
}) {
  const { maker } = await params;
  const page = getMakerPage(maker);
  const spec = makerSpec(maker);
  if (!page || !spec) return ogImage({ title: "Passport & Visa Photo Maker" });
  const mm = effectivePrintMm(spec);
  const Doc = page.kind === "visa" ? "Visa" : "Passport";
  return ogImage({
    title: `${spec.label} ${Doc} Photo`,
    subtitle: `${mm.width}×${mm.height}mm · ${spec.background.description} · prepared in your browser`,
  });
}
