import type { Metadata } from "next";
import { CategoryPage } from "@/components/tools/CategoryPage";

export const metadata: Metadata = {
  title: "Free Photo Tools — Background Remover, Compress & Resize",
  description:
    "Free online photo tools that run in your browser: remove backgrounds, " +
    "compress an image to a KB target, resize by pixels, and add a white " +
    "background. Nothing is uploaded.",
};

export default function Page() {
  return <CategoryPage slug="photo" />;
}
