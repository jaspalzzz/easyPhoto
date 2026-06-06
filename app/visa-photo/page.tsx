import { pageMetadata } from "@/lib/seo";
import { DocPhotoLanding } from "@/components/site/DocPhotoLanding";

export const metadata = pageMetadata({
  title: "Free Visa Photo Maker – Correct Size for Any Country",
  titleAbsolute: true,
  description:
    "Create a compliant visa photo online free. Exact dimensions & background " +
    "for Schengen, US (DS-160), UK, Canada & Australia visas. In-browser, no upload.",
  path: "/visa-photo/",
});

const faqItems = [
  {
    q: "How do I make a visa photo online?",
    a: "Choose the destination country above and upload a front-facing photo. We crop to the required visa-photo size, apply the correct background, and check compliance — then you download the file ready for printing or online upload.",
  },
  {
    q: "Which visa photo sizes are supported?",
    a: "The common standards used across Schengen, US (DS-160), UK, Canada and Australia visas — typically 35×45mm, or 2×2 inch (51×51mm) for the US. Select your country and we apply its exact spec.",
  },
  {
    q: "Is the visa photo maker free and private?",
    a: "Yes — free, no watermark, no sign-up, and your photo is processed entirely in your browser. It is never uploaded.",
  },
  {
    q: "Can I use it for both print and online upload?",
    a: "Yes. You get a print-ready file at the correct millimetre size and DPI, plus an upload-ready file compressed under the portal's file-size limit.",
  },
];

export default function Page() {
  return (
    <DocPhotoLanding
      kind="visa"
      path="/visa-photo/"
      h1="Free Visa Photo Maker"
      intro="Create a compliant visa photo online for free. Pick the destination country, drop a photo, and we apply the exact size and background — for Schengen, US (DS-160), UK, Canada and Australia visas. Made in your browser; nothing is uploaded."
      faqItems={faqItems}
    />
  );
}
