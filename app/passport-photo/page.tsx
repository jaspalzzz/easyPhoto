import { pageMetadata } from "@/lib/seo";
import { DocPhotoLanding } from "@/components/site/DocPhotoLanding";
import { PASSPORT_FAQ } from "@/lib/faqs";

export const metadata = pageMetadata({
  title: "Free Passport Photo Maker – Compliant for Any Country",
  titleAbsolute: true,
  description:
    "Make a passport photo online free. Auto-crops to the exact head size & " +
    "background for India, US, UK, Canada & Australia. 100% private — no upload.",
  path: "/passport-photo/",
});

export default function Page() {
  return (
    <DocPhotoLanding
      kind="passport"
      path="/passport-photo/"
      h1="Free Passport Photo Maker"
      intro="Create a compliant passport photo online for free. Pick your country, drop a photo, and we auto-crop to the exact head size and background — for India, the US, UK, Canada and Australia. 100% private; nothing is uploaded."
      faqItems={PASSPORT_FAQ}
    />
  );
}
