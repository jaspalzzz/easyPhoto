import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getHinglishPage } from "@/lib/hinglishPages";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "easyPhoto";

export default function Image() {
  const page = getHinglishPage("signature-ka-size-kaise-kam-kare")!;
  return ogImage({ title: page.h1, subtitle: page.blurb });
}
