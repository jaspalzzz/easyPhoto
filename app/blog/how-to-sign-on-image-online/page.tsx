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
