import { pageMetadata } from "@/lib/seo";
import { DocPhotoResizerPage } from "@/components/tools/DocPhotoResizerPage";

export const metadata = pageMetadata({
  title: "Voter ID Photo Resizer — ECI Form 6 Size, Free",
  titleAbsolute: true,
  description:
    "Resize your Voter ID (Form 6) photo to the ECI specification — 4.5×3.5 cm, " +
    "white background — free and in your browser. Nothing is uploaded.",
  path: "/voter-id-photo-resizer/",
});

export default function Page() {
  return (
    <DocPhotoResizerPage
      portalId="voter-id"
      displayName="Voter ID"
      slug="voter-id-photo-resizer"
      intro="Get your new-voter (Form 6) photo to the size, dimensions and file limit the ECI Voters' Service Portal accepts — auto-resized and checked, free, entirely in your browser."
    />
  );
}
