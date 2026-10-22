import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";
import { PORTAL_PRESETS } from "@/lib/portalPresets";

/*
 * Re-checked line by line against UPSC's "Instructions for Uploading the Photo &
 * Signature" (the NDA, CDS and UPSC records' source) on 15 Oct 2026: three
 * signatures in black ink at 350–500 px, and the mandatory live photo.
 */
const post = getPost("nda-cds-photo-signature-guide-2026")!;
const spec = PORTAL_PRESETS.nda;

export const metadata = pageMetadata({
  title: post.title,
  titleAbsolute: true,
  description: post.description,
  path: `/blog/${post.slug}/`,
  type: "article",
});

export default function Page() {
  return (
    <BlogPostLayout slug={post.slug} ctaHref="/exam-requirements/upsc/" ctaLabel="Resize your NDA/CDS photo">
      <p className="text-sm text-ink-soft">Last reviewed: 15 October 2026</p>
      <p>
        NDA and CDS upload through the same UPSC OTR portal, so their photo and
        signature rules are identical to each other and to UPSC CSE. The photo
        is the easy part: a JPG of 20–200&nbsp;KB on plain white, with no fixed
        pixel size, no square crop and no name-and-date strip. Two steps catch
        defence applicants out. The signature file holds your signature three
        times, and the form also takes a live photo of you that must match the
        one you upload. This guide covers both exams, checked against{" "}
        <a
          href={spec.source?.url ?? "https://upsconline.nic.in"}
          className="text-brand underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          UPSC&apos;s photo and signature instructions
        </a>
        .
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
            <strong>Signature:</strong> sign three times, one below the other,
            in black ink on plain white paper, and upload the sheet as one
            350–500 pixel JPG weighing 20–100&nbsp;KB.
          </li>
          <li>
            <strong>Live photo:</strong> the form photographs you through your
            webcam, or your phone after you scan a QR code, and compares it
            with the photo you uploaded.
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
            <td className="py-2 pr-3">350–500&nbsp;px</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Background</td>
            <td className="py-2 pr-3">Plain white</td>
            <td className="py-2 pr-3">Plain white paper, no lines</td>
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
            <td className="py-2 pr-3">Black</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Signatures in the file</td>
            <td className="py-2 pr-3">—</td>
            <td className="py-2 pr-3">Three, one below the other</td>
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

      <h2>How does the NDA and CDS live photo work?</h2>
      <p>
        Uploading a photo file is no longer the whole job. UPSC now makes every
        applicant, for every examination, capture a live photograph before the
        application can be submitted. The portal offers two ways to take it:
      </p>
      <ul>
        <li>
          <strong>On a computer:</strong> allow the site to use the webcam of the
          device you are applying on.
        </li>
        <li>
          <strong>On a phone:</strong> scan the QR code shown on the screen and
          take the picture with your mobile camera.
        </li>
      </ul>
      <p>
        Sit in good light with your whole face clearly visible. Once it is
        captured, the &ldquo;View Photo&rdquo; option shows what was saved.
        UPSC then compares this live picture with your uploaded photograph,
        and if the two don&apos;t match, the application stops there. The
        simplest protection is an uploaded photo that is recent and looks
        like you do today.
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

      <h2>What background, clothing and framing does UPSC require?</h2>
      <p>
        UPSC&apos;s instruction sheet lists what the uploaded photo must show
        and what it refuses. The same list covers NDA and CDS.
      </p>
      <ul>
        <li>
          <strong>Background:</strong> plain white, and no shadow falling across
          your face or the wall. A dark background is not accepted.
        </li>
        <li>
          <strong>Uniform:</strong> a photograph in uniform is not accepted.
          Change out of any NCC or service uniform before you take it.
        </li>
        <li>
          <strong>Glasses:</strong> dark or coloured glasses that hide the eyes
          are refused. Clear spectacles are allowed, provided the lenses
          don&apos;t reflect the light.
        </li>
        <li>
          <strong>Framing:</strong> a colour photo, face from the front, head in
          the centre, both ears visible, and the face filling three quarters of
          the picture. Keep hair off your eyes.
        </li>
        <li>
          <strong>Expression:</strong> natural, eyes open. No grin, frown or
          raised eyebrows.
        </li>
        <li>
          <strong>Unsigned:</strong> don&apos;t sign the photograph itself; the
          signature goes in its own file.
        </li>
      </ul>

      <h2>How do I prepare my signature for NDA and CDS?</h2>
      <p>
        UPSC wants your signature three times in one picture, not once. Use
        black ink and plain white paper, one signature below the other, with
        clear space between them. UPSC says a signature file outside its
        rules is rejected, so check each point before you upload:
      </p>
      <ul>
        <li>
          <strong>Exactly three:</strong> two or four signatures fail, and so
          do three written side by side.
        </li>
        <li>
          <strong>Paper:</strong> plain white with no ruled lines and no
          colour.
        </li>
        <li>
          <strong>Ink:</strong> black. Blue ink is not what UPSC asks for.
        </li>
        <li>
          <strong>Picture:</strong> lay the paper flat and shoot it in even
          light so it comes out clear, sharp and upright, not dark, blurred,
          sideways or upside down.
        </li>
        <li>
          <strong>File:</strong> one JPG named <code>{spec.sigFileName}</code>,{" "}
          sized 350–500 pixels and between 20 and 100&nbsp;KB. The{" "}
          <Link href="/exam-requirements/upsc/">UPSC signature resizer</Link>{" "}
          whitens the paper and brings the file into that range on your
          device.
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
              <Link href="/exam-requirements/upsc/">UPSC photo resizer</Link>
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
              Tinted glasses, or glare on spectacles
            </td>
            <td className="py-2 pr-3">
              Retake in clear spectacles angled away from the light, or
              without them
            </td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">
              Live photo doesn&apos;t match the upload
            </td>
            <td className="py-2 pr-3">
              Upload a recent photo of how you look now, then retake the live
              photo in good light
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
          <Link href="/exam-requirements/upsc/">UPSC photo resizer</Link>. It
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
      <p>
        Prepare the three-signature sheet the same day, using the checklist
        above. Then, on the form itself:
      </p>
      <ol>
        <li>
          <strong>Upload both files</strong> and check the preview of each.
        </li>
        <li>
          <strong>Take the live photo</strong> when the form asks, facing a
          window or lamp so your face is evenly lit.
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
              a: "Yes. Both NDA and CDS use the same UPSC OTR portal, and it matches UPSC CSE: a 20–200 KB JPG photo on a plain white background with about 75% face coverage, a live photo taken during the application, and one 350–500 pixel signature JPG of 20–100 KB holding three signatures. The photo has no fixed pixel size or square-crop rule.",
            },
            {
              q: "Does the NDA or CDS application photo need my name and date on it?",
              a: "No. UPSC's OTR portal instructions do not ask for a name-and-date strip on the photo. UPSC specifies the JPG format, the 20–200 KB size band, a plain white background, and roughly 75% face coverage. If a particular notification adds a requirement, follow that notification.",
            },
            {
              q: "Can I wear glasses in my NDA or CDS photograph?",
              a: "Clear spectacles are allowed if the lenses show no glare. UPSC refuses dark or coloured glasses that hide your eyes, and a photo in uniform. If you can't get rid of the reflection, take the photo without them.",
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
