import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("voter-id-photo-requirements-2026")!;

const FAQ_ITEMS = [
  {
    q: "What is the photo size for a voter ID (EPIC) application?",
    a: "ECI's Form 6 guidance asks for a recent, good-quality, unsigned colour photograph measuring 4.5 cm high by 3.5 cm wide, on white. Online, the upload box takes JPG or JPEG files no bigger than 2 MB; no pixel size or DPI is set.",
  },
  {
    q: "Why is my voter ID photo getting rejected on the NVSP portal?",
    a: "If the upload itself fails, it is usually the file: a PNG or HEIC instead of a JPG, or a file over 2 MB. If the photo is refused later, check it against Form 6's wording: unsigned, colour, white background, eyes open and both edges of the face visible.",
  },
  {
    q: "Is the voter ID photo size the same across all states?",
    a: "Yes. Form 6 is an Election Commission of India form, filed on one national portal, so the 4.5 cm by 3.5 cm photo and the upload limit are the same in every state.",
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
      ctaHref="/exam-requirements/voter-id/"
      ctaLabel="Resize voter ID photo free"
    >
      <p>
        Two Election Commission sources decide whether your voter ID photo goes
        through: the Form 6 guidance says how the photo must look, and the upload
        box on voters.eci.gov.in sets the file rules. This guide puts both in one
        place.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li><strong>Size:</strong> 4.5&nbsp;cm high × 3.5&nbsp;cm wide</li>
          <li><strong>Photo:</strong> recent, good-quality, unsigned, in colour, on white</li>
          <li><strong>Face:</strong> eyes open, both edges of the face visible</li>
          <li><strong>Upload file:</strong> JPG or JPEG, up to 2&nbsp;MB; no pixel size or DPI is set</li>
        </ul>
      </div>

      <h2>What Form 6 asks for</h2>

      <p>
        The{" "}
        <a
          href="https://voters.eci.gov.in/guidelines/Form-6_en.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          ECI Form 6 guidance
        </a>{" "}
        asks for a recent, good-quality, unsigned colour passport photo measuring{" "}
        <strong>4.5&nbsp;cm high by 3.5&nbsp;cm wide</strong>, with a white
        background, open eyes and both edges of the face visible. The file rules
        come from the photo upload box itself, which reads &ldquo;Document size
        maximum 2MB, .jpg, .jpeg&rdquo; (checked 13 Oct 2026). Neither source gives
        a pixel size, a DPI or a minimum file size.
      </p>

      <p>
        Form 6 is the form for new voters. Other voter forms can have their own
        photo boxes, so open the form that matches your case rather than carrying
        these dimensions across.
      </p>

      <h2>Why voter ID photos get refused</h2>

      <p>
        An error at the moment of upload is nearly always the file: a PNG or HEIC
        instead of a JPG, or a file over 2&nbsp;MB. A refusal later comes from the
        photo itself, measured against Form 6&apos;s wording:
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
            ["Background is not white", "Retake against a white wall, or replace the background"],
            ["Eyes closed or half-closed", "Retake with both eyes open"],
            ["Hair, a turned head or a tight crop hides the side of the face", "Face the camera straight on and leave room on both sides"],
            ["Name or signature written on the photo", "Use an unsigned photograph"],
            ["Wrong shape", "Crop to 4.5 cm high × 3.5 cm wide"],
          ].map(([reason, fix]) => (
            <tr key={reason} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{reason}</td>
              <td className="py-2">{fix}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        You may see pixel sizes and small KB limits quoted for voter ID photos
        elsewhere. Neither Form 6 nor the upload box sets one, so a clear JPG
        under 2&nbsp;MB is all the upload needs; a smaller file is fine as long as
        the face stays sharp.
      </p>

      <h2>How to make the photo</h2>

      <p>
        Take a recent colour photo against a white wall in soft light, facing the
        camera. If the wall isn&apos;t plain, the{" "}
        <Link href="/tools/background-removal/" className="text-brand underline">
          background removal tool
        </Link>{" "}
        replaces it with white in your browser. Then the{" "}
        <Link href="/exam-requirements/voter-id/" className="text-brand underline">
          voter ID photo resizer
        </Link>{" "}
        crops it to the 3.5&nbsp;:&nbsp;4.5 portrait shape and saves a JPG at or
        under 2,000,000 bytes, so it fits the 2&nbsp;MB limit however the portal
        counts a megabyte. Nothing is uploaded.
      </p>

      <p>
        PAN, driving-licence and Aadhaar photos follow different rules; the{" "}
        <Link href="/blog/indian-government-id-photo-requirements/" className="text-brand underline">
          government ID photo guide
        </Link>{" "}
        sets all four side by side.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
