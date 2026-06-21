import { pageMetadata } from "@/lib/seo";
import { HinglishLanding } from "@/components/site/HinglishLanding";
import { getHinglishPage } from "@/lib/hinglishPages";

const page = getHinglishPage("pdf-ka-size-kaise-kam-kare")!;

export const metadata = pageMetadata({
  title: page.title,
  titleAbsolute: true,
  description: page.description,
  path: `/${page.slug}/`,
  noIndex: true, // thin Hinglish duplicate — kept live, out of index (AdSense low-value audit)
});

export default function Page() {
  return <HinglishLanding slug={page.slug} />;
}
