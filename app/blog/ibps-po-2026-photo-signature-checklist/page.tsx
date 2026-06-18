import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
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
    <BlogPostLayout slug={post.slug} ctaHref="/ibps-photo-resizer/" ctaLabel="Resize your IBPS photo">
      <p>
        Per the official IBPS calendar, the <strong>IBPS PO 2026 prelims are on
        22–23 August</strong>, with registration opening on the notification a
        few weeks before. The application window is short, the server is busy,
        and the most common reason people lose time is a photo or signature the
        portal won&apos;t accept. The fix is to prepare both <em>now</em>, while
        there&apos;s no deadline pressure. Here&apos;s the full checklist.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li><strong>Photo:</strong> JPG, 20–50&nbsp;KB, ~200×230&nbsp;px, plain light background.</li>
          <li><strong>Signature:</strong> JPG, 10–20&nbsp;KB, black ink on white paper.</li>
          <li>Both must fall <em>within</em> the band — a 12&nbsp;KB file is rejected just like a 2&nbsp;MB one.</li>
          <li>Confirm exact specs on the live IBPS notification at{" "}
            <a href="https://www.ibps.in" className="text-brand underline" target="_blank" rel="noopener noreferrer">ibps.in</a>{" "}
            before applying.</li>
        </ul>
      </div>

      <h2>The IBPS PO photo &amp; signature spec</h2>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Field</th>
            <th className="py-2 pr-3 font-semibold text-ink">Photo</th>
            <th className="py-2 pr-3 font-semibold text-ink">Signature</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Format</td>
            <td className="py-2 pr-3">JPG / JPEG only</td>
            <td className="py-2 pr-3">JPG / JPEG only</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">File size</td>
            <td className="py-2 pr-3">20–50 KB</td>
            <td className="py-2 pr-3">10–20 KB</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Typical dimensions</td>
            <td className="py-2 pr-3">~200×230 px</td>
            <td className="py-2 pr-3">~140×60 px</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Background</td>
            <td className="py-2 pr-3">Plain light background</td>
            <td className="py-2 pr-3">White paper, clean scan</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Ink colour</td>
            <td className="py-2 pr-3">—</td>
            <td className="py-2 pr-3">Black or blue</td>
          </tr>
        </tbody>
      </table>
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
        signature will serve most banking and SSC applications this cycle. If
        you&apos;re applying to more than one, the{" "}
        <Link href="/tools/exam-package/">Exam Application Kit</Link> prepares a
        photo + signature for any chosen exam in one guided flow. Applying to SSC
        as well? Note that the SSC portal uses live webcam capture rather than file
        upload — see the{" "}
        <Link href="/blog/ssc-cgl-chsl-photo-signature-guide-2026/">SSC CGL / CHSL photo and signature guide</Link>{" "}
        for the full details.
      </p>

      <h2>Don&apos;t miss the window</h2>
      <p>
        The{" "}
        <Link href="/exam-calendar/">exam calendar</Link> lists the upcoming
        notification and exam dates from the official SSC, UPSC and IBPS
        calendars — and you can add them to your phone&apos;s calendar so a
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

      <div className="mt-12">
        <Faq items={[
          {
            q: "What are the IBPS PO 2026 photo size requirements?",
            a: "The IBPS PO portal typically requires a JPG photo between 20 and 50 KB and approximately 200×230 pixels, with a plain light background. Always verify the exact numbers in the live official notification at ibps.in before applying, as they can vary slightly between cycles.",
          },
          {
            q: "Can I use a PNG or HEIC file for the IBPS portal?",
            a: "No. The IBPS portal accepts JPG/JPEG only. A PNG or HEIC file (the default format on iPhones) will be rejected at upload. The IBPS PO resizer on easyPhoto automatically outputs JPG, so no separate conversion is needed.",
          },
          {
            q: "What happens if my photo is under 20 KB?",
            a: "It is rejected. The portal enforces a minimum as well as a maximum — a 12 KB file is considered too low-quality. Use a resizer that targets the 20–50 KB band specifically, not one that just compresses to the smallest possible size.",
          },
          {
            q: "Can I reuse the same photo and signature for IBPS Clerk and SBI PO?",
            a: "Usually yes. IBPS Clerk, IBPS RRB, and SBI PO all use the same 20–50 KB photo and 10–20 KB signature specs. A file prepared for IBPS PO will pass the other portals too, as long as you confirm each notification before applying.",
          },
        ]} />
      </div>
    </BlogPostLayout>
  );
}
