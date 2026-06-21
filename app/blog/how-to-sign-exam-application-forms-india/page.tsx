import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("how-to-sign-exam-application-forms-india")!;

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
      ctaHref="/tools/transparent-signature/"
      ctaLabel="Make my exam signature"
    >
      <p>
        When an exam notification says &#8220;upload your signature,&#8221; it
        means a digital image of your handwritten signature, not a typed name or
        an electronic drawing. You write your name on plain white paper, scan or
        photograph it, and upload the resulting JPG file. Every major portal,
        from SSC to UPSC to IBPS, follows this same process. The differences
        come down to the exact KB limit, the pixel dimensions, and whether the
        background must be white or transparent.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>
            Sign on <strong>plain white paper</strong> using black or dark blue
            ink. Use your full normal signature, not a short initial.
          </li>
          <li>
            Photograph or scan the signature, crop tightly around it, and save
            as a <strong>JPG (JPEG)</strong> file.
          </li>
          <li>
            Compress the file to under the portal&apos;s KB limit.{" "}
            <strong>Most portals require 10&#8211;20 KB</strong>. Some allow up
            to 30 KB.
          </li>
          <li>
            For Army Agniveer and NDA forms, the signature sits on a coloured
            form background, so those portals accept a{" "}
            <strong>transparent PNG</strong> as well.
          </li>
        </ul>
      </div>

      <h2>What does &#8220;sign the application form&#8221; actually mean?</h2>
      <p>
        Online application forms do not let you sign with a stylus or mouse
        draw. Instead, they ask you to upload an image of your physical
        signature. The portal places that image on the printed admit card or
        form, next to your photograph. When you appear for the exam, the
        invigilator matches the signature on your admit card against a live
        signature you give in the hall.
      </p>
      <p>
        This matters for one practical reason: your uploaded signature must look
        like the signature you write in the exam hall. Candidates who upload a
        rushed or non-standard version, and then sign differently on exam day,
        risk getting flagged during verification.
      </p>

      <h2>
        What are the two signature types accepted by exam portals?
      </h2>
      <p>
        Almost all portals accept a scanned signature on a white background,
        saved as a JPG. A small number of portals, mainly Army Agniveer and NDA
        online applications, also accept a transparent-background PNG. The
        transparent version looks cleaner on the printed form because the form
        colour shows through instead of a white box appearing behind the
        signature.
      </p>
      <p>
        For portals that only accept JPG, the background must be white, not
        grey, not cream. A grey background is a common rejection reason because
        the portal scanner reads it as a non-compliant image or, worse, mistakes
        the smudged area for an incomplete signature.
      </p>

      <h2>Portal-by-portal signature specifications</h2>
      <p>
        The table below lists the confirmed specifications from official
        notifications. Always cross-check the current notification before you
        apply, as portals occasionally revise limits between recruitment cycles.
        The{" "}
        <Link href="/exam-requirements/">exam requirements directory</Link> links
        each portal&apos;s official notification directly.
      </p>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Portal</th>
            <th className="py-2 pr-3 font-semibold text-ink">File size</th>
            <th className="py-2 pr-3 font-semibold text-ink">Dimensions</th>
            <th className="py-2 pr-3 font-semibold text-ink">Format</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {(
            [
              ["SSC (CGL, CHSL, MTS)", "10–20 KB", "140×60 px", "JPG"],
              ["UPSC (CSE, NDA, CDS)", "10–20 KB", "350×350 px min", "JPG"],
              ["IBPS (PO, Clerk, SO)", "10–20 KB", "140×60 px", "JPG"],
              ["SBI (PO, Clerk)", "10–20 KB", "140×60 px", "JPG"],
              ["RRB (NTPC, Group D)", "10–20 KB", "140×60 px", "JPG"],
              ["Army Agniveer", "10–20 KB", "140×60 px", "JPG or transparent PNG"],
            ] as const
          ).map(([portal, size, dims, fmt]) => (
            <tr key={portal} className="border-b border-hairline/60">
              <td className="py-2 pr-3 font-medium text-ink">{portal}</td>
              <td className="py-2 pr-3">{size}</td>
              <td className="py-2 pr-3">{dims}</td>
              <td className="py-2 pr-3">{fmt}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        Notice that UPSC uses a square minimum dimension (350&#215;350 px),
        whereas SSC and IBPS use a wide, short rectangle (140&#215;60 px). If
        you prepare one signature image for SSC and try to submit it to UPSC, it
        will fail the dimension check. Prepare separate crops for square-format
        and rectangular-format portals.
      </p>

      <h2>How do you prepare a compliant digital signature?</h2>
      <p>
        The process has five steps. Each one affects whether the portal accepts
        your upload.
      </p>

      <h3>Step 1 - write the signature</h3>
      <p>
        Use a clean sheet of white A4 or letter paper. Sign in the centre of
        the page, leaving a border of at least 2 cm on all sides. Use a black
        or dark blue ballpoint pen. Gel and rollerball pens work, but avoid felt
        tips, which bleed at the edges and scan poorly. Sign once. If the result
        looks rushed or too small, sign again below and use that crop.
      </p>

      <h3>Step 2 - capture it</h3>
      <p>
        Place the paper flat on a table near a window. Use your phone camera in
        good natural light. Avoid direct sunlight, which creates hot spots that
        wash out ink. Hold the phone directly above the paper, parallel to the
        surface. Tap the screen on the signature to focus, then shoot. Scan apps
        like Adobe Scan or Microsoft Lens flatten the perspective and increase
        contrast automatically, which is worth using if your phone shoots at an
        angle.
      </p>

      <h3>Step 3 - crop tightly</h3>
      <p>
        Open the image in any photo editor or the{" "}
        <Link href="/tools/signature-resize/">signature resize tool</Link>. Crop
        to leave roughly 8&#8211;10 px of white space on all four sides of the
        signature strokes. Do not crop so tight that the ascenders or descenders
        of letters touch the edge. The portal will reject a clipped signature.
      </p>

      <h3>Step 4 - resize to the portal&apos;s pixel dimensions</h3>
      <p>
        Resize the crop to the exact pixel dimensions the portal specifies.
        Rectangle portals (SSC, IBPS) need roughly 140&#215;60 px. Square
        portals (UPSC) need at least 350&#215;350 px. The{" "}
        <Link href="/tools/signature-resize/">signature resize tool</Link> lets
        you enter the target dimensions and outputs the correctly sized image.
      </p>

      <h3>Step 5 - compress to the KB limit</h3>
      <p>
        Save as JPG and check the file size. Most exam portals cap signatures at
        20 KB. A correctly sized JPG at 140&#215;60 px will usually be well
        under 20 KB already. If it is over the limit, reduce the JPG quality
        slightly. Do not save as PNG for portals that only accept JPG, as PNG
        files for signatures are typically 30&#8211;80 KB and will exceed the
        limit.
      </p>

      <h2>Why does a transparent background matter for some portals?</h2>
      <p>
        Army Agniveer and NDA application forms print the signature directly
        onto a coloured or patterned background on the admit card. If your
        signature image has a white background, a white rectangle appears on the
        card around the signature, which looks unprofessional and can confuse
        invigilators during identity verification.
      </p>
      <p>
        When the portal accepts a transparent PNG, the signature strokes appear
        directly on the form background with no white box. The{" "}
        <Link href="/tools/transparent-signature/">
          transparent signature tool
        </Link>{" "}
        removes the white background from your scanned signature in one step and
        exports a PNG file sized to the portal&apos;s requirements. It runs
        entirely in your browser, so the signature image is never uploaded
        anywhere.
      </p>
      <p>
        For all other portals (SSC, UPSC, IBPS, SBI, RRB), a white-background
        JPG is the correct format. Submitting a transparent PNG to a portal that
        expects JPG will either be rejected outright or render as a broken
        image.
      </p>

      <h2>What are the most common reasons exam signatures get rejected?</h2>
      <p>
        Signature rejections follow a short, predictable list. If your upload
        fails, one of the following is almost certainly the cause.
      </p>

      <ul>
        <li>
          <strong>Ink too light.</strong> Light pencil or faded ballpoint
          creates a grey trace that portals sometimes interpret as a blank field.
          Use a fresh black or dark blue pen with confident pressure.
        </li>
        <li>
          <strong>Signature cut off at the edge.</strong> Cropping too tightly
          clips the top of tall letters or the tail of a descender. The portal
          rejects cropped signatures during its automated check.
        </li>
        <li>
          <strong>White background treated as blank.</strong> Some portals use
          contrast detection to verify a signature is present. If the ink is
          very light against white, the algorithm reads the field as empty.
          Increase pen pressure or use a scanner set to high contrast.
        </li>
        <li>
          <strong>File exceeds the KB limit.</strong> Even a 1 KB overage causes
          an immediate rejection. Check the file size before uploading. Reduce
          JPG quality by 5&#8211;10% if the file is just over the cap.
        </li>
        <li>
          <strong>Wrong file format.</strong> Uploading a PNG to a JPG-only
          portal, or a JPEG with a .jpg extension that was actually saved as PNG
          internally, fails the format check. Always re-export from your editor
          rather than renaming the extension.
        </li>
        <li>
          <strong>Grey or coloured background.</strong> Shooting against a
          wooden table, a light-blue desk, or in warm lamplight gives the
          background a tint. Use daylight and a clean white sheet.
        </li>
        <li>
          <strong>Dimensions outside the allowed range.</strong> A signature
          image that is 200&#215;200 px submitted to an SSC portal expecting
          140&#215;60 px will be rejected. Match the dimensions exactly.
        </li>
      </ul>

      <p>
        For a broader look at what causes upload failures across photos and
        signatures, see{" "}
        <Link href="/blog/why-exam-photo-signature-rejected/">
          why exam photos &amp; signatures get rejected
        </Link>
        .
      </p>

      <h2>Which tools make the process faster?</h2>
      <p>
        Two tools cover the full workflow without requiring any account or
        upload.
      </p>

      <ul>
        <li>
          <Link href="/tools/signature-resize/">Signature resize tool</Link>:
          takes your cropped signature image, resizes it to the exact pixel
          dimensions you enter, and compresses the output to a target KB limit.
          Handles both rectangular (SSC, IBPS) and square (UPSC) formats.
        </li>
        <li>
          <Link href="/tools/transparent-signature/">
            Transparent signature tool
          </Link>: removes the white background from a scanned signature and
          exports a transparent PNG sized for Army Agniveer or NDA portals. The
          same tool works for any portal that accepts PNG with transparency.
        </li>
      </ul>

      <p>
        Both tools process your image on your device. No image data leaves your
        browser. This matters when your signature is attached to a government
        application: you should not send it to an unknown third-party server.
      </p>

      <p>
        For the complete pixel-and-KB specification for every major exam,
        including photo requirements alongside signature requirements, see the{" "}
        <Link href="/blog/exam-photo-signature-size-guide/">
          exam photo &amp; signature size guide
        </Link>
        . For individual portals, the{" "}
        <Link href="/exam-requirements/">exam requirements directory</Link>{" "}
        links each official notification so you can verify before you apply.
      </p>

      <div className="mt-12">
        <Faq
          items={[
            {
              q: "Can I sign on lined or ruled paper?",
              a: "No. The lines show up in the scan and create a cluttered background that portals reject. Use plain, unlined white paper. If you only have ruled paper, turn it over and sign on the blank reverse side.",
            },
            {
              q: "My signature is just initials or a short mark. Is that acceptable?",
              a: "Portals do not validate the style or complexity of a signature, only that the image field is non-blank and within the KB and dimension limits. However, the signature on your admit card must match the live signature you give in the exam hall. A very short mark is easy to reproduce consistently, but also easier for someone else to copy. Use your normal, habitual signature.",
            },
            {
              q: "Can I use the same signature image for SSC and UPSC?",
              a: "Not directly. SSC requires a rectangular crop (140×60 px) and UPSC requires a square crop (minimum 350×350 px). You need to re-crop or resize the image to the correct dimensions for each portal. The pixel shapes are incompatible: stretching a 140×60 px image to 350×350 px will distort the signature strokes.",
            },
            {
              q: "What if the portal keeps saying my signature file is too large?",
              a: "First confirm the exact KB limit in the current notification, as it sometimes differs from older advice online. Then check your file is actually JPG, not a PNG renamed to .jpg. A 140×60 px JPG saved at quality 80 is typically 4–8 KB, well within any 20 KB limit. If your file is still over the cap, open the image in any editor, re-export as JPG at quality 70–75, and check the file size again before uploading.",
            },
          ]}
        />
      </div>
    </BlogPostLayout>
  );
}
