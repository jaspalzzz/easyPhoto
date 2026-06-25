import { pageMetadata } from "@/lib/seo";
import { DocPhotoResizerPage } from "@/components/tools/DocPhotoResizerPage";

export const metadata = pageMetadata({
  title: "ECI Voter ID Photo Resizer — Resize to 100 KB Online Free",
  titleAbsolute: true,
  description:
    "Resize your Voter ID (Form 6) photo to the ECI specification — 4.5×3.5 cm, " +
    "under 100 KB, white background — free and in your browser. Nothing is uploaded.",
  path: "/voter-id-photo-resizer/",
});

export default function Page() {
  return (
    <DocPhotoResizerPage
      portalId="voter-id"
      displayName="ECI Voter ID"
      slug="voter-id-photo-resizer"
      intro="Get your new-voter (Form 6) photo to the size, dimensions and file limit the ECI Voters' Service Portal accepts — auto-resized and checked, free, entirely in your browser."
      learnMoreHref="/blog/voter-id-photo-requirements-2026/"
      learnMoreLabel="Voter ID photo requirements & NVSP upload spec →"
    />
  );
}
