import { pageMetadata } from "@/lib/seo";
import { KbResizeLanding } from "@/components/tools/KbResizeLanding";

export const metadata = pageMetadata({
  title: "Resize Image to 50KB Online – Free Photo Compressor",
  titleAbsolute: true,
  description: "Compress a photo to 50 KB online for free — a common passport, visa and exam form limit. Sharp results, processed in your browser.",
  path: "/photo-resize-to-50kb/",
});

export default function Page() {
  return <KbResizeLanding kb={50} />;
}
