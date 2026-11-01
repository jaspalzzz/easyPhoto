import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("pan-card-photo-size")!;

const FAQ_ITEMS = [
  {
    q: "What is the photo size for a PAN card application?",
    a: "The physical size is 25×35 mm (portrait). For Protean (NSDL) upload, the photo is a colour JPEG (height 3.5 cm, width 2.5 cm) scanned at 200 DPI, which gives about 197×276 px, and at most 20 KB. For UTIITSL, it is a square colour JPEG of 213×213 px, 300 dpi, under 30 KB. Use the same printed photo for both — only the digital file differs.",
  },
  {
    q: "What is the signature size for a PAN card application?",
    a: "For Protean (NSDL): a colour JPEG (height 2 cm, width 4.5 cm) scanned at 200 DPI, which gives about 354×157 px in landscape, and at most 10 KB. For UTIITSL: a black-and-white JPEG scanned at 600 dpi, under 60 KB; UTIITSL publishes no pixel size. Sign on plain white A4 paper with a black pen and crop tightly before uploading.",
  },
  {
    q: "Why does my PAN card photo keep getting rejected?",
    a: "The most common reasons are: a file over the limit for your route (Protean allows at most 20 KB for the photo and 10 KB for the signature), the wrong shape (UTIITSL needs a square crop), a non-white background, or a black-and-white photo when colour is required. The PAN card resizer on easyPhoto prepares both files to Protean's published sizes.",
  },
  {
    q: "Can I use the same photo for NSDL and UTIITSL?",
    a: "Yes for print (both accept a 25×35 mm passport-size photo). No for digital upload — Protean's photo works out to a portrait file of about 197×276 px, while UTIITSL needs a 213×213 px square crop. You'll need to resize the same image to two different outputs depending on which portal you use.",
  },
  {
    q: "Is a mobile photo accepted for a PAN card application?",
    a: "Yes, provided it meets the spec: white or light-coloured background, frontal face, colour JPEG, and within the KB limit. Many applicants take a selfie against a white wall, crop it to the shape their portal asks for, and resize to the required KB. Avoid low-light shots — blurry or grainy images can be rejected.",
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
      ctaHref="/exam-requirements/pan/"
      ctaLabel="Resize PAN card photo & signature free"
    >
      <p>
        India had 80.08&nbsp;crore PAN cards in circulation as of March&nbsp;2025
        (Income Tax Department data via IndiaGraphs, July&nbsp;2025), and every new
        application needs a photo and signature file that matches the portal&apos;s
        spec. The requirement isn&apos;t complicated, but Protean (formerly NSDL) and
        UTIITSL publish <em>different</em> figures. Here&apos;s every number you need
        before you open the upload form.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>
            <strong>Photo:</strong> 25×35&nbsp;mm physical, colour JPEG —{" "}
            <strong>200&nbsp;DPI (about 197×276&nbsp;px) / 20&nbsp;KB max on Protean (NSDL)</strong>;{" "}
            <strong>213×213&nbsp;px, 300&nbsp;dpi / under 30&nbsp;KB on UTIITSL</strong>.
          </li>
          <li>
            <strong>Signature:</strong> signed in black ink on white paper, JPEG —{" "}
            <strong>colour, 200&nbsp;DPI (about 354×157&nbsp;px) / 10&nbsp;KB max on Protean (NSDL)</strong>;{" "}
            <strong>black and white, 600&nbsp;dpi / under 60&nbsp;KB on UTIITSL</strong>.
          </li>
          <li>
            The printed photo is the same for both portals. Only the <em>digital file</em> dimensions differ.
          </li>
        </ul>
      </div>

      <p>
        These figures come from{" "}
        <a
          href="https://tin.tin.proteantech.in/pan/InstructionDSC.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          Protean&apos;s online PAN application instructions
        </a>{" "}
        and{" "}
        <a
          href="https://www.myutiitsl.com/panonlineservices/scanSpecification.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          UTIITSL&apos;s scanning specifications
        </a>{" "}
        (both checked 31&nbsp;Oct&nbsp;2026). Protean publishes its sizes in
        centimetres at 200&nbsp;DPI, so its pixel figures here are worked out from
        those. Its page covers applications signed with a Digital Signature
        Certificate; if you apply another way, check the instructions for that route.
      </p>

      <h2>What is the exact photo size for a PAN card?</h2>

      <p>
        The physical print size is <strong>25&nbsp;mm wide × 35&nbsp;mm tall</strong> —
        a standard passport-size portrait photo. Both portals accept the same printed
        copy. Where they diverge is the digital upload spec.
      </p>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Requirement</th>
            <th className="py-2 pr-4 font-semibold text-ink">NSDL / Protean</th>
            <th className="py-2 font-semibold text-ink">UTIITSL</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["Published size", "Height 3.5 cm, width 2.5 cm", "213×213 px (square)"],
            ["Pixel dimensions", "About 197×276 px (worked out from 200 DPI)", "213×213 px"],
            ["DPI", "200", "300"],
            ["Colour", "Colour", "Colour"],
            ["File format", "JPEG", "JPEG"],
            ["Max file size", "20 KB", "Under 30 KB"],
          ].map(([req, nsdl, uti]) => (
            <tr key={req} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{req}</td>
              <td className="py-2 pr-4">{nsdl}</td>
              <td className="py-2">{uti}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        The most important difference: <strong>UTIITSL uses a square crop</strong>{" "}
        (213×213&nbsp;px), while Protean&apos;s photo (height 3.5&nbsp;cm, width 2.5&nbsp;cm)
        is a portrait rectangle of about 197×276&nbsp;px. A portrait JPEG is the wrong
        shape for UTIITSL, so square it before you upload. The{" "}
        <Link href="/exam-requirements/pan/" className="text-brand underline">
          PAN card photo and signature resizer
        </Link>{" "}
        on easyPhoto is set to Protean&apos;s sizes; for UTIITSL, crop the photo to
        213×213&nbsp;px yourself and keep it under 30&nbsp;KB.
      </p>

      <h2>What is the signature size for a PAN card application?</h2>

      <p>
        The signature is uploaded as a separate JPEG — not embedded in the photo.
        You sign on plain white A4 paper with a black pen, photograph or scan the
        signature, crop tightly, and resize to the portal&apos;s spec.
      </p>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Requirement</th>
            <th className="py-2 pr-4 font-semibold text-ink">NSDL / Protean</th>
            <th className="py-2 font-semibold text-ink">UTIITSL</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["Published size", "Height 2 cm, width 4.5 cm", "Not published"],
            ["Pixel dimensions", "About 354×157 px, landscape (worked out from 200 DPI)", "Not published"],
            ["DPI", "200", "600"],
            ["Scan mode", "Colour", "Black and white"],
            ["File format", "JPEG", "JPEG"],
            ["Max file size", "10 KB", "Under 60 KB"],
          ].map(([req, nsdl, uti]) => (
            <tr key={req} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{req}</td>
              <td className="py-2 pr-4">{nsdl}</td>
              <td className="py-2">{uti}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        Scan at the setting your route asks for: <strong>200&nbsp;DPI in colour</strong>{" "}
        for Protean, <strong>600&nbsp;dpi in black and white</strong> for UTIITSL. Crop so
        the signature sits centred with a small white margin on all sides.
        Protean&apos;s 10&nbsp;KB cap is the tighter one; if the file is over it, use
        the{" "}
        <Link href="/tools/signature-resize/?target=10" className="text-brand underline">
          signature resizer to 10&nbsp;KB
        </Link>
        .
      </p>

      {/* CHART: Protean (NSDL) vs UTIITSL file-size limits */}
      <figure className="my-8">
        <svg
          viewBox="0 0 560 260"
          style={{ maxWidth: "100%", height: "auto", fontFamily: "'Inter', system-ui, sans-serif" }}
          role="img"
          aria-label="Grouped bar chart comparing Protean (NSDL) and UTIITSL file size limits: Protean photo 20 KB, UTIITSL photo 30 KB, Protean signature 10 KB, UTIITSL signature 60 KB"
        >
          <title>Protean (NSDL) vs UTIITSL: file size limits</title>
          <desc>Protean photo max 20 KB, UTIITSL photo under 30 KB. Protean signature max 10 KB, UTIITSL signature under 60 KB. Source: Protean PAN instructions and UTIITSL scanning specifications, checked 31 Oct 2026.</desc>

          {/* Legend */}
          <rect x="80" y="18" width="10" height="10" rx="2" fill="#378ADD" />
          <text x="95" y="27" fontSize="11" fill="currentColor" opacity="0.8">NSDL / Protean</text>
          <rect x="210" y="18" width="10" height="10" rx="2" fill="#EF9F27" />
          <text x="225" y="27" fontSize="11" fill="currentColor" opacity="0.8">UTIITSL</text>

          {/* Grid lines */}
          {[0, 20, 40, 60].map((v) => {
            const x = 80 + (v / 70) * 420;
            return (
              <g key={v}>
                <line x1={x} y1="46" x2={x} y2="220" stroke="currentColor" opacity="0.08" strokeWidth="1" />
                <text x={x} y="238" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.45">{v} KB</text>
              </g>
            );
          })}

          {/* Photo bars */}
          <text x="75" y="90" textAnchor="end" fontSize="12" fill="currentColor" opacity="0.8">Photo</text>
          {/* Protean photo: 20 KB */}
          <rect x="80" y="60" width={(20 / 70) * 420} height="22" rx="3" fill="#378ADD" />
          <text x={80 + (20 / 70) * 420 + 6} y="76" fontSize="11" fill="currentColor" opacity="0.8" fontWeight="500">20 KB</text>
          {/* UTIITSL photo: 30 KB */}
          <rect x="80" y="86" width={(30 / 70) * 420} height="22" rx="3" fill="#EF9F27" />
          <text x={80 + (30 / 70) * 420 + 6} y="102" fontSize="11" fill="currentColor" opacity="0.8" fontWeight="500">30 KB</text>

          {/* Signature bars */}
          <text x="75" y="165" textAnchor="end" fontSize="12" fill="currentColor" opacity="0.8">Signature</text>
          {/* Protean signature: 10 KB */}
          <rect x="80" y="135" width={(10 / 70) * 420} height="22" rx="3" fill="#378ADD" />
          <text x={80 + (10 / 70) * 420 + 6} y="151" fontSize="11" fill="currentColor" opacity="0.8" fontWeight="500">10 KB</text>
          {/* UTIITSL signature: 60 KB */}
          <rect x="80" y="161" width={(60 / 70) * 420} height="22" rx="3" fill="#EF9F27" />
          <text x={80 + (60 / 70) * 420 + 6} y="177" fontSize="11" fill="currentColor" opacity="0.8" fontWeight="500">60 KB</text>

          <text x="280" y="252" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.35">
            Source: Protean PAN instructions and UTIITSL scanning specifications (checked 31 Oct 2026)
          </text>
        </svg>
      </figure>

      <h2>Why do NSDL and UTIITSL have different specs?</h2>

      <p>
        Both agencies process PAN applications on behalf of the Income Tax Department,
        and each publishes its own scanning instructions. Protean (formerly NSDL
        e-Gov) gives the photo in centimetres at 200&nbsp;DPI, so the file keeps the
        portrait shape of the printed 25×35&nbsp;mm photo. UTIITSL gives a square
        213×213&nbsp;px photo at 300&nbsp;dpi and asks for the signature in black and
        white at 600&nbsp;dpi. Neither page explains the difference, so use the figures
        published for the route you are applying through.
      </p>

      <p>
        {/* [UNIQUE INSIGHT] */}
        The practical consequence: the <em>same printed photo</em> is acceptable at
        the counter for both portals, but you need two different digital exports for
        online applications — a portrait JPEG for NSDL and a square-cropped JPEG for
        UTIITSL. The{" "}
        <Link href="/exam-requirements/pan/" className="text-brand underline">
          easyPhoto PAN card resizer
        </Link>{" "}
        makes the Protean file; for UTIITSL, square-crop the same photo before you
        compress it.
      </p>

      <h2>Why do PAN card photos and signatures get rejected?</h2>

      <p>
        A file outside the published spec can hold up your application — UTIITSL
        says applications may be rejected at verification if a document is not in
        the required format. The most common causes:
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
            ["File over the KB limit", "Compress below the cap for your route before uploading"],
            ["Wrong pixel dimensions", "Export at the portal-specific size, not a generic 'small' setting"],
            ["Portrait photo for UTIITSL", "Square-crop to 213×213 px before upload"],
            ["Coloured or patterned background", "Shoot against a plain white wall; use background removal if needed"],
            ["Black-and-white photo", "Both routes ask for a colour photograph — rescan or re-export it in colour"],
            ["Signature touching the border", "Leave a 3–5 px white margin on all sides when cropping"],
            ["Signature on lined or tinted paper", "Use plain white unlined paper"],
            ["Blue ink for signature", "Black ink scans cleanest, especially in UTIITSL's black-and-white mode"],
          ].map(([reason, fix]) => (
            <tr key={reason} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{reason}</td>
              <td className="py-2">{fix}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>How to resize your PAN card photo and signature in three steps</h2>

      <p>
        You don&apos;t need Photoshop or a scanner shop. The free{" "}
        <Link href="/exam-requirements/pan/" className="text-brand underline">
          PAN card photo and signature resizer
        </Link>{" "}
        handles both uploads entirely in your browser — nothing is uploaded to a server.
      </p>

      <ol className="my-4 space-y-3 text-[15px]">
        <li>
          <strong>Check your route</strong> — the tool is set to Protean&apos;s
          published sizes and KB caps. If you apply through UTIITSL, use its
          figures from the tables above instead.
        </li>
        <li>
          <strong>Upload your photo</strong> — drop a JPG, PNG or HEIC from your
          phone or camera. The tool crops to the right aspect ratio and compresses
          to just under the file-size limit.
        </li>
        <li>
          <strong>Upload your signature scan</strong> — photograph or scan your
          signature on white paper. The tool trims the white border and outputs the
          right dimensions and KB.
        </li>
      </ol>

      <p>
        If you only need to hit a specific KB target without the portal&apos;s settings, use
        the{" "}
        <Link href="/tools/resize-kb/" className="text-brand underline">
          resize image to exact KB
        </Link>{" "}
        tool instead. For signatures specifically, the{" "}
        <Link href="/tools/signature-resize/?target=20" className="text-brand underline">
          signature resize to 20&nbsp;KB
        </Link>{" "}
        tool is already set to the most common Indian exam portal limit.
      </p>

      <p>
        If you need to pull the PAN number, name, or date of birth from a photo of
        your card, the free{" "}
        <Link href="/tools/pan-card-ocr/" className="text-brand underline">
          PAN card OCR tool
        </Link>{" "}
        reads the text directly from the image — nothing is uploaded.
      </p>

      <p>
        Need the specs for other Indian government IDs too? The{" "}
        <Link href="/blog/indian-government-id-photo-requirements/" className="text-brand underline">
          Indian government ID photo requirements guide
        </Link>{" "}
        compares PAN, Voter ID, Driving Licence and Aadhaar in one place. For exam
        application forms specifically, the{" "}
        <Link href="/blog/exam-photo-signature-size-guide/" className="text-brand underline">
          exam photo and signature size guide
        </Link>{" "}
        covers SSC, IBPS, UPSC, SBI, RRB and more.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
