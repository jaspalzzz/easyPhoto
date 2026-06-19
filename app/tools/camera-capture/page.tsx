import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { CameraCaptureTool } from "@/components/tools/CameraCaptureTool";
import { getTool } from "@/lib/toolsCatalog";

const tool = getTool("camera-capture")!;

export const metadata = pageMetadata({
  title: "Take a Passport Photo with Your Camera — Free, In-Browser",
  description:
    "Capture a passport or ID photo with your phone or webcam using an oval face guide. No file upload, no app — the photo is taken and saved on your device.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Take Passport Photo with Camera"
      slug={tool.slug}
      blurb={tool.blurb}
      faqItems={[
        {
          q: "Do I need to allow camera permission?",
          a: "Yes. When you tap 'Start camera' your browser asks for permission to use the camera. The video stream stays entirely on your device — nothing is sent to any server. If you blocked it by accident, re-enable camera access in your browser's site settings and try again.",
        },
        {
          q: "Why is there an oval on the screen?",
          a: "The dashed oval is a framing guide. Line up your face so your head and the top of your shoulders sit inside it — this gives roughly the head size most passport and exam photos require. Hold the camera at eye level and look straight at it.",
        },
        {
          q: "Can I use the back camera?",
          a: "Yes. Tap 'Flip camera' to switch between the front (selfie) and back camera. The back camera usually has higher resolution, so if someone else can take the photo for you, the back camera gives a sharper result.",
        },
        {
          q: "What do I do after capturing?",
          a: "Download the photo, then crop and compress it to your exam or portal's exact size using the resize tools. For a clean white background, run it through the white-background or background-removal tool first.",
        },
      ]}
    >
      <CameraCaptureTool />
    </ToolPage>
  );
}
