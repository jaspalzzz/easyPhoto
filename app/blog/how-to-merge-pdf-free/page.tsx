import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { getPost } from "@/lib/blog";

const post = getPost("how-to-merge-pdf-free")!;

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
        Exam applications, visa packets and job portfolios often need several
        documents bundled into a single PDF. You could pay for a desktop tool or
        hand your files to an upload-everything service — or you can merge them
        free, right here, without anything leaving your device. Here&apos;s how.
      </p>

      <h2>When you need to merge PDFs</h2>
      <ul>
        <li>
          <strong>Exam applications.</strong> Many portals ask for a single
          combined PDF of your marksheets, degree certificate and ID — even if
          they were scanned separately.
        </li>
        <li>
          <strong>Visa and OCI applications.</strong> Supporting documents often
          need to be submitted as one file per category.
        </li>
        <li>
          <strong>Job and university portfolios.</strong> Cover letter, CV and
          certificates combined into a single attachment.
        </li>
        <li>
          <strong>Bank and government form packs.</strong> Application form +
          Aadhaar + PAN + income certificate, merged before upload.
        </li>
      </ul>

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
          <Link href="/compress-pdf-to-100kb/">Compress to 100 KB</Link> or{" "}
          <Link href="/compress-pdf-to-200kb/">200 KB</Link> for most portals.
        </li>
        <li>
          <Link href="/compress-pdf-to-50kb/">Compress to 50 KB</Link> for the
          tightest exam-portal limits (UPSC annexures, IBPS supporting docs).
        </li>
        <li>
          <Link href="/tools/pdf-compress/">Custom KB target</Link> to enter
          whatever limit the form specifies.
        </li>
      </ul>

      <h2>Splitting a PDF instead</h2>
      <p>
        Need the reverse — one large PDF broken into parts? The{" "}
        <Link href="/tools/pdf-split/">PDF split tool</Link> lets you extract
        individual pages or ranges. Useful when a form wants each document
        separately and you only have a combined scan.
      </p>

      <h2>Privacy: your documents never leave your device</h2>
      <p>
        All PDF tools on this site — merge, split, compress, unlock — run
        entirely in your browser using local JavaScript. Marksheets, certificates,
        Aadhaar and income documents are sensitive; none of that data is ever
        transmitted to or stored on any server.
      </p>
    </BlogPostLayout>
  );
}
