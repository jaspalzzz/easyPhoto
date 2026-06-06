import { pageMetadata } from "@/lib/seo";
import { CategoryPage } from "@/components/tools/CategoryPage";

export const metadata = pageMetadata({
  title: "Free Photo Tools — Background Remover, Compress & Resize",
  description:
    "Free online photo tools that run in your browser: remove backgrounds, " +
    "compress an image to a KB target, resize by pixels, and add a white " +
    "background. Nothing is uploaded.",
  path: "/tools/photo/",
});

export default function Page() {
  return <CategoryPage slug="photo" />;
}
