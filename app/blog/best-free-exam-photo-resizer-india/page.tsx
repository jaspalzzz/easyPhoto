import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { pageMetadata } from "@/lib/seo";
import { getPost } from "@/lib/blog";

const post = getPost("best-free-exam-photo-resizer-india")!;

export const metadata = pageMetadata({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}/`,
});

export default function Page() {
  return (
    <BlogPostLayout slug="best-free-exam-photo-resizer-india" ctaHref="/tools/exam-package/" ctaLabel="Try the exam photo tool">
      <p>
        Every Indian government exam portal specifies its own photo and signature size — not just
        dimensions, but an exact kilobyte range. SSC CGL wants a 275×354 px JPG between 20 KB and
        50 KB. IBPS PO wants 200×230 px in the same KB range. UPSC requires a square minimum
        350×350 px. Upload the wrong size and the form shows an error before you can submit.
      </p>

      <p>
        Five tools solve this specifically for Indian exam portals — all free, each with different
        coverage and trade-offs. Here is how they compare.
      </p>

      <p>
        <strong>Transparency:</strong> easyPhoto is our product. Every claim about the other tools
        is sourced from their own websites and verified pages. Where a competitor does something
        better, we say so.
      </p>

      <h2>Exam photo specs at a glance</h2>

      <p>
        The reason generic photo tools don&apos;t work is that exam portals care about kilobytes,
        not just pixels. A standard photo tool resizes to dimensions — it doesn&apos;t target a
        KB ceiling. The table below shows how different each portal&apos;s spec is:
      </p>

      <div className="my-8 overflow-x-auto rounded-xl border border-hairline text-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-hairline bg-accent/30">
              <th className="px-4 py-3 text-left font-semibold text-ink">Exam</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Photo size</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Photo KB</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Signature size</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Signature KB</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            <tr>
              <td className="px-4 py-3 font-medium text-ink">SSC CGL / CHSL</td>
              <td className="px-4 py-3 text-muted-foreground">275×354 px</td>
              <td className="px-4 py-3 text-muted-foreground">20–50 KB</td>
              <td className="px-4 py-3 text-muted-foreground">140×60 px</td>
              <td className="px-4 py-3 text-muted-foreground">10–20 KB</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">IBPS PO / Clerk</td>
              <td className="px-4 py-3 text-muted-foreground">200×230 px</td>
              <td className="px-4 py-3 text-muted-foreground">20–50 KB</td>
              <td className="px-4 py-3 text-muted-foreground">200×80 px</td>
              <td className="px-4 py-3 text-muted-foreground">10–20 KB</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">UPSC CSE / NDA / CDS</td>
              <td className="px-4 py-3 text-muted-foreground">350×350 px min (square)</td>
              <td className="px-4 py-3 text-muted-foreground">20–300 KB</td>
              <td className="px-4 py-3 text-muted-foreground">350×350 px min (square)</td>
              <td className="px-4 py-3 text-muted-foreground">20–300 KB</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">Railway RRB</td>
              <td className="px-4 py-3 text-muted-foreground">200×230 px</td>
              <td className="px-4 py-3 text-muted-foreground">20–50 KB</td>
              <td className="px-4 py-3 text-muted-foreground">200×80 px</td>
              <td className="px-4 py-3 text-muted-foreground">10–20 KB</td>
            </tr>
          </tbody>
        </table>
        <p className="border-t border-hairline px-4 py-2 text-xs text-muted-foreground">
          Specs sourced from official board notifications.
        </p>
      </div>

      <p>
        This table is a snapshot; for the full, regularly-verified breakdown of
        every exam&apos;s photo and signature spec — KB bands, pixel sizes and the
        official source for each — see our{" "}
        <a href="/blog/exam-photo-signature-size-guide/">exam photo &amp; signature size guide</a>,
        the canonical reference we keep updated as portals change their rules.
      </p>

      <h2>Five tools compared</h2>

      <div className="my-8 overflow-x-auto rounded-xl border border-hairline text-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-hairline bg-accent/30">
              <th className="px-4 py-3 text-left font-semibold text-ink">Tool</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Free</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">On-device</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Exams</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Photo + sig</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Passport photos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            <tr>
              <td className="px-4 py-3 font-medium text-ink">ExamMint Resizer</td>
              <td className="px-4 py-3 font-medium text-emerald-700">✓</td>
              <td className="px-4 py-3 font-medium text-emerald-700">✓</td>
              <td className="px-4 py-3 text-muted-foreground">104+</td>
              <td className="px-4 py-3 font-medium text-emerald-700">✓ Both + thumb</td>
              <td className="px-4 py-3 font-medium text-amber-700">No dedicated page</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">myexamphoto.in</td>
              <td className="px-4 py-3 font-medium text-emerald-700">✓</td>
              <td className="px-4 py-3 text-muted-foreground">Claimed (unverified)</td>
              <td className="px-4 py-3 text-muted-foreground">~13 + custom</td>
              <td className="px-4 py-3 font-medium text-emerald-700">✓ Both</td>
              <td className="px-4 py-3 font-medium text-emerald-700">✓ 35×45 mm</td>
            </tr>
            <tr className="bg-brand-soft/10">
              <td className="px-4 py-3 font-medium text-ink">easyPhoto</td>
              <td className="px-4 py-3 font-medium text-emerald-700">✓</td>
              <td className="px-4 py-3 font-medium text-emerald-700">✓</td>
              <td className="px-4 py-3 text-muted-foreground">40+ portals</td>
              <td className="px-4 py-3 font-medium text-emerald-700">✓ Both</td>
              <td className="px-4 py-3 font-medium text-emerald-700">✓ 20+ countries</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">SarkariResizer</td>
              <td className="px-4 py-3 font-medium text-emerald-700">✓</td>
              <td className="px-4 py-3 font-medium text-emerald-700">✓</td>
              <td className="px-4 py-3 text-muted-foreground">20+</td>
              <td className="px-4 py-3 font-medium text-emerald-700">✓ Both</td>
              <td className="px-4 py-3 text-muted-foreground">Listed (spec unverified)</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">govtphotoresizer.com</td>
              <td className="px-4 py-3 font-medium text-emerald-700">✓</td>
              <td className="px-4 py-3 font-medium text-amber-700">Server (claims no storage)</td>
              <td className="px-4 py-3 text-muted-foreground">6 categories</td>
              <td className="px-4 py-3 font-medium text-emerald-700">✓ Both</td>
              <td className="px-4 py-3 font-medium text-amber-700">Questionable (600×600 square)</td>
            </tr>
          </tbody>
        </table>
        <p className="border-t border-hairline px-4 py-2 text-xs text-muted-foreground">
          Based on each tool&apos;s own website, June 2026.
        </p>
      </div>

      <h2>ExamMint Resizer — the broadest exam-only tool</h2>

      <p>
        ExamMint Resizer (resizer.exammint.in) is the most comprehensive exam photo tool
        available. With 104+ exams across Central, State PSC, Banking, Police, Judiciary, and
        Admission categories, it covers more portals than any other free tool. It handles photo,
        signature, and left thumb impression — the third document type required by some Railway
        boards. Processing is on-device (&quot;Your photos are processed locally in your browser
        and never uploaded to any server&quot;, confirmed on multiple pages), completely free,
        and works offline after initial page load.
      </p>

      <p>
        What it doesn&apos;t do: ExamMint is built exclusively for exam document photos. No
        passport photos (no dedicated India 35×45 mm page — a custom preset exists but no
        Passport Seva-specific tool), no PDF compression, no Aadhaar masking, and no format
        conversion. Spec pages reference the issuing body by name but link to a third-party
        syllabus site rather than the official government notification directly.
      </p>

      <h2>myexamphoto.in — pre-upload validator, PDF tools, smaller exam list</h2>

      <p>
        myexamphoto.in covers around 13 named exam presets plus a custom dimension mode, along
        with photo and signature resize, a PDF compressor, a DPI converter (200/300 DPI for
        portals that require it), and a universal file converter (PDF, JPG, PNG, WebP). The tool
        claims on-device processing — &quot;photos never leave your device&quot; — though this
        could not be directly verified via page fetch (the site returned 403 on all direct
        attempts; data is sourced from the .com mirror and Google-indexed snippets).
      </p>

      <p>
        Its most distinctive feature is an <strong>Image Upload Validator</strong>: before you
        even submit your form, the tool checks your photo&apos;s dimensions, file size, format,
        and aspect ratio against the selected exam&apos;s spec and shows a pass/fail result. No
        other tool in this set does this. If you have ever been rejected at upload for a KB or
        pixel mismatch, this pre-check would have caught it.
      </p>

      <p>
        The exam coverage is narrower than ExamMint: confirmed presets include UPSC, SSC CGL,
        IBPS, JEE Main, NEET UG, GATE, Kerala PSC, and RRB, among others. State PSCs beyond
        Kerala PSC are not listed.
      </p>

      <h2>easyPhoto — fewer exams than ExamMint, but the complete document toolkit</h2>

      <p>
        <em>This is our product.</em>
      </p>

      <p>
        easyPhoto covers 40+ exam portals — less than ExamMint&apos;s 104+, more than
        myexamphoto.in&apos;s ~13. Each spec includes a link to the official notification and a
        verified-on date so you can confirm which source the KB and pixel limits came from.
      </p>

      <p>
        Where easyPhoto covers different ground entirely: passport photos for India (35×45 mm
        Passport Seva spec), the US, UK, Canada, Schengen, and 20+ other countries. PDF
        compression for marksheets and certificates. Aadhaar masking. Format conversion (HEIC
        to JPG, WebP to JPG). If your application process involves a passport photo for ID
        proof, exam photo and signature, and PDF uploads of documents — easyPhoto handles all
        of it on-device with no upload.
      </p>

      <h2>SarkariResizer — solid for Punjab and regional state PSC exams</h2>

      <p>
        SarkariResizer covers 20+ exams with both photo and signature resize, on-device
        (&quot;100% Private — Your files never leave your device&quot;). Its coverage skews
        toward Punjab state government and regional PSC exams — BPSC, MPSC, and Punjab police
        portals appear prominently — making it the most useful option for state-level exams
        that larger tools may not cover.
      </p>

      <p>
        For national-level exams (SSC, IBPS, UPSC), coverage is present but narrower than
        ExamMint. The site lists Passport as a menu item but the India 35×45 mm spec has not
        been verified on their accessible pages — check the dimensions before using it for a
        passport application.
      </p>

      <h2>govtphotoresizer.com — 6 exams, server-side, questionable passport spec</h2>

      <p>
        GovtPhotoResizer covers 6 exam categories: SSC, RRB, DSSSB, UPSSSC, NEET, and CCC.
        It handles both photo and signature, and also supports left thumb impression for RRB —
        a less common feature. The tool is free with no account required.
      </p>

      <p>
        Two caveats worth knowing. First, processing is server-side — photos leave the device.
        The About page claims &quot;never stored after processing,&quot; but this is not backed
        by the privacy policy (which appears to be a default template with no technical detail).
        Second, the passport photo tool outputs 600×600 px square — this matches an older square
        format and does not align with the Passport Seva portal&apos;s current 35×45 mm portrait
        spec. Do not use the passport tool here for an Indian passport application.
      </p>

      <p>
        For the 6 exams it does cover, govtphotoresizer.com works adequately. For anything
        beyond those, or for passport photos, use a different tool.
      </p>

      <h2>Which should you use?</h2>

      <ul>
        <li>
          <strong>You want the widest exam coverage possible:</strong> ExamMint Resizer (104+
          exams, free, on-device, photo + signature + thumb impression).
        </li>
        <li>
          <strong>You want to pre-validate your file before submitting to the portal:</strong>{" "}
          myexamphoto.in — its Image Upload Validator checks dimensions, KB, format, and aspect
          ratio before you upload. No other tool here does this.
        </li>
        <li>
          <strong>You need exam photos AND passport photos AND PDFs from one place:</strong>{" "}
          easyPhoto — the only tool in this set that covers all three.
        </li>
        <li>
          <strong>You are applying for a Punjab or regional state PSC exam:</strong>{" "}
          SarkariResizer has the best coverage for state-level exams that larger tools omit.
        </li>
        <li>
          <strong>You only need SSC, RRB, DSSSB, UPSSSC, NEET, or CCC:</strong>{" "}
          govtphotoresizer.com covers these six — but note it uses server-side processing and
          its privacy policy does not confirm the &quot;no storage&quot; claim made on the About
          page.
        </li>
        <li>
          <strong>You want to verify the exact spec source:</strong> easyPhoto links to the
          official board notification for every spec and shows the date it was last checked.
        </li>
      </ul>

      <h2>Frequently asked questions</h2>

      <p>
        <strong>Does ExamMint cover SSC CGL photo and signature?</strong>
      </p>
      <p>
        Yes. ExamMint Resizer covers SSC CGL along with 104+ other exams, handling photo
        (275×354 px, 20–50 KB) and signature (140×60 px, 10–20 KB) in one tool. It is free
        and processes on your device.
      </p>

      <p>
        <strong>What is the SSC CGL photo size requirement?</strong>
      </p>
      <p>
        SSC CGL requires a JPG photo at 275×354 pixels, between 20 KB and 50 KB. The signature
        must be 140×60 pixels, between 10 KB and 20 KB. SSC now requires live capture for the
        photo — gallery uploads are blocked on the portal. Resize your photo to these specs
        before the live capture step.
      </p>

      <p>
        <strong>What is the myexamphoto.in Image Upload Validator?</strong>
      </p>
      <p>
        It is a pre-submission checker: you select your exam, upload your prepared photo, and the
        tool checks whether the file meets the exact dimensions, file size, format, and aspect
        ratio that the portal requires — before you ever open the application form. If anything
        is wrong, it tells you what to fix. No other tool in this comparison has an equivalent
        feature.
      </p>

      <p>
        <strong>Can I use the same photo for multiple exams?</strong>
      </p>
      <p>
        Only if the specs match exactly. SSC and IBPS both want 20–50 KB JPG but at different
        pixel dimensions (275×354 vs 200×230). UPSC requires square minimum 350×350 px — a
        completely different shape. Resize separately for each portal using its specific preset.
      </p>

      <p>
        <strong>Do these tools upload my photo to a server?</strong>
      </p>
      <p>
        ExamMint, myexamphoto.in (claimed), easyPhoto, and SarkariResizer all state on-device
        processing. govtphotoresizer.com processes server-side, claiming photos are not retained
        after processing (the About page only — not backed by the privacy policy). You can
        verify on-device claims yourself by opening the browser&apos;s network tab while resizing:
        no image upload request should appear.
      </p>
    </BlogPostLayout>
  );
}
