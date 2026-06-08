import { pageMetadata } from "@/lib/seo";
import { PdfKbLanding } from "@/components/tools/PdfKbLanding";

export const metadata = pageMetadata({
  title: "Compress PDF to 200KB Online — Free, Client-Side",
  titleAbsolute: true,
  description:
    "Compress a PDF to under 200 KB online for free. Ideal for marksheets, certificates and exam/government form uploads. 100% private — nothing is uploaded.",
  path: "/compress-pdf-to-200kb/",
});

export default function Page() {
  return <PdfKbLanding kb={200} />;
}
