import { pageMetadata } from "@/lib/seo";
import { HinglishLanding } from "@/components/site/HinglishLanding";
import { getHinglishPage } from "@/lib/hinglishPages";

const page = getHinglishPage("passport-photo-white-background-kaise-kare")!;

export const metadata = pageMetadata({
  title: page.title,
  titleAbsolute: true,
  description: page.description,
  path: `/${page.slug}/`,
});

export default function Page() {
  return <HinglishLanding slug={page.slug} />;
}
