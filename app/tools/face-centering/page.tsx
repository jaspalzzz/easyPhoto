import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { FaceCenteringTool } from "@/components/tools/FaceCenteringTool";

export const metadata = pageMetadata({
  title: "Face Centering AI — Is My Face Centred in the Photo?",
  description:
    "Upload a passport photo and see if your face is horizontally centred — with a visual overlay showing the face bounding box, head tilt, and centering score. Free, on-device.",
  path: "/tools/face-centering/",
});

export default function Page() {
  return (
    <ToolPage
      title="Face Centering AI"
      slug="face-centering"
      blurb="Upload a passport or ID photo and get a visual overlay showing whether your face is horizontally centred — with a bounding box, centre crosshair, and centering score. Also checks head tilt. Face detection runs entirely on your device."
      footnote="Uses MediaPipe FaceLandmarker running as WebAssembly in your browser."
    >
      <FaceCenteringTool />
    </ToolPage>
  );
}
