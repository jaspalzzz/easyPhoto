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
      intro="Get your driving licence / learner's licence photo and signature to the size and KB the Sarathi Parivahan portal accepts — auto-resized and checked, free, entirely in your browser. Limits can vary by state, so confirm what your portal shows."
    />
  );
}
