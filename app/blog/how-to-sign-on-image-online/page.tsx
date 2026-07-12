import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("how-to-sign-on-image-online")!;

const FAQ_ITEMS = [
  {
    q: "How do I sign on an image online?",
    a: "Upload the image, draw your signature or upload a transparent signature PNG, place it on the image, resize it, then download the signed image. The file is processed in your browser.",
  },
  {
    q: "Can I add a signature to a photo without a white box?",
    a: "Yes. Use a transparent signature PNG before placing it on the photo. That keeps only the ink visible, without a white rectangle around the signature.",
  },
  {
    q: "Is signing an image the same as signing a PDF?",
    a: "No. Use Sign Image when your base file is JPG, PNG or WebP. Use Sign PDF when the document is a PDF and you need to place the signature on a PDF page.",
  },
  {
    q: "Is my signature uploaded?",
    a: "No. The image and signature are processed locally in your browser; they are not uploaded to a server.",
  },
  {
    q: "What file size should a signed image be for a portal upload?",
    a: "It depends on the portal — most Indian exam and government portals want JPEG and cap the file between 20 KB and 200 KB. Signing adds slightly to the file, so if the signed image goes over the limit, compress it back to the target with a resize-to-KB tool before submitting.",
  },
  {
    q: "Will signing reduce my photo's quality?",
    a: "Placing a signature layer doesn't degrade the photo itself — the signature is drawn on top. Quality only drops if you later compress the exported JPEG hard to hit a small KB limit. Export at the size the upload actually needs rather than the smallest possible.",
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
      faqItems={FAQ_ITEMS}
      ctaHref="/tools/sign-image/"
      ctaLabel="Sign an image now"
    >
      <div className="mb-5 text-sm text-muted-foreground">
        Last reviewed 12 July 2026 · Tested with the current easyPhoto Sign Image tool
      </div>
      <p>
        If a form, certificate, scanned JPG or photo needs your signature on top
        of it, you do not need to print, sign and scan again. You can sign on an
        image online by placing a handwritten signature layer directly over the
        photo, then exporting the final JPG or PNG.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>
            Use{" "}
            <Link href="/tools/sign-image/">
              Sign Image
            </Link>{" "}
            for JPG, PNG, WebP and photo files.
          </li>
          <li>
            Draw your signature in the browser or upload a clean transparent
            signature PNG.
          </li>
          <li>
            Place the signature where it belongs, resize it, and download the
            signed image.
          </li>
          <li>
            Use{" "}
            <Link href="/tools/sign-pdf/">
              Sign PDF
            </Link>{" "}
            instead when the file is a PDF.
          </li>
        </ul>
      </div>

      <h2>Tested before and after</h2>
      <p>
        We tested the <Link href="/tools/sign-image/">Sign Image tool</Link> with a
        synthetic 800 × 500 px PNG document and a transparent signature layer.
        The downloaded JPG remained 800 × 500 px: placing the signature changed
        the pixels inside the image, but did not crop or resize the document.
        That is the key check before uploading—open the download and confirm both
        the signature position and the unchanged canvas dimensions.
      </p>

      <h2>When do you actually need to sign on an image?</h2>
      <p>
        More often than you&apos;d expect. Because so many forms are now shared and
        submitted as pictures rather than editable PDFs, the situations where you
        need a signature <em>on an image</em> are common:
      </p>
      <ul className="my-4 list-disc space-y-1.5 pl-5 text-[15px]">
        <li>
          A <strong>scanned or photographed form</strong> — a bank KYC page,
          declaration, or undertaking that arrived as a JPG and has to go back signed.
        </li>
        <li>
          An <strong>exam or job application</strong> asking for a signed photo or a
          signed declaration image uploaded alongside the photo.
        </li>
        <li>
          A <strong>self-attested document copy</strong> — a marksheet, ID or
          certificate scan where you sign across your own copy before sharing.
        </li>
        <li>
          A <strong>letter or agreement</strong> received as an image (a WhatsApp
          photo of a rent or offer letter) that needs a quick visible signature.
        </li>
        <li>
          Any case where the portal only accepts <strong>JPG or PNG</strong>, so a
          signed PDF wouldn&apos;t be accepted in the first place.
        </li>
      </ul>
      <p>
        In each of these the base file is already an image, so the goal is simply to
        place a clean signature on top and export the same format.
      </p>

      <h2>When should you sign on an image instead of a PDF?</h2>
      <p>
        Sign on an image when the document you received is already a picture:
        a scanned certificate, a photographed declaration, a JPG form, a PNG
        receipt, or a photo that needs a visible signature. The output remains
        an image, so it is easy to upload wherever the portal asks for JPG or
        PNG.
      </p>
      <p>
        Use the{" "}
        <Link href="/tools/sign-pdf/">
          PDF signer
        </Link>{" "}
        when the original file is a PDF. PDF pages need different handling so
        text and page quality are preserved.
      </p>

      <h2>Best workflow to add a signature to a photo</h2>
      <p>
        The cleanest result comes from preparing the signature first. Sign on
        plain white paper with dark ink, photograph or scan it, then convert it
        into a transparent PNG. A transparent signature sits on the image without
        a white box around it.
      </p>
      <ol className="mt-4 list-decimal space-y-2 pl-5">
        <li>
          Make a clean signature using the{" "}
          <Link href="/tools/transparent-signature/">
            transparent signature tool
          </Link>
          .
        </li>
        <li>
          Open the{" "}
          <Link href="/tools/sign-image/">
            Sign Image tool
          </Link>{" "}
          and upload the photo or scanned image.
        </li>
        <li>
          Upload or draw your signature, then place it on the signature line.
        </li>
        <li>
          Resize the signature so it matches the document, leaving enough margin
          around the ink.
        </li>
        <li>
          Download the signed image and upload it to the form or portal.
        </li>
      </ol>

      <h2>Draw signature vs upload signature PNG</h2>
      <p>
        Drawing directly is fastest when the signature only needs to be visible
        on a basic image. Uploading a transparent PNG is better for formal
        documents because it looks closer to your normal handwritten signature
        and avoids shaky mouse or touch input.
      </p>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Method</th>
            <th className="py-2 pr-4 font-semibold text-ink">Best for</th>
            <th className="py-2 font-semibold text-ink">Tradeoff</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["Draw in browser", "Quick approvals, informal images", "Can look uneven on mobile"],
            ["Upload transparent PNG", "Forms, certificates, official scans", "Needs one preparation step"],
            ["Upload white-background JPG", "Portals that require JPG only", "May show a white rectangle"],
          ].map(([method, best, tradeoff]) => (
            <tr key={method} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{method}</td>
              <td className="py-2 pr-4">{best}</td>
              <td className="py-2">{tradeoff}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>How to avoid a white box around the signature</h2>
      <p>
        The white box appears when the signature image still contains the paper
        background. Convert the signature to transparent PNG first, or use a
        very clean white-background signature only when the target image itself
        has a white background.
      </p>
      <p>
        If the signature scan is grey, shadowed or too large, clean it with the{" "}
        <Link href="/tools/signature-cleaner/">
          signature cleaner
        </Link>{" "}
        before placing it on the image.
      </p>

      <h2>Common problems when signing an image — and how to fix each</h2>
      <p>
        Most issues come down to the signature layer, not the photo. Here are the
        ones that come up most often and the fix for each.
      </p>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Problem</th>
            <th className="py-2 font-semibold text-ink">Fix</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["A white box sits behind the signature", "Convert the signature to a transparent PNG before placing it, so only the ink shows."],
            ["The signature is blurry or pixelated", "Re-scan or re-photograph it in good, even light at higher resolution; a tiny signature scaled up will always look soft."],
            ["The signature is too big or too small", "Resize it after placing — it should sit on the signature line with a clear margin, not overlap the face or edges."],
            ["You can barely see the signature", "It's probably over a dark part of the photo. Move it onto a lighter area, or use a darker ink signature for contrast."],
            ["The signed file is rejected for being too large", "Signing can push a JPEG/PNG over a portal's KB limit. Compress the exported file to the required size afterwards."],
            ["The portal only accepts JPEG", "Export the signed image as JPG rather than PNG — but note a JPG can't keep a transparent signature background, so flatten it onto the photo first."],
          ].map(([problem, fix]) => (
            <tr key={problem} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{problem}</td>
              <td className="py-2">{fix}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>What file size and format do portals accept for a signed image?</h2>
      <p>
        There is no single answer — it depends on where you upload the signed
        image. Exam and government portals each set their own limit, and signing
        adds a little to the file, so it&apos;s worth checking before you submit.
        Do not rely on a universal limit: the permitted format and size belong to
        the specific form. Check its current upload instructions before signing,
        then use the exact limit shown there.
      </p>
      <p>
        If your signed image is over the limit, resize it to the exact target with
        the{" "}
        <Link href="/tools/resize-kb/">
          compress-to-KB tool
        </Link>{" "}
        — it brings a JPG or PNG under a chosen KB size in your browser. For the
        exact photo and signature limits of specific documents (PAN, Voter ID,
        Driving Licence, Aadhaar), the{" "}
        <Link href="/blog/indian-government-id-photo-requirements/">
          Indian government ID photo requirements guide
        </Link>{" "}
        lists each portal&apos;s cap.
      </p>

      <h2>Privacy: does the image upload anywhere?</h2>
      <p>
        The easyPhoto signing tools run in your browser. Your photo, document
        image and signature stay on your device while you place and export the
        final file. This matters for ID documents, certificates and forms that
        include personal information.
      </p>

      <Faq items={FAQ_ITEMS} noSchema />
    </BlogPostLayout>
  );
}
