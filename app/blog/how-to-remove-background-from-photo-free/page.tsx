import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("how-to-remove-background-from-photo-free")!;

const FAQ_ITEMS = [
  {
    q: "Is easyPhoto's background remover really free?",
    a: "Yes — completely free, no account, no watermark, unlimited uses. The AI model runs entirely in your browser using WebAssembly or WebGPU, so no image is ever sent to a server. You download the transparent PNG directly from your device.",
  },
  {
    q: "Does the background remover work on mobile?",
    a: "Yes. On mobile it uses a lightweight on-device model optimised for phones. The result is ready in seconds. For the highest-quality output on fine hair and complex edges, a desktop browser with WebGPU support (Chrome 113+ or Edge) gives the sharpest matte.",
  },
  {
    q: "Can I replace the background with white after removing it?",
    a: "Yes — after removing the background the tool gives you options to download a transparent PNG, apply a white background, or apply a custom colour. White background is the standard requirement for passport photos, PAN card photos, and most Indian government ID applications.",
  },
  {
    q: "How does the quality compare to remove.bg or Adobe Express?",
    a: "For most photos — clear subjects, reasonably contrasting backgrounds — the quality is comparable. The main difference is privacy: remove.bg and Adobe upload your image to their servers, while easyPhoto processes everything on-device. The hardest case for any model is grey or silver hair against a light background; that edge case is where server-side tools (which use larger models) have an advantage.",
  },
  {
    q: "What photo formats does the background remover accept?",
    a: "JPEG, PNG, WebP, and HEIC (iPhone photos). HEIC files are decoded in the browser before processing. The output is always a transparent PNG, which you can then convert to JPEG if needed using the format converter tool.",
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
      ctaHref="/tools/background-removal/"
      ctaLabel="Remove background free — no upload"
    >
      <p>
        Remove.bg processed over 150&nbsp;million background removals per month
        in 2024 (Remove.bg company data, 2024) — but it uploads every image to a
        remote server, charges after a free limit, and keeps a copy for model
        training. There is a simpler option: an AI background remover that runs
        entirely in your browser, costs nothing, and never sees your photo.
        Here is how to use it, and how the technology works.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>
            <strong>Open</strong>{" "}
            <Link href="/tools/background-removal/" className="text-brand underline">
              easyPhoto Background Remover
            </Link>{" "}
            — no sign-up required.
          </li>
          <li>
            <strong>Upload</strong> your photo (JPEG, PNG, HEIC, WebP accepted).
          </li>
          <li>
            <strong>Download</strong> the transparent PNG — or switch to white
            background for ID photos in one click.
          </li>
          <li>
            <strong>Privacy:</strong> the AI model runs on your device. Your photo
            never leaves your browser.
          </li>
        </ul>
      </div>

      <h2>How does on-device background removal work?</h2>

      <p>
        The tool uses <strong>RMBG-1.4</strong>, an open-source image-matting model
        from BRIA AI, compiled to run as a WebAssembly or WebGPU workload directly
        in Chrome, Safari, Firefox, or Edge. On desktop, the model runs at
        2048&nbsp;×&nbsp;2048&nbsp;px inference resolution using WebGPU — four times
        the pixel area of the 1024&nbsp;px baseline used by most browser-based tools
        — giving significantly sharper edges on hair and fine detail.
      </p>

      <img
        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?fm=jpg&q=80&w=1200&h=630&fit=crop"
        alt="Person editing a photo on a laptop with a clean result — online background removal"
        className="my-6 w-full rounded-xl object-cover"
        loading="lazy"
        width={1200}
        height={630}
      />

      <p>
        The model predicts an alpha matte for each pixel — a value between 0 (fully
        background) and 255 (fully foreground). Semi-transparent values on hair edges
        are then decontaminated: the model blends the original hair colour back into
        edge pixels so that when a white background is applied, no colour fringe from
        the original background bleeds through. This is the main visual artefact
        cheaper tools leave behind — the &ldquo;halo&rdquo; effect on curly or
        backlit hair.
      </p>

      <h2>Step-by-step: remove a background in under a minute</h2>

      <ol className="my-4 space-y-3 text-[15px]">
        <li>
          <strong>Go to the tool:</strong>{" "}
          <Link href="/tools/background-removal/" className="text-brand underline">
            easyPhoto Background Remover
          </Link>
          . No account, no installation, works on mobile and desktop.
        </li>
        <li>
          <strong>Upload your photo:</strong> tap the upload area or drag a file in.
          JPEG, PNG, WebP, and HEIC are all supported. For passport or ID photos,
          use the highest-resolution original you have — the model works best with
          at least 400&nbsp;×&nbsp;400&nbsp;px input.
        </li>
        <li>
          <strong>Wait for processing:</strong> on desktop with WebGPU the model
          loads once (about 5–8&nbsp;seconds on first use) and processes each image
          in 1–3&nbsp;seconds. On mobile it takes 3–6&nbsp;seconds per image.
        </li>
        <li>
          <strong>Choose your output:</strong> download a transparent PNG, apply a
          white background for government ID photos, or pick a custom background colour.
        </li>
        <li>
          <strong>Use the result:</strong> the transparent PNG is ready to paste into
          design tools, social posts, or print layouts. The white-background version
          can go directly into passport, PAN card, or exam photo upload forms.
        </li>
      </ol>

      <img
        src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?fm=jpg&q=80&w=1200&h=630&fit=crop"
        alt="Portrait of a person with a clean white background — result of background removal for ID photo"
        className="my-6 w-full rounded-xl object-cover"
        loading="lazy"
        width={1200}
        height={630}
      />

      <h2>When is a white background required for Indian government photos?</h2>

      <p>
        Almost every Indian government document that requires a photo upload also
        specifies a plain white or light-coloured background. Below are the most
        common portals and their exact background rules.
      </p>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Document / Portal</th>
            <th className="py-2 font-semibold text-ink">Background requirement</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["Indian Passport (MEA / VFS)", "White or off-white plain background"],
            ["PAN Card — NSDL / Protean", "White or light-coloured plain background"],
            ["PAN Card — UTIITSL", "White background (strict)"],
            ["Voter ID — NVSP / ECI", "Plain white or light-coloured background"],
            ["Driving Licence — Sarathi", "White or light background, no patterns"],
            ["Aadhaar update (in-person)", "Captured live at centre — white background used on-site"],
            ["UPSC / IBPS prepared-photo forms", "Use the background stated in the current notice"],
            ["SSC current forms", "Photo captured live — prepare the setting, not a background-edited file"],
            ["Schengen / UK visa", "Grey or cream (not white) — see country guide"],
          ].map(([doc, bg]) => (
            <tr key={doc} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{doc}</td>
              <td className="py-2">{bg}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        For Schengen and UK visas, the background requirement is grey or cream — not
        white. The{" "}
        <Link href="/blog/passport-photo-background-color/" className="text-brand underline">
          passport photo background colour guide
        </Link>{" "}
        covers the recorded requirements for many countries.
      </p>

      {/* CHART: server upload vs on-device comparison */}
      <figure className="my-8">
        <svg
          viewBox="0 0 560 300"
          style={{ maxWidth: "100%", height: "auto", fontFamily: "'Inter', system-ui, sans-serif" }}
          role="img"
          aria-label="Comparison table: on-device background removal vs server-upload tools across price, privacy, speed, quality, and data retention"
        >
          <title>On-device vs server-upload background removal</title>
          <desc>easyPhoto runs on-device: free, private, no data retention, 1–3s on desktop. Server-upload tools like remove.bg charge after limits, upload images, and retain data for model training.</desc>

          {/* Header row */}
          <rect x="0" y="0" width="560" height="34" rx="6" fill="currentColor" opacity="0.06" />
          <text x="160" y="22" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.5" fontWeight="600">easyPhoto</text>
          <text x="360" y="22" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.5" fontWeight="600">Server-upload tools</text>

          {[
            ["Price", "Free, unlimited", "Free tier limited; paid after"],
            ["Photo upload", "Never — on-device only", "Uploaded to remote server"],
            ["Data retention", "None — cleared on close", "Kept for model training"],
            ["Processing speed", "1–3 s (desktop WebGPU)", "2–8 s (depends on network)"],
            ["Edge quality", "Sharp at 2048 px (desktop)", "Sharp (larger server model)"],
            ["Mobile support", "Yes (lightweight model)", "Yes"],
          ].map(([label, ours, theirs], i) => {
            const y = 34 + i * 42;
            const bg = i % 2 === 0 ? 0.03 : 0;
            return (
              <g key={label}>
                {bg > 0 && <rect x="0" y={y} width="560" height="42" fill="currentColor" opacity={bg} />}
                <text x="10" y={y + 16} fontSize="11" fill="currentColor" opacity="0.8" fontWeight="600">{label}</text>
                <text x="10" y={y + 31} fontSize="10" fill="currentColor" opacity="0.45">{" "}</text>
                <text x="160" y={y + 22} textAnchor="middle" fontSize="11" fill="#22c55e" opacity="0.9">{ours}</text>
                <text x="360" y={y + 22} textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.55">{theirs}</text>
              </g>
            );
          })}

          <text x="280" y="290" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.35">
            Source: remove.bg pricing page; easyPhoto technical implementation (2025)
          </text>
        </svg>
      </figure>

      <h2>Tips for the best background removal result</h2>

      <p>
        The AI model handles most photos well, but a few simple steps at capture time
        make edge quality significantly better:
      </p>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Tip</th>
            <th className="py-2 font-semibold text-ink">Why it helps</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["Use a contrasting background at capture", "Dark hair on light wall (or vice versa) gives the model a clear signal; similar-tone hair-on-background is the hardest case"],
            ["Take the photo in even, diffuse light", "Harsh side-lighting creates shadows that the model can misread as part of the background"],
            ["Upload the highest-resolution image you have", "The model runs at 2048 px on desktop — starting with a 4MP+ photo preserves fine hair detail after downscale"],
            ["Avoid heavy motion blur", "Blurry edges are ambiguous; a sharp photo = sharper matte"],
            ["For grey hair on a light wall, add contrast at capture", "This is the hardest edge case for any matting model; a clearly darker or textured wall behind the subject helps"],
          ].map(([tip, why]) => (
            <tr key={tip} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{tip}</td>
              <td className="py-2">{why}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Background removal for passport and visa photos</h2>

      <img
        src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?fm=jpg&q=80&w=1200&h=630&fit=crop"
        alt="Passport and travel documents laid out on a table — passport photo white background requirement"
        className="my-6 w-full rounded-xl object-cover"
        loading="lazy"
        width={1200}
        height={630}
      />

      <p>
        Background removal is only the first step for a compliant passport or visa
        photo. After removing the background and applying white, the photo still
        needs to meet the country-specific head-size and framing rules — head height
        must be 70–80% of the frame for Indian passports, for example.
      </p>

      <p>
        The{" "}
        <Link href="/passport-photo/" className="text-brand underline">
          passport photo maker
        </Link>{" "}
        handles the full pipeline: background removal, head-size crop, and compliance
        check for the correct country spec. The{" "}
        <Link href="/baby-passport-photo/" className="text-brand underline">
          baby passport photo tool
        </Link>{" "}
        applies the same pipeline for infants, where the head-size rules differ from
        adults. For exam photos, the{" "}
        <Link href="/tools/background-removal/" className="text-brand underline">
          background remover
        </Link>{" "}
        + the{" "}
        <Link href="/voter-id-photo-resizer/" className="text-brand underline">
          voter ID resizer
        </Link>{" "}
        or{" "}
        <Link href="/driving-licence-photo-resizer/" className="text-brand underline">
          driving licence resizer
        </Link>{" "}
        covers the end-to-end workflow.
      </p>

      <p>
        For country-specific passport background requirements, see the{" "}
        <Link href="/blog/passport-photo-background-color/" className="text-brand underline">
          passport photo background colour guide
        </Link>{" "}
        — some countries (UK, Schengen) require grey or cream, not white.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
