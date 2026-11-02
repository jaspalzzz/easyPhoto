import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";
import { PhotoComplianceDiagram, type PhotoComplianceCase } from "@/components/site/PhotoComplianceDiagram";
import { COUNTRY_SPECS } from "@/lib/countrySpecs";

const post = getPost("how-to-take-a-passport-photo-at-home")!;
const indiaHead = (COUNTRY_SPECS.india.headPercentOfFrame!.min + COUNTRY_SPECS.india.headPercentOfFrame!.max) / 2;
const HOME_CASES: PhotoComplianceCase[] = [
  { status: "pass", title: "Ready to crop", reason: "Straight, centred, evenly lit and neutral.", variant: "correct-baseline", background: COUNTRY_SPECS.india.background.hex, headPercent: indiaHead },
  { status: "fail", title: "Shadow behind", reason: "Standing too close to the wall creates a shadow.", variant: "shadow-behind", background: COUNTRY_SPECS.india.background.hex, headPercent: indiaHead },
  { status: "fail", title: "Uneven light", reason: "Side lighting leaves part of the face dark.", variant: "uneven-lighting", background: COUNTRY_SPECS.india.background.hex, headPercent: indiaHead },
  { status: "fail", title: "Head tilted", reason: "Keep the head upright and face the camera.", variant: "head-tilted", background: COUNTRY_SPECS.india.background.hex, headPercent: indiaHead },
  { status: "fail", title: "Eyes closed", reason: "Retake while both eyes are open and visible.", variant: "eyes-closed", background: COUNTRY_SPECS.india.background.hex, headPercent: indiaHead },
  { status: "fail", title: "No crop room", reason: "Leave space so the final crop does not clip the head.", variant: "crop-cutoff", background: COUNTRY_SPECS.india.background.hex },
];

const FAQ_ITEMS = [
  {
    q: "Can I use a selfie for a passport photo?",
    a: "A front-facing selfie taken at arm's length can work, but the perspective often distorts the face slightly. A better approach is to prop your phone against something and use the timer, or ask someone to take it from about a metre away at eye level.",
  },
  {
    q: "Does the background have to be white?",
    a: "Not for all countries. The US wants white or off-white, the UK accepts any plain light colour, and Schengen missions set their own shade. Upload your photo to the passport photo maker and select your country; it applies a suitable background regardless of what was behind you.",
  },
  {
    q: "Why do passport photos get rejected for shadows?",
    a: "Passport photos are used to recognise your face, and shadows change how its features look. A shadow on the wall also breaks the plain-background rule. Stand away from the wall and use soft light from the front to remove both.",
  },
  {
    q: "How do I know if my head takes up the right amount of the frame?",
    a: "Each country sets a head size, usually as a chin-to-crown height in millimetres (the UK asks for 29–34 mm) or as a share of the photo. The passport photo maker finds your face and crops so your head sits inside that band, which is hard to judge by eye.",
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
      <p className="text-sm text-ink-soft">Last updated: 2 November 2026</p>
      <p>
        A passport photo from a shop isn&apos;t magic. It&apos;s really just
        three things: a plain background, even light, and a precise crop. You can
        do all three at home with a phone and skip the queue (and the fee). Here&apos;s
        how to take the photo, then check it against your country&apos;s rules.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>Stand half a metre from a plain wall; face a window for soft, even light — no flash.</li>
          <li>Neutral expression, mouth closed, both ears visible; take glasses off unless your country allows them.</li>
          <li>Background colour depends on your country; the maker sets it for you.</li>
          <li>Upload to the <Link href="/passport-photo/" className="text-brand underline">passport photo maker</Link>, pick your country, and it crops and sets the background automatically.</li>
        </ul>
      </div>

      <PhotoComplianceDiagram
        cases={HOME_CASES}
        caption="Example photos on white, framed to India's print for a child below four. Check these faults before you crop."
      />

      <h2>What the crop does with your photo</h2>
      <p>
        A landscape phone image is trimmed to the frame of whichever country you
        pick, and neither you nor the background is stretched. Choosing the
        United States produces a square 51×51&nbsp;mm frame with a 25–35&nbsp;mm
        chin-to-crown band; choosing the United Kingdom produces 35×45&nbsp;mm with a 29–34&nbsp;mm head band. Sources: the{" "}
        <a href="https://travel.state.gov/en/passports/apply/help/photos.html" target="_blank" rel="noopener noreferrer">U.S. State Department</a>{" "}
        and <a href="https://www.gov.uk/photos-for-passports" target="_blank" rel="noopener noreferrer">GOV.UK</a>.
      </p>

      <p>
        The background colour is not universal either. The{" "}
        <Link href="/blog/passport-photo-background-color/">background colour guide</Link>{" "}
        lists it for each country, and the maker applies it for you, so you
        don&apos;t need to repaint your wall.
      </p>

      <h2>1. Find a plain wall and good light</h2>
      <p>
        Stand about half a metre in front of a smooth, plain wall. Face a window
        during the day for soft, even light. Steer clear of overhead lights that
        cast shadows under your eyes, and skip the flash — it flattens skin and
        bounces off the wall.
      </p>

      <h2>2. Frame it head-on</h2>
      <p>
        Have someone take the photo from a metre or so away at eye level (a
        propped-up phone and the timer works too). Look straight at the lens with
        a neutral expression and your mouth closed. Keep your head straight, hair
        clear of your eyes, and both ears roughly visible. Leave some space above
        your head, because you&apos;ll need room to crop.
      </p>

      <h2>3. Skip the things that get photos rejected</h2>
      <ul>
        <li>Follow your country&apos;s glasses rule; the US State Department&apos;s rules say no glasses, while Canada permits them if there is no glare and the eyes remain visible.</li>
        <li>No smiling, no raised eyebrows; neutral only.</li>
        <li>No hats or head coverings except for religious or medical reasons.</li>
        <li>No shadows on your face or behind your head.</li>
      </ul>

      <h2>4. Crop and set the background automatically</h2>
      <p>
        This is where the millimetres matter, and it&apos;s where home attempts
        usually slip. Instead of guessing, upload your photo to the{" "}
        <Link href="/passport-photo/">passport photo maker</Link>, choose your
        country, and it crops your head to that country&apos;s size and applies its
        background colour. If an online form caps the file size, enter that limit
        in the <Link href="/tools/resize-kb/">KB resizer</Link>.
      </p>

      <h2>5. Print or upload</h2>
      <p>
        For a printed application, download the 4×6&quot; sheet and print it at a
        photo kiosk on photo paper. Some countries won&apos;t take a home photo
        for a printed passport: Canada wants one from a commercial photographer
        with a certification on the back. For an online application, upload the
        single photo file.
      </p>
      <h2>Fixing a home photo that went wrong</h2>
      <table className="my-5 w-full border-collapse text-[14px]"><thead><tr className="border-b border-hairline text-left"><th className="py-2 pr-3 font-semibold text-ink">Failure</th><th className="py-2 font-semibold text-ink">Fix</th></tr></thead><tbody className="text-ink-soft">{[
        ["Shadow behind the head", "Move farther from the wall and use soft light from in front of the face."],
        ["Face looks distorted", "Use the rear camera at eye level from farther away; avoid a close arm's-length selfie."],
        ["Head is clipped after cropping", "Retake with space above the hair and around both shoulders."],
        ["Portal rejects the finished file", "Check the country's current dimensions, format and KB rules; correct framing alone is not enough."],
      ].map(([failure, fix]) => <tr key={failure} className="border-b border-hairline/60"><td className="py-2 pr-3 font-medium text-ink">{failure}</td><td className="py-2">{fix}</td></tr>)}</tbody></table>
      <p>
        Photographing a baby? Some rules are relaxed for infants; the US, for
        example, doesn&apos;t require a newborn&apos;s eyes to be fully open. See{" "}
        <Link href="/blog/baby-and-infant-passport-photo-guide/">
          how to take a baby passport photo at home
        </Link>.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
