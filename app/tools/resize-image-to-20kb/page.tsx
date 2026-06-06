import { pageMetadata } from "@/lib/seo";
import { KbResizeLanding } from "@/components/tools/KbResizeLanding";

export const metadata = pageMetadata({
  title: "Resize Image to 20KB Online – Free Photo Compressor",
  titleAbsolute: true,
  description:
    "Compress a photo to 20 KB online for free. Perfect for exam & government " +
    "form uploads (SSC, UPSC, Passport Seva). Keeps quality, no upload.",
  path: "/tools/resize-image-to-20kb/",
});

export default function Page() {
  return <KbResizeLanding kb={20} />;
}
