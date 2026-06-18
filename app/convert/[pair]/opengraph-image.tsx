import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { CONVERT_PAIRS, getConvertPair } from "@/lib/convertPairs";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Image Format Converter — easyPhoto";

export function generateStaticParams() {
  return CONVERT_PAIRS.map((p) => ({ pair: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ pair: string }>;
}) {
  const { pair } = await params;
  const p = getConvertPair(pair);
  return ogImage({
    title: p ? `Convert ${p.from} to ${p.to}` : "Image Format Converter",
    subtitle: p
      ? `Free, batch-ready, 100% in your browser — your ${p.from} files are never uploaded.`
      : "Convert images between formats free, right in your browser.",
  });
}
