import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { getPost } from "@/lib/blog";

const post = getPost("schengen-europe-visa-photo-size")!;

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
        If you&apos;re applying for a Schengen visa or a European student/work
        visa, the photo is one of the easiest things to get wrong — and one of the
        most common reasons applications get held up. The good news: the size is
        standardised across the Schengen area. The catch: the <strong>background
        colour rule differs by country</strong>, and that&apos;s where people slip.
      </p>

      <h2>The standard Schengen photo size</h2>
      <ul>
        <li><strong>Dimensions:</strong> 35 × 45 mm (the ICAO biometric standard).</li>
        <li><strong>Face:</strong> 70–80% of the frame, roughly 32–36 mm chin to crown.</li>
        <li><strong>Expression:</strong> neutral, mouth closed, both eyes open and visible.</li>
        <li><strong>Recency:</strong> taken within the last 6 months.</li>
        <li><strong>Glasses:</strong> best avoided; no glare, no tint, frames clear of the eyes.</li>
      </ul>

      <h2>The part that trips people up: background colour</h2>
      <p>
        All Schengen states follow ICAO, but they interpret the background
        differently. Using the wrong shade is a top rejection cause:
      </p>
      <ul>
        <li>
          <strong>Germany</strong> requires a <strong>neutral / light grey</strong>{" "}
          background and routinely rejects pure white.{" "}
          <Link href="/germany-visa-photo-maker/">Make a Germany visa photo</Link>.
        </li>
        <li>
          <strong>France</strong> wants a plain light-coloured background — light
          grey is the safe choice.{" "}
          <Link href="/france-visa-photo-maker/">Make a France visa photo</Link>.
        </li>
        <li>
          <strong>Italy</strong> specifies a <strong>white</strong> background.{" "}
          <Link href="/italy-visa-photo-maker/">Make an Italy visa photo</Link>.
        </li>
        <li>
          <strong>Netherlands</strong> accepts light grey, light blue or white.{" "}
          <Link href="/netherlands-visa-photo-maker/">Make a Netherlands visa photo</Link>.
        </li>
        <li>
          <strong>Ireland</strong> (not Schengen, but the same 35×45 mm) accepts
          light grey, cream or white.{" "}
          <Link href="/ireland-visa-photo-maker/">Make an Ireland visa photo</Link>.
        </li>
      </ul>
      <p>
        If you&apos;re unsure, <strong>light grey is the safest universal choice</strong> —
        it&apos;s accepted everywhere, including Switzerland (which rejects white).
      </p>

      <h2>How to make one free, without uploading your photo</h2>
      <p>
        Pick your country on the{" "}
        <Link href="/visa-photo/">visa photo maker</Link> (or use a country link
        above), drop in a clear front-facing photo, and it crops to 35×45 mm with
        the correct background applied automatically and a compliance check before
        you download. Everything runs in your browser — your photo is never
        uploaded.
      </p>
      <p>
        Need to hit a specific upload size too? Most consulate/VFS portals cap the
        file at a few hundred KB — use the{" "}
        <Link href="/tools/resize-kb/">compress-to-KB tool</Link> on the finished
        photo. Always confirm the exact requirement on your consulate or VFS portal
        before submitting.
      </p>
    </BlogPostLayout>
  );
}
