import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("pan-card-photo-size")!;

const FAQ_ITEMS = [
  {
    q: "What is the photo size for a PAN card application?",
    a: "The physical size is 25×35 mm (portrait). For NSDL/Protean upload, the digital file must be 197×276 px, JPEG, under 50 KB, on a white or light background. For UTIITSL, the portal requires a square 213×213 px crop, JPEG, under 30 KB. Use the same printed photo for both — only the digital file differs.",
  },
  {
    q: "What is the signature size for a PAN card application?",
    a: "For NSDL: 354×157 px (landscape), JPEG, under 50 KB, signed on white paper in black ink. For UTIITSL: 200×400 px, JPEG, under 60 KB. Sign on plain white A4 paper with a black pen, scan in black-and-white mode at 200 DPI, and crop tightly before uploading.",
  },
  {
    q: "Why does my PAN card photo keep getting rejected?",
    a: "The most common reasons are: file size over the portal limit (even 51 KB triggers rejection), wrong pixel dimensions (UTIITSL needs a square crop), a non-white background, or a black-and-white photo when colour is required. Use the PAN card resizer on easyPhoto to hit the exact spec automatically.",
  },
  {
    q: "Can I use the same photo for NSDL and UTIITSL?",
    a: "Yes for print (both accept a 25×35 mm passport-size photo). No for digital upload — NSDL needs a 197×276 px portrait file while UTIITSL needs a 213×213 px square crop. You'll need to resize the same image to two different outputs depending on which portal you use.",
  },
  {
    q: "Is a mobile photo accepted for a PAN card application?",
    a: "Yes, provided it meets the spec: white or light-coloured background, frontal face, colour JPEG, and within the KB limit. Many applicants take a selfie against a white wall, crop it to 25×35 mm proportions, and resize to the required KB. Avoid low-light shots — blurry or grainy images are rejected.",
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
      ctaHref="/pan-card-photo-resizer/"
      ctaLabel="Resize PAN card photo & signature free"
    >
      <p>
        India had 80.08&nbsp;crore PAN cards in circulation as of March&nbsp;2025 — yet
        thousands of new applications still bounce every week because the photo or
        signature file doesn&apos;t match the portal&apos;s exact spec (Income Tax
        Department data via IndiaGraphs, July&nbsp;2025). The requirement isn&apos;t
        complicated, but the NSDL and UTIITSL portals use <em>different</em> pixel
        dimensions, which catches most people by surprise. Here&apos;s every number
        you need before you open the upload form.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>
            <strong>Photo:</strong> 25×35&nbsp;mm physical, colour JPEG, white/light
            background — <strong>197×276&nbsp;px / 50&nbsp;KB max on NSDL</strong>;{" "}
            <strong>213×213&nbsp;px / 30&nbsp;KB max on UTIITSL</strong>.
          </li>
          <li>
            <strong>Signature:</strong> signed in black ink on white paper, JPEG —{" "}
            <strong>354×157&nbsp;px / 50&nbsp;KB on NSDL</strong>;{" "}
            <strong>200×400&nbsp;px / 60&nbsp;KB on UTIITSL</strong>.
          </li>
          <li>
            The printed photo is the same for both portals. Only the <em>digital file</em> dimensions differ.
          </li>
        </ul>
      </div>

      <h2>What is the exact photo size for a PAN card?</h2>

      <p>
        The physical print size is <strong>25&nbsp;mm wide × 35&nbsp;mm tall</strong> —
        a standard passport-size portrait photo. Both portals accept the same printed
        copy. Where they diverge is the digital upload spec.
      </p>

      <img
        src="https://images.unsplash.com/photo-1603796846097-bee99e4a601f?fm=jpg&q=80&w=1200&h=630&fit=crop"
        alt="Two people reviewing and signing identity documents at a desk — PAN card application process"
        className="my-6 w-full rounded-xl object-cover"
        loading="lazy"
        width={1200}
        height={630}
      />

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
            ["Physical size", "25×35 mm (portrait)", "25×35 mm (portrait)"],
            ["Pixel dimensions", "197×276 px", "213×213 px (square)"],
            ["DPI", "200", "300"],
            ["File format", "JPEG / JPG", "JPEG / JPG"],
            ["Max file size", "50 KB", "30 KB"],
            ["Background", "White or light-coloured", "White"],
            ["Expression", "Neutral, eyes open", "Neutral, eyes open"],
            ["Glasses", "Not recommended", "Not recommended"],
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
        (213×213&nbsp;px), while NSDL uses a portrait rectangle (197×276&nbsp;px). If you
        upload a portrait JPEG to UTIITSL without squaring it first, the portal
        either rejects the file or crops your face off-centre. Use a tool that
        handles both outputs — the{" "}
        <Link href="/pan-card-photo-resizer/" className="text-brand underline">
          PAN card photo and signature resizer
        </Link>{" "}
        on easyPhoto auto-selects the right dimensions for the portal you pick.
      </p>

      <h2>What is the signature size for a PAN card application?</h2>

      <p>
        The signature is uploaded as a separate JPEG — not embedded in the photo.
        You sign on plain white A4 paper with a black pen, photograph or scan the
        signature, crop tightly, and resize to the portal&apos;s spec.
      </p>

      <img
        src="https://images.unsplash.com/photo-1521791055366-0d553872125f?fm=jpg&q=80&w=1200&h=630&fit=crop"
        alt="Hand signing on the signature line of an official document — PAN card signature requirement"
        className="my-6 w-full rounded-xl object-cover"
        loading="lazy"
        width={1200}
        height={630}
      />

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
            ["Pixel dimensions", "354×157 px (landscape)", "200×400 px"],
            ["File format", "JPEG / JPG", "JPEG / JPG"],
            ["Max file size", "50 KB", "60 KB"],
            ["Ink colour", "Black (preferred)", "Black"],
            ["Background", "White paper", "White paper"],
            ["Scan mode", "Greyscale or colour", "Black-and-white recommended"],
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
        Scan at <strong>200&nbsp;DPI</strong> in greyscale or black-and-white mode —
        higher DPI blows up the file size without improving legibility. Crop so
        the signature sits centred with a small white margin on all sides. If the
        file is over the limit, use the{" "}
        <Link href="/tools/signature-resize/?target=20" className="text-brand underline">
          signature resizer to 20&nbsp;KB
        </Link>{" "}
        (or the appropriate target for your portal).
      </p>

      {/* CHART: NSDL vs UTIITSL file-size limits */}
      <figure className="my-8">
        <svg
          viewBox="0 0 560 260"
          style={{ maxWidth: "100%", height: "auto", fontFamily: "'Inter', system-ui, sans-serif" }}
          role="img"
          aria-label="Grouped bar chart comparing NSDL and UTIITSL file size limits: NSDL photo 50 KB, UTIITSL photo 30 KB, NSDL signature 50 KB, UTIITSL signature 60 KB"
        >
          <title>NSDL vs UTIITSL: file size limits</title>
          <desc>NSDL photo max 50 KB, UTIITSL photo max 30 KB. NSDL signature max 50 KB, UTIITSL signature max 60 KB. Source: NSDL / Protean and UTIITSL portals.</desc>

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
          {/* NSDL photo: 50 KB */}
          <rect x="80" y="60" width={(50 / 70) * 420} height="22" rx="3" fill="#378ADD" />
          <text x={80 + (50 / 70) * 420 + 6} y="76" fontSize="11" fill="currentColor" opacity="0.8" fontWeight="500">50 KB</text>
          {/* UTIITSL photo: 30 KB */}
          <rect x="80" y="86" width={(30 / 70) * 420} height="22" rx="3" fill="#EF9F27" />
          <text x={80 + (30 / 70) * 420 + 6} y="102" fontSize="11" fill="currentColor" opacity="0.8" fontWeight="500">30 KB</text>

          {/* Signature bars */}
          <text x="75" y="165" textAnchor="end" fontSize="12" fill="currentColor" opacity="0.8">Signature</text>
          {/* NSDL signature: 50 KB */}
          <rect x="80" y="135" width={(50 / 70) * 420} height="22" rx="3" fill="#378ADD" />
          <text x={80 + (50 / 70) * 420 + 6} y="151" fontSize="11" fill="currentColor" opacity="0.8" fontWeight="500">50 KB</text>
          {/* UTIITSL signature: 60 KB */}
          <rect x="80" y="161" width={(60 / 70) * 420} height="22" rx="3" fill="#EF9F27" />
          <text x={80 + (60 / 70) * 420 + 6} y="177" fontSize="11" fill="currentColor" opacity="0.8" fontWeight="500">60 KB</text>

          <text x="280" y="252" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.35">
            Source: NSDL / Protean portal and UTIITSL portal (2025)
          </text>
        </svg>
      </figure>

      <h2>Why do NSDL and UTIITSL have different specs?</h2>

      <p>
        Both portals process PAN applications on behalf of the Income Tax Department
        but run independent technology stacks.{" "}
        <a
          href="https://www.onlineservices.proteantech.in/paam/endUserRegisterContact.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          NSDL (now Protean e-Governance)
        </a>{" "}
        built its upload system around a portrait rectangle that matches the physical
        25×35&nbsp;mm print format at 200&nbsp;DPI.{" "}
        <a
          href="https://www.myutiitsl.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          UTIITSL
        </a>{" "}
        later rebuilt its portal with a square crop optimised for biometric
        face-matching algorithms, which work more reliably on standardised square
        inputs at higher DPI.
      </p>

      <p>
        {/* [UNIQUE INSIGHT] */}
        The practical consequence: the <em>same printed photo</em> is acceptable at
        the counter for both portals, but you need two different digital exports for
        online applications — a portrait JPEG for NSDL and a square-cropped JPEG for
        UTIITSL. Most third-party resizer tools only handle one format. The{" "}
        <Link href="/pan-card-photo-resizer/" className="text-brand underline">
          easyPhoto PAN card resizer
        </Link>{" "}
        lets you switch between portals and outputs the correct dimensions automatically.
      </p>

      <h2>Why do PAN card photos and signatures get rejected?</h2>

      <img
        src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?fm=jpg&q=80&w=1200&h=630&fit=crop"
        alt="Person signing on white paper with a pen — correct technique for PAN card signature upload"
        className="my-6 w-full rounded-xl object-cover"
        loading="lazy"
        width={1200}
        height={630}
      />

      <p>
        Portal validation is automated — a few bytes over the limit triggers an
        immediate rejection with no manual review. The most common causes:
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
            ["File over the KB limit", "Use the resizer — it compresses to exactly 1–2 KB under the cap"],
            ["Wrong pixel dimensions", "Export at the portal-specific size, not a generic 'small' preset"],
            ["Portrait photo for UTIITSL", "Square-crop to 213×213 px before upload"],
            ["Coloured or patterned background", "Shoot against a plain white wall; use background removal if needed"],
            ["Black-and-white photo", "The portal requires a colour image — even a greyscale headshot is rejected"],
            ["Signature touching the border", "Leave a 3–5 px white margin on all sides when cropping"],
            ["Signature on lined or tinted paper", "Only plain white unlined A4 is accepted"],
            ["Blue ink for signature", "Black ink scans cleanest; some portals explicitly reject blue"],
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
        <Link href="/pan-card-photo-resizer/" className="text-brand underline">
          PAN card photo and signature resizer
        </Link>{" "}
        handles both uploads entirely in your browser — nothing is uploaded to a server.
      </p>

      <ol className="my-4 space-y-3 text-[15px]">
        <li>
          <strong>Choose your portal</strong> — select NSDL or UTIITSL. The tool
          switches to the correct pixel dimensions and KB cap automatically.
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
        If you only need to hit a specific KB target without the portal preset, use
        the{" "}
        <Link href="/tools/resize-kb/" className="text-brand underline">
          resize image to exact KB
        </Link>{" "}
        tool instead. For signatures specifically, the{" "}
        <Link href="/tools/signature-resize/?target=20" className="text-brand underline">
          signature resize to 20&nbsp;KB
        </Link>{" "}
        tool is preset to the most common Indian exam portal limit.
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
