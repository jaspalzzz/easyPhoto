import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("how-to-merge-pdf-free")!;

const FAQ_ITEMS = [
  {
    q: "Can I merge PDFs that are password-protected?",
    a: "No. Password-protected PDFs need to be unlocked first. Use the Unlock PDF tool to remove the password, then merge the resulting files. Attempting to merge an encrypted PDF will produce an error or a broken output.",
  },
  {
    q: "Is there a page limit for merging?",
    a: "There is no hard page limit built into the tool. The practical limit is your device's available memory — most modern phones and laptops handle a combined document of several hundred MB without issues.",
  },
  {
    q: "Can I reorder pages after merging?",
    a: "Yes. Before you click Merge & Download, you can drag pages into any order and delete any page you don't need. This lets you combine three separate PDFs and arrange all their pages exactly as the portal requires.",
  },
  {
    q: "Will the merged PDF have a watermark?",
    a: "No. The PDF merge tool on easyPhoto is completely free and adds no watermark. The output is a standard PDF file identical to what a paid tool would produce.",
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
    <BlogPostLayout slug={post.slug} faqItems={FAQ_ITEMS}>
      <div className="mb-5 text-sm text-muted-foreground">
        Last reviewed 12 July 2026 · Tested with the current easyPhoto PDF Merge tool
      </div>
      <p>
        Exam applications, visa packets and job portfolios often need several
        documents bundled into a single PDF. You could pay for a desktop tool or
        hand your files to an upload-everything service — or you can merge them
        free, right here, without anything leaving your device. Here&apos;s how.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>Open the <Link href="/tools/pdf-merge/" className="text-brand underline">PDF merge tool</Link>, drop two or more files, reorder pages, then click <strong>Merge &amp; Download</strong>.</li>
          <li>No sign-up, no watermark — all processing runs locally in your browser.</li>
          <li>If the result is over the portal&apos;s KB limit, compress it immediately with the <Link href="/tools/pdf-compress/" className="text-brand underline">PDF compress tool</Link>.</li>
        </ul>
      </div>

      <h2>Tested before and after</h2>
      <p>
        We created two plain test PDFs—one 1-page file and one 2-page file—and
        merged them with the <Link href="/tools/pdf-merge/">PDF Merge tool</Link>.
        The download contained 3 pages in the selected file order. Text remained
        selectable because the merger copies original PDF pages rather than
        turning them into screenshots. File size is not expected to equal the
        simple sum of the inputs because the output has one rebuilt PDF container.
      </p>

      <h2>When you need to merge PDFs</h2>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Situation</th>
            <th className="py-2 pr-3 font-semibold text-ink">What to combine</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["Exam applications (UPSC, IBPS, SSC)", "Marksheets + degree certificate + ID"],
            ["Visa and OCI applications", "Application form + supporting docs per category"],
            ["Job and university portfolios", "Cover letter + CV + certificates"],
            ["Bank / government form packs", "Application + Aadhaar + PAN + income certificate"],
          ].map(([situation, content]) => (
            <tr key={situation} className="border-b border-hairline/60">
              <td className="py-2 pr-3 font-medium text-ink">{situation}</td>
              <td className="py-2 pr-3">{content}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>How to merge PDFs free in your browser</h2>
      <p>
        Open the <Link href="/tools/pdf-merge/">PDF merge tool</Link>, then:
      </p>
      <ul>
        <li>
          Drop two or more PDF files onto the panel (or click to pick them from
          your device). All files stay on your device — nothing is uploaded.
        </li>
        <li>
          Drag the pages into the order you need. You can remove a page with the
          delete button if one crept in that shouldn&apos;t be there.
        </li>
        <li>
          Click <strong>Merge &amp; Download</strong>. The combined PDF
          downloads immediately.
        </li>
      </ul>
      <p>
        No sign-up, no watermark, no size limit beyond what your browser can
        handle (typically several hundred MB total).
      </p>

      <h2>After merging: getting the combined PDF under a size cap</h2>
      <p>
        A merged PDF inherits the file sizes of all its inputs. If the portal
        has a cap — say, 200&nbsp;KB — compress the merged PDF immediately after:
      </p>
      <ul>
        <li>
          <Link href="/tools/pdf-compress/?target=100">Compress to 100&nbsp;KB</Link> or{" "}
          <Link href="/tools/pdf-compress/?target=200">200&nbsp;KB</Link> for most portals.
        </li>
        <li>
          <Link href="/tools/pdf-compress/?target=50">Compress to 50&nbsp;KB</Link> for the
          tightest exam-portal limits (UPSC annexures, IBPS supporting docs).
        </li>
        <li>
          <Link href="/tools/pdf-compress/">Custom KB target</Link> to enter
          whatever limit the form specifies.
        </li>
      </ul>

      <p>
        For a full walkthrough of compression options and what to do when the
        target is very tight, see{" "}
        <Link href="/blog/how-to-compress-pdf/">how to compress a PDF to an exact KB target</Link>.
      </p>

      <h2>Splitting a PDF instead</h2>
      <p>
        Need the reverse — one large PDF broken into parts? The{" "}
        <Link href="/tools/pdf-split/">PDF split tool</Link> lets you extract
        individual pages or ranges. Useful when a form wants each document
        separately and you only have a combined scan.
      </p>

      <h2>PDF merge troubleshooting</h2>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead><tr className="border-b border-hairline text-left"><th className="py-2 pr-3 font-semibold text-ink">Failure</th><th className="py-2 font-semibold text-ink">What to do</th></tr></thead>
        <tbody className="text-ink-soft">
          {[
            ["A file is password-protected", "Unlock it with the password first, then add the unlocked copy to the merge queue."],
            ["Pages are in the wrong order", "Move whole files up or down in the queue before merging; verify the downloaded page sequence."],
            ["The merged file exceeds an upload cap", "Compress the merged download to the exact limit only after the page order is final."],
            ["The browser runs out of memory", "Close other tabs and merge smaller batches; very large scanned PDFs consume memory while being checked."],
          ].map(([failure, fix]) => <tr key={failure} className="border-b border-hairline/60"><td className="py-2 pr-3 font-medium text-ink">{failure}</td><td className="py-2">{fix}</td></tr>)}
        </tbody>
      </table>

      <h2>Privacy: your documents never leave your device</h2>
      <p>
        All PDF tools on this site — merge, split, compress, unlock — run
        entirely in your browser using local JavaScript. Marksheets, certificates,
        Aadhaar and income documents are sensitive; none of that data is ever
        transmitted to or stored on any server.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
