import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
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

      <h2>Why PDFs from scanners or phones are so large</h2>
      <p>
        When you photograph a document or scan it, the result is a full-colour
        image — the same format as a photo. At 200 DPI a single A4 page weighs
        roughly 1–3&nbsp;MB. A 4-page certificate PDF with one page scanned per
        sheet can easily top 8&nbsp;MB. Government portals built before
        smartphones became the default scanner set limits like 50 or 100&nbsp;KB
        and haven&apos;t raised them since.
      </p>

      <h2>Common KB limits you&apos;ll hit</h2>
      <ul>
        <li>
          <strong>UPSC, IBPS, SSC supporting documents.</strong> Marksheets,
          degree certificates and income certificates are often capped at 50–100
          KB.
        </li>
        <li>
          <strong>Aadhaar, PAN, address proof.</strong> Most portals accept 100–200 KB.
        </li>
        <li>
          <strong>Visa applications (MRV, VFS, UK).</strong> Usually 300–500 KB
          with additional pixel-dimension rules.
        </li>
        <li>
          <strong>Bank and state-PSC applications.</strong> Often 200–300 KB, but
          read the instructions — some are as tight as 50 KB.
        </li>
      </ul>

      <h2>How PDF compression actually works</h2>
      <p>
        The most portable method — and the one that works on every device without
        a desktop app — converts each PDF page to a compressed image and
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
          <Link href="/compress-pdf-to-50kb/">Compress PDF to 50 KB</Link> — the
          tightest common exam-portal limit (UPSC, IBPS annexures).
        </li>
        <li>
          <Link href="/compress-pdf-to-100kb/">Compress PDF to 100 KB</Link> — the
          most common limit for Aadhaar, marksheets and certificates.
        </li>
        <li>
          <Link href="/compress-pdf-to-200kb/">Compress PDF to 200 KB</Link> — for
          portals that allow a bit more headroom.
        </li>
        <li>
          <Link href="/compress-pdf-to-500kb/">Compress PDF to 500 KB</Link> — for
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
          <strong>Keep it to the required pages only.</strong> A 4-page
          booklet when only page 1 is needed creates unnecessary bulk. Use{" "}
          <Link href="/tools/pdf-split/">PDF split</Link> to extract just the
          relevant page.
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
    </BlogPostLayout>
  );
}
