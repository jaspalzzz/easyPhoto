import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("resume-photo-size-and-rules")!;

const FAQ_ITEMS = [
  {
    q: "Is 35×45 mm the right size for a resume photo in India?",
    a: "Yes. In India, the standard resume or bio-data photo is the same 35×45 mm (3.5×4.5 cm) passport-size photo used for government and exam forms. There is no separate 'resume size' — use the same passport-size photo everywhere.",
  },
  {
    q: "Should I include a photo on my resume if I'm applying abroad?",
    a: "It depends on the country. Omit the photo for applications to the US, UK, Canada and Australia, where many applicant-tracking systems reject CVs with photos to avoid unconscious bias. For India, Europe (most countries) and the Middle East, a photo is standard and expected.",
  },
  {
    q: "What background colour works best for a resume photo?",
    a: "A plain white or light grey background is the most professional choice and works for both printed CVs and digital uploads. Avoid busy rooms, patterns, or coloured walls — the background should not distract from your face.",
  },
  {
    q: "Can I use the same photo for my resume and LinkedIn?",
    a: "Yes, if it is a clear, front-facing headshot with a clean background. Use the resume photo maker for the 35×45 mm crop and the LinkedIn photo maker for the square 400×400 px crop — both tools work from the same original image.",
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
      <p>
        Should you put a photo on your resume? It depends entirely on where
        you&apos;re applying. In India and much of Asia, Europe and the Middle
        East, a photo on a CV or bio-data is common and often expected. In the
        US, UK, Canada and Australia, it&apos;s usually left off. Here are the
        rules, the standard size, and how to make a clean resume photo for free.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>In India and most of Asia, use a <strong>35×45&nbsp;mm passport-size photo</strong> — there is no separate &ldquo;resume size.&rdquo;</li>
          <li>In the US, UK, Canada and Australia, leave the photo off entirely — many systems discard applications with photos to avoid bias.</li>
          <li>For digital uploads, check the portal&apos;s KB limit and compress accordingly.</li>
        </ul>
      </div>

      <figure className="my-7 overflow-hidden rounded-xl border border-hairline">
        <svg
          viewBox="0 0 760 320"
          style={{ maxWidth: "100%", height: "auto", fontFamily: "'Inter', system-ui, sans-serif", display: "block" }}
          role="img"
          aria-label="Resume/CV document diagram showing the standard passport-size photo position and dimensions: 35×45 mm, top-right corner, plain white background"
        >
          <title>Standard resume photo size and placement — 35×45 mm passport-size photo, top-right corner</title>
          <rect width="760" height="320" fill="#f9f8f6" />
          {/* CV document card */}
          <rect x="100" y="20" width="340" height="280" rx="6" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
          {/* CV header band */}
          <rect x="100" y="20" width="340" height="52" rx="6" fill="#163A6B" />
          <rect x="100" y="52" width="340" height="20" fill="#163A6B" />
          {/* Name placeholder */}
          <rect x="118" y="34" width="140" height="10" rx="3" fill="white" opacity="0.9" />
          <rect x="118" y="50" width="90" height="7" rx="3" fill="white" opacity="0.5" />
          {/* Photo placeholder in header */}
          <rect x="382" y="28" width="44" height="56" rx="3" fill="white" />
          <rect x="382" y="28" width="44" height="56" rx="3" fill="none" stroke="#F4C63F" strokeWidth="2" />
          {/* Face silhouette */}
          <circle cx="404" cy="48" r="10" fill="#d1d5db" />
          <path d="M388 84 Q404 72 420 84" fill="#d1d5db" />
          {/* CV body lines */}
          {[0,1,2,3,4,5].map(i => (
            <rect key={i} x="118" y={90 + i * 22} width={i % 3 === 2 ? 120 : 220} height="8" rx="3" fill="#e5e7eb" />
          ))}
          <rect x="118" y="88" width="60" height="8" rx="3" fill="#F4C63F" opacity="0.7" />
          {[0,1,2].map(i => (
            <rect key={i} x="118" y={198 + i * 22} width={i === 1 ? 180 : 240} height="8" rx="3" fill="#e5e7eb" />
          ))}
          <rect x="118" y="196" width="70" height="8" rx="3" fill="#F4C63F" opacity="0.7" />
          {/* Annotation: photo dimensions */}
          <line x1="434" y1="28" x2="490" y2="18" stroke="#F4C63F" strokeWidth="1.5" strokeDasharray="4 2" />
          <rect x="490" y="4" width="130" height="28" rx="4" fill="#163A6B" />
          <text x="555" y="15" textAnchor="middle" fontSize="11" fill="white" fontWeight="700">35 × 45 mm</text>
          <text x="555" y="28" textAnchor="middle" fontSize="10" fill="#F4C63F">(passport size)</text>
          {/* Annotation: background */}
          <line x1="382" y1="56" x2="330" y2="75" stroke="#163A6B" strokeWidth="1.5" strokeDasharray="4 2" />
          <text x="310" y="88" textAnchor="middle" fontSize="10" fill="#6b7280">Plain white or</text>
          <text x="310" y="100" textAnchor="middle" fontSize="10" fill="#6b7280">light grey bg</text>
          {/* Right side — guidance panel */}
          <rect x="470" y="20" width="220" height="280" rx="6" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
          <rect x="470" y="20" width="220" height="34" rx="6" fill="#163A6B" />
          <rect x="470" y="40" width="220" height="14" fill="#163A6B" />
          <text x="580" y="42" textAnchor="middle" fontSize="12" fontWeight="700" fill="white">Photo Checklist</text>
          {[
            "✓  35 × 45 mm (3.5 × 4.5 cm)",
            "✓  Plain white / light grey bg",
            "✓  Colour photo, front-facing",
            "✓  Taken within last 6 months",
            "✓  10 – 50 KB for digital upload",
            "✓  No glasses, neutral expression",
          ].map((item, i) => (
            <g key={i}>
              <text x="486" y={74 + i * 36} fontSize="11" fill={i % 2 === 0 ? "#163A6B" : "#374151"} fontWeight={i % 2 === 0 ? "600" : "400"}>{item}</text>
              {i < 5 && <line x1="486" y1={83 + i * 36} x2="674" y2={83 + i * 36} stroke="#f3f4f6" strokeWidth="1" />}
            </g>
          ))}
        </svg>
        <figcaption className="bg-accent/30 px-4 py-2.5 text-center text-[12.5px] text-muted-foreground">
          Standard resume/CV photo in India: 35×45 mm passport size, top-right corner, plain white or light grey background.
        </figcaption>
      </figure>

      <h2>Resume photo norms by region</h2>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Region</th>
            <th className="py-2 pr-3 font-semibold text-ink">Include photo?</th>
            <th className="py-2 pr-3 font-semibold text-ink">Standard size</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">India, South &amp; SE Asia</td>
            <td className="py-2 pr-3">Yes — expected</td>
            <td className="py-2 pr-3">35×45&nbsp;mm (passport size)</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Middle East, most of Europe</td>
            <td className="py-2 pr-3">Common</td>
            <td className="py-2 pr-3">35×45&nbsp;mm or similar</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">US, UK, Canada, Australia</td>
            <td className="py-2 pr-3">No — typically omit</td>
            <td className="py-2 pr-3">—</td>
          </tr>
        </tbody>
      </table>
      <p>
        The difference comes down to discrimination law. In countries with the{" "}
        <a href="https://www.gov.uk/guidance/equality-act-2010-guidance" className="text-brand underline" target="_blank" rel="noopener noreferrer">UK Equality Act 2010</a>{" "}
        and equivalent US EEOC frameworks, a hiring manager who sees a photo
        before reading qualifications may unconsciously filter on protected
        characteristics such as age, race or gender — creating legal liability.
        Most Western companies now actively filter out CVs with photos for this
        reason. In India and most of Asia, no equivalent legal pressure exists,
        so a passport-size photo on a CV remains the norm.
      </p>

      <h2>What size is a resume photo?</h2>
      <p>
        In India, a resume or bio-data photo is almost always a standard{" "}
        <strong>passport-size photo — 35×45&nbsp;mm (3.5×4.5&nbsp;cm)</strong> — the
        same size used for most application forms — see{" "}
        <Link href="/blog/passport-photo-size-by-country/">passport photo size by country</Link>{" "}
        for how it varies globally. There is no separate &quot;resume size.&quot;
        For digital uploads, portals commonly want a JPG within a set KB range,
        so check the form&apos;s limit.
      </p>

      <h2>Background, attire and expression</h2>
      <ul>
        <li><strong>Background:</strong> plain and light — white or light grey reads as professional. Avoid busy rooms and patterns.</li>
        <li><strong>Attire:</strong> formal or smart-casual in a solid colour, as you&apos;d dress for the role.</li>
        <li><strong>Framing:</strong> head and shoulders, facing the camera straight on.</li>
        <li><strong>Expression:</strong> calm and confident, with a gentle, closed-mouth smile.</li>
        <li><strong>Lighting:</strong> soft and even, with no harsh shadows on the face.</li>
      </ul>

      <h2>How to make a resume photo (free, private)</h2>
      <p>
        Upload any clear, front-facing photo to the{" "}
        <Link href="/tools/resume-photo/">resume / CV photo maker</Link>. It crops
        to the standard passport size with a clean white background, ready to
        print or paste — and nothing is uploaded to a server. Building an online
        profile too? Make a square{" "}
        <Link href="/tools/linkedin-photo/">LinkedIn photo</Link> from the same
        headshot — see the{" "}
        <Link href="/blog/linkedin-profile-photo-size-and-tips/">LinkedIn photo size guide</Link>{" "}
        for size, circle-crop tips, and what looks professional.
      </p>

      <h2>Uploading to a job portal</h2>
      <p>
        If the portal caps the file size, compress the finished photo to an exact
        target — for example{" "}
        <Link href="/photo-resize-to-50kb/">resize to 50&nbsp;KB</Link> — or pick a{" "}
        <Link href="/tools/resize-kb/">custom KB size</Link>. As always, your image
        stays on your device.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
