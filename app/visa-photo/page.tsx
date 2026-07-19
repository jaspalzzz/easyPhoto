import { pageMetadata } from "@/lib/seo";
import { DocPhotoLanding } from "@/components/site/DocPhotoLanding";
import { VISA_FAQ } from "@/lib/faqs";

export const metadata = pageMetadata({
  title: "Free Visa Photo Maker – Correct Size for Any Country",
  titleAbsolute: true,
  description:
    "Prepare a visa photo online free at the selected dimensions and background " +
    "for US (DS-160), Canada, UK & Schengen visas. In-browser, no upload.",
  path: "/visa-photo/",
});

export default function Page() {
  return (
    <DocPhotoLanding
      kind="visa"
      path="/visa-photo/"
      h1="Free Visa Photo Maker"
      intro="Prepare a visa photo online for free. Pick the destination country and drop a photo, and we'll apply the selected size and background. Confirm the current destination instructions before submitting; nothing is uploaded."
      faqItems={VISA_FAQ}
      dateModified="2026-06-11"
    />
  );
}
