import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";
import { PORTAL_PRESETS } from "@/lib/portalPresets";

const post = getPost("why-exam-photo-signature-rejected")!;
const ssc = PORTAL_PRESETS.ssc;
const ibps = PORTAL_PRESETS.ibps;

const FAQ_ITEMS = [
  {
    q: "Why does an exam portal show a generic photo or signature error?",
    a: "Most portals use one message for several faults: the file size, the format, the pixel size, or a photo the camera step could not use. Work through the six causes on this page in order; the first three can be checked from the file's details before you upload again.",
  },
  {
    q: "Does every exam photo need to be 20–50 KB?",
    a: "No. 20–50 KB is the IBPS and SBI photo band. UPSC accepts 20–200 KB, and SSC takes no photo file at all because the form photographs you live.",
  },
  {
    q: "Should I add my name and date to an exam photo?",
    a: "Only when your notice asks for it. TNPSC, APPSC and Kerala PSC ask for the name and photo date printed on the photo; UPSC, SSC and IBPS do not. The Air Force Agniveervayu notice wants a chalk slate held in the photo, which a printed strip cannot replace.",
  },
  {
    q: "Can a photo checker guarantee that my application will accept the file?",
    a: "No. A checker can measure the file: its pixel size, file size and format. It cannot see every check a portal runs, judge whether the photo looks like you, or decide for the authority.",
  },
];

export const metadata = pageMetadata({
  title: post.title,
  titleAbsolute: true,
  description: post.description,
  path: `/blog/${post.slug}/`,
  type: "article",
});

export default function Page() {
  return (
    <BlogPostLayout
      slug={post.slug}
      ctaHref="/tools/exam-package/"
      ctaLabel="Check my photo for an exam"
      faqItems={FAQ_ITEMS}
    >
      <p className="text-sm text-ink-soft">Last updated: 2 November 2026</p>
      <p>
        &ldquo;Photo not as per specification&rdquo; usually means one of six
        things. Before changing the photo, check which kind of form you are
        filling in: SSC and RRB photograph you live in the form, while IBPS,
        SBI and UPSC take a prepared photo file and also take a live photo. A
        KB resizer can fix a file; it cannot do the camera step for you.
      </p>
      <p>
        The sizes each exam publishes are side by side in the{" "}
        <Link href="/blog/exam-photo-signature-size-guide/">exam photo and signature size guide</Link>.
        This page is about what goes wrong and how to fix it.
      </p>

      <h2>1. The file is outside the KB band</h2>
      <p>
        A band has a floor as well as a ceiling. IBPS asks for a{" "}
        {ibps.photoMinKb}–{ibps.photoLimitKb}&nbsp;KB photo, so a 12&nbsp;KB file
        is refused just like a 2&nbsp;MB one. Compress to a number inside the
        band, not as small as possible. SSC takes no photo file, so its form
        has no photo band to meet; only the {ssc.sigMinKb}–{ssc.sigLimitKb}&nbsp;KB
        signature has one.
      </p>

      <h2>2. The pixel size doesn&apos;t match</h2>
      <p>
        Where a notice gives a pixel size, such as IBPS&apos;s 200×230&nbsp;px
        photo and 140×60&nbsp;px signature, the file should be that size. UPSC
        gives no fixed photo pixels, so don&apos;t force a size copied from
        another exam onto a UPSC photo.
      </p>

      <h2>3. The file is not really a JPG</h2>
      <p>
        Renaming a PNG or an iPhone HEIC photo to <code>.jpg</code> does not
        change what is inside it, and the form can tell. Convert it with the{" "}
        <Link href="/convert/">format converter</Link>, then open the downloaded
        file once before uploading it.
      </p>

      <h2>4. The signature is hard to read</h2>
      <p>
        A wide paper margin, a shadow, a faint stroke or a clipped letter makes
        the signature hard to read once it is shrunk to a few KB. The{" "}
        <Link href="/tools/signature-resize/">signature tool</Link> whitens the
        paper, crops to the ink and saves the file inside the KB band you enter.
        Use the ink colour your notice names: IBPS, SBI, RRB and UPSC ask for
        black, while TNPSC accepts blue or black.
      </p>

      <h2>5. The name and date are handled the wrong way</h2>
      <p>
        TNPSC, APPSC and Kerala PSC want your name and the photo date printed
        on the photo; UPSC, SSC and IBPS do not. The Air Force Agniveervayu
        notice works differently again: you hold a black slate with your name
        and the date in chalk while the photo is taken. The{" "}
        <Link href="/tools/photo-with-name-date/">name and date tool</Link> is
        only for notices that ask for printed text; see{" "}
        <Link href="/blog/add-name-date-on-exam-photo/">how to add a name and date</Link>{" "}
        for which is which.
      </p>

      <h2>6. The live photo or the source photo is unclear</h2>
      <p>
        For a live photo, sit facing a window or lamp, in front of a plain
        wall, and follow the outline on screen. For a prepared file, start from
        a sharp, well-lit photo: compression can make a file smaller, but it
        cannot put back detail that was never there.
      </p>

      <h2>Before you press submit</h2>
      <ul>
        <li>Open the current notice for your exam and year.</li>
        <li>Check whether the form takes a photo file, a live photo, or both.</li>
        <li>For each file, check the format, the KB band and any pixel size.</li>
        <li>Preview the uploaded files in the form before final submission.</li>
      </ul>
      <p>
        The <Link href="/exam-requirements/">exam requirements directory</Link>{" "}
        links each exam&apos;s notice and the date we last checked it.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
