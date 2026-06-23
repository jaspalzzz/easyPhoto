import { pageMetadata } from "@/lib/seo";
import { DocPhotoLanding } from "@/components/site/DocPhotoLanding";
import { VISA_FAQ } from "@/lib/faqs";

export const metadata = pageMetadata({
  title: "Free Visa Photo Maker – Correct Size for Any Country",
  titleAbsolute: true,
  description:
    "Create a compliant visa photo online free. Exact dimensions & background " +
    "for US (DS-160), Canada, UK & Schengen visas. In-browser, no upload.",
  path: "/visa-photo/",
});

export default function Page() {
  return (
    <DocPhotoLanding
      kind="visa"
      path="/visa-photo/"
      h1="Free Visa Photo Maker"
      intro="Create a compliant visa photo online for free. Pick the destination country and drop a photo, and we'll apply the exact size and background for US (DS-160), Canada, UK and Schengen visas. Made in your browser; nothing is uploaded."
      faqItems={VISA_FAQ}
      dateModified="2026-06-11"
    />
  );
}
