import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { getPost } from "@/lib/blog";

const post = getPost("exam-photo-signature-size-guide")!;

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
        Almost every Indian exam and recruitment portal asks you to upload a photo
        and a signature, and almost every one rejects them for the same reasons:
        the file is too big, the dimensions are wrong, or the signature has a white
        box around it. Here&apos;s what the major exams expect and how to get your
        files accepted on the first try.
      </p>

      <h2>The general rule</h2>
      <p>
        Most exam forms want a recent passport-style <strong>photo around 20–50&nbsp;KB</strong>{" "}
        and a <strong>signature around 10–20&nbsp;KB</strong>, each within set pixel
        dimensions, in JPG format. The signature must be on a clean background —
        sign on white paper in black or blue ink, then scan or photograph it.
      </p>
      <ul>
        <li><strong>Photo:</strong> recent, front-facing, plain light background, typically 20–50&nbsp;KB.</li>
        <li><strong>Signature:</strong> on white paper, clean background, typically 10–20&nbsp;KB.</li>
        <li><strong>Format:</strong> JPG for most portals; some accept PNG.</li>
      </ul>

      <h2>Common exams at a glance</h2>
      <p>
        The exact numbers change between notification cycles, so always confirm in
        the official notification — but these are the typical ranges:
      </p>
      <ul>
        <li><strong>SSC</strong> — photo ~20–50&nbsp;KB, signature ~10–20&nbsp;KB.</li>
        <li><strong>UPSC</strong> — photo and signature each within a few hundred KB, specific dimensions.</li>
        <li><strong>IBPS &amp; SBI</strong> (bank exams) — photo ~20–50&nbsp;KB, signature ~10–20&nbsp;KB, set pixel sizes.</li>
        <li><strong>Railway (RRB)</strong> — photo and signature within set KB and dimensions.</li>
        <li><strong>NEET / JEE (NTA)</strong> — photo and signature in defined KB ranges.</li>
      </ul>

      <h2>How to resize your photo and signature</h2>
      <p>
        You don&apos;t need to look up every number. Pick your exam in the{" "}
        <Link href="/tools/exam-package/">Exam Application Kit</Link> and it sets the
        right photo and signature size for you in one flow. Prefer to do them
        separately? Use the per-exam resizers, such as the{" "}
        <Link href="/ssc-photo-resizer/">SSC photo resizer</Link> or{" "}
        <Link href="/upsc-photo-resizer/">UPSC photo resizer</Link>, or the{" "}
        <Link href="/tools/form-resizer/ssc/">form resizer for your portal</Link>.
      </p>
      <p>
        For the signature, the{" "}
        <Link href="/signature-resize-to-20kb/">resize signature to 20&nbsp;KB</Link>{" "}
        tool removes the paper background and gets it under the limit. For the
        photo alone, compress to the exact cap with{" "}
        <Link href="/photo-resize-to-50kb/">resize to 50&nbsp;KB</Link> or a{" "}
        <Link href="/tools/resize-kb/">custom KB target</Link>. Everything runs in
        your browser — nothing is uploaded.
      </p>

      <h2>Why uploads get rejected</h2>
      <ul>
        <li>The photo or signature is over the file-size cap — compress it under the stated KB limit.</li>
        <li>The signature has a white background box — use a transparent or cleaned version.</li>
        <li>Wrong dimensions — match the pixel size the form asks for.</li>
        <li>Old or unclear photo — use a recent, well-lit, front-facing one.</li>
      </ul>
    </BlogPostLayout>
  );
}
