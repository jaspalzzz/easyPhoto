import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("how-to-prepare-documents-for-exam-applications-india")!;

export const metadata = pageMetadata({
  title: post.title,
  titleAbsolute: true,
  description: post.description,
  path: `/blog/${post.slug}/`,
  type: "article",
});

export default function Page() {
  return (
    <BlogPostLayout slug={post.slug} ctaHref="/tools/exam-package/" ctaLabel="Prepare my exam documents">
      <p>
        Online exam portals reject documents for predictable, preventable reasons.
        The photo is too large. The signature has a grey background. The marksheet
        PDF exceeds the limit displayed by the portal. The Aadhaar shows
        all 12 digits when the form wanted a masked copy. None of these take more
        than a few minutes to fix — if you know what each portal expects before you
        start filling the form.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-[hsl(220_50%_18%)] p-5 text-white">
        <p className="!mt-0 text-sm font-semibold">Quick checklist</p>
        <ul className="!mt-2 list-none space-y-1.5 pl-0 text-[15px]">
          <li>
            <span className="mr-2 text-green-400">&#10003;</span>
            <strong>Photo</strong> — follow the selected portal&apos;s workflow;
            some request a prepared JPG while current SSC and RRB notices use live capture
          </li>
          <li>
            <span className="mr-2 text-green-400">&#10003;</span>
            <strong>Signature</strong> — follow the current format, ink, dimensions
            and KB instructions; these differ by portal
          </li>
          <li>
            <span className="mr-2 text-green-400">&#10003;</span>
            <strong>Certificate PDFs</strong> — marksheets, degree certificate and
            category proof compressed only to the limit shown by the current form
          </li>
          <li>
            <span className="mr-2 text-green-400">&#10003;</span>
            <strong>Aadhaar</strong> — masked copy with only the last 4 digits
            visible, compressed to the portal&apos;s document limit
          </li>
        </ul>
      </div>

      <h2>What do exam portals actually need for your photo?</h2>
      <p>
        Current workflows differ. IBPS publishes a 20–50&nbsp;KB prepared photo;
        UPSC (and NDA/CDS on the same portal) publishes 20&#8211;200&nbsp;KB and no
        fixed photo pixels, while the current SSC and RRB notices cited in the
        registry use live capture. These workflows should not be compared with an
        ordinary adult Passport Seva application: the adult&apos;s photograph is
        captured at the PSK/POPSK, while the 630&#215;810&nbsp;px guidance belongs
        to the overseas mission workflow.
      </p>
      <p>
        The safest approach: use the{" "}
        <Link href="/tools/exam-package/">exam document package tool</Link>, which
        applies the stored KB and pixel target for the selected preset. Check its
        source and verification status first; a needs-review entry must be
        confirmed in the current form. For a
        detailed breakdown of photo specs by exam, see the{" "}
        <Link href="/exam-requirements/">exam requirements directory</Link>.
      </p>
      <p>
        Visual rules are also portal-specific. Follow the current notice for
        glasses, background, recency, expression and framing rather than assuming
        that one passport-photo checklist applies to every exam.
      </p>

      <figure className="my-7 overflow-hidden rounded-xl border border-hairline">
        <div className="grid grid-cols-2">
          <div className="relative border-r border-hairline">
            <span className="absolute left-2 top-2 z-10 rounded bg-red-500/90 px-1.5 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
              Before
            </span>
            <Image
              src="/images/sample2_before_400.webp"
              alt="Input selfie before automated photo preparation"
              width={400}
              height={400}
              className="h-48 w-full object-cover object-top"
            />
          </div>
          <div className="relative">
            <span className="absolute left-2 top-2 z-10 rounded bg-green-600/90 px-1.5 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
              After
            </span>
            <Image
              src="/images/sample2_after_400.webp"
              alt="Prepared exam photo with a white background and adjusted head framing"
              width={400}
              height={400}
              className="h-48 w-full object-cover object-top"
            />
          </div>
        </div>
        <figcaption className="bg-accent/30 px-4 py-2.5 text-center text-[12.5px] text-muted-foreground">
          Illustration of a source photo and a prepared white-background version. The selected portal&apos;s current instructions still control submission.
        </figcaption>
      </figure>

      <h2>How do you prepare a digital signature for exam forms?</h2>
      <p>
        Follow the current notice&apos;s ink, paper, format, dimensions and KB band.
        Take a clear photo or scan in even light and keep the complete signature
        visible. SSC, IBPS and SBI record 10–20&nbsp;KB prepared signatures;
        UPSC instead records one 20–100&nbsp;KB image containing three signatures
        vertically. These are not interchangeable workflows.
      </p>
      <p>
        Use a transparent signature only when the destination accepts PNG or the
        image is being overlaid on a document. When a portal requires JPG/JPEG,
        export a white-background JPG instead. The{" "}
        <Link href="/tools/transparent-signature/">transparent signature tool</Link>{" "}
        does this in one click. For a broader walkthrough of portal
        signature rule, read{" "}
        <Link href="/blog/how-to-sign-exam-application-forms-india/">
          how to sign an exam application form in India
        </Link>
        .
      </p>
      <p>
        If your signature is the right content but the wrong dimensions or KB, use
        the{" "}
        <Link href="/tools/signature-resize/">signature resize tool</Link> to hit
        the selected target without redoing the whole process. It keeps your aspect
        ratio intact so the signature doesn&apos;t look squashed.
      </p>

      <h2>How do you compress certificate PDFs for exam portals?</h2>
      <p>
        Certificate limits are set by the active form and are not stored in the
        photo/signature registry. Read the document field&apos;s size and format
        instructions before compressing; do not apply a generic 50 or 100&nbsp;KB
        target to every certificate.
      </p>
      <p>
        A safer document workflow:
      </p>
      <ul>
        <li>
          <strong>10th and 12th marksheets</strong> — extract only the pages the
          form requests using
          the <Link href="/tools/pdf-split/">PDF split tool</Link>, then compress.
        </li>
        <li>
          <strong>Degree or diploma certificate</strong> — keep the required page
          legible and compress to the limit displayed by the current field.
        </li>
        <li>
          <strong>Caste, category, income or domicile certificate</strong> — include
          the complete requested certificate and preserve readable seals and text.
        </li>
        <li>
          <strong>Experience letter or NOC</strong> — combine only the pages the
          form requests, in the stated order and format.
        </li>
      </ul>
      <p>
        Enter the exact limit shown by the active field in the{" "}
        <Link href="/tools/pdf-compress/">custom PDF compress tool</Link>. The full compression guide at{" "}
        <Link href="/blog/how-to-compress-pdf/">how to compress a PDF</Link>{" "}
        explains what to do when a document won&apos;t go below a certain size.
      </p>

      <h2>Why must you mask your Aadhaar before uploading?</h2>
      <p>
        UIDAI recommends sharing a masked Aadhaar — one with only the last 4
        digits of the 12-digit number visible — whenever the full number
        isn&apos;t legally required. Most exam portal identity proofs fall into
        that category. Masking hides the first 8 digits under a black box that is
        burned into the image pixels and cannot be removed.
      </p>
      <p>
        The black box must be burned into the image, not just overlaid. Some PDF
        editors let you add a black rectangle but also let anyone delete it. A
        proper masking tool converts the mark into pixels so the original digits
        are gone. Read the full guide on{" "}
        <Link href="/blog/how-to-mask-aadhaar-before-sharing/">
          how to mask your Aadhaar before sharing it
        </Link>{" "}
        to see which approaches are secure and which aren&apos;t.
      </p>
      <p>
        After masking, compress the resulting image or PDF to the portal&apos;s
        document limit. Masked Aadhaar is typically a single page and compresses
        easily to under 100&nbsp;KB.
      </p>

      <h2>Document size limits by portal</h2>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Portal</th>
            <th className="py-2 pr-3 font-semibold text-ink">Photo limit</th>
            <th className="py-2 pr-3 font-semibold text-ink">Signature limit</th>
            <th className="py-2 pr-3 font-semibold text-ink">Document PDF limit</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["SSC (CGL, CHSL, MTS)", "Live capture", "10–20 KB", "Confirm the current notice"],
            ["UPSC (CSE, NDA, CDS)", "20–200 KB", "20–100 KB", "Confirm the current notice"],
            ["IBPS (PO, Clerk, SO)", "20–50 KB", "10–20 KB", "Confirm the current notice"],
            ["Railway (RRB NTPC, Group D)", "Live capture in the cited notice", "Current figures need review", "Confirm the current notice"],
            ["NTA (NEET, JEE)", "10–200 KB", "4–30 KB", "Confirm the current notice"],
            ["SBI PO / Clerk", "20–50 KB", "10–20 KB", "Confirm the current notice"],
          ].map(([portal, photo, sig, pdf]) => (
            <tr key={portal} className="border-b border-hairline/60">
              <td className="py-2 pr-3 font-medium text-ink">{portal}</td>
              <td className="py-2 pr-3">{photo}</td>
              <td className="py-2 pr-3">{sig}</td>
              <td className="py-2 pr-3">{pdf}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Always verify against the official notification for your specific cycle.
        The{" "}
        <Link href="/exam-requirements/">exam requirements directory</Link> links
        directly to each portal&apos;s current instructions.
      </p>

      <h2>The complete document preparation workflow</h2>
      <p>
        Preparing all four document types in the right order saves time and avoids
        having to redo steps. Here is the sequence that works:
      </p>
      <ul>
        <li>
          <strong>Step 1 - Photo.</strong> Take or select a recent photo on a
          white background. Use the{" "}
          <Link href="/tools/exam-package/">exam package tool</Link> to resize it
          to the exact KB and pixel spec for your target exam.
        </li>
        <li>
          <strong>Step 2 - Signature.</strong> Sign on white paper, photograph it,
          crop to the signature area. Remove the background if the portal requires
          transparent PNG. Resize to the KB target.
        </li>
        <li>
          <strong>Step 3 - Scan certificates.</strong> Scan in greyscale at
          200&nbsp;DPI. Colour scanning triples the file size for documents that
          are black-on-white. If you don&apos;t have a scanner, photograph each
          page flat against a neutral surface in good daylight.
        </li>
        <li>
          <strong>Step 4 - Extract required pages.</strong> If a marksheet PDF has
          8 pages but the portal only needs the final results page, use{" "}
          <Link href="/tools/pdf-split/">PDF split</Link> to extract it before
          compressing. Fewer pages means a much smaller output.
        </li>
        <li>
          <strong>Step 5 - Compress each document.</strong> Hit the portal&apos;s
          KB cap per document using{" "}
          <Link href="/tools/pdf-compress/">PDF compress</Link>. If you need to
          combine multiple documents first, merge them, then compress the result.
          See{" "}
          <Link href="/blog/how-to-merge-pdf-free/">
            how to merge PDF files free
          </Link>{" "}
          for that step.
        </li>
        <li>
          <strong>Step 6 - Mask your Aadhaar.</strong> Open the masking tool,
          cover the first 8 digits, download the masked copy, then compress it if
          needed.
        </li>
        <li>
          <strong>Step 7 - Upload.</strong> Keep all files in one folder named
          after the exam and cycle. That way, if the portal times out mid-upload,
          you can find every file immediately.
        </li>
      </ul>

      <h2>Common mistakes and how to fix them</h2>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Mistake</th>
            <th className="py-2 pr-3 font-semibold text-ink">Why it fails</th>
            <th className="py-2 pr-3 font-semibold text-ink">Fix</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            [
              "Photo outside the current field's stated band",
              "Prepared uploads may enforce both a minimum and a maximum",
              "Use the selected stored target, then compare it with the live form",
            ],
            [
              "Signature with grey background",
              "Phone photos in poor light pick up shadow tone",
              "Scan in good light or remove background with transparent signature tool",
            ],
            [
              "Certificate exceeds the displayed PDF limit",
              "Document limits vary by form and field",
              "Compress to the displayed limit while checking that text and seals remain readable",
            ],
            [
              "Full Aadhaar (all 12 digits visible)",
              "Some portals flag full Aadhaar uploads; also a privacy risk",
              "Mask to show only last 4 digits before uploading",
            ],
            [
              "Wrong photo dimensions for the portal's stated spec",
              "Some portals publish a required width × height; a mismatch is rejected",
              "Check the requirements page for your exam and match its stated size",
            ],
            [
              "PDF contains pages the form did not request",
              "Extra pages consume the file budget and may make the upload unclear",
              "Extract only the explicitly requested pages, then compress",
            ],
          ].map(([mistake, reason, fix]) => (
            <tr key={mistake} className="border-b border-hairline/60 align-top">
              <td className="py-2 pr-3 font-medium text-ink">{mistake}</td>
              <td className="py-2 pr-3">{reason}</td>
              <td className="py-2 pr-3">{fix}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-12">
        <Faq
          items={[
            {
              q: "What file size should my exam photo be?",
              a: "There is no universal exam-photo size. IBPS publishes a 20–50 KB prepared photo, UPSC publishes 20–200 KB, and current SSC applications capture the photograph live. Check the current notice for your exact exam and cycle.",
            },
            {
              q: "Can I upload a colour scan of my marksheet, or does it need to be greyscale?",
              a: "Use the colour mode requested by the form. Greyscale can reduce file size for text-only pages, but it may remove colour information from seals, stamps or annotations, so preview the result before submitting.",
            },
            {
              q: "Does my Aadhaar need to be masked for exam applications?",
              a: "Most exam portals accept masked Aadhaar for identity proof. UIDAI recommends sharing a masked copy (only the last 4 digits visible) whenever the full number isn't legally required. Check your portal's instruction; if it doesn't specifically ask for the full number, share the masked version.",
            },
            {
              q: "How far can I compress a certificate PDF?",
              a: "Compress only to the limit shown by the active form and inspect every page afterward. Very tight targets can make text, stamps, signatures or QR codes unreadable; extract unneeded pages before reducing quality further.",
            },
          ]}
        />
      </div>
    </BlogPostLayout>
  );
}
