import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("driving-licence-photo-size-sarathi")!;

const FAQ_ITEMS = [
  {
    q: "What is the photo size for a driving licence on the Sarathi portal?",
    a: "Sarathi's published scan guide specifies a JPG colour photo between 10 KB and 20 KB, with a minimum 420 px width and 525 px height; 420×525 px is preferred. The physical dimensions are 35 mm wide by 45 mm high, against a light-coloured, preferably white background.",
  },
  {
    q: "What is the signature size for a driving licence on Sarathi?",
    a: "Sarathi's scan guide specifies a JPG signature between 10 KB and 20 KB, at a preferred 256×64 px. Sign on white paper with a black pen. If you can't sign, Sarathi takes a thumb impression instead: the right thumb for women and the left for men.",
  },
  {
    q: "Why is my photo being rejected on the Sarathi driving licence portal?",
    a: "The Sarathi guide says the upload shows an error when file size or format is not prescribed, and warns that an unclear photo or signature may be rejected. Prepare JPG files within 10–20 KB at the preferred pixel sizes, and check the preview before saving.",
  },
  {
    q: "Do I need separate photos for LL and DL applications?",
    a: "Sarathi publishes one photo-and-signature scan guide, and the same sizes apply to learner's and driving licence applications. The screen shown after you pick your state and service has the final word, so check it before uploading.",
  },
  {
    q: "Can I use an Aadhaar or PAN card photo for my driving licence?",
    a: "Do not assume an image prepared for another document matches Sarathi. The cited Sarathi guide asks for a recent colour JPG at 420×525 px preferred, 10–20 KB, with a light-coloured, preferably white background.",
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
      ctaHref="/exam-requirements/driving-licence/"
      ctaLabel="Resize driving licence photo free"
    >
      <p>
        The Ministry of Road Transport and Highways publishes a{" "}
        <a
          href="https://sarathi.parivahan.gov.in/sarathiservice/pdf/PhotoSign.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          Sarathi photo and signature scan guide
        </a>{" "}
        for preparing both files before the relevant online application. It specifies
        10–20&nbsp;KB JPG files for both photo and signature, each at a preferred
        pixel size. The screen shown after you pick your state and service has the
        final word.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>
            <strong>Photo:</strong> JPG, 10–20&nbsp;KB, 420×525&nbsp;px preferred,
            light-coloured / preferably white background
          </li>
          <li>
            <strong>Signature:</strong> JPG, 10–20&nbsp;KB, 256×64&nbsp;px preferred,
            black ink on white paper
          </li>
          <li>
            <strong>Scan resolution:</strong> about 300&nbsp;DPI or more
          </li>
        </ul>
      </div>

      <h2>What photo and signature size does the Sarathi guide publish?</h2>

      <p>
        The guide says the online application displays an error when the file size or
        format is not prescribed. It also says an unclear photo or signature may be
        rejected and can be re-uploaded before scrutiny is complete.
      </p>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Requirement</th>
            <th className="py-2 pr-4 font-semibold text-ink">Photo</th>
            <th className="py-2 font-semibold text-ink">Signature</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["File format", "JPEG / JPG", "JPEG / JPG"],
            ["File-size band", "10–20 KB", "10–20 KB"],
            ["Pixel size", "420×525 px preferred", "256×64 px preferred"],
            ["Scan resolution", "Minimum approximately 300 DPI", "Minimum approximately 300 DPI"],
            ["Background", "White or light-coloured, plain", "White paper"],
            ["Orientation", "Portrait", "Landscape"],
            ["Colour / ink", "Colour photograph", "Black pen"],
            ["Glasses", "No reflections; eyes clearly visible", "—"],
          ].map(([req, photo, sig]) => (
            <tr key={req} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{req}</td>
              <td className="py-2 pr-4">{photo}</td>
              <td className="py-2">{sig}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        The{" "}
        <Link href="/exam-requirements/driving-licence/" className="text-brand underline">
          driving licence photo resizer
        </Link>{" "}
        makes both files inside the 10–20&nbsp;KB band at the preferred pixel sizes,
        in your browser with nothing sent to a server.
      </p>

      <h2>Which Sarathi service does this scan guide cover?</h2>

      <p>
        The source is a general Sarathi photo-and-signature upload guide; it does not
        enumerate every state/service combination on the document itself. Treat it as
        preparation guidance and follow the current upload fields shown after selecting
        your state and service.
      </p>

      <h2>Why do driving licence photos get rejected on Sarathi?</h2>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Rejection reason</th>
            <th className="py-2 font-semibold text-ink">Fix</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["File outside 10–20 KB", "Prepare each JPG inside the published band"],
            ["PNG, PDF, or HEIC format", "Convert to JPEG before uploading"],
            ["Coloured or patterned background", "Shoot against white; or use background removal tool"],
            ["Black-and-white photo", "The guide asks for a colour photo; rescan or retake it in colour"],
            ["Blurry or unclear image", "Use a clear source and check the upload preview"],
            ["Glasses with reflections", "Avoid reflections so the eyes remain clearly visible"],
            ["Signature on ruled or tinted paper", "Sign on plain white paper, as the guide asks"],
            ["Signature uses another ink colour", "Use the black pen specified by the guide"],
          ].map(([reason, fix]) => (
            <tr key={reason} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{reason}</td>
              <td className="py-2">{fix}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        If a file is over 20&nbsp;KB, Sarathi&apos;s own advice is to lower the scan
        resolution or crop closer, rather than squeezing the quality until the face
        blurs.
      </p>

      <h2>How to prepare your Sarathi photo and signature in three steps</h2>

      <ol className="my-4 space-y-3 text-[15px]">
        <li>
          <strong>Take the photo:</strong> Stand against a plain white or light wall
          in good natural light. Face the camera directly, neutral expression, no
          glasses if they reflect light. Leave room around your head and shoulders
          for the 420×525&nbsp;px portrait crop, and check that both eyes are
          clearly visible.
        </li>
        <li>
          <strong>Take the signature:</strong> Sign your name on a blank white A4
          sheet with a black pen. Photograph it from directly
          above with even light — no shadows. Crop the signature tightly, leaving a
          small white margin on all sides.
        </li>
        <li>
          <strong>Resize and compress:</strong> Use the{" "}
          <Link href="/exam-requirements/driving-licence/" className="text-brand underline">
            driving licence photo resizer
          </Link>{" "}
          to output the photo and signature inside the 10–20&nbsp;KB band, both as
          JPG. The tool runs entirely in your browser —
          no upload, no account.
        </li>
      </ol>

      <p>
        If your background isn&apos;t clean enough, use the{" "}
        <Link href="/tools/background-removal/" className="text-brand underline">
          background removal tool
        </Link>{" "}
        to replace it with solid white before resizing. For the signature, the{" "}
        <Link href="/tools/signature-resize/?target=20" className="text-brand underline">
          signature resize to 20&nbsp;KB
        </Link>{" "}
        tool is already set to the Sarathi limit.
      </p>

      <p>
        Also applying for a voter ID or PAN card? See the{" "}
        <Link href="/blog/voter-id-photo-requirements-2026/" className="text-brand underline">
          voter ID photo requirements guide
        </Link>{" "}
        and the{" "}
        <Link href="/blog/pan-card-photo-size/" className="text-brand underline">
          PAN card photo size guide
        </Link>{" "}
        — the KB limits and pixel specs differ significantly across these portals. The{" "}
        <Link href="/blog/indian-government-id-photo-requirements/" className="text-brand underline">
          Indian government ID photo requirements guide
        </Link>{" "}
        compares all four documents side by side.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
