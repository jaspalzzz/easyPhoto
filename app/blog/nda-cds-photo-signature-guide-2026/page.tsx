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
        NDA and CDS upload through the same UPSC OTR portal, so their photo and
        signature rules are identical to each other and to UPSC CSE. UPSC keeps
        it simple: it publishes file-format and file-size limits, a plain white
        background, and a face covering most of the frame — but no fixed pixel
        size, no square-crop rule, and no name-and-date strip. This guide covers
        the confirmed specs for both exams and a workflow that gets both files
        ready before the portal opens.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>
            <strong>Photo:</strong> 20–200&nbsp;KB, JPG, plain white background,
            face covering about 75% of the frame. No fixed pixel size or square
            requirement.
          </li>
          <li>
            <strong>Signature:</strong> 20–100&nbsp;KB, JPG, black or blue ink
            on white paper — no all-capitals.
          </li>
          <li>
            <strong>Before you apply:</strong> read the current notice — UPSC can
            add cycle-specific rules such as a photo-recency window.
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
        for applications. The specifications are identical for both exams and
        match UPSC CSE, since all three share the same portal. Confirm the
        figures in the specific NDA or CDS notification published by{" "}
        <a
          href="https://upsc.gov.in"
          className="text-brand underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          UPSC
        </a>{" "}
        before applying.
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
            <td className="py-2 pr-3">No fixed size published</td>
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
            <td className="py-2 pr-3">Per notification, if stated</td>
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
        Does NDA or CDS require your name and date on the photo?
      </h2>
      <p>
        No. UPSC&apos;s OTR portal instructions do not ask for a name-and-date
        strip on the photo, and they publish no fixed pixel size or aspect ratio,
        so there is no square-crop requirement either. What UPSC does specify is
        the JPG format, the 20–200&nbsp;KB size band, a plain white background,
        and a face covering about 75% of the frame.
      </p>
      <p>
        If the notification for your cycle adds a requirement — some notices set
        a photo-recency window, for instance — follow the notification. When a
        form does ask for name-and-date text, the{" "}
        <Link href="/tools/photo-with-name-date/">
          photo-with-name-date tool
        </Link>{" "}
        adds a clean strip in one step; see{" "}
        <Link href="/blog/add-name-date-on-exam-photo/">
          how to add name and date on an exam photo
        </Link>
        .
      </p>

      <h2>
        How does NDA/CDS compare to banking and SSC exam photos?
      </h2>
      <p>
        The file rules differ enough that one photo file rarely clears every
        portal. NDA and CDS accept a wider 20–200&nbsp;KB photo with no fixed
        pixel size, while banking portals such as IBPS and SBI want a portrait
        rectangle around 200&nbsp;×&nbsp;230&nbsp;px capped near 50&nbsp;KB, and
        SSC captures the photo live at the portal. Match each form&apos;s own
        spec rather than reusing a single file.
      </p>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Exam</th>
            <th className="py-2 pr-3 font-semibold text-ink">Photo shape</th>
            <th className="py-2 pr-3 font-semibold text-ink">Pixel size</th>
            <th className="py-2 pr-3 font-semibold text-ink">Max file size</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">NDA / CDS (UPSC)</td>
            <td className="py-2 pr-3">Any (portrait fine)</td>
            <td className="py-2 pr-3">None published</td>
            <td className="py-2 pr-3">200&nbsp;KB</td>
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
        . The specs are the same as UPSC CSE, which shares this portal — see the{" "}
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
        and a face covering about 75% of the frame. These apply to both NDA and
        CDS applications.
      </p>
      <ul>
        <li>
          <strong>Background:</strong> plain white only. Not off-white, cream,
          or light grey. Off-white walls are a common cause of rejection.
        </li>
        <li>
          <strong>Spectacles:</strong> if you wear glasses, check the specific
          notification — some defence notices restrict them or require the eyes
          to be clearly visible without glare.
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
        rejected. The signature file size band is 20–100&nbsp;KB, more permissive
        than SSC&apos;s 10–20&nbsp;KB range, so aggressive compression is not
        needed here.
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
          clean JPG inside the 20–100&nbsp;KB band. Nothing leaves your
          browser.
        </li>
      </ul>

      <h2>What are the most common NDA and CDS photo rejection reasons?</h2>
      <p>
        Most rejections at the UPSC portal trace back to three causes: a file
        outside the 20–200&nbsp;KB band, a non-white background, or a face too
        small in the frame. The portal returns a generic error without
        specifying which check failed, so it pays to fix all of these before
        uploading.
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
              Face too small in frame
            </td>
            <td className="py-2 pr-3">
              Recrop so the face covers about 75% of the frame, then resize with
              the{" "}
              <Link href="/upsc-photo-resizer/">UPSC photo resizer</Link>
            </td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">
              File below 20&nbsp;KB minimum
            </td>
            <td className="py-2 pr-3">
              The resizer targets the 20–200&nbsp;KB band; manually compressing
              to a very small size fails the floor check
            </td>
          </tr>
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
      <p>For the photo:</p>
      <ol>
        <li>
          <strong>Take a clear photo</strong> against a plain white wall, formal
          attire, face centred and covering about 75% of the frame.
        </li>
        <li>
          <strong>Resize for UPSC.</strong> Run the image through the{" "}
          <Link href="/upsc-photo-resizer/">UPSC photo resizer</Link>. It
          outputs a JPG on a clean white background inside the 20–200&nbsp;KB
          band.
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
          . It cleans the background and outputs a JPG in the 20–100&nbsp;KB
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
              a: "Yes. Both NDA and CDS use the same UPSC OTR portal, and it matches UPSC CSE: a 20–200 KB JPG photo on a plain white background with about 75% face coverage, and a 20–100 KB signature. UPSC publishes no fixed pixel size, no square-crop rule, and no name/date strip.",
            },
            {
              q: "Does the NDA or CDS application photo need my name and date on it?",
              a: "No. UPSC's OTR portal instructions do not ask for a name-and-date strip on the photo. UPSC specifies the JPG format, the 20–200 KB size band, a plain white background, and roughly 75% face coverage. If a particular notification adds a requirement, follow that notification.",
            },
            {
              q: "Can I wear glasses in my NDA or CDS photograph?",
              a: "It depends on the cycle — check the specific notification. Some defence notices restrict spectacles or require the eyes to be clearly visible without glare. When in doubt, a photo without glasses avoids the issue.",
            },
            {
              q: "Why won't my IBPS PO photo work for NDA?",
              a: "IBPS PO wants a portrait-rectangular photo around 200×230 px capped near 50 KB, while UPSC's NDA/CDS portal takes a 20–200 KB photo with no fixed pixel size. The size bands differ, so prepare a file to each form's own spec rather than reusing one.",
            },
            {
              q: "My NDA photo is under 20 KB — will it be accepted?",
              a: "No. The UPSC portal enforces a 20 KB minimum as well as the 200 KB ceiling. A file compressed below 20 KB is rejected for being too low-quality. Use the UPSC photo resizer, which targets the full 20–200 KB band rather than compressing to the smallest possible size.",
            },
          ]}
        />
      </div>
    </BlogPostLayout>
  );
}
