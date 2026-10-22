import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { getPost } from "@/lib/blog";
import { PORTAL_PRESETS } from "@/lib/portalPresets";
import { SSC_NOTICES, SSC_NOTICE_BASE } from "@/components/site/exam/SscGuide";

/*
 * The live-photo guide for SSC's 2026 applications (owner-approved 15 Oct 2026).
 * The SSC exam page owns "SSC signature size"; this post answers how the photo
 * step works. Every fact matches /exam-requirements/ssc/, which lists SSC's 2026
 * notices read on ssc.gov.in on 8 Oct 2026. No FAQ: each answer would repeat the
 * body (CLAUDE.md §3).
 */
const post = getPost("ssc-cgl-chsl-photo-signature-guide-2026")!;
const spec = PORTAL_PRESETS.ssc;

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
      ctaHref="/exam-requirements/ssc/"
      ctaLabel="Prepare the separate SSC signature"
    >
      <p className="text-sm text-ink-soft">Last reviewed: 15 October 2026</p>
      <p>
        SSC doesn&apos;t take a photo file. In its 2026 applications (CGL, CHSL, CPO, GD, JE, Steno
        and the rest) the form takes your photo live, through your phone or computer camera, while
        you apply. The only image you prepare in advance is your signature.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li><strong>Photo:</strong> taken live in the form, so there is no file and no KB size to meet.</li>
          <li>
            <strong>Signature:</strong> JPEG/JPG, {spec.sigMinKb}–{spec.sigLimitKb}&nbsp;KB, about
            6.0&nbsp;×&nbsp;2.0&nbsp;cm.
          </li>
          <li><strong>Name and date on the photo:</strong> not asked for.</li>
          <li><strong>Exam day:</strong> carry two recent passport-size colour photos.</li>
        </ul>
      </div>

      <h2>Photo and signature side by side</h2>
      <div className="my-5 overflow-x-auto rounded-xl border border-hairline">
        <table className="min-w-[560px] w-full border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-hairline text-left">
              <th className="px-4 py-3 font-semibold text-ink"></th>
              <th className="px-4 py-3 font-semibold text-ink">Photo</th>
              <th className="px-4 py-3 font-semibold text-ink">Signature</th>
            </tr>
          </thead>
          <tbody className="text-ink-soft">
            {[
              ["How it reaches SSC", "Camera, during the application", "A JPEG/JPG file you upload"],
              ["Size", "None to meet", `${spec.sigMinKb}–${spec.sigLimitKb} KB`],
              ["Shape", "Your face inside the on-screen outline", "About 6.0 × 2.0 cm; the portal adds “at 300 DPI”"],
              ["Pixels", "None given", "None given by SSC"],
            ].map(([row, photo, signature]) => (
              <tr key={row} className="border-b border-hairline/60 last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{row}</td>
                <td className="px-4 py-3">{photo}</td>
                <td className="px-4 py-3">{signature}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>How the photo step works</h2>
      <ol>
        <li>Open the form on a computer with a webcam, or on your phone.</li>
        <li>When the form reaches the photo, let the browser use your camera.</li>
        <li>
          Sit facing the camera in good light, in front of a plain background, with the camera at eye
          level and your face inside the outline drawn on screen. Take off any cap, mask, glasses or
          earphones.
        </li>
        <li>Look at the preview. If it is dark or blurred, fix the light and take it again before you confirm.</li>
      </ol>
      <p>
        No webcam? The CGL notice says to scan the QR code on the form&apos;s Upload Documents page,
        install SSC&apos;s app, and take the live photo on your phone instead.
      </p>

      <h2>What gets the photo rejected</h2>
      <ul>
        <li>
          Pointing the camera at a printed photograph. SSC rejects applications whose photo is a
          picture of an existing photo.
        </li>
        <li>
          The faults SSC lists most often: no plain background, a cap, no shirt, too little light, or
          a blurred image.
        </li>
      </ul>
      <p>On exam day you should look like this photo, so take it as you will come.</p>

      <h2>The signature you still upload</h2>
      <p>
        Sign inside a box about 6&nbsp;cm wide and 2&nbsp;cm high on white paper, straight across,
        so the signature fills at least 80% of the box, as SSC advises. Then scan it or take a
        picture of the paper. Candidates with visual disability (PwD-VH) may use a thumb
        impression instead under the CGL, Hindi Translators and Selection Post notices. The{" "}
        <Link href="/exam-requirements/ssc/">SSC signature page</Link> cleans the paper, brings the
        file to {spec.sigMinKb}–{spec.sigLimitKb}&nbsp;KB and lists every 2026 SSC notice it is
        checked against.
      </p>

      <h2>Applying with Aadhaar authentication</h2>
      <p>
        SSC says an application made with Aadhaar-based authentication is not rejected over the
        photo or signature format. The Constable (GD) notice doesn&apos;t repeat this for the photo,
        so don&apos;t count on it there.
      </p>

      <h2>Which 2026 notices this covers</h2>
      <p>Every one of these SSC notices sets the same signature rule and the same camera photo:</p>
      <ul>
        {SSC_NOTICES.map((n) => (
          <li key={n.file}>
            <a href={`${SSC_NOTICE_BASE}${n.file}`} className="text-brand underline" target="_blank" rel="noopener noreferrer">
              {n.exam}
            </a>
            , notice of {n.date}
          </li>
        ))}
      </ul>

      <h2>What not to carry over from older SSC guides</h2>
      <ul>
        <li>Don&apos;t prepare a 20–50 KB photo file: the photo is live now.</li>
        <li>Don&apos;t resize your signature to a pixel size such as 140 × 60; SSC&apos;s notice gives centimetres, not pixels.</li>
        <li>Don&apos;t add a name-and-date strip to anything.</li>
      </ul>

    </BlogPostLayout>
  );
}
