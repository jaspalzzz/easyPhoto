import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { FormFillTool } from "@/components/tools/FormFillTool";

export const metadata = pageMetadata({
  title: "Fill PDF Form Online Free — Fill & Download Any PDF Form",
  description:
    "Upload a fillable PDF form, type into each field, and download the completed PDF — free, nothing uploaded, works with AcroForm government application forms.",
  path: "/tools/form-fill/",
});

export default function Page() {
  return (
    <ToolPage
      title="Fill PDF Form"
      slug="form-fill"
      blurb="Upload a fillable PDF form (AcroForm), type into the detected fields, and download the filled PDF — ready to submit or print. Works with government application forms, NSDL forms, bank forms, and most official fillable PDFs. Nothing is uploaded."
      footnote="Uses pdf-lib, an open-source library, to detect and fill form fields entirely in your browser."
    >
      <FormFillTool />
    </ToolPage>
  );
}
