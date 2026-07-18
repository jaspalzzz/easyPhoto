import { pageMetadata } from "@/lib/seo";
import { DocPhotoResizerPage } from "@/components/tools/DocPhotoResizerPage";

export const metadata = pageMetadata({
  title: "PAN Card Photo & Signature Resizer — Exact Size, Free",
  titleAbsolute: true,
  description:
    "Resize your PAN card photo (3.5×2.5 cm, ≤20 KB) and signature (2×4.5 cm, " +
    "≤10 KB) to the stored Protean/UTIITSL targets, free and in your browser. " +
    "Confirm the current application route; nothing is uploaded.",
  path: "/pan-card-photo-resizer/",
});

export default function Page() {
  return (
    <DocPhotoResizerPage
      portalId="pan"
      displayName="PAN card"
      slug="pan-card-photo-resizer"
      intro="Prepare your PAN card photo and signature to the stored Protean/UTIITSL size, dimensions and KB targets. Confirm the current application route; processing stays in your browser."
      learnMoreHref="/blog/pan-card-photo-size/"
      learnMoreLabel="PAN card photo size & NSDL requirements guide →"
    />
  );
}
