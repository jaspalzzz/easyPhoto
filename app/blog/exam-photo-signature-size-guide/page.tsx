import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
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

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>Most exams want a <strong>20–50&nbsp;KB photo</strong> and a <strong>10–20&nbsp;KB signature</strong>, both in JPG format.</li>
          <li>Portals check a <em>band</em>, not just a cap — a 12&nbsp;KB photo is rejected for being too small.</li>
          <li>Always confirm the exact numbers in the official exam notification before applying.</li>
        </ul>
      </div>

      <h2>Typical specs by exam</h2>
      <p>
        The exact numbers change between notification cycles, so always confirm in
        the official notification — but these are the typical ranges:
      </p>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Exam</th>
            <th className="py-2 pr-3 font-semibold text-ink">Photo (KB)</th>
            <th className="py-2 pr-3 font-semibold text-ink">Signature (KB)</th>
            <th className="py-2 pr-3 font-semibold text-ink">Format</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">SSC (CGL, CHSL, MTS)</td>
            <td className="py-2 pr-3">20–50 KB</td>
            <td className="py-2 pr-3">10–20 KB</td>
            <td className="py-2 pr-3">JPG</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">IBPS / SBI (PO, Clerk)</td>
            <td className="py-2 pr-3">20–50 KB</td>
            <td className="py-2 pr-3">10–20 KB</td>
            <td className="py-2 pr-3">JPG</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Railway RRB (NTPC, ALP)</td>
            <td className="py-2 pr-3">20–50 KB</td>
            <td className="py-2 pr-3">10–20 KB</td>
            <td className="py-2 pr-3">JPG</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">UPSC (CSE, NDA, CDS)</td>
            <td className="py-2 pr-3">varies by notification</td>
            <td className="py-2 pr-3">varies by notification</td>
            <td className="py-2 pr-3">JPG</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">NTA (NEET, JEE)</td>
            <td className="py-2 pr-3">10–200 KB</td>
            <td className="py-2 pr-3">4–30 KB</td>
            <td className="py-2 pr-3">JPG / PNG</td>
          </tr>
        </tbody>
      </table>

      <h2>The general rule</h2>
      <p>
        Most exam forms want a recent passport-style <strong>photo around 20–50&nbsp;KB</strong>{" "}
        and a <strong>signature around 10–20&nbsp;KB</strong>, each within set pixel
        dimensions, in JPG format. The signature must be on a clean background —
        sign on white paper in black or blue ink, then scan or photograph it.
      </p>

      <h2>How to resize your photo and signature</h2>
      <p>
        You don&apos;t need to look up every number. Pick your exam in the{" "}
        <Link href="/tools/exam-package/">Exam Application Kit</Link> and it sets the
        right photo and signature size for you in one flow. Prefer to do them
        separately? Use the per-exam resizers, such as the{" "}
        <Link href="/ssc-photo-resizer/">SSC photo resizer</Link> or{" "}
        <Link href="/upsc-photo-resizer/">UPSC photo resizer</Link>.
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
        <li>The file is under the minimum — portals check both ends of the band.</li>
        <li>The signature has a white background box — use a transparent or cleaned version.</li>
        <li>Wrong dimensions — match the pixel size the form asks for.</li>
        <li>Old or unclear photo — use a recent, well-lit, front-facing one.</li>
      </ul>

      <div className="mt-12">
        <Faq items={[
          {
            q: "Why do exam portals set a minimum file size as well as a maximum?",
            a: "A minimum KB floor ensures the image has enough data to be clearly readable on screen and printable on the admit card. A photo compressed below ~10 KB at 200×230 px becomes noticeably blurry. The band (e.g. 20–50 KB) ensures images are both small enough to upload and sharp enough to verify identity.",
          },
          {
            q: "Can I use the same photo for multiple exams?",
            a: "Usually yes, if the specs are similar. SSC, IBPS, SBI and Railway exams all use roughly the same 20–50 KB, JPG, 200×230 px band. A photo that passes one will pass the others. UPSC and NTA use different ranges, so check each notification separately.",
          },
          {
            q: "My signature scan looks grey — will it be rejected?",
            a: "Yes, if the portal's validator expects a clean white background. A grey or shadowed scan is a common rejection reason. Use the signature resizer: it removes the paper background and trims to a tight bounding box, resulting in a much smaller and cleaner file.",
          },
          {
            q: "What format does the signature need to be in?",
            a: "JPG for almost all Indian portals, including SSC, IBPS, SBI and Railway. NTA (NEET/JEE) accepts JPG or PNG. A transparent PNG signature may be rejected by portals expecting a white-background JPG, so confirm in the notification and convert if needed.",
          },
        ]} />
      </div>
    </BlogPostLayout>
  );
}
