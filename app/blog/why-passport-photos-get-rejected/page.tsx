import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { getPost } from "@/lib/blog";
import { Faq } from "@/components/site/Faq";

const post = getPost("why-passport-photos-get-rejected")!;

const FAQ_ITEMS = [
  {
    q: "What is the most common reason passport photos get rejected?",
    a: "Wrong size or head proportion. Each country sets both the photo dimensions and how big the head must be within them, and a generic crop rarely matches — for example the US wants 25–35 mm chin-to-crown on a 2×2 inch photo while India requires a larger face.",
  },
  {
    q: "Can I use a plain white background for every country?",
    a: "No. The UK rejects plain white and requires light grey or cream, and Switzerland (for Schengen visas) requires grey. Light grey is the safest universal choice; set the background per country rather than assuming white.",
  },
  {
    q: "Can I wear glasses or smile in a passport photo?",
    a: "Most countries no longer allow glasses at all, and a smile, open mouth or raised eyebrows fails the biometric check. Keep a relaxed, neutral expression with your mouth closed.",
  },
  {
    q: "How recent does my passport photo need to be?",
    a: "Most countries require a photo taken within the last six months. An older photo, or a passport photo used where a visa photo is required, is a common cause of rejection.",
  },
  {
    q: "Why does my photo fail the upload file-size limit?",
    a: "Phone photos are far larger than online portals accept — many Indian exam and government forms want 20–50 KB. Compress the finished photo to your portal's exact limit before uploading.",
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
        Passport photos rarely get rejected for dramatic reasons. It&apos;s almost
        always one of a handful of small, fixable things. Here&apos;s the full
        list, worst offenders first, with how to avoid each.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">
          Quick answer — the 6 reasons photos bounce
        </p>
        <ul className="!mt-2 text-[15px]">
          <li>Wrong <strong>size / head proportion</strong> — match the country&apos;s exact mm and head band.</li>
          <li>Wrong <strong>background</strong> — white isn&apos;t universal (UK wants light grey/cream).</li>
          <li><strong>Glasses or a non-neutral expression</strong> — remove glasses, mouth closed.</li>
          <li><strong>Shadows / uneven lighting</strong> on face or wall.</li>
          <li><strong>File too large</strong> for the upload limit (many Indian forms want 20–50 KB).</li>
          <li><strong>Old photo</strong> (older than ~6 months) or wrong document type.</li>
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
            ["✗ Glasses or sunglasses", "Almost all countries have banned them"],
            ["✗ Shadows on face or wall", "Flash or single-side lighting causes this"],
            ["✗ File over 1 MB", "Most online portals cap at 20–500 KB"],
            ["✗ Old photo (>6 months)", "System flags mismatches at the counter"],
          ].map(([title, note], i) => (
            <g key={i} transform={`translate(0, ${52 + i * 55})`}>
              <text x="22" y="18" fontSize="13" fontWeight="700" fill="#b91c1c">{title}</text>
              <text x="22" y="36" fontSize="11.5" fill="#6b7280">{note}</text>
            </g>
          ))}
          {/* Right items */}
          {[
            ["✓ Plain white or light grey", "Light grey is safest — works for UK & Schengen"],
            ["✓ Eyes fully visible, no glasses", "Relaxed, neutral expression, mouth closed"],
            ["✓ Soft, even lighting", "Natural window light + gap behind you"],
            ["✓ 20–50 KB for Indian portals", "Compress to exact KB target before upload"],
            ["✓ Photo taken within 6 months", "Selfies or phone photos taken that day work"],
          ].map(([title, note], i) => (
            <g key={i} transform={`translate(390, ${52 + i * 55})`}>
              <text x="22" y="18" fontSize="13" fontWeight="700" fill="#15803d">{title}</text>
              <text x="22" y="36" fontSize="11.5" fill="#6b7280">{note}</text>
            </g>
          ))}
        </svg>
        <figcaption className="bg-accent/30 px-4 py-2.5 text-center text-[12.5px] text-muted-foreground">
          The six most common passport photo rejection reasons — and what to do instead.
        </figcaption>
      </figure>

      <h2>Wrong size or head proportion</h2>
      <p>
        The single most common cause. Each country specifies both the photo size
        and how big your head must be within it. The US wants 25–35mm chin to
        crown on a 2×2 inch photo (per the{" "}
        <a href="https://travel.state.gov/content/travel/en/passports/how-apply/photos.html" target="_blank" rel="noopener noreferrer">U.S. Department of State</a>
        ), while India wants a notably larger face (
        <a href="https://www.passportindia.gov.in" target="_blank" rel="noopener noreferrer">Passport Seva</a>
        ). A generic square crop won&apos;t match either. The{" "}
        <Link href="/passport-photo/">passport photo maker</Link> sizes the head
        to the exact band per country, which removes this problem entirely.
      </p>

      <p>The size and background most countries expect:</p>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Country</th>
            <th className="py-2 pr-3 font-semibold text-ink">Photo size</th>
            <th className="py-2 font-semibold text-ink">Background</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["India", "35 × 45 mm", "Plain white"],
            ["United States", "2 × 2 in (51 × 51 mm)", "White / off-white"],
            ["United Kingdom", "35 × 45 mm", "Light grey or cream (not white)"],
            ["Canada", "35 × 45 mm", "Plain white / light"],
            ["Australia", "35 × 45 mm", "White or light grey"],
            ["Schengen", "35 × 45 mm", "Light grey (safe default)"],
          ].map(([c, s, bg]) => (
            <tr key={c} className="border-b border-hairline/60">
              <td className="py-2 pr-3 font-medium text-ink">{c}</td>
              <td className="py-2 pr-3 font-mono text-[13px]">{s}</td>
              <td className="py-2">{bg}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Wrong background colour</h2>
      <p>
        White is <em>not</em> universal. The UK rejects plain white and wants a
        light grey or cream background (
        <a href="https://www.gov.uk/photos-for-passports" target="_blank" rel="noopener noreferrer">GOV.UK</a>
        ). For Schengen visas, Switzerland requires a grey
        background and rejects white, so light grey is the safe choice everywhere.
        The wrong shade is a frequent bounce, which is why the background should
        be set per country rather than assumed.
      </p>

      <h2>Glasses, smiling and expression</h2>
      <p>
        Most countries no longer allow glasses at all. A smile, an open mouth or
        raised eyebrows will also fail a biometric check, so keep a relaxed,
        neutral expression with your mouth closed.
      </p>

      <h2>Shadows and uneven lighting</h2>
      <p>
        Shadows on your face or on the wall behind you break the &quot;plain,
        uniform background&quot; rule. Soft, even light from a window and a small
        gap between you and the wall fixes most of it.
      </p>

      <h2>File too large (or too small) for upload</h2>
      <p>
        Online portals cap the file size. Indian exam and government forms often
        want 20–50 KB, and other portals have their own limits. A phone photo is
        far too big for any of them. Compress the finished photo with{" "}
        <Link href="/photo-resize-to-20kb/">resize to 20 KB</Link> or{" "}
        <Link href="/photo-resize-to-50kb/">50 KB</Link> to fit.
      </p>

      <h2>Old photo or wrong document type</h2>
      <p>
        Most countries want a photo taken within the last six months. And a visa
        photo isn&apos;t always the same as a passport photo, so check the right
        spec with the <Link href="/visa-photo/">visa photo maker</Link> if
        you&apos;re applying for a visa.
      </p>

      <p>
        Get these six right and rejection becomes very unlikely. The fastest way
        is to let the tool handle size, background and the compliance check. Before
        you print or upload, run your photo through the free{" "}
        <Link href="/tools/photo-rejection-check/">passport photo rejection checker</Link>
        {" "}— it tests face centering, background, tilt, and 6 other ICAO criteria
        on your device without uploading anything.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
