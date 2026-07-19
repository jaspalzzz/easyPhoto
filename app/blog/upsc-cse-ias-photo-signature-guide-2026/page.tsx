import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("upsc-cse-ias-photo-signature-guide-2026")!;

export const metadata = pageMetadata({
  title: post.title,
  titleAbsolute: true,
  description: post.description,
  path: `/blog/${post.slug}/`,
  type: "article",
});

export default function Page() {
  return (
    <BlogPostLayout slug={post.slug} ctaHref="/upsc-photo-resizer/" ctaLabel="Resize your UPSC photo">
      <p>
        UPSC CSE, NDA and CDS all upload through the same UPSC OTR (One-Time
        Registration) portal, so they share one set of file rules. The part that
        trips most candidates is the signature: UPSC wants three signatures on a
        single sheet, not one. Whether you&apos;re preparing a Mains Detailed
        Application Form or planning for the next cycle, here are the file-size
        limits UPSC actually publishes and how to get both files right in one pass.
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
            black ink, then upload it as one 20–100&nbsp;KB JPG.
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
            <td className="py-2 pr-3">350–500&nbsp;px (three on one sheet)</td>
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
            <td className="py-2 pr-3">Black (recommended)</td>
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

      <h2>
        Why does UPSC CSE require three signatures — and how do you prepare
        them?
      </h2>
      <p>
        UPSC requires candidates to write their signature three times on a
        single sheet of white paper, with the three signatures arranged
        vertically, one below the other. You photograph or scan this one sheet
        and upload it as a single image file. All three must be in black ink,
        cursive or running hand, and consistent with each other. The portal
        does not accept three separate files.
      </p>
      <p>
        UPSC uses all three as verification references throughout the selection
        process — at the examination hall, document verification, and the
        medical board. Signatures that look very different from each other get
        flagged. Prepare them in one sitting so the style is consistent.
      </p>
      <ul>
        <li>
          <strong>Paper:</strong> plain white A4, no lines, no watermarks.
        </li>
        <li>
          <strong>Sign three times vertically</strong> in black ink, cursive
          hand, with a small gap — roughly 4–5&nbsp;cm per signature — between
          each.
        </li>
        <li>
          <strong>Photograph flat</strong> in even overhead light. Check that
          no shadow falls across any of the three signatures.
        </li>
        <li>
          <strong>Upload the single image</strong> through the{" "}
          <Link href="/upsc-signature-resizer/">UPSC signature resizer</Link>.
          It cleans the paper background and outputs a JPG inside the
          20–100&nbsp;KB band.
        </li>
      </ul>

      <figure className="my-7 overflow-hidden rounded-xl border border-hairline">
        <Image
          src="/images/upsc-cse-ias-photo-signature-guide-2026.webp"
          alt="UPSC CSE/IAS signature sheet layout showing three 6 cm × 3 cm boxes arranged vertically on A4 paper, each containing the candidate's signature"
          width={760}
          height={760}
          className="w-full h-auto"
        />
        <figcaption className="bg-accent/30 px-4 py-2.5 text-center text-[12.5px] text-muted-foreground">
          UPSC CSE signature sheet layout: three identical signatures in 6&nbsp;cm&nbsp;×&nbsp;3&nbsp;cm boxes, written in black ink on plain A4 white paper.
        </figcaption>
      </figure>

      <h2>How does UPSC CSE compare to NDA and CDS for photo requirements?</h2>
      <p>
        All three use the same UPSC OTR portal, so the file rules are the same.
        Any differences come from cycle-specific rules in each notification:
      </p>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Requirement</th>
            <th className="py-2 pr-3 font-semibold text-ink">CSE (IAS)</th>
            <th className="py-2 pr-3 font-semibold text-ink">NDA</th>
            <th className="py-2 pr-3 font-semibold text-ink">CDS</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Photo file size</td>
            <td className="py-2 pr-3">20–200&nbsp;KB</td>
            <td className="py-2 pr-3">20–200&nbsp;KB</td>
            <td className="py-2 pr-3">20–200&nbsp;KB</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Signature file size</td>
            <td className="py-2 pr-3">20–100&nbsp;KB</td>
            <td className="py-2 pr-3">20–100&nbsp;KB</td>
            <td className="py-2 pr-3">20–100&nbsp;KB</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Fixed pixel size</td>
            <td className="py-2 pr-3">None published</td>
            <td className="py-2 pr-3">None published</td>
            <td className="py-2 pr-3">None published</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Recency rule</td>
            <td className="py-2 pr-3">Per notification</td>
            <td className="py-2 pr-3">Per notification</td>
            <td className="py-2 pr-3">Per notification</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">
              Signature count
            </td>
            <td className="py-2 pr-3">
              <strong>Three (one sheet)</strong>
            </td>
            <td className="py-2 pr-3">One</td>
            <td className="py-2 pr-3">One</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Ink colour</td>
            <td className="py-2 pr-3">Black (recommended)</td>
            <td className="py-2 pr-3">Black or blue</td>
            <td className="py-2 pr-3">Black or blue</td>
          </tr>
        </tbody>
      </table>
      <p>
        The safe habit for a cross-applicant is to take a fresh photo for each
        application rather than reuse an old file, since a notification may set
        its own recency window. For the full NDA and CDS photo guide, see the{" "}
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
          <strong>Take a fresh photo:</strong> plain white wall, formal
          attire, face filling about 75% of the frame.
        </li>
        <li>
          <strong>Resize for UPSC.</strong> Run the image through the{" "}
          <Link href="/upsc-photo-resizer/">UPSC photo resizer</Link>. It
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
          A4 sheet in black ink, cursive hand, with even spacing between each.
        </li>
        <li>
          <strong>Photograph flat</strong> in even light; no shadow should
          fall across any of the three signatures.
        </li>
        <li>
          <strong>
            Run through the{" "}
            <Link href="/upsc-signature-resizer/">
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
              a: "Yes — all three use the same UPSC OTR portal: a 20–200 KB JPG photo on a plain white background with about 75% face coverage, plus a three-signature sheet at 20–100 KB. UPSC publishes no fixed pixel size, no square requirement, and no name/date strip. Any recency window is set per notification, so read the one for your cycle.",
            },
            {
              q: "Why does UPSC CSE require three signatures?",
              a: "UPSC uses all three signatures as identity verification references throughout the selection process — at the examination hall, document verification, and the medical board. Write all three on a single plain white sheet in black ink, arranged vertically. Upload the one image file containing all three.",
            },
            {
              q: "Does UPSC require a square photo or a name-and-date strip?",
              a: "No. UPSC's instructions publish no fixed pixel dimensions and no aspect ratio, so a normal passport-style portrait is fine — there is no square-crop rule — and they do not ask for a name or date printed on the image. UPSC specifies the JPG format, the 20–200 KB size band, a plain white background, and roughly 75% face coverage.",
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
