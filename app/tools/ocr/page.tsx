import { pageMetadata } from "@/lib/seo";
import { CategoryPage } from "@/components/tools/CategoryPage";

export const metadata = pageMetadata({
  title: "Free OCR Tools — Image to Text Online",
  description:
    "Extract text from any image, scanned document or screenshot — free, nothing uploaded. Supports English and Hindi.",
  path: "/tools/ocr/",
});

export default function Page() {
  return <CategoryPage slug="ocr" />;
}
