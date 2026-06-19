import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { PhotoValidatorTool } from "@/components/tools/PhotoValidatorTool";
import { getTool } from "@/lib/toolsCatalog";

const tool = getTool("photo-validator")!;

export const metadata = pageMetadata({
  title: "Photo Validator — Check KB, Pixels, Format & Aspect Ratio",
  description:
    "Drop your photo to instantly check file size (KB), pixel dimensions, format and aspect ratio against 40+ exam and portal presets. Free, nothing uploaded.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Photo Validator"
      slug={tool.slug}
      blurb={tool.blurb}
      faqItems={[
        {
          q: "What does the validator check?",
          a: "It checks four things: file format (most portals require JPG), file size in KB, pixel dimensions (width × height), and aspect ratio. It then compares those values against the stored specs for 40+ exam portals and tells you which ones your photo already passes.",
        },
        {
          q: "My photo passes the validator but the portal is still rejecting it.",
          a: "The validator checks the most common technical limits (KB, pixels, format). Some portals have additional requirements — for example the photo must be recent, the background must be white, the face must be clearly visible, or a specific brightness. Check the portal's official notification for those requirements.",
        },
        {
          q: "The validator says 'no exact preset match'. What should I do?",
          a: "Use the 'Resize to KB' or 'Resize dimensions' tool to adjust your file to match your exam's requirements, then drag it back here to validate. Alternatively, open the form resizer for your specific portal — it resizes and compresses in one step.",
        },
        {
          q: "Is my photo uploaded to a server?",
          a: "No. The entire check happens in your browser using JavaScript. Your photo never leaves your device.",
        },
      ]}
    >
      <PhotoValidatorTool />
    </ToolPage>
  );
}
