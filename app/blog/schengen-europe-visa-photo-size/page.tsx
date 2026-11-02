import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("schengen-europe-visa-photo-size")!;

const FAQ_ITEMS = [
  {
    q: "Do all 29 Schengen countries use the same photo size?",
    a: "The print size is the same everywhere: 35 × 45 mm under the ICAO standard, taken within the last 6 months with a neutral expression. The face usually fills 70–80% of the frame (about 32–36 mm chin to crown), but a few missions set their own head size: the Netherlands asks for 26–30 mm. The background shade differs most, so check the mission handling your application.",
  },
  {
    q: "What does Germany's photo sheet say about the background?",
    a: "It asks for a one-colour bright background, ideally neutral grey, with enough contrast against your face and hair. It does not ban white: the shade that works depends on your hair, so pick one that clearly separates from it.",
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
    <BlogPostLayout slug={post.slug} faqItems={FAQ_ITEMS}>
      <p className="text-sm text-ink-soft">Last updated: 2 November 2026</p>
      <p>
        If you&apos;re applying for a Schengen visa or a European student/work
        visa, start with the shared 35 × 45 mm format, then check the mission that
        will handle the application. The <strong>background colour instruction can
        differ by country</strong>, so the destination source matters just as much
        as the common dimensions.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>Size is standard across Schengen: <strong>35 × 45 mm</strong>, face 70–80% of the frame, neutral expression, last 6 months.</li>
          <li>The <strong>background instruction varies by country</strong> — Germany publishes a contrast-based rule and says neutral grey is ideal; other destinations publish different allowed shades.</li>
          <li><strong>Do not assume one background works everywhere.</strong> Follow the current embassy, consulate or application-centre instruction for your destination.</li>
        </ul>
      </div>

      <h2>What the photo maker gives you</h2>
      <p>
        The{" "}
        <Link href="/schengen-visa-photo/">Schengen visa photo maker</Link>{" "}
        produces a 35×45&nbsp;mm JPG, about 413×531&nbsp;px at 300&nbsp;DPI. A
        larger photo is cropped to that shape rather than stretched. There is no
        EU-wide file-size limit: each consulate or VFS portal sets its own, so
        check yours before compressing.
      </p>

      <h2>The standard Schengen photo size</h2>
      <ul>
        <li><strong>Dimensions:</strong> 35 × 45 mm (the ICAO biometric standard).</li>
        <li><strong>Face:</strong> 70–80% of the frame, roughly 32–36 mm chin to crown.</li>
        <li><strong>Expression:</strong> neutral, mouth closed, both eyes open and visible.</li>
        <li><strong>Recency:</strong> taken within the last 6 months.</li>
        <li><strong>Glasses:</strong> best avoided; no glare, no tint, frames clear of the eyes.</li>
      </ul>

      <h2>Compare the destination&apos;s background instruction</h2>
      <p>
        All Schengen states follow ICAO, but they interpret the background
        differently. The table below sums up what each linked instruction says;
        your mission&apos;s current application page still has the final word:
      </p>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Country</th>
            <th className="py-2 pr-3 font-semibold text-ink">Background</th>
            <th className="py-2 font-semibold text-ink">Source</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["Germany", "One-colour bright; neutral grey ideal; contrast required", "https://www.germany.info/resource/blob/906790/6e3eee9fd4d86e16aaefe0e92d809332/dd-sample-photos-data.pdf"],
            ["France", "Plain light-coloured", "https://france-visas.gouv.fr/documents/d/france-visas/iso_iec_fv_visa_photograph_requirements_en"],
            ["Italy", "White", "https://italyvms.com/photo-requirements/"],
            ["Netherlands", "Light grey, light blue or white", "https://www.netherlandsworldwide.nl/passport-id-card/photo-requirements"],
          ].map(([c, bg, href]) => (
            <tr key={c} className="border-b border-hairline/60">
              <td className="py-2 pr-3 font-medium text-ink">{c}</td>
              <td className="py-2 pr-3">{bg}</td>
              <td className="py-2">
                <a href={href} target="_blank" rel="noopener noreferrer">{c} instruction</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        For the visa rules that apply across the Schengen area, see the{" "}
        <a href="https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy_en" className="text-brand underline" target="_blank" rel="noopener noreferrer">European Commission Schengen visa guidance</a>.
      </p>

      <h2>Why Schengen photos get refused</h2>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead><tr className="border-b border-hairline text-left"><th className="py-2 pr-3 font-semibold text-ink">Failure</th><th className="py-2 font-semibold text-ink">Fix</th></tr></thead>
        <tbody className="text-ink-soft">
          {[
            ["Portal rejects the file before preview", "Check the portal's current JPG and KB rules; there is no EU-wide upload cap."],
            ["Head is cropped or too small", "Return to the 35×45 mm size and keep chin-to-crown height within the 32–36 mm band."],
            ["Background does not match the instruction", "Use the destination country's published colour and contrast rule; Germany calls neutral grey ideal but frames the rule around brightness and contrast."],
            ["Face looks stretched", "Crop to the 35:45 aspect ratio; do not force independent width and height scaling."],
          ].map(([failure, fix]) => <tr key={failure} className="border-b border-hairline/60"><td className="py-2 pr-3 font-medium text-ink">{failure}</td><td className="py-2">{fix}</td></tr>)}
        </tbody>
      </table>

      <h2>How to make one free, without uploading your photo</h2>
      <p>
        Drop a clear front-facing photo into the Schengen visa photo maker and it
        crops to 35×45 mm on light grey, its starting shade; switch the shade if
        your mission names another, such as Italy&apos;s white. Everything runs in your browser,
        so your photo is never uploaded.
      </p>
      <p>
        Need to hit a specific upload size too? If the current consulate or VFS
        page publishes a KB cap, use the{" "}
        <Link href="/tools/resize-kb/">compress-to-KB tool</Link> on the finished
        photo. For photo sizes in other countries,
        see{" "}
        <Link href="/blog/passport-photo-size-by-country/">passport photo size by country</Link>.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
