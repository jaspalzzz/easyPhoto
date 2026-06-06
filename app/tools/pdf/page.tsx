import type { Metadata } from "next";
import { CategoryPage } from "@/components/tools/CategoryPage";

export const metadata: Metadata = {
  title: "Free PDF Tools — JPG to PDF & PDF to JPG",
  description:
    "Free online PDF tools that run in your browser: combine images into a PDF " +
    "and export PDF pages to JPG images. Private — your files never leave your " +
    "device.",
};

export default function Page() {
  return <CategoryPage slug="pdf" />;
}
