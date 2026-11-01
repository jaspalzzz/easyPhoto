import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { FaceCenteringTool } from "@/components/tools/FaceCenteringTool";

export const metadata = pageMetadata({
  // Searchers type the messages forms show (GSC, 28 days to 13 Oct 2026):
  // "position your face in the center", "place your face in the frame",
  // "face is tilted in uploaded image", "align your face inside the circle".
  title: "Center Your Face in a Photo — Check Position & Head Tilt",
  description:
    "Form says \"Position your face in the center\" or \"Face is tilted in uploaded image\"? " +
    "See how far off-centre your face is and how much your head tilts. Free.",
  path: "/tools/face-centering/",
});

export default function Page() {
  return (
    <ToolPage
      title="Center Your Face in the Photo"
      slug="face-centering"
      blurb="Upload a passport or ID photo and get a visual overlay showing whether your face is horizontally centred — with a bounding box, centre crosshair, and centering score. Also checks head tilt. Face detection runs entirely on your device."
      footnote="Uses MediaPipe FaceLandmarker running as WebAssembly in your browser."
    >
      <FaceCenteringTool />

      <section className="mt-10 space-y-3 border-t border-hairline pt-8">
        <h2 className="text-lg font-semibold text-ink">
          &ldquo;Face is tilted&rdquo; or &ldquo;Position your face in the center&rdquo;: what the form means
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          These messages come from the form&apos;s own photo check. <em>Tilted</em> means your eyes are not
          level, because your head leans to one side. <em>Not centred</em> means your face sits to one
          side of the frame or circle instead of in the middle.
        </p>
        <ul className="max-w-2xl list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>Hold the phone straight, at eye level, and keep your head upright with both eyes level.</li>
          <li>Move closer until your face fills the frame or circle the form draws, with your whole head inside it.</li>
          <li>Face a window or a plain light wall so the light falls evenly on both sides of your face.</li>
          <li>
            For a photo you already have, check it here, re-crop it in your phone&apos;s
            photo editor so your face sits in the middle, then run the check here again.
          </li>
        </ul>
      </section>
    </ToolPage>
  );
}
