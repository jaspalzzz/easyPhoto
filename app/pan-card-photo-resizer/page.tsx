import { pageMetadata } from "@/lib/seo";
import { DocPhotoResizerPage } from "@/components/tools/DocPhotoResizerPage";

export const metadata = pageMetadata({
  title: "PAN Card Photo & Signature Resizer — Exact Size, Free",
  titleAbsolute: true,
  description:
    "Resize your PAN card photo (3.5×2.5 cm, ≤20 KB) and signature (2×4.5 cm, " +
    "≤10 KB) to the exact NSDL/UTIITSL specification, free and in your browser. " +
    "Nothing is uploaded.",
  path: "/pan-card-photo-resizer/",
});

export default function Page() {
  return (
    <DocPhotoResizerPage
      portalId="pan"
      displayName="PAN card"
      slug="pan-card-photo-resizer"
      intro="Get your PAN card photo and signature to the exact size, dimensions and KB the online application (Protean-NSDL / UTIITSL) demands — auto-resized and checked, free, entirely in your browser."
    />
  );
}
