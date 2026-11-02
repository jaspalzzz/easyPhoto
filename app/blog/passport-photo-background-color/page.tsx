import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";
import { PhotoComplianceDiagram, type PhotoComplianceCase } from "@/components/site/PhotoComplianceDiagram";
import { COUNTRY_SPECS } from "@/lib/countrySpecs";

const post = getPost("passport-photo-background-color")!;
const midpoint = (id: "india" | "uk") => {
  const band = COUNTRY_SPECS[id].headPercentOfFrame!;
  return (band.min + band.max) / 2;
};
const BACKGROUND_CASES: PhotoComplianceCase[] = [
  { status: "pass", title: "India: white", reason: "India's print for a child below four uses white.", variant: "correct-baseline", background: COUNTRY_SPECS.india.background.hex, headPercent: midpoint("india") },
  { status: "pass", title: "UK: light cream", reason: "Cream is one of the light colours the UK names.", variant: "correct-baseline", background: COUNTRY_SPECS.uk.background.hex, headPercent: midpoint("uk") },
  { status: "pass", title: "UK on white", reason: "Acceptable — HM Passport Office names shades of white among its light-background examples.", variant: "background-wrong-colour", background: COUNTRY_SPECS.india.background.hex, headPercent: midpoint("uk") },
  { status: "fail", title: "Patterned wall", reason: "Patterns prevent a plain, uniform background.", variant: "background-busy" },
  { status: "fail", title: "Background shadow", reason: "A shadow makes the background uneven.", variant: "shadow-behind", background: COUNTRY_SPECS.india.background.hex, headPercent: midpoint("india") },
  { status: "fail", title: "Uneven lighting", reason: "A gradient across the face is not even lighting.", variant: "uneven-lighting", background: COUNTRY_SPECS.uk.background.hex, headPercent: midpoint("uk") },
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
    <BlogPostLayout slug={post.slug}>
      <div className="mb-5 text-sm text-muted-foreground">
        Last updated 2 November 2026 · Checked against the cited official passport guidance on 12 July 2026
      </div>
      <p>
        &quot;Just use a white wall&quot; is common advice, and only half
        right. White is what the US and Canada want, but the UK accepts any
        plain light colour, Schengen missions set their own shades, and
        India&apos;s OCI photo must not be white at all. Here&apos;s the
        background colour for each major country, and how to apply it.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li><strong>White or off-white:</strong> the US and Canada, and India&apos;s print for a child below four. Australia takes white or light grey.</li>
          <li><strong>Any plain light colour:</strong> the UK — HM Passport Office names shades of white, cream, ivory and light grey as examples.</li>
          <li><strong>Set by each mission:</strong> Schengen visas. Germany&apos;s sheet calls neutral grey ideal, Italy asks for white, and the Netherlands lists light grey, light blue or white.</li>
          <li><strong>Not white:</strong> India&apos;s OCI photo, which needs a plain light colour other than white.</li>
          <li>Whatever the colour, it must be a <strong>single even tone with no shadows</strong>.</li>
        </ul>
      </div>

      <PhotoComplianceDiagram
        cases={BACKGROUND_CASES}
        caption="Example photos in India and UK background colours. Check the current rules for your own document."
      />

      <h2>What changing the background does to your photo</h2>
      <p>
        easyPhoto&apos;s{" "}
        <Link href="/tools/white-background/">background tool</Link> replaces the
        background and keeps your photo&apos;s pixel size—select white and a
        1024 × 1024 px photo stays 1024 × 1024 px, with only the background
        changed. For an actual application, the next step is country-specific
        cropping—for example, India&apos;s under-four print frame is 35 × 45 mm, while
        the U.S. frame is 2 × 2 inches (51 × 51 mm).
      </p>

      <h2>Background color by country</h2>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Country</th>
            <th className="py-2 pr-3 font-semibold text-ink">Background</th>
            <th className="py-2 font-semibold text-ink">Photo maker</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["United States", "Plain white or off-white", "/us-passport-photo-maker/"],
            ["India (child below four)", "Plain white", "/india-passport-photo-maker/"],
            ["United Kingdom", "Any plain light colour, white included", "/uk-passport-photo-maker/"],
            ["Canada (visa)", "Plain white or light-coloured", "/canada-passport-photo/"],
            ["Australia", "Plain white or light grey", "/australia-passport-photo-maker/"],
            ["Schengen (EU)", "Plain and light; shade set by each mission", "/schengen-visa-photo/"],
          ].map(([c, bg, href]) => (
            <tr key={c} className="border-b border-hairline/60">
              <td className="py-2 pr-3 font-medium text-ink">{c}</td>
              <td className="py-2 pr-3">{bg}</td>
              <td className="py-2">
                <Link href={href}>View&nbsp;→</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-sm text-ink-soft">
        Official sources:{" "}
        <a href="https://travel.state.gov/en/passports/apply/help/photos.html" target="_blank" rel="noopener noreferrer">U.S. Dept. of State</a>,{" "}
        <a href="https://www.passportindia.gov.in/AppOnlineProject/pdf/GUIDELINES%20FOR%20CAPTURING%20PHOTOGRAPHS%20FOR%20MINORS_v2.1.pdf" target="_blank" rel="noopener noreferrer">Passport Seva under-four guidance</a>,{" "}
        <a href="https://www.gov.uk/photos-for-passports" target="_blank" rel="noopener noreferrer">GOV.UK</a>.
      </p>

      <figure className="my-7 overflow-hidden rounded-xl border border-hairline">
        <Image
          src="/images/passport-photo-background-color.webp"
          alt="Portrait background comparison showing white for the US and India, plus light grey and cream for the UK"
          width={1024}
          height={1024}
          className="w-full h-auto"
        />
        <figcaption className="bg-accent/30 px-4 py-2.5 text-center text-[12px] text-muted-foreground">
          Common passport-photo backgrounds: white for the US and India, plus light grey and cream, two of the UK&apos;s options.
        </figcaption>
      </figure>

      <h2>Why the shade matters so much</h2>
      <p>
        Passport backgrounds must be a single, even tone with no shadows,
        gradients or texture so that facial-recognition systems can separate your
        head from the background. A &quot;white&quot; wall photographed in warm
        indoor light often comes out cream or grey anyway. And a real shadow
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
        country. It applies that country&apos;s correct background color
        automatically, so you never have to remember whether it&apos;s white,
        grey or cream. To put any photo on a clean white background directly, use
        the <Link href="/tools/white-background/">white background tool</Link>;
        to drop the background out completely first, try the{" "}
        <Link href="/tools/background-removal/">background remover</Link>.{" "}
        For lighting, framing and setup tips when shooting at home, see{" "}
        <Link href="/blog/how-to-take-a-passport-photo-at-home/">how to take a passport photo at home</Link>.
      </p>

      <h2>One more check before you submit</h2>
      <p>
        After setting the background, make sure the photo still meets the size
        and head-proportion rules (see{" "}
        <Link href="/blog/passport-photo-size-by-country/">
          passport photo size by country
        </Link>
        ), then compress it to your portal&apos;s file limit with{" "}
        <Link href="/tools/resize-kb/">resize to an exact KB</Link>. Everything
        runs locally, so your photo never leaves your device.
      </p>

      <h2>Background troubleshooting</h2>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead><tr className="border-b border-hairline text-left"><th className="py-2 pr-3 font-semibold text-ink">Problem</th><th className="py-2 font-semibold text-ink">Fix</th></tr></thead>
        <tbody className="text-ink-soft">
          {[
            ["Grey halo around hair or shoulders", "Use a sharper, evenly lit source with clear separation from the original background; inspect edges before download."],
            ["White chosen for an OCI photo", "OCI asks for a plain light colour that is not white; switch to light grey or cream."],
            ["Face or clothing disappears into the new background", "Retake with contrasting clothing and even front lighting; background replacement cannot restore missing edges."],
            ["Correct colour but wrong crop", "Choose the country maker after replacement so the final frame and head size match that country's requirement."],
          ].map(([problem, fix]) => <tr key={problem} className="border-b border-hairline/60"><td className="py-2 pr-3 font-medium text-ink">{problem}</td><td className="py-2">{fix}</td></tr>)}
        </tbody>
      </table>

      <div className="mt-12">
        <Faq
          items={[
            {
              q: "Can I use a plain white wall for my passport photo?",
              a: "For the US, Canada, Australia and India's print for a child below four, yes, as long as it photographs as an even white with no shadow. For the UK any plain light colour works. Don't use white for an OCI photo.",
            },
            {
              q: "Does a UK passport photo background have to be grey?",
              a: "HM Passport Office asks for a plain background in any light colour and gives shades of white, cream, ivory and light grey as its own examples, so white is acceptable. Light grey is still a sensible default because it keeps your outline visible against a pale top, but it is not a requirement."
            },
          ]}
        />
      </div>
    </BlogPostLayout>
  );
}
