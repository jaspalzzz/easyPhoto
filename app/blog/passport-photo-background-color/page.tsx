import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("passport-photo-background-color")!;

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
        Last reviewed 12 July 2026 · Checked against the cited official passport guidance
      </div>
      <p>
        &quot;Just use a white wall&quot; is the most common piece of bad
        passport-photo advice. White is correct for some countries and
        explicitly wrong for others, and the wrong shade is one of the top
        reasons photos get rejected. Here&apos;s the right background color for
        each major country, and how to apply it.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li><strong>White / off-white:</strong> US, India, Canada, Australia.</li>
          <li><strong>Light grey or cream:</strong> the UK — <strong>pure white is rejected</strong>.</li>
          <li><strong>Light grey:</strong> safest for Schengen (Switzerland rejects white).</li>
          <li>Whatever the colour, it must be a <strong>single even tone with no shadows</strong>.</li>
        </ul>
      </div>

      <h2>Tested before and after</h2>
      <p>
        We ran the 1024 × 1024 px comparison image below through easyPhoto&apos;s{" "}
        <Link href="/tools/white-background/">background tool</Link>. Selecting
        white produced a 1024 × 1024 px output: the background changed while the
        canvas dimensions stayed fixed. For an actual application, the next step
        is country-specific cropping—for example, India&apos;s recorded print frame
        is 35 × 45 mm, while the U.S. frame is 2 × 2 inches (51 × 51 mm).
      </p>

      <h2>Background color by country</h2>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Country</th>
            <th className="py-2 pr-3 font-semibold text-ink">Background</th>
            <th className="py-2 font-semibold text-ink">Spec</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["United States", "Plain white or off-white", "/us-passport-photo-maker/"],
            ["India", "Plain white", "/india-passport-photo-maker/"],
            ["United Kingdom", "Light grey or cream (pure white rejected)", "/uk-passport-photo-maker/"],
            ["Canada", "Plain white", "/canada-passport-photo-maker/"],
            ["Australia", "Plain white or light grey", "/australia-passport-photo-maker/"],
            ["Schengen (EU)", "Light grey safest (varies by country)", "/schengen-visa-photo-maker/"],
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
        <a href="https://travel.state.gov/content/travel/en/passports/how-apply/photos.html" target="_blank" rel="noopener noreferrer">U.S. Dept. of State</a>,{" "}
        <a href="https://www.passportindia.gov.in" target="_blank" rel="noopener noreferrer">Passport Seva (India)</a>,{" "}
        <a href="https://www.gov.uk/photos-for-passports" target="_blank" rel="noopener noreferrer">GOV.UK</a>.
      </p>

      <figure className="my-7 overflow-hidden rounded-xl border border-hairline">
        <Image
          src="/images/passport-photo-background-color.webp"
          alt="Professional portrait background comparison showing white (India/US), light grey (UK), and cream backgrounds side by side"
          width={1024}
          height={1024}
          className="w-full h-auto"
        />
        <figcaption className="bg-accent/30 px-4 py-2.5 text-center text-[12.5px] text-muted-foreground">
          The three most common passport photo backgrounds: white (India, US), light grey (UK), and cream. Each changes how the photo is assessed against national specs.
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
            ["White chosen for a UK photo", "Switch to the plain light-grey or cream option required by GOV.UK guidance."],
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
              a: "Only for countries that require white (US, India, Canada). The UK rejects pure white. And a white wall shot in warm indoor light often comes out cream or grey, with a shadow behind the head — both fail the 'single even tone' rule.",
            },
            {
              q: "What background colour does a US or India passport photo need?",
              a: "Both require plain white (the US also accepts off-white). It must be a single, even, shadow-free tone.",
            },
            {
              q: "Why does the UK reject white passport-photo backgrounds?",
              a: "UK rules require a plain light grey or cream background — pure white is one of the most common UK rejection reasons. Use grey or cream for any UK passport or visa photo.",
            },
            {
              q: "How do I remove a shadow behind my head?",
              a: "Step about half a metre away from the wall and light yourself evenly from the front (a window works). If a faint shadow remains, replace the background entirely with the white-background tool or background remover.",
            },
          ]}
        />
      </div>
    </BlogPostLayout>
  );
}
