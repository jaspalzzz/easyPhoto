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
        Online exam forms refuse documents for a few avoidable reasons. The
        photo is too large. The signature has a grey background. The marksheet
        PDF is over the limit shown next to the upload box. The Aadhaar shows all
        12 digits. Each takes a few minutes to fix if you prepare the files
        before you open the form.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-[hsl(220_50%_18%)] p-5 text-white">
        <p className="!mt-0 text-sm font-semibold">Quick checklist</p>
        <ul className="!mt-2 list-none space-y-1.5 pl-0 text-[15px]">
          <li>
            <span className="mr-2 text-green-400">&#10003;</span>
            <strong>Photo</strong> — a JPG file for IBPS, SBI and UPSC; no file
            at all for SSC and RRB, which photograph you live in the form
          </li>
          <li>
            <span className="mr-2 text-green-400">&#10003;</span>
            <strong>Signature</strong> — black ink on white paper, saved as a JPG
            inside the exam&apos;s KB band
          </li>
          <li>
            <span className="mr-2 text-green-400">&#10003;</span>
            <strong>Certificate PDFs</strong> — only the pages the form asks for,
            compressed to the limit shown next to each upload box
          </li>
          <li>
            <span className="mr-2 text-green-400">&#10003;</span>
            <strong>Aadhaar</strong> — a masked copy with only the last 4 digits
            visible, unless the form asks for the full number
          </li>
        </ul>
      </div>

      <h2>The photo and the signature</h2>
      <p>
        Exams don&apos;t share one photo size. IBPS and SBI want a 20–50&nbsp;KB
        photo at 200&#215;230&nbsp;px, UPSC accepts 20–200&nbsp;KB with no fixed
        pixel size, and SSC and RRB take the photo live through your camera.
        Signatures differ too, and UPSC wants three signatures in one image. The
        bands for each exam are in the{" "}
        <Link href="/blog/exam-photo-signature-size-guide/">exam photo and signature size guide</Link>,
        and the signing steps are in{" "}
        <Link href="/blog/how-to-sign-exam-application-forms-india/">
          how to sign an exam application form
        </Link>
        .
      </p>
      <p>
        The{" "}
        <Link href="/tools/exam-package/">Exam Application Kit</Link> makes both
        files for the exam you pick, at the sizes its notice gives. Where a
        figure on an exam page is marked as not yet confirmed, check it against
        the live form before you upload.
      </p>

      <figure className="my-7 overflow-hidden rounded-xl border border-hairline">
        <div className="grid grid-cols-2">
          <div className="relative border-r border-hairline">
            <span className="absolute left-2 top-2 z-10 rounded bg-red-500/90 px-1.5 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
              Before
            </span>
            <Image
              src="/images/sample2_before_400.webp"
              alt="Input selfie before photo preparation"
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
        <figcaption className="bg-accent/30 px-4 py-2.5 text-center text-[12px] text-muted-foreground">
          Example: a phone selfie and the same photo on a white background with the head re-framed.
        </figcaption>
      </figure>

      <h2>Certificate PDFs</h2>
      <p>
        Certificate limits are set by each upload box, so read the size and
        format printed beside it before compressing; there is no common
        50 or 100&nbsp;KB figure. Then:
      </p>
      <ul>
        <li>
          <strong>10th and 12th marksheets</strong> — keep only the pages the form
          asks for (most PDF readers can save selected pages as a new PDF), then
          compress.
        </li>
        <li>
          <strong>Degree or diploma certificate</strong> — keep the required
          page readable at the size the box allows.
        </li>
        <li>
          <strong>Caste, category, income or domicile certificate</strong> — include
          the whole certificate and keep seals and text readable.
        </li>
        <li>
          <strong>Experience letter or NOC</strong> — combine only the pages the
          form asks for, in the stated order. Combine first and compress the
          combined file, because merging adds the sizes together.
        </li>
      </ul>
      <p>
        If a scan will not come under the limit, scan it again at 150 to
        200&nbsp;DPI, or in black and white for a text-only page, rather than
        squeezing a full-colour scan harder. Keep colour where a seal or stamp
        needs it, and check every page after compressing.
      </p>

      <h2>A masked Aadhaar</h2>
      <p>
        UIDAI recommends sharing a masked Aadhaar, with only the last 4 of the
        12 digits visible, wherever the full number isn&apos;t legally required.
        The simplest way is UIDAI&apos;s own: on myAadhaar, choose the masked
        version when you download e-Aadhaar. If you mask a copy yourself, the
        box must be solid and saved into the image; a box drawn on top of a PDF
        can often be deleted. The{" "}
        <Link href="/blog/how-to-mask-aadhaar-before-sharing/">
          Aadhaar masking guide
        </Link>{" "}
        covers both routes. If the form asks for the full number, follow the
        form.
      </p>

      <h2>An order that saves redoing work</h2>
      <ol>
        <li>
          <strong>Photo.</strong> For forms that take a file, take a fresh photo
          on a plain white background and prepare it for your exam.
        </li>
        <li>
          <strong>Signature.</strong> Sign on white paper, photograph it, crop to
          the ink and size it to the exam&apos;s KB band.
        </li>
        <li>
          <strong>Certificates.</strong> Scan each page flat in good light, keep
          only the requested pages, then compress each file to its box&apos;s limit.
        </li>
        <li>
          <strong>Aadhaar.</strong> Download the masked e-Aadhaar and compress it
          if the box needs a smaller file.
        </li>
        <li>
          <strong>Upload.</strong> Keep every file in one folder named after the
          exam and year, so a timed-out session doesn&apos;t send you hunting for
          them.
        </li>
      </ol>

      <div className="mt-12">
        <Faq
          items={[
            {
              q: "Can I upload a colour scan of my marksheet, or does it need to be greyscale?",
              a: "Use the colour mode the form asks for. Greyscale makes a text-only page smaller, but it can wash out coloured seals, stamps or signatures, so preview the result before submitting.",
            },
            {
              q: "How far can I compress a certificate PDF?",
              a: "Only to the limit shown by the upload box, and check every page afterward. Very small files can make text, stamps, signatures or QR codes unreadable, so remove pages the form didn't ask for before lowering the quality.",
            },
          ]}
        />
      </div>
    </BlogPostLayout>
  );
}
