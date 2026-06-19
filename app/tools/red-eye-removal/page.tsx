import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { RedEyeTool } from "@/components/tools/RedEyeTool";
import { getTool } from "@/lib/toolsCatalog";

const tool = getTool("red-eye-removal")!;

export const metadata = pageMetadata({
  title: "Red-Eye Removal — Fix Flash Red-Eye Free, In Your Browser",
  description:
    "Tap to remove red-eye from a flash photo. Fixes each pupil on your device with no upload — ideal before printing a passport or ID photo.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Red-Eye Removal"
      slug={tool.slug}
      blurb={tool.blurb}
      faqItems={[
        {
          q: "How does the red-eye fix work?",
          a: "When you tap a pupil, the tool looks at the pixels in a small circle around your tap and pulls down any strongly red ones to match the surrounding green and blue. That turns the flash glow back into a natural dark pupil without affecting skin, eye colour or the background.",
        },
        {
          q: "It didn't fully fix the eye — what do I do?",
          a: "Tap the same pupil again to strengthen the effect, or switch to a larger brush size if the red area is bigger than the circle. If you over-do it, use 'Undo all' to start over from the original photo.",
        },
        {
          q: "Will it change my eye colour?",
          a: "No. The fix only targets the bright red flash reflection in the pupil. Natural iris colours (brown, blue, green, grey) are not red-dominant, so they are left untouched.",
        },
        {
          q: "Is my photo uploaded anywhere?",
          a: "No. The whole correction runs in your browser on an HTML canvas. Your photo never leaves your device.",
        },
      ]}
    >
      <RedEyeTool />
    </ToolPage>
  );
}
