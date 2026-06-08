import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { getPost } from "@/lib/blog";

const post = getPost("resume-photo-size-and-rules")!;

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
        Should you put a photo on your resume? It depends entirely on where you&apos;re
        applying. In India and much of Asia, Europe and the Middle East, a photo
        on a CV or bio-data is common and often expected. In the US, UK, Canada
        and Australia, it&apos;s usually left off. Here are the rules, the standard
        size, and how to make a clean resume photo for free.
      </p>

      <h2>Should a resume have a photo?</h2>
      <ul>
        <li><strong>Include a photo:</strong> India, most of Europe, the Middle East and large parts of Asia, where bio-data and CVs typically carry one.</li>
        <li><strong>Leave it off:</strong> the US, UK, Canada and Australia, where employers often discard photos to avoid bias — and some applicant systems reject them.</li>
      </ul>
      <p>
        When in doubt, follow the norm of the country and company you&apos;re
        applying to. If a form or job portal asks for a photo, it will usually
        specify the size and file limit.
      </p>

      <h2>What size is a resume photo?</h2>
      <p>
        In India, a resume or bio-data photo is almost always a standard{" "}
        <strong>passport-size photo — 35×45&nbsp;mm (3.5×4.5&nbsp;cm)</strong> — the
        same size used for most application forms. There is no separate &quot;resume
        size&quot;. For digital uploads, portals commonly want a JPG within a set KB
        range, so check the form&apos;s limit.
      </p>

      <h2>Background, attire and expression</h2>
      <ul>
        <li><strong>Background:</strong> plain and light — white or light grey reads as professional. Avoid busy rooms and patterns.</li>
        <li><strong>Attire:</strong> formal or smart-casual in a solid colour, as you&apos;d dress for the role.</li>
        <li><strong>Framing:</strong> head and shoulders, facing the camera straight on.</li>
        <li><strong>Expression:</strong> calm and confident, with a gentle, closed-mouth smile.</li>
        <li><strong>Lighting:</strong> soft and even, with no harsh shadows on the face.</li>
      </ul>

      <h2>How to make a resume photo (free, private)</h2>
      <p>
        Upload any clear, front-facing photo to the{" "}
        <Link href="/tools/resume-photo/">resume / CV photo maker</Link>. It crops
        to the standard passport size with a clean white background, ready to print
        or paste — and nothing is uploaded to a server. Building an online profile
        too? Make a square{" "}
        <Link href="/tools/linkedin-photo/">LinkedIn photo</Link> from the same
        headshot.
      </p>

      <h2>Uploading to a job portal</h2>
      <p>
        If the portal caps the file size, compress the finished photo to an exact
        target — for example{" "}
        <Link href="/photo-resize-to-50kb/">resize to 50&nbsp;KB</Link> — or pick a{" "}
        <Link href="/tools/resize-kb/">custom KB size</Link>. As always, your image
        stays on your device.
      </p>
    </BlogPostLayout>
  );
}
