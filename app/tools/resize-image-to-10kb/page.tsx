import { pageMetadata } from "@/lib/seo";
import { KbResizeLanding } from "@/components/tools/KbResizeLanding";

export const metadata = pageMetadata({
  title: "Resize Image to 10KB Online – Free Photo Compressor",
  titleAbsolute: true,
  description:
    "Compress a photo to 10 KB online for free. Ideal for exam & government " +
    "form uploads. Keeps quality, no upload — runs in your browser.",
  path: "/tools/resize-image-to-10kb/",
});

export default function Page() {
  return <KbResizeLanding kb={10} />;
}
