import { pageMetadata } from "@/lib/seo";
import { DocPhotoLanding } from "@/components/site/DocPhotoLanding";
import { PASSPORT_FAQ } from "@/lib/faqs";

export const metadata = pageMetadata({
  title: "Free Passport Photo Maker — India, US, UK & More",
  titleAbsolute: true,
  description:
    "Prepare passport photos in your browser. For India, adults are photographed at PSK/POPSK; the 35×45 mm white print is for children below four. Also supports other countries.",
  path: "/passport-photo/",
});

export default function Page() {
  return (
    <DocPhotoLanding
      kind="passport"
      path="/passport-photo/"
      h1="Free Indian Passport Size Photo Maker"
      intro="For an ordinary adult fresh/reissue application in India, your photo and biometrics are captured at the PSK/POPSK — there is no photo upload or print to carry. Use the India preset for the 35×45 mm white-background print required for a child below four, overseas guidance when your mission requests it, or choose another country's preset. Processing stays in your browser."
      faqItems={PASSPORT_FAQ}
      dateModified="2026-06-11"
    />
  );
}
