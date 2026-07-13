import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { RejectionPredictorTool } from "@/components/tools/RejectionPredictorTool";

export const metadata = pageMetadata({
  title: "Passport Photo Issue Checker — Common Rejection Reasons",
  description:
    "Review measurable passport-photo properties including face position, head framing, eye level, background uniformity and lighting. Free, with nothing uploaded.",
  path: "/tools/photo-rejection-check/",
});

export default function Page() {
  return (
    <ToolPage
      title="Passport Photo Issue Checker"
      slug="photo-rejection-check"
      blurb="Review measurable passport- or visa-photo properties before submitting: face detection, horizontal centering, head framing, eye level, tilt, background uniformity and lighting. The result cannot predict an authority's decision."
    >
      <RejectionPredictorTool />
    </ToolPage>
  );
}
