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
    a: "Sarathi's scan guide specifies a JPG signature between 10 KB and 20 KB, with a preferred 256×64 px canvas. The applicant must sign on white paper with a black pen.",
  },
  {
    q: "Why is my photo being rejected on the Sarathi driving licence portal?",
    a: "The Sarathi guide says the upload shows an error when file size or format is not prescribed, and warns that an unclear photo or signature may be rejected. Prepare JPG files within 10–20 KB, use the published canvas, and check the preview before saving.",
  },
  {
    q: "Do I need separate photos for LL and DL applications?",
    a: "Sarathi publishes one photo-and-signature scan guide, but the service shown after you select a state can control the current workflow. Use the published guide as preparation and confirm the instructions displayed for the LL or DL service you choose.",
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
      ctaHref="/driving-licence-photo-resizer/"
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
        10–20&nbsp;KB JPG files for both photo and signature, along
        with preferred pixel canvases. Confirm the instructions displayed after you
        select your state and service.
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
            <strong>Scan resolution:</strong> minimum approximately 300&nbsp;DPI;
            confirm the current state/service screen
          </li>
        </ul>
      </div>

      <h2>What photo and signature size does the Sarathi guide publish?</h2>

      <p>
        The guide says the online application displays an error when the file size or
        format is not prescribed. It also says an unclear photo or signature may be
        rejected and can be re-uploaded before scrutiny is complete.
      </p>

      <img
        src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?fm=jpg&q=80&w=1200&h=630&fit=crop"
        alt="Car keys and driving licence on a table — driving licence application process India"
        className="my-6 w-full rounded-xl object-cover"
        loading="lazy"
        width={1200}
        height={630}
      />

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
            ["Published canvas", "420×525 px preferred", "256×64 px preferred"],
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
        <Link href="/driving-licence-photo-resizer/" className="text-brand underline">
          driving licence photo resizer
        </Link>{" "}
        prepares the photo and signature inside the 10–20&nbsp;KB band and applies
        their published preferred canvases — all in your browser with nothing sent to
        a server. Confirm the current state/service screen before submitting.
      </p>

      <h2>Which Sarathi service does this scan guide cover?</h2>

      <p>
        The source is a general Sarathi photo-and-signature upload guide; it does not
        enumerate every state/service combination on the document itself. Treat it as
        preparation guidance and follow the current upload fields shown after selecting
        your state and service.
      </p>

      <h2>Why do driving licence photos get rejected on Sarathi?</h2>

      <img
        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?fm=jpg&q=80&w=1200&h=630&fit=crop"
        alt="Person using a laptop to complete an online government application form"
        className="my-6 w-full rounded-xl object-cover"
        loading="lazy"
        width={1200}
        height={630}
      />

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
            ["Black-and-white photo", "Portal requires colour even though DL prints are monochrome"],
            ["Blurry or unclear image", "Use a clear source and check the upload preview"],
            ["Glasses with reflections", "Avoid reflections so the eyes remain clearly visible"],
            ["Signature on ruled / tinted paper", "White unlined paper only — ruled lines cause rejection"],
            ["Signature uses another ink colour", "Use the black pen specified by the guide"],
          ].map(([reason, fix]) => (
            <tr key={reason} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{reason}</td>
              <td className="py-2">{fix}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="my-8 rounded-xl border border-hairline bg-paper p-5 text-sm leading-relaxed text-ink-soft">
        Sarathi source note: the published scan guide specifies 10–20&nbsp;KB for
        both files, a preferred 420×525&nbsp;px photo and 256×64&nbsp;px signature.
        Other ID workflows are not used as substitutes for these values.
      </div>

      <h2>How to prepare your Sarathi photo and signature in three steps</h2>

      <ol className="my-4 space-y-3 text-[15px]">
        <li>
          <strong>Take the photo:</strong> Stand against a plain white or light wall
          in good natural light. Face the camera directly, neutral expression, no
          glasses if they reflect light. Use the published 420×525&nbsp;px portrait
          canvas and check that both eyes remain clearly visible.
        </li>
        <li>
          <strong>Take the signature:</strong> Sign your name on a blank white A4
          sheet with a black pen. Photograph it from directly
          above with even light — no shadows. Crop the signature tightly, leaving a
          small white margin on all sides.
        </li>
        <li>
          <strong>Resize and compress:</strong> Use the{" "}
          <Link href="/driving-licence-photo-resizer/" className="text-brand underline">
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
        tool is preset to the Sarathi limit.
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
