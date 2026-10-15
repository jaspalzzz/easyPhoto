import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { AadhaarOcrTool } from "@/components/tools/AadhaarOcrTool";

export const metadata = pageMetadata({
  title: "Aadhaar Card OCR — Read Aadhaar Number, Name & DOB Free",
  description:
    "Read the Aadhaar number, name, DOB, gender and address from a photo of your card, on your device. " +
    "Also: how to get your Aadhaar photo or the card as a JPG. Free; nothing is uploaded.",
  path: "/tools/aadhaar-ocr/",
});

export default function Page() {
  return (
    <ToolPage
      title="Aadhaar Card OCR"
      slug="aadhaar-ocr"
      blurb="Upload a photo of your Aadhaar card — front side — and extract the Aadhaar number, name, date of birth, gender and address automatically. The OCR engine runs entirely on your device; your Aadhaar image is never uploaded to any server."
      footnote="Uses Tesseract.js — an open-source OCR engine — running as WebAssembly in your browser."
    >
      <AadhaarOcrTool />

      {/* GSC, 28 days to 13 Oct 2026: most searches reaching this page want the
          photo or a JPG of the card ("download photo from aadhar card",
          "extract photo from aadhar card", "aadhar jpg image"), which this OCR
          tool does not do. Existing tools do it in three steps. */}
      <section className="mt-10 space-y-3 border-t border-hairline pt-8">
        <h2 className="text-lg font-semibold text-ink">
          Need the photo from your Aadhaar card, or the card as a JPG?
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          This page reads the text. To get a picture instead, start from your e-Aadhaar PDF from UIDAI:
        </p>
        <ol className="max-w-2xl list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            Remove the PDF&apos;s password with{" "}
            <Link href="/unlock-aadhaar-pdf/" className="font-medium text-brand hover:underline">
              Unlock e-Aadhaar PDF
            </Link>
            , which also explains what the password is.
          </li>
          <li>
            Turn the page into a JPG with{" "}
            <Link href="/tools/pdf-to-jpg/" className="font-medium text-brand hover:underline">
              PDF to JPG
            </Link>
            .
          </li>
          <li>
            Cut out the photo, or keep the whole card, with{" "}
            <Link href="/tools/image-crop/" className="font-medium text-brand hover:underline">
              Image Crop
            </Link>
            .
          </li>
        </ol>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          The photo printed on Aadhaar is small and looks soft when enlarged. For an application that
          wants your picture, a fresh one from the{" "}
          <Link href="/passport-photo/" className="font-medium text-brand hover:underline">
            passport size photo maker
          </Link>{" "}
          is usually clearer.
        </p>
      </section>
    </ToolPage>
  );
}
