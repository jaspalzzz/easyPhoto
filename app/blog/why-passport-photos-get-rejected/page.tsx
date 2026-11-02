import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { getPost } from "@/lib/blog";
import { Faq } from "@/components/site/Faq";
import { PhotoComplianceDiagram, type PhotoComplianceCase } from "@/components/site/PhotoComplianceDiagram";
import { COUNTRY_SPECS } from "@/lib/countrySpecs";

const post = getPost("why-passport-photos-get-rejected")!;
const usHead = (COUNTRY_SPECS.us.headPercentOfFrame!.min + COUNTRY_SPECS.us.headPercentOfFrame!.max) / 2;

const COMPLIANCE_CASES: PhotoComplianceCase[] = [
  { status: "pass", title: "Correct baseline", reason: "Centred, straight, evenly lit and neutral.", variant: "correct-baseline", background: COUNTRY_SPECS.us.background.hex, headPercent: usHead },
  { status: "fail", title: "Busy background", reason: "The background is patterned instead of plain.", variant: "background-busy" },
  { status: "fail", title: "Wrong colour", reason: "The background does not match the country.", variant: "background-wrong-colour", background: COUNTRY_SPECS.uk.background.hex },
  { status: "fail", title: "Head too small", reason: "The face sits below the required framing band.", variant: "head-too-small", background: COUNTRY_SPECS.us.background.hex },
  { status: "fail", title: "Head too large", reason: "The face exceeds the required framing band.", variant: "head-too-large", background: COUNTRY_SPECS.us.background.hex },
  { status: "fail", title: "Off-centre", reason: "The head is shifted away from the frame centre.", variant: "off-centre", background: COUNTRY_SPECS.us.background.hex, headPercent: usHead },
  { status: "fail", title: "Head tilted", reason: "The head is not upright and facing forward.", variant: "head-tilted", background: COUNTRY_SPECS.us.background.hex, headPercent: usHead },
  { status: "fail", title: "Shadow behind", reason: "A visible shadow makes the background uneven.", variant: "shadow-behind", background: COUNTRY_SPECS.us.background.hex, headPercent: usHead },
  { status: "fail", title: "Uneven lighting", reason: "One side of the face is noticeably darker.", variant: "uneven-lighting", background: COUNTRY_SPECS.us.background.hex, headPercent: usHead },
  { status: "fail", title: "Smiling", reason: "The expression is not neutral and closed-mouth.", variant: "smiling", background: COUNTRY_SPECS.us.background.hex, headPercent: usHead },
  { status: "fail", title: "Eyes closed", reason: "Both eyes need to be open and visible.", variant: "eyes-closed", background: COUNTRY_SPECS.us.background.hex, headPercent: usHead },
  { status: "fail", title: "Glasses glare", reason: "Reflections obscure the eyes.", variant: "glasses-glare", background: COUNTRY_SPECS.us.background.hex, headPercent: usHead },
  { status: "fail", title: "Hair over face", reason: "Hair hides part of the face or an eye.", variant: "hair-over-face", background: COUNTRY_SPECS.us.background.hex, headPercent: usHead },
  { status: "fail", title: "Crop cutoff", reason: "The top of the head is clipped by the frame.", variant: "crop-cutoff", background: COUNTRY_SPECS.us.background.hex },
];

const FAQ_ITEMS = [
  {
    q: "What is the most common reason passport photos get rejected?",
    a: "Usually a head that is the wrong size inside a correctly sized photo. Each country sets both the photo size and how big the head must be within it: the US wants 25–35 mm from chin to crown on a 2×2 inch photo, the UK 29–34 mm on a 35×45 mm photo.",
  },
  {
    q: "Can I use a plain white background for every country?",
    a: "No. White suits the US, Canada and India's under-four print, and the UK accepts it among its light colours, but Schengen missions set their own shades and Germany's sheet calls neutral grey ideal. Set the background for the country you are applying to.",
  },
  {
    q: "Can I wear glasses in a passport photo?",
    a: "It depends on the country. The US does not allow glasses at all. The UK and Canada allow them if both eyes are clearly visible with no glare, and Australia asks you to remove them unless you need them for medical reasons.",
  },
  {
    q: "How recent does my passport photo need to be?",
    a: "Recent enough to look like you now. The US asks for a photo taken in the last six months; check the rule for your country, because some are stricter.",
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
        Passport photos are rarely refused for dramatic reasons. It is almost
        always one of six small, fixable things, and each one can be checked
        before you print or upload.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">
          Quick answer — six reasons photos are refused
        </p>
        <ul className="!mt-2 text-[15px]">
          <li>Wrong <strong>size or head height</strong> for the country.</li>
          <li>Wrong <strong>background</strong> — white isn&apos;t universal.</li>
          <li><strong>Glasses or expression</strong> — the rules differ by country; keep your mouth closed.</li>
          <li><strong>Shadows or uneven light</strong> on your face or the wall.</li>
          <li><strong>File size</strong> outside the online form&apos;s limit.</li>
          <li>An <strong>old photo</strong>, or a passport photo used where a visa photo is needed.</li>
        </ul>
      </div>

      <figure className="my-7 overflow-hidden rounded-xl border border-hairline">
        <svg
          viewBox="0 0 760 340"
          style={{ maxWidth: "100%", height: "auto", fontFamily: "'Inter', system-ui, sans-serif", display: "block" }}
          role="img"
          aria-label="Infographic: common passport photo mistakes on the left, correct requirements on the right"
        >
          <title>Common passport photo rejection reasons vs. the correct requirements</title>
          {/* Background */}
          <rect width="760" height="340" fill="#f9f8f6" />
          {/* Left panel — mistakes */}
          <rect x="0" y="0" width="370" height="340" fill="#fff5f5" />
          {/* Right panel — correct */}
          <rect x="390" y="0" width="370" height="340" fill="#f0fdf4" />
          {/* Centre divider */}
          <rect x="368" y="0" width="24" height="340" fill="#f9f8f6" />
          <text x="380" y="178" textAnchor="middle" fontSize="18" fontWeight="800" fill="#163A6B">VS</text>
          {/* Left header */}
          <rect x="0" y="0" width="370" height="44" fill="#ef4444" />
          <text x="185" y="27" textAnchor="middle" fontSize="14" fontWeight="700" fill="white">Common Mistakes</text>
          {/* Right header */}
          <rect x="390" y="0" width="370" height="44" fill="#163A6B" />
          <text x="575" y="27" textAnchor="middle" fontSize="14" fontWeight="700" fill="white">What&apos;s Required</text>
          {/* Left items */}
          {[
            ["✗ Dark or coloured background", "Rooms, curtains, patterned walls"],
            ["✗ Sunglasses or glare on glasses", "The US bans glasses; others want clear eyes"],
            ["✗ Shadows on face or wall", "Flash or single-side lighting causes this"],
            ["✗ File over the portal limit", "Each online form sets its own KB cap"],
            ["✗ Old photo", "It no longer looks like you"],
          ].map(([title, note], i) => (
            <g key={i} transform={`translate(0, ${52 + i * 55})`}>
              <text x="22" y="18" fontSize="13" fontWeight="700" fill="#b91c1c">{title}</text>
              <text x="22" y="36" fontSize="11.5" fill="#6b7280">{note}</text>
            </g>
          ))}
          {/* Right items */}
          {[
            ["✓ The country's background colour", "White for the US; any light colour for the UK"],
            ["✓ Eyes fully visible", "Relaxed, neutral expression, mouth closed"],
            ["✓ Soft, even lighting", "Natural window light + gap behind you"],
            ["✓ Inside the portal's KB limit", "Compress the finished photo before upload"],
            ["✓ A recent photo", "The US asks for one from the last 6 months"],
          ].map(([title, note], i) => (
            <g key={i} transform={`translate(390, ${52 + i * 55})`}>
              <text x="22" y="18" fontSize="13" fontWeight="700" fill="#15803d">{title}</text>
              <text x="22" y="36" fontSize="11.5" fill="#6b7280">{note}</text>
            </g>
          ))}
        </svg>
        <figcaption className="bg-accent/30 px-4 py-2.5 text-center text-[12px] text-muted-foreground">
          Six reasons passport photos are refused, and what to do instead.
        </figcaption>
      </figure>

      <PhotoComplianceDiagram
        cases={COMPLIANCE_CASES}
        caption="Example do and don’t photos, framed to the US passport size on white. Check the rules for your own document."
      />

      <h2>Wrong size or head height</h2>
      <p>
        Each country sets the photo size <em>and</em> how big your head must be
        inside it. The US wants 25–35&nbsp;mm from chin to crown on a
        2×2&nbsp;inch photo (per the{" "}
        <a href="https://travel.state.gov/en/passports/apply/help/photos.html" target="_blank" rel="noopener noreferrer">U.S. Department of State</a>
        ), while India&apos;s print for a child below four wants the face to
        cover 80–85% of a 35×45&nbsp;mm photo (
        <a href="https://www.passportindia.gov.in/AppOnlineProject/pdf/GUIDELINES%20FOR%20CAPTURING%20PHOTOGRAPHS%20FOR%20MINORS_v2.1.pdf" target="_blank" rel="noopener noreferrer">Passport Seva minor-photo guidance</a>
        ). A generic crop gets the outer size right and the head wrong. The{" "}
        <Link href="/passport-photo/">passport photo maker</Link> sizes the head
        to the band for the country you pick; the sizes for each country are in{" "}
        <Link href="/blog/passport-photo-size-by-country/">passport photo size by country</Link>.
      </p>

      <h2>Wrong background colour</h2>
      <p>
        White is right for the US and Canada, but it is not universal. HM
        Passport Office accepts any plain light colour, including shades of
        white, cream and light grey (
        <a href="https://www.gov.uk/photos-for-passports" target="_blank" rel="noopener noreferrer">GOV.UK</a>
        ), and Schengen missions each publish their own shade. The colour for
        each country is in the{" "}
        <Link href="/blog/passport-photo-background-color/">background colour guide</Link>.
      </p>

      <h2>Glasses and expression</h2>
      <p>
        Glasses rules differ more than people expect. The US does not allow
        glasses at all; the UK and Canada allow them if both eyes stay clearly
        visible with no glare; Australia asks you to take them off unless you
        need them for medical reasons. Everywhere, a smile, an open mouth or
        raised eyebrows can fail the check, so keep a relaxed, neutral expression
        with your mouth closed.
      </p>

      <h2>Shadows and uneven lighting</h2>
      <p>
        Shadows on your face or on the wall behind you break the &quot;plain,
        uniform background&quot; rule. Soft, even light from a window and a small
        gap between you and the wall fixes most of it.
      </p>

      <h2>File too large (or too small) for upload</h2>
      <p>
        Online forms set their own file-size limit, and some set a minimum too.
        A phone photo is usually several megabytes, far above most limits.
        Enter the limit your form shows in the{" "}
        <Link href="/tools/resize-kb/">KB resizer</Link> once the crop is
        right.
      </p>

      <h2>Old photo or wrong document type</h2>
      <p>
        Use a photo that looks like you now; the US asks for one taken in the
        last six months. A visa photo isn&apos;t always the same as a passport
        photo, so use the <Link href="/visa-photo/">visa photo maker</Link> if
        you&apos;re applying for a visa.
      </p>

      <p>
        Fixing these six cuts out the common faults, but no tool can promise an
        authority&apos;s decision. Before you print or upload, the free{" "}
        <Link href="/tools/compliance-checker/">photo check</Link> looks at face
        centring, background and tilt in your browser, without uploading the
        photo.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
