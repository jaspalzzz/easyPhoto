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
          A browser can read pixel dimensions, aspect ratio, encoded file size,
          file format, and available DPI metadata. Resizing and compression can
          target those recorded limits deterministically, although re-encoding can
          change the final byte size and is checked again before download.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          Properties the tool can only estimate
        </h2>
        <p>
          Depending on the tool, on-device detection and image sampling may
          estimate face position, head framing, background uniformity, lighting,
          and whether important facial areas are visible. These results can flag
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
          <li>Requirements that are absent from or newer than the recorded source.</li>
          <li>An authority&apos;s manual judgement or the result of its own biometric checks.</li>
          <li>That a portal or reviewing officer will accept the finished file.</li>
        </ul>
      </section>

      <section className="rounded-xl border border-hairline bg-card p-6">
        <h2 className="text-lg font-semibold tracking-tight text-ink">
          Use the result as a pre-check
        </h2>
        <p className="mt-2">
          Review any warnings, compare the displayed specification with its linked
          source, and confirm the current instructions in the application portal
          before submitting. See the{" "}
          <Link href="/source-methodology/" className="font-medium text-brand underline">
            source methodology
          </Link>{" "}
          for how those records are maintained.
        </p>
      </section>
    </TrustPageLayout>
  );
}
