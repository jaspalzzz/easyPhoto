import { pageMetadata } from "@/lib/seo";
import { DocPhotoResizerPage } from "@/components/tools/DocPhotoResizerPage";

export const metadata = pageMetadata({
  title: "ECI Voter ID Photo Resizer — Resize to 100 KB Online Free",
  titleAbsolute: true,
  description:
    "Prepare a Voter ID Form 6 photo to the published 4.5×3.5 cm physical proportion " +
    "and a selected compatibility target. Confirm the current portal's digital fields.",
  path: "/voter-id-photo-resizer/",
});

export default function Page() {
  return (
    <DocPhotoResizerPage
      portalId="voter-id"
      displayName="ECI Voter ID"
      slug="voter-id-photo-resizer"
      intro="Prepare your new-voter (Form 6) photo to the stored compatibility target and published physical proportions. ECI's public Form 6 does not publish one universal digital KB limit, so confirm the current portal before submitting."
      learnMoreHref="/blog/voter-id-photo-requirements-2026/"
      learnMoreLabel="Voter ID photo requirements & NVSP upload spec →"
    />
  );
}
