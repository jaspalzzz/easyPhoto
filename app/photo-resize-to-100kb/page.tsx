import { pageMetadata } from "@/lib/seo";
import { KbResizeLanding } from "@/components/tools/KbResizeLanding";

export const metadata = pageMetadata({
  title: "Resize Image to 100KB Online – Free Photo Compressor",
  titleAbsolute: true,
  description: "Compress a photo to 100 KB online for free for job, university and web form uploads. Keeps quality high, nothing leaves your device.",
  path: "/photo-resize-to-100kb/",
});

export default function Page() {
  return <KbResizeLanding kb={100} />;
}
