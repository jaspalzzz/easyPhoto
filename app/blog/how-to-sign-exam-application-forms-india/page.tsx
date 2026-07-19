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
const ibps = PORTAL_PRESETS.ibps;

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
        means an image of your handwritten signature rather than a typed name.
        The file rules are not universal: current SSC and RRB notices list one
        prepared signature, UPSC uses three signatures arranged vertically in
        one JPG, and the cited Army Agniveer notice does not publish numeric
        signature limits. Follow the current notice for the selected portal.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>
            Use the paper and ink stated by the selected portal. Do not infer an
            ink rule where the current source publishes none.
          </li>
          <li>
            Photograph or scan the signature, crop tightly around it, and save
            as a <strong>JPG (JPEG)</strong> file.
          </li>
          <li>
            Match both ends of the portal&apos;s KB band. SSC and IBPS list{" "}
            {kbBand(ssc.sigMinKb, ssc.sigLimitKb)} and{" "}
            {kbBand(ibps.sigMinKb, ibps.sigLimitKb)}, RRB lists{" "}
            {kbBand(rrb.sigMinKb, rrb.sigLimitKb)}, and UPSC lists{" "}
            {kbBand(upsc.sigMinKb, upsc.sigLimitKb)} for its three-signature image.
          </li>
          <li>
            Use a transparent PNG for placing a signature onto a document only.
            The cited NDA instructions list JPG, while the cited Army notice does
            not publish a signature format; confirm the active form.
          </li>
        </ul>
      </div>

      <h2>What does &#8220;sign the application form&#8221; actually mean?</h2>
      <p>
        The cited SSC, UPSC, IBPS, SBI and RRB workflows use an uploaded image of
        a handwritten signature rather than a typed name. Follow the active form
        if its capture method differs; the cited Army notice does not publish a
        signature-upload requirement.
      </p>
      <p>
        This matters for one practical reason: your uploaded signature must look
        like the signature you write in the exam hall. Candidates who upload a
        rushed or non-standard version, and then sign differently on exam day,
        risk getting flagged during verification.
      </p>

      <h2>Why do exam signature formats differ?</h2>
      <p>
        The sources recorded for SSC, UPSC, IBPS, SBI and RRB list a signature
        on plain or white paper in JPG/JPEG. They do not all share the same KB
        band or geometry: UPSC requires three signatures in one vertical image,
        while IBPS and SBI publish a wide rectangular preferred canvas. The
        current public Army Agniveer notice confirms an application workflow but
        does not publish a signature format or numeric target.
      </p>
      <p>
        A transparent PNG is useful when placing a signature over a document in
        an editor, but it is not a substitute for the JPG/JPEG file named by an
        exam notice. Prepare the reusable transparent asset separately, then
        flatten it onto white and export the portal-specific file when required.
      </p>

      <h2>Portal-by-portal signature specifications</h2>
      <p>
        The table below compares fields from the cited sources and says when a
        public value is not published. Always cross-check the current notification
        before you apply, as portals can revise limits between recruitment cycles.
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
        UPSC is different in kind: it wants a single image holding <em>three</em>{" "}
        signatures arranged vertically. SSC lists one JPEG/JPG signature but no
        fixed pixel canvas; IBPS lists a preferred 140&#215;60&nbsp;px canvas.
        Prepare each portal&apos;s file from its own recorded row rather than reusing
        one export automatically.
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
        Apply a pixel canvas only when the current source publishes one. IBPS
        lists a preferred 140&#215;60 px rectangle, and RRB lists at least
        140&#215;60 px. SSC publishes no fixed signature pixels. UPSC instead
        describes a vertical three-signature image in a 350–500 px range. The{" "}
        <Link href="/tools/signature-resize/">signature resize tool</Link> lets
        you enter the target dimensions and outputs the correctly sized image.
      </p>

      <h3>Step 5 - compress to the KB limit</h3>
      <p>
        Save in the format named by the notice and check both ends of its KB band.
        The recorded limits differ substantially: SSC and IBPS list{" "}
        {kbBand(ssc.sigMinKb, ssc.sigLimitKb)} and{" "}
        {kbBand(ibps.sigMinKb, ibps.sigLimitKb)}, RRB lists{" "}
        {kbBand(rrb.sigMinKb, rrb.sigLimitKb)}, and UPSC lists{" "}
        {kbBand(upsc.sigMinKb, upsc.sigLimitKb)}. Reduce JPG quality gradually
        when a file is over the ceiling, but do not compress it below a published minimum.
      </p>

      <h2>When is a transparent signature useful?</h2>
      <p>
        A transparent signature is useful for placing handwritten ink over a
        declaration, image or locally edited PDF without a white rectangle. That
        is a document-editing workflow, not evidence that an exam upload accepts
        PNG transparency.
      </p>
      <p>
        The{" "}
        <Link href="/tools/transparent-signature/">
          transparent signature tool
        </Link>{" "}
        removes the white background from your scanned signature in one step and
        exports a PNG for document placement. It runs
        entirely in your browser, so the signature image is never uploaded
        anywhere.
      </p>
      <p>
        The cited SSC, UPSC, IBPS, SBI and RRB sources list JPG/JPEG signature
        files. The cited Army Agniveer notice does not publish a signature format.
        For any exam upload, flatten the signature onto the listed paper colour
        and export only the format named by the current notice.
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
          <strong>Dimensions outside a published canvas.</strong> IBPS lists a
          preferred 140&#215;60 px signature and RRB lists at least 140&#215;60 px;
          SSC publishes no fixed signature pixels. Apply dimensions only where
          the selected source records them.
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
        Three tools cover the full workflow without requiring any account or
        upload.
      </p>

      <ul>
        <li>
          <Link href="/tools/signature-resize/">Signature resize tool</Link>:
          takes your cropped signature image, resizes it to the exact pixel
          dimensions you enter, and compresses the output to a target KB limit.
          Handles fixed rectangular canvases such as IBPS and RRB, plus custom
          dimensions for other document workflows. UPSC&apos;s current requirement
          is a vertical image containing three signatures, not a square preset.
        </li>
        <li>
          <Link href="/tools/transparent-signature/">
            Transparent signature tool
          </Link>: removes the white background from a scanned signature and
          exports a transparent PNG for placement on documents. For an exam
          upload, move to its portal-specific resizer and use the recorded format.
        </li>
        <li>
          <Link href="/tools/sign-image/">Sign image tool</Link>: for the
          different case where the signature goes <em>onto</em> an image — a
          declaration photo, a scanned form page, or any document image that
          must carry your signature. Draw it directly or place a transparent
          signature PNG, position it, and download the signed image.
        </li>
      </ul>

      <p>
        Both tools process your image on your device. No image data leaves your
        browser. This matters when your signature is attached to a government
        application: you should not send it to an unknown third-party server.
      </p>

      <p>
        For a registry-driven comparison of published and unpublished pixel and
        KB fields across these exams, including photo workflows, see the{" "}
        <Link href="/blog/exam-photo-signature-size-guide/">
          exam photo &amp; signature size guide
        </Link>
        . For individual portals, the{" "}
        <Link href="/exam-requirements/">exam requirements directory</Link>{" "}
        links each official notification so you can verify before you apply.
      </p>

      <div className="mt-12">
        <Faq items={SIGNATURE_GUIDE_FAQ_ITEMS} />
      </div>
    </BlogPostLayout>
  );
}
