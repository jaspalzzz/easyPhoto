import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { getPost } from "@/lib/blog";

const post = getPost("baby-and-infant-passport-photo-guide")!;

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
        A baby can&apos;t sit up on command, hold a neutral expression or look at
        a lens — yet the photo still has to meet the same compliance rules as an
        adult&apos;s. The good news: countries relax a few rules for infants, and
        a plain white sheet plus a phone is all you need. Here&apos;s how to do it
        without a studio.
      </p>

      <h2>What&apos;s relaxed for babies — and what isn&apos;t</h2>
      <ul>
        <li>
          <strong>Expression:</strong> a neutral face is ideal, but a closed-mouth
          baby who isn&apos;t crying is usually fine. Eyes should be open where
          possible (very young newborns are often excused).
        </li>
        <li>
          <strong>Still required:</strong> plain, uniform background; no other
          people, hands, toys, pacifiers or straps visible; even lighting and no
          shadows; the face fully visible and roughly centred.
        </li>
      </ul>

      <h2>The lay-down method</h2>
      <p>
        The easiest setup: lay the baby on their back on a plain white sheet or
        blanket, with no patterns. Photograph straight down from above, keeping
        the phone parallel to the baby so the face isn&apos;t distorted. A white
        sheet doubles as the background, which removes the hardest part.
      </p>
      <ul>
        <li>Smooth out wrinkles and crumbs in the sheet — they count as a busy background.</li>
        <li>Use soft daylight; turn off flash to avoid shadows and red-eye.</li>
        <li>Support the head if needed, but keep hands out of frame.</li>
        <li>Take many shots and pick the one with open eyes and a calm face.</li>
      </ul>

      <h2>For an older infant who can sit</h2>
      <p>
        Sit the baby against a plain wall in a car seat or on a parent&apos;s lap
        draped with a plain white cloth (the parent must not be visible). Get down
        to their eye level and snap when they look toward the lens.
      </p>

      <h2>Crop and clean it up</h2>
      <p>
        Babies move, so you&apos;ll rarely frame it perfectly in-camera. Upload
        your best shot to the{" "}
        <Link href="/passport-photo/">passport photo maker</Link>, choose your
        country, and it crops to the correct head size and sets the right
        background — see the exact rules on your country page, such as{" "}
        <Link href="/us/">US</Link>, <Link href="/india/">India</Link> or{" "}
        <Link href="/uk/">UK</Link>. If a stray shadow or off-white sheet shows,
        the <Link href="/tools/white-background/">white background tool</Link>{" "}
        cleans it up.
      </p>

      <h2>Then size it for the portal</h2>
      <p>
        For online applications, compress the final image to the upload limit
        with <Link href="/tools/resize-image-to-50kb/">resize to 50 KB</Link> or
        a <Link href="/tools/resize-kb/">custom target</Link>. As always, the
        photo stays on your device.
      </p>
    </BlogPostLayout>
  );
}
