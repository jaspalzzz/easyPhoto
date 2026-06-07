import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { getPost } from "@/lib/blog";

const post = getPost("how-to-take-a-passport-photo-at-home")!;

export const metadata = pageMetadata({
  title: `${post.title}`,
  titleAbsolute: true,
  description: post.description,
  path: `/blog/${post.slug}/`,
  type: "article",
});

export default function Page() {
  return (
    <BlogPostLayout slug={post.slug}>
      <p>
        A passport photo from a shop isn&apos;t magic. It&apos;s really just
        three things: a plain background, even light, and a precise crop. You can
        do all three at home with a phone and skip the queue (and the fee). Here&apos;s
        the approach that actually gets accepted.
      </p>

      <h2>1. Find a plain wall and good light</h2>
      <p>
        Stand about half a metre in front of a smooth, plain wall. White works
        for most countries, but the UK wants light grey or cream, so don&apos;t
        just assume (you can fix the colour later anyway). Face a window during
        the day for soft, even light. Steer clear of overhead lights that cast
        shadows under your eyes. And skip the flash. It flattens your skin and
        bounces off the wall.
      </p>

      <h2>2. Frame it head-on</h2>
      <p>
        Have someone take the photo from a metre or so away at eye level (a
        propped-up phone and the timer works too). Look straight at the lens with
        a neutral expression and your mouth closed. Keep your head straight, hair
        clear of your eyes, and both ears roughly visible. Leave some space above
        your head, because you&apos;ll need room to crop.
      </p>

      <h2>3. Skip the things that get photos rejected</h2>
      <ul>
        <li>No glasses. Most countries no longer allow them.</li>
        <li>No smiling, no raised eyebrows; neutral only.</li>
        <li>No hats or head coverings except for religious or medical reasons.</li>
        <li>No shadows on your face or behind your head.</li>
      </ul>

      <h2>4. Crop and set the background automatically</h2>
      <p>
        This is where the millimetres matter, and it&apos;s where home attempts
        usually slip. Instead of guessing, upload your photo to the{" "}
        <Link href="/passport-photo/">passport photo maker</Link>, choose your
        country, and it crops your head to the exact required size and applies the
        correct background colour. Then it checks the result for you. If your
        country&apos;s portal caps the file size, run the result through{" "}
        <Link href="/photo-resize-to-50kb/">resize to 50 KB</Link>.
      </p>

      <h2>5. Print or upload</h2>
      <p>
        For a printed application, download the 4×6&quot; sheet and print it at a
        photo kiosk on photo paper. For online applications, use the upload-ready
        file. That&apos;s it. A compliant photo, and you never left home.
      </p>
    </BlogPostLayout>
  );
}
