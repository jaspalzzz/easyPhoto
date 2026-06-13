import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { getPost } from "@/lib/blog";

const post = getPost("add-name-date-on-exam-photo")!;

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
        Some application forms don&apos;t just want a photo — they want your{" "}
        <strong>name and the date the photo was taken printed on the photo
        itself</strong>. UPSC and the Indian Army are the best-known examples,
        and a photo without that text gets rejected at document verification even
        if its size and dimensions are perfect. Here&apos;s exactly what they
        ask for and how to add it in under a minute, without Photoshop.
      </p>

      <h2>Which exams require name and date on the photo</h2>
      <ul>
        <li>
          <strong>UPSC</strong> (Civil Services, NDA, CDS and others) — the photo
          must carry your name and the date of the photograph along the bottom.
        </li>
        <li>
          <strong>Indian Army / Agniveer</strong> — name and photo date printed
          on the photo; it&apos;s checked at every stage of recruitment.
        </li>
        <li>
          <strong>Some banking and state forms</strong> — a few request it; the
          notification will say &quot;photograph with name and date&quot; if so.
        </li>
      </ul>
      <p>
        If your exam&apos;s notification doesn&apos;t mention it, you don&apos;t
        need it — adding text to a photo that should be plain can itself cause a
        rejection. When in doubt, check your exam in the{" "}
        <Link href="/exam-requirements/">requirements directory</Link>.
      </p>

      <h2>What the text actually needs to look like</h2>
      <p>
        The rules are simple but specific: your full name and the date should be
        clearly legible, in a plain dark font, on a light strip at the bottom of
        the photo — without covering your face or shoulders. The date is the day
        the photo was <em>taken</em>, not the day you apply. Handwriting it after
        printing is allowed for the paper form, but for online uploads the text
        needs to be part of the image.
      </p>

      <h2>Why people struggle with this</h2>
      <p>
        The usual advice is &quot;open it in MS Paint and type the text,&quot;
        which is fiddly on a phone, easy to misalign, and often leaves the text
        too small to read or overlapping the chin. Then the photo still has to be
        resized to the exam&apos;s KB and dimensions afterward — two separate
        chores.
      </p>

      <h2>The one-minute way</h2>
      <p>
        The{" "}
        <Link href="/tools/photo-with-name-date/">photo with name &amp; date tool</Link>{" "}
        does both at once. You:
      </p>
      <ul>
        <li>Drop in your photo.</li>
        <li>Type your name; the date defaults to today (taken date) and is editable.</li>
        <li>It places a clean, legible strip at the bottom without touching your face.</li>
        <li>Download — already a JPG, ready to resize for your exam.</li>
      </ul>
      <p>
        It runs entirely in your browser, so your photo is never uploaded. There
        is a dedicated{" "}
        <Link href="/ssc-photo-with-name-date/">SSC name-and-date photo page</Link>{" "}
        too, preset for that format.
      </p>

      <h2>Then size it for your exam</h2>
      <p>
        Once the name and date are on the photo, run it through your exam&apos;s
        resizer so the file lands in the right KB band and dimensions — for
        instance the{" "}
        <Link href="/exam-resizer/upsc-cse/">UPSC resizer</Link> or the{" "}
        <Link href="/exam-resizer/upsc-nda/">UPSC NDA resizer</Link>. That order —
        text first, resize second — keeps the text crisp and the file compliant.
      </p>

      <p>
        Worried about other reasons a photo gets sent back? We listed every
        common one in{" "}
        <Link href="/blog/why-exam-photo-signature-rejected/">
          why exam photos and signatures get rejected
        </Link>
        .
      </p>
    </BlogPostLayout>
  );
}
