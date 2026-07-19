import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("how-to-compress-photo-to-50kb")!;

const FAQ_ITEMS = [
  {
    q: "How do I compress a photo to under 50 KB without losing quality?",
    a: "Use easyPhoto's resize-by-KB tool: set the target to 45–50 KB and the tool adjusts JPEG quality automatically to hit that size. The compression is done on-device — nothing is uploaded. For most photos the quality loss at 50 KB is barely visible unless the source image is very large.",
  },
  {
    q: "Why do exam portals have a 50 KB or 20 KB photo limit?",
    a: "Government portal databases often store photos in older systems with fixed record sizes. The per-file limit keeps database storage manageable across millions of applications. Modern image formats can store a face photo clearly at 20–50 KB, so the limit is reasonable for this purpose.",
  },
  {
    q: "What is the minimum KB for a passport photo upload?",
    a: "There is no universal minimum: each workflow publishes its own fields. ECI's public Voter ID Form 6 guidance does not publish a digital KB band; Sarathi publishes 10–20 KB for its photo workflow. Check the current portal or notice before compressing.",
  },
  {
    q: "Will compressing a photo to 50 KB get my application rejected?",
    a: "Compressing to 50 KB addresses only the file-size field. The photo must still match any published dimensions, format and visual instructions, and heavy compression can reduce clarity. Verify the current portal requirements and inspect the downloaded image before submitting.",
  },
  {
    q: "Can I compress a photo without making it blurry?",
    a: "Starting with a high-resolution original (at least 1 MP) and compressing to 50 KB will look clean. Starting with an already-small image (e.g. 150×200 px) and then compressing forces JPEG artefacts. Use a phone photo or a scanned image as the source, not a previously downloaded thumbnail.",
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
      ctaLabel="Compress photo to exact KB — free, no upload"
    >
      <p>
        Every Indian exam portal — UPSC, SSC, IBPS, SBI, NTA, RRB — and most
        government document forms set a photo file-size limit between 10&nbsp;KB and
        50&nbsp;KB. Uploading a 2&nbsp;MB phone photo gets rejected instantly, but
        aggressively compressing it to 20&nbsp;KB can introduce visible JPEG noise.
        Here is the right way to compress a photo to a specific KB target without
        unnecessary quality loss.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>
            <strong>Use:</strong>{" "}
            <Link href="/tools/resize-kb/" className="text-brand underline">
              easyPhoto Resize by KB
            </Link>{" "}
            — type your target (e.g., 45&nbsp;KB) and it adjusts JPEG quality
            automatically. On-device, nothing uploaded.
          </li>
          <li>
            <strong>Start with a high-res original</strong> — a phone photo or
            scan; not a previously compressed thumbnail.
          </li>
          <li>
            <strong>Check both limits</strong> — most portals have a minimum AND
            a maximum. 50&nbsp;KB max with a 10&nbsp;KB minimum means you need to
            land in between.
          </li>
        </ul>
      </div>

      <h2>Why do portals have a specific KB limit?</h2>

      <p>
        Government portal databases often pre-allocate fixed record sizes for each
        application. An NSDL PAN card application database slot budgets 50&nbsp;KB
        for the photo — files larger than this cause the form to reject with a
        &ldquo;file size exceeds limit&rdquo; error. Files too small (below the
        minimum, typically 10–20&nbsp;KB) are rejected because the portal suspects
        the photo is too low resolution to be useful.
      </p>

      <img
        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?fm=jpg&q=80&w=1200&h=630&fit=crop"
        alt="Person filling out an online form on a laptop — government portal photo upload file size limit"
        className="my-6 w-full rounded-xl object-cover"
        loading="lazy"
        width={1200}
        height={630}
      />

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Portal</th>
            <th className="py-2 pr-4 font-semibold text-ink">Photo size limit</th>
            <th className="py-2 font-semibold text-ink">Signature limit</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["NSDL / Protean (PAN card)", "20–50 KB", "10–20 KB"],
            ["UTIITSL (PAN card)", "≤30 KB", "≤20 KB"],
            ["Voters' Service Portal / ECI (Form 6)", "Not published in public Form 6 guidance", "—"],
            ["Sarathi (Driving Licence)", "10–20 KB", "10–20 KB"],
            ["UPSC CSE / IES / CMS", "10–40 KB", "4–30 KB"],
            ["SSC exams", "10–100 KB", "4–30 KB"],
            ["IBPS / SBI bank exams", "20–50 KB", "10–20 KB"],
            ["NTA (JEE / NEET / CUET)", "10–100 KB", "4–30 KB"],
            ["RRB exams", "15–100 KB", "10–40 KB"],
          ].map(([portal, photo, sig]) => (
            <tr key={portal} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{portal}</td>
              <td className="py-2 pr-4">{photo}</td>
              <td className="py-2">{sig}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>How much quality loss happens at 50 KB?</h2>

      <p>
        A standard passport photo at 35×45&nbsp;mm and 300&nbsp;DPI is 413×531 pixels.
        At JPEG quality 80 (out of 100), this encodes to roughly 30–50&nbsp;KB depending
        on image complexity — skin tones and plain backgrounds compress better than
        complex textures. Quality 60 gives roughly 15–25&nbsp;KB. The visual difference
        between quality 80 and quality 60 is subtle for a face photo on a plain
        background, but noticeable on hair edges and sharp contrast.
      </p>

      {/* CHART: approximate KB at different JPEG quality settings for a 413×531px photo */}
      <figure className="my-8">
        <svg
          viewBox="0 0 560 240"
          style={{ maxWidth: "100%", height: "auto", fontFamily: "'Inter', system-ui, sans-serif" }}
          role="img"
          aria-label="Bar chart: approximate file size at different JPEG quality settings for a 413×531 pixel passport photo. Q95: 180 KB, Q80: 45 KB, Q70: 30 KB, Q60: 20 KB, Q50: 15 KB."
        >
          <title>JPEG quality vs file size for a 413×531 px passport photo</title>
          <desc>Illustrative example for a 413×531 px photo: quality 95 gives about 180 KB, quality 80 about 45 KB — a good target for most 50 KB portals — quality 70 about 30 KB, quality 60 about 20 KB, quality 50 about 15 KB. Actual sizes vary with image content.</desc>

          {[
            { q: "Q95 (max)", kb: 180, note: "uncompressed export", color: "#a78bfa" },
            { q: "Q80", kb: 45, note: "ideal — sweet spot", color: "#22c55e" },
            { q: "Q70", kb: 30, note: "good for 40 KB portals", color: "#38bdf8" },
            { q: "Q60", kb: 20, note: "NSDL minimum range", color: "#f97316" },
            { q: "Q50", kb: 15, note: "visible artefacts", color: "#a78bfa" },
          ].map(({ q, kb, note, color }, i) => {
            const y = 16 + i * 40;
            const w = (kb / 200) * 310;
            return (
              <g key={q}>
                <text x="84" y={y + 14} textAnchor="end" fontSize="12" fill="currentColor" opacity="0.8" fontWeight="600">{q}</text>
                <text x="84" y={y + 26} textAnchor="end" fontSize="10" fill="currentColor" opacity="0.42">{note}</text>
                <rect x="92" y={y} width={w} height="22" rx="4" fill={color} />
                <text x={92 + w + 8} y={y + 15} fontSize="12" fill="currentColor" opacity="0.9" fontWeight="700">~{kb}&nbsp;KB</text>
              </g>
            );
          })}

          <text x="280" y="228" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.35">
            Illustrative estimates for a plain-background face photo at 413×531 px — actual sizes vary
          </text>
        </svg>
      </figure>

      <h2>Step-by-step: compress a photo to a specific KB</h2>

      <ol className="my-4 space-y-3 text-[15px]">
        <li>
          <strong>Start with a high-resolution original:</strong> use the photo
          directly from your phone camera (3–10&nbsp;MP) or a flatbed scan at
          300&nbsp;DPI. Do NOT start with a previously downloaded or compressed
          image — that has already lost quality that you cannot recover.
        </li>
        <li>
          <strong>Open the tool:</strong>{" "}
          <Link href="/tools/resize-kb/" className="text-brand underline">
            easyPhoto Resize by KB
          </Link>
          . Upload the photo. The tool runs in your browser — the image stays on
          your device.
        </li>
        <li>
          <strong>Enter the target KB:</strong> type the maximum size from your
          portal. For a 50&nbsp;KB limit, set the target to 45–48&nbsp;KB to leave
          a safety margin. The tool adjusts JPEG quality automatically to hit
          that target.
        </li>
        <li>
          <strong>Download and verify:</strong> right-click the downloaded file →
          Get Info (Mac) or Properties (Windows) → check the file size in KB.
          Verify it is below the portal&apos;s maximum and above the minimum.
        </li>
        <li>
          <strong>Upload to the portal:</strong> if the portal still rejects,
          check the pixel dimension requirement. Some portals reject on pixel
          count before checking file size.
        </li>
      </ol>

      <img
        src="https://images.unsplash.com/photo-1555421689-3f034debb7a6?fm=jpg&q=80&w=1200&h=630&fit=crop"
        alt="Mobile phone showing a government exam registration form — photo upload and compression"
        className="my-6 w-full rounded-xl object-cover"
        loading="lazy"
        width={1200}
        height={630}
      />

      <h2>Common reasons a compressed photo still gets rejected</h2>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Rejection message</th>
            <th className="py-2 font-semibold text-ink">What to check</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ['"File size exceeds limit"', "Compress further — target 5 KB below the maximum, not right at it"],
            ['"File size too small"', "You compressed below the minimum — raise the target KB value"],
            ['"Invalid file format"', "Most portals require JPEG (.jpg) — check the output format; some tools output PNG by default"],
            ['"Image dimensions not acceptable"', "The pixel width or height is outside the portal's range — resize to the required dimensions first, then compress"],
            ['"DPI too low"', "Usually only NSDL — change DPI to 200 using the DPI converter before resizing"],
            ['"Invalid image"', "The file may have been re-saved multiple times — start fresh from the original photo"],
          ].map(([msg, fix]) => (
            <tr key={msg} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{msg}</td>
              <td className="py-2">{fix}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        For portal-specific workflows where you need to hit both a pixel dimension and
        a KB target in one step, the{" "}
        <Link href="/pan-card-photo-resizer/" className="text-brand underline">
          PAN card resizer
        </Link>
        ,{" "}
        <Link href="/voter-id-photo-resizer/" className="text-brand underline">
          Voter ID resizer
        </Link>
        , and{" "}
        <Link href="/driving-licence-photo-resizer/" className="text-brand underline">
          Driving Licence resizer
        </Link>{" "}
        handle both measurable targets — you upload the photo and get an output
        at the selected size, then check it against the current form instructions
        without tweaking any settings. For generic exam portals, the{" "}
        <Link href="/tools/resize-kb/" className="text-brand underline">
          resize-by-KB tool
        </Link>{" "}
        lets you set any target size.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
