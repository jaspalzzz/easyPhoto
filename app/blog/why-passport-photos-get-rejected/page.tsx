import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { getPost } from "@/lib/blog";

const post = getPost("why-passport-photos-get-rejected")!;

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
        Passport photos rarely get rejected for dramatic reasons. It&apos;s almost
        always one of a handful of small, fixable things. Here&apos;s the full
        list, worst offenders first, with how to avoid each.
      </p>

      <h2>Wrong size or head proportion</h2>
      <p>
        The single most common cause. Each country specifies both the photo size
        and how big your head must be within it. The US wants 25–35mm chin to
        crown on a 2×2 inch photo, while India wants a notably larger face. A
        generic square crop won&apos;t match either. The{" "}
        <Link href="/passport-photo/">passport photo maker</Link> sizes the head
        to the exact band per country, which removes this problem entirely.
      </p>

      <h2>Wrong background colour</h2>
      <p>
        White is <em>not</em> universal. The UK rejects plain white and wants
        light grey or cream. For Schengen visas, Switzerland requires a grey
        background and rejects white, so light grey is the safe choice everywhere.
        The wrong shade is a frequent bounce, which is why the background should
        be set per country rather than assumed.
      </p>

      <h2>Glasses, smiling and expression</h2>
      <p>
        Most countries no longer allow glasses at all. A smile, an open mouth or
        raised eyebrows will also fail a biometric check, so keep a relaxed,
        neutral expression with your mouth closed.
      </p>

      <h2>Shadows and uneven lighting</h2>
      <p>
        Shadows on your face or on the wall behind you break the &quot;plain,
        uniform background&quot; rule. Soft, even light from a window and a small
        gap between you and the wall fixes most of it.
      </p>

      <h2>File too large (or too small) for upload</h2>
      <p>
        Online portals cap the file size. Indian exam and government forms often
        want 20–50 KB, and other portals have their own limits. A phone photo is
        far too big for any of them. Compress the finished photo with{" "}
        <Link href="/photo-resize-to-20kb/">resize to 20 KB</Link> or{" "}
        <Link href="/photo-resize-to-50kb/">50 KB</Link> to fit.
      </p>

      <h2>Old photo or wrong document type</h2>
      <p>
        Most countries want a photo taken within the last six months. And a visa
        photo isn&apos;t always the same as a passport photo, so check the right
        spec with the <Link href="/visa-photo/">visa photo maker</Link> if
        you&apos;re applying for a visa.
      </p>

      <p>
        Get these six right and rejection becomes very unlikely. The fastest way
        is to let the tool handle size, background and the compliance check, then
        compress to your portal&apos;s limit.
      </p>
    </BlogPostLayout>
  );
}
