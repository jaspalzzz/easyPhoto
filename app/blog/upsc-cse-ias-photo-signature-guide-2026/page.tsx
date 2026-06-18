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
    <BlogPostLayout slug={post.slug}>
      <p>
        UPSC CSE 2026 added two requirements that no previous cycle had: a
        strict 10-day recency rule (your photo must have been taken within 10
        days of the application window opening) and a live webcam matching step
        where the portal captures your face during form fill and checks it
        against the uploaded file. CSE 2026 prelims took place on
        24&nbsp;May 2026; Mains begins 21&nbsp;August 2026. Whether
        you&apos;re preparing a Mains Detailed Application Form or planning for
        the 2027 cycle, here are the confirmed specs and how to get both files
        right in one pass.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>
            <strong>Photo:</strong> 20–300&nbsp;KB, JPG, minimum
            350&nbsp;×&nbsp;350&nbsp;px square, plain white background, taken
            within 10 days of the application window opening.
          </li>
          <li>
            <strong>Required:</strong> your full name and date of photograph
            printed at the bottom of the image — mandatory.
          </li>
          <li>
            <strong>Signature:</strong> sign your name{" "}
            <em>three times vertically</em> on a single plain white sheet in
            black ink — one file upload, three signatures.
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
        and the 2026 notification released by{" "}
        <a
          href="https://upsc.gov.in"
          className="text-brand underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          UPSC
        </a>{" "}
        on 4&nbsp;February 2026 (933 vacancies; prelims 24&nbsp;May, Mains
        from 21&nbsp;August 2026).
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
              <strong>20–300&nbsp;KB</strong>
            </td>
            <td className="py-2 pr-3">
              <strong>20–300&nbsp;KB</strong>
            </td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Min dimensions</td>
            <td className="py-2 pr-3">
              <strong>350&nbsp;×&nbsp;350&nbsp;px (square)</strong>
            </td>
            <td className="py-2 pr-3">350&nbsp;×&nbsp;350&nbsp;px</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Max dimensions</td>
            <td className="py-2 pr-3">1,000&nbsp;×&nbsp;1,000&nbsp;px</td>
            <td className="py-2 pr-3">1,000&nbsp;×&nbsp;1,000&nbsp;px</td>
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
            <td className="py-2 pr-3">Mandatory at bottom</td>
            <td className="py-2 pr-3">—</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Face coverage</td>
            <td className="py-2 pr-3">Min 75% of frame</td>
            <td className="py-2 pr-3">—</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Spectacles</td>
            <td className="py-2 pr-3">Banned</td>
            <td className="py-2 pr-3">—</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Recency</td>
            <td className="py-2 pr-3">
              Within 10 days of application open
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
        A note on the photo ceiling: some coaching sources cite 200&nbsp;KB as
        the maximum. That figure comes from pre-OTR notifications. The UPSC OTR
        portal&apos;s own instructions specify 300&nbsp;KB, consistent with the
        NDA/CDS 2026 notifications that use the same portal. Confirm the
        figure in the official notification PDF at{" "}
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

      <h2>What is the UPSC CSE live photo matching requirement?</h2>
      <p>
        In the 2026 application cycle, UPSC introduced a live webcam step
        during form submission. The portal activates your webcam and takes a
        live photo of you, then checks whether your face matches the photo
        uploaded to your OTR profile. If the system flags a mismatch —
        different hairstyle, a photo from a previous cycle, or poor lighting
        during webcam capture — the submission is flagged.
      </p>
      <p>
        What this means in practice: you cannot use a photo that looks
        different from how you look today. The uploaded photo must be fresh
        enough to match the face the webcam will see during form fill. Set up
        your white background and lighting <em>before</em> opening the form
        session, not after. Once the webcam check starts, there&apos;s no easy
        way to pause it.
      </p>
      <p>
        The 10-day recency rule is the formal expression of this: your photo
        must have been taken within 10 days of the application window opening.
        For CSE 2026, that meant on or after 25&nbsp;January 2026 (10 days
        before 4&nbsp;February). A compliant NDA photo from December 2025
        would fail this check even though it was under 6 months old.
      </p>

      <h2>Does UPSC CSE require name and date on the photo?</h2>
      <p>
        Yes — mandatory for CSE, just as for NDA and CDS. Your full name and
        the date the photograph was taken must appear as printed text at the
        bottom of the image file. This is added digitally before uploading; it
        is not handwritten on the back of a physical print.
      </p>
      <p>
        Use the{" "}
        <Link href="/tools/photo-with-name-date/">
          photo-with-name-date tool
        </Link>{" "}
        to add a clean strip at the bottom — it accepts the photo, takes your
        name and the date in DD/MM/YYYY format, and outputs a correctly
        formatted JPG. Do this step before running the image through the{" "}
        <Link href="/upsc-photo-resizer/">UPSC photo resizer</Link>, so the
        text is already in the file when dimensions and KB are finalised. For
        the full step-by-step guide, see{" "}
        <Link href="/blog/add-name-date-on-exam-photo/">
          how to add name and date on an exam photo
        </Link>
        .
      </p>

      <h2>
        Why does UPSC CSE require three signatures — and how do you prepare
        them?
      </h2>
      <p>
        UPSC requires candidates to write their signature three times on a
        single sheet of white paper, with the three signatures arranged
        vertically — one below the other. You photograph or scan this one sheet
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
          20–300&nbsp;KB band.
        </li>
      </ul>

      <h2>How does UPSC CSE compare to NDA and CDS for photo requirements?</h2>
      <p>
        All three use the same UPSC OTR portal, so the core specs are
        identical. The differences show up in recency and verification:
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
            <td className="py-2 pr-3 font-medium text-ink">File size</td>
            <td className="py-2 pr-3">20–300&nbsp;KB</td>
            <td className="py-2 pr-3">20–300&nbsp;KB</td>
            <td className="py-2 pr-3">20–300&nbsp;KB</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Photo shape</td>
            <td className="py-2 pr-3">Square (350&nbsp;×&nbsp;350 min)</td>
            <td className="py-2 pr-3">Square (350&nbsp;×&nbsp;350 min)</td>
            <td className="py-2 pr-3">Square (350&nbsp;×&nbsp;350 min)</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">
              Name&nbsp;+&nbsp;date on photo
            </td>
            <td className="py-2 pr-3">Mandatory</td>
            <td className="py-2 pr-3">Mandatory</td>
            <td className="py-2 pr-3">Mandatory</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Recency rule</td>
            <td className="py-2 pr-3">
              <strong>10 days from application open</strong>
            </td>
            <td className="py-2 pr-3">Within 6 months</td>
            <td className="py-2 pr-3">10 days from application open</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">
              Live webcam matching
            </td>
            <td className="py-2 pr-3">
              <strong>Yes (2026 new)</strong>
            </td>
            <td className="py-2 pr-3">Not confirmed</td>
            <td className="py-2 pr-3">Not confirmed</td>
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
        For a cross-applicant, the practical difference is recency. An NDA
        photo taken six months ago passes NDA but fails CSE&apos;s 10-day
        rule. Take a fresh photo specifically for CSE. For the full NDA and CDS
        photo guide, see the{" "}
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
              Name and date missing
            </td>
            <td className="py-2 pr-3">
              Add using the{" "}
              <Link href="/tools/photo-with-name-date/">
                photo-with-name-date tool
              </Link>{" "}
              before sizing — do this step first
            </td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">
              Photo older than 10 days
            </td>
            <td className="py-2 pr-3">
              Take a fresh photo — do not reuse a photo from a previous exam
              cycle or a months-old portfolio shot
            </td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">
              Portrait crop (wrong dimensions)
            </td>
            <td className="py-2 pr-3">
              Use the{" "}
              <Link href="/upsc-photo-resizer/">UPSC photo resizer</Link> —
              outputs a correct square crop at 350&nbsp;px or larger
            </td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">
              File above 300&nbsp;KB
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
              The resizer targets the full 20–300&nbsp;KB band; compressing
              to a tiny size fails the floor check
            </td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">
              Non-white background
            </td>
            <td className="py-2 pr-3">
              Use the white background tool first, then add name/date, then
              resize
            </td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">
              Spectacles visible
            </td>
            <td className="py-2 pr-3">
              Retake without glasses — prescription lenses are not exempt
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
          <strong>Take a fresh photo</strong> within 10 days of the
          application window opening — plain white wall, no glasses, formal
          attire, face filling at least 75% of the frame.
        </li>
        <li>
          <strong>Add name and date.</strong> Open the{" "}
          <Link href="/tools/photo-with-name-date/">
            photo-with-name-date tool
          </Link>
          , enter your name and the photo date in DD/MM/YYYY format. Download
          the result.
        </li>
        <li>
          <strong>Resize for UPSC.</strong> Run the image through the{" "}
          <Link href="/upsc-photo-resizer/">UPSC photo resizer</Link>. It
          outputs a square JPG at 350&nbsp;px or larger, inside the
          20–300&nbsp;KB band.
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
          <strong>Photograph flat</strong> in even light — no shadow should
          fall across any of the three signatures.
        </li>
        <li>
          <strong>
            Run through the{" "}
            <Link href="/upsc-signature-resizer/">
              UPSC signature resizer
            </Link>
          </strong>
          . It cleans the background and compresses to the 20–300&nbsp;KB
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
              a: "Yes — all three use the same UPSC OTR portal: 20–300 KB, JPG, minimum 350×350 px square, plain white, name and date at the bottom. The key difference is recency: CSE requires the photo within 10 days of the application window opening. NDA allows up to 6 months; CDS matches CSE at 10 days.",
            },
            {
              q: "Why does UPSC CSE require three signatures?",
              a: "UPSC uses all three signatures as identity verification references throughout the selection process — at the examination hall, document verification, and the medical board. Write all three on a single plain white sheet in black ink, arranged vertically. Upload the one image file containing all three.",
            },
            {
              q: "What is the 10-day recency rule for UPSC CSE photos?",
              a: "Your uploaded photo must have been taken within 10 days of the date the application window opened. For CSE 2026 (window opened 4 February 2026), the photo date had to be on or after 25 January 2026. A photo from a previous exam cycle fails this check even if it looks recent.",
            },
            {
              q: "Can I reuse my Prelims photo for the UPSC Mains DAF?",
              a: "The Mains Detailed Application Form requires a photo that matches your Prelims application photo and your current appearance. If your appearance has changed since the Prelims application, take a fresh photo. Confirm the exact DAF photo requirements in the official UPSC Mains notification at upsc.gov.in.",
            },
            {
              q: "My UPSC CSE photo is 220 KB — will it be accepted?",
              a: "Yes, 220 KB falls inside the 20–300 KB band. Some older coaching-site guides cite 200 KB as the ceiling — that figure comes from pre-OTR notifications. The current UPSC OTR portal standard is 300 KB. Always confirm in the official notification before submitting.",
            },
          ]}
        />
      </div>
    </BlogPostLayout>
  );
}
