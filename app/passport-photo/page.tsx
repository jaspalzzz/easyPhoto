import { pageMetadata } from "@/lib/seo";
import { DocPhotoLanding } from "@/components/site/DocPhotoLanding";

export const metadata = pageMetadata({
  title: "Free Passport Photo Maker – Compliant for Any Country",
  titleAbsolute: true,
  description:
    "Make a passport photo online free. Auto-crops to the exact head size & " +
    "background for India, US, UK, Canada & Australia. 100% private — no upload.",
  path: "/passport-photo/",
});

const faqItems = [
  {
    q: "How do I make a passport photo online?",
    a: "Choose your country above and upload a clear, front-facing photo. We detect your face, crop to the country's exact head-size, set the correct background colour, and check compliance — then you download a print-ready and an upload-ready file.",
  },
  {
    q: "Is the passport photo maker free?",
    a: "Yes — it's completely free with no watermark and no sign-up. You download the full-quality photo.",
  },
  {
    q: "Will the photo be accepted by the passport office?",
    a: "We size the head and set the background to each country's official specification and run an automatic compliance check. We also link the official government source on every country page so you can verify the rules before submitting.",
  },
  {
    q: "Is my photo uploaded anywhere?",
    a: "No. Everything runs in your browser — your photo is never uploaded or stored on any server.",
  },
];

export default function Page() {
  return (
    <DocPhotoLanding
      kind="passport"
      path="/passport-photo/"
      h1="Free Passport Photo Maker"
      intro="Create a compliant passport photo online for free. Pick your country, drop a photo, and we auto-crop to the exact head size and background — for India, the US, UK, Canada and Australia. 100% private; nothing is uploaded."
      faqItems={faqItems}
    />
  );
}
