import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("schengen-europe-visa-photo-size")!;

const FAQ_ITEMS = [
  {
    q: "What size is a Schengen visa photo?",
    a: "35 × 45 mm (the ICAO biometric standard), with the face filling 70–80% of the frame (about 32–36 mm chin to crown), a neutral expression, and taken within the last 6 months.",
  },
  {
    q: "What background colour does a Schengen visa photo need?",
    a: "It varies by country: Germany requires neutral/light grey, Italy specifies white, France wants a plain light colour, and the Netherlands accepts grey, light blue or white. Light grey is the safe universal choice.",
  },
  {
    q: "Why does Germany reject white backgrounds?",
    a: "German missions require a single, neutral light-grey background so the face separates cleanly for biometric checks; a pure-white photo is a common rejection. Use grey for any German (and most Schengen) application.",
  },
  {
    q: "Is the Schengen photo the same for every country?",
    a: "The size (35 × 45 mm) and face proportions are the same across the Schengen area, but the background-colour rule differs by country — that's the part most applicants get wrong.",
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
      <p className="text-sm text-ink-soft">Last reviewed: 12 July 2026</p>
      <p>
        If you&apos;re applying for a Schengen visa or a European student/work
        visa, the photo is one of the easiest things to get wrong — and one of the
        most common reasons applications get held up. The good news: the size is
        standardised across the Schengen area. The catch: the <strong>background
        colour rule differs by country</strong>, and that&apos;s where people slip.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>Size is standard across Schengen: <strong>35 × 45 mm</strong>, face 70–80% of the frame, neutral expression, last 6 months.</li>
          <li>The <strong>background colour varies by country</strong> — Germany wants grey and rejects white; Italy wants white.</li>
          <li><strong>Light grey is the safe universal choice</strong> (accepted everywhere, including Switzerland, which rejects white).</li>
        </ul>
      </div>

      <h2>Concrete output example</h2>
      <p>
        The Schengen preset produces a 35×45&nbsp;mm JPG. At the registry&apos;s
        300&nbsp;DPI reference, that corresponds to approximately 413×531&nbsp;px;
        an input portrait of any larger dimensions is cropped to that aspect ratio
        rather than stretched. The file-size limit is deliberately not stated as a
        single number because <code>countrySpecs.ts</code> records it as varying by
        consulate or VFS portal. Confirm the current upload limit before compressing.
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
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Country</th>
            <th className="py-2 pr-3 font-semibold text-ink">Background</th>
            <th className="py-2 font-semibold text-ink">Make · source</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["Germany", "Neutral / light grey (not pure white)", "/germany-visa-photo-maker/", "https://www.germany.info/resource/blob/906790/6e3eee9fd4d86e16aaefe0e92d809332/dd-sample-photos-data.pdf"],
            ["France", "Plain light-coloured", "/france-visa-photo-maker/", "https://france-visas.gouv.fr/documents/d/france-visas/iso_iec_fv_visa_photograph_requirements_en"],
            ["Italy", "White", "/italy-visa-photo-maker/", "https://italyvms.com/photo-requirements/"],
            ["Netherlands", "Light grey, light blue or white", "/netherlands-visa-photo-maker/", "https://www.netherlandsworldwide.nl/passport-id-card/photo-requirements"],
          ].map(([c, bg, maker, href]) => (
            <tr key={c} className="border-b border-hairline/60">
              <td className="py-2 pr-3 font-medium text-ink">{c}</td>
              <td className="py-2 pr-3">{bg}</td>
              <td className="py-2">
                <Link href={maker}>Make&nbsp;→</Link>{" "}·{" "}
                <a href={href} target="_blank" rel="noopener noreferrer">source</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        If you&apos;re unsure, <strong>light grey is the safest universal choice</strong> —
        it&apos;s accepted everywhere, including Switzerland (which rejects white).
        For EU Schengen visa requirements, see the{" "}
        <a href="https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy_en" className="text-brand underline" target="_blank" rel="noopener noreferrer">European Commission Schengen visa guidance</a>.
      </p>

      <h2>Troubleshooting rejected Schengen photos</h2>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead><tr className="border-b border-hairline text-left"><th className="py-2 pr-3 font-semibold text-ink">Failure</th><th className="py-2 font-semibold text-ink">Fix</th></tr></thead>
        <tbody className="text-ink-soft">
          {[
            ["Portal rejects the file before preview", "Check the portal's current JPG and KB rules; there is no EU-wide upload cap."],
            ["Head is cropped or too small", "Return to the 35×45 mm preset and keep chin-to-crown height within the registry's 32–36 mm band."],
            ["White background rejected", "Use the destination country's published colour; Germany requires neutral/light grey while Italy specifies white."],
            ["Face looks stretched", "Crop to the 35:45 aspect ratio; do not force independent width and height scaling."],
          ].map(([failure, fix]) => <tr key={failure} className="border-b border-hairline/60"><td className="py-2 pr-3 font-medium text-ink">{failure}</td><td className="py-2">{fix}</td></tr>)}
        </tbody>
      </table>

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
        before submitting. For photo dimensions across all passport and visa types,
        see{" "}
        <Link href="/blog/passport-photo-size-by-country/">passport photo size by country</Link>.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
