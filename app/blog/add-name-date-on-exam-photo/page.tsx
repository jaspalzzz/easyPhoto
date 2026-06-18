import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("add-name-date-on-exam-photo")!;

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
        Some application forms don&apos;t just want a photo — they want your{" "}
        <strong>name and the date the photo was taken printed on the photo
        itself</strong>. UPSC and the Indian Army are the best-known examples,
        and a photo without that text gets rejected at document verification even
        if its size and dimensions are perfect. Here&apos;s exactly what they
        ask for and how to add it in under a minute, without Photoshop.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>UPSC (CSE, NDA, CDS) and the Indian Army / Agniveer require your <strong>name and photo date</strong> printed on the photo.</li>
          <li>SSC, IBPS and most banking exams do <strong>not</strong> require it — adding text to a plain-photo exam can cause rejection.</li>
          <li>Use the <Link href="/tools/photo-with-name-date/" className="text-brand underline">photo with name &amp; date tool</Link> to add a clean strip in seconds — no Photoshop.</li>
        </ul>
      </div>

      <h2>Which exams require name and date on the photo</h2>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Exam</th>
            <th className="py-2 pr-3 font-semibold text-ink">Name &amp; date required?</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["UPSC (CSE, NDA, CDS, CAPF)", "Yes — name and photo date on the image"],
            ["Indian Army / Agniveer recruitment", "Yes — checked at every recruitment stage"],
            ["SSC (CGL, CHSL, MTS)", "No — plain passport-size photo"],
            ["IBPS / SBI (PO, Clerk, RRB)", "No — plain passport-size photo"],
            ["Railway (RRB)", "No — plain passport-size photo"],
          ].map(([exam, req]) => (
            <tr key={exam} className="border-b border-hairline/60">
              <td className="py-2 pr-3 font-medium text-ink">{exam}</td>
              <td className="py-2 pr-3">{req}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        If your exam&apos;s notification doesn&apos;t mention it, you don&apos;t
        need it — adding text to a photo that should be plain can itself cause a
        rejection. When in doubt, check your exam in the{" "}
        <Link href="/exam-requirements/">requirements directory</Link> or on{" "}
        <a href="https://upsc.gov.in" className="text-brand underline" target="_blank" rel="noopener noreferrer">upsc.gov.in</a>{" "}
        directly.
      </p>

      <h2>What the text actually needs to look like</h2>
      <p>
        The rules are simple but specific: your full name and the date should be
        clearly legible, in a plain dark font, on a light strip at the bottom of
        the photo — without covering your face or shoulders. The date is the day
        the photo was <em>taken</em>, not the day you apply. Handwriting it after
        printing is allowed for the paper form, but for online uploads the text
        needs to be part of the image.
      </p>

      <h2>Why people struggle with this</h2>
      <p>
        The usual advice is &quot;open it in MS Paint and type the text,&quot;
        which is fiddly on a phone, easy to misalign, and often leaves the text
        too small to read or overlapping the chin. Then the photo still has to be
        resized to the exam&apos;s KB and dimensions afterward — two separate
        chores.
      </p>

      <h2>The one-minute way</h2>
      <p>
        The{" "}
        <Link href="/tools/photo-with-name-date/">photo with name &amp; date tool</Link>{" "}
        does both at once. You:
      </p>
      <ul>
        <li>Drop in your photo.</li>
        <li>Type your name; the date defaults to today (taken date) and is editable.</li>
        <li>It places a clean, legible strip at the bottom without touching your face.</li>
        <li>Download — already a JPG, ready to resize for your exam.</li>
      </ul>
      <p>
        It runs entirely in your browser, so your photo is never uploaded. There
        is a dedicated{" "}
        <Link href="/ssc-photo-with-name-date/">SSC name-and-date photo page</Link>{" "}
        too, preset for that format.
      </p>

      <h2>Then size it for your exam</h2>
      <p>
        Once the name and date are on the photo, run it through your exam&apos;s
        resizer so the file lands in the right KB band and dimensions — for
        instance the{" "}
        <Link href="/exam-resizer/upsc-cse/">UPSC resizer</Link> or the{" "}
        <Link href="/exam-resizer/upsc-nda/">UPSC NDA resizer</Link>. That order —
        text first, resize second — keeps the text crisp and the file compliant.
      </p>
      <p>
        Worried about other reasons a photo gets sent back? We listed every
        common one in{" "}
        <Link href="/blog/why-exam-photo-signature-rejected/">
          why exam photos and signatures get rejected
        </Link>
        .
      </p>

      <div className="mt-12">
        <Faq items={[
          {
            q: "Does UPSC really require the name and date to be on the photo?",
            a: "Yes. UPSC's online application instructions require candidates to upload a photo with their name and the date the photograph was taken printed at the bottom. A photo without this text is rejected during document verification. Confirm in the current official notification at upsc.gov.in.",
          },
          {
            q: "What date should I write on the photo — the application date or the photo date?",
            a: "The date the photo was taken, not the date you apply. Most portals check that the photo is recent (usually within the last 6 months). If you took the photo specifically for this application, write today's date.",
          },
          {
            q: "Can I handwrite the name and date on a printed photo?",
            a: "For printed paper applications, yes — many UPSC and Army forms allow neat handwriting at the bottom. For online uploads, the text must be part of the digital image file. Use the photo with name & date tool for online submissions.",
          },
          {
            q: "Should I add name and date for SSC or IBPS?",
            a: "No. SSC and IBPS require a plain passport-size photo without any text overlay. Adding a name-and-date strip to a photo for these portals will cause rejection. Only add the text when the official notification explicitly asks for it.",
          },
        ]} />
      </div>
    </BlogPostLayout>
  );
}
