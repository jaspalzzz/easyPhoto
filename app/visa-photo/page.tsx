import { pageMetadata } from "@/lib/seo";
import { DocPhotoLanding } from "@/components/site/DocPhotoLanding";
import { VISA_FAQ } from "@/lib/faqs";

export const metadata = pageMetadata({
  title: "Free Visa Photo Maker – Correct Size for Any Country",
  titleAbsolute: true,
  description:
    "Create a compliant visa photo online free. Exact dimensions & background " +
    "for Schengen, US (DS-160), UK, Canada & Australia visas. In-browser, no upload.",
  path: "/visa-photo/",
});

export default function Page() {
  return (
    <DocPhotoLanding
      kind="visa"
      path="/visa-photo/"
      h1="Free Visa Photo Maker"
      intro="Create a compliant visa photo online for free. Pick the destination country, drop a photo, and we apply the exact size and background — for Schengen, US (DS-160), UK, Canada and Australia visas. Made in your browser; nothing is uploaded."
      faqItems={VISA_FAQ}
    />
  );
}
