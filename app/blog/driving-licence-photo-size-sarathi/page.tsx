import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("driving-licence-photo-size-sarathi")!;

const FAQ_ITEMS = [
  {
    q: "What is the photo size for a driving licence on the Sarathi portal?",
    a: "The Sarathi portal (sarathi.parivahan.gov.in) requires a JPEG photo under 40 KB, with minimum dimensions of 200×230 px in portrait orientation. The background must be plain white or light-coloured, face centred, eyes open. The same spec applies for both Learner's Licence (LL) and Driving Licence (DL) applications.",
  },
  {
    q: "What is the signature size for a driving licence on Sarathi?",
    a: "For the Sarathi portal, the signature must be in JPEG format, under 20 KB, on a plain white background. Take a clear photo or scan of your signature on unlined white paper with a black or dark blue pen. Crop tightly so the signature fills the frame, then compress to under 20 KB using a free resizer.",
  },
  {
    q: "Why is my photo being rejected on the Sarathi driving licence portal?",
    a: "The most common reasons are: file over 40 KB (even 41 KB fails), wrong format (PNG/PDF instead of JPEG), a coloured or busy background, glasses or dark tint causing reflection, or a photo where the face isn't centred. Compress the file to 30–38 KB and ensure the background is plain white before re-uploading.",
  },
  {
    q: "Do I need separate photos for LL and DL applications?",
    a: "No — the photo and signature specifications are identical for a Learner's Licence (LL) and a full Driving Licence (DL). You can use the same JPEG file for both applications as long as it meets the spec: under 40 KB, portrait orientation, white background, clear frontal face.",
  },
  {
    q: "Can I use an Aadhaar or PAN card photo for my driving licence?",
    a: "Technically yes if it meets the Sarathi spec (JPEG, <40 KB, white background). However, the photo on your EPIC or Aadhaar is usually low-resolution when downloaded, and the background may not be plain white. It's safer to take a fresh photo specifically for the DL application to avoid rejection.",
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
      ctaHref="/driving-licence-photo-resizer/"
      ctaLabel="Resize driving licence photo free"
    >
      <p>
        India had over 20&nbsp;crore valid driving licences in circulation as of
        2024 (Ministry of Road Transport and Highways, Vahan data portal). Every
        new licence, renewal, and address-change application now goes through the
        <a
          href="https://sarathi.parivahan.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          Sarathi portal (sarathi.parivahan.gov.in)
        </a>
        , and every one of them requires a
        photo and signature upload. The file-size limits on Sarathi are tighter than
        most other government portals — 40&nbsp;KB for the photo, 20&nbsp;KB for the
        signature — and the portal rejects files automatically without a manual
        review. Here is every number you need before you open the upload screen.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>
            <strong>Photo:</strong> JPEG, under 40&nbsp;KB, at least
            200×230&nbsp;px portrait, plain white / light background
          </li>
          <li>
            <strong>Signature:</strong> JPEG, under 20&nbsp;KB, black or dark-blue
            ink on white paper
          </li>
          <li>
            <strong>Same spec for:</strong> Learner&apos;s Licence (LL), Driving
            Licence (DL), renewal, International Driving Permit (IDP)
          </li>
        </ul>
      </div>

      <h2>What is the exact photo and signature size for the Sarathi portal?</h2>

      <p>
        Sarathi enforces stricter KB limits than most other government portals
        because every RTO (Regional Transport Office) that processes applications
        stores millions of images and the smaller footprint reduces system load.
        The portal validates file size, format, and minimum resolution automatically
        — a file 1&nbsp;KB over the limit triggers an instant error.
      </p>

      <img
        src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?fm=jpg&q=80&w=1200&h=630&fit=crop"
        alt="Car keys and driving licence on a table — driving licence application process India"
        className="my-6 w-full rounded-xl object-cover"
        loading="lazy"
        width={1200}
        height={630}
      />

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Requirement</th>
            <th className="py-2 pr-4 font-semibold text-ink">Photo</th>
            <th className="py-2 font-semibold text-ink">Signature</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["File format", "JPEG / JPG", "JPEG / JPG"],
            ["Maximum file size", "40 KB", "20 KB"],
            ["Minimum dimensions", "200×230 px (portrait)", "140×60 px (landscape)"],
            ["Background", "White or light-coloured, plain", "White paper"],
            ["Orientation", "Portrait", "Landscape"],
            ["Colour", "Colour photograph", "Black or dark-blue ink"],
            ["Expression", "Neutral, eyes open", "—"],
            ["Glasses", "Remove if possible", "—"],
          ].map(([req, photo, sig]) => (
            <tr key={req} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{req}</td>
              <td className="py-2 pr-4">{photo}</td>
              <td className="py-2">{sig}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        The{" "}
        <Link href="/driving-licence-photo-resizer/" className="text-brand underline">
          driving licence photo resizer
        </Link>{" "}
        on easyPhoto handles both uploads: it compresses the photo to just under
        40&nbsp;KB (or 20&nbsp;KB for the signature), converts to JPEG, and crops to
        the correct portrait proportions — all in your browser with nothing sent to a
        server.
      </p>

      <h2>Which Sarathi forms require a photo upload?</h2>

      <p>
        The Sarathi portal groups applications by licence stage. A photo and signature
        are required for any form that issues or updates a physical licence card.
      </p>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Application type</th>
            <th className="py-2 pr-4 font-semibold text-ink">Photo required</th>
            <th className="py-2 font-semibold text-ink">Signature required</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["Learner's Licence (LL) — fresh", "Yes", "Yes"],
            ["Driving Licence (DL) — fresh", "Yes", "Yes"],
            ["DL renewal", "Yes", "Yes"],
            ["Duplicate DL (lost / damaged)", "Yes", "Yes"],
            ["Address change on DL", "Yes", "Yes"],
            ["Vehicle class addition (e.g. MCWOG → LMV)", "Yes", "Yes"],
            ["International Driving Permit (IDP)", "Yes", "Yes"],
            ["LL mock test / slot booking only", "No", "No"],
          ].map(([type, photo, sig]) => (
            <tr key={type} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{type}</td>
              <td className="py-2 pr-4">{photo}</td>
              <td className="py-2">{sig}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Why do driving licence photos get rejected on Sarathi?</h2>

      <img
        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?fm=jpg&q=80&w=1200&h=630&fit=crop"
        alt="Person using a laptop to complete an online government application form"
        className="my-6 w-full rounded-xl object-cover"
        loading="lazy"
        width={1200}
        height={630}
      />

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Rejection reason</th>
            <th className="py-2 font-semibold text-ink">Fix</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["File over 40 KB (photo) or 20 KB (signature)", "Use the DL resizer — it targets 1–2 KB under the cap"],
            ["PNG, PDF, or HEIC format", "Convert to JPEG before uploading"],
            ["Coloured or patterned background", "Shoot against white; or use background removal tool"],
            ["Black-and-white photo", "Portal requires colour even though DL prints are monochrome"],
            ["Blurry or pixelated image", "Minimum 200×230 px; retake in good daylight"],
            ["Glasses with heavy frame or tinted lenses", "Remove glasses — reflections are detected as face obstruction by some RTO systems"],
            ["Signature on ruled / tinted paper", "White unlined paper only — ruled lines cause rejection"],
            ["Signature too light or faint", "Use a dark pen; thin pencil signatures are rejected on scan"],
          ].map(([reason, fix]) => (
            <tr key={reason} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{reason}</td>
              <td className="py-2">{fix}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* CHART: Sarathi KB limits vs other portals */}
      <figure className="my-8">
        <svg
          viewBox="0 0 560 240"
          style={{ maxWidth: "100%", height: "auto", fontFamily: "'Inter', system-ui, sans-serif" }}
          role="img"
          aria-label="Horizontal bar chart comparing photo KB limits across Indian government online upload portals: Sarathi DL 40 KB, NVSP Voter ID 200 KB, NSDL PAN 50 KB, UTIITSL PAN 30 KB"
        >
          <title>Photo KB limit comparison — Indian government online upload portals</title>
          <desc>Sarathi portal (driving licence) has the tightest limit at 40 KB. NVSP voter ID portal allows up to 200 KB. NSDL PAN allows 50 KB, UTIITSL PAN 30 KB. Aadhaar is not shown — its photo is captured at a centre, not uploaded.</desc>

          {[0, 50, 100, 150, 200].map((v) => {
            const x = 170 + (v / 220) * 360;
            return (
              <g key={v}>
                <line x1={x} y1="20" x2={x} y2="195" stroke="currentColor" opacity="0.08" strokeWidth="1" />
                <text x={x} y="212" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.45">{v} KB</text>
              </g>
            );
          })}

          {[
            { label: "Sarathi (DL)", val: 40, color: "#f97316" },
            { label: "UTIITSL (PAN)", val: 30, color: "#38bdf8" },
            { label: "NSDL (PAN)", val: 50, color: "#38bdf8" },
            { label: "NVSP (Voter ID)", val: 200, color: "#22c55e" },
          ].map(({ label, val, color }, i) => {
            const y = 28 + i * 34;
            const w = (val / 220) * 360;
            return (
              <g key={label}>
                <text x="165" y={y + 14} textAnchor="end" fontSize="11" fill="currentColor" opacity="0.8">{label}</text>
                <rect x="170" y={y} width={w} height="20" rx="3" fill={color} />
                <text x={170 + w + 6} y={y + 14} fontSize="11" fill="currentColor" opacity="0.8" fontWeight="500">{val} KB</text>
              </g>
            );
          })}

          <text x="350" y="228" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.35">
            Source: Sarathi, NSDL, UTIITSL, UIDAI, and ECI portals (2025)
          </text>
        </svg>
      </figure>

      <h2>How to prepare your Sarathi photo and signature in three steps</h2>

      <ol className="my-4 space-y-3 text-[15px]">
        <li>
          <strong>Take the photo:</strong> Stand against a plain white or light wall
          in good natural light. Face the camera directly, neutral expression, no
          glasses. Use portrait orientation and make sure your face fills at least
          60% of the frame.
        </li>
        <li>
          <strong>Take the signature:</strong> Sign your name on a blank white A4
          sheet with a black or dark-blue ballpoint pen. Photograph it from directly
          above with even light — no shadows. Crop the signature tightly, leaving a
          small white margin on all sides.
        </li>
        <li>
          <strong>Resize and compress:</strong> Use the{" "}
          <Link href="/driving-licence-photo-resizer/" className="text-brand underline">
            driving licence photo resizer
          </Link>{" "}
          to output the photo at under 40&nbsp;KB and the signature at under
          20&nbsp;KB, both as JPEG. The tool runs entirely in your browser —
          no upload, no account.
        </li>
      </ol>

      <p>
        If your background isn&apos;t clean enough, use the{" "}
        <Link href="/tools/background-removal/" className="text-brand underline">
          background removal tool
        </Link>{" "}
        to replace it with solid white before resizing. For the signature, the{" "}
        <Link href="/tools/signature-resize/?target=20" className="text-brand underline">
          signature resize to 20&nbsp;KB
        </Link>{" "}
        tool is preset to the Sarathi limit.
      </p>

      <p>
        Also applying for a voter ID or PAN card? See the{" "}
        <Link href="/blog/voter-id-photo-requirements-2026/" className="text-brand underline">
          voter ID photo requirements guide
        </Link>{" "}
        and the{" "}
        <Link href="/blog/pan-card-photo-size/" className="text-brand underline">
          PAN card photo size guide
        </Link>{" "}
        — the KB limits and pixel specs differ significantly across these portals. The{" "}
        <Link href="/blog/indian-government-id-photo-requirements/" className="text-brand underline">
          Indian government ID photo requirements guide
        </Link>{" "}
        compares all four documents side by side.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
