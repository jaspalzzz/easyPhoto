import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("voter-id-photo-requirements-2026")!;

const FAQ_ITEMS = [
  {
    q: "What is the photo size for a voter ID (EPIC) application?",
    a: "The Election Commission of India requires a recent, passport-size colour photograph. For online applications at voters.eci.gov.in, the photo must be a JPEG file between 10 KB and 200 KB. The recommended pixel size is at least 200×240 px. The background should be plain white or light-coloured, with your face clearly visible.",
  },
  {
    q: "What are the photo requirements for voter registration Form 6?",
    a: "Form 6 (fresh voter enrollment) requires a recent colour passport-size photo in JPEG format, under 200 KB, on a white or light background. Your face must be centred, eyes open, no sunglasses, and the photo must not be older than three months. The same photo spec applies to Form 6A (overseas voters) and Form 8 (corrections).",
  },
  {
    q: "Why is my voter ID photo getting rejected on the NVSP portal?",
    a: "Common rejection reasons: file size above 200 KB, wrong format (PNG or PDF instead of JPEG), a dark or busy background, blurry or low-contrast image, or a very old photo. Some states also reject photos where the face covers less than 70% of the frame. Use the voter ID photo resizer to hit the exact KB limit automatically.",
  },
  {
    q: "Can I use a mobile selfie for a voter ID application?",
    a: "Yes — the ECI portal accepts mobile photos. Take the photo in good daylight against a plain white wall, hold the phone at eye level, and avoid flash glare. Crop it to a portrait rectangle (roughly 3:4 ratio), then compress to under 200 KB. Avoid grainy low-light shots, as blurry photos are rejected.",
  },
  {
    q: "Is the voter ID photo size the same across all states?",
    a: "The base spec from the Election Commission is consistent nationally, but some state ERO portals impose tighter KB limits (as low as 50 KB) or require minimum pixel dimensions (200×240 px). When in doubt, compress to under 100 KB — this clears the strictest state portals while staying well inside the national 200 KB cap.",
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
      ctaHref="/voter-id-photo-resizer/"
      ctaLabel="Resize voter ID photo free"
    >
      <p>
        India&apos;s voter rolls crossed 96.8&nbsp;crore registered electors in 2024
        (Election Commission of India, General Elections data). Yet thousands of new
        enrollment and correction applications are returned every week for one reason:
        the uploaded photo doesn&apos;t match the portal spec. The NVSP
        (voters.eci.gov.in) has straightforward requirements, but the KB limit and
        aspect ratio catch most people by surprise. Here is every requirement before
        you open the upload form.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>
            <strong>Format:</strong> JPEG / JPG only (PNG and PDF are rejected)
          </li>
          <li>
            <strong>File size:</strong> 10&nbsp;KB minimum — 200&nbsp;KB maximum
            (aim for under 100&nbsp;KB to clear stricter state portals)
          </li>
          <li>
            <strong>Pixel size:</strong> at least 200×240&nbsp;px, portrait
            orientation
          </li>
          <li>
            <strong>Background:</strong> plain white or light-coloured, no patterns
          </li>
          <li>
            <strong>Recency:</strong> taken within the last 3&nbsp;months
          </li>
        </ul>
      </div>

      <h2>What is the exact photo size for a voter ID application?</h2>

      <p>
        The Election Commission of India does not specify a fixed pixel dimension
        the way the passport office does. What it mandates is a{" "}
        <strong>recent, passport-size colour photograph</strong> uploaded as a JPEG.
        On the national NVSP portal (voters.eci.gov.in), the file must be{" "}
        <strong>between 10&nbsp;KB and 200&nbsp;KB</strong>. Many state Electoral
        Registration Officer (ERO) portals tighten this to 50&nbsp;KB or 100&nbsp;KB,
        so compressing to under 100&nbsp;KB covers all state portals safely.
      </p>

      <img
        src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?fm=jpg&q=80&w=1200&h=630&fit=crop"
        alt="Election Commission ballot box and voter registration process in India"
        className="my-6 w-full rounded-xl object-cover"
        loading="lazy"
        width={1200}
        height={630}
      />

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Requirement</th>
            <th className="py-2 font-semibold text-ink">ECI / NVSP spec</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["File format", "JPEG / JPG"],
            ["Minimum file size", "10 KB"],
            ["Maximum file size", "200 KB (aim for ≤100 KB)"],
            ["Minimum resolution", "200×240 px (portrait)"],
            ["Colour", "Colour photograph — not black & white"],
            ["Background", "Plain white or light-coloured, no patterns"],
            ["Expression", "Neutral, mouth closed, eyes open and visible"],
            ["Head covering", "Allowed only for religious reasons"],
            ["Glasses", "Not recommended (reflection causes rejection)"],
            ["Age of photo", "Taken within the last 3 months"],
          ].map(([req, spec]) => (
            <tr key={req} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{req}</td>
              <td className="py-2">{spec}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        The{" "}
        <Link href="/voter-id-photo-resizer/" className="text-brand underline">
          voter ID photo resizer
        </Link>{" "}
        on easyPhoto compresses your photo to exactly 1–2&nbsp;KB under the 200&nbsp;KB
        cap (or the stricter 50&nbsp;KB / 100&nbsp;KB target if you select it), resizes
        to the correct portrait proportions, and converts to JPEG — entirely in your
        browser, with no upload to any server.
      </p>

      <h2>Which voter registration forms require a photo upload?</h2>

      <p>
        The NVSP portal collects a photo on every form that creates or modifies an
        EPIC (Electors Photo Identity Card). The photo requirement is identical across
        all of them.
      </p>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Form</th>
            <th className="py-2 pr-4 font-semibold text-ink">Purpose</th>
            <th className="py-2 font-semibold text-ink">Photo required</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["Form 6", "Fresh enrollment as a voter (Indian resident)", "Yes"],
            ["Form 6A", "Fresh enrollment for overseas (NRI) voters", "Yes"],
            ["Form 6B", "Aadhaar-EPIC linking (no change to entry)", "No"],
            ["Form 7", "Deletion of entry / objection", "No"],
            ["Form 8", "Correction of EPIC details or address change", "Yes"],
            ["Form 8A", "Transposition within assembly constituency", "No"],
          ].map(([form, purpose, required]) => (
            <tr key={form} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{form}</td>
              <td className="py-2 pr-4">{purpose}</td>
              <td className="py-2">{required}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Why do voter ID photos get rejected?</h2>

      <img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?fm=jpg&q=80&w=1200&h=630&fit=crop"
        alt="Person reviewing documents on a laptop for voter registration application"
        className="my-6 w-full rounded-xl object-cover"
        loading="lazy"
        width={1200}
        height={630}
      />

      <p>
        The NVSP portal validates files automatically. A single parameter out of range
        — even 1&nbsp;KB over the limit — triggers an immediate error with no manual
        review. The most common rejection causes:
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
            ["File over 200 KB", "Compress using the voter ID photo resizer"],
            ["PNG or PDF format", "Convert to JPEG before uploading"],
            ["Black-and-white photo", "Use a colour photo — even a colour scan of a B&W print is rejected"],
            ["Dark or patterned background", "Shoot against a plain white wall or use background removal"],
            ["Blurry or low-resolution image", "Take in good daylight; minimum 200×240 px"],
            ["Photo older than 3 months", "Take a new photo — the ERO can reject stale photos on review"],
            ["Sunglasses or heavy shadows on face", "Remove eyewear; face must be fully visible and evenly lit"],
            ["Face too small in frame", "Crop tightly so the face fills at least 60–70% of the frame"],
          ].map(([reason, fix]) => (
            <tr key={reason} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{reason}</td>
              <td className="py-2">{fix}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* CHART: NVSP file-size window */}
      <figure className="my-8">
        <svg
          viewBox="0 0 560 200"
          style={{ maxWidth: "100%", height: "auto", fontFamily: "'Inter', system-ui, sans-serif" }}
          role="img"
          aria-label="Horizontal bar chart showing the NVSP file-size window: minimum 10 KB, recommended target under 100 KB, maximum 200 KB"
        >
          <title>NVSP voter photo — file size window</title>
          <desc>The NVSP portal accepts voter photos between 10 KB and 200 KB. Compressing to under 100 KB clears the strictest state portals. Source: ECI NVSP portal guidelines.</desc>

          {/* X axis labels */}
          {[0, 50, 100, 150, 200].map((v) => {
            const x = 80 + (v / 220) * 420;
            return (
              <g key={v}>
                <line x1={x} y1="30" x2={x} y2="150" stroke="currentColor" opacity="0.08" strokeWidth="1" />
                <text x={x} y="168" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.45">{v} KB</text>
              </g>
            );
          })}

          {/* Rejected zone: >200 KB */}
          <rect x={80 + (200 / 220) * 420} y="48" width={80 - (200 / 220) * 0} height="22" rx="3" fill="currentColor" opacity="0.07" />

          {/* Acceptable zone: 10–200 KB */}
          <rect x={80 + (10 / 220) * 420} y="48" width={(190 / 220) * 420} height="22" rx="3" fill="#22c55e" opacity="0.15" />
          <text x={80 + (105 / 220) * 420} y="64" textAnchor="middle" fontSize="11" fill="#22c55e" opacity="0.9" fontWeight="600">Accepted (10–200 KB)</text>

          {/* Recommended zone: 10–100 KB */}
          <rect x={80 + (10 / 220) * 420} y="90" width={(90 / 220) * 420} height="22" rx="3" fill="#378ADD" />
          <text x={80 + (55 / 220) * 420} y="106" textAnchor="middle" fontSize="11" fill="white" fontWeight="600">Recommended: &lt;100 KB</text>

          <text x="80" y="144" fontSize="10" fill="currentColor" opacity="0.5">Min: 10 KB</text>
          <text x={80 + (200 / 220) * 420} y="144" textAnchor="end" fontSize="10" fill="currentColor" opacity="0.5">Max: 200 KB</text>

          <text x="280" y="188" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.35">
            Source: Election Commission of India — NVSP portal (2025)
          </text>
        </svg>
      </figure>

      <h2>How to take a voter ID photo at home</h2>

      <p>
        You don&apos;t need a studio. A mobile phone in good light is enough,
        provided you follow the ECI&apos;s guidelines:
      </p>

      <ol className="my-4 space-y-3 text-[15px]">
        <li>
          <strong>Background:</strong> Stand against a plain white or cream wall.
          Avoid curtains, furniture, or shadows falling on the wall behind you.
        </li>
        <li>
          <strong>Lighting:</strong> Face a window or a bright, diffuse light source.
          Avoid direct flash — it creates glare on glasses and flattens the face.
          Overcast daylight near a window is ideal.
        </li>
        <li>
          <strong>Framing:</strong> Hold the phone at eye level, roughly an arm&apos;s
          length away. Your face and top of shoulders should fill most of the frame.
          Look straight into the camera with a neutral expression.
        </li>
        <li>
          <strong>Crop and resize:</strong> Use the{" "}
          <Link href="/voter-id-photo-resizer/" className="text-brand underline">
            voter ID photo resizer
          </Link>{" "}
          to crop to a portrait rectangle and compress to under 100&nbsp;KB in JPEG
          format. The tool runs entirely in your browser.
        </li>
      </ol>

      <p>
        If your background isn&apos;t plain enough, the{" "}
        <Link href="/tools/background-removal/" className="text-brand underline">
          background removal tool
        </Link>{" "}
        can replace a busy background with a clean white one — all on-device, nothing
        uploaded. This is also useful if the photo you have is otherwise good but was
        taken in front of a coloured wall.
      </p>

      <h2>Voter ID vs Aadhaar vs PAN — are the photo specs the same?</h2>

      <p>
        All three require a recent, passport-size colour JPEG on a white background —
        but the KB limits and pixel dimensions differ by portal. Here is a side-by-side
        comparison for the most common online applications:
      </p>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Document</th>
            <th className="py-2 pr-4 font-semibold text-ink">Portal</th>
            <th className="py-2 pr-4 font-semibold text-ink">Max KB</th>
            <th className="py-2 font-semibold text-ink">Pixel size</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["Voter ID (EPIC)", "voters.eci.gov.in", "200 KB", "≥200×240 px"],
            ["PAN (NSDL)", "onlineservices.nsdl.com", "50 KB", "197×276 px"],
            ["PAN (UTIITSL)", "myutiitsl.com", "30 KB", "213×213 px (square)"],
            ["Aadhaar update", "myaadhaar.uidai.gov.in", "50 KB", "≥200×200 px"],
            ["Driving Licence", "sarathi.parivahan.gov.in", "40 KB", "≥200×230 px"],
          ].map(([doc, portal, kb, px]) => (
            <tr key={doc} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{doc}</td>
              <td className="py-2 pr-4 text-[13px]">{portal}</td>
              <td className="py-2 pr-4">{kb}</td>
              <td className="py-2">{px}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        For PAN card specs, see the{" "}
        <Link href="/blog/pan-card-photo-size/" className="text-brand underline">
          PAN card photo size guide
        </Link>
        . For passport photo requirements, the{" "}
        <Link href="/blog/indian-passport-photo-requirements/" className="text-brand underline">
          Indian passport photo requirements
        </Link>{" "}
        guide covers the MEA and VFS spec in detail.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
