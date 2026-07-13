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
      blurb="Upload a photo and the on-device face detector crops it to the selected preset. India's 35×45mm option is for the below-four print; ordinary adults are photographed at PSK/POPSK. Other country presets include the USA, UK, EU, and Australia."
      footnote="Uses MediaPipe FaceLandmarker for face detection and a geometric head-positioning engine to compute the ideal crop. All processing is on-device."
    >
      <AutoCropTool />
    </ToolPage>
  );
}
