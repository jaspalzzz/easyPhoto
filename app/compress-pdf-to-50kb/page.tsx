import { pageMetadata } from "@/lib/seo";
import { PdfKbLanding } from "@/components/tools/PdfKbLanding";

export const metadata = pageMetadata({
  title: "Compress PDF to 50KB Online — Free, Client-Side",
  titleAbsolute: true,
  description:
    "Compress a PDF to under 50 KB online for free. Perfect for UPSC, IBPS, SSC and other exam portals that cap supporting documents at 50 KB. 100% private — nothing is uploaded.",
  path: "/compress-pdf-to-50kb/",
});

export default function Page() {
  return <PdfKbLanding kb={50} />;
}
