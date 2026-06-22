import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
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
    <BlogPostLayout slug={post.slug} ctaHref="/tools/exam-package/" ctaLabel="Prepare your exam photo">
      <p>
        You upload your photo to the{" "}
        <a href="https://ssc.gov.in" className="text-brand underline" target="_blank" rel="noopener noreferrer">SSC</a>{" "}
        or{" "}
        <a href="https://ibps.in" className="text-brand underline" target="_blank" rel="noopener noreferrer">IBPS</a>{" "}
        portal, click submit, and the
        page throws it back: <em>&quot;Photo is not as per specification.&quot;</em>{" "}
        No detail, no reason — just a red error and a closing deadline. The good
        news: portals reject for a small, predictable set of reasons, and every
        one has a quick fix. Here&apos;s the full list.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>Six reasons cover almost every rejection: <strong>file size band</strong>, wrong dimensions, signature background, wrong format, missing name/date, photo quality.</li>
          <li>Most are fixed by running your files through the correct exam-specific resizer <em>before</em> you open the form.</li>
          <li>Check the exact spec at the <Link href="/exam-requirements/" className="text-brand underline">exam requirements directory</Link> — each entry links the official notification.</li>
        </ul>
      </div>

      <h2>All six rejection reasons at a glance</h2>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Rejection reason</th>
            <th className="py-2 pr-3 font-semibold text-ink">Fix</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">File size out of band</td>
            <td className="py-2 pr-3">Use an exam-specific resizer targeting the exact KB band (e.g. 20–50 KB)</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Wrong pixel dimensions or aspect ratio</td>
            <td className="py-2 pr-3">Exam resizer applies the correct width×height automatically</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Signature has paper / grey background</td>
            <td className="py-2 pr-3">Signature tool removes the background; clean white result compresses smaller</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Wrong file format (HEIC, PNG, WebP)</td>
            <td className="py-2 pr-3">Tools output JPG automatically; format converter for HEIC from iPhone</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Missing name and date on photo</td>
            <td className="py-2 pr-3">Add a clean strip with the name &amp; date photo tool (UPSC, Army only)</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Photo quality (background, shadows, glasses)</td>
            <td className="py-2 pr-3">Retake against a plain, evenly lit wall — compression cannot fix a bad source photo</td>
          </tr>
        </tbody>
      </table>

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
        <strong>Fix:</strong> use a resizer that targets the exact band. Pick your
        exam from the{" "}
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
        rejected even at the right file size.
      </p>
      <p>
        <strong>Fix:</strong> the exam resizers apply the correct dimensions and
        never shrink below the portal&apos;s pixel minimum.
      </p>

      <h2>3. The signature has paper or shadow behind it</h2>
      <p>
        Signature uploads are rejected when the scan shows the grey of the paper,
        a shadow, or a coloured background instead of clean ink on white. Portals
        expect a crisp black-or-blue signature on a plain white field.
      </p>
      <p>
        <strong>Fix:</strong> the{" "}
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
        <Link href="/tools/photo-with-name-date/">name &amp; date photo tool</Link>.
        See the{" "}
        <Link href="/blog/add-name-date-on-exam-photo/">step-by-step guide</Link>{" "}
        for details.
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

      <div className="mt-12">
        <Faq items={[
          {
            q: "Why does the portal say 'photo not as per specification' without explaining why?",
            a: "Indian exam portals run automated validators that check file size, dimensions, format and sometimes image colour distribution. When any check fails, they return a generic rejection string rather than listing which check failed. Work through the six reasons above in order — file size band first, then format, then dimensions.",
          },
          {
            q: "What is the most common reason exam photo uploads fail?",
            a: "File size out of band. Most people know to compress a photo if it's too large, but they don't know portals also enforce a minimum. A photo compressed to 12 KB is rejected just as firmly as a 2 MB one. Use a resizer that targets the exact 20–50 KB band.",
          },
          {
            q: "My phone saves photos as HEIC. How do I convert them to JPG for the portal?",
            a: "On iPhone, go to Settings → Camera → Formats and switch from High Efficiency (HEIC) to Most Compatible (JPEG) before taking the photo. For existing HEIC files, use the easyPhoto format converter — it outputs a standard JPG ready for any exam portal.",
          },
          {
            q: "Can I fix a photo that already has shadows or a non-white background?",
            a: "Sometimes. The white background tool can replace an off-white or lightly coloured background with clean white. But heavy shadows on the face itself, a cluttered background or a blurry photo need a retake — no tool can recover lost detail from a poorly lit source image.",
          },
        ]} />
      </div>
    </BlogPostLayout>
  );
}
