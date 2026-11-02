import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";
import { PORTAL_PRESETS } from "@/lib/portalPresets";
import {
  EXAM_GUIDE_ROWS,
  EXAM_SIZE_GUIDE_FAQ_ITEMS,
} from "@/lib/examGuideCopy";

const post = getPost("exam-photo-signature-size-guide")!;

const FAQ_ITEMS = EXAM_SIZE_GUIDE_FAQ_ITEMS;

export const metadata = pageMetadata({
  title: post.title,
  titleAbsolute: true,
  description: post.description,
  path: `/blog/${post.slug}/`,
  type: "article",
});

export default function Page() {
  return (
    <BlogPostLayout slug={post.slug} ctaHref="/tools/exam-package/" ctaLabel="Prepare your exam photo" faqItems={FAQ_ITEMS}>
      <p className="text-sm text-ink-soft">Last updated: 2 November 2026</p>
      <p>
        Exam applications differ: some accept a prepared photo file, while
        current SSC and RRB instructions capture the photograph live and ask for a
        separate signature file. This guide sets the published sizes side by
        side, explains how a KB band works, and lists what to check before you
        open the form.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>IBPS and several bank forms publish a <strong>20–50&nbsp;KB JPG photo</strong> and a <strong>10–20&nbsp;KB JPG signature</strong>.</li>
          <li>Current SSC and RRB notices use live photo capture; prepare the separately listed signature file instead.</li>
          <li>Portals check a <em>band</em>: a photo under the minimum is rejected as firmly as one over the cap.</li>
          <li>UPSC and NDA/CDS use a wider <strong>20–200&nbsp;KB</strong> photo range with no fixed pixel size, a live photo during the application, and a <strong>20–100&nbsp;KB</strong> three-signature sheet of 350–500 pixels.</li>
          <li>The NEET-UG bulletin lists a 10–200&nbsp;KB JPG photo and a 10–100&nbsp;KB JPG signature.</li>
        </ul>
      </div>

      <div className="my-6 rounded-xl border border-brand/20 bg-brand-soft/10 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Resize your photo or signature right now</p>
        <p className="!mt-1 text-[15px] text-ink-soft">
          Pick your exam and the tool uses the KB band and pixel size that exam publishes. No sign-up, nothing uploaded.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/exam-requirements/ssc/" className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white">SSC</Link>
          <Link href="/exam-requirements/ibps/" className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white">IBPS / SBI</Link>
          <Link href="/exam-requirements/upsc/" className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white">UPSC</Link>
          <Link href="/tools/exam-package/" className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white">All exams →</Link>
        </div>
      </div>

      <h2>How the KB band works — and why there&apos;s a minimum</h2>
      <p>
        Most candidates know about the upper KB limit. What catches people out is
        the lower limit. A file compressed too aggressively — say, a 200×230&nbsp;px
        JPG saved at 5&nbsp;KB — loses so much detail that it becomes blurry and
        unreadable on the admit card, and the form refuses it with the same
        &ldquo;file not as per specification&rdquo; error as an over-large file.
      </p>
      <p>
        If your compressed photo lands outside the band, resize it to a number
        inside the band rather than nudging a general &ldquo;reduce
        quality&rdquo; slider, which can&apos;t promise a particular file size.
      </p>

      <figure className="my-7 overflow-hidden rounded-xl border border-hairline">
        <Image
          src="/images/exam-photo-signature-size-guide.webp"
          alt="Prepared exam photo comparison showing a plain-background 50 KB example beside a dark-background oversized example"
          width={760}
          height={760}
          className="w-full h-auto"
        />
        <figcaption className="bg-accent/30 px-4 py-2.5 text-center text-[12px] text-muted-foreground">
          Illustration of a prepared photo file. Exams that take a live photo use the camera step in the form instead.
        </figcaption>
      </figure>

      <figure className="my-8">
        <svg viewBox="0 0 760 310" role="img" aria-label="Exam photo and signature limit comparison for SSC, IBPS, UPSC and NTA" style={{maxWidth:"100%",height:"auto",fontFamily:"system-ui,sans-serif"}}>
          <title>Exam Photo Spec Comparison</title>
          <desc>Comparison of photo steps and signature KB limits: SSC uses live photo capture with a 20KB signature cap; IBPS PO, UPSC CSE and NTA NEET use the listed prepared-file ranges.</desc>
          {/* Header */}
          <rect x="0" y="0" width="760" height="42" fill="#163A6B" rx="10"/>
          <text x="380" y="27" textAnchor="middle" fill="#F4C63F" fontSize="14" fontWeight="700">Exam Photo &amp; Signature KB Limits — Quick Comparison</text>
          {/* Grid lines */}
          {[50,100,150,200,250,300].map(v => (
            <g key={v}>
              <line x1={200 + v * 1.4} y1="52" x2={200 + v * 1.4} y2="295" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
              <text x={200 + v * 1.4} y="305" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.5">{v}KB</text>
            </g>
          ))}
          {/* Rows */}
          {EXAM_GUIDE_ROWS.filter((row) =>
            ["ssc", "ibps", "upsc", "nta"].includes(row.id)
          ).map((row, i) => {
            const y = 62 + i * 55;
            return (
              <g key={row.id}>
                <text x="195" y={y + 12} textAnchor="end" fontSize="11.5" fontWeight="600" fill="currentColor">{row.label}</text>
                {/* Photo bar */}
                <rect x="200" y={y} width={row.photoLimitForChart * 1.4} height="16" rx="3" fill="#163A6B" opacity="0.85"/>
                <text x={200 + row.photoLimitForChart * 1.4 + 5} y={y + 12} fontSize="10" fill="currentColor" opacity="0.7">
                  {row.photoLimitForChart
                    ? `Photo ${row.photoLimitForChart}KB · ${row.photoDimensions}`
                    : "Photo · live capture"}
                </text>
                {/* Sig bar */}
                <rect x="200" y={y + 20} width={row.signatureLimitForChart * 1.4} height="12" rx="3" fill="#F4C63F" opacity="0.8"/>
                <text x={200 + row.signatureLimitForChart * 1.4 + 5} y={y + 30} fontSize="9.5" fill="currentColor" opacity="0.6">
                  {`Sig ${row.signatureLimitForChart}KB · ${row.signatureDimensions}`}
                </text>
              </g>
            );
          })}
          {/* Legend */}
          <rect x="200" y="276" width="12" height="8" rx="1" fill="#163A6B" opacity="0.85"/>
          <text x="218" y="284" fontSize="9.5" fill="currentColor" opacity="0.6">Photo limit</text>
          <rect x="280" y="276" width="12" height="8" rx="1" fill="#F4C63F" opacity="0.8"/>
          <text x="298" y="284" fontSize="9.5" fill="currentColor" opacity="0.6">Signature limit</text>
          <text x="380" y="305" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.4">Source: ssc.gov.in, ibps.in, upsc.gov.in, nta.ac.in — verify current notification</text>
        </svg>
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">KB limits vary by exam cycle — always confirm in the official notification PDF.</figcaption>
      </figure>

      <h2>Spec table: photo and signature requirements by exam</h2>
      <p>
        The table distinguishes prepared-file requirements from live capture and
        omits photo pixels where the current cited source publishes none. Always
        confirm the active notification before applying. Sources:{" "}
        <a href="https://ssc.gov.in" className="text-brand underline" target="_blank" rel="noopener noreferrer">SSC</a>,{" "}
        <a href="https://ibps.in" className="text-brand underline" target="_blank" rel="noopener noreferrer">IBPS</a>,{" "}
        <a href="https://sbi.bank.in/web/careers" className="text-brand underline" target="_blank" rel="noopener noreferrer">SBI</a>,{" "}
        <a href="https://upsc.gov.in" className="text-brand underline" target="_blank" rel="noopener noreferrer">UPSC</a>,{" "}
        <a href="https://indianrailways.gov.in" className="text-brand underline" target="_blank" rel="noopener noreferrer">Railways</a>,{" "}
        <a href="https://nta.ac.in" className="text-brand underline" target="_blank" rel="noopener noreferrer">NTA</a>.
      </p>
      <div className="my-5 overflow-x-auto rounded-xl border border-hairline text-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-hairline bg-accent/30">
              <th className="px-3 py-2 text-left font-semibold text-ink">Exam</th>
              <th className="px-3 py-2 text-left font-semibold text-ink">Photo (KB)</th>
              <th className="px-3 py-2 text-left font-semibold text-ink">Photo (px)</th>
              <th className="px-3 py-2 text-left font-semibold text-ink">Signature (KB)</th>
              <th className="px-3 py-2 text-left font-semibold text-ink">Sig (px)</th>
              <th className="px-3 py-2 text-left font-semibold text-ink">Format</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline text-ink-soft">
            {EXAM_GUIDE_ROWS.map((row) => (
              <tr key={row.id}>
                <td className="px-3 py-2 font-medium text-ink">{row.label}</td>
                <td className="px-3 py-2">{row.photo}</td>
                <td className="px-3 py-2">{row.photoDimensions}</td>
                <td className="px-3 py-2">{row.signature}</td>
                <td className="px-3 py-2">{row.signatureDimensions}</td>
                <td className="px-3 py-2">{row.format}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="border-t border-hairline px-4 py-2 text-xs text-muted-foreground">
          Each row follows the notice linked on that exam&apos;s page. Rules can change between cycles, so open the current notice before you apply.
        </p>
      </div>

      <h2>SSC exams: CGL, CHSL, MTS and CAPF</h2>
      <p>
        The{" "}
        <a href="https://ssc.gov.in" className="text-brand underline" target="_blank" rel="noopener noreferrer">Staff Selection Commission</a>{" "}
        runs India&apos;s combined recruitment exams. Its 2026 forms{" "}
        <strong>no longer accept a photo file.</strong> The form opens your
        webcam or phone camera and takes the photo while you apply, so the
        preparation is the setting rather than a file: a plain background, soft
        light from the front, and the clothes you will wear on exam day.
      </p>
      <p>
        The one file you prepare is the signature: a
        <strong> 10–20&nbsp;KB JPG/JPEG</strong>, about
        6.0&nbsp;×&nbsp;2.0&nbsp;cm, on white paper. For the camera step and the
        faults SSC lists, see the{" "}
        <Link href="/blog/ssc-cgl-chsl-photo-signature-guide-2026/">SSC CGL / CHSL photo and signature guide</Link>.
      </p>
      <p className="my-3 rounded-lg bg-brand-soft/10 px-4 py-2.5 text-sm">
        <strong>Prepare your SSC signature:</strong>{" "}
        <Link href="/exam-requirements/ssc/" className="text-brand underline font-medium">SSC live-photo guide &amp; signature resizer →</Link>
      </p>

      <h2>Banking exams: IBPS PO, IBPS Clerk, SBI PO, SBI Clerk</h2>
      <p>
        IBPS and SBI use the same sizes across their PO and Clerk exams. The
        photo (per{" "}
        <a href="https://ibps.in" className="text-brand underline" target="_blank" rel="noopener noreferrer">ibps.in</a>{" "}
        and{" "}
        <a href="https://sbi.bank.in/web/careers" className="text-brand underline" target="_blank" rel="noopener noreferrer">sbi.bank.in</a>)
        is a JPG between{" "}
        <strong>20&nbsp;KB and 50&nbsp;KB at 200×230&nbsp;px</strong>. The
        signature is a JPG between{" "}
        <strong>10&nbsp;KB and 20&nbsp;KB at 140×60&nbsp;px</strong>.
      </p>
      <p>
        Both forms also take a separate live photograph by webcam or phone
        during registration, so the uploaded file does not replace that step. The
        common file mistake is the right pixels at the wrong KB: a
        200×230&nbsp;px photo saved at high quality can exceed 50&nbsp;KB, while
        the same image compressed too hard can fall under 20&nbsp;KB. Aim for a
        number in the middle of the band, such as 35&nbsp;KB.
      </p>
      <p>
        The IBPS notice also states that a signature written in capital letters will
        not be accepted, even when the file is the right size. Sign in your
        ordinary running hand.
      </p>
      <p>
        The signature at 140×60&nbsp;px is a wide, low rectangle — much wider than
        it is tall. Crop your signature scan tightly to the ink before resizing:
        a signature with too much white space around it will appear very small and
        thin in the portal preview, and can be refused on sight even though its
        file size is right.
      </p>
      <p className="my-3 rounded-lg bg-brand-soft/10 px-4 py-2.5 text-sm">
        <strong>Resize for IBPS / SBI:</strong>{" "}
        <Link href="/exam-requirements/ibps/" className="text-brand underline font-medium">IBPS &amp; SBI photo resizer →</Link>
        {" "}or{" "}
        <Link href="/tools/exam-package/" className="text-brand underline font-medium">all-exam package →</Link>
      </p>

      <h2>UPSC exams: CSE / IAS, NDA, CDS</h2>
      <p>
        UPSC uses a wider file-size band than SSC and banking portals. Its current
        instructions ask for a{" "}
        <strong>20–200&nbsp;KB JPG photograph</strong> on a plain white background
        with the face covering about 75% of the frame. UPSC publishes{" "}
        <strong>no fixed pixel size and no aspect ratio</strong>. Prepare a normal
        passport-style portrait rather than imposing a square crop the source does not list.
      </p>
      <p>
        The signature is where UPSC differs most: instead of one signature, the
        portal expects a single JPG image holding{" "}
        <strong>three signatures arranged vertically</strong>, 20–100&nbsp;KB, with
        image dimensions of 350–500 pixels. Prepare all three on one plain white sheet in black ink,
        then scan and resize the sheet as a single file. UPSC also captures a live
        photograph during the application, by webcam or by phone through a QR
        code, and stops the application if it doesn&apos;t match the photo you
        uploaded.
      </p>
      <p>
        NDA and CDS upload through the same UPSC OTR portal and use the same
        file-size bands. UPSC can add rules for a single cycle, such as how
        recent the photo must be. For the full upload steps, including the
        three-signature sheet, see the{" "}
        <Link href="/blog/upsc-cse-ias-photo-signature-guide-2026/">UPSC CSE, NDA and CDS photo and signature guide</Link>.
      </p>
      <p className="my-3 rounded-lg bg-brand-soft/10 px-4 py-2.5 text-sm">
        <strong>Prepare your UPSC photo:</strong>{" "}
        <Link href="/exam-requirements/upsc/" className="text-brand underline font-medium">UPSC photo resizer →</Link>
      </p>

      <h2>Railway exams: RRB NTPC, ALP, Group D</h2>
      <p>
        Railway Recruitment Boards publish each recruitment as a Centralised
        Employment Notice (CEN) on every regional RRB website. The{" "}
        <a href={PORTAL_PRESETS.rrb.source!.url} className="text-brand underline" target="_blank" rel="noopener noreferrer">CEN 06/2026 notice</a>{" "}
        takes the photograph live in the form, so there is no photo file to
        upload. It asks for a separate JPG/JPEG signature of
        <strong> 30–49&nbsp;KB</strong>, at least
        <strong> 140×60&nbsp;px</strong>, scanned at a minimum 100&nbsp;DPI.
        Sign in running hand with a black pen; RRB lists block or capital
        letters among the signature faults that get an application rejected.
      </p>
      <p>
        For the live photo, RRB asks for a plain white background and dark,
        non-white clothes that cover your shoulders, so you stand out from the
        wall. Pointing the camera at a printed or on-screen copy of an old photo
        is not allowed.
      </p>
      <p className="my-3 rounded-lg bg-brand-soft/10 px-4 py-2.5 text-sm">
        <strong>Prepare for RRB exams:</strong>{" "}
        <Link href="/tools/exam-package/" className="text-brand underline font-medium">All-exam photo &amp; signature package →</Link>
      </p>

      <h2>NTA exams: NEET and JEE (Main)</h2>
      <p>
        The NEET-UG 2026 bulletin lists a <strong>JPG photo between 10&nbsp;KB
        and 200&nbsp;KB</strong> and a <strong>JPG signature between 10&nbsp;KB
        and 100&nbsp;KB</strong>, with no fixed pixel size. You upload saved
        files rather than taking a live photo. The photo goes on a white
        background with your face covering about 80% of the frame.
      </p>
      <p>
        NEET also asks for a separate 4&nbsp;×&nbsp;6&nbsp;inch postcard-size
        photograph, which is a physical print, not a larger copy of the upload.
        The bulletin lists JPG only, so convert an iPhone HEIC photo before you
        upload it. JEE Main applicants should check the current JEE bulletin
        rather than assume it matches NEET.
      </p>
      <p className="my-3 rounded-lg bg-brand-soft/10 px-4 py-2.5 text-sm">
        <strong>Convert &amp; resize for NEET / JEE:</strong>{" "}
        <Link href="/tools/resize-kb/" className="text-brand underline font-medium">KB resizer — supports JPG, PNG, WebP →</Link>
      </p>

      <h2>State PSC and other board exams</h2>
      <p>
        State Public Service Commissions — BPSC, UPPSC, MPSC, TNPSC, KPSC, WBCS
        and others — each set their own photo and signature specs per notification.
        Their KB bands and pixel sizes differ, and several publish no fixed photo
        pixel size at all. Download the notification for your exam and use only
        the figures it lists. If it gives a pixel size, use the{" "}
        <Link href="/tools/resize-kb/">custom KB resizer</Link>{" "}
        and set the pixel dimensions manually.
      </p>

      <h2>How to prepare a correct signature for exam forms</h2>
      <p>
        The signature is the upload that fails most often, and the fix is almost
        always the same: the background is grey or cream rather than white, or
        the signature is over-compressed into illegibility.
      </p>
      <p>Here is the correct preparation sequence:</p>
      <ol>
        <li>
          <strong>Use the right materials.</strong> Sign on bright white unlined
          paper with a black ballpoint or gel pen. Avoid fountain pens (ink spread)
          and pencil (too faint). Where the notice gives a box size, such as
          SSC&apos;s 6&nbsp;×&nbsp;2&nbsp;cm or RRB&apos;s 35&nbsp;×&nbsp;20&nbsp;mm,
          sign inside a box of that size.
        </li>
        <li>
          <strong>Photograph in flat, even light.</strong> Place the paper on a
          table near a window. Use your phone&apos;s rear camera held level
          directly above the signature, not at an angle. Avoid your own shadow
          falling on the paper.
        </li>
        <li>
          <strong>Crop tightly.</strong> Crop the image close to the ink — a small
          white margin on each side is fine, but the signature should fill at
          least 70% of the crop frame. Large white margins cause the signature to
          appear tiny and thin when the portal resizes it to its own dimensions.
        </li>
        <li>
          <strong>Clean the background.</strong> Upload to the{" "}
          <Link href="/tools/signature-resize/?target=20">signature resizer</Link>, which
          removes the paper background, whitens any grey or cream tone, and saves
          a JPG inside the KB band you enter.
        </li>
      </ol>
      <p>
        SBI also asks for a left-hand thumb impression and a hand-written
        declaration as separate scans. Press an inked thumb firmly on white
        paper, photograph it flat in even light, and size it to the band its
        advertisement gives.
      </p>

      <h2>How to prepare a clear exam photo</h2>
      <p>
        Unlike a studio passport photo, an exam portal photo needs to match your
        current appearance. Where the active notice asks for a prepared file,
        use its published photo instructions as the checklist:
      </p>
      <ul>
        <li>
          <strong>Background:</strong> plain and light, usually white. A
          patterned wall or room background does not meet that rule. Use a white
          sheet taped to a wall, or a plain painted surface.
        </li>
        <li>
          <strong>Lighting:</strong> face the light source — a window or lamp —
          not away from it, so no shadow falls across one side of the face.
        </li>
        <li>
          <strong>Framing:</strong> head and shoulders, face centred, filling
          roughly 70–80% of the frame height. Do not include hands, other people,
          or distracting elements in the frame.
        </li>
        <li>
          <strong>Expression:</strong> neutral, mouth closed. Most exam portals
          disallow open-mouth smiles or squinting eyes.
        </li>
        <li>
          <strong>Dress:</strong> formal or semi-formal in a solid colour. No caps
          or sunglasses; UPSC also refuses dark or coloured glasses.
        </li>
        <li>
          <strong>Recency:</strong> some notices say how recent the photo must
          be. Even where none does, use a current photo: IBPS matches your
          photo against you at later stages, and UPSC compares it with the live
          photo.
        </li>
      </ul>
      <p>
        For phone setup and lighting at home, see{" "}
        <Link href="/blog/how-to-take-a-passport-photo-at-home/">how to take a passport photo at home</Link>.
      </p>

      <h2>When the upload is refused</h2>
      <p>
        Portal error messages rarely say which check failed. The file-level
        causes are the band (too large or too small), the format (a PNG, WebP or
        HEIC file where JPG is listed), the pixel size where one is published,
        and a grey or cream signature background. Where a form asks for a name
        and date on the photo, a photo without it is refused too; the Air Force
        Agniveervayu notice instead wants a chalk slate held in the photo, which{" "}
        <Link href="/blog/add-name-date-on-exam-photo/">the name and date guide</Link>{" "}
        explains. Each cause and its fix is set out in{" "}
        <Link href="/blog/why-exam-photo-signature-rejected/">why exam photos and signatures get rejected</Link>.
      </p>
      <p>
        To make the files, pick your exam in the{" "}
        <Link href="/tools/exam-package/">Exam Application Kit</Link>, or use the{" "}
        <Link href="/tools/resize-kb/">KB resizer</Link> and the{" "}
        <Link href="/tools/signature-resize/?target=20">signature resizer</Link>{" "}
        for an exam not listed there. Everything runs in your browser, with no
        upload, no account and no watermark.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
