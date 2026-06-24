import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("nda-cds-photo-signature-guide-2026")!;

export const metadata = pageMetadata({
  title: post.title,
  titleAbsolute: true,
  description: post.description,
  path: `/blog/${post.slug}/`,
  type: "article",
});

export default function Page() {
  return (
    <BlogPostLayout slug={post.slug} ctaHref="/upsc-photo-resizer/" ctaLabel="Resize your NDA/CDS photo">
      <p>
        NDA and CDS have a requirement no other Indian competitive exam does:
        your full name and the date you took the photo must be printed on the
        image itself. Get that wrong and even a perfectly sized, correctly
        formatted photo is grounds for rejection. The other complication is the
        photo shape — both exams require a square minimum crop, not the portrait
        rectangle IBPS and SBI candidates prepare. This guide covers the
        confirmed specs for both exams (they&apos;re identical), exactly how to
        add the name and date, and a workflow that gets both files ready before
        the portal opens.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>
            <strong>Photo:</strong> 20–300&nbsp;KB, JPG, minimum
            350&nbsp;×&nbsp;350&nbsp;px square, plain white background, taken
            within 6 months.
          </li>
          <li>
            <strong>Required:</strong> your full name and the date of the
            photograph must be printed as text at the bottom of the image:
            mandatory for both NDA and CDS.
          </li>
          <li>
            <strong>Signature:</strong> 20–300&nbsp;KB, JPG, black or blue ink
            on white paper — no all-capitals.
          </li>
          <li>
            Both upload through the same UPSC OTR portal at{" "}
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

      <h2>What are the photo and signature specs for NDA and CDS?</h2>
      <p>
        Both NDA and CDS use the same{" "}
        <a
          href="https://upsconline.nic.in"
          className="text-brand underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          UPSC OTR portal
        </a>{" "}
        for applications. The specifications are identical for both exams, as
        confirmed in NDA NA II 2026 (Notice&nbsp;10/2026) and CDS II 2026
        (Notice&nbsp;11/2026), both released by{" "}
        <a
          href="https://upsc.gov.in"
          className="text-brand underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          UPSC
        </a>{" "}
        on 20&nbsp;May 2026. Both exams are scheduled for{" "}
        <strong>13&nbsp;September 2026</strong>.
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
            <td className="py-2 pr-3">Required at bottom</td>
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
            <td className="py-2 pr-3 font-medium text-ink">Ink colour</td>
            <td className="py-2 pr-3">—</td>
            <td className="py-2 pr-3">Black or blue</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">All-capitals</td>
            <td className="py-2 pr-3">—</td>
            <td className="py-2 pr-3">Rejected</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Recency</td>
            <td className="py-2 pr-3">Within 6 months</td>
            <td className="py-2 pr-3">—</td>
          </tr>
        </tbody>
      </table>
      <p>
        Always confirm the current cycle&apos;s exact figures in your
        notification PDF at{" "}
        <a
          href="https://upsc.gov.in"
          className="text-brand underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          upsc.gov.in
        </a>{" "}
        before applying. For a side-by-side comparison of all major exam
        specs, see the{" "}
        <Link href="/blog/exam-photo-signature-size-guide/">
          photo and signature size guide for all exams
        </Link>
        .
      </p>

      <h2>
        Does NDA require your name and date on the photo — and how do you add
        it?
      </h2>
      <p>
        Yes — for both NDA and CDS. Your full name (as it appears on the exam
        notification) and the date the photograph was taken must appear as
        printed text at the bottom of the image. This is added digitally to the
        photo file before uploading. It is not handwritten on the back of a
        physical print.
      </p>
      <p>
        The text goes in a strip at the bottom of the image frame, inside the
        photo itself. Use the{" "}
        <Link href="/tools/photo-with-name-date/">
          photo-with-name-date tool
        </Link>{" "}
        — it adds a clean, correctly formatted text strip in one step. The
        format UPSC expects is your full name on the first line and the date in
        DD/MM/YYYY format on the second line. Do this step before running the
        image through the resizer, so the output already contains the text at
        the correct scale.
      </p>
      <p>
        One detail that catches CDS candidates specifically: for CDS, the photo
        date must be within 10 days of the CDS application start date. This is
        stricter than NDA&apos;s general 6-month recency rule. A photo taken
        for NDA&nbsp;1 in January may fail the CDS&nbsp;2 application in May,
        even though it is less than 6 months old. Check the date on your photo
        file before uploading. For the full step-by-step guide on adding the
        text, see{" "}
        <Link href="/blog/add-name-date-on-exam-photo/">
          how to add name and date on an exam photo
        </Link>
        .
      </p>

      <h2>
        Why is the NDA/CDS photo square — and why your banking exam photo
        won&apos;t work?
      </h2>
      <p>
        The UPSC OTR portal requires a minimum square crop: 350&nbsp;×&nbsp;350&nbsp;px.
        Most banking exam portals, including IBPS and SBI, require a portrait
        rectangle — typically 200&nbsp;×&nbsp;230&nbsp;px. These are not
        interchangeable. Uploading the IBPS portrait crop to the UPSC portal
        fails the pixel check immediately.
      </p>
      <p>
        This catches more candidates than you&apos;d expect. Someone applying
        to both IBPS PO and NDA&nbsp;II in the same window often prepares one
        photo file, uses it for the banking form, then uploads the same file to
        the UPSC portal, and gets an error. The fix is the{" "}
        <Link href="/upsc-photo-resizer/">UPSC photo resizer</Link>, which
        outputs a square crop at the correct dimensions. In practice,
        &ldquo;square minimum&rdquo; means the face centred with equal space on
        the left and right: a slightly wider field of view than a portrait
        passport crop.
      </p>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Exam</th>
            <th className="py-2 pr-3 font-semibold text-ink">Photo shape</th>
            <th className="py-2 pr-3 font-semibold text-ink">Min dimensions</th>
            <th className="py-2 pr-3 font-semibold text-ink">Max file size</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">NDA / CDS (UPSC)</td>
            <td className="py-2 pr-3">Square</td>
            <td className="py-2 pr-3">350&nbsp;×&nbsp;350&nbsp;px</td>
            <td className="py-2 pr-3">300&nbsp;KB</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">IBPS PO / SBI PO</td>
            <td className="py-2 pr-3">Portrait</td>
            <td className="py-2 pr-3">~200&nbsp;×&nbsp;230&nbsp;px</td>
            <td className="py-2 pr-3">50&nbsp;KB</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">SSC CGL / CHSL</td>
            <td className="py-2 pr-3">Live capture</td>
            <td className="py-2 pr-3">Portal-controlled</td>
            <td className="py-2 pr-3">50&nbsp;KB (portal resizes)</td>
          </tr>
        </tbody>
      </table>
      <p>
        For the IBPS PO checklist, see the{" "}
        <Link href="/blog/ibps-po-2026-photo-signature-checklist/">
          IBPS PO 2026 photo &amp; signature checklist
        </Link>
        . Applying to UPSC CSE as well? Note that CSE adds a live webcam
        matching step and a 10-day recency rule not present in NDA — see the{" "}
        <Link href="/blog/upsc-cse-ias-photo-signature-guide-2026/">
          UPSC CSE / IAS photo and signature guide
        </Link>
        . For SSC&apos;s live-capture system, see the{" "}
        <Link href="/blog/ssc-cgl-chsl-photo-signature-guide-2026/">
          SSC CGL / CHSL photo and signature guide
        </Link>
        .
      </p>

      <h2>What background, dress code, and framing does UPSC require?</h2>
      <p>
        The UPSC OTR portal specifies a plain white background, formal attire,
        face covering at least 75% of the frame, and no spectacles. These rules
        apply to both NDA and CDS applications.
      </p>
      <ul>
        <li>
          <strong>Background:</strong> plain white only. Not off-white, cream,
          or light grey. The portal validator checks the pixel distribution
          behind the face — off-white walls are a common cause of rejection.
        </li>
        <li>
          <strong>Spectacles:</strong> banned, including prescription glasses.
          UPSC updated its guidelines for defence exam photographs and permits
          no exceptions other than a specific medical certificate mentioned in
          the notification.
        </li>
        <li>
          <strong>Headgear:</strong> allowed only for religious reasons (turban,
          hijab) if worn consistently in your identity documents. Otherwise,
          remove it.
        </li>
        <li>
          <strong>Framing:</strong> head and shoulders, face at least 75% of
          the frame. Don&apos;t stand too far from the camera — closer than a
          standard passport portrait.
        </li>
        <li>
          <strong>Attire:</strong> formal. A dark, solid-colour shirt reads
          cleanly against a white background. Avoid white tops; shoulder edges
          blur into the background.
        </li>
        <li>
          <strong>Expression:</strong> neutral, mouth closed, both eyes fully
          open, looking directly at the camera.
        </li>
      </ul>

      <h2>How do I prepare my signature for NDA and CDS?</h2>
      <p>
        Sign on plain white A4 paper in black or blue ink — black is strongly
        preferred. Cursive or running hand only; all-capitals signatures are
        rejected. The file size band is 20–300&nbsp;KB, which is far more
        permissive than SSC&apos;s 10–20&nbsp;KB range, so aggressive
        compression is not needed here.
      </p>
      <ul>
        <li>
          <strong>Paper:</strong> plain white A4, no lines. Lined or coloured
          notepaper makes the background hard to clean to true white.
        </li>
        <li>
          <strong>Ink:</strong> black ballpoint strongly preferred; blue
          accepted. Gel pens are fine at this file size.
        </li>
        <li>
          <strong>Style:</strong> cursive or connected running hand. If you
          normally sign in block capitals, practise a simple flowing version.
          The portal flags all-capitals patterns.
        </li>
        <li>
          <strong>Photography:</strong> lay the paper flat, hold your phone
          directly above it, even light, no shadows across the signature.
        </li>
        <li>
          <strong>Resize and clean:</strong> run the image through the{" "}
          <Link href="/upsc-signature-resizer/">UPSC signature resizer</Link>.
          It removes the paper background, trims whitespace, and outputs a
          clean JPG inside the 20–300&nbsp;KB band. Nothing leaves your
          browser.
        </li>
      </ul>

      <h2>What are the most common NDA and CDS photo rejection reasons?</h2>
      <p>
        Most rejections at the UPSC portal trace back to four causes: missing
        name and date text, a portrait crop instead of a square, a file below
        the 20&nbsp;KB minimum, and a non-white background. The portal returns
        a generic error without specifying which check failed, so it pays to
        fix all of these before uploading.
      </p>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Rejection cause</th>
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
              Portrait crop (e.g., 200&nbsp;×&nbsp;230&nbsp;px)
            </td>
            <td className="py-2 pr-3">
              Use the{" "}
              <Link href="/upsc-photo-resizer/">UPSC photo resizer</Link> —
              outputs a square crop at 350&nbsp;px or larger
            </td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">
              File below 20&nbsp;KB minimum
            </td>
            <td className="py-2 pr-3">
              The resizer targets the 20–300&nbsp;KB band; manually compressing
              to a very small size fails the floor check
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
              Non-white background
            </td>
            <td className="py-2 pr-3">
              Use the white background tool first, then resize
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
              PNG or HEIC format
            </td>
            <td className="py-2 pr-3">
              The resizer accepts HEIC (iPhone format) and outputs JPG
              automatically
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
        How to prepare your NDA and CDS photo and signature — complete workflow
      </h2>
      <p>
        For the photo, do these steps in order: name and date first, resize
        second, so the text appears at the correct scale in the final file:
      </p>
      <ol>
        <li>
          <strong>Take a clear photo</strong> against a plain white wall, no
          glasses, formal attire, face centred and filling most of the frame.
        </li>
        <li>
          <strong>Add name and date.</strong> Open the{" "}
          <Link href="/tools/photo-with-name-date/">
            photo-with-name-date tool
          </Link>
          , enter your full name and the date in DD/MM/YYYY format. Download
          the result.
        </li>
        <li>
          <strong>Resize for UPSC.</strong> Run the downloaded image through
          the{" "}
          <Link href="/upsc-photo-resizer/">UPSC photo resizer</Link>. It
          outputs a square JPG at 350&nbsp;px or larger, inside the
          20–300&nbsp;KB band.
        </li>
        <li>
          <strong>
            Save as <code>photo.jpg</code>.
          </strong>{" "}
          The UPSC portal expects this exact filename — rename the file before
          the upload session.
        </li>
      </ol>
      <p>For the signature, prepare offline before the application window opens:</p>
      <ol>
        <li>
          <strong>Sign on white A4 paper</strong> in black ink, cursive hand.
        </li>
        <li>
          <strong>Photograph flat</strong> in even light, no shadows across
          the signature.
        </li>
        <li>
          <strong>
            Run through the{" "}
            <Link href="/upsc-signature-resizer/">UPSC signature resizer</Link>
          </strong>
          . It cleans the background and outputs a JPG in the 20–300&nbsp;KB
          band.
        </li>
      </ol>
      <p>
        For UPSC-specific requirement details and links to the official
        notification PDFs, see the{" "}
        <Link href="/exam-requirements/">exam requirements directory</Link>.
      </p>

      <div className="mt-12">
        <Faq
          items={[
            {
              q: "Is the NDA photo size the same as the CDS photo size?",
              a: "Yes. Both NDA and CDS use the same UPSC OTR portal with identical specifications: 20–300 KB, JPG, minimum 350×350 px, plain white background, name and date printed at the bottom. There is no difference between the two exams' photo or signature requirements.",
            },
            {
              q: "Does the NDA application photo need my name and date on it?",
              a: "Yes, and it is mandatory — not optional. Your full name and the date the photograph was taken must appear as printed text at the bottom of the image file. Add it using the photo-with-name-date tool before uploading. For CDS specifically, the photo date must also be within 10 days of the application start date.",
            },
            {
              q: "Can I wear glasses in my NDA or CDS photograph?",
              a: "No. UPSC requires spectacles to be removed for NDA and CDS application photos. Even prescription glasses are not permitted — the only exception is a medical certificate specifically mentioned in the notification. Retake the photo without glasses.",
            },
            {
              q: "Why won't my IBPS PO photo work for NDA?",
              a: "IBPS PO requires a portrait-rectangular photo around 200×230 px. NDA requires a square-minimum photo at 350×350 px. Uploading the IBPS portrait crop to the UPSC portal fails the pixel check. Use the UPSC photo resizer, which applies the correct square crop automatically.",
            },
            {
              q: "My NDA photo is under 20 KB — will it be accepted?",
              a: "No. The UPSC portal enforces a 20 KB minimum as well as the 300 KB ceiling. A file compressed below 20 KB is rejected for being too low-quality. Use the UPSC photo resizer, which targets the full 20–300 KB band rather than compressing to the smallest possible size.",
            },
          ]}
        />
      </div>
    </BlogPostLayout>
  );
}
