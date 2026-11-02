import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";
import { PORTAL_PRESETS } from "@/lib/portalPresets";
import {
  kbBand,
  SIGNATURE_GUIDE_FAQ_ITEMS,
  SIGNATURE_GUIDE_ROWS,
} from "@/lib/examGuideCopy";

const post = getPost("how-to-sign-exam-application-forms-india")!;
const ssc = PORTAL_PRESETS.ssc;
const upsc = PORTAL_PRESETS.upsc;
const rrb = PORTAL_PRESETS.rrb;

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
      ctaHref="/tools/signature-background-removal/"
      ctaLabel="Make my exam signature"
    >
      <p>
        When an exam notification says &#8220;upload your signature,&#8221; it
        means a picture of your handwritten signature, not a typed name. SSC,
        IBPS, SBI and RRB each want one signature in a JPG with their own KB
        band; UPSC wants three signatures stacked in one image. This guide shows
        how to sign, photograph and size the file for each.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>
            Sign in black ink on plain white paper; IBPS, SBI, RRB and UPSC all
            ask for black.
          </li>
          <li>
            Photograph or scan the signature, crop close to the ink, and save it
            as a <strong>JPG (JPEG)</strong>.
          </li>
          <li>
            Land inside both ends of the KB band: {kbBand(ssc.sigMinKb, ssc.sigLimitKb)}{" "}
            for SSC, IBPS and SBI, {kbBand(rrb.sigMinKb, rrb.sigLimitKb)} for
            RRB, and {kbBand(upsc.sigMinKb, upsc.sigLimitKb)} for UPSC&apos;s
            three-signature image.
          </li>
          <li>
            Sign the way you will sign in the exam hall. Your signature is
            compared with the one you upload.
          </li>
        </ul>
      </div>

      <h2>Signature sizes by exam</h2>
      <p>
        Each row comes from the notice linked on that exam&apos;s page in the{" "}
        <Link href="/exam-requirements/">exam requirements directory</Link>.
        Notices can change between recruitment cycles, so check the current one
        before you apply.
      </p>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Exam</th>
            <th className="py-2 pr-3 font-semibold text-ink">File size</th>
            <th className="py-2 pr-3 font-semibold text-ink">Pixel size</th>
            <th className="py-2 pr-3 font-semibold text-ink">Format</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {SIGNATURE_GUIDE_ROWS.map((row) => (
            <tr key={row.id} className="border-b border-hairline/60">
              <td className="py-2 pr-3 font-medium text-ink">{row.label}</td>
              <td className="py-2 pr-3">{row.signature}</td>
              <td className="py-2 pr-3">{row.signatureDimensions}</td>
              <td className="py-2 pr-3">
                {row.format.startsWith("Signature: ")
                  ? row.format.slice("Signature: ".length)
                  : row.format.includes("signature: ")
                    ? row.format.split("signature: ")[1]
                    : row.format}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        Two rules sit outside the table. IBPS states that a signature written in
        capital letters will not be accepted, and RRB lists block or capital
        letters among its rejection reasons, so sign in your ordinary running
        hand. SSC gives a physical size instead of pixels: sign inside a box
        about 6&nbsp;cm wide and 2&nbsp;cm high.
      </p>

      <h2>How to prepare the signature, step by step</h2>

      <h3>Step 1 - write it</h3>
      <p>
        Use a clean sheet of plain white paper with no lines. Sign in the
        centre with a black ballpoint or gel pen, leaving a wide border; avoid
        felt tips, which bleed at the edges. If the first attempt looks rushed or
        small, sign again below it and use the better one. For UPSC, sign three
        times, one below the other, with space between them.
      </p>

      <h3>Step 2 - photograph it</h3>
      <p>
        Lay the paper flat near a window, out of direct sunlight, which washes
        out ink. Hold the phone directly above the paper, tap the signature to
        focus, and shoot. A scan app such as Adobe Scan or Microsoft Lens
        straightens the page if your phone has to shoot at an angle.
      </p>

      <h3>Step 3 - crop</h3>
      <p>
        Crop close to the ink with a thin white margin on every side. Don&apos;t
        clip the top of tall letters or the tail of a descender: a cut-off
        signature can be refused even when the file size is right.
      </p>

      <h3>Step 4 - set the pixel size, where one is published</h3>
      <p>
        IBPS and SBI give a preferred 140&#215;60 px, RRB asks for at least
        140&#215;60 px, and UPSC asks for 350–500 px.
        SSC publishes no pixel size. In the{" "}
        <Link href="/tools/signature-resize/">signature resize tool</Link>,
        enter the pixel size and KB band from the table.
      </p>

      <h3>Step 5 - check the file size</h3>
      <p>
        Open the saved file&apos;s details and confirm the size sits inside the
        band, not just under the top of it. If it is slightly over, lower the
        JPG quality a little rather than shrinking the image again.
      </p>

      <h2>When is a transparent signature useful?</h2>
      <p>
        A transparent PNG signature is for placing your ink over a declaration,
        a scanned form or another image without a white box around it. Exam
        uploads in the table want a JPG on white, so it is not the file to
        upload there. The{" "}
        <Link href="/tools/signature-background-removal/">
          signature background remover
        </Link>{" "}
        makes either version from one scan: a transparent PNG for documents, or
        a white-background JPG for a portal. To place a signature on an image,
        use the <Link href="/tools/sign-image/">sign image tool</Link>.
      </p>

      <h2>Why signature uploads are refused</h2>
      <ul>
        <li>
          <strong>Ink too light.</strong> Pencil or a fading pen leaves a faint
          grey line that can be hard to read once compressed. Use a fresh black
          pen with firm pressure.
        </li>
        <li>
          <strong>Grey or tinted background.</strong> A wooden table, a coloured
          desk or warm lamplight tints the paper. Shoot white paper in daylight,
          or clean the tone with the signature tools above.
        </li>
        <li>
          <strong>File outside the band.</strong> Even 1&nbsp;KB over the limit
          is refused, and so is a file under the minimum.
        </li>
        <li>
          <strong>Wrong format.</strong> Renaming a PNG to .jpg does not convert
          it. Re-export it as a JPG.
        </li>
      </ul>
      <p>
        Photo problems and other upload faults are covered in{" "}
        <Link href="/blog/why-exam-photo-signature-rejected/">
          why exam photos &amp; signatures get rejected
        </Link>
        , and the photo sizes for the same exams are in the{" "}
        <Link href="/blog/exam-photo-signature-size-guide/">
          exam photo &amp; signature size guide
        </Link>
        . The signature tools run in your browser, so your signature is never
        sent to a server.
      </p>

      <div className="mt-12">
        <Faq items={SIGNATURE_GUIDE_FAQ_ITEMS} />
      </div>
    </BlogPostLayout>
  );
}
