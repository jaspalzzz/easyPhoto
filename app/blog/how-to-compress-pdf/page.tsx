import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("how-to-compress-pdf")!;

export const metadata = pageMetadata({
  title: post.title,
  titleAbsolute: true,
  description: post.description,
  path: `/blog/${post.slug}/`,
  type: "article",
});

export default function Page() {
  return (
    <BlogPostLayout slug={post.slug}>
      <p>
        Upload a marksheet to an exam portal and the page rejects it: &quot;file
        too large.&quot; The PDF is 2&nbsp;MB; the portal wants 50&nbsp;KB. That
        gap feels impossible, but scanned documents compress dramatically — often
        down to 1/10th their size — because they&apos;re mostly white space with
        a little ink. Here&apos;s how to hit any KB target reliably.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>Scanned documents compress to <strong>1/5–1/10 their original size</strong> because they&apos;re mostly white space.</li>
          <li>Use a <strong>target-KB tool</strong> — it searches for the exact quality that lands just under the cap, so you don&apos;t guess.</li>
          <li>For very tight limits (&lt;50&nbsp;KB), scan in <strong>greyscale</strong> and extract only the required pages first.</li>
        </ul>
      </div>

      <h2>Common KB limits by portal type</h2>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Portal type</th>
            <th className="py-2 pr-3 font-semibold text-ink">Typical PDF limit</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["UPSC, IBPS, SSC supporting documents", "50–100 KB"],
            ["Aadhaar, PAN, address proof (most portals)", "100–200 KB"],
            ["Bank and state-PSC applications", "200–300 KB"],
            ["Visa applications (Schengen, MRV, UK)", "300–500 KB"],
          ].map(([portal, limit]) => (
            <tr key={portal} className="border-b border-hairline/60">
              <td className="py-2 pr-3 font-medium text-ink">{portal}</td>
              <td className="py-2 pr-3">{limit}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Why PDFs from scanners or phones are so large</h2>
      <p>
        When you photograph a document or scan it, the result is a full-colour
        image — the same format as a photo. At 200 DPI a single A4 page weighs
        roughly 1–3&nbsp;MB. A 4-page certificate PDF with one page scanned per
        sheet can easily top 8&nbsp;MB. Government portals set limits like 50 or
        100&nbsp;KB years ago and haven&apos;t raised them since.
      </p>

      <h2>How PDF compression actually works</h2>
      <p>
        The most portable method converts each PDF page to a compressed image and
        re-assembles them. The result is a smaller file that any PDF viewer can
        open. The trade-off: text is no longer selectable and fine print may look
        slightly softer at very tight targets. For a scanned document that
        started as an image, there is effectively no loss.
      </p>

      <h2>The fastest way to hit an exact KB limit</h2>
      <p>
        Instead of guessing quality sliders, use a tool that searches for the
        right compression automatically:
      </p>
      <ul>
        <li>
          <Link href="/compress-pdf-to-50kb/">Compress PDF to 50&nbsp;KB</Link> — the
          tightest common exam-portal limit (UPSC, IBPS annexures).
        </li>
        <li>
          <Link href="/compress-pdf-to-100kb/">Compress PDF to 100&nbsp;KB</Link> — the
          most common limit for Aadhaar, marksheets and certificates.
        </li>
        <li>
          <Link href="/compress-pdf-to-200kb/">Compress PDF to 200&nbsp;KB</Link> — for
          portals that allow a bit more headroom.
        </li>
        <li>
          <Link href="/compress-pdf-to-500kb/">Compress PDF to 500&nbsp;KB</Link> — for
          visa and bank documents with higher caps.
        </li>
        <li>
          <Link href="/tools/pdf-compress/">Custom KB target</Link> — enter any
          limit directly if it isn&apos;t in the list.
        </li>
      </ul>
      <p>
        Every one of these runs entirely in your browser. Your PDF is never
        uploaded to a server.
      </p>

      <h2>What to do if the compressed PDF is still too large</h2>
      <p>
        Very tight targets (below 50&nbsp;KB for a multi-page document) can be
        hard to meet without visible quality loss. A few things help:
      </p>
      <ul>
        <li>
          <strong>Scan in greyscale, not colour.</strong> Colour scanning triples
          the data. Most official documents are black-on-white — greyscale
          scans compress much smaller.
        </li>
        <li>
          <strong>Keep it to the required pages only.</strong> Use{" "}
          <Link href="/tools/pdf-split/">PDF split</Link> to extract just the
          relevant page before compressing.
        </li>
        <li>
          <strong>Reduce scan DPI.</strong> 200 DPI is sufficient for portals;
          600 DPI photos of documents are six times larger than necessary.
        </li>
        <li>
          <strong>Try JPEG rather than PNG when scanning.</strong> JPEG is far
          more compact for document photos.
        </li>
      </ul>

      <h2>Checking what the portal actually needs</h2>
      <p>
        The{" "}
        <Link href="/exam-requirements/">exam requirements directory</Link> lists
        the exact photo, signature and document size rules for SSC, UPSC, IBPS,
        SBI, Railway, NTA (NEET/JEE) and other major portals — each with a link
        to the official notification so you can verify before you upload.
      </p>

      <div className="mt-12">
        <Faq items={[
          {
            q: "Can a 2 MB scanned PDF really be compressed to 50 KB without looking broken?",
            a: "Yes, for most government documents. A scanned A4 page is mostly white space with black text — that data compresses extremely well. The result at 50 KB may be slightly softer if you zoom in, but it will look clear at normal reading size and on any portal display.",
          },
          {
            q: "Why does compressing below 50 KB make the document blurry?",
            a: "Below a certain threshold, the compression algorithm starts discarding detail that the human eye can detect. For a single page this floor is around 30–40 KB. For a multi-page document, each page shares the budget — a 4-page PDF at 50 KB total means ~12 KB per page, which is very tight. Extract only the required pages first.",
          },
          {
            q: "Will the portal be able to open my compressed PDF?",
            a: "Yes. The compression method converts pages to compressed images and re-assembles a standard PDF file. Any PDF viewer — Adobe Reader, Chrome, phone apps — opens it without issues. The only change is that text is no longer selectable (it becomes an image), which doesn't affect government portals.",
          },
          {
            q: "Is it safe to use an online PDF compressor for Aadhaar or marksheets?",
            a: "Only if the tool processes the file entirely in your browser without uploading it to a server. The PDF compress tool on easyPhoto runs on your device using local JavaScript — no file is ever transmitted. Check the privacy policy of any tool you use for sensitive documents.",
          },
        ]} />
      </div>
    </BlogPostLayout>
  );
}
