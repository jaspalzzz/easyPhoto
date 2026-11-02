import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { TrustPageLayout } from "@/components/site/TrustPageLayout";

export const metadata = pageMetadata({
  title: "How Photo Checking Works",
  description:
    "What easyPhoto can measure or estimate in a document photo, what remains outside the tool, and why no browser check can guarantee acceptance.",
  path: "/how-photo-checking-works/",
});

export default function HowPhotoCheckingWorksPage() {
  return (
    <TrustPageLayout
      eyebrow="Technical limits"
      title="How photo checking works"
      intro="The tools combine exact file measurements with visual estimates. Knowing which is which helps you interpret a warning without mistaking it for an approval decision."
    >
      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          Properties the browser can measure
        </h2>
        <p>
          A browser can read the pixel size, the shape (aspect ratio), the file size,
          the file format and any DPI number saved in the file. These are exact, so
          resizing and compression can aim at a published limit precisely. Saving a
          file again can change its size slightly, so the tool measures the final
          file once more before you download it.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          Properties the tool can only estimate
        </h2>
        <p>
          Depending on the tool, face detection and sampling parts of the image
          can estimate face position, head size in the frame, how plain the
          background is, lighting, and whether the face is clearly visible. These results can flag
          likely problems, but they are sensitive to image quality, pose, hair,
          head coverings, lighting, and detection accuracy.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          What easyPhoto cannot verify
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Whether a photo is a current and true likeness of the applicant.</li>
          <li>Identity, eligibility, supporting documents, or application answers.</li>
          <li>Rules that are missing from, or newer than, the source the page links.</li>
          <li>An authority&apos;s manual judgement or the result of its own biometric checks.</li>
          <li>That a portal or reviewing officer will accept the finished file.</li>
        </ul>
      </section>

      <section className="rounded-xl border border-hairline bg-card p-6">
        <h2 className="text-lg font-semibold tracking-tight text-ink">
          Use the result as a pre-check
        </h2>
        <p className="mt-2">
          Read any warnings, compare the figures on the page with its linked
          source, and confirm the current instructions in the application portal
          before submitting. The{" "}
          <Link href="/source-methodology/" className="font-medium text-brand underline">
            source methodology
          </Link>{" "}
          explains where those figures come from.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          A practical checking sequence
        </h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Pick the exam or document you are actually applying for.</li>
          <li>Start from the uncropped camera image so there is room to adjust framing.</li>
          <li>Resolve visible blur, glare, shadows, or obstruction by retaking where possible.</li>
          <li>Download and reopen the result to confirm its format, dimensions, and file size.</li>
          <li>Compare the finished file with the linked current authority instructions.</li>
        </ol>
        <p>
          This order prevents a technically correct file size from hiding a poor
          source photograph. Repeated resizing cannot recreate detail that was
          absent from the original.
        </p>
      </section>
    </TrustPageLayout>
  );
}
