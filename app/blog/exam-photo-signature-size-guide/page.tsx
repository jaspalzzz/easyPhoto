import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";
import { PORTAL_PRESETS } from "@/lib/portalPresets";

const post = getPost("exam-photo-signature-size-guide")!;

const FAQ_ITEMS = [
  {
    q: "Can I use the same photo for SSC, IBPS and SBI in the same cycle?",
    a: "The recorded KB ranges may overlap, but pixel requirements can differ. IBPS and SBI are listed at 200×230 px, while SSC CGL is listed at 275×354 px. Prepare a separate export for each selected portal and confirm its current instructions; matching a KB range alone does not confirm that the dimensions are suitable.",
  },
  {
    q: "Why do exam portals set a minimum file size as well as a maximum?",
    a: "A minimum KB floor ensures the image has enough data to be clearly readable on screen and printable on the admit card. A photo compressed below roughly 10 KB at 200×230 px becomes noticeably blurry and unreliable for identity verification. The band (e.g. 20–50 KB) ensures images are both small enough to upload quickly and sharp enough to verify identity.",
  },
  {
    q: "My signature scan looks grey or cream — will it be rejected?",
    a: "A grey or cream background may not match a portal's listed white-background requirement. Use the signature resizer to remove the paper background and whiten a grey or cream tone. Photograph the signature near a window (not under yellow indoor lighting) to minimise the grey cast before processing.",
  },
  {
    q: "What are the exact UPSC photo and signature sizes?",
    a: "UPSC's current instructions publish a 20–200 KB JPG photograph on a plain white background with about 75% face coverage — no fixed pixel size or aspect ratio, so a normal passport-style portrait is fine. The signature is a single JPG holding three signatures arranged vertically, 20–100 KB. Confirm the current figures in the notification before applying, as UPSC can revise them between cycles.",
  },
  {
    q: "What format should I use — JPG or PNG?",
    a: "The recorded SSC, IBPS, SBI, UPSC and RRB specifications list JPG. The recorded NTA specification lists JPG or PNG. If your phone saves HEIC or WebP, convert the image to a format named in the current portal instructions before uploading.",
  },
  {
    q: "Do specs change between exam cycles?",
    a: "Yes. KB bands, pixel dimensions, and background requirements can all change from one notification cycle to the next — even for the same exam. The specs in this guide are the most commonly reported current values, but always download the official notification PDF for the specific exam and cycle you are applying for. The official sources are ssc.gov.in, ibps.in, upsc.gov.in, indianrailways.gov.in and nta.ac.in.",
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
    <BlogPostLayout slug={post.slug} ctaHref="/tools/exam-package/" ctaLabel="Prepare your exam photo" faqItems={FAQ_ITEMS}>
      <p>
        Exam application workflows differ: some accept prepared photo files, while
        current SSC and RRB instructions capture the photograph live and ask for a
        separate signature file. This guide compares the recorded workflows, how
        published KB bands work, and what to check before opening the active form.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>IBPS and several bank forms publish a <strong>20–50&nbsp;KB JPG photo</strong> and a <strong>10–20&nbsp;KB JPG signature</strong>.</li>
          <li>Current SSC and RRB notices use live photo capture; prepare the separately listed signature file instead.</li>
          <li>Portals check a <em>band</em>: a photo under the minimum is rejected as firmly as one over the cap.</li>
          <li>UPSC and NDA/CDS use a wider <strong>20–200&nbsp;KB</strong> photo range and a <strong>20–100&nbsp;KB</strong> three-signature sheet — with no fixed pixel size or square requirement.</li>
          <li>NTA (NEET, JEE) allows up to 200&nbsp;KB and accepts JPG or PNG.</li>
          <li>Always confirm the current KB and pixel figures in the exam notification — they can change between cycles.</li>
        </ul>
      </div>

      <div className="my-6 rounded-xl border border-brand/20 bg-brand-soft/10 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Resize your photo or signature right now</p>
        <p className="!mt-1 text-[15px] text-ink-soft">
          Pick your exam — the tool applies the selected KB target and published pixel dimensions where available. Confirm the current notification. No sign-up, nothing uploaded.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/ssc-photo-resizer/" className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white">SSC</Link>
          <Link href="/ibps-photo-resizer/" className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white">IBPS / SBI</Link>
          <Link href="/upsc-photo-resizer/" className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white">UPSC</Link>
          <Link href="/tools/exam-package/" className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white">All exams →</Link>
        </div>
      </div>

      <h2>How the KB band works — and why there&apos;s a minimum</h2>
      <p>
        Most candidates know about the upper KB limit. What catches people out is
        the lower limit. A file compressed too aggressively — say, a 200×230&nbsp;px
        JPG saved at 5&nbsp;KB — loses so much detail that it becomes blurry and
        unreadable on the admit card. The portal validator rejects it automatically
        with the same &ldquo;file not as per specification&rdquo; error as an
        over-large file.
      </p>
      <p>
        The band (e.g. 20–50&nbsp;KB) ensures images are both small enough to
        upload quickly and sharp enough to verify identity. The sweet spot for most
        exam portals is 25–40&nbsp;KB for the photo and 12–18&nbsp;KB for the
        signature. If your compressed photo lands outside the band, resize to a
        specific KB target — a general &ldquo;reduce quality&rdquo; slider that
        doesn&apos;t let you set the exact output KB won&apos;t reliably hit the
        required range.
      </p>

      <figure className="my-7 overflow-hidden rounded-xl border border-hairline">
        <Image
          src="/images/exam-photo-signature-size-guide.webp"
          alt="Prepared exam photo comparison showing a plain-background 50 KB example beside a dark-background oversized example"
          width={760}
          height={760}
          className="w-full h-auto"
        />
        <figcaption className="bg-accent/30 px-4 py-2.5 text-center text-[12.5px] text-muted-foreground">
          Prepared-file illustration only; live-capture exams use the camera workflow in the current notice instead.
        </figcaption>
      </figure>

      <figure className="my-8">
        <svg viewBox="0 0 760 310" role="img" aria-label="Exam photo workflow and signature limit comparison for SSC, IBPS, UPSC and NTA" style={{maxWidth:"100%",height:"auto",fontFamily:"system-ui,sans-serif"}}>
          <title>Exam Photo Spec Comparison</title>
          <desc>Comparison of current photo workflows and signature KB limits: SSC uses live photo capture with a 20KB signature cap; IBPS PO, UPSC CSE and NTA NEET use the listed prepared-file ranges.</desc>
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
          {[
            {exam:"SSC CGL / CHSL",photo:0,sig:20,photoPx:"live capture",sigPx:"no fixed size"},
            {exam:"IBPS PO / Clerk",photo:50,sig:20,photoPx:"200×230",sigPx:"140×60"},
            {exam:"UPSC CSE / IAS",photo:200,sig:100,photoPx:"no fixed size",sigPx:"350–500"},
            {exam:"NTA NEET / JEE",photo:200,sig:100,photoPx:"no fixed size",sigPx:"no fixed size"},
          ].map((row, i) => {
            const y = 62 + i * 55;
            return (
              <g key={row.exam}>
                <text x="195" y={y + 12} textAnchor="end" fontSize="11.5" fontWeight="600" fill="currentColor">{row.exam}</text>
                {/* Photo bar */}
                <rect x="200" y={y} width={row.photo * 1.4} height="16" rx="3" fill="#163A6B" opacity="0.85"/>
                <text x={200 + row.photo * 1.4 + 5} y={y + 12} fontSize="10" fill="currentColor" opacity="0.7">
                  {row.photo ? `Photo ${row.photo}KB · ${row.photoPx}px` : "Photo · live capture"}
                </text>
                {/* Sig bar */}
                <rect x="200" y={y + 20} width={row.sig * 1.4} height="12" rx="3" fill="#F4C63F" opacity="0.8"/>
                <text x={200 + row.sig * 1.4 + 5} y={y + 30} fontSize="9.5" fill="currentColor" opacity="0.6">
                  {`Sig ${row.sig}KB · ${row.sigPx === "no fixed size" ? row.sigPx : `${row.sigPx}px`}`}
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
        <a href="https://sbi.co.in/careers" className="text-brand underline" target="_blank" rel="noopener noreferrer">SBI</a>,{" "}
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
            <tr>
              <td className="px-3 py-2 font-medium text-ink">SSC CGL / CHSL</td>
              <td className="px-3 py-2">Live capture</td>
              <td className="px-3 py-2">No photo file</td>
              <td className="px-3 py-2">10–20 KB</td>
              <td className="px-3 py-2">No fixed pixels published</td>
              <td className="px-3 py-2">Signature: JPG/JPEG</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-medium text-ink">SSC MTS / CAPF</td>
              <td className="px-3 py-2">Live capture</td>
              <td className="px-3 py-2">No photo file</td>
              <td className="px-3 py-2">10–20 KB</td>
              <td className="px-3 py-2">No fixed pixels published</td>
              <td className="px-3 py-2">Signature: JPG/JPEG</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-medium text-ink">IBPS PO / Clerk</td>
              <td className="px-3 py-2">20–50 KB</td>
              <td className="px-3 py-2">200×230</td>
              <td className="px-3 py-2">10–20 KB</td>
              <td className="px-3 py-2">140×60</td>
              <td className="px-3 py-2">JPG</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-medium text-ink">SBI PO / Clerk</td>
              <td className="px-3 py-2">20–50 KB</td>
              <td className="px-3 py-2">200×230</td>
              <td className="px-3 py-2">10–20 KB</td>
              <td className="px-3 py-2">140×60</td>
              <td className="px-3 py-2">JPG</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-medium text-ink">UPSC CSE / IAS</td>
              <td className="px-3 py-2">20–200 KB</td>
              <td className="px-3 py-2">no fixed size published</td>
              <td className="px-3 py-2">20–100 KB</td>
              <td className="px-3 py-2">350–500 (three on one sheet)</td>
              <td className="px-3 py-2">JPG</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-medium text-ink">UPSC NDA / CDS</td>
              <td className="px-3 py-2">20–200 KB</td>
              <td className="px-3 py-2">no fixed size published</td>
              <td className="px-3 py-2">20–100 KB</td>
              <td className="px-3 py-2">350–500 (three on one sheet)</td>
              <td className="px-3 py-2">JPG</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-medium text-ink">RRB NTPC / ALP</td>
              <td className="px-3 py-2">Live capture</td>
              <td className="px-3 py-2">No photo file</td>
              <td className="px-3 py-2">30–49 KB</td>
              <td className="px-3 py-2">At least 140×60</td>
              <td className="px-3 py-2">Signature: JPG/JPEG</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-medium text-ink">RRB Group D</td>
              <td className="px-3 py-2">Live capture</td>
              <td className="px-3 py-2">No photo file</td>
              <td className="px-3 py-2">30–49 KB</td>
              <td className="px-3 py-2">At least 140×60</td>
              <td className="px-3 py-2">Signature: JPG/JPEG</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-medium text-ink">NTA NEET</td>
              <td className="px-3 py-2">10–200 KB</td>
              <td className="px-3 py-2">3.5×4.5 cm portrait</td>
              <td className="px-3 py-2">4–30 KB</td>
              <td className="px-3 py-2">—</td>
              <td className="px-3 py-2">JPG / PNG</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-medium text-ink">NTA JEE (Main)</td>
              <td className="px-3 py-2">10–200 KB</td>
              <td className="px-3 py-2">3.5×4.5 cm portrait</td>
              <td className="px-3 py-2">4–30 KB</td>
              <td className="px-3 py-2">—</td>
              <td className="px-3 py-2">JPG / PNG</td>
            </tr>
          </tbody>
        </table>
        <p className="border-t border-hairline px-4 py-2 text-xs text-muted-foreground">
          Values follow the cited registry sources; verify the active notification because workflows can change between cycles.
        </p>
      </div>

      <h2>SSC exams: CGL, CHSL, MTS and CAPF</h2>
      <p>
        The{" "}
        <a href="https://ssc.gov.in" className="text-brand underline" target="_blank" rel="noopener noreferrer">Staff Selection Commission</a>{" "}
        runs India&apos;s combined recruitment exams. The current cited workflow
        captures the photograph live and separately lists a
        <strong> 10–20&nbsp;KB JPG/JPEG signature</strong>.
      </p>
      <p>
        The most important change in recent SSC cycles:{" "}
        <strong>the portal no longer accepts uploaded gallery photos.</strong>{" "}
        You must capture the photo live through the SSC portal&apos;s camera
        interface at the time of filling the form. The portal opens a webcam or
        phone camera window, you take the shot in real time, and the system saves
        it directly. This means preparation shifts from &ldquo;have a resized file
        ready&rdquo; to &ldquo;have the right environment ready before you open
        the form&rdquo;: clean white wall behind you, soft front lighting, formal
        dress. The signature, by contrast, is still uploaded as a scanned file.
      </p>
      <p>
        SSC also enforces a signature style rule almost no other portal has:{" "}
        <strong>all-capitals signatures are explicitly rejected.</strong> Your
        signature must be in cursive or running hand. Print block letters do not
        match that instruction. The listed physical size is about 6.0&nbsp;×&nbsp;2.0&nbsp;cm on
        white paper with black ink.
      </p>
      <p>
        For the full SSC spec table, the live-capture prep checklist, and the
        complete rejection list, see the dedicated{" "}
        <Link href="/blog/ssc-cgl-chsl-photo-signature-guide-2026/">SSC CGL / CHSL photo and signature guide</Link>.
      </p>
      <p className="my-3 rounded-lg bg-brand-soft/10 px-4 py-2.5 text-sm">
        <strong>Prepare your SSC signature:</strong>{" "}
        <Link href="/ssc-photo-resizer/" className="text-brand underline font-medium">SSC live-photo guide &amp; signature resizer →</Link>
      </p>

      <h2>Banking exams: IBPS PO, IBPS Clerk, SBI PO, SBI Clerk</h2>
      <p>
        IBPS and SBI use consistent specs across their PO and Clerk exams. The
        confirmed photo requirement (per{" "}
        <a href="https://ibps.in" className="text-brand underline" target="_blank" rel="noopener noreferrer">ibps.in</a>{" "}
        and{" "}
        <a href="https://sbi.co.in/careers" className="text-brand underline" target="_blank" rel="noopener noreferrer">sbi.co.in/careers</a>)
        is a JPG between{" "}
        <strong>20&nbsp;KB and 50&nbsp;KB at 200×230&nbsp;px</strong>. The
        signature is a JPG between{" "}
        <strong>10&nbsp;KB and 20&nbsp;KB at 140×60&nbsp;px</strong>.
      </p>
      <p>
        These portals accept regular file uploads — no live capture. The common
        mistake here is resizing to the right pixels but the wrong KB: a
        200×230&nbsp;px photo saved as a high-quality JPG can exceed 50&nbsp;KB,
        while the same image compressed too hard can fall under 20&nbsp;KB. Use a
        KB-target resizer — set it to output 35&nbsp;KB — to land safely in the
        middle of the band.
      </p>
      <p>
        The signature at 140×60&nbsp;px is a wide, low rectangle — much wider than
        it is tall. Crop your signature scan tightly to the ink before resizing:
        a signature with too much white space around it will appear very small and
        thin in the portal preview, and may fail a visual check even if it passes
        the file validator.
      </p>
      <p>
        For IBPS PO specifically — August prelim dates, document checklist and
        the registration prep calendar — see the{" "}
        <Link href="/blog/ibps-po-2026-photo-signature-checklist/">IBPS PO 2026 photo and signature checklist</Link>.
      </p>
      <p className="my-3 rounded-lg bg-brand-soft/10 px-4 py-2.5 text-sm">
        <strong>Resize for IBPS / SBI:</strong>{" "}
        <Link href="/ibps-photo-resizer/" className="text-brand underline font-medium">IBPS &amp; SBI photo resizer →</Link>
        {" "}or{" "}
        <Link href="/tools/exam-package/" className="text-brand underline font-medium">all-exam package →</Link>
      </p>

      <h2>UPSC exams: CSE / IAS, NDA, CDS</h2>
      <p>
        UPSC uses a wider file-size band than SSC and banking portals. Its current
        instructions ask for a{" "}
        <strong>20–200&nbsp;KB JPG photograph</strong> on a plain white background
        with the face covering about 75% of the frame. UPSC publishes{" "}
        <strong>no fixed pixel size and no aspect ratio</strong>, so a normal
        passport-style portrait is accepted — there is no square-crop requirement.
      </p>
      <p>
        The signature is where UPSC differs most: instead of one signature, the
        portal expects a single JPG image holding{" "}
        <strong>three signatures arranged vertically</strong>, 20–100&nbsp;KB in
        total. Prepare all three on one plain white sheet in black ink, then scan
        and resize the sheet as a single file.
      </p>
      <p>
        NDA and CDS upload through the same UPSC OTR portal and use the same
        file-size bands. UPSC can add cycle-specific rules — such as a photo-recency
        window — so always read the specific notification before you apply. For the
        full UPSC CSE workflow see the{" "}
        <Link href="/blog/upsc-cse-ias-photo-signature-guide-2026/">UPSC CSE / IAS photo and signature guide</Link>,
        and for NDA and CDS the{" "}
        <Link href="/blog/nda-cds-photo-signature-guide-2026/">NDA &amp; CDS photo and signature guide</Link>.
      </p>
      <p className="my-3 rounded-lg bg-brand-soft/10 px-4 py-2.5 text-sm">
        <strong>Prepare your UPSC photo:</strong>{" "}
        <Link href="/upsc-photo-resizer/" className="text-brand underline font-medium">UPSC photo resizer →</Link>
      </p>

      <h2>Railway exams: RRB NTPC, ALP, Group D</h2>
      <p>
        Railway Recruitment Boards run exams across 21 regional boards, and specs
        are confirmed per notification at{" "}
        <a href={PORTAL_PRESETS.rrb.source!.url} className="text-brand underline" target="_blank" rel="noopener noreferrer">the cited RRB notice</a>.
        The current cited RRB instructions use live photograph capture rather
        than a prepared photo upload. They list a separate JPG/JPEG signature of
        <strong> 30–49&nbsp;KB</strong>, at least
        <strong> 140×60&nbsp;px</strong>, scanned at a minimum 100&nbsp;DPI.
        Confirm the active CEN because recruitment-cycle instructions can change.
      </p>
      <p>
        Open the live-photo step with a working front camera, even lighting and a
        plain background. Prepare only the separate signature file in advance;
        do not substitute a saved photograph for the camera step described by the
        current notice.
      </p>
      <p className="my-3 rounded-lg bg-brand-soft/10 px-4 py-2.5 text-sm">
        <strong>Prepare for RRB exams:</strong>{" "}
        <Link href="/tools/exam-package/" className="text-brand underline font-medium">All-exam photo &amp; signature package →</Link>
      </p>

      <h2>NTA exams: NEET and JEE (Main)</h2>
      <p>
        The National Testing Agency uses a more relaxed file size range than most
        other portals. For both NEET and JEE Main, the photo is a{" "}
        <strong>JPG or PNG between 10&nbsp;KB and 200&nbsp;KB</strong>; and the
        signature is between <strong>4&nbsp;KB and 30&nbsp;KB</strong> in JPG or
        PNG. A clear phone photo may fit that KB range, but the current notice&apos;s
        other photo instructions still need to be checked before submission.
      </p>
      <p>
        NTA does not require live portal capture — you upload a saved file. The
        photo should be on a plain white or off-white background, front-facing,
        taken within the last six months. The common mistake for NTA applications
        is format confusion: NTA explicitly accepts both JPG and PNG, but some
        candidates upload WebP or HEIC (common default formats on recent iPhones
        and Android phones) — those are rejected. Convert to JPG before uploading
        if you&apos;re not sure of your phone&apos;s output format.
      </p>
      <p className="my-3 rounded-lg bg-brand-soft/10 px-4 py-2.5 text-sm">
        <strong>Convert &amp; resize for NEET / JEE:</strong>{" "}
        <Link href="/tools/resize-kb/" className="text-brand underline font-medium">KB resizer — supports JPG, PNG, WebP →</Link>
      </p>

      <h2>State PSC and other board exams</h2>
      <p>
        State Public Service Commissions — BPSC, UPPSC, MPSC, TNPSC, KPSC, WBCS
        and others — each set their own photo and signature specs per notification.
        Most follow the 20–50&nbsp;KB, JPG, 200×230&nbsp;px convention, but
        state boards differ more than national boards. Always download the
        official notification PDF for the specific state exam and use the exact
        figures listed there. If the state portal specifies an unusual dimension
        (e.g. 350×400&nbsp;px), use the{" "}
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
          and pencil (too faint). The signature should be roughly 4&nbsp;×&nbsp;2&nbsp;cm,
          matching the physical target most portals specify.
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
          appear tiny and thin when the portal resizes to its stored dimensions.
        </li>
        <li>
          <strong>Clean the background.</strong> Upload to the{" "}
          <Link href="/tools/signature-resize/?target=20">signature resizer</Link>, which
          removes the paper background, whitens any grey or cream tone, and outputs
          within the target KB band. For portals that want a transparent background,
          use the PNG output option.
        </li>
        <li>
          <strong>Check the style (SSC only).</strong> SSC portals reject
          all-capitals signatures. Use cursive or running hand. If your natural
          signature is a set of printed block capitals, re-sign in a connected
          flowing style before scanning.
        </li>
      </ol>
      <p>
        For exams requiring a thumb impression (RRB Group D, some state PSC
        forms), apply the same approach: ink your right thumb on a fresh pad,
        press firmly on white paper, photograph flat with even light, and resize
        to the specified KB target using the custom resizer.
      </p>

      <h2>How to prepare a clear exam photo</h2>
      <p>
        Unlike a studio passport photo, an exam portal photo needs to match your
        current appearance. Where the active notice asks for a prepared file,
        use its published photo instructions as the checklist:
      </p>
      <ul>
        <li>
          <strong>Background:</strong> plain white or very light off-white. A
          patterned wall, room background, or coloured sheet is an automatic
          rejection on most portals. Use a white sheet taped to a wall, or stand
          close to a plain painted surface.
        </li>
        <li>
          <strong>Lighting:</strong> face the light source — a window or lamp —
          not away from it. Shadows across one side of the face trigger biometric
          validator failures on portals with automated checks.
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
          <strong>Dress:</strong> formal or semi-formal in a solid colour. No caps,
          hats, sunglasses, or heavy-framed glasses (some portals disallow glasses
          entirely — check the notification for your exam).
        </li>
        <li>
          <strong>Recency:</strong> some notifications specify how recent the photo
          must be, and UPSC in particular can set a tight window in a given cycle —
          check the notification. Do not use an old photo even where no window is
          stated: an invigilator can and will flag a visible difference in
          appearance.
        </li>
      </ul>
      <p>
        For a detailed guide to taking a compliant photo at home — including phone
        setup, lighting tips, and the exact mistakes that get photos rejected — see{" "}
        <Link href="/blog/how-to-take-a-passport-photo-at-home/">how to take a passport photo at home</Link>.
      </p>

      <h2>Why uploads get rejected — and how to fix each one</h2>
      <p>
        Exam portal rejection messages are typically terse. Here is what each
        failure usually means and how to fix it:
      </p>
      <ul>
        <li>
          <strong>File too large (over the cap):</strong> compress to a specific
          KB target. A general &ldquo;reduce quality&rdquo; slider is unreliable;
          target a value like 35&nbsp;KB to land safely within the 20–50&nbsp;KB band.
        </li>
        <li>
          <strong>File too small (under the minimum):</strong> the file was
          over-compressed. Re-export at a higher JPEG quality setting, or use the
          KB resizer to set a higher target.
        </li>
        <li>
          <strong>Wrong format:</strong> the portal expects JPG and received PNG,
          WebP, or HEIC. Convert to JPG before uploading. iPhones and recent
          Android phones save as HEIC by default — check your camera settings.
        </li>
        <li>
          <strong>Wrong pixel dimensions:</strong> the photo or signature does not
          match the portal&apos;s required width × height. Use the exam-specific
          resizer to apply the published pixel preset where the authority provides one.
        </li>
        <li>
          <strong>Signature background grey or cream:</strong> use the signature
          resizer to clean the background. This is the single most common
          rejection reason for signatures.
        </li>
        <li>
          <strong>All-caps signature (SSC only):</strong> the validator flags
          printed capital letters. Re-sign in cursive.
        </li>
        <li>
          <strong>Photo not recent enough:</strong> where a notification specifies a
          recency window, use a fresh photo taken for this application rather than an
          old file.
        </li>
        <li>
          <strong>Missing name and date text (where required):</strong> a few forms —
          notably the Indian Air Force Agniveer intake, which needs a physical slate
          with your name and date held in the photo — reject images without it. This
          is not a UPSC requirement. See{" "}
          <Link href="/blog/add-name-date-on-exam-photo/">how to add name and date</Link>{" "}
          when your specific notification asks for it.
        </li>
      </ul>
      <p>
        For a complete breakdown with screenshots and fixes, see{" "}
        <Link href="/blog/why-exam-photo-signature-rejected/">why exam photos and signatures get rejected</Link>.
      </p>

      <h2>How to resize for any exam in one step</h2>
      <p>
        Pick your exam in the{" "}
        <Link href="/tools/exam-package/">Exam Application Kit</Link> to see whether
        the registry records live capture or prepared files, then apply its stored
        KB targets and published dimensions where available. Confirm the active notice.
      </p>
      <p>To prepare each file separately:</p>
      <ul>
        <li>
          <strong>Photo to a selected KB target:</strong>{" "}
          <Link href="/tools/resize-kb/?target=50">resize to 50&nbsp;KB</Link> for the
          standard ceiling, or{" "}
          <Link href="/tools/resize-kb/">set a custom KB target</Link> for exams
          with a different cap.
        </li>
        <li>
          <strong>Signature:</strong> the{" "}
          <Link href="/tools/signature-resize/?target=20">resize signature to 20&nbsp;KB</Link>{" "}
          tool removes the paper background, crops tightly, and outputs within the
          required band.
        </li>
        <li>
          <strong>Per-exam resizers:</strong> dedicated tools for{" "}
          <Link href="/ssc-photo-resizer/">SSC</Link>,{" "}
          <Link href="/upsc-photo-resizer/">UPSC</Link>, and{" "}
          <Link href="/ibps-photo-resizer/">IBPS</Link>{" "}
          apply the selected KB target and any published pixel dimensions recorded
          for that board. Confirm the current notification before submitting.
        </li>
      </ul>
      <p>
        Everything runs in your browser — no files are uploaded to a server, no
        account is required, and there is no watermark.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
