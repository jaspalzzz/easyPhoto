import { pageMetadata } from "@/lib/seo";
import { CategoryPage } from "@/components/tools/CategoryPage";

export const metadata = pageMetadata({
  title: "Free Signature Tools — Crop, Resize & Transparent PNG",
  description:
    "Free online signature tools that run in your browser: auto-crop a scan, " +
    "resize, remove the paper background, and export a transparent signature " +
    "PNG. Nothing is uploaded.",
  path: "/tools/signature/",
});

export default function Page() {
  return <CategoryPage slug="signature" />;
}
