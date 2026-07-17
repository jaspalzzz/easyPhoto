import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("what-is-dpi-and-how-to-change-it")!;

const FAQ_ITEMS = [
  {
    q: "Does changing DPI change image quality?",
    a: "No. Changing the DPI metadata value — without resampling — does not add or remove any pixels, so the image looks identical on screen. It only changes how large the image prints. A 3000×4000 px image at 72 DPI and at 300 DPI contain exactly the same pixels; they print at different sizes.",
  },
  {
    q: "What DPI does NSDL PAN card require?",
    a: "NSDL (Protean) requires a minimum 200 DPI photo, JPEG format, size between 20 KB and 50 KB, dimensions 3.5×2.5 cm. At 200 DPI that is 276×197 pixels. The DPI converter tool sets the DPI metadata to 200 DPI automatically when you select the PAN card preset.",
  },
  {
    q: "What is the best DPI for passport photos to print at home?",
    a: "300 DPI is the standard for home printing. At 300 DPI, a 35×45 mm passport photo is 413×531 pixels. Most home inkjet and laser printers can produce sharp results at 300 DPI on photo paper. Going to 600 DPI gives marginally sharper output but requires a higher-resolution source image and a photo-quality printer.",
  },
  {
    q: "Why do exam portals reject my photo even when the DPI is correct?",
    a: "Portal rejection is almost never about DPI — it is usually about file size (too large or too small), pixel dimensions (wrong width/height), or format (PNG when only JPEG is accepted). DPI is a print metadata tag that most web portals ignore. Check the specific portal's file size and pixel dimension limits instead.",
  },
  {
    q: "Can I increase DPI without losing quality?",
    a: "You can increase the DPI metadata value without affecting quality — that just tells printers to print smaller. To increase DPI while keeping the same print size, you need more pixels (upsampling). AI-based upsamplers (like waifu2x or Real-ESRGAN) can add plausible detail. Simple nearest-neighbour or bilinear upsampling produces blurry results.",
  },
  {
    q: "A portal says my PDF DPI should be 200 — what does that mean?",
    a: "It means the pages inside your PDF should be scanned at 200 dots per inch — a resolution requirement for the scan, not a file-size one. An A4 page scanned at 200 DPI is roughly 1654×2339 pixels. If your scanner app lets you pick a resolution, choose 200 DPI (or 'medium/document quality') before scanning; a photo of the document taken from a normal distance with a modern phone camera usually exceeds 200 DPI already. Portals state this so the text in your document stays legible after their processing.",
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
      ctaHref="/tools/dpi-converter/"
      ctaLabel="Change image DPI free — no upload"
    >
      <p>
        &ldquo;Change DPI to 200&rdquo; appears on NSDL, UTIITSL, and dozens of Indian
        exam portals. Most tutorials tell you to open Photoshop or GIMP, navigate
        to Image Size, and type a new number. What they rarely explain is that this
        operation is usually just a metadata edit — it does not change a single pixel,
        and does not affect how the image looks on screen or on most web upload forms.
        Here is what DPI actually means, when it matters, and how to change it correctly.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>
            <strong>DPI</strong> (dots per inch) controls print size, not on-screen
            quality. A 3000&times;4000&nbsp;px image at 72 DPI and 300 DPI look
            identical on a screen — they just print at different sizes.
          </li>
          <li>
            <strong>To change DPI for a web portal</strong>{" "}
            (NSDL, UTIITSL, NVSP, Sarathi):{" "}
            <Link href="/tools/dpi-converter/" className="text-brand underline">
              use the DPI converter
            </Link>{" "}
            — it edits the metadata tag in the JPEG without altering pixels.
          </li>
          <li>
            <strong>Most portals</strong> check file size and pixel dimensions,
            not DPI. If your upload is rejected, check the KB limit first.
          </li>
        </ul>
      </div>

      <h2>What does DPI actually mean?</h2>

      <p>
        DPI stands for dots per inch — a measurement of print density. When a printer
        receives an image file, the DPI (or PPI — pixels per inch) tag tells it how
        tightly to pack pixels onto the paper. A 3000-pixel-wide image at 300 DPI prints
        10 inches wide (3000 ÷ 300 = 10). The same image at 72 DPI prints 41.7 inches
        wide (3000 ÷ 72 = 41.7). The pixels themselves are unchanged.
      </p>

      <img
        src="https://images.unsplash.com/photo-1612599316791-451087c7fe15?fm=jpg&q=80&w=1200&h=630&fit=crop"
        alt="Close-up of printed photo — DPI dots per inch determines print sharpness and size"
        className="my-6 w-full rounded-xl object-cover"
        loading="lazy"
        width={1200}
        height={630}
      />

      <p>
        Web browsers and most software portals do not read the DPI tag when displaying
        an image on screen. They render it pixel-for-pixel. This is why changing the DPI
        number without also resampling (adding or removing pixels) produces a file that
        looks identical on screen. The only place the DPI number matters is when you
        print or when a government/exam portal specifically checks the metadata value.
      </p>

      {/* CHART: print sizes at different DPI for a 3000px image */}
      <figure className="my-8">
        <svg
          viewBox="0 0 560 260"
          style={{ maxWidth: "100%", height: "auto", fontFamily: "'Inter', system-ui, sans-serif" }}
          role="img"
          aria-label="Bar chart: print width of a 3000-pixel image at different DPI settings. At 72 DPI: 41.7 inches. At 96 DPI: 31.3 inches. At 200 DPI: 15 inches. At 300 DPI: 10 inches. At 600 DPI: 5 inches."
        >
          <title>Print size of a 3000-pixel-wide image at different DPI settings</title>
          <desc>Same 3000-pixel image prints at 41.7 inches at 72 DPI, 31.3 inches at 96 DPI, 15 inches at 200 DPI, 10 inches at 300 DPI, and 5 inches at 600 DPI. Pixel count is unchanged.</desc>

          {[
            { dpi: "72 DPI", inches: 41.7, color: "#a78bfa" },
            { dpi: "96 DPI", inches: 31.3, color: "#38bdf8" },
            { dpi: "200 DPI", inches: 15.0, color: "#f97316" },
            { dpi: "300 DPI", inches: 10.0, color: "#22c55e" },
            { dpi: "600 DPI", inches: 5.0, color: "#22c55e" },
          ].map(({ dpi, inches, color }, i) => {
            const y = 20 + i * 42;
            const w = (inches / 45) * 330;
            return (
              <g key={dpi}>
                <text x="82" y={y + 17} textAnchor="end" fontSize="12" fill="currentColor" opacity="0.8" fontWeight="600">{dpi}</text>
                <rect x="90" y={y} width={w} height="26" rx="4" fill={color} />
                <text x={90 + w + 8} y={y + 18} fontSize="12" fill="currentColor" opacity="0.9" fontWeight="700">{inches}&nbsp;in</text>
              </g>
            );
          })}

          <text x="280" y="248" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.35">
            Source: print size = pixel width ÷ DPI. All examples use a 3,000 px wide source image.
          </text>
        </svg>
      </figure>

      <h2>When does DPI matter for Indian government portals?</h2>

      <p>
        Most Indian government upload portals (NVSP for Voter ID, Sarathi for driving
        licence, most exam boards) check two things: file size in KB and pixel
        dimensions. They do not enforce the DPI metadata tag. NSDL (Protean) is the
        main exception — it explicitly states a minimum of 200 DPI in the
        requirements. UTIITSL similarly lists 200 DPI for PAN card photos.
      </p>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Portal</th>
            <th className="py-2 pr-4 font-semibold text-ink">DPI stated?</th>
            <th className="py-2 font-semibold text-ink">What is actually checked</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["NSDL / Protean (PAN card)", "Yes — minimum 200 DPI", "File size (20–50 KB), pixel dims, DPI tag"],
            ["UTIITSL (PAN card)", "Yes — 200 DPI", "File size (≤30 KB), DPI tag"],
            ["NVSP / ECI (Voter ID)", "Not specified", "File size (10–200 KB), JPEG format"],
            ["Sarathi (Driving Licence)", "Not specified", "File size (≤40 KB photo, ≤20 KB sig)"],
            ["UPSC / SSC / IBPS exam portals", "Not specified", "File size in KB and pixel dimensions"],
            ["India overseas passport guidance", "Not specified", "630×810 px and photo composition"],
          ].map(([portal, dpi, checked]) => (
            <tr key={portal} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{portal}</td>
              <td className="py-2 pr-4">{dpi}</td>
              <td className="py-2">{checked}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>How to change DPI without losing quality</h2>

      <p>
        The safest way to change the DPI tag in a JPEG is to rewrite the JFIF/Exif
        metadata without re-encoding the image. Re-encoding introduces compression
        artefacts even if the quality setting is high — every JPEG encode/decode cycle
        degrades the image slightly.{" "}
        <Link href="/tools/dpi-converter/" className="text-brand underline">
          easyPhoto&apos;s DPI converter
        </Link>{" "}
        edits only the metadata, so the pixel data is untouched and the file size
        stays the same or decreases by a few bytes.
      </p>

      <img
        src="https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?fm=jpg&q=80&w=1200&h=630&fit=crop"
        alt="Person uploading a document on a laptop — changing photo DPI for government portal upload"
        className="my-6 w-full rounded-xl object-cover"
        loading="lazy"
        width={1200}
        height={630}
      />

      <ol className="my-4 space-y-3 text-[15px]">
        <li>
          <strong>Open the DPI converter:</strong>{" "}
          <Link href="/tools/dpi-converter/" className="text-brand underline">
            easyPhoto DPI Converter
          </Link>{" "}
          — no account, no upload, runs in your browser.
        </li>
        <li>
          <strong>Upload your photo:</strong> JPEG, PNG, and WebP are accepted.
        </li>
        <li>
          <strong>Set the target DPI:</strong> type the value (e.g., 200 for NSDL/UTIITSL)
          or select the PAN card preset. For print use, 300 DPI is the standard.
        </li>
        <li>
          <strong>Download the file:</strong> the output has the updated DPI tag and
          identical pixel data. No quality loss.
        </li>
      </ol>

      <h2>DPI vs pixel dimensions — which matters for portal uploads?</h2>

      <p>
        For web uploads, pixel dimensions are what determine whether a photo is
        &ldquo;large enough.&rdquo; A 413&times;531&nbsp;px image is a standard
        35&times;45&nbsp;mm passport photo at 300&nbsp;DPI. The same image at
        72&nbsp;DPI is still 413&times;531&nbsp;px — just the metadata differs.
        Most portals reject on pixel dimensions (e.g., &ldquo;minimum 200&times;230
        pixels&rdquo;), not on DPI.
      </p>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Confusion</th>
            <th className="py-2 font-semibold text-ink">Reality</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["High DPI = high quality photo", "DPI is a print tag. A 300 DPI image is not better than a 72 DPI image — they are the same pixels."],
            ["Changing DPI fixes a blurry photo", "Blurriness is a pixel problem. Changing the DPI tag does not sharpen anything."],
            ["Low DPI causes portal rejection", "Most portals ignore DPI metadata. Rejection is almost always about file size or pixel count."],
            ["72 DPI is 'web resolution'", "Web browsers ignore DPI. All that matters is pixel dimensions. 72 DPI is a legacy default, not a quality specification."],
            ["I need Photoshop to change DPI", "Any metadata editor can change the JFIF DPI tag without re-encoding. The DPI converter does it free in your browser."],
          ].map(([confusion, reality]) => (
            <tr key={confusion} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{confusion}</td>
              <td className="py-2">{reality}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>What DPI is required for common use cases?</h2>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Use case</th>
            <th className="py-2 pr-4 font-semibold text-ink">DPI requirement</th>
            <th className="py-2 font-semibold text-ink">Pixels needed</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["PAN card — NSDL / UTIITSL", "200 DPI minimum", "276×197 px at 3.5×2.5 cm"],
            ["Passport photo home print", "300 DPI standard", "413×531 px at 35×45 mm"],
            ["Magazine / press print", "300–350 DPI", "Depends on print size"],
            ["Exam portal upload (UPSC/SSC)", "Not specified; pixel count matters", "Typically 100–300 px per side"],
            ["Web display / social media", "72–96 DPI (irrelevant for web)", "Platform pixel size is what matters"],
            ["Screen print / banner", "150 DPI at viewing distance", "Depends on print size"],
          ].map(([use, dpi, px]) => (
            <tr key={use} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{use}</td>
              <td className="py-2 pr-4">{dpi}</td>
              <td className="py-2">{px}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        If you need to both change DPI and resize to specific pixel dimensions, the{" "}
        <Link href="/tools/resize-kb/" className="text-brand underline">
          resize by KB tool
        </Link>{" "}
        handles file-size targets for exam portals, while the{" "}
        <Link href="/pan-card-photo-resizer/" className="text-brand underline">
          PAN card resizer
        </Link>{" "}
        handles the full NSDL/UTIITSL spec including DPI, dimensions, and file size
        in one step.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
