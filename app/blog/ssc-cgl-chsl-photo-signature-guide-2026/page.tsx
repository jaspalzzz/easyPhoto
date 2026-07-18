import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";
import { PORTAL_PRESETS } from "@/lib/portalPresets";

const post = getPost("ssc-cgl-chsl-photo-signature-guide-2026")!;
const spec = PORTAL_PRESETS.ssc;
const sourceUrl = spec.source!.url;

const FAQ_ITEMS = [
  {
    q: "Can I upload a saved photo from my phone gallery for SSC CGL?",
    a: "Not in the current SSC workflow cited here. The application captures the photograph live from a computer or mobile camera rather than accepting a pre-existing photo file. Confirm the notice for your examination cycle before applying.",
  },
  {
    q: "What is the SSC photo file size?",
    a: "The current notice does not publish a photo-file KB band because the photograph is captured live. The 20–50 KB value retained in easyPhoto is clearly marked as a compatibility target, not a current SSC upload requirement.",
  },
  {
    q: "What signature file does the current SSC notice request?",
    a: "It lists a separate JPG/JPEG signature upload of 10–20 KB at about 6.0×2.0 cm. It does not publish fixed signature pixel dimensions or an ink-colour rule in the cited paragraphs.",
  },
  {
    q: "Do SSC CGL and CHSL always use the same instructions?",
    a: "Do not assume that. The cited Combined Hindi Translators 2026 notice establishes the current live-photo workflow and signature upload for that examination. Open the notice for the exact CGL or CHSL cycle before submitting.",
  },
];

export const metadata = pageMetadata({
  title: post.title,
  titleAbsolute: true,
  description: post.description,
  path: `/blog/${post.slug}/`,
  type: "article",
});

export default function Page() {
  return (
    <BlogPostLayout
      slug={post.slug}
      ctaHref="/ssc-signature-resizer/"
      ctaLabel="Prepare the separate SSC signature"
      faqItems={FAQ_ITEMS}
    >
      <p className="text-sm text-ink-soft">Last reviewed: 18 July 2026</p>
      <p>
        Current SSC applications use a live photograph step. The browser opens
        a computer or mobile camera during the application; a saved gallery
        photograph is not uploaded in the workflow described by the cited 2026
        notice. The signature remains a separate prepared JPG/JPEG file.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li><strong>Photograph:</strong> captured live; the cited notice publishes no prepared-photo KB or pixel upload requirement.</li>
          <li><strong>Signature:</strong> {spec.sigMinKb}–{spec.sigLimitKb}&nbsp;KB JPG/JPEG, about 6.0&nbsp;×&nbsp;2.0&nbsp;cm.</li>
          <li>The cited paragraphs publish no fixed photo/signature pixels, DPI, photo aspect ratio, name/date strip or signature ink colour.</li>
          <li>Confirm the notice for the specific SSC examination and cycle before applying.</li>
        </ul>
      </div>

      <h2>What the current SSC instructions actually separate</h2>
      <div className="my-5 overflow-x-auto rounded-xl border border-hairline">
        <table className="min-w-[620px] w-full border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-hairline text-left">
              <th className="px-4 py-3 font-semibold text-ink">Field</th>
              <th className="px-4 py-3 font-semibold text-ink">Photograph</th>
              <th className="px-4 py-3 font-semibold text-ink">Signature</th>
            </tr>
          </thead>
          <tbody className="text-ink-soft">
            {[
              ["Workflow", "Live camera capture", "Prepared file upload"],
              ["Format", "Handled by the capture step", "JPG/JPEG"],
              ["File size", "No upload band published", `${spec.sigMinKb}–${spec.sigLimitKb} KB`],
              ["Dimensions", "No fixed pixels published", "About 6.0×2.0 cm; no fixed pixels published"],
              ["Name/date", "No digital strip listed", "Not applicable"],
            ].map(([field, photo, signature]) => (
              <tr key={field} className="border-b border-hairline/60 last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{field}</td>
                <td className="px-4 py-3">{photo}</td>
                <td className="px-4 py-3">{signature}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Source: the{" "}
        <a href={sourceUrl} className="text-brand underline" target="_blank" rel="noopener noreferrer">
          SSC Combined Hindi Translators Examination 2026 notice, paragraphs 8.4–8.7
        </a>.
      </p>

      <h2>How to approach the live photograph step</h2>
      <p>
        Because the portal controls capture, a prepared photo resizer cannot
        produce the file submitted in that step. Before opening the form, check
        that your camera works, grant the browser camera permission, and follow
        the framing and lighting instructions displayed by the live interface.
        If the preview is unclear, correct the camera setup before confirming.
      </p>
      <p>
        A compatibility photo output on easyPhoto can be used for general
        preparation, but it is not a substitute for the SSC live camera and is
        not evidence that the authority will accept the captured image.
      </p>

      <h2>How to prepare the separate SSC signature</h2>
      <ol>
        <li>Read the current exam notice and follow its signature-writing instructions.</li>
        <li>Use a clear scan or evenly lit photograph with the entire signature visible.</li>
        <li>
          Use the <Link href="/ssc-signature-resizer/">SSC signature resizer</Link>{" "}
          to clean the paper, export JPG and reach the stored {spec.sigMinKb}–{spec.sigLimitKb}&nbsp;KB band.
        </li>
        <li>Check the downloaded file size and open the JPG once before uploading it.</li>
      </ol>
      <p>
        The tool can verify measurable output properties such as file size and
        format. It cannot assess identity, signature authenticity or the
        authority&apos;s final decision.
      </p>

      <h2>What not to carry over from older SSC guides</h2>
      <ul>
        <li>Do not prepare a 20–50 KB photo upload for the current live-capture workflow.</li>
        <li>Do not invent photo or signature pixel dimensions when the notice publishes none.</li>
        <li>Do not add a digital name/date strip; the cited instructions do not request one.</li>
        <li>Do not assume an ink colour or rejection rule that is absent from the current notice.</li>
      </ul>
      <p>
        For a broader comparison of file-upload and live-capture portals, use
        the <Link href="/exam-requirements/">exam requirements directory</Link>{" "}
        and follow the source linked on the selected page.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
