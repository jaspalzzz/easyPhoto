import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
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
        head must fill. Get either one wrong and the photo gets rejected, even if
        it looks fine to you. Here&apos;s what the major countries actually require.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>Most countries use <strong>35×45&nbsp;mm</strong>. The US uses <strong>2×2&nbsp;in (51×51&nbsp;mm)</strong>. Canada uses <strong>50×70&nbsp;mm</strong>.</li>
          <li>Head height (chin to crown) is a separate biometric requirement — not just how big the photo is.</li>
          <li>Background colour varies: the UK requires light grey or cream, not white.</li>
        </ul>
      </div>

      <h2>Passport photo sizes by country</h2>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Country</th>
            <th className="py-2 pr-3 font-semibold text-ink">Photo size</th>
            <th className="py-2 pr-3 font-semibold text-ink">Head height</th>
            <th className="py-2 pr-3 font-semibold text-ink">Background</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">
              <Link href="/us-passport-photo-maker/" className="text-brand underline">United States</Link>
            </td>
            <td className="py-2 pr-3">2×2&nbsp;in (51×51&nbsp;mm)</td>
            <td className="py-2 pr-3">25–35&nbsp;mm</td>
            <td className="py-2 pr-3">White or off-white</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">
              <Link href="/india-passport-photo-maker/" className="text-brand underline">India</Link>
            </td>
            <td className="py-2 pr-3">35×45&nbsp;mm</td>
            <td className="py-2 pr-3">~80% of frame</td>
            <td className="py-2 pr-3">White</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">
              <Link href="/uk-passport-photo-maker/" className="text-brand underline">United Kingdom</Link>
            </td>
            <td className="py-2 pr-3">35×45&nbsp;mm</td>
            <td className="py-2 pr-3">29–34&nbsp;mm</td>
            <td className="py-2 pr-3">Light grey or cream</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">
              <Link href="/canada-passport-photo-maker/" className="text-brand underline">Canada</Link>
            </td>
            <td className="py-2 pr-3">50×70&nbsp;mm</td>
            <td className="py-2 pr-3">31–36&nbsp;mm</td>
            <td className="py-2 pr-3">White</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">
              <Link href="/australia-passport-photo-maker/" className="text-brand underline">Australia</Link>
            </td>
            <td className="py-2 pr-3">35×45&nbsp;mm</td>
            <td className="py-2 pr-3">32–36&nbsp;mm</td>
            <td className="py-2 pr-3">White or plain light grey</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">
              <Link href="/schengen-visa-photo-maker/" className="text-brand underline">Schengen (EU visa)</Link>
            </td>
            <td className="py-2 pr-3">35×45&nbsp;mm</td>
            <td className="py-2 pr-3">32–36&nbsp;mm</td>
            <td className="py-2 pr-3">Light grey preferred</td>
          </tr>
        </tbody>
      </table>
      <p>
        Sources:{" "}
        <a href="https://travel.state.gov/content/travel/en/passports/photos.html" className="text-brand underline" target="_blank" rel="noopener noreferrer">U.S. State Department</a>
        {" "}·{" "}
        <a href="https://www.gov.uk/photos-for-passports" className="text-brand underline" target="_blank" rel="noopener noreferrer">GOV.UK</a>
        {" "}·{" "}
        <a href="https://passportindia.gov.in" className="text-brand underline" target="_blank" rel="noopener noreferrer">Passport Seva</a>
      </p>

      <h2>Why head size matters as much as photo size</h2>
      <p>
        Two photos can be the same 35×45&nbsp;mm and still differ wildly. India
        wants your face to dominate the frame, while the UK leaves more headroom.
        A generic square crop almost never matches the required chin-to-crown band.
        That&apos;s why &quot;I cropped it myself&quot; photos fail so often. The
        head ratio is a biometric requirement, not a suggestion.
      </p>

      <h2>Print size vs. digital size</h2>
      <p>
        Many countries also specify a minimum pixel size and DPI for online
        uploads, separate from the print dimensions. A photo can be the right
        physical size but too low-resolution. Or the right resolution but the
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
        <Link href="/photo-resize-to-20kb/">resize to 20&nbsp;KB</Link>,{" "}
        <Link href="/photo-resize-to-50kb/">50&nbsp;KB</Link> or a{" "}
        <Link href="/tools/resize-kb/">custom KB target</Link>. It all runs in
        your browser, with nothing uploaded.
      </p>

      <div className="mt-12">
        <Faq items={[
          {
            q: "What is the standard passport photo size?",
            a: "There is no single standard. Most countries use 35×45 mm — including India, the UK, Australia and Schengen. The US uses 2×2 inches (51×51 mm, a square). Canada uses 50×70 mm, which is larger than the rest. Always check the requirement for your specific country.",
          },
          {
            q: "Why does my self-cropped passport photo keep getting rejected?",
            a: "Photo size and head size are two separate requirements. Even if you cut a 35×45 mm frame, the chin-to-crown head height must fall in a specific millimetre range. India, the UK and the US each have different ratios. The passport photo maker measures and adjusts your head position automatically.",
          },
          {
            q: "Is a white background required for all countries?",
            a: "No. The UK specifically requires light grey or cream — a white background fails. The US, India and Canada require white. Australia accepts white or plain light grey. The Schengen area prefers light grey. Using the wrong colour is one of the most common rejection reasons.",
          },
          {
            q: "Can I use a passport photo for a visa application?",
            a: "Sometimes, but not always. Visa photo requirements can differ from passport requirements even for the same country — for example, some consulates specify different background colours or head ratios. Use the visa photo maker and select the specific visa type to get the correct spec.",
          },
        ]} />
      </div>
    </BlogPostLayout>
  );
}
