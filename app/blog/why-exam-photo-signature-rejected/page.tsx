import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";
import { PORTAL_PRESETS } from "@/lib/portalPresets";

const post = getPost("why-exam-photo-signature-rejected")!;
const ssc = PORTAL_PRESETS.ssc;
const ibps = PORTAL_PRESETS.ibps;
const upsc = PORTAL_PRESETS.upsc;

const FAQ_ITEMS = [
  {
    q: "Why does an exam portal show a generic photo or signature error?",
    a: "A generic validation message may cover file size, format, dimensions or a visual capture problem. First identify whether the current form uses a prepared upload or live capture, then compare only the published requirements for that workflow.",
  },
  {
    q: "Does every exam photo need to be 20–50 KB?",
    a: "No. IBPS publishes a 20–50 KB prepared photo, UPSC publishes 20–200 KB with no fixed photo pixels, and current SSC applications capture the photograph live rather than accepting a prepared photo file.",
  },
  {
    q: "Should I add my name and date to an exam photo?",
    a: "Only when the current notice asks for it. TNPSC, APPSC and Kerala PSC record a digital treatment. Current UPSC, SSC and IBPS instructions do not. Airforce and Navy Agniveer use a physical slate workflow, which a digital strip cannot replace.",
  },
  {
    q: "Can a photo checker guarantee that my application will accept the file?",
    a: "No. A checker can inspect measurable properties such as encoded dimensions, file size and format. It cannot reproduce every portal validator, assess identity or guarantee the authority's decision.",
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
      ctaLabel="Check a stored exam target"
      faqItems={FAQ_ITEMS}
    >
      <p className="text-sm text-ink-soft">Last reviewed: 18 July 2026</p>
      <p>
        A photo or signature can fail for different reasons depending on the
        portal. The first distinction is whether the form accepts a prepared
        file or captures the photograph live. A KB resizer helps with a file
        upload; it cannot replace a camera step controlled by the authority.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Start here</p>
        <ul className="!mt-2 text-[15px]">
          <li>Open the current notice for the exact exam and cycle.</li>
          <li>Separate live photograph capture from prepared photo/signature uploads.</li>
          <li>Check measurable requirements: format, KB band and published dimensions.</li>
          <li>Then check the source image: visibility, lighting, background and framing stated by that notice.</li>
        </ul>
      </div>

      <h2>Three workflows that should not be mixed</h2>
      <div className="my-5 overflow-x-auto rounded-xl border border-hairline">
        <table className="min-w-[720px] w-full border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-hairline text-left">
              <th className="px-4 py-3 font-semibold text-ink">Example</th>
              <th className="px-4 py-3 font-semibold text-ink">Photograph workflow</th>
              <th className="px-4 py-3 font-semibold text-ink">Separate signature</th>
              <th className="px-4 py-3 font-semibold text-ink">What a tool can help with</th>
            </tr>
          </thead>
          <tbody className="text-ink-soft">
            <tr className="border-b border-hairline/60">
              <td className="px-4 py-3 font-medium text-ink">SSC</td>
              <td className="px-4 py-3">Live capture; no prepared photo upload in the cited notice</td>
              <td className="px-4 py-3">{ssc.sigMinKb}–{ssc.sigLimitKb} KB JPG/JPEG, about 6.0×2.0 cm</td>
              <td className="px-4 py-3">Prepare the separate signature; follow the camera interface for the photo</td>
            </tr>
            <tr className="border-b border-hairline/60">
              <td className="px-4 py-3 font-medium text-ink">IBPS</td>
              <td className="px-4 py-3">{ibps.photoMinKb}–{ibps.photoLimitKb} KB JPG/JPEG at 200×230 px</td>
              <td className="px-4 py-3">{ibps.sigMinKb}–{ibps.sigLimitKb} KB at 140×60 px</td>
              <td className="px-4 py-3">Prepare both stored frames and KB bands</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">UPSC</td>
              <td className="px-4 py-3">{upsc.photoMinKb}–{upsc.photoLimitKb} KB prepared JPG plus mandatory live photograph</td>
              <td className="px-4 py-3">One {upsc.sigMinKb}–{upsc.sigLimitKb} KB JPG containing three signatures vertically</td>
              <td className="px-4 py-3">Prepare the upload files; the live capture still happens in the portal</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-ink-soft">
        Sources: <a href={ssc.source!.url} target="_blank" rel="noopener noreferrer" className="text-brand underline">SSC 2026 notice</a>,{" "}
        <a href={ibps.source!.url} target="_blank" rel="noopener noreferrer" className="text-brand underline">IBPS notification</a>, and{" "}
        <a href={upsc.source!.url} target="_blank" rel="noopener noreferrer" className="text-brand underline">UPSC upload instructions</a>.
      </p>

      <h2>1. The file is outside the published KB band</h2>
      <p>
        A prepared upload can have both a minimum and a maximum. For example,
        IBPS records {ibps.photoMinKb}–{ibps.photoLimitKb}&nbsp;KB for the photo
        and {ibps.sigMinKb}–{ibps.sigLimitKb}&nbsp;KB for the signature. Compressing
        below the minimum does not satisfy that band. SSC&apos;s current live
        photograph has no prepared-photo band, so do not apply the IBPS number to it.
      </p>

      <h2>2. Published dimensions do not match</h2>
      <p>
        Some upload fields publish a final pixel frame. IBPS records 200×230&nbsp;px
        for the photo and 140×60&nbsp;px for the signature. Other sources, including
        current UPSC photo instructions and the current SSC live-photo workflow,
        publish no fixed photo pixels. When no dimensions are published, do not
        invent them or copy them from another exam.
      </p>

      <h2>3. The encoded format is different</h2>
      <p>
        A file named <code>.jpg</code> should contain JPEG bytes when the field
        asks for JPG/JPEG. Renaming a PNG or HEIC file does not convert it. Use a
        portal-specific workflow or the <Link href="/convert/">format converter</Link>,
        then open the downloaded file once before uploading it.
      </p>

      <h2>4. The signature crop or paper field is unclear</h2>
      <p>
        A large paper margin, shadow, faint stroke or clipped signature can make
        the prepared image hard to read. The <Link href="/tools/signature-resize/">signature tool</Link>{" "}
        can clean and crop the image, choose ink presentation and prepare a KB
        target. Use the ink colour and background stated by the selected notice;
        there is no universal black-or-blue rule.
      </p>

      <h2>5. The wrong name/date treatment is used</h2>
      <p>
        A digital strip is recorded for TNPSC, APPSC and Kerala PSC. Current
        UPSC, SSC and IBPS instructions do not list one. Airforce and Navy
        Agniveer notices instead describe a physical black slate held when the
        photograph is taken. The <Link href="/tools/photo-with-name-date/">digital name/date tool</Link>{" "}
        should be used only for a notice that requests the digital treatment.
      </p>

      <h2>6. The live capture or source image is unclear</h2>
      <p>
        For a live camera step, follow the on-screen framing, lighting and
        background instructions. For a prepared file, start with a clear source
        that shows everything the current notice requests. Compression can change
        bytes and dimensions; it cannot restore missing detail, prove identity or
        reproduce the authority&apos;s final review.
      </p>

      <h2>A practical pre-submission check</h2>
      <ul>
        <li>Confirm the exam, year and notice URL.</li>
        <li>Confirm whether the photograph is live capture, prepared upload, or both.</li>
        <li>For each prepared file, check encoded format, KB band and published dimensions.</li>
        <li>Follow only the ink, background, name/date and composition rules stated for that workflow.</li>
        <li>Preview the result in the portal before final submission.</li>
      </ul>
      <p>
        The <Link href="/exam-requirements/">exam requirements directory</Link>{" "}
        shows each registry entry&apos;s source and verification status. Entries marked
        needs review should be confirmed in the live form before use.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
