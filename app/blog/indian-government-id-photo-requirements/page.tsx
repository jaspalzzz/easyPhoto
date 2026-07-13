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
    a: "Among the limits recorded here, UTIITSL for PAN cards has a 30 KB ceiling and the Sarathi driving-licence preset has a 40 KB ceiling. File size is only one requirement; crop, dimensions and workflow can differ, so prepare and verify a separate export for the selected portal.",
  },
  {
    q: "What file format do Indian government ID applications need?",
    a: "The voter ID, PAN and Sarathi presets recorded here list JPEG/JPG. If your phone saves another format, convert the image to the format named by the selected portal and confirm its current instructions. Aadhaar photos are captured at a centre, so there is no photo file to upload for that workflow.",
  },
  {
    q: "Can I use the same photo for my PAN card, voter ID and driving licence?",
    a: "Use one clear source photo if convenient, but create a separate export for each workflow. The recorded crop, dimensions and file-size limits are not identical; for example, the UTIITSL PAN preset uses a square crop. Aadhaar is not an upload workflow because its photo is taken at a centre.",
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
          driving-licence</strong> workflow you are using. UTIITSL PAN uses a square
          213×213&nbsp;px crop in the recorded preset. Aadhaar is different — its photo
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
            ["Voter ID (EPIC)", "voters.eci.gov.in", "200 KB", "≥200×240 px", "JPEG"],
            ["PAN (NSDL / Protean)", "onlineservices.proteantech.in", "50 KB", "197×276 px", "JPEG"],
            ["PAN (UTIITSL)", "myutiitsl.com", "30 KB", "213×213 px (square)", "JPEG"],
            ["Driving Licence", "sarathi.parivahan.gov.in", "40 KB", "≥200×230 px", "JPEG"],
            ["Aadhaar (photo)", "Aadhaar Seva Kendra — in person", "No online upload", "Captured at centre", "—"],
          ].map(([doc, portal, kb, px, fmt]) => (
            <tr key={doc} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{doc}</td>
              <td className="py-2 pr-4 text-[13px]">{portal}</td>
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
        Because the file-size ceilings sit far apart. The driving-licence portal
        (Sarathi) accepts <strong>40&nbsp;KB</strong>; the voter ID portal accepts
        up to <strong>200&nbsp;KB</strong> — five times larger. A photo saved for
        the voter ID form is usually 120–180&nbsp;KB, so uploading it to Sarathi
        fails on size alone. The portals validate automatically: a single parameter
        out of range triggers an immediate rejection with no human review.
      </p>

      <p>
        The practical fix is to work to the <strong>strictest</strong> spec, not the
        loosest. Compress your photo to under 30&nbsp;KB and it slides under every
        cap on the table — 40&nbsp;KB, 50&nbsp;KB and 200&nbsp;KB alike — while
        staying sharp enough to meet each portal&apos;s pixel minimum.
      </p>

      {/* CHART: KB limit comparison across the online-upload portals (Aadhaar
          excluded — its photo is captured at a centre, not uploaded). */}
      <figure className="my-8">
        <svg
          viewBox="0 0 560 254"
          style={{ maxWidth: "100%", height: "auto", fontFamily: "'Inter', system-ui, sans-serif" }}
          role="img"
          aria-label="Bar chart comparing maximum photo file size across Indian government ID online upload portals: UTIITSL PAN 30 KB, Sarathi driving licence 40 KB, NSDL PAN 50 KB, voter ID 200 KB"
        >
          <title>Maximum photo file size by Indian government ID online upload portal</title>
          <desc>
            UTIITSL (PAN) has the tightest limit at 30 KB, then Sarathi (driving
            licence) at 40 KB, NSDL (PAN) at 50 KB, and the NVSP voter ID portal at
            200 KB. Compressing to under 30 KB clears them all. Aadhaar is not shown
            because its photo is captured at a centre, not uploaded. Source:
            respective government portals, 2026.
          </desc>

          {(() => {
            const data = [
              ["PAN — UTIITSL", 30, "#f97316"],
              ["Driving Licence", 40, "#38bdf8"],
              ["PAN — NSDL", 50, "#a78bfa"],
              ["Voter ID (EPIC)", 200, "#22c55e"],
            ] as const;
            const x0 = 140;
            const max = 200;
            const barW = 380;
            return data.map(([label, kb, color], i) => {
              const y = 30 + i * 46;
              const w = (kb / max) * barW;
              return (
                <g key={label}>
                  <text x={x0 - 10} y={y + 15} textAnchor="end" fontSize="12" fill="currentColor" opacity="0.8">
                    {label}
                  </text>
                  <rect x={x0} y={y} width={w} height="22" rx="3" fill={color} />
                  <text x={x0 + w + 6} y={y + 16} fontSize="11" fill="currentColor" opacity="0.7" fontWeight="600">
                    {kb} KB
                  </text>
                </g>
              );
            });
          })()}

          <text x="280" y="244" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.35">
            Source: NVSP, NSDL, UTIITSL &amp; Sarathi portals (2026)
          </text>
        </svg>
      </figure>

      <h2>PAN card photo requirements</h2>

      <p>
        PAN is the one ID with <strong>two</strong> valid portals, and they disagree
        on the crop. Via{" "}
        <a
          href="https://www.onlineservices.proteantech.in/paam/endUserRegisterContact.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          <strong>NSDL / Protean</strong>
        </a>{" "}
        the photo is a portrait
        197×276&nbsp;px JPEG under <strong>50&nbsp;KB</strong>. Via{" "}
        <a
          href="https://www.myutiitsl.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          <strong>UTIITSL</strong>
        </a>{" "}
        it is a <em>square</em> 213×213&nbsp;px JPEG under a
        tighter <strong>30&nbsp;KB</strong>. Both want a white background and a
        forward-facing colour headshot. The square requirement is the one people
        miss — a portrait crop is rejected by UTIITSL.
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
          href="https://voters.eci.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          NVSP portal (voters.eci.gov.in)
        </a>{" "}
        is the most forgiving on size: a colour JPEG between <strong>10&nbsp;KB and 200&nbsp;KB</strong>
        , at least 200×240&nbsp;px, on a plain white or light background. It applies to
        Form&nbsp;6 (new enrollment), Form&nbsp;6A (overseas voters) and Form&nbsp;8
        (corrections). Even though 200&nbsp;KB is generous, several state ERO portals
        tighten it to 50&nbsp;KB, so under 100&nbsp;KB is the safe target.
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
        to hit the exact KB target.
      </p>

      <h2>Driving licence photo requirements</h2>

      <p>
        The{" "}
        <a
          href="https://sarathi.parivahan.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          Sarathi portal (sarathi.parivahan.gov.in)
        </a>{" "}
        has the tightest realistic cap
        of the four everyday IDs: a colour JPEG under <strong>40&nbsp;KB</strong>, at
        least 200×230&nbsp;px, white background. It applies to a learner&apos;s
        licence, a permanent licence, and renewal. Because 40&nbsp;KB is so tight, a
        straight phone photo almost never passes without compression.
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
          <Link href="/tools/photo-validator/" className="text-brand underline">
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
