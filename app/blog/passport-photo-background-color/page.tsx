import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { getPost } from "@/lib/blog";

const post = getPost("passport-photo-background-color")!;

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
        &quot;Just use a white wall&quot; is the most common piece of bad
        passport-photo advice. White is correct for some countries and
        explicitly wrong for others — and the wrong shade is one of the top
        reasons photos get rejected. Here&apos;s the right background color for
        each major country, and how to apply it.
      </p>

      <h2>Background color by country</h2>
      <ul>
        <li>
          <strong>United States</strong> — plain white or off-white.{" "}
          <Link href="/us/">US spec</Link>.
        </li>
        <li>
          <strong>India</strong> — plain white. <Link href="/india/">India spec</Link>.
        </li>
        <li>
          <strong>United Kingdom</strong> — light grey or cream.{" "}
          <em>Pure white is rejected.</em> <Link href="/uk/">UK spec</Link>.
        </li>
        <li>
          <strong>Canada</strong> — plain white. <Link href="/canada/">Canada spec</Link>.
        </li>
        <li>
          <strong>Australia</strong> — plain white or light grey.{" "}
          <Link href="/australia/">Australia spec</Link>.
        </li>
        <li>
          <strong>Schengen (EU)</strong> — light grey is safest; many consulates
          are wary of pure white. <Link href="/schengen/">Schengen spec</Link>.
        </li>
      </ul>

      <h2>Why the shade matters so much</h2>
      <p>
        Passport backgrounds must be a single, even tone with no shadows,
        gradients or texture so that facial-recognition systems can separate your
        head from the background. A &quot;white&quot; wall photographed in warm
        indoor light often comes out cream or grey anyway — and a real shadow
        behind your head reads as a non-uniform background. Both fail.
      </p>

      <h2>The shadow problem</h2>
      <p>
        Standing too close to the wall throws a shadow that ruins an otherwise
        good photo. Step half a metre forward and light yourself evenly from the
        front (a window works well). If a faint shadow remains, replacing the
        background entirely is the cleanest fix.
      </p>

      <h2>How to set the exact background</h2>
      <p>
        You don&apos;t need a perfect wall. Upload your photo to the{" "}
        <Link href="/passport-photo/">passport photo maker</Link> and pick your
        country — it applies that country&apos;s correct background color
        automatically, so you never have to remember whether it&apos;s white,
        grey or cream. To put any photo on a clean white background directly, use
        the <Link href="/tools/white-background/">white background tool</Link>;
        to drop the background out completely first, try the{" "}
        <Link href="/tools/background-removal/">background remover</Link>.
      </p>

      <h2>One more check before you submit</h2>
      <p>
        After setting the background, make sure the photo still meets the size
        and head-proportion rules — see{" "}
        <Link href="/blog/passport-photo-size-by-country/">
          passport photo size by country
        </Link>{" "}
        — and compress it to your portal&apos;s file limit with{" "}
        <Link href="/tools/resize-kb/">resize to an exact KB</Link>. Everything
        runs locally; your photo never leaves your device.
      </p>
    </BlogPostLayout>
  );
}
