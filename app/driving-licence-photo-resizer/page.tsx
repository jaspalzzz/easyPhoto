import { pageMetadata } from "@/lib/seo";
import { DocPhotoResizerPage } from "@/components/tools/DocPhotoResizerPage";

export const metadata = pageMetadata({
  title: "Driving Licence Photo & Signature Resizer — Sarathi Size, Free",
  titleAbsolute: true,
  description:
    "Resize your driving licence photo (35×45 mm, ≤20 KB) and signature for the " +
    "Sarathi Parivahan application, free and in your browser. Nothing is uploaded.",
  path: "/driving-licence-photo-resizer/",
});

export default function Page() {
  return (
    <DocPhotoResizerPage
      portalId="driving-licence"
      displayName="Driving Licence"
      slug="driving-licence-photo-resizer"
      intro="Prepare your driving licence / learner's licence photo and signature to the stored Sarathi targets. Limits can vary by state, so confirm the fields shown by your current portal before submitting. Processing stays in your browser."
      learnMoreHref="/blog/driving-licence-photo-size-sarathi/"
      learnMoreLabel="Sarathi photo & signature requirements guide →"
    />
  );
}
