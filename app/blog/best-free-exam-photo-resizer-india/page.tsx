import { BlogPostLayout } from "@/components/blog/BlogPostLayout";

export default function Page() {
  return (
    <BlogPostLayout slug="best-free-exam-photo-resizer-india">
      <p>
        Every Indian government exam portal specifies its own photo and signature size — not just
        dimensions, but an exact kilobyte range. SSC CGL wants a 275×354 px JPG between 20 KB and
        50 KB. IBPS PO wants 200×230 px in the same KB range. UPSC requires a square minimum
        350×350 px. Upload the wrong size and the form shows an error before you can submit.
      </p>

      <p>
        Three tools solve this specifically for Indian exam portals — all free, all claiming
        on-device processing, all covering photo and signature resize. Here is how they compare.
      </p>

      <p>
        <strong>Transparency:</strong> easyPhoto is our product. Every claim about ExamMint and
        SarkariResizer below is sourced from their own websites and terms. Where a competitor
        does something better, we say so.
      </p>

      <h2>Exam photo specs at a glance</h2>

      <p>
        The reason generic photo tools don&apos;t work is that exam portals care about kilobytes,
        not just pixels. A standard photo tool resizes to dimensions — it doesn&apos;t target a KB
        ceiling. The table below shows how different each portal&apos;s spec is:
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

      <h2>Three tools compared</h2>

      <div className="my-8 overflow-x-auto rounded-xl border border-hairline text-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-hairline bg-accent/30">
              <th className="px-4 py-3 text-left font-semibold text-ink">Tool</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Free</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">On-device</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Exams covered</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Photo + signature</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Passport photos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            <tr>
              <td className="px-4 py-3 font-medium text-ink">ExamMint Resizer</td>
              <td className="px-4 py-3 font-medium text-emerald-700">✓</td>
              <td className="px-4 py-3 font-medium text-emerald-700">✓</td>
              <td className="px-4 py-3 text-muted-foreground">80+</td>
              <td className="px-4 py-3 font-medium text-emerald-700">✓ Both</td>
              <td className="px-4 py-3 font-medium text-amber-700">No</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">SarkariResizer</td>
              <td className="px-4 py-3 font-medium text-emerald-700">✓</td>
              <td className="px-4 py-3 font-medium text-emerald-700">✓</td>
              <td className="px-4 py-3 text-muted-foreground">20+</td>
              <td className="px-4 py-3 font-medium text-emerald-700">✓ Both</td>
              <td className="px-4 py-3 text-muted-foreground">Listed (spec unverified)</td>
            </tr>
            <tr className="bg-brand-soft/10">
              <td className="px-4 py-3 font-medium text-ink">easyPhoto</td>
              <td className="px-4 py-3 font-medium text-emerald-700">✓</td>
              <td className="px-4 py-3 font-medium text-emerald-700">✓</td>
              <td className="px-4 py-3 text-muted-foreground">40+ portals</td>
              <td className="px-4 py-3 font-medium text-emerald-700">✓ Both</td>
              <td className="px-4 py-3 font-medium text-emerald-700">✓ 20+ countries</td>
            </tr>
          </tbody>
        </table>
        <p className="border-t border-hairline px-4 py-2 text-xs text-muted-foreground">
          Based on each tool&apos;s own website, June 2026.
        </p>
      </div>

      <h2>ExamMint Resizer — the most comprehensive exam-only tool</h2>

      <p>
        ExamMint Resizer (resizer.exammint.in) is the broadest exam photo tool available. With
        80+ exams across Central, State PSC, Banking, Police, Judiciary and Admission categories,
        it covers significantly more portals than any other free tool. It handles both photo and
        signature, uses on-device processing (&quot;Your photos never leave your device&quot;), and
        is completely free with no account.
      </p>

      <p>
        What it doesn&apos;t do: ExamMint is built exclusively for exam photos. It has no
        country-format passport photo presets, no PDF compression, no Aadhaar masking, no format
        conversion. If your application process also requires a 35×45 mm passport photo, an
        Aadhaar PDF, or a format conversion from HEIC to JPG, you need a second tool.
      </p>

      <p>
        One other gap worth noting: ExamMint does not appear to display source URLs or
        verification dates for its specs. You cannot confirm which notification version each
        spec was sourced from.
      </p>

      <h2>SarkariResizer — solid for state PSC exams, especially Punjab</h2>

      <p>
        SarkariResizer covers 20+ exams with both photo and signature resize, on-device
        (&quot;100% Private — Your files never leave your device&quot;). Its exam coverage skews
        toward Punjab state government and regional PSC exams — BPSC, MPSC, and Punjab police
        portals appear in its nav — which makes it particularly useful for state-level exams
        that larger tools may not cover.
      </p>

      <p>
        For national-level exams like SSC, IBPS, or UPSC, the coverage is there but narrower than
        ExamMint. If you&apos;re applying for a Punjab state government exam, SarkariResizer may
        be the better focused option. The site lists Passport as a menu item but we were not able
        to verify whether its India spec (35×45 mm) is correct or if it uses the US 2×2 inch
        size — check the dimensions before using it for a passport application.
      </p>

      <h2>easyPhoto — fewer exams than ExamMint, but the complete document toolkit</h2>

      <p>
        <em>This is our product.</em>
      </p>

      <p>
        easyPhoto covers 40+ exam portals — less than ExamMint&apos;s 80+, more than
        SarkariResizer&apos;s 20+. Each spec includes a link to the official notification and a
        verified-on date, so you can confirm which source the KB and pixel limits came from. For
        SSC CGL, for example, the tool will show you the ssc.gov.in notification it was sourced
        from and when the spec was last checked.
      </p>

      <p>
        Where easyPhoto covers different ground: it handles everything outside exam photos that
        Indian applicants typically need. Passport photos for India (35×45 mm Seva spec),
        the US (2×2 in), UK, Canada, Schengen and 20+ other countries. PDF compression for
        marksheets and certificates. Aadhaar masking. HEIC to JPG and WebP to JPG conversion.
        If you&apos;re going through a government exam application — which usually involves a
        passport photo for ID proof, exam photo and signature, and PDF uploads of documents —
        easyPhoto handles all of it. Nothing is uploaded: everything runs in your browser.
      </p>

      <h2>Which should you use?</h2>

      <ul>
        <li>
          <strong>You only need exam photos, for as many exams as possible:</strong> ExamMint
          Resizer. It covers 80+ exams, is free, on-device, and handles both photo and signature.
          It is the strongest exam-specific tool available.
        </li>
        <li>
          <strong>You need SSC, IBPS, UPSC, or national-level exams specifically:</strong> Any
          of the three tools work. ExamMint has the widest coverage; easyPhoto shows source URLs
          for spec verification; both are on-device and free.
        </li>
        <li>
          <strong>You need a Punjab or regional state PSC exam:</strong> SarkariResizer covers
          regional exams that larger tools may not have.
        </li>
        <li>
          <strong>You need exam photos AND passport photos AND PDFs from one place:</strong>{" "}
          easyPhoto. ExamMint and SarkariResizer are exam-only; easyPhoto is the complete
          document toolkit for an Indian government application.
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
        Yes. ExamMint Resizer covers SSC CGL along with 80+ other exams, and handles both photo
        (275×354 px, 20–50 KB) and signature (140×60 px, 10–20 KB) in one tool. It is free and
        processes on your device.
      </p>

      <p>
        <strong>What is the SSC CGL photo size requirement?</strong>
      </p>
      <p>
        SSC CGL requires a JPG photo at 275×354 pixels, between 20 KB and 50 KB. The signature
        must be 140×60 pixels, between 10 KB and 20 KB. SSC now requires live capture for the
        photo — gallery uploads are blocked on the portal. Resize your photo to these specs before
        the live capture step.
      </p>

      <p>
        <strong>Can I use the same photo for multiple exams?</strong>
      </p>
      <p>
        Only if the specs match exactly. SSC and IBPS both want a 20–50 KB JPG but at different
        dimensions (275×354 px vs 200×230 px) — the same file will not meet both. UPSC requires
        a square minimum 350×350 px, which is a completely different shape. Resize separately
        for each portal using the portal-specific preset.
      </p>

      <p>
        <strong>Do these tools upload my photo to a server?</strong>
      </p>
      <p>
        All three — ExamMint, SarkariResizer, and easyPhoto — explicitly claim on-device
        processing. You can verify this yourself: open the browser&apos;s network tab while
        resizing a photo and check that no image upload request is sent. easyPhoto&apos;s
        source code is additionally verifiable because the tool runs entirely in client-side
        WebAssembly with no server endpoint for image data.
      </p>
    </BlogPostLayout>
  );
}
