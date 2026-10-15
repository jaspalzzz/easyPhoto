import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";
import { PORTAL_PRESETS } from "@/lib/portalPresets";

/*
 * Re-checked against UPSC's "Instructions for Uploading the Photo & Signature"
 * on 15 Oct 2026: added the mandatory live photo, and removed signature box
 * sizes, gaps and reasons the instructions don't give.
 */
const post = getPost("upsc-cse-ias-photo-signature-guide-2026")!;
const spec = PORTAL_PRESETS.upsc;

export const metadata = pageMetadata({
  title: post.title,
  titleAbsolute: true,
  description: post.description,
  path: `/blog/${post.slug}/`,
  type: "article",
});

export default function Page() {
  return (
    <BlogPostLayout slug={post.slug} ctaHref="/exam-requirements/upsc/" ctaLabel="Resize your UPSC photo">
      <p className="text-sm text-ink-soft">Last reviewed: 15 October 2026</p>
      <p>
        UPSC CSE, NDA and CDS all upload through the same UPSC OTR (One-Time
        Registration) portal, so they share one set of file rules. The part that
        trips most candidates is the signature: UPSC wants three signatures on a
        single sheet, not one. The other is newer: the form also takes a live
        photograph of you and checks it against the photo you upload. Here is
        what{" "}
        <a
          href={spec.source?.url ?? "https://upsconline.nic.in"}
          className="text-brand underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          UPSC&apos;s upload instructions
        </a>{" "}
        actually say, and how to get every step right in one pass.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>
            <strong>Photo:</strong> 20–200&nbsp;KB, JPG, plain white background,
            face covering about 75% of the frame. UPSC publishes no fixed pixel
            size, aspect ratio, or name/date strip.
          </li>
          <li>
            <strong>Signature:</strong> sign your name{" "}
            <em>three times vertically</em> on a single plain white sheet in
            black ink, then upload it as a single 350–500 pixel JPG of
            20–100&nbsp;KB.
          </li>
          <li>
            <strong>Live photo:</strong> taken during the application with a
            webcam or a phone, and matched with your uploaded photo.
          </li>
          <li>
            <strong>Before you apply:</strong> read the current notification —
            UPSC can add cycle-specific rules such as a photo-recency window.
          </li>
          <li>
            Upload at the UPSC OTR portal:{" "}
            <a
              href="https://upsconline.nic.in"
              className="text-brand underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              upsconline.nic.in
            </a>
            .
          </li>
        </ul>
      </div>

      <h2>What are the UPSC CSE photo and signature specs for 2026?</h2>
      <p>
        UPSC CSE uses the same OTR (One-Time Registration) portal as NDA and
        CDS. The specs below are confirmed across the{" "}
        <a
          href="https://upsconline.nic.in"
          className="text-brand underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          UPSC OTR portal instructions
        </a>{" "}
        and the notification published by{" "}
        <a
          href="https://upsc.gov.in"
          className="text-brand underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          UPSC
        </a>
        . Confirm the figures for your specific cycle before applying.
      </p>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Field</th>
            <th className="py-2 pr-3 font-semibold text-ink">Photo</th>
            <th className="py-2 pr-3 font-semibold text-ink">Signature</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Format</td>
            <td className="py-2 pr-3">JPG / JPEG only</td>
            <td className="py-2 pr-3">JPG / JPEG only</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">File size</td>
            <td className="py-2 pr-3">
              <strong>20–200&nbsp;KB</strong>
            </td>
            <td className="py-2 pr-3">
              <strong>20–100&nbsp;KB</strong>
            </td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Pixel dimensions</td>
            <td className="py-2 pr-3">No fixed size published</td>
            <td className="py-2 pr-3">350–500&nbsp;px</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Background</td>
            <td className="py-2 pr-3">Plain white</td>
            <td className="py-2 pr-3">White paper, clean</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">
              Name&nbsp;+&nbsp;date on image
            </td>
            <td className="py-2 pr-3">Not required by UPSC</td>
            <td className="py-2 pr-3">—</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Face coverage</td>
            <td className="py-2 pr-3">About 75% of frame</td>
            <td className="py-2 pr-3">—</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Recency</td>
            <td className="py-2 pr-3">
              Per notification, if stated
            </td>
            <td className="py-2 pr-3">—</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Ink colour</td>
            <td className="py-2 pr-3">—</td>
            <td className="py-2 pr-3">Black</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">
              Signature count
            </td>
            <td className="py-2 pr-3">—</td>
            <td className="py-2 pr-3">
              Three, written vertically on one sheet
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        A note on the photo ceiling: some coaching sources cite 300&nbsp;KB.
        UPSC&apos;s current OTR portal instructions publish a 20–200&nbsp;KB
        photograph, so target 200&nbsp;KB as the ceiling and confirm the figure
        in the official notification PDF at{" "}
        <a
          href="https://upsc.gov.in"
          className="text-brand underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          upsc.gov.in
        </a>{" "}
        before applying.
      </p>

      <h2>Does UPSC CSE require a square photo, or name and date on it?</h2>
      <p>
        No. UPSC&apos;s instructions publish no fixed photo pixel size and no
        aspect ratio, so the instructions do not impose a square crop. They also
        do not ask for a name-and-date
        strip on the image. What UPSC does specify is the file format (JPG), the
        20–200&nbsp;KB size band, a plain white background, and a face covering
        about 75% of the frame. If a future notification adds a requirement,
        follow the notification.
      </p>

      <h2>What is the UPSC live photograph, and how do you take it?</h2>
      <p>
        Under UPSC&apos;s current instructions, a live photograph is compulsory for
        every UPSC examination, CSE included; the application can&apos;t be
        submitted without it. It is a second picture, taken while you fill in
        the form, on top of the photo file you upload.
      </p>
      <ol>
        <li>
          Choose how to take it: with your computer&apos;s web camera, or by
          scanning the QR code on screen and using your phone&apos;s camera.
        </li>
        <li>
          Face a good light source so your face shows clearly, then capture.
        </li>
        <li>
          Use &ldquo;View Photo&rdquo; to look at the saved image before moving
          on.
        </li>
      </ol>
      <p>
        UPSC matches the live photograph against your uploaded one. A mismatch
        blocks the rest of the application, so don&apos;t upload an old photo
        from a previous attempt if you look different now.
      </p>

      <h2>
        Why does UPSC CSE require three signatures — and how do you prepare
        them?
      </h2>
      <p>
        UPSC requires candidates to write their signature three times on a
        single sheet of white paper, with the three signatures arranged
        vertically, one below the other, in black ink. You photograph or scan
        this one sheet and upload it as a single image file; the portal does
        not take three separate files. UPSC doesn&apos;t explain why it wants
        three, but it is strict about the result: a signature file that breaks
        its rules is rejected. The image must be clear, sharp and well lit,
        hold exactly three signatures, and sit the right way up.
      </p>
      <ul>
        <li>
          <strong>Paper:</strong> plain white, with no lines and no colour.
        </li>
        <li>
          <strong>Sign three times vertically</strong> in black ink, leaving
          enough space between the signatures that they don&apos;t touch.
        </li>
        <li>
          <strong>Photograph flat</strong> in even overhead light. Check that
          no shadow falls across any of the three signatures.
        </li>
        <li>
          <strong>Upload the single image</strong> through the{" "}
          <Link href="/exam-requirements/upsc/">UPSC signature resizer</Link>.
          It cleans the paper background and outputs a JPG inside the
          20–100&nbsp;KB band. Name the file <code>{spec.sigFileName}</code>.
        </li>
      </ul>

      <figure className="my-7 overflow-hidden rounded-xl border border-hairline">
        <Image
          src="/images/upsc-cse-ias-photo-signature-guide-2026.webp"
          alt="Example UPSC signature sheet: three matching signatures written one below the other on plain white paper"
          width={760}
          height={760}
          className="w-full h-auto"
        />
        <figcaption className="bg-accent/30 px-4 py-2.5 text-center text-[12px] text-muted-foreground">
          An example layout. UPSC sets no box or paper size; it asks for three signatures in black ink, one below the other, with space between them.
        </figcaption>
      </figure>

      <h2>How does UPSC CSE compare to NDA and CDS for photo requirements?</h2>
      <p>
        They follow one instruction sheet on the same OTR portal, so nothing
        above changes for NDA or CDS: the two KB bands, the three black-ink
        signatures at 350–500 pixels and the live photo all apply as written.
        What can differ is the notification for a cycle, which may add a rule
        of its own, such as how recent the photo must be.
      </p>
      <p>
        The safe habit for a cross-applicant is to take a fresh photo for each
        application rather than reuse an old file; a current photo also passes
        the live-photo match more easily. For the full NDA and CDS photo guide, see the{" "}
        <Link href="/blog/nda-cds-photo-signature-guide-2026/">
          NDA &amp; CDS photo and signature guide
        </Link>
        .
      </p>

      <h2>What are the most common UPSC CSE photo rejection reasons?</h2>
      <p>
        The UPSC portal returns a generic error without naming the failed
        check. These are the causes most worth eliminating before uploading:
      </p>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">
              Rejection cause
            </th>
            <th className="py-2 pr-3 font-semibold text-ink">The fix</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">
              File above 200&nbsp;KB
            </td>
            <td className="py-2 pr-3">
              Compress with the UPSC photo resizer — most phone photos are
              2–5&nbsp;MB
            </td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">
              File below 20&nbsp;KB
            </td>
            <td className="py-2 pr-3">
              The resizer targets the full 20–200&nbsp;KB band; compressing
              to a tiny size fails the floor check
            </td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">
              Non-white background
            </td>
            <td className="py-2 pr-3">
              Use the white background tool first, then resize
            </td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">
              Face too small in frame
            </td>
            <td className="py-2 pr-3">
              Recrop so the face covers about 75% of the frame before resizing
            </td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">
              Signature: fewer than three / inconsistent style
            </td>
            <td className="py-2 pr-3">
              Write all three on one sheet in one sitting — same ink, same
              style, consistent size; photograph as one image
            </td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">
              Live photograph and upload look like different people
            </td>
            <td className="py-2 pr-3">
              Replace the uploaded file with a current photo, then capture the
              live one again
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        For the full breakdown of rejection patterns across all Indian exam
        portals, see{" "}
        <Link href="/blog/why-exam-photo-signature-rejected/">
          why exam photos and signatures get rejected
        </Link>
        .
      </p>

      <h2>
        How to prepare your UPSC CSE photo and signature — complete workflow
      </h2>
      <p>For the photo, in this order:</p>
      <ol>
        <li>
          <strong>Take a fresh photo:</strong> plain white wall, no shadows,
          face filling about 75% of the frame.
        </li>
        <li>
          <strong>Resize for UPSC.</strong> Run the image through the{" "}
          <Link href="/exam-requirements/upsc/">UPSC photo resizer</Link>. It
          outputs a JPG inside the 20–200&nbsp;KB band on a clean white
          background.
        </li>
        <li>
          <strong>
            Save as <code>photo.jpg</code>.
          </strong>{" "}
          The UPSC portal expects this filename.
        </li>
      </ol>
      <p>For the signature:</p>
      <ol>
        <li>
          <strong>Sign three times vertically</strong> on a single plain white
          sheet in black ink, with space between each.
        </li>
        <li>
          <strong>Photograph flat</strong> in even light; no shadow should
          fall across any of the three signatures.
        </li>
        <li>
          <strong>
            Run through the{" "}
            <Link href="/exam-requirements/upsc/">
              UPSC signature resizer
            </Link>
          </strong>
          . It cleans the background and compresses to the 20–100&nbsp;KB
          band. Nothing leaves your browser.
        </li>
      </ol>
      <p>
        For UPSC-specific requirement details and links to the official
        notification PDFs, see the{" "}
        <Link href="/exam-requirements/">exam requirements directory</Link>. For
        a side-by-side comparison of all major exam specs, see the{" "}
        <Link href="/blog/exam-photo-signature-size-guide/">
          photo and signature size guide for all exams
        </Link>
        .
      </p>

      <div className="mt-12">
        <Faq
          items={[
            {
              q: "Is the UPSC CSE photo size the same as NDA and CDS?",
              a: "Yes — all three use the same UPSC OTR portal: a 20–200 KB JPG photo on a plain white background with about 75% face coverage, a three-signature sheet (350–500 pixels, 20–100 KB), and a live photo during the application. The photo has no fixed pixel size, no square requirement and no name/date strip. Any recency window is set per notification, so read the one for your cycle.",
            },
            {
              q: "Why does UPSC CSE require three signatures?",
              a: "UPSC's instructions require it but don't give a reason. What they do set out: sign three times, one below the other, in black ink on plain white paper, and upload all three in one JPG that measures 350–500 pixels and stays within 20–100 KB. A file with fewer than three signatures is rejected.",
            },
            {
              q: "Does UPSC require a square photo or a name-and-date strip?",
              a: "No. UPSC's instructions publish no fixed photo pixel dimensions and no aspect ratio, so a normal passport-style portrait is fine — there is no square-crop rule — and they do not ask for a name or date printed on the image. UPSC specifies the JPG format, the 20–200 KB size band, a plain white background, and roughly 75% face coverage.",
            },
            {
              q: "Can I reuse my Prelims photo for the UPSC Mains DAF?",
              a: "The Mains Detailed Application Form requires a photo that matches your Prelims application photo and your current appearance. If your appearance has changed since the Prelims application, take a fresh photo. Confirm the exact DAF photo requirements in the official UPSC Mains notification at upsc.gov.in.",
            },
            {
              q: "My UPSC CSE photo is 220 KB — will it be accepted?",
              a: "No — 220 KB is over the ceiling. UPSC's current OTR portal instructions set a 20–200 KB band for the photo, so compress to 200 KB or below. Some older coaching-site guides cite 300 KB; treat the official notification as authoritative and confirm before submitting.",
            },
          ]}
        />
      </div>
    </BlogPostLayout>
  );
}
