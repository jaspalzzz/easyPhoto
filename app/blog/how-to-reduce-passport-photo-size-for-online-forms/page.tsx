import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("how-to-reduce-passport-photo-size-for-online-forms")!;

const FAQ_ITEMS = [
  {
    q: "Why is my photo rejected even though it's under the file-size cap?",
    a: "Most portals set a band, not just a ceiling. SSC, IBPS and UPSC portals require photos between 20 and 50 KB — a 12 KB file is rejected for being too small just as a 2 MB file is rejected for being too large. Use a resizer that targets the exact band.",
  },
  {
    q: "Can I compress a photo without losing face clarity?",
    a: "Yes, to a point. A well-compressed 20 KB passport photo looks sharp at the thumbnail size portals display. Clarity suffers below roughly 10 KB — so use the portal's minimum as your floor, not the lowest possible.",
  },
  {
    q: "Should I compress first or crop to the right dimensions first?",
    a: "Crop first. Start with the passport photo maker to get the correct head ratio and background, then run the result through a KB-target tool. Compressing before cropping wastes file budget on areas that will be cut away.",
  },
  {
    q: "My signature also needs to be under 20 KB — how do I handle that?",
    a: "The signature resizer handles this in one step — it removes the paper background, trims empty edges, and compresses to the target. A clean white-background signature compresses much smaller than one with a grey paper scan behind it.",
  },
];

export const metadata = pageMetadata({
  title: `${post.title}`,
  titleAbsolute: true,
  description: post.description,
  path: `/blog/${post.slug}/`,
  type: "article",
});

export default function Page() {
  return (
    <BlogPostLayout slug={post.slug} faqItems={FAQ_ITEMS}>
      <p>
        A phone photo is several megabytes. Most government, visa and exam
        portals accept only a tiny fraction of that, often 10 to 100&nbsp;KB.
        When your upload fails with &quot;file too large,&quot; the fix is
        compression. You don&apos;t need to retake the photo. Here&apos;s how to
        hit an exact KB target without turning your face into mush.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>Indian exam portals (SSC, IBPS, UPSC) want photos in a <strong>20–50&nbsp;KB band</strong> — too small is also rejected.</li>
          <li>Visa portals (Schengen, MRV, VFS) typically accept <strong>50–300&nbsp;KB</strong> with added pixel-dimension rules.</li>
          <li>Use a target-KB tool that finds the right compression automatically — never guess a manual quality slider.</li>
        </ul>
      </div>

      <h2>Common file-size limits by portal type</h2>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Portal type</th>
            <th className="py-2 pr-3 font-semibold text-ink">Typical photo limit</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["Indian exam portals (SSC, IBPS, RRB)", "20–50 KB"],
            ["Indian e-services (Passport Seva, Aadhaar)", "20–100 KB"],
            ["Schengen / MRV / VFS visa portals", "50–300 KB"],
            ["Job and university applications", "100–200 KB"],
          ].map(([type, limit]) => (
            <tr key={type} className="border-b border-hairline/60">
              <td className="py-2 pr-3 font-medium text-ink">{type}</td>
              <td className="py-2 pr-3">{limit}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Always read the form&apos;s instructions. Limits vary, and some portals
        set a minimum as well as a maximum. Official sources:{" "}
        <a href="https://ssc.nic.in" className="text-brand underline" target="_blank" rel="noopener noreferrer">SSC</a>,{" "}
        <a href="https://ibps.in" className="text-brand underline" target="_blank" rel="noopener noreferrer">IBPS</a>.
      </p>

      <h2>How to compress without losing sharpness</h2>
      <p>
        Two things control a JPEG&apos;s file size: its pixel dimensions and its
        quality setting. The trick is to reduce both just enough to slip under
        the cap while keeping the face crisp. Done well, a 20&nbsp;KB passport
        photo still looks clean at the size a portal displays it at.
      </p>
      <ul>
        <li>Start from the properly cropped passport photo, not the raw selfie.</li>
        <li>Lower quality first; only shrink dimensions if you must.</li>
        <li>Keep it a JPEG. PNGs are far larger for photos.</li>
        <li>Don&apos;t over-compress below the portal&apos;s minimum, if it has one.</li>
      </ul>

      <h2>The fast way: target an exact KB</h2>
      <p>
        Instead of guessing quality sliders, use a tool that searches for the
        exact target automatically:
      </p>
      <ul>
        <li>
          <Link href="/photo-resize-to-10kb/">Resize to 10&nbsp;KB</Link> for the
          tightest exam-form limit.
        </li>
        <li>
          <Link href="/photo-resize-to-20kb/">Resize to 20&nbsp;KB</Link> and{" "}
          <Link href="/photo-resize-to-50kb/">50&nbsp;KB</Link>, the most
          common photo caps.
        </li>
        <li>
          <Link href="/photo-resize-to-100kb/">100&nbsp;KB</Link> /{" "}
          <Link href="/photo-resize-to-200kb/">200&nbsp;KB</Link>, or a{" "}
          <Link href="/tools/resize-kb/">custom KB value</Link> for anything
          else.
        </li>
      </ul>
      <p>
        Need to fit an exact width and height too? Use{" "}
        <Link href="/tools/resize-dimensions/">resize dimensions</Link> first,
        then compress. For a signature upload, the{" "}
        <Link href="/signature-resize-to-20kb/">signature resizer</Link> handles
        the same job for transparent PNGs.
      </p>

      <h2>Get the photo right first</h2>
      <p>
        Compression can&apos;t fix a non-compliant photo. Crop and set the
        correct background with the{" "}
        <Link href="/passport-photo/">passport photo maker</Link> first, then
        compress the result. For exact KB and pixel specs by exam, see the{" "}
        <Link href="/blog/exam-photo-signature-size-guide/">
          photo and signature size guide for government exams
        </Link>. Everything runs in your browser, so your photo is
        never uploaded to a server.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
