import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";
import { PORTAL_PRESETS } from "@/lib/portalPresets";

const post = getPost("how-to-reduce-passport-photo-size-for-online-forms")!;
const ibps = PORTAL_PRESETS.ibps;

const FAQ_ITEMS = [
  {
    q: "Why is my photo rejected even though it's under the file-size cap?",
    a: "Some forms set a band, not just a ceiling. IBPS wants a photo of 20–50 KB and UPSC 20–200 KB, so a file below the minimum is refused too. SSC takes no photo file at all: its form photographs you live.",
  },
  {
    q: "Should I compress first or crop to the right dimensions first?",
    a: "Crop first. Get the head size and background right with the passport photo maker, then compress the result. Compressing first spends the file size on parts of the picture that will be cut away.",
  },
  {
    q: "How do I handle a signature with a separate size limit?",
    a: "Size it to the signature's own band and pixel size from the same notice. A tightly cropped signature on clean white paper needs far fewer kilobytes than a scan with a wide grey margin.",
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
      <p className="text-sm text-ink-soft">Last updated: 2 November 2026</p>
      <p>
        A phone photo is usually several megabytes, far more than an online form
        allows. When the upload fails with &quot;file too large,&quot; you
        don&apos;t need to retake the photo: compress it to the limit the form
        shows, without turning your face into mush.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>There is no universal limit. Use the minimum, maximum, pixel size and format shown on your form.</li>
          <li>Crop first, then compress to a number inside the band, not to the smallest file you can make.</li>
          <li>Use a tool that hits a KB figure for you rather than guessing with a quality slider.</li>
        </ul>
      </div>

      <h2>How different the limits are</h2>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Form</th>
            <th className="py-2 pr-3 font-semibold text-ink">Photo limit</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["IBPS photo", "20–50 KB, at a preferred 200×230 px"],
            ["SSC photo", "No file: the form takes the photo live"],
            ["OCI online photo", "Square, 200–900 px, JPEG/JPG, up to 200 KB"],
            ["Schengen visa upload", "No EU-wide cap; set by each consulate or VFS form"],
          ].map(([type, limit]) => (
            <tr key={type} className="border-b border-hairline/60">
              <td className="py-2 pr-3 font-medium text-ink">{type}</td>
              <td className="py-2 pr-3">{limit}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Sources:{" "}
        <a href={PORTAL_PRESETS.ssc.source!.url} className="text-brand underline" target="_blank" rel="noopener noreferrer">SSC notice</a>,{" "}
        <a href={ibps.source!.url} className="text-brand underline" target="_blank" rel="noopener noreferrer">IBPS recruitment instructions</a>, and the{" "}
        <a href="https://ociservices.gov.in/onlineOCI/onlineOCI/faq" className="text-brand underline" target="_blank" rel="noopener noreferrer">OCI Services FAQ</a>.
        PAN, voter ID and driving-licence limits are in the{" "}
        <Link href="/blog/indian-government-id-photo-requirements/">government ID photo guide</Link>,
        and exam limits in the{" "}
        <Link href="/blog/exam-photo-signature-size-guide/">exam photo size guide</Link>.
      </p>

      <h2>How to compress without losing sharpness</h2>
      <p>
        Two things set a JPEG&apos;s file size: its pixel size and its quality
        setting. Reduce them only as far as the limit needs, because every step
        down throws away face detail.
      </p>
      <ul>
        <li>Start from the cropped passport photo, not the raw selfie.</li>
        <li>Lower the quality first; shrink the pixel size only if the form allows it.</li>
        <li>Keep it a JPEG when the form allows one. A PNG of the same photo is far larger.</li>
        <li>Stay above the form&apos;s minimum, if it has one.</li>
      </ul>

      <h2>The fast way: enter the KB figure</h2>
      <p>
        Type the limit from your form into the{" "}
        <Link href="/tools/resize-kb/">KB resizer</Link> and it finds the
        quality setting that lands there. Aim a few KB under the maximum, so a
        50&nbsp;KB cap becomes 45–48&nbsp;KB, and never below the minimum.
      </p>
      <p>
        If the form also gives a width and height, make the photo with the{" "}
        <Link href="/passport-photo/">passport size photo maker</Link> for your
        country first, which sets the frame, then compress. For a signature
        upload, the{" "}
        <Link href="/tools/signature-resize/?target=20">signature resizer</Link> does the
        same job. Everything runs in your browser, so your photo is never
        uploaded to a server.
      </p>
      <p>
        After downloading, check the real size: right-click the file and choose
        Get Info (Mac) or Properties (Windows), and confirm it sits inside the
        band.
      </p>

      <h2>When the upload still fails</h2>
      <table className="my-5 w-full border-collapse text-[14px]"><thead><tr className="border-b border-hairline text-left"><th className="py-2 pr-3 font-semibold text-ink">Failure</th><th className="py-2 font-semibold text-ink">Fix</th></tr></thead><tbody className="text-ink-soft">{[
        ["File is under the maximum but still refused", "Check whether the form also sets a minimum, a pixel size or a format."],
        ["Right KB, wrong pixel size", "Set the width and height first, then compress without resizing again."],
        ["PNG still too large", "Save it as a JPG if the form accepts JPG; don't switch format if the form names PNG."],
        ["The form says the file is too small", "Enter a higher KB figure inside the band instead of lowering quality further."],
      ].map(([failure, fix]) => <tr key={failure} className="border-b border-hairline/60"><td className="py-2 pr-3 font-medium text-ink">{failure}</td><td className="py-2">{fix}</td></tr>)}</tbody></table>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
