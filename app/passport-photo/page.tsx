import { pageMetadata } from "@/lib/seo";
import { DocPhotoLanding } from "@/components/site/DocPhotoLanding";
import { PASSPORT_FAQ } from "@/lib/faqs";

export const metadata = pageMetadata({
  title: "Free Indian Passport Photo Maker — ICAO Compliant, No Upload",
  titleAbsolute: true,
  description:
    "Make a compliant Indian passport photo free — 35×45 mm or exactly 630×810 px JPEG under 250 KB for " +
    "Passport Seva. Also US, UK, Canada & Australia. ICAO-compliant, 100% private, nothing uploaded.",
  path: "/passport-photo/",
});

export default function Page() {
  return (
    <DocPhotoLanding
      kind="passport"
      path="/passport-photo/"
      h1="Free Indian Passport Size Photo Maker"
      intro="Make a compliant Indian passport photo for free — 35×45 mm for the printed form, or exactly 630×810 px JPEG under 250 KB for the Passport Seva online upload. Pick your country, drop in a photo, and we auto-crop to the exact head size, ICAO-compliant white background, and portal spec. 100% private; nothing is uploaded."
      faqItems={PASSPORT_FAQ}
    />
  );
}
