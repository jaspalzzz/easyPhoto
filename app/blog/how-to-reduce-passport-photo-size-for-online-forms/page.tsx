import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("how-to-reduce-passport-photo-size-for-online-forms")!;

const FAQ_ITEMS = [
  {
    q: "Why is my photo rejected even though it's under the file-size cap?",
    a: "Some portals set a band, not just a ceiling. The verified SSC entry is 20–50 KB, while the verified UPSC entry is 20–300 KB. Use the exact current band for the application instead of assuming all exam portals share one limit.",
  },
  {
    q: "Can I compress a photo without losing face clarity?",
    a: "Compression can preserve usable clarity when the source is sharp, but a tighter target requires more information to be discarded. Use the portal's published minimum as the floor instead of choosing the smallest possible file.",
  },
  {
    q: "Should I compress first or crop to the right dimensions first?",
    a: "Crop first. Start with the passport photo maker to get the correct head ratio and background, then run the result through a KB-target tool. Compressing before cropping wastes file budget on areas that will be cut away.",
  },
  {
    q: "How do I handle a signature with a separate size limit?",
    a: "Prepare it against the signature dimensions, format and KB band published by that portal. A clean, tightly cropped signature generally needs fewer encoded bytes than a scan containing a large grey paper margin.",
  },
];

export const metadata = pageMetadata({
  title: `${post.title}`,
  titleAbsolute: true,
  description: post.description,
  path: `/blog/${post.slug}/`,
  type: "article",
});

export default function Page() {
  return (
    <BlogPostLayout slug={post.slug} faqItems={FAQ_ITEMS}>
      <p className="text-sm text-ink-soft">Last reviewed: 12 July 2026</p>
      <p>
        A phone photo can be much larger than an application portal permits.
        When your upload fails with &quot;file too large,&quot; the fix is
        compression. You don&apos;t need to retake the photo. Here&apos;s how to
        hit an exact KB target without turning your face into mush.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>Use the exact minimum, maximum, dimensions and format shown by the specific application portal; there is no universal government-form limit.</li>
          <li>For example, the verified SSC registry entry is 20–50&nbsp;KB, while OCI uses a square 200–900&nbsp;px JPEG/JPG up to 200&nbsp;KB.</li>
          <li>Use a target-KB tool that finds the right compression automatically — never guess a manual quality slider.</li>
        </ul>
      </div>

      <h2>Verified examples, not generic portal ranges</h2>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Portal type</th>
            <th className="py-2 pr-3 font-semibold text-ink">Typical photo limit</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["SSC photo", "20–50 KB — official SSC source"],
            ["IBPS photo", "20–50 KB — official IBPS source"],
            ["OCI online photo", "Square 200–900 px JPEG/JPG, up to 200 KB — official OCI source"],
            ["Schengen portal upload", "No shared cap in the registry; confirm on the consulate/VFS form"],
          ].map(([type, limit]) => (
            <tr key={type} className="border-b border-hairline/60">
              <td className="py-2 pr-3 font-medium text-ink">{type}</td>
              <td className="py-2 pr-3">{limit}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Always read the form&apos;s instructions. Limits vary, and some portals
        set a minimum as well as a maximum. Official sources:{" "}
        <a href="https://ssc.gov.in" className="text-brand underline" target="_blank" rel="noopener noreferrer">SSC</a>,{" "}
        <a href="https://www.ibps.in" className="text-brand underline" target="_blank" rel="noopener noreferrer">IBPS</a>, and the{" "}
        <a href="https://ociservices.gov.in/onlineOCI/onlineOCI/faq" className="text-brand underline" target="_blank" rel="noopener noreferrer">OCI Services FAQ</a>.
      </p>

      <h2>Concrete output example</h2>
      <p>
        If an OCI application requires its published photo format, prepare a
        square JPEG/JPG between 200×200 and 900×900&nbsp;px and keep it at or
        below 200&nbsp;KB. Compression changes JPEG encoding quality, not the
        square canvas. For SSC, target the verified 20–50&nbsp;KB band instead
        and confirm the current notice on the official SSC source.
      </p>

      <h2>How to compress without losing sharpness</h2>
      <p>
        Two things control a JPEG&apos;s file size: its pixel dimensions and its
        quality setting. The trick is to reduce both just enough to slip under
        the cap while retaining as much face detail as the target permits. A lower
        target necessarily discards more JPEG information, so do not compress below
        the portal&apos;s published minimum.
      </p>
      <ul>
        <li>Start from the properly cropped passport photo, not the raw selfie.</li>
        <li>Lower quality first; only shrink dimensions if you must.</li>
        <li>Keep it a JPEG. PNGs are far larger for photos.</li>
        <li>Don&apos;t over-compress below the portal&apos;s minimum, if it has one.</li>
      </ul>

      <h2>The fast way: target an exact KB</h2>
      <p>
        Instead of guessing quality sliders, use a tool that searches for the
        exact target automatically:
      </p>
      <p>
        Enter the portal&apos;s stated target in the{" "}
        <Link href="/tools/resize-kb/">custom KB resizer</Link>. Do not choose a
        smaller number merely because it is available; a minimum is part of the
        requirement when the registry records one.
      </p>
      <p>
        Need to fit an exact width and height too? Use{" "}
        <Link href="/tools/resize-dimensions/">resize dimensions</Link> first,
        then compress. For a signature upload, the{" "}
        <Link href="/tools/signature-resize/?target=20">signature resizer</Link> does the
        same job while matching the portal&apos;s stated format and size.
      </p>

      <h2>Get the photo right first</h2>
      <p>
        Compression can&apos;t fix a non-compliant photo. Crop and set the
        correct background with the{" "}
        <Link href="/passport-photo/">passport photo maker</Link> first, then
        compress the result. For exact KB and pixel specs by exam, see the{" "}
        <Link href="/exam-requirements/ssc/">SSC requirement page</Link>. Everything runs in your browser, so your photo is
        never uploaded to a server.
      </p>

      <h2>Troubleshooting upload failures</h2>
      <table className="my-5 w-full border-collapse text-[14px]"><thead><tr className="border-b border-hairline text-left"><th className="py-2 pr-3 font-semibold text-ink">Failure</th><th className="py-2 font-semibold text-ink">Fix</th></tr></thead><tbody className="text-ink-soft">{[
        ["File is below the maximum but still rejected", "Check whether the portal also sets a minimum, plus exact pixel and format rules."],
        ["Correct KB, wrong dimensions", "Set the required width and height first, then compress without resizing the canvas again."],
        ["PNG remains too large", "Use JPG only when the published requirement allows JPG; do not silently change a mandated format."],
        ["Text says file is too small", "Increase the target into the published band instead of lowering quality further."],
      ].map(([failure, fix]) => <tr key={failure} className="border-b border-hairline/60"><td className="py-2 pr-3 font-medium text-ink">{failure}</td><td className="py-2">{fix}</td></tr>)}</tbody></table>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
