import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { getPost } from "@/lib/blog";

const post = getPost("why-exam-photo-signature-rejected")!;

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
        You upload your photo to the SSC or IBPS portal, click submit, and the
        page throws it back: <em>&quot;Photo is not as per specification.&quot;</em>{" "}
        No detail, no reason — just a red error and a closing deadline. The good
        news: portals reject for a small, predictable set of reasons, and every
        one has a quick fix. Here&apos;s the full list.
      </p>

      <h2>1. The file size is wrong — too big or too small</h2>
      <p>
        This is the single most common rejection. Exam portals specify a{" "}
        <strong>band</strong>, not just a ceiling — SSC wants the photo between
        20 and 50&nbsp;KB, the signature between 10 and 20&nbsp;KB. A 2&nbsp;MB
        phone photo is rejected for being too large; a heavily compressed
        12&nbsp;KB one is rejected for being <em>too small</em>. Most people only
        fix the &quot;too big&quot; half and get caught by the floor.
      </p>
      <p>
        <strong>Fix:</strong> use a resizer that targets the exact band, not just
        a maximum. Pick your exam from the{" "}
        <Link href="/exam-requirements/">exam requirements directory</Link> — for
        example the{" "}
        <Link href="/exam-resizer/ssc-cgl/">SSC CGL resizer</Link> or{" "}
        <Link href="/exam-resizer/ibps-po/">IBPS PO resizer</Link> — and it lands
        your file inside the band automatically.
      </p>

      <h2>2. The pixel dimensions or aspect ratio don&apos;t match</h2>
      <p>
        Portals check width × height, not just KB. SSC expects roughly
        350×450&nbsp;px (a 3.5:4.5 ratio); a square crop or a landscape selfie is
        rejected even at the right file size. Cropping your face out of a wider
        photo usually leaves the wrong shape.
      </p>
      <p>
        <strong>Fix:</strong> the exam resizers above keep the correct dimensions
        and never shrink below the portal&apos;s pixel minimum — so the shape is
        right and the photo isn&apos;t too small to read.
      </p>

      <h2>3. The signature has paper or shadow behind it</h2>
      <p>
        Signature uploads are rejected when the scan shows the grey of the paper,
        a shadow, or a coloured background instead of clean ink on white. Portals
        expect a crisp black-or-blue signature on a plain white field.
      </p>
      <p>
        <strong>Fix:</strong> clean it before uploading. The{" "}
        <Link href="/tools/signature-resize/">signature tool</Link> removes the
        paper background, trims the empty space around your signature, and
        compresses it into the required KB band in one step.
      </p>

      <h2>4. The wrong file format</h2>
      <p>
        Nearly every Indian portal wants <strong>JPG/JPEG</strong>. A PNG, a
        WebP, or an iPhone HEIC file is rejected at upload — and phones now shoot
        HEIC by default, so this catches a lot of people without warning.
      </p>
      <p>
        <strong>Fix:</strong> our tools output JPG automatically. If you have a
        HEIC or PNG from elsewhere, the{" "}
        <Link href="/convert/">format converter</Link> turns it into a clean JPG
        first.
      </p>

      <h2>5. Missing name and date on the photo</h2>
      <p>
        UPSC, the Indian Army and a few others require your name and the date the
        photo was taken to be <em>printed on the photo itself</em>. A perfectly
        sized photo without that text is rejected at document verification.
      </p>
      <p>
        <strong>Fix:</strong> add it cleanly with the{" "}
        <Link href="/tools/photo-with-name-date/">name &amp; date photo tool</Link>{" "}
        — no Photoshop needed. (We wrote a{" "}
        <Link href="/blog/add-name-date-on-exam-photo/">step-by-step guide</Link>{" "}
        for this one.)
      </p>

      <h2>6. The background or the photo itself</h2>
      <p>
        A non-white background, heavy shadows, glasses glare, a smiling
        expression, or an old/blurry photo will fail a manual check even when the
        file specs are perfect. These can&apos;t be fixed by resizing — they need
        a better source photo (plain wall, even light, neutral face).
      </p>

      <h2>The reliable order of operations</h2>
      <p>
        To avoid the back-and-forth entirely, prepare the file before you open
        the form:
      </p>
      <ul>
        <li>Take a clear, front-facing photo against a plain, evenly lit wall.</li>
        <li>
          Run it through your exam&apos;s resizer so the size, KB band and format
          are all correct at once.
        </li>
        <li>Clean and size your signature the same way.</li>
        <li>Add name and date if your exam requires it.</li>
      </ul>
      <p>
        Everything runs entirely in your browser — your photo and signature are
        never uploaded to a server. Find your exact requirement in the{" "}
        <Link href="/exam-requirements/">exam requirements directory</Link>, each
        linked to the official notification so you can confirm before you submit.
      </p>
    </BlogPostLayout>
  );
}
