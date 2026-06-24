import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { RejectionPredictorTool } from "@/components/tools/RejectionPredictorTool";

export const metadata = pageMetadata({
  title: "Passport Photo Rejection Checker — Will My Photo Be Accepted?",
  description:
    "Upload your passport photo and check it against ICAO biometric criteria — face detection, centering, head size, eye level, background. Free, nothing uploaded.",
  path: "/tools/photo-rejection-check/",
});

export default function Page() {
  return (
    <ToolPage
      title="Passport Photo Rejection Check"
      slug="photo-rejection-check"
      blurb="Upload your passport or visa photo and find out if it will pass the automated biometric gate — before you submit it. Checks face detection, horizontal centering, head size, eye level, tilt, background plainness, and lighting, all against ICAO criteria."
    >
      <RejectionPredictorTool />
    </ToolPage>
  );
}
