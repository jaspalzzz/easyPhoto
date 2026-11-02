import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("indian-government-id-photo-requirements")!;

const FAQ_ITEMS = [
  {
    q: "Which Indian government portal has the strictest photo size limit?",
    a: "Sarathi (driving licence) and Protean (PAN) both stop at 20 KB, and Sarathi also wants at least 10 KB. Voter ID sits at the other end, allowing files up to 2 MB.",
  },
  {
    q: "What file format do Indian government ID applications need?",
    a: "JPG (JPEG) for all three upload forms: PAN and Sarathi say so in their instructions, and the voter ID photo box accepts .jpg and .jpeg. Aadhaar photos are taken at a centre, so there is no file.",
  },
  {
    q: "Why is only the PAN photo square?",
    a: "Only UTIITSL's PAN route asks for a square 213×213 px photo, and it gives no reason. Protean's PAN route, the voter ID form and Sarathi all use portrait shapes, so the UTIITSL file is the only one you need to square.",
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
        Most Indian adults hold four government photo IDs: a PAN card, a voter ID
        (EPIC), an Aadhaar and a driving licence. Each is applied for on a
        different portal, and each sets its own file size, pixel size and crop
        shape. One photo file rarely suits all of them, so this guide sets the
        rules side by side and shows how to make a file for each.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>Start from one recent <strong>colour photo on a plain white background</strong>.</li>
          <li>Make a separate JPG for each portal from that original: up to 2&nbsp;MB for voter ID, 10–20&nbsp;KB at 420×525&nbsp;px for a driving licence, and under 20&nbsp;KB (Protean) or under 30&nbsp;KB and square (UTIITSL) for PAN.</li>
          <li>Aadhaar has no file: the photo is taken at an Aadhaar Seva Kendra.</li>
        </ul>
      </div>

      <h2>Indian government ID photo rules side by side</h2>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Document</th>
            <th className="py-2 pr-4 font-semibold text-ink">Portal</th>
            <th className="py-2 pr-4 font-semibold text-ink">Max file size</th>
            <th className="py-2 pr-4 font-semibold text-ink">Pixel size</th>
            <th className="py-2 font-semibold text-ink">Format</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["Voter ID (Form 6)", "voters.eci.gov.in", "2 MB", "None set; print is 4.5×3.5 cm", "JPG / JPEG"],
            ["PAN (NSDL / Protean)", "onlineservices.proteantech.in", "20 KB", "About 197×276 px (3.5×2.5 cm at 200 DPI)", "JPEG"],
            ["PAN (UTIITSL)", "myutiitsl.com", "Under 30 KB", "213×213 px (square)", "JPEG"],
            ["Driving Licence", "sarathi.parivahan.gov.in", "10–20 KB", "420×525 px preferred", "JPG"],
            ["Aadhaar (photo)", "Aadhaar Seva Kendra — in person", "No online upload", "Taken at the centre", "—"],
          ].map(([doc, portal, kb, px, fmt]) => (
            <tr key={doc} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{doc}</td>
              <td className="py-2 pr-4 text-[14px]">{portal}</td>
              <td className="py-2 pr-4">{kb}</td>
              <td className="py-2 pr-4">{px}</td>
              <td className="py-2">{fmt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-sm text-ink-soft">
        Sources:{" "}
        <a href="https://voters.eci.gov.in/guidelines/Form-6_en.pdf" target="_blank" rel="noopener noreferrer" className="text-brand underline">ECI Form 6 guidance</a>{" "}
        and the Form 6 upload box,{" "}
        <a href="https://tin.tin.proteantech.in/pan/InstructionDSC.html" target="_blank" rel="noopener noreferrer" className="text-brand underline">Protean PAN instructions</a>,{" "}
        <a href="https://www.myutiitsl.com/panonlineservices/scanSpecification.html" target="_blank" rel="noopener noreferrer" className="text-brand underline">UTIITSL scanning page</a>,{" "}
        <a href="https://sarathi.parivahan.gov.in/sarathiservice/pdf/PhotoSign.pdf" target="_blank" rel="noopener noreferrer" className="text-brand underline">Sarathi scan guide</a>.
      </p>

      <h2>Why one file doesn&apos;t fit every ID</h2>

      <p>
        The file-size limits sit far apart. Sarathi wants a licence photo of{" "}
        <strong>10 to 20&nbsp;KB</strong>, while voter ID allows up to{" "}
        <strong>2&nbsp;MB</strong>, a hundred times more, so a sharp voter ID file
        of a few hundred KB is refused by Sarathi on size alone. The shapes differ
        too: UTIITSL&apos;s PAN photo is square, while Protean, Form 6 and Sarathi
        are portrait.
      </p>

      <p>
        Keep the original photo untouched and make each file from it, rather than
        from a copy you already compressed. Start with the voter ID file, which
        needs the least shrinking. Every round of compression costs detail, and
        the 20&nbsp;KB files for PAN and the licence are where a soft face shows
        most.
      </p>

      <h2>Notes for each ID</h2>

      <p>
        <strong>PAN</strong> has two portals that disagree on the crop: a portrait
        file for Protean and a square one for UTIITSL. The{" "}
        <Link href="/blog/pan-card-photo-size/" className="text-brand underline">
          PAN card photo size guide
        </Link>{" "}
        covers both, with the signature sizes.
      </p>

      <p>
        <strong>Voter ID</strong>: Form 6 asks for an unsigned colour photo,
        4.5&nbsp;cm high and 3.5&nbsp;cm wide, on white, with both eyes open and
        both edges of the face visible. The{" "}
        <Link href="/blog/voter-id-photo-requirements-2026/" className="text-brand underline">
          voter ID photo guide
        </Link>{" "}
        explains the upload box and the common refusals.
      </p>

      <p>
        <strong>Driving licence</strong>: Sarathi also wants a 10–20&nbsp;KB
        signature at 256×64&nbsp;px, signed in black pen on white paper, and a
        light-coloured, preferably white background behind the photo. The{" "}
        <Link href="/blog/driving-licence-photo-size-sarathi/" className="text-brand underline">
          Sarathi photo guide
        </Link>{" "}
        walks through both files.
      </p>

      <p>
        <strong>Aadhaar</strong>: the photograph cannot be updated online. UIDAI
        takes it in person at an{" "}
        <a
          href="https://uidai.gov.in/en/updating-data-on-aadhaar"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          Aadhaar Seva Kendra
        </a>{" "}
        or an authorised enrolment centre. The{" "}
        <a
          href="https://myaadhaar.uidai.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          myAadhaar
        </a>{" "}
        portal lets you update your name, address, date of birth, gender and
        language online, but the photograph, fingerprints, iris and mobile number
        need a centre visit. Before you share a copy of the card,{" "}
        <Link href="/blog/how-to-mask-aadhaar-before-sharing/" className="text-brand underline">
          mask the first eight digits
        </Link>
        , as UIDAI recommends.
      </p>

      <h2>How to make each file</h2>

      <ol className="my-4 space-y-3 text-[15px]">
        <li>
          <strong>Take one good photo:</strong> stand against a plain white wall
          in soft daylight, phone at eye level, neutral expression, eyes open, no
          sunglasses or cap. If the wall isn&apos;t clean, the{" "}
          <Link href="/tools/background-removal/" className="text-brand underline">
            background removal tool
          </Link>{" "}
          swaps it for white in your browser.
        </li>
        <li>
          <strong>Use each portal&apos;s resizer:</strong> the{" "}
          <Link href="/exam-requirements/voter-id/" className="text-brand underline">voter ID</Link>,{" "}
          <Link href="/exam-requirements/pan/" className="text-brand underline">PAN (Protean)</Link>{" "}
          and{" "}
          <Link href="/exam-requirements/driving-licence/" className="text-brand underline">driving licence</Link>{" "}
          pages each crop and compress to their own portal&apos;s sizes. For
          UTIITSL, crop the photo square to 213×213&nbsp;px and keep it under
          30&nbsp;KB with the{" "}
          <Link href="/tools/resize-kb/" className="text-brand underline">KB resizer</Link>.
        </li>
        <li>
          <strong>Check the file before you upload:</strong> confirm its size,
          format and pixel size in the file&apos;s details, or with the{" "}
          <Link href="/tools/compliance-checker/" className="text-brand underline">
            photo check
          </Link>
          .
        </li>
      </ol>

      <h2>Common upload problems</h2>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Problem</th>
            <th className="py-2 font-semibold text-ink">Fix</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["File over the KB limit", "Compress to the limit for that portal from the table above"],
            ["PNG, PDF, WEBP or HEIC file", "Convert to JPEG before uploading"],
            ["Black-and-white photo", "Use a colour photo; both PAN routes and Sarathi ask for colour"],
            ["Dark or patterned background", "Shoot against plain white or use background removal"],
            ["Portrait photo for UTIITSL", "Square it to 213×213 px"],
            ["Blurry face in a 20 KB file", "Start again from the original photo rather than a compressed copy"],
          ].map(([reason, fix]) => (
            <tr key={reason} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{reason}</td>
              <td className="py-2">{fix}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        For a passport, see the{" "}
        <Link href="/blog/indian-passport-photo-requirements/" className="text-brand underline">
          Indian passport photo rules
        </Link>
        ; for compressing to a KB limit step by step, see{" "}
        <Link href="/blog/how-to-reduce-passport-photo-size-for-online-forms/" className="text-brand underline">
          how to reduce a photo&apos;s file size
        </Link>
        .
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
