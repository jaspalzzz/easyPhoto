import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { getPost } from "@/lib/blog";

const post = getPost("how-to-reduce-passport-photo-size-for-online-forms")!;

export const metadata = pageMetadata({
  title: `${post.title}`,
  titleAbsolute: true,
  description: post.description,
  path: `/blog/${post.slug}/`,
  type: "article",
});

export default function Page() {
  return (
    <BlogPostLayout slug={post.slug}>
      <p>
        A phone photo is several megabytes. Most government, visa and exam
        portals accept only a tiny fraction of that — often 10 to 100&nbsp;KB.
        When your upload fails with &quot;file too large,&quot; the fix is
        compression, not retaking the photo. Here&apos;s how to hit an exact KB
        target without turning your face into mush.
      </p>

      <h2>Common file-size limits you&apos;ll meet</h2>
      <ul>
        <li>
          <strong>Indian government &amp; exam forms</strong> — frequently 20–50
          KB for photos, sometimes as low as 10 KB; signatures often 10–20 KB.
        </li>
        <li>
          <strong>Visa portals</strong> — typically 50–300 KB, with minimum
          dimensions too.
        </li>
        <li>
          <strong>Job and university applications</strong> — usually 100–200 KB.
        </li>
      </ul>
      <p>
        Always read the form&apos;s instructions — limits vary, and some set a
        minimum as well as a maximum.
      </p>

      <h2>How to compress without losing sharpness</h2>
      <p>
        Two things control a JPEG&apos;s file size: its pixel dimensions and its
        quality setting. The trick is to reduce both just enough to slip under
        the cap while keeping the face crisp. Done well, a 20&nbsp;KB passport
        photo still looks clean at the size a portal displays it.
      </p>
      <ul>
        <li>Start from the properly cropped passport photo, not the raw selfie.</li>
        <li>Lower quality first; only shrink dimensions if you must.</li>
        <li>Keep it a JPEG — PNGs are far larger for photos.</li>
        <li>Don&apos;t over-compress below the portal&apos;s minimum, if it has one.</li>
      </ul>

      <h2>The fast way: target an exact KB</h2>
      <p>
        Instead of guessing quality sliders, use a tool that searches for the
        exact target automatically:
      </p>
      <ul>
        <li>
          <Link href="/tools/resize-image-to-10kb/">Resize to 10 KB</Link> — the
          tightest exam-form limit.
        </li>
        <li>
          <Link href="/tools/resize-image-to-20kb/">Resize to 20 KB</Link> and{" "}
          <Link href="/tools/resize-image-to-50kb/">50 KB</Link> — the most
          common photo caps.
        </li>
        <li>
          <Link href="/tools/resize-image-to-100kb/">100 KB</Link> /{" "}
          <Link href="/tools/resize-image-to-200kb/">200 KB</Link>, or a{" "}
          <Link href="/tools/resize-kb/">custom KB value</Link> for anything
          else.
        </li>
      </ul>
      <p>
        Need to fit an exact width and height too? Use{" "}
        <Link href="/tools/resize-dimensions/">resize dimensions</Link> first,
        then compress. For a signature upload, the{" "}
        <Link href="/signature-resize-to-20kb/">signature resizer</Link> handles
        the same job for transparent PNGs.
      </p>

      <h2>Get the photo right first</h2>
      <p>
        Compression can&apos;t fix a non-compliant photo. Crop and set the
        correct background with the{" "}
        <Link href="/passport-photo/">passport photo maker</Link> first, then
        compress the result. Everything runs in your browser — your photo is
        never uploaded to a server.
      </p>
    </BlogPostLayout>
  );
}
