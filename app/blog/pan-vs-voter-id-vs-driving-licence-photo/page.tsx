import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("pan-vs-voter-id-vs-driving-licence-photo")!;

const FAQ_ITEMS = [
  {
    q: "Is the PAN, voter ID and driving licence photo the same?",
    a: "No. They share the same style — a recent front-facing colour photo on a plain white background — but the upload rules differ sharply. The file-size cap ranges from 30 KB (PAN via UTIITSL) to 200 KB (voter ID), pixel dimensions differ, and only the PAN photo via UTIITSL needs a square crop. All three want JPEG.",
  },
  {
    q: "Which of the three has the strictest photo size limit?",
    a: "PAN via UTIITSL is the strictest at 30 KB, then the driving licence (Sarathi) at 40 KB, PAN via NSDL at 50 KB, and voter ID (NVSP) is the most generous at 200 KB. If you compress a single photo to under 30 KB, it clears all three portals on file size.",
  },
  {
    q: "Can I use one photo for my PAN card, voter ID and driving licence?",
    a: "Yes. Prepare a colour JPEG on a plain white background, roughly 200×250 px, compressed to under 30 KB — that single file satisfies the KB cap and pixel minimum of all three. The one extra step is a square 213×213 px crop if you apply for PAN through UTIITSL, which is the only portal that requires a square.",
  },
  {
    q: "Why is only the PAN photo square?",
    a: "PAN via UTIITSL uses a square 213×213 px crop optimised for face-matching, while NSDL PAN, voter ID and driving licence all use a portrait rectangle. If you upload a portrait photo to UTIITSL without squaring it, the portal rejects it or crops your face off-centre — the single most common reason a PAN photo bounces.",
  },
  {
    q: "Do all three accept a phone photo?",
    a: "Yes, provided it meets the spec: plain white background, front-facing colour, good even light, and compressed to the portal's KB limit. Take it against a bright white wall, crop to the right proportions, and resize to under 30 KB to be safe across all three. Grainy low-light shots are rejected.",
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
    <BlogPostLayout
      slug={post.slug}
      faqItems={FAQ_ITEMS}
      ctaHref="/tools/resize-kb/"
      ctaLabel="Resize any ID photo to KB"
    >
      <p>
        Three of the IDs in your wallet — PAN, voter ID and driving licence — all
        want a photo that <em>looks</em> identical: a recent, front-facing colour
        headshot on a plain white background. So people assume one photo covers all
        three. It doesn&apos;t. The upload rules diverge enough that a file accepted
        by one portal is rejected instantly by another.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">
          The short version — three real differences
        </p>
        <ul className="!mt-2 text-[15px]">
          <li>
            <strong>File-size cap:</strong> 30&nbsp;KB (PAN/UTIITSL) up to
            200&nbsp;KB (voter ID) — a <strong>6.7×</strong> spread.
          </li>
          <li>
            <strong>Crop shape:</strong> only <strong>PAN via UTIITSL</strong> needs
            a square; the rest are portrait rectangles.
          </li>
          <li>
            <strong>Pixel size:</strong> each portal sets its own minimum, from
            197×276&nbsp;px to 213×213&nbsp;px square.
          </li>
        </ul>
      </div>

      <h2>PAN vs Voter ID vs Driving Licence — side by side</h2>

      <p>
        Here is the 2026 photo spec for each, drawn from the respective government
        portal — confirm the current figure on the linked source before you apply.
        The KB limit is the number that rejects most uploads, so it is listed first.
      </p>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Document</th>
            <th className="py-2 pr-4 font-semibold text-ink">Portal</th>
            <th className="py-2 pr-4 font-semibold text-ink">Max file size</th>
            <th className="py-2 pr-4 font-semibold text-ink">Pixel size</th>
            <th className="py-2 font-semibold text-ink">Crop</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["PAN (UTIITSL)", "myutiitsl.com", "30 KB", "213×213 px", "Square"],
            ["Driving Licence", "sarathi.parivahan.gov.in", "40 KB", "≥200×230 px", "Portrait"],
            ["PAN (NSDL / Protean)", "onlineservices.proteantech.in", "50 KB", "197×276 px", "Portrait"],
            ["Voter ID (EPIC)", "voters.eci.gov.in", "200 KB", "≥200×240 px", "Portrait"],
          ].map(([doc, portal, kb, px, crop]) => (
            <tr key={doc} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{doc}</td>
              <td className="py-2 pr-4 text-[13px]">{portal}</td>
              <td className="py-2 pr-4">{kb}</td>
              <td className="py-2 pr-4">{px}</td>
              <td className="py-2">{crop}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        All four rows want JPEG, a colour photo and a plain white background — those
        never differ. What differs is the machine-enforced part: file size, pixels
        and crop. (PAN appears twice because it has two portals with different rules;{" "}
        <Link href="/blog/pan-card-photo-size/" className="text-brand underline">
          the PAN card photo size guide
        </Link>{" "}
        covers both.)
      </p>

      <h2>Difference 1: the file-size cap swings 6.7×</h2>

      <p>
        This is the difference that catches everyone. The voter ID portal accepts up
        to <strong>200&nbsp;KB</strong>; PAN via UTIITSL caps at <strong>30&nbsp;KB</strong>
        — the same photo needs to be almost seven times smaller for one than the
        other. A crisp phone photo saved for your voter ID application is usually
        120–180&nbsp;KB, so it sails through NVSP but is rejected on size by every
        other portal here.
      </p>

      {/* CHART: KB cap comparison across the three IDs */}
      <figure className="my-8">
        <svg
          viewBox="0 0 560 220"
          style={{ maxWidth: "100%", height: "auto", fontFamily: "'Inter', system-ui, sans-serif" }}
          role="img"
          aria-label="Bar chart of the photo file-size cap for each portal: PAN UTIITSL 30 KB, driving licence 40 KB, PAN NSDL 50 KB, voter ID 200 KB"
        >
          <title>Photo file-size cap: PAN vs Voter ID vs Driving Licence</title>
          <desc>
            PAN via UTIITSL caps at 30 KB, the driving licence (Sarathi) at 40 KB,
            PAN via NSDL at 50 KB, and voter ID (NVSP) at 200 KB. Compressing under
            30 KB clears all of them. Source: respective government portals, 2026.
          </desc>
          {(() => {
            const data = [
              ["PAN — UTIITSL", 30, "#f97316"],
              ["Driving Licence", 40, "#38bdf8"],
              ["PAN — NSDL", 50, "#a78bfa"],
              ["Voter ID (EPIC)", 200, "#22c55e"],
            ] as const;
            const x0 = 140;
            const max = 200;
            const barW = 380;
            return data.map(([label, kb, color], i) => {
              const y = 22 + i * 46;
              const w = (kb / max) * barW;
              return (
                <g key={label}>
                  <text x={x0 - 10} y={y + 15} textAnchor="end" fontSize="12" fill="currentColor" opacity="0.8">
                    {label}
                  </text>
                  <rect x={x0} y={y} width={w} height="22" rx="3" fill={color} />
                  <text x={x0 + w + 6} y={y + 16} fontSize="11" fill="currentColor" opacity="0.7" fontWeight="600">
                    {kb} KB
                  </text>
                </g>
              );
            });
          })()}
          <text x="280" y="212" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.35">
            Source: UTIITSL, Sarathi, NSDL &amp; NVSP portals (2026)
          </text>
        </svg>
      </figure>

      <h2>Difference 2: only PAN (UTIITSL) is square</h2>

      <p>
        Voter ID, driving licence and PAN-via-NSDL all use a{" "}
        <strong>portrait rectangle</strong>. PAN via UTIITSL is the outlier: a{" "}
        <strong>square 213×213&nbsp;px</strong> crop. Upload a portrait photo to
        UTIITSL without squaring it and the portal either rejects it or crops your
        face off-centre — the single most common reason a PAN photo bounces. If you
        apply for PAN through NSDL instead, the portrait crop is fine.
      </p>

      <h2>Difference 3: the pixel minimums differ too</h2>

      <p>
        Each portal sets its own minimum resolution: 197×276&nbsp;px for NSDL PAN,
        213×213&nbsp;px square for UTIITSL PAN, at least 200×230&nbsp;px for the
        driving licence, and at least 200×240&nbsp;px for voter ID. These are
        minimums, so a slightly larger photo is fine — but going below them makes the
        photo look blocky and can trip an automated resolution check.
      </p>

      <h2>So can one photo cover all three?</h2>

      <p>
        Yes — if you prepare it to the <strong>strictest</strong> common spec rather
        than the loosest. A colour JPEG on a plain white background, roughly
        200×250&nbsp;px portrait, compressed to <strong>under 30&nbsp;KB</strong>,
        satisfies the KB cap and pixel minimum of all three. The only extra you need
        is a square 213×213&nbsp;px version if you use UTIITSL for PAN.
      </p>

      <p>
        The{" "}
        <Link href="/tools/resize-kb/" className="text-brand underline">
          compress-to-KB tool
        </Link>{" "}
        brings any photo under a chosen KB size in your browser, and each ID has a
        dedicated resizer that hits its exact spec:{" "}
        <Link href="/exam-requirements/pan/" className="text-brand underline">
          PAN
        </Link>
        ,{" "}
        <Link href="/exam-requirements/voter-id/" className="text-brand underline">
          voter ID
        </Link>{" "}
        and{" "}
        <Link href="/exam-requirements/driving-licence/" className="text-brand underline">
          driving licence
        </Link>{" "}
        — nothing is uploaded to a server.
      </p>

      <p>
        For the full spec of every Indian government ID photo — including where
        Aadhaar differs (its photo is taken at a centre, not uploaded) — see the{" "}
        <Link href="/blog/indian-government-id-photo-requirements/" className="text-brand underline">
          Indian government ID photo requirements guide
        </Link>
        .
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
