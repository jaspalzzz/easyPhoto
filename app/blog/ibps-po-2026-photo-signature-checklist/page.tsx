import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { getPost } from "@/lib/blog";

const post = getPost("ibps-po-2026-photo-signature-checklist")!;

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
        Per the official IBPS calendar, the <strong>IBPS PO 2026 prelims are on
        22–23 August</strong>, with registration opening on the notification a
        few weeks before. The application window is short, the server is busy,
        and the most common reason people lose time is a photo or signature the
        portal won&apos;t accept. The fix is to prepare both <em>now</em>, while
        there&apos;s no deadline pressure. Here&apos;s the full checklist.
      </p>

      <h2>The IBPS PO photo &amp; signature spec</h2>
      <ul>
        <li>
          <strong>Photo:</strong> JPEG, 20–50&nbsp;KB, roughly 200×230&nbsp;px,
          plain light background, recent and clear.
        </li>
        <li>
          <strong>Signature:</strong> JPEG, 10–20&nbsp;KB, black ink on white
          paper, scanned cleanly.
        </li>
        <li>
          <strong>Format:</strong> JPG/JPEG only — a PNG or an iPhone HEIC file
          is rejected at upload.
        </li>
      </ul>
      <p>
        These are a band, not just a maximum — a file <em>under</em> 20&nbsp;KB
        is rejected too. Always confirm the exact numbers on the live
        notification; you can cross-check them any time on the{" "}
        <Link href="/exam-requirements/ibps/">IBPS requirements page</Link>, which
        links the official source.
      </p>

      <h2>The checklist, in order</h2>
      <ul>
        <li>
          <strong>1. Take the photo now.</strong> Plain wall, even light, neutral
          face, both ears visible, no cap or tinted glasses.
        </li>
        <li>
          <strong>2. Size the photo.</strong> Run it through the{" "}
          <Link href="/exam-resizer/ibps-po/">IBPS PO resizer</Link> — it lands
          the file in the 20–50&nbsp;KB band at the right dimensions and outputs
          JPG, all in your browser.
        </li>
        <li>
          <strong>3. Sign on white paper</strong> in black ink, fairly large, and
          photograph or scan it in good light.
        </li>
        <li>
          <strong>4. Clean and size the signature.</strong> The same{" "}
          <Link href="/exam-resizer/ibps-po/">resizer</Link> has a signature tab
          that removes the paper background, trims the edges, and compresses it
          to 10–20&nbsp;KB.
        </li>
        <li>
          <strong>5. Save both files</strong> somewhere you&apos;ll find them on
          application day — and you&apos;re ready to upload in minutes.
        </li>
      </ul>

      <h2>Do it once, reuse it everywhere</h2>
      <p>
        The IBPS PO spec is shared across IBPS Clerk, SO and RRB, and is close to
        the SBI and SSC bands. A clean 20–50&nbsp;KB photo and 10–20&nbsp;KB
        signature will serve most banking and SSC applications this cycle — so
        the work you do for IBPS PO pays off across several forms. If you&apos;re
        applying to more than one, the{" "}
        <Link href="/tools/exam-package/">Exam Application Kit</Link> prepares a
        photo + signature for any chosen exam in one guided flow.
      </p>

      <h2>Don&apos;t miss the window</h2>
      <p>
        IBPS PO is just one of several exams opening this season. The{" "}
        <Link href="/exam-calendar/">exam calendar</Link> lists the upcoming
        notification and exam dates from the official SSC, UPSC and IBPS
        calendars — and you can add them to your own phone&apos;s calendar so a
        reminder lands before each window opens.
      </p>
      <p>
        For the reasons applications get bounced even when the file looks right,
        see{" "}
        <Link href="/blog/why-exam-photo-signature-rejected/">
          why exam photos and signatures get rejected
        </Link>
        .
      </p>
    </BlogPostLayout>
  );
}
