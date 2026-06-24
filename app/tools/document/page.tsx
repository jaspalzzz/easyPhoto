import { pageMetadata } from "@/lib/seo";
import { CategoryPage } from "@/components/tools/CategoryPage";

export const metadata = pageMetadata({
  title: "Free Document Tools — Compress, Convert & Redact",
  description:
    "Compress Aadhaar, marksheets and certificates to any KB target, convert images to PDF, and redact sensitive details — all free, nothing uploaded.",
  path: "/tools/document/",
});

export default function Page() {
  return <CategoryPage slug="document" />;
}
