import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("how-to-take-a-passport-photo-at-home")!;

const FAQ_ITEMS = [
  {
    q: "Can I use a selfie for a passport photo?",
    a: "A front-facing selfie taken at arm's length can work, but the perspective often distorts the face slightly. A better approach is to prop your phone against something and use the timer, or ask someone to take it from about a metre away at eye level.",
  },
  {
    q: "Does the background have to be white?",
    a: "Not for all countries. The UK requires light grey or cream — a pure white background will fail. The US and India require white. Upload your photo to the passport photo maker and select your country; it applies the correct background regardless of what was behind you.",
  },
  {
    q: "Why do passport photos get rejected for shadows?",
    a: "Passport photos use the face as a biometric identifier. Shadows alter the apparent shape of facial features and can cause automated systems to flag the photo. Stand away from the wall and use soft frontal light to eliminate both face shadows and background shadows.",
  },
  {
    q: "How do I know if my head takes up the right amount of the frame?",
    a: "Every country specifies a required chin-to-crown head height as a percentage of the photo height. The passport photo maker measures this automatically and adjusts the crop so your head fills exactly the required band — something very difficult to judge by eye.",
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
        A passport photo from a shop isn&apos;t magic. It&apos;s really just
        three things: a plain background, even light, and a precise crop. You can
        do all three at home with a phone and skip the queue (and the fee). Here&apos;s
        the approach that actually gets accepted.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>Stand half a metre from a plain wall; face a window for soft, even light — no flash.</li>
          <li>Neutral expression, mouth closed, both ears visible, no glasses.</li>
          <li>Background colour depends on your country — the UK requires light grey, not white.</li>
          <li>Upload to the <Link href="/passport-photo/" className="text-brand underline">passport photo maker</Link>, pick your country, and it crops and sets the background automatically.</li>
        </ul>
      </div>

      <h2>Background colour by country</h2>
      <p>
        The background colour is not universal — get it wrong and the photo fails
        even if everything else is perfect.
      </p>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Country</th>
            <th className="py-2 pr-3 font-semibold text-ink">Required background</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["United States", "Plain white or off-white"],
            ["India", "Plain white"],
            ["United Kingdom", "Light grey or cream (not white)"],
            ["Canada", "White"],
            ["Australia", "White or plain light grey"],
            ["Schengen (EU visa)", "Light grey preferred"],
          ].map(([country, bg]) => (
            <tr key={country} className="border-b border-hairline/60">
              <td className="py-2 pr-3 font-medium text-ink">{country}</td>
              <td className="py-2 pr-3">{bg}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        The UK&apos;s specification is published on{" "}
        <a
          href="https://www.gov.uk/photos-for-passports"
          className="text-brand underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          GOV.UK
        </a>
        . The passport photo maker applies the correct background for each country automatically, so you don&apos;t need to repaint your wall.
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
        <li>No glasses. Most countries no longer allow them.</li>
        <li>No smiling, no raised eyebrows; neutral only.</li>
        <li>No hats or head coverings except for religious or medical reasons.</li>
        <li>No shadows on your face or behind your head.</li>
      </ul>

      <h2>4. Crop and set the background automatically</h2>
      <p>
        This is where the millimetres matter, and it&apos;s where home attempts
        usually slip. Instead of guessing, upload your photo to the{" "}
        <Link href="/passport-photo/">passport photo maker</Link>, choose your
        country, and it crops your head to the exact required size and applies the
        correct background colour. If your country&apos;s portal caps the file
        size, run the result through{" "}
        <Link href="/photo-resize-to-50kb/">resize to 50&nbsp;KB</Link>.
      </p>

      <h2>5. Print or upload</h2>
      <p>
        For a printed application, download the 4×6&quot; sheet and print it at a
        photo kiosk on photo paper. For online applications, use the upload-ready
        file. A compliant photo, and you never left home.
      </p>
      <p>
        Photographing a baby or infant? The rules differ — eyes must be open and
        the head unsupported. See{" "}
        <Link href="/blog/baby-and-infant-passport-photo-guide/">
          how to take a baby passport photo at home
        </Link>. For the full list of reasons photos get rejected at the counter,
        see{" "}
        <Link href="/blog/why-passport-photos-get-rejected/">
          why passport photos get rejected
        </Link>.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
