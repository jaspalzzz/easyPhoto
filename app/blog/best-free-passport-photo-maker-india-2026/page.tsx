import Link from "next/link";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { pageMetadata } from "@/lib/seo";
import { getPost } from "@/lib/blog";

const post = getPost("best-free-passport-photo-maker-india-2026")!;

export const metadata = pageMetadata({
  title: post.title,
  titleAbsolute: true,
  description: post.description,
  path: `/blog/${post.slug}/`,
  type: "article",
});

export default function Page() {
  return (
    <BlogPostLayout slug="best-free-passport-photo-maker-india-2026">
      <p>
        Most online passport photo tools have at least one of three problems: they charge for the
        download, they upload your face photo to a remote server, or they default to the US
        2×2 inch size when India&apos;s print is 35×45 mm. Here are the main options compared on
        what matters for an Indian applicant: cost, privacy, and whether they cover India&apos;s
        sizes and exam forms.
      </p>

      <p>
        <strong>Transparency:</strong> We built easyPhoto, so we&apos;re not neutral. What we say
        about other tools comes from their own websites, pricing pages and terms of service, which
        can change; check them before you pay. Where another tool does something better, we say so.
      </p>

      <figure className="my-7 overflow-hidden rounded-xl border border-hairline">
        <svg
          viewBox="0 0 760 300"
          style={{ maxWidth: "100%", height: "auto", fontFamily: "'Inter', system-ui, sans-serif", display: "block" }}
          role="img"
          aria-label="Comparison chart: paid or server-based online photo tools vs a free on-device tool — cost, privacy, India sizes"
        >
          <title>Passport photo maker comparison — paid or server-based tools vs a free on-device tool</title>
          <rect width="760" height="300" fill="#f9f8f6" />
          {/* Left: Paid/Studio */}
          <rect x="20" y="20" width="330" height="260" rx="8" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
          <rect x="20" y="20" width="330" height="44" rx="8" fill="#6b7280" />
          <rect x="20" y="50" width="330" height="14" fill="#6b7280" />
          <text x="185" y="47" textAnchor="middle" fontSize="13" fontWeight="700" fill="white">Paid or server-based online tool</text>
          {/* Studio photo icon */}
          <rect x="60" y="78" width="54" height="70" rx="4" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
          <circle cx="87" cy="103" r="14" fill="#d1d5db" />
          <path d="M67 148 Q87 130 107 148" fill="#d1d5db" />
          <text x="87" y="165" textAnchor="middle" fontSize="10" fill="#6b7280">35×45 mm</text>
          {/* Cons list */}
          {[
            ["✗ Often paid after a free allowance", "#dc2626"],
            ["✗ Uploads your photo to a server", "#dc2626"],
            ["✗ May default to the US 2×2 size", "#dc2626"],
            ["✗ No exam KB sizes", "#dc2626"],
            ["✗ A redo can cost again", "#dc2626"],
          ].map(([text, color], i) => (
            <text key={i} x="130" y={90 + i * 34} fontSize="12" fill={color} fontWeight="500">{text}</text>
          ))}
          {/* Right: easyPhoto */}
          <rect x="410" y="20" width="330" height="260" rx="8" fill="white" stroke="#163A6B" strokeWidth="2" />
          <rect x="410" y="20" width="330" height="44" rx="8" fill="#163A6B" />
          <rect x="410" y="50" width="330" height="14" fill="#163A6B" />
          <text x="575" y="47" textAnchor="middle" fontSize="13" fontWeight="700" fill="white">easyPhoto — Free &amp; On-Device</text>
          {/* easyPhoto icon */}
          <rect x="450" y="78" width="54" height="70" rx="4" fill="#eff6ff" stroke="#163A6B" strokeWidth="1.5" />
          <circle cx="477" cy="103" r="14" fill="#bfdbfe" />
          <path d="M457 148 Q477 130 497 148" fill="#93c5fd" />
          <text x="477" y="165" textAnchor="middle" fontSize="10" fill="#163A6B">35×45 mm</text>
          {/* Pros list */}
          {[
            ["✓ Completely free, no sign-up", "#15803d"],
            ["✓ On-device — nothing uploaded", "#15803d"],
            ["✓ 35×45 mm under-four print", "#15803d"],
            ["✓ KB sizes for SSC, IBPS, UPSC", "#15803d"],
            ["✓ Instant re-crop, any time", "#15803d"],
          ].map(([text, color], i) => (
            <text key={i} x="520" y={90 + i * 34} fontSize="12" fill={color} fontWeight="500">{text}</text>
          ))}
          {/* VS badge */}
          <circle cx="380" cy="150" r="22" fill="#F4C63F" />
          <text x="380" y="155" textAnchor="middle" fontSize="14" fontWeight="800" fill="#163A6B">VS</text>
        </svg>
        <figcaption className="bg-accent/30 px-4 py-2.5 text-center text-[12px] text-muted-foreground">
          Paid or server-based online tools compared with a free on-device maker on cost, privacy and India sizes.
        </figcaption>
      </figure>

      <h2>Do you need a photo tool at all?</h2>

      <p>
        For an adult applying for an Indian passport in India, no: the photo is
        taken at the passport centre. A photo tool matters for a child below four,
        who needs a <strong>35×45 mm colour print on white</strong>, for OCI and
        e-Visa uploads, for applications through a mission abroad, and for exam
        forms. The{" "}
        <Link href="/blog/indian-passport-photo-requirements/">Indian passport photo rules</Link>{" "}
        explain which case is yours.
      </p>

      <div className="my-8 overflow-x-auto rounded-xl border border-hairline text-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-hairline bg-accent/30">
              <th className="px-4 py-3 text-left font-semibold text-ink">Tool</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Cost</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Server upload?</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">India under-four print</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Exam tools</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            <tr className="bg-brand-soft/10">
              <td className="px-4 py-3 font-medium text-ink">easyPhoto</td>
              <td className="px-4 py-3 text-muted-foreground">Free</td>
              <td className="px-4 py-3 font-medium text-emerald-700">No — on-device</td>
              <td className="px-4 py-3 text-muted-foreground">✓ Seva spec</td>
              <td className="px-4 py-3 text-muted-foreground">✓ Exam photo and signature sizes</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">PassportSizePhoto.in</td>
              <td className="px-4 py-3 text-muted-foreground">Free</td>
              <td className="px-4 py-3 font-medium text-emerald-700">No (per their site)</td>
              <td className="px-4 py-3 text-muted-foreground">✓ India-focused</td>
              <td className="px-4 py-3 text-muted-foreground">Partial</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">IDPhoto4You</td>
              <td className="px-4 py-3 text-muted-foreground">Free</td>
              <td className="px-4 py-3 font-medium text-amber-700">Yes — 6 hr retention</td>
              <td className="px-4 py-3 text-muted-foreground">✓ 35×45 mm in dropdown</td>
              <td className="px-4 py-3 text-muted-foreground">None</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">Visafoto</td>
              <td className="px-4 py-3 text-muted-foreground">Paid · local price shown at checkout</td>
              <td className="px-4 py-3 font-medium text-amber-700">Yes — server-processed</td>
              <td className="px-4 py-3 text-muted-foreground">✓ India page</td>
              <td className="px-4 py-3 text-muted-foreground">None</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">PhotoGov</td>
              <td className="px-4 py-3 text-muted-foreground">Limited free use + paid options</td>
              <td className="px-4 py-3 font-medium text-amber-700">Yes — server + email required</td>
              <td className="px-4 py-3 text-muted-foreground">✓ On its 35×45 mm India page</td>
              <td className="px-4 py-3 text-muted-foreground">None</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">Cutout.pro</td>
              <td className="px-4 py-3 text-muted-foreground">5 free credits, then paid credits</td>
              <td className="px-4 py-3 font-medium text-amber-700">Yes — AWS server</td>
              <td className="px-4 py-3 text-muted-foreground">India listed</td>
              <td className="px-4 py-3 text-muted-foreground">None</td>
            </tr>
          </tbody>
        </table>
        <p className="border-t border-hairline px-4 py-2 text-xs text-muted-foreground">
          Pricing models checked 19 July 2026. Exact local amounts change; verify
          each provider&apos;s current checkout and terms before paying.
        </p>
      </div>

      <h2>easyPhoto — free, on-device, built around Indian documents</h2>

      <p>
        <em>This is our product.</em>
      </p>

      <p>
        easyPhoto prepares the <Link href="/india-passport-photo-maker/">India 35×45 mm under-four print</Link> and passport
        and visa photos for the US, UK, Canada, Schengen and many other countries. For{" "}
        <Link href="/exam-requirements/">Indian exam forms</Link> (SSC, IBPS, UPSC, SBI, RRB, NTA and
        more) it sizes the photo and signature to the KB band and pixel size each notice publishes,
        and it also resizes signatures and converts formats. Nothing is uploaded: everything runs in
        your browser. Each country and exam page links the official source it follows.
      </p>

      <p>
        We built it for India because general photo tools rarely know an exam&apos;s KB band. Some
        exams, such as SSC, now take the photo live in the form, and the tool says so rather than
        making a file you can&apos;t use. It is free, with no account.
      </p>

      <h2>PassportSizePhoto.in — free, WebAssembly, India-first</h2>

      <p>
        PassportSizePhoto.in is a free, India-native passport photo tool built on WebAssembly with
        a &quot;zero-data-transfer&quot; privacy model: it says processing runs entirely in the
        browser and photos are never sent to a server. Alongside 35×45 mm it offers a
        630×810 px option, which matches the size Indian missions abroad ask for. It states
        compliance with DPDPA (India&apos;s Digital Personal Data Protection Act) and GDPR, and
        has a Hindi version.
      </p>

      <p>
        The feature set goes beyond a basic crop: a print layout selector lets you output 1, 4, 6,
        or 8 photos per 4R sheet for physical printing; background colour options include white,
        off-white, light blue, and light grey; and a three-step flow takes you from upload, by
        drag-and-drop or camera, to a print-ready sheet.
      </p>

      <p>
        The gap: it is a passport and ID photo tool. SSC and UPSC are mentioned by name in their
        content, but there are no portal-specific KB ceilings or pixel dimensions for individual
        exam forms. For a passport photo only, it is a strong free choice. For exam portal photos,
        use a dedicated exam resizer.
      </p>

      <h2>IDPhoto4You — free, but your photo goes to a server</h2>

      <p>
        IDPhoto4You is free with no account required, and it supports India&apos;s 35×45 mm spec
        in its 73-country dropdown. For a straightforward passport photo it works. The important
        caveat: their own terms state that uploaded photos are stored on their servers during
        processing and automatically deleted within six hours. For a face photo intended for a
        government document, that&apos;s a privacy trade-off worth knowing about before you upload.
      </p>

      <p>
        There&apos;s also no way to set a KB size and no exam sizes. The tool
        generates a cropped, background-removed photo, but you can&apos;t tell it &quot;give me
        this under 50 KB at 275×354 px.&quot; A general resize step is still needed after.
      </p>

      <h2>Visafoto — the paid option with a refund promise</h2>

      <p>
        Visafoto charges a one-time fee per photo and, on its own pricing page, claims a 99.7%
        acceptance rate and offers a replacement, correction or refund if officials reject the
        photo. That backstop is something a free browser tool can&apos;t offer. Its{" "}
        <a
          href="https://visafoto.com/visafoto-prices"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          public price page
        </a>{" "}
        shows the fee in your local currency, so check the checkout amount before ordering. A human
        second opinion can be worth paying for on a foreign visa with detailed photo rules.
      </p>

      <p>
        For an under-four print or an exam form, where the form checks size and file limits, a
        paid review is usually more than you need. Visafoto also processes your photo on its
        server and has no Indian exam sizes.
      </p>

      <h2>What about paid AI photo apps?</h2>

      <p>
        Paid apps such as Passport Photo Online adjust the background and lighting for you. They
        generally process the photo on their servers and charge before the full download. If you
        use one for an Indian print, check that it gives 35×45 mm and not the US 2×2 inch size.
      </p>

      <h2>PhotoGov — check which India page you land on</h2>

      <p>
        PhotoGov (photogov.net) covers a long list of countries and document types. It has a
        dedicated India 35×45 mm page; if you use it for the under-four print, start from that
        page and check that the result is 35×45 mm on white before you print.
      </p>

      <p>
        PhotoGov asks for an email address and processes your photo on its server. What is free
        depends on where you are, and it sells paid options, including a human review; check the
        checkout before you rely on it. It has no exam sizes.
      </p>

      <h2>Cutout.pro — AI background removal, but credit-gated for passport photos</h2>

      <p>
        Cutout.pro gives 5 free credits on sign-up. A passport photo costs 2 credits. You get
        two complete photos before credits run out. After that, paid subscription
        or pay-as-you-go credit packages are listed on Cutout.pro&apos;s{" "}
        <a
          href="https://www.cutout.pro/image-pricing"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          current pricing page
        </a>
        . Free previews are watermarked. Its privacy policy says photos are processed on Amazon
        Web Services and kept for 24–48 hours after your last edit.
      </p>

      <p>
        Cutout.pro is genuinely strong at AI background removal for complex subjects: product
        photography, hair, transparent objects. For a one-off Indian passport photo, that
        capability is not needed, and buying credits for one photo costs more than a free tool.
        It makes more sense for bulk product photos or video backgrounds.
      </p>

      <h2>Which should you use?</h2>

      <ul>
        <li>
          <strong>Under-four passport print:</strong> <Link href="/india-passport-photo-maker/">easyPhoto</Link> or
          PassportSizePhoto.in can prepare a 35×45 mm crop without uploading your
          source image. For OCI, use the square OCI size instead.
        </li>
        <li>
          <strong>SSC, IBPS, UPSC, SBI, RRB, NTA exam form:</strong> <Link href="/exam-requirements/">easyPhoto</Link>, the
          only tool here with each exam&apos;s KB band and pixel size, linked to its notice.
        </li>
        <li>
          <strong>A foreign visa where a rejection would be costly:</strong> a paid service such
          as Visafoto, if its refund or replacement terms are worth the fee to you.
        </li>
        <li>
          <strong>Privacy is a hard requirement:</strong> easyPhoto or PassportSizePhoto.in.
          Both say they process photos in the browser. You can check easyPhoto yourself: open
          the browser&apos;s network tab while it works and no image upload is sent.
        </li>
        <li>
          <strong>You found PhotoGov and want to use it:</strong> start from its India
          35×45 mm page, or use a free on-device tool and skip the server upload.
        </li>
        <li>
          <strong>You are considering Cutout.pro:</strong> its free credits cover two passport
          photos. For a one-off document photo a free on-device tool costs nothing.
        </li>
      </ul>

      <h2>Frequently asked questions</h2>

      <p>
        <strong>Is the India passport photo size 35×45 mm or 2×2 inches?</strong>
      </p>
      <p>
        35×45 mm, for the print a child below four needs. The 2×2 inch size is the US one; India&apos;s
        OCI photo is also square, at least 51×51 mm, but it is a separate upload.
      </p>

      <p>
        <strong>Do these tools add a watermark to free photos?</strong>
      </p>
      <p>
        easyPhoto, PassportSizePhoto.in, and IDPhoto4You do not add a watermark; downloads are
        fully free. Cutout.pro&apos;s free tier produces watermarked previews; a watermark-free
        full-resolution download requires credits. Visafoto
        and Passport Photo Online are paid tools; there is no free download tier.
      </p>
    </BlogPostLayout>
  );
}
