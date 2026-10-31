import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("pan-vs-voter-id-vs-driving-licence-photo")!;

const FAQ_ITEMS = [
  {
    q: "Is the PAN, voter ID and driving licence photo the same?",
    a: "No. Each application route has its own instructions. Form 6 wants a 4.5 cm by 3.5 cm colour photo on white and lets the file be as large as 2 MB, while PAN and Sarathi each set far tighter limits of their own.",
  },
  {
    q: "Which of the three has the strictest photo size limit?",
    a: "The driving licence and PAN via Protean: Sarathi takes a photo of 10–20 KB and Protean caps the PAN photo at 20 KB. UTIITSL allows up to 30 KB, and the Voter ID portal accepts up to 2 MB.",
  },
  {
    q: "Can I use one photo for my PAN card, voter ID and driving licence?",
    a: "Keep a good-quality colour source photo, then prepare a separate export for each application route. Do not assume one KB target or crop covers all three: a Voter ID file is usually far too heavy for the licence portal, and PAN via UTIITSL needs a square.",
  },
  {
    q: "Why is only the PAN photo square?",
    a: "UTIITSL's scanning page asks for a square 213×213 px PAN photo and gives no reason. Protean's PAN route, Voter ID and the driving licence all use portrait shapes, so the UTIITSL file is the only one you need to square.",
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
            <strong>File-size cap:</strong> PAN and the driving licence allow tens of
            KB; the Voter ID portal allows up to 2&nbsp;MB.
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
            ["PAN (UTIITSL)", "myutiitsl.com", "Below 30 KB", "213×213 px", "Square"],
            ["Driving Licence", "sarathi.parivahan.gov.in", "10–20 KB", "420×525 px preferred", "Portrait"],
            ["PAN (NSDL / Protean)", "onlineservices.proteantech.in", "20 KB max", "Roughly 197×276 px", "Portrait"],
            ["Voter ID (Form 6)", "voters.eci.gov.in", "2 MB", "No pixel rule (paper size 4.5×3.5 cm)", "Portrait"],
          ].map(([doc, portal, kb, px, crop]) => (
            <tr key={doc} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{doc}</td>
              <td className="py-2 pr-4 text-[14px]">{portal}</td>
              <td className="py-2 pr-4">{kb}</td>
              <td className="py-2 pr-4">{px}</td>
              <td className="py-2">{crop}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        Voter ID&apos;s 2&nbsp;MB is printed next to the photo box on the online Form 6.
        The PAN and Sarathi rows describe their own workflows. (PAN appears twice because it has
        two portals with different rules;{" "}
        <Link href="/blog/pan-card-photo-size/" className="text-brand underline">
          the PAN card photo size guide
        </Link>{" "}
        covers both.)
      </p>

      <h2>Difference 1: the file-size limits are far apart</h2>

      <p>
        Sarathi refuses a photo over 20&nbsp;KB; Voter ID takes one a hundred times that
        size. Reusing the Voter ID file for the licence therefore fails almost every time.
      </p>

      <p>
        In practice, start from the same original photo for each card. For Voter ID you
        can leave it large and sharp. For the licence, it has to come down to
        420&nbsp;×&nbsp;525 pixels and under 20&nbsp;KB, which the{" "}
        <Link href="/exam-requirements/driving-licence/" className="text-brand underline">
          driving licence resizer
        </Link>{" "}
        does in one step. For PAN, choose your route first, because NSDL and UTIITSL crop
        differently.
      </p>

      <div className="my-8 rounded-xl border border-hairline bg-paper p-5 text-sm leading-relaxed text-ink-soft">
        The Voter ID rules here (the 4.5&nbsp;×&nbsp;3.5&nbsp;cm white-background photo and
        the 2&nbsp;MB file) were read from the Election Commission&apos;s Form&nbsp;6 notes and
        its online form on 13 Oct 2026. The PAN figures were taken from{" "}
        <a
          href="https://tin.tin.proteantech.in/pan/InstructionDSC.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          Protean&apos;s application instructions
        </a>{" "}
        and the{" "}
        <a
          href="https://www.myutiitsl.com/panonlineservices/scanSpecification.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          UTIITSL scanning specification
        </a>{" "}
        on 31 October 2026.
      </div>

      <h2>Difference 2: only PAN (UTIITSL) is square</h2>

      <p>
        Form 6 and the Sarathi photo guidance use portrait physical proportions.
        PAN via UTIITSL is the outlier in this comparison: a{" "}
        <strong>square 213×213&nbsp;px</strong> crop. UTIITSL publishes the square
        size without saying why, so square the photo before you upload it there. If
        you apply for PAN through NSDL (Protean) instead, the portrait crop is fine.
      </p>

      <h2>Difference 3: the pixel minimums differ too</h2>

      <p>
        UTIITSL gives 213×213&nbsp;px, Protean gives centimetres and 200&nbsp;DPI,
        which works out near 197×276&nbsp;px, and Sarathi prefers 420×525&nbsp;px. Voter ID has no pixel rule of any kind.
      </p>

      <h2>So can one photo cover all three?</h2>

      <p>
        Keep one clear source photo, but prepare separate exports. Each portal checks
        its own size and crop, and they rarely agree.
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
