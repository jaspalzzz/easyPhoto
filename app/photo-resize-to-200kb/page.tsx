import { pageMetadata } from "@/lib/seo";
import { KbResizeLanding } from "@/components/tools/KbResizeLanding";

export const metadata = pageMetadata({
  title: "Resize Image to 200KB Online – Free Photo Compressor",
  titleAbsolute: true,
  description: "Compress a photo to 200 KB online for free. Great for web forms and applications that cap uploads at 200 KB. Private, in-browser.",
  path: "/photo-resize-to-200kb/",
});

export default function Page() {
  return <KbResizeLanding kb={200} />;
}
