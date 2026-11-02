import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("how-to-remove-background-from-photo-free")!;

const FAQ_ITEMS = [
  {
    q: "Is easyPhoto's background remover really free?",
    a: "Yes — free, with no account, no watermark and no limit on uses. It runs entirely in your browser, so no image is sent to a server.",
  },
  {
    q: "Does the background remover work on mobile?",
    a: "Yes. Phones use a lighter version of the model, and the result is ready in seconds. For the finest hair edges, a desktop browser that supports WebGPU, such as a recent Chrome or Edge, gives the sharpest result.",
  },
  {
    q: "How does the quality compare to remove.bg or Adobe Express?",
    a: "For most photos, with a clear subject and some contrast against the background, the results are comparable. The main difference is privacy: those services process your image on their servers, while easyPhoto works on your device. Grey or silver hair against a light wall is the hardest case for any tool, and server tools running larger models can do better there.",
  },
  {
    q: "What photo formats does the background remover accept?",
    a: "JPEG, PNG, WebP and HEIC (iPhone photos), which is converted in the browser. You can download a transparent PNG or a photo on a solid colour; if a form needs a JPEG, convert it with the format converter.",
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
        Most background removers work the same way: you upload the image to
        their server, it comes back cut out, and a free allowance runs out. That
        is fine for a product shot. It is a different matter for a photo of your
        face meant for a government form. easyPhoto&apos;s background remover runs
        entirely in your browser instead, costs nothing, and never receives your
        photo.
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
            <strong>Upload</strong> your photo (JPEG, PNG, HEIC or WebP).
          </li>
          <li>
            <strong>Download</strong> a transparent PNG, or switch to a white
            background for an ID photo in one click.
          </li>
        </ul>
      </div>

      <h2>How does it work without uploading?</h2>

      <p>
        The tool runs an open-source AI model, BRIA&apos;s RMBG-1.4, inside your
        browser. The model works out, pixel by pixel, how much of the image is
        you and how much is background, including the part-transparent pixels
        along strands of hair. Before a new background goes in, those edge
        pixels are recoloured from your own hair, so no tint from the old wall
        shows as a halo. On a desktop browser with WebGPU it works on a larger
        copy of your photo, which keeps fine hair sharper.
      </p>

      <h2>Step-by-step: remove a background in under a minute</h2>

      <ol className="my-4 space-y-3 text-[15px]">
        <li>
          <strong>Open the tool</strong> on your phone or computer. There is
          nothing to install.
        </li>
        <li>
          <strong>Upload your photo:</strong> tap the upload area or drag a file
          in. For an ID photo, use the sharpest original you have, at least
          400&nbsp;×&nbsp;400&nbsp;px.
        </li>
        <li>
          <strong>Wait a few seconds:</strong> the model loads once, the first
          time you use it, then each photo takes a few seconds.
        </li>
        <li>
          <strong>Choose the result:</strong> a transparent PNG, a white
          background, or a colour of your choice.
        </li>
      </ol>

      <h2>Which background does your form want?</h2>

      <p>
        Most Indian photo forms ask for white or a plain light colour: Form 6
        for a voter ID asks for white, and Sarathi for a light-coloured,
        preferably white background. Protean and UTIITSL publish no background
        colour for a PAN photo, so plain white is the safe choice there. Abroad
        the rule varies: the UK accepts any plain light colour, and Schengen
        missions set their own shade. The{" "}
        <Link href="/blog/passport-photo-background-color/" className="text-brand underline">
          background colour guide
        </Link>{" "}
        lists them by country. Exams that photograph you live, such as SSC, need
        a plain wall behind you rather than an edited file.
      </p>

      {/* CHART: server upload vs on-device comparison */}
      <figure className="my-8">
        <svg
          viewBox="0 0 560 172"
          style={{ maxWidth: "100%", height: "auto", fontFamily: "'Inter', system-ui, sans-serif" }}
          role="img"
          aria-label="Comparison: on-device background removal vs server-upload tools on price, where the image goes, and account"
        >
          <title>On-device vs server-upload background removal</title>
          <desc>easyPhoto runs on your device: free, and the image stays with you. Server-upload tools send the image to their servers and usually charge after a free allowance.</desc>

          <rect x="0" y="0" width="560" height="34" rx="6" fill="currentColor" opacity="0.06" />
          <text x="160" y="22" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.5" fontWeight="600">easyPhoto</text>
          <text x="360" y="22" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.5" fontWeight="600">Server-upload tools</text>

          {[
            ["Price", "Free, no limit", "Usually a free allowance, then paid"],
            ["Where the image goes", "Stays on your device", "Sent to their server"],
            ["Account", "None", "Often needed for full-size downloads"],
          ].map(([label, ours, theirs], i) => {
            const y = 34 + i * 42;
            const bg = i % 2 === 0 ? 0.03 : 0;
            return (
              <g key={label}>
                {bg > 0 && <rect x="0" y={y} width="560" height="42" fill="currentColor" opacity={bg} />}
                <text x="10" y={y + 22} fontSize="11" fill="currentColor" opacity="0.8" fontWeight="600">{label}</text>
                <text x="160" y={y + 22} textAnchor="middle" fontSize="11" fill="#22c55e" opacity="0.9">{ours}</text>
                <text x="360" y={y + 22} textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.55">{theirs}</text>
              </g>
            );
          })}
        </svg>
      </figure>

      <h2>Tips for a cleaner cut-out</h2>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Tip</th>
            <th className="py-2 font-semibold text-ink">Why it helps</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["Stand against a wall that contrasts with your hair", "Dark hair on a light wall, or the reverse, gives the clearest edge; similar tones are the hardest case"],
            ["Use even, soft light", "A harsh side light casts shadows that can be mistaken for background"],
            ["Start from the sharpest, largest photo you have", "Fine hair survives better when there is detail to work with"],
            ["Hold the camera still", "A blurred edge is hard to separate from the background"],
          ].map(([tip, why]) => (
            <tr key={tip} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{tip}</td>
              <td className="py-2">{why}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>For passport and visa photos</h2>

      <p>
        A white background is only the first step. The photo still has to meet
        the country&apos;s size and head-height rules. The{" "}
        <Link href="/passport-photo/" className="text-brand underline">
          passport photo maker
        </Link>{" "}
        does all three in one go: background, head-size crop and a framing
        check for the country you pick. The{" "}
        <Link href="/baby-passport-photo/" className="text-brand underline">
          baby passport photo tool
        </Link>{" "}
        does the same for infants. For a voter ID or driving-licence photo, the{" "}
        <Link href="/exam-requirements/voter-id/" className="text-brand underline">
          voter ID resizer
        </Link>{" "}
        and{" "}
        <Link href="/exam-requirements/driving-licence/" className="text-brand underline">
          driving licence resizer
        </Link>{" "}
        set the size after the background is clean.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
