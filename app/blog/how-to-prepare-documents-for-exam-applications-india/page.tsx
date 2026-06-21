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
        PDF is 3&nbsp;MB when the portal caps it at 100&nbsp;KB. The Aadhaar shows
        all 12 digits when the form wanted a masked copy. None of these take more
        than a few minutes to fix — if you know what each portal expects before you
        start filling the form.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-[hsl(220_50%_18%)] p-5 text-white">
        <p className="!mt-0 text-sm font-semibold">Quick checklist</p>
        <ul className="!mt-2 list-none space-y-1.5 pl-0 text-[15px]">
          <li>
            <span className="mr-2 text-green-400">&#10003;</span>
            <strong>Photo</strong> — JPG, white background, 20–50&nbsp;KB,
            350&#215;350&nbsp;px minimum (some portals want portrait, check yours)
          </li>
          <li>
            <span className="mr-2 text-green-400">&#10003;</span>
            <strong>Signature</strong> — JPG or PNG, black ink on white paper,
            10–20&nbsp;KB, transparent background for some portals
          </li>
          <li>
            <span className="mr-2 text-green-400">&#10003;</span>
            <strong>Certificate PDFs</strong> — marksheets, degree certificate,
            caste/category proof compressed to 50–100&nbsp;KB each
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
        Most Indian exam portals — SSC, UPSC, IBPS, Railway — require a JPG photo
        between 20&nbsp;KB and 50&nbsp;KB. Pixel dimensions vary: UPSC and NDA ask
        for a square image of at least 350&#215;350&nbsp;px, while Passport Seva
        wants a portrait 630&#215;810&nbsp;px. All of them want a plain white
        background with your face filling most of the frame.
      </p>
      <p>
        The safest approach: use the{" "}
        <Link href="/tools/exam-package/">exam document package tool</Link>, which
        knows the exact KB and pixel spec for each portal and resizes to it in one
        step. That way you don&apos;t guess whether 48&nbsp;KB qualifies as
        &ldquo;under 50&nbsp;KB&rdquo; (it does) or whether a slightly rectangular
        photo will pass a &ldquo;square&rdquo; portal (it won&apos;t). For a
        detailed breakdown of photo specs by exam, see the{" "}
        <Link href="/exam-requirements/">exam requirements directory</Link>.
      </p>
      <p>
        A few rules apply everywhere, regardless of portal. No glasses. No
        accessories that obscure the face. Taken recently — UPSC added a 10-day
        recency rule for CSE 2026. Good, even lighting with no shadows on the face
        or background. If your photo was taken in a studio more than a few weeks
        ago, retake it on a plain white wall.
      </p>

      <figure className="my-7 overflow-hidden rounded-xl border border-hairline">
        <div className="grid grid-cols-2">
          <div className="relative border-r border-hairline">
            <span className="absolute left-2 top-2 z-10 rounded bg-red-500/90 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Before
            </span>
            <Image
              src="/images/sample2_before_1782052888740.png"
              alt="Input selfie photo before AI correction — unsuitable for exam portal upload"
              width={400}
              height={400}
              className="h-48 w-full object-cover object-top"
            />
          </div>
          <div className="relative">
            <span className="absolute left-2 top-2 z-10 rounded bg-green-600/90 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              After
            </span>
            <Image
              src="/images/sample2_after_1782052904856.png"
              alt="AI-corrected exam photo with white background and correct head framing — ready to upload"
              width={400}
              height={400}
              className="h-48 w-full object-cover object-top"
            />
          </div>
        </div>
        <figcaption className="bg-accent/30 px-4 py-2.5 text-center text-[12.5px] text-muted-foreground">
          Left: original selfie. Right: auto-corrected photo with white background and correct head framing — ready for any exam portal.
        </figcaption>
      </figure>

      <h2>How do you prepare a digital signature for exam forms?</h2>
      <p>
        Sign your name on plain white paper with a black or blue pen. Take a clear
        photo of it in good light, or scan it at 200&nbsp;DPI. Crop out the blank
        space around the signature and save as JPG. Most portals want the file
        between 10&nbsp;KB and 20&nbsp;KB. SSC caps it at 20&nbsp;KB; IBPS and
        SBI at 20&nbsp;KB; UPSC accepts up to 100&nbsp;KB for the signature sheet.
      </p>
      <p>
        A few portals render your signature on a coloured form background. If your
        signature has a white JPG background, it will look like a white rectangle
        sitting on the form. To avoid that, remove the background so only the ink
        is visible. The{" "}
        <Link href="/tools/transparent-signature/">transparent signature tool</Link>{" "}
        does this in one click. For a full walkthrough of every portal&apos;s
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
        the exact spec without redoing the whole process. It keeps your aspect
        ratio intact so the signature doesn&apos;t look squashed.
      </p>

      <h2>How do you compress certificate PDFs for exam portals?</h2>
      <p>
        A scanned marksheet typically comes off a scanner at 1–4&nbsp;MB. A phone
        photo of a certificate can be 3–8&nbsp;MB. Most exam portals cap each
        document at 50–200&nbsp;KB. The gap feels huge, but it&apos;s very
        achievable: a greyscale scan of a single-page A4 document compresses to
        under 100&nbsp;KB without losing legibility at reading size.
      </p>
      <p>
        Target ranges by document type:
      </p>
      <ul>
        <li>
          <strong>10th and 12th marksheets</strong> — aim for 50–80&nbsp;KB per
          page. If yours is multi-page, extract only the required page first using
          the <Link href="/tools/pdf-split/">PDF split tool</Link>, then compress.
        </li>
        <li>
          <strong>Degree or diploma certificate</strong> — usually one page;
          80–120&nbsp;KB is achievable. If the portal cap is 100&nbsp;KB, use{" "}
          <Link href="/compress-pdf-to-100kb/">compress PDF to 100&nbsp;KB</Link>.
        </li>
        <li>
          <strong>Caste, category, income or domicile certificate</strong> — these
          are typically one page and compress well. Target 50–80&nbsp;KB.
        </li>
        <li>
          <strong>Experience letter or NOC</strong> — one to two pages;
          80–150&nbsp;KB is usually fine.
        </li>
      </ul>
      <p>
        For portals with a 50&nbsp;KB hard cap (SSC and UPSC annexures), use{" "}
        <Link href="/compress-pdf-to-50kb/">compress PDF to 50&nbsp;KB</Link>. For
        the broader category of portals that allow 100&nbsp;KB,{" "}
        <Link href="/tools/pdf-compress/">the custom PDF compress tool</Link> lets
        you enter any target. The full compression guide at{" "}
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
            ["SSC (CGL, CHSL, MTS)", "20–50 KB", "10–20 KB", "50 KB per document"],
            ["UPSC (CSE, NDA, CDS)", "20–300 KB", "up to 100 KB", "100–300 KB"],
            ["IBPS (PO, Clerk, SO)", "20–50 KB", "10–20 KB", "varies by doc"],
            ["Railway (RRB NTPC, Group D)", "up to 100 KB", "up to 30 KB", "200 KB"],
            ["NTA (NEET, JEE)", "10–200 KB", "4–30 KB", "100–300 KB"],
            ["SBI PO / Clerk", "20–50 KB", "10–20 KB", "50–200 KB"],
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
              "Photo over 50 KB",
              "Portal rejects at file-size check before any human review",
              "Use exam package tool — it targets the exact KB limit",
            ],
            [
              "Signature with grey background",
              "Phone photos in poor light pick up shadow tone",
              "Scan in good light or remove background with transparent signature tool",
            ],
            [
              "Marksheet PDF at 2 MB",
              "Portal cap is 100 KB — standard scanned page is 10-30x too large",
              "Compress to 100 KB; scan greyscale next time",
            ],
            [
              "Full Aadhaar (all 12 digits visible)",
              "Some portals flag full Aadhaar uploads; also a privacy risk",
              "Mask to show only last 4 digits before uploading",
            ],
            [
              "Wrong photo dimensions (portrait submitted to square portal)",
              "UPSC and NDA require square — rectangular image is rejected",
              "Check the requirements page for your exam; crop to square",
            ],
            [
              "PDF with the wrong pages (entire 60-page marksheet booklet)",
              "Portal cap is per document — only the result page is needed",
              "Extract required pages with PDF split, then compress",
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
              a: "Most Indian exam portals require a JPG photo between 20 KB and 50 KB. SSC caps at 50 KB, IBPS at 50 KB, and UPSC accepts up to 300 KB. Always check the official notification for your specific exam cycle — portals occasionally update their specs.",
            },
            {
              q: "Can I upload a colour scan of my marksheet, or does it need to be greyscale?",
              a: "Colour scans are usually accepted, but they're much larger — sometimes 3-5 times bigger than a greyscale scan of the same page. If you're struggling to get a PDF under 100 KB, switch to greyscale. The text is black-on-white anyway, so nothing is lost.",
            },
            {
              q: "Does my Aadhaar need to be masked for exam applications?",
              a: "Most exam portals accept masked Aadhaar for identity proof. UIDAI recommends sharing a masked copy (only the last 4 digits visible) whenever the full number isn't legally required. Check your portal's instruction; if it doesn't specifically ask for the full number, share the masked version.",
            },
            {
              q: "My certificate PDF is 4 MB. Can it really be compressed to 100 KB?",
              a: "Yes, for most scanned government documents. A greyscale A4 page is mostly white space with black text — that data compresses extremely well. A 4 MB colour scan of a single-page certificate typically reaches 80-120 KB after greyscale compression. Multi-page documents compress proportionally; extract only the required page first if the cap is tight.",
            },
          ]}
        />
      </div>
    </BlogPostLayout>
  );
}
