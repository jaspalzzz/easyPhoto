import { pageMetadata } from "@/lib/seo";
import { KbResizeLanding } from "@/components/tools/KbResizeLanding";

export const metadata = pageMetadata({
  title: "Resize Image to 200KB Online – Free Photo Compressor",
  titleAbsolute: true,
  description:
    "Compress a photo to 200 KB online for free. Ideal for online forms and " +
    "document uploads. Maintains quality, nothing uploaded — in your browser.",
  path: "/tools/resize-image-to-200kb/",
});

export default function Page() {
  return <KbResizeLanding kb={200} />;
}
