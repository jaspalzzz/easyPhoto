import { pageMetadata } from "@/lib/seo";
import { KbResizeLanding } from "@/components/tools/KbResizeLanding";

export const metadata = pageMetadata({
  title: "Resize Image to 50KB Online – Free Photo Compressor",
  titleAbsolute: true,
  description:
    "Compress a photo to 50 KB online for free. Ideal for passport, visa, exam " +
    "& form uploads. Maintains quality, nothing uploaded — works in your browser.",
  path: "/tools/resize-image-to-50kb/",
});

export default function Page() {
  return <KbResizeLanding kb={50} />;
}
