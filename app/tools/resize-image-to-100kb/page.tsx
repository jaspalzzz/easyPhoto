import { pageMetadata } from "@/lib/seo";
import { KbResizeLanding } from "@/components/tools/KbResizeLanding";

export const metadata = pageMetadata({
  title: "Resize Image to 100KB Online – Free Photo Compressor",
  titleAbsolute: true,
  description:
    "Compress a photo to 100 KB online for free. Great for form, passport and " +
    "visa uploads. Keeps quality, no upload — runs entirely in your browser.",
  path: "/tools/resize-image-to-100kb/",
});

export default function Page() {
  return <KbResizeLanding kb={100} />;
}
