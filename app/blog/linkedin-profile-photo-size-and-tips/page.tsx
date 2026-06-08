import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
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

      <h2>What size should a LinkedIn profile photo be?</h2>
      <p>
        LinkedIn profile photos are <strong>square</strong>. The minimum is{" "}
        <strong>400×400 pixels</strong>, and you can go up to 7680×7680. The file
        must be under 8&nbsp;MB in JPG or PNG. A larger square (800×800 or
        1000×1000) looks crisper on high-resolution laptops and phones, so aim
        above the minimum when you can.
      </p>
      <ul>
        <li><strong>Shape:</strong> square (1:1).</li>
        <li><strong>Minimum:</strong> 400×400 px.</li>
        <li><strong>Recommended:</strong> 800×800 px or larger.</li>
        <li><strong>Format / size:</strong> JPG or PNG, under 8&nbsp;MB.</li>
      </ul>

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
    </BlogPostLayout>
  );
}
