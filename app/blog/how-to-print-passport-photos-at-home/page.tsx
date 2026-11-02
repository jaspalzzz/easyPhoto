import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("how-to-print-passport-photos-at-home")!;

const FAQ_ITEMS = [
  {
    q: "Can I print passport photos at home with a normal inkjet printer?",
    a: "Yes, provided you use glossy or semi-gloss photo paper (200–250 gsm) and set the printer to photo quality. Plain paper gives washed-out colours and a matte surface, so it is a poor choice for an ID photo.",
  },
  {
    q: "How many passport photos fit on an A4 sheet?",
    a: "Thirty 35×45 mm photos fit on A4 (5 across, 6 down) with the print sheet tool's 4 mm page margin and 3 mm gap. A 4×6 inch sheet takes six and a 5×6 inch sheet nine.",
  },
  {
    q: "Will a home-printed photo be accepted?",
    a: "That is the authority's decision, and some won't take one: Canada's printed passport photo must come from a commercial photographer. For India, only a passport applicant below four needs a print at all, and it must meet Passport Seva's 35×45 mm white-background rules.",
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
      ctaHref="/tools/print-sheet/"
      ctaLabel="Create a print-ready photo sheet free"
    >
      <p>
        Printing passport photos at home, or sending one sheet to a local photo
        kiosk, works well when several correctly sized copies share one page.
        The hard part isn&apos;t the printer; it&apos;s keeping every photo at
        its real size from the file to the paper. Here is the whole process.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>
            <strong>Make the sheet:</strong>{" "}
            <Link href="/tools/print-sheet/" className="text-brand underline">
              easyPhoto Print Sheet
            </Link>{" "}
            tiles your photo at its real size on A4 or a 4×6&nbsp;inch sheet at
            300&nbsp;DPI, with cut guides.
          </li>
          <li>
            <strong>Paper:</strong> glossy or semi-gloss photo paper, 200–250&nbsp;gsm.
          </li>
          <li>
            <strong>Printer:</strong> photo quality, and &ldquo;fit to page&rdquo;
            switched off.
          </li>
          <li>
            <strong>Cut</strong> along the printed guides with a craft knife and ruler.
          </li>
        </ul>
      </div>

      <h2>Which print size do you need?</h2>

      <p>
        For an Indian passport, only an applicant below four needs a print:
        35&nbsp;mm wide × 45&nbsp;mm tall on white (see the{" "}
        <Link href="/blog/indian-passport-photo-requirements/" className="text-brand underline">
          Indian passport photo rules
        </Link>
        ). Other documents use their own sizes:
      </p>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Document</th>
            <th className="py-2 pr-4 font-semibold text-ink">Print size</th>
            <th className="py-2 font-semibold text-ink">At 300 DPI</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["Indian passport — child below four", "35×45 mm", "413×531 px"],
            ["PAN card (paper form)", "25×35 mm", "295×413 px"],
            ["US passport", "51×51 mm (2×2 inch)", "600×600 px"],
            ["UK passport, Schengen visa", "35×45 mm", "413×531 px"],
          ].map(([doc, size, px]) => (
            <tr key={doc} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{doc}</td>
              <td className="py-2 pr-4">{size}</td>
              <td className="py-2">{px}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>How many photos fit on a sheet?</h2>

      <p>
        With the{" "}
        <Link href="/tools/print-sheet/" className="text-brand underline">
          print sheet tool
        </Link>
        &apos;s 4&nbsp;mm page margin and 3&nbsp;mm gap between photos, these are
        the most 35×45&nbsp;mm photos each paper takes. You can also ask for 4,
        6 or 8 copies, and download the sheet as a JPG or a PDF.
      </p>

      {/* CHART: photos per sheet, computed from lib/printSheet.ts defaults */}
      <figure className="my-8">
        <svg
          viewBox="0 0 560 220"
          style={{ maxWidth: "100%", height: "auto", fontFamily: "'Inter', system-ui, sans-serif" }}
          role="img"
          aria-label="Bar chart: number of 35x45 mm passport photos that fit on common paper sizes. 4x6 inch: 6, 5x6 inch: 9, A4: 30"
        >
          <title>Passport photos per sheet by paper size</title>
          <desc>A 4×6 inch sheet fits 6 photos, a 5×6 inch sheet 9, and an A4 sheet 30, at 35×45 mm each with a 4 mm margin and 3 mm gap.</desc>

          {[
            { label: "4×6 inch", val: 6, note: "3 × 2 grid", color: "#f97316" },
            { label: "5×6 inch", val: 9, note: "3 × 3 grid", color: "#38bdf8" },
            { label: "A4", val: 30, note: "5 × 6 grid", color: "#22c55e" },
          ].map(({ label, val, note, color }, i) => {
            const y = 30 + i * 56;
            const w = (val / 32) * 320;
            return (
              <g key={label}>
                <text x="100" y={y + 14} textAnchor="end" fontSize="12" fill="currentColor" opacity="0.8" fontWeight="600">{label}</text>
                <text x="100" y={y + 28} textAnchor="end" fontSize="10" fill="currentColor" opacity="0.45">{note}</text>
                <rect x="108" y={y} width={w} height="26" rx="4" fill={color} />
                <text x={108 + w + 8} y={y + 18} fontSize="13" fill="currentColor" opacity="0.9" fontWeight="700">{val} photos</text>
              </g>
            );
          })}

          <text x="280" y="208" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.35">
            35×45 mm photos, 4 mm page margin, 3 mm gap
          </text>
        </svg>
      </figure>

      <h2>Step-by-step: print passport photos at home</h2>

      <ol className="my-4 space-y-4 text-[15px]">
        <li>
          <strong>Prepare the photo:</strong> the{" "}
          <Link href="/passport-photo/" className="text-brand underline">
            passport photo maker
          </Link>{" "}
          crops to the right head size and background for your country. If you
          only need a white background, the{" "}
          <Link href="/tools/background-removal/" className="text-brand underline">
            background remover
          </Link>{" "}
          can apply one.
        </li>
        <li>
          <strong>Make the sheet:</strong> in{" "}
          <Link href="/tools/print-sheet/" className="text-brand underline">
            the print sheet tool
          </Link>
          , upload the photo, pick the paper size and the number of copies, and
          download the JPG or PDF.
        </li>
        <li>
          <strong>Load photo paper:</strong> glossy or semi-gloss, 200–250&nbsp;gsm.
          Plain paper gives washed-out colours.
        </li>
        <li>
          <strong>Printer settings:</strong> set the media type to &ldquo;Photo
          Paper&rdquo; or &ldquo;Glossy Paper&rdquo; and quality to &ldquo;Best&rdquo;
          or &ldquo;High&rdquo;. <strong>Switch off &ldquo;fit to page&rdquo; /
          &ldquo;scale to fit&rdquo;</strong> and print at &ldquo;Actual size&rdquo;
          or 100%; scaling shrinks every photo.
        </li>
        <li>
          <strong>Test, then cut:</strong> print one page and measure one photo:
          it should be exactly 35&nbsp;mm wide and 45&nbsp;mm tall. Then cut
          along the guides with a craft knife and a metal ruler; scissors slip on
          small formats.
        </li>
      </ol>

      <h2>If the print comes out wrong</h2>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Problem</th>
            <th className="py-2 font-semibold text-ink">Fix</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["Photos measure smaller than 35×45 mm", "\"Fit to page\" was on. Print again at \"Actual size\" or 100%."],
            ["Colours look dull or grainy", "Use photo paper and set the printer to Best or High rather than draft or economy."],
            ["Head looks too big or small in the frame", "Crop with the passport photo maker for your country before making the sheet."],
            ["White background prints slightly grey", "Raise the brightness a little in the printer dialog, or print at a photo kiosk."],
          ].map(([mistake, fix]) => (
            <tr key={mistake} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{mistake}</td>
              <td className="py-2">{fix}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
