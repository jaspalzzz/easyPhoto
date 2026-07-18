import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("pan-vs-voter-id-vs-driving-licence-photo")!;

const FAQ_ITEMS = [
  {
    q: "Is the PAN, voter ID and driving licence photo the same?",
    a: "No. Each application route has its own instructions. ECI's public Form 6 specifies a 4.5 cm by 3.5 cm colour photo on white but does not publish a universal digital KB, pixel or format rule; PAN and Sarathi publish separate digital guidance for their own workflows.",
  },
  {
    q: "Which of the three has the strictest photo size limit?",
    a: "Do not use one assumed cap across all three. Their application routes publish different instructions, and ECI's public Form 6 does not state a universal digital KB cap. Check the current upload screen for the route you use.",
  },
  {
    q: "Can I use one photo for my PAN card, voter ID and driving licence?",
    a: "Keep a good-quality colour source photo, then prepare a separate export for each application route. Do not assume one KB target, pixel canvas or format covers all three, because ECI's public Form 6 does not publish those digital fields and the PAN and Sarathi workflows use their own instructions.",
  },
  {
    q: "Why is only the PAN photo square?",
    a: "PAN via UTIITSL uses a square 213×213 px crop optimised for face-matching, while NSDL PAN, voter ID and driving licence all use a portrait rectangle. If you upload a portrait photo to UTIITSL without squaring it, the portal rejects it or crops your face off-centre — the single most common reason a PAN photo bounces.",
  },
  {
    q: "Do all three accept a phone photo?",
    a: "The cited guidance describes the resulting photos, not one universal capture-device rule. Start with a clear colour source image, then follow the current application's crop, format and file-size fields instead of using one assumed export for all three.",
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
            <strong>File-size cap:</strong> PAN and Sarathi publish workflow-specific
            limits; public Form 6 does not publish a universal Voter ID digital cap.
          </li>
          <li>
            <strong>Crop shape:</strong> only <strong>PAN via UTIITSL</strong> needs
            a square; the rest are portrait rectangles.
          </li>
          <li>
            <strong>Pixel size:</strong> do not assign one to Voter ID from Form 6;
            it publishes a physical 4.5&nbsp;cm × 3.5&nbsp;cm photo instead.
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
            ["Driving Licence", "sarathi.parivahan.gov.in", "10–20 KB", "420×525 px preferred", "Portrait"],
            ["PAN (NSDL / Protean)", "onlineservices.proteantech.in", "50 KB", "197×276 px", "Portrait"],
            ["Voter ID (Form 6)", "voters.eci.gov.in", "Not publicly specified", "4.5×3.5 cm physical", "Portrait"],
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
        The public Voter ID guidance confirms a colour photo and white background but
        does not publish the digital format or file-size rule. The PAN and Sarathi rows
        describe their separate digital workflows. (PAN appears twice because it has
        two portals with different rules;{" "}
        <Link href="/blog/pan-card-photo-size/" className="text-brand underline">
          the PAN card photo size guide
        </Link>{" "}
        covers both.)
      </p>

      <h2>Difference 1: no universal Voter ID digital cap is published</h2>

      <p>
        ECI&apos;s public Form 6 instructions state the physical size and visible photo
        qualities, but not a digital KB window. A numeric Voter ID comparison would
        turn a compatibility target into an ECI rule. Check the current upload screen;
        do not carry a PAN or Sarathi cap across to it.
      </p>

      <div className="my-8 rounded-xl border border-hairline bg-paper p-5 text-sm leading-relaxed text-ink-soft">
        Source boundary: the public ECI Form 6 guidance confirms 4.5&nbsp;cm high by
        3.5&nbsp;cm wide, white background, open eyes and both face edges visible.
        It does not support a Voter ID digital KB or pixel comparison.
      </div>

      <h2>Difference 2: only PAN (UTIITSL) is square</h2>

      <p>
        Form 6 and the Sarathi photo guidance use portrait physical proportions.
        PAN via UTIITSL is the outlier in this comparison: a{" "}
        <strong>square 213×213&nbsp;px</strong> crop. Upload a portrait photo to
        UTIITSL without squaring it and the portal either rejects it or crops your
        face off-centre — the single most common reason a PAN photo bounces. If you
        apply for PAN through NSDL instead, the portrait crop is fine.
      </p>

      <h2>Difference 3: the pixel minimums differ too</h2>

      <p>
        The cited PAN routes publish their own pixel guidance, and Sarathi prefers
        420×525&nbsp;px. Public Form 6 does not publish Voter ID pixel dimensions, so
        the current online form is the place to confirm any digital canvas it enforces.
      </p>

      <h2>So can one photo cover all three?</h2>

      <p>
        Keep one clear source photo, but prepare separate exports. That avoids claiming
        that a PAN or Sarathi digital target is also an ECI rule and lets you follow the
        current fields shown by each application route.
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
