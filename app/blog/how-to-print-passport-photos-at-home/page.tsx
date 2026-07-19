import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("how-to-print-passport-photos-at-home")!;

const FAQ_ITEMS = [
  {
    q: "What size should I print passport photos at home?",
    a: "For an Indian passport applicant below four, the required print is 35×45 mm. Ordinary adult domestic applicants do not carry a photo because it is captured at the PSK/POPSK. Other countries and services use their own print dimensions.",
  },
  {
    q: "Can I print passport photos at home with a normal inkjet printer?",
    a: "Yes, provided you use photo paper (glossy or semi-gloss, 200–250 gsm) and set the printer to photo quality at 300 DPI. Borderless printing gives cleaner edges. Standard plain paper gives washed-out colours that most counters and offices will not accept as a valid passport photo.",
  },
  {
    q: "How many passport photos fit on an A4 sheet?",
    a: "At 35×45 mm per photo with 2 mm margins, you can fit up to 18 photos on one A4 sheet (6 columns × 3 rows). However, most home printers can't print fully to the edge of A4, so a 4×6 grid (12 photos, 3 columns × 4 rows) with margins is more reliable. The print sheet tool offers both A4 and 4×6 inch layouts.",
  },
  {
    q: "Do home-printed passport photos get accepted at the passport office?",
    a: "Do not assume that. Ordinary adult Indian applicants do not submit a print. For a child below four, Passport Seva requires a recent 35×45 mm white-background print, but the application decision cannot be guaranteed from the printer or paper alone. Follow the current minor-photo guidance.",
  },
  {
    q: "What DPI should passport photos be printed at?",
    a: "At 300 DPI, a 35×45 mm layout is about 413×531 pixels. DPI is a print-layout calculation, not a universal acceptance rule; use the resolution and print method stated by the authority handling your document.",
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
        Studio, paper, ink and kiosk prices vary by city and provider. Printing a
        prepared sheet at home or through a local photo service can reduce waste
        because several correctly sized copies share one page. Check the current
        local price before choosing a method. The challenge isn&apos;t the
        purchase; it&apos;s getting the tile layout and
        dimensions exactly right before you send the file to the printer. Here is
        the complete approach.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>
            <strong>Create the sheet:</strong>{" "}
            <Link href="/tools/print-sheet/" className="text-brand underline">
              easyPhoto Print Sheet
            </Link>{" "}
            — tiles your photo at 35×45&nbsp;mm on A4 or 4×6&nbsp;inch at
            300&nbsp;DPI, with cut guides.
          </li>
          <li>
            <strong>Paper:</strong> glossy or semi-gloss photo paper, 200–250&nbsp;gsm.
          </li>
          <li>
            <strong>Printer settings:</strong> photo quality, 300&nbsp;DPI, borderless
            if possible. Disable &ldquo;fit to page&rdquo; scaling.
          </li>
          <li>
            <strong>Cut:</strong> use scissors or a craft knife along the printed
            guide lines. Each 35×45&nbsp;mm photo is ready to use.
          </li>
        </ul>
      </div>

      <h2>When does an Indian passport applicant need a 35×45 mm print?</h2>

      <p>
        Passport Seva requires a{" "}
        <strong>35&nbsp;mm wide × 45&nbsp;mm tall</strong> white-background print
        for a child below four. Ordinary adult fresh/reissue applicants in India
        do not carry a photo; the PSK/POPSK captures it with their biometrics.
        Other Indian documents, exams and foreign visa applications each need
        their own current specification.
      </p>

      <img
        src="https://images.unsplash.com/photo-1606189934390-4e80b9d1e0ea?fm=jpg&q=80&w=1200&h=630&fit=crop"
        alt="Sheet of passport photos printed on glossy photo paper with cut guides — home printing setup"
        className="my-6 w-full rounded-xl object-cover"
        loading="lazy"
        width={1200}
        height={630}
      />

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
            ["PAN Card (physical)", "25×35 mm", "295×413 px"],
            ["Indian exam forms", "Varies by portal", "Use the exam preset; many list KB only"],
            ["US Passport", "51×51 mm (2×2 inch)", "600×600 px"],
            ["UK / Schengen Visa", "35×45 mm", "413×531 px"],
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
        The answer depends on the paper size and margin settings. A 4×6&nbsp;inch
        sheet (the most common photo print size in India) and an A4 sheet both work.
        The{" "}
        <Link href="/tools/print-sheet/" className="text-brand underline">
          print sheet tool
        </Link>{" "}
        auto-calculates the layout and generates a single JPEG at 300&nbsp;DPI
        with faint cut guides — so you don&apos;t have to calculate margins or
        tile the images manually.
      </p>

      {/* CHART: photos per sheet */}
      <figure className="my-8">
        <svg
          viewBox="0 0 560 220"
          style={{ maxWidth: "100%", height: "auto", fontFamily: "'Inter', system-ui, sans-serif" }}
          role="img"
          aria-label="Bar chart: number of 35x45 mm passport photos that fit on common paper sizes. 4x6 inch: 8, A4: up to 18, 5x6 inch: 10"
        >
          <title>Passport photos per sheet by paper size</title>
          <desc>4×6 inch sheet fits 8 photos (2×4 grid). A4 sheet fits up to 18 photos (6×3 grid) with margins. 5×6 inch sheet fits 10 photos (2×5 grid). Source: easyPhoto print calculations at 300 DPI.</desc>

          {[
            { label: "4×6 inch", val: 8, note: "2×4 grid — most reliable", color: "#f97316" },
            { label: "5×6 inch", val: 10, note: "2×5 grid", color: "#38bdf8" },
            { label: "A4", val: 18, note: "6×3 grid with margins", color: "#22c55e" },
          ].map(({ label, val, note, color }, i) => {
            const y = 30 + i * 56;
            const w = (val / 20) * 320;
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
            Source: easyPhoto print layout calculations at 300 DPI, 35×45 mm per photo (2025)
          </text>
        </svg>
      </figure>

      <h2>Step-by-step: print passport photos at home</h2>

      <ol className="my-4 space-y-4 text-[15px]">
        <li>
          <strong>Prepare the photo:</strong> start with a clear photo cropped to
          the listed frame. If you haven&apos;t taken the photo yet, the{" "}
          <Link href="/passport-photo/" className="text-brand underline">
            passport photo maker
          </Link>{" "}
          crops to the correct head-size and background automatically. If you
          already have a photo, the{" "}
          <Link href="/tools/background-removal/" className="text-brand underline">
            background remover
          </Link>{" "}
          can apply a white background first.
        </li>
        <li>
          <strong>Generate the print sheet:</strong> open{" "}
          <Link href="/tools/print-sheet/" className="text-brand underline">
            the print sheet tool
          </Link>
          , upload your photo, select the paper size (A4 or 4×6&nbsp;inch) and
          layout (4 or 6 photos). Download the JPEG — it is sized at exactly
          300&nbsp;DPI for the chosen paper.
        </li>
        <li>
          <strong>Load photo paper:</strong> use glossy or semi-gloss photo paper,
          200–250&nbsp;gsm. Avoid plain A4 paper — the colours appear washed out
          and the surface is too matte for most offices to accept.
        </li>
        <li>
          <strong>Printer settings:</strong> set the media type to &ldquo;Photo
          Paper&rdquo; or &ldquo;Glossy Paper&rdquo;. Set quality to &ldquo;Best&rdquo;
          or &ldquo;High&rdquo;. If your printer supports borderless printing, enable
          it. <strong>Disable &ldquo;fit to page&rdquo; / &ldquo;scale to fit&rdquo;</strong>{" "}
          — this is the most common mistake; scaling shrinks the 35×45&nbsp;mm photos
          to the wrong size.
        </li>
        <li>
          <strong>Print and cut:</strong> print one test page first to confirm colour
          and size. Measure one photo: it should be exactly 35&nbsp;mm wide and
          45&nbsp;mm tall. Cut along the printed guide lines using scissors or a
          craft knife and ruler.
        </li>
      </ol>

      <img
        src="https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?fm=jpg&q=80&w=1200&h=630&fit=crop"
        alt="Inkjet printer producing a colour print — home photo printing setup"
        className="my-6 w-full rounded-xl object-cover"
        loading="lazy"
        width={1200}
        height={630}
      />

      <h2>Common printing mistakes and how to avoid them</h2>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Mistake</th>
            <th className="py-2 font-semibold text-ink">Fix</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ['"Fit to page" is on in the print dialog', 'Set to "Actual size" or "100%" — never scale the sheet or photos will be undersized'],
            ["Plain A4 paper used instead of photo paper", "Use glossy or semi-gloss 200+ gsm — passport offices notice the difference"],
            ["Printer set to draft / economy mode", "Set quality to Best or High for correct colour and sharpness"],
            ["Photo cropped incorrectly before tiling", "Use the passport photo maker first to ensure the head fills 70–80% of the 35×45 mm frame"],
            ["Cut lines off by 1–2 mm", "Use a craft knife + metal ruler for clean cuts; scissors can slip on small formats"],
            ["Background appears off-white when printed", "Calibrate your monitor or add a slight brightness boost in the print settings"],
          ].map(([mistake, fix]) => (
            <tr key={mistake} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{mistake}</td>
              <td className="py-2">{fix}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Are home-printed photos accepted at passport offices?</h2>

      <p>
        An ordinary adult Indian passport applicant does not submit a print. For
        a child below four, the{" "}
        <Link href="/blog/indian-passport-photo-requirements/" className="text-brand underline">
          MEA passport photo guidelines
        </Link>{" "}
        require a recent 35×45 mm white-background photograph and specify its
        composition. Those requirements do not make every home print acceptable
        or guarantee an application outcome. Follow the current guidance and ask
        Passport Seva if the required print method is unclear.
      </p>

      <p>
        Exam workflows differ: IBPS and SBI use prepared photo files, UPSC lists a
        prepared upload plus a live photograph step, and current SSC forms capture
        the photograph live. Check the active notice before printing or preparing a file. The{" "}
        <Link href="/blog/exam-photo-signature-size-guide/" className="text-brand underline">
          exam photo size guide
        </Link>{" "}
        compares the recorded workflows and file requirements side by side.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
