import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("indian-government-id-photo-requirements")!;

const FAQ_ITEMS = [
  {
    q: "Is the photo size the same for all Indian government IDs?",
    a: "No. The recorded limits differ between voter ID, PAN and driving-licence workflows, and their pixel dimensions can differ too. Prepare an export for the selected portal rather than assuming one file fits each workflow. Aadhaar is different: its photo is captured in person at an Aadhaar Seva Kendra rather than uploaded online.",
  },
  {
    q: "Which Indian government portal has the strictest photo size limit?",
    a: "Among the cited upload workflows, Sarathi publishes a 10–20 KB photo band, and the Protean PAN route also stops at 20 KB. Voter ID sits at the other end, allowing files up to 2 MB. File size is only one requirement, so verify the selected portal.",
  },
  {
    q: "What file format do Indian government ID applications need?",
    a: "JPG (JPEG) for all three upload portals: PAN and Sarathi state it in their own instructions, and the Voter ID portal's photo field accepts .jpg and .jpeg. Aadhaar photos are captured at a centre.",
  },
  {
    q: "Can I use the same photo for my PAN card, voter ID and driving licence?",
    a: "Use one clear source photo if convenient, but create a separate export for each workflow. The recorded crop, dimensions and file-size limits are not identical; for example, UTIITSL asks for a square PAN photo. Aadhaar is not an upload workflow because its photo is taken at a centre.",
  },
  {
    q: "Why do government ID photos get rejected online?",
    a: "Common measurable upload problems include a file outside the listed KB range, a different format or dimensions, and low image quality. Visual and workflow checks vary by portal, so use the current application instructions rather than treating one correction as a guarantee.",
  },
];

export const metadata = pageMetadata({
  title: post.title,
  titleAbsolute: true,
  description: post.description,
  path: `/blog/${post.slug}/`,
  type: "article",
});

export default function Page() {
  return (
    <BlogPostLayout
      slug={post.slug}
      faqItems={FAQ_ITEMS}
      ctaHref="/tools/resize-kb/"
      ctaLabel="Resize any ID photo to KB"
    >
      <p>
        A typical Indian adult carries four government photo IDs — a PAN card, a
        voter ID (EPIC), an Aadhaar, and a driving licence. Every one of them is
        applied for or updated on a different government portal, and here is the
        practical complication is that the recorded requirements differ by
        workflow. The KB limit, pixel dimensions and crop shape are not uniform,
        so prepare the output for the portal you are using.
      </p>

      <p>
        This guide compares the recorded photo requirements for these Indian
        government-ID workflows and explains how to prepare separate outputs in
        your browser without uploading the image.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">
          Quick answer — start with one clear source photo
        </p>
        <p className="!mt-2 text-[15px]">
          Prepare a recent <strong>colour JPEG</strong> on a{" "}
          <strong>plain white background</strong>, roughly{" "}
          <strong>200×250&nbsp;px</strong> portrait, compressed to{" "}
          <strong>under 30&nbsp;KB</strong> as a starting export. Then match the crop,
          dimensions and live instructions for the <strong>voter ID, PAN or
          driving-licence</strong> workflow you are using. UTIITSL&apos;s PAN photo is a
          square 213×213&nbsp;px. Aadhaar is different — its photo
          is captured in person at a centre, not uploaded (see below).
        </p>
      </div>

      <h2>Recorded Indian government ID photo specs (2026)</h2>

      <p>
        These are the requirements recorded for the listed application or update
        workflows. Check the named portal for the current instructions. The KB
        limit is listed first for comparison. Note
        that <strong>Aadhaar</strong> is different from the rest — its photo is
        taken in person at an Aadhaar Seva Kendra, not uploaded online.
      </p>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Document</th>
            <th className="py-2 pr-4 font-semibold text-ink">Portal</th>
            <th className="py-2 pr-4 font-semibold text-ink">Max file size</th>
            <th className="py-2 pr-4 font-semibold text-ink">Pixel size</th>
            <th className="py-2 font-semibold text-ink">Format</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["Voter ID (Form 6)", "voters.eci.gov.in", "2 MB", "None set; print is 4.5×3.5 cm", "JPG / JPEG"],
            ["PAN (NSDL / Protean)", "onlineservices.proteantech.in", "20 KB", "197×276 px (approx.)", "JPEG"],
            ["PAN (UTIITSL)", "myutiitsl.com", "Under 30 KB", "213×213 px (square)", "JPEG"],
            ["Driving Licence", "sarathi.parivahan.gov.in", "20 KB", "420×525 px preferred", "JPEG"],
            ["Aadhaar (photo)", "Aadhaar Seva Kendra — in person", "No online upload", "Captured at centre", "—"],
          ].map(([doc, portal, kb, px, fmt]) => (
            <tr key={doc} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{doc}</td>
              <td className="py-2 pr-4 text-[14px]">{portal}</td>
              <td className="py-2 pr-4">{kb}</td>
              <td className="py-2 pr-4">{px}</td>
              <td className="py-2">{fmt}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        The listed portals generally call for the same <em>kind</em> of photo — a recent, front-facing
        colour headshot on a plain light background — but enforces it with a
        different KB cap and pixel rule. That gap between &ldquo;looks the same&rdquo;
        and &ldquo;uses the same file&rdquo; is why separate portal-specific exports are safer.
      </p>

      <h2>Why can&apos;t you use one photo for every ID?</h2>

      <p>
        Because the file-size ceilings sit far apart. Sarathi wants a licence photo of
        <strong>10 to 20&nbsp;KB</strong>, while Voter ID allows up to
        <strong>2&nbsp;MB</strong>, a hundred times more. A sharp photo saved for
        Voter ID can easily weigh several hundred KB, so Sarathi refuses it on size
        alone. The portals validate automatically: a single
        parameter out of range triggers an immediate rejection with no human review.
      </p>

      <p>
        The practical fix is to keep one good source photo and make a separate export
        for each workflow. A single small file isn&apos;t automatically right for every
        portal either, because the crops and pixel sizes differ too.
      </p>

      <p>
        A good order of work: keep the original photo untouched, make the Voter ID file
        first (it needs the least shrinking), then make the PAN and licence files from
        the original again rather than from an already-compressed copy. Each round of
        compression costs detail, and the 20&nbsp;KB licence file is where a soft face
        shows most.
      </p>

      <div className="my-8 rounded-xl border border-hairline bg-paper p-5 text-sm leading-relaxed text-ink-soft">
        Where the Voter ID figures come from: the Election Commission&apos;s Form&nbsp;6
        notes and the photo box on its online form, read on 13 Oct 2026. The{" "}
        <Link href="/blog/voter-id-photo-requirements-2026/" className="text-brand underline">
          voter ID guide
        </Link>{" "}
        quotes both.
      </div>

      <h2>PAN card photo requirements</h2>

      <p>
        PAN is the one ID with <strong>two</strong> valid portals, and they disagree
        on the crop. Via{" "}
        <a
          href="https://tin.tin.proteantech.in/pan/InstructionDSC.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          <strong>NSDL / Protean</strong>
        </a>{" "}
        you need a colour JPEG, 3.5&nbsp;cm tall and 2.5&nbsp;cm across, set at
        200&nbsp;DPI (roughly 197 by 276 pixels) and no larger than{" "}
        <strong>20&nbsp;KB</strong>. Via{" "}
        <a
          href="https://www.myutiitsl.com/panonlineservices/scanSpecification.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          <strong>UTIITSL</strong>
        </a>{" "}
        it is a <em>square</em> 213×213&nbsp;px colour JPEG at 300&nbsp;dpi that must
        stay below <strong>30&nbsp;KB</strong>. Both pages were checked on
        31&nbsp;Oct&nbsp;2026. The square shape is the difference to watch: a
        portrait export made for Protean will not match UTIITSL.
      </p>

      <p>
        The{" "}
        <Link href="/blog/pan-card-photo-size/" className="text-brand underline">
          full PAN card photo size guide
        </Link>{" "}
        breaks down both portals, and the{" "}
        <Link href="/exam-requirements/pan/" className="text-brand underline">
          PAN photo &amp; signature spec page
        </Link>{" "}
        includes the matching signature dimensions and a resizer.
      </p>

      <h2>Voter ID (EPIC) photo requirements</h2>

      <p>
        The Election Commission&apos;s{" "}
        <a
          href="https://voters.eci.gov.in/guidelines/Form-6_en.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          ECI Form 6 guidance
        </a>{" "}
        publishes a recent good-quality unsigned colour Form&nbsp;6 photo measuring
        <strong>4.5&nbsp;cm high by 3.5&nbsp;cm wide</strong>, with a white background,
        open eyes and both face edges visible.
      </p>

      <p>
        See the{" "}
        <Link href="/blog/voter-id-photo-requirements-2026/" className="text-brand underline">
          voter ID photo requirements guide
        </Link>{" "}
        for the per-form breakdown, or the{" "}
        <Link href="/exam-requirements/voter-id/" className="text-brand underline">
          voter ID photo spec &amp; resizer
        </Link>{" "}
        to crop and save the photo.
      </p>

      <h2>Driving licence photo requirements</h2>

      <p>
        The{" "}
        <a
          href="https://sarathi.parivahan.gov.in/sarathiservice/pdf/PhotoSign.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          Sarathi photo and signature scan guide
        </a>{" "}
        publishes a colour JPG photo between <strong>10&nbsp;KB and 20&nbsp;KB</strong>,
        with 420×525&nbsp;px preferred and a light-coloured, preferably white
        background. It also publishes a 10–20&nbsp;KB, 256×64&nbsp;px preferred
        signature written in black pen on white paper. Confirm the current state and
        service screen before submitting.
      </p>

      <p>
        The{" "}
        <Link href="/blog/driving-licence-photo-size-sarathi/" className="text-brand underline">
          Sarathi driving-licence photo guide
        </Link>{" "}
        and the{" "}
        <Link href="/exam-requirements/driving-licence/" className="text-brand underline">
          driving-licence photo spec page
        </Link>{" "}
        cover the exact numbers and a one-click resizer.
      </p>

      <h2>Aadhaar photo requirements</h2>

      <p>
        Aadhaar is the exception among the four. Your Aadhaar photograph{" "}
        <strong>cannot be updated online</strong> and there is no file to prepare or
        upload for it. Because the photo is a biometric field, UIDAI requires it to
        be captured in person at an{" "}
        <a
          href="https://uidai.gov.in/en/my-aadhaar/update-aadhaar.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          Aadhaar Seva Kendra
        </a>{" "}
        (or an authorised enrolment centre), where it is taken live under controlled
        lighting and background. The{" "}
        <a
          href="https://myaadhaar.uidai.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          myAadhaar
        </a>{" "}
        portal lets you update your name, address, date of birth, gender and language
        online — but the photograph, fingerprints, iris and registered mobile number
        all need a centre visit. So no resizing or KB target applies to an Aadhaar
        photo; just book a slot and have it taken there.
      </p>

      <p>
        Before you share any Aadhaar scan or copy, read{" "}
        <Link href="/blog/how-to-mask-aadhaar-before-sharing/" className="text-brand underline">
          how to mask your Aadhaar number
        </Link>{" "}
        first — UIDAI recommends masking the first eight digits on any shared copy. If
        you need to compress an Aadhaar <em>card scan</em> to a KB limit for a document
        upload, the{" "}
        <Link href="/tools/resize-kb/" className="text-brand underline">
          compress-to-KB tool
        </Link>{" "}
        does it in your browser.
      </p>

      <h2>How to prepare one source photo for different portals</h2>

      <p>
        You can begin with one good capture and create a separate export for each
        recorded workflow. (For a focused look at just how the
        three online IDs differ, see{" "}
        <Link href="/blog/pan-vs-voter-id-vs-driving-licence-photo/" className="text-brand underline">
          PAN vs voter ID vs driving licence photo
        </Link>
        .) The steps:
      </p>

      <ol className="my-4 space-y-3 text-[15px]">
        <li>
          <strong>Background:</strong> Stand against a plain white or cream wall with
          no shadows behind you. If the wall isn&apos;t clean enough, the{" "}
          <Link href="/tools/background-removal/" className="text-brand underline">
            background removal tool
          </Link>{" "}
          swaps it for solid white on-device.
        </li>
        <li>
          <strong>Lighting &amp; pose:</strong> Face a window in soft daylight, phone
          at eye level, neutral expression, eyes open, no sunglasses or cap. Fill the
          frame with your head and top of shoulders.
        </li>
        <li>
          <strong>Crop:</strong> Crop to a portrait rectangle around 200×250&nbsp;px
          (and keep a square 213×213&nbsp;px version if you&apos;ll use UTIITSL for
          PAN).
        </li>
        <li>
          <strong>Compress:</strong> Use the{" "}
          <Link href="/tools/resize-kb/" className="text-brand underline">
            compress-to-KB tool
          </Link>{" "}
          to bring the JPEG under 30&nbsp;KB — that single file then clears the 40&nbsp;KB,
          50&nbsp;KB and 200&nbsp;KB caps in one go.
        </li>
        <li>
          <strong>Check before you upload:</strong> Run it through the{" "}
          <Link href="/tools/compliance-checker/" className="text-brand underline">
            photo validator
          </Link>{" "}
          to confirm size, format and dimensions before the portal does.
        </li>
      </ol>

      <h2>Common upload issues across the listed portals</h2>

      <p>
        Portal checks differ, but these measurable file issues are useful to review
        before uploading:
      </p>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Rejection reason</th>
            <th className="py-2 font-semibold text-ink">Fix</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["File over the KB limit", "Compress to the range listed by the selected portal"],
            ["PNG, PDF, WEBP or HEIC file", "Convert to JPEG before uploading"],
            ["Black-and-white photo", "Use a colour photo — even a colour scan of a B&W print is rejected"],
            ["Dark or patterned background", "Shoot against plain white or use background removal"],
            ["Wrong crop shape (portrait vs square)", "Match the portal — UTIITSL PAN needs a square 213×213 px crop"],
            ["Blurry or low-resolution image", "Take in daylight; keep at least the portal's pixel minimum"],
            ["Face too small in frame", "Crop tightly so the face fills 60–70% of the frame"],
          ].map(([reason, fix]) => (
            <tr key={reason} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{reason}</td>
              <td className="py-2">{fix}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        Related reading: the{" "}
        <Link href="/blog/indian-passport-photo-requirements/" className="text-brand underline">
          Indian passport photo requirements
        </Link>{" "}
        guide covers the separate MEA / Passport Seva spec, and{" "}
        <Link href="/blog/how-to-compress-photo-to-50kb/" className="text-brand underline">
          how to compress a photo to 50&nbsp;KB
        </Link>{" "}
        walks through the compression step in detail.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
