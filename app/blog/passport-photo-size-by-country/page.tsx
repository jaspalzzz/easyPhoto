import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { getPost } from "@/lib/blog";

const post = getPost("passport-photo-size-by-country")!;

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
        There is no single &quot;passport photo size.&quot; Each country sets its
        own dimensions <em>and</em> its own rule for how much of the frame your
        head must fill. Get either wrong and the photo gets rejected — even if it
        looks fine to you. Here&apos;s what the major countries actually require.
      </p>

      <h2>The sizes, country by country</h2>
      <ul>
        <li>
          <strong>United States</strong> — 2×2 inches (51×51mm), square. Head
          (chin to crown) 1 to 1⅜ inches (25–35mm). Plain white or off-white
          background.{" "}
          <Link href="/us-passport-photo-maker/">US passport photo maker</Link>.
        </li>
        <li>
          <strong>India</strong> — 35×45mm, with a notably large face filling
          roughly 80–85% of the frame. Plain white background; online portals
          often cap the file at 10–100&nbsp;KB.{" "}
          <Link href="/india-passport-photo-maker/">India passport photo maker</Link>.
        </li>
        <li>
          <strong>United Kingdom</strong> — 35×45mm. Head 29–34mm. Crucially, the
          background must be light grey or cream — <em>not</em> white.{" "}
          <Link href="/uk-passport-photo-maker/">UK passport photo maker</Link>.
        </li>
        <li>
          <strong>Canada</strong> — 50×70mm, larger than most. Head 31–36mm.
          White background.{" "}
          <Link href="/canada-passport-photo-maker/">Canada passport photo maker</Link>.
        </li>
        <li>
          <strong>Australia</strong> — 35×45mm. Head 32–36mm. Plain white or
          light grey.{" "}
          <Link href="/australia-passport-photo-maker/">Australia passport photo maker</Link>.
        </li>
        <li>
          <strong>Schengen (EU visa)</strong> — 35×45mm. Head 32–36mm. Light grey
          is safest; several consulates dislike pure white.{" "}
          <Link href="/schengen-visa-photo-maker/">Schengen visa photo maker</Link>.
        </li>
      </ul>

      <h2>Why head size matters as much as photo size</h2>
      <p>
        Two photos can be the same 35×45mm and still differ wildly: India wants
        your face to dominate the frame, while the UK leaves more headroom. A
        generic square crop almost never matches the required chin-to-crown band,
        which is why &quot;I cropped it myself&quot; photos fail so often. The
        head ratio is a biometric requirement, not a suggestion.
      </p>

      <h2>Print size vs. digital size</h2>
      <p>
        Many countries also specify a minimum pixel size and DPI for online
        uploads — separate from the print dimensions. A photo can be the right
        physical size but too low-resolution, or the right resolution but the
        wrong file size for the portal. Each country page above lists the exact
        print size, pixel size, DPI and file-size range together.
      </p>

      <h2>How to get the exact size without measuring</h2>
      <p>
        Rather than measuring millimetres by hand, upload your photo to the{" "}
        <Link href="/passport-photo/">passport photo maker</Link>, pick your
        country, and it crops your head to the precise required band and applies
        the correct background automatically. Applying for a visa instead? Use
        the <Link href="/visa-photo/">visa photo maker</Link>, which can differ
        from the passport spec for the same country.
      </p>

      <h2>Don&apos;t forget the upload file size</h2>
      <p>
        Once the dimensions are right, the last hurdle is the portal&apos;s file
        cap. Compress the finished image to the limit with{" "}
        <Link href="/photo-resize-to-20kb/">resize to 20 KB</Link>,{" "}
        <Link href="/photo-resize-to-50kb/">50 KB</Link> or a{" "}
        <Link href="/tools/resize-kb/">custom KB target</Link> — all in your
        browser, with nothing uploaded.
      </p>
    </BlogPostLayout>
  );
}
