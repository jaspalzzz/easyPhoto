import { pageMetadata } from "@/lib/seo";
import { KbResizeLanding } from "@/components/tools/KbResizeLanding";

export const metadata = pageMetadata({
  title: "Resize Image to 30KB Online – Free Photo Compressor",
  titleAbsolute: true,
  description: "Compress a photo to 30 KB online for free for form and exam uploads. Best-possible quality at the target size, entirely in your browser.",
  path: "/photo-resize-to-30kb/",
});

export default function Page() {
  return <KbResizeLanding kb={30} />;
}
