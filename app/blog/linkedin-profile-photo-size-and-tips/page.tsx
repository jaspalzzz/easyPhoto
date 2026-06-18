import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("linkedin-profile-photo-size-and-tips")!;

export const metadata = pageMetadata({
  title: post.title,
  titleAbsolute: true,
  description: post.description,
  path: `/blog/${post.slug}/`,
  type: "article",
});

export default function Page() {
  return (
    <BlogPostLayout slug={post.slug}>
      <p>
        Your LinkedIn photo is the first thing recruiters and connections see, and
        the platform has specific size rules. Get the dimensions wrong and your
        face ends up cropped or blurry; get them right and you look sharp on every
        screen. Here&apos;s the exact size, why LinkedIn shows your photo in a
        circle, and how to make a clean one in a minute.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>LinkedIn requires a <strong>square</strong> image, minimum <strong>400×400&nbsp;px</strong>.</li>
          <li>Recommended: <strong>800×800&nbsp;px</strong> or larger for crisp display on high-DPI screens.</li>
          <li>JPG or PNG, under <strong>8&nbsp;MB</strong>. LinkedIn crops it into a circle — keep your face centred with headroom.</li>
        </ul>
      </div>

      <h2>LinkedIn profile photo specifications</h2>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Specification</th>
            <th className="py-2 pr-3 font-semibold text-ink">Value</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["Shape", "Square (1:1 ratio)"],
            ["Minimum size", "400×400 px"],
            ["Recommended size", "800×800 px or larger"],
            ["Maximum size", "7680×7680 px"],
            ["File format", "JPG or PNG"],
            ["File size limit", "Under 8 MB"],
            ["Display shape", "Circular (corners clipped)"],
          ].map(([spec, value]) => (
            <tr key={spec} className="border-b border-hairline/60">
              <td className="py-2 pr-3 font-medium text-ink">{spec}</td>
              <td className="py-2 pr-3">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Why is my LinkedIn photo shown in a circle?</h2>
      <p>
        LinkedIn stores a square image but displays it inside a circle. That means
        the corners of your square are cut off, so your face needs to be{" "}
        <strong>centred with a little headroom</strong>. If your head is too high
        or off to one side, the circle clips it. The safest framing is head and
        the top of your shoulders, face roughly in the middle.
      </p>

      <h2>What makes a LinkedIn photo look professional</h2>
      <ul>
        <li><strong>Fill the frame:</strong> your face should take up about 60% of the photo — not a distant full-body shot.</li>
        <li><strong>Clean background:</strong> a plain or softly blurred background keeps the focus on you. Busy rooms look unprofessional.</li>
        <li><strong>Good light:</strong> face a window or soft light; avoid harsh shadows and overhead glare.</li>
        <li><strong>Look at the camera:</strong> a friendly, confident expression — a genuine slight smile works best.</li>
        <li><strong>Dress for the role:</strong> wear what you&apos;d wear to work in your field.</li>
      </ul>

      <h2>How to make your LinkedIn photo (free, private)</h2>
      <p>
        You don&apos;t need a designer. Upload any clear, front-facing photo to the{" "}
        <Link href="/tools/linkedin-photo/">LinkedIn photo maker</Link> and it
        detects your face, crops a perfect square centred on you, and exports
        400×400, 800×800 or 1000×1000. Everything runs in your browser — your
        photo is never uploaded to a server.
      </p>
      <p>
        Want a distraction-free backdrop first? Run the photo through the{" "}
        <Link href="/tools/background-removal/">background remover</Link> or the{" "}
        <Link href="/tools/white-background/">white background maker</Link>, then
        crop it. And if you&apos;re job-hunting, make a matching passport-size{" "}
        <Link href="/tools/resume-photo/">resume photo</Link> from the same
        headshot.
      </p>

      <h2>Common mistakes to avoid</h2>
      <ul>
        <li>Uploading a rectangular photo and letting LinkedIn crop it badly.</li>
        <li>Standing too far away, so your face is tiny inside the circle.</li>
        <li>Using a group photo or a heavily filtered selfie.</li>
        <li>A dark or cluttered background that hides your face.</li>
      </ul>

      <div className="mt-12">
        <Faq items={[
          {
            q: "What is the best size for a LinkedIn profile photo?",
            a: "800×800 px is the practical sweet spot — it looks sharp on high-DPI laptop and phone screens and stays well under the 8 MB file limit. The minimum is 400×400 px, but this can appear slightly soft on modern retina displays.",
          },
          {
            q: "Why does LinkedIn crop my photo into a circle and cut off my head?",
            a: "LinkedIn stores your square image and displays it in a circular frame. If your head is near the top edge of the square, the circular crop clips it. To fix this, re-crop the photo with more space above your head — the LinkedIn photo maker centres your face automatically.",
          },
          {
            q: "Should I use a JPG or PNG for my LinkedIn photo?",
            a: "JPG is usually the better choice for portraits — it compresses well and produces a smaller file. PNG is lossless but creates a larger file for the same image. Either format is accepted by LinkedIn; for a typical headshot JPG under 1 MB will look identical to the PNG version.",
          },
          {
            q: "Can I use the same photo for LinkedIn and my resume?",
            a: "Yes, from the same original shot. Use the LinkedIn photo maker for the square 800×800 px crop (circular display) and the resume photo maker for the 35×45 mm passport-size crop. Both tools work from the same source image in your browser.",
          },
        ]} />
      </div>
    </BlogPostLayout>
  );
}
