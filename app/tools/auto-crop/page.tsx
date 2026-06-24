import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { AutoCropTool } from "@/components/tools/AutoCropTool";

export const metadata = pageMetadata({
  title: "Auto-Crop Passport Photo — AI Face Detection Crop Free",
  description:
    "Upload any photo — AI detects your face, automatically crops and centres it to the correct passport photo size for India, USA, UK, EU, or Australia. Free, nothing uploaded.",
  path: "/tools/auto-crop/",
});

export default function Page() {
  return (
    <ToolPage
      title="Auto-Crop to Passport Spec"
      slug="auto-crop"
      blurb="Upload any photo — AI detects your face and automatically crops and resizes it to the correct passport photo proportions for your country (India 35×45mm, USA 51×51mm, UK, EU, or Australia). Head is centred and sized to spec. Download instantly."
      footnote="Uses MediaPipe FaceLandmarker for face detection and a geometric head-positioning engine to compute the ideal crop. All processing is on-device."
    >
      <AutoCropTool />
    </ToolPage>
  );
}
