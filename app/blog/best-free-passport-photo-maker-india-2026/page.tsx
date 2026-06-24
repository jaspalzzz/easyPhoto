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
        Most online passport photo tools have at least one of three problems: they charge ₹600 per
        photo, they upload your biometric face photo to a remote server, or they use the US 2×2 inch
        spec instead of India&apos;s actual 35×45 mm requirement. If you&apos;re applying for a
        passport, OCI card, or a government exam form, none of those is acceptable. Here are seven
        tools compared on the criteria that matter: cost, privacy, and whether they actually know
        the India spec.
      </p>

      <p>
        <strong>Transparency:</strong> We built easyPhoto, so we&apos;re not neutral. Every feature
        claim below is based on publicly verifiable information: pricing sourced directly from each
        tool&apos;s website, upload behaviour from their terms of service. Where a competitor does
        something better, we say so.
      </p>

      <figure className="my-7 overflow-hidden rounded-xl border border-hairline">
        <svg
          viewBox="0 0 760 300"
          style={{ maxWidth: "100%", height: "auto", fontFamily: "'Inter', system-ui, sans-serif", display: "block" }}
          role="img"
          aria-label="Comparison chart: paid studio vs free online passport photo makers — cost, privacy, India spec accuracy"
        >
          <title>Passport photo maker comparison — paid studio photo vs free on-device tools</title>
          <rect width="760" height="300" fill="#f9f8f6" />
          {/* Left: Paid/Studio */}
          <rect x="20" y="20" width="330" height="260" rx="8" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
          <rect x="20" y="20" width="330" height="44" rx="8" fill="#6b7280" />
          <rect x="20" y="50" width="330" height="14" fill="#6b7280" />
          <text x="185" y="47" textAnchor="middle" fontSize="13" fontWeight="700" fill="white">Physical Studio / Generic Online Tool</text>
          {/* Studio photo icon */}
          <rect x="60" y="78" width="54" height="70" rx="4" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
          <circle cx="87" cy="103" r="14" fill="#d1d5db" />
          <path d="M67 148 Q87 130 107 148" fill="#d1d5db" />
          <text x="87" y="165" textAnchor="middle" fontSize="10" fill="#6b7280">35×45 mm</text>
          {/* Cons list */}
          {[
            ["✗ Costs ₹150 – ₹600 per print", "#dc2626"],
            ["✗ Uploads your photo to a server", "#dc2626"],
            ["✗ Often uses US spec, not India's", "#dc2626"],
            ["✗ No exam portal presets (KB/px)", "#dc2626"],
            ["✗ Retry = another fee", "#dc2626"],
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
            ["✓ Exact Passport Seva 35×45 mm", "#15803d"],
            ["✓ SSC / IBPS / UPSC KB presets", "#15803d"],
            ["✓ Instant re-crop, any time", "#15803d"],
          ].map(([text, color], i) => (
            <text key={i} x="520" y={90 + i * 34} fontSize="12" fill={color} fontWeight="500">{text}</text>
          ))}
          {/* VS badge */}
          <circle cx="380" cy="150" r="22" fill="#F4C63F" />
          <text x="380" y="155" textAnchor="middle" fontSize="14" fontWeight="800" fill="#163A6B">VS</text>
        </svg>
        <figcaption className="bg-accent/30 px-4 py-2.5 text-center text-[12.5px] text-muted-foreground">
          Paid studio vs free on-device passport photo maker — cost, privacy and India spec accuracy compared.
        </figcaption>
      </figure>

      <h2>What the India passport photo spec actually requires</h2>

      <p>
        The Passport Seva portal (passportindia.gov.in) specifies a{" "}
        <strong>35×45 mm JPG</strong> with a plain white background, the face taking up 70–80% of
        the frame, and the file under 1 MB. This is not the same as the US 2×2 inch (51×51 mm)
        spec, a mistake several tools make for their &quot;India&quot; preset. For exam portals
        the rules are stricter: SSC requires 20–50 KB at 275×354 px, IBPS requires 20–50 KB at
        200×230 px, UPSC requires 20–300 KB at a minimum of 350×350 px. All set by each
        board&apos;s own notification.
      </p>

      <p>
        This is a quick summary; for the complete, regularly-verified Passport Seva
        rules — print vs digital sizes, OCI and NRI differences, and the exact
        pixel and KB limits — see our{" "}
        <a href="/blog/indian-passport-photo-size-rules/">Indian passport photo size &amp; rules</a>{" "}
        guide, the canonical reference we keep updated.
      </p>

      <div className="my-8 overflow-x-auto rounded-xl border border-hairline text-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-hairline bg-accent/30">
              <th className="px-4 py-3 text-left font-semibold text-ink">Tool</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Cost</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Server upload?</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">India 35×45 mm</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Exam tools</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            <tr className="bg-brand-soft/10">
              <td className="px-4 py-3 font-medium text-ink">easyPhoto</td>
              <td className="px-4 py-3 text-muted-foreground">Free</td>
              <td className="px-4 py-3 font-medium text-emerald-700">No — on-device</td>
              <td className="px-4 py-3 text-muted-foreground">✓ Seva spec</td>
              <td className="px-4 py-3 text-muted-foreground">✓ 40+ portals</td>
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
              <td className="px-4 py-3 text-muted-foreground">₹600 / photo</td>
              <td className="px-4 py-3 font-medium text-amber-700">Yes — server-processed</td>
              <td className="px-4 py-3 text-muted-foreground">✓ India page</td>
              <td className="px-4 py-3 text-muted-foreground">None</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">AI passport photo apps</td>
              <td className="px-4 py-3 text-muted-foreground">$5–$17 / photo</td>
              <td className="px-4 py-3 font-medium text-amber-700">Yes — cloud AI</td>
              <td className="px-4 py-3 text-muted-foreground">Often wrong spec</td>
              <td className="px-4 py-3 text-muted-foreground">None</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">PhotoGov</td>
              <td className="px-4 py-3 text-muted-foreground">Free (limited) + paid from $5.90</td>
              <td className="px-4 py-3 font-medium text-amber-700">Yes — server + email required</td>
              <td className="px-4 py-3 text-muted-foreground">⚠ Generic India page shows US spec</td>
              <td className="px-4 py-3 text-muted-foreground">None</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">Cutout.pro</td>
              <td className="px-4 py-3 text-muted-foreground">5 free credits, then ₹246.50+/mo</td>
              <td className="px-4 py-3 font-medium text-amber-700">Yes — AWS server</td>
              <td className="px-4 py-3 text-muted-foreground">India listed (spec unconfirmed)</td>
              <td className="px-4 py-3 text-muted-foreground">None</td>
            </tr>
          </tbody>
        </table>
        <p className="border-t border-hairline px-4 py-2 text-xs text-muted-foreground">
          Pricing verified June 2026. Sources: each tool&apos;s own website and terms.
        </p>
      </div>

      <h2>easyPhoto — free, on-device, built around Indian documents</h2>

      <p>
        <em>This is our product. Read the section above for the independent comparison.</em>
      </p>

      <p>
        easyPhoto makes passport photos (India 35×45 mm, US 2×2 in, UK, Canada, Schengen and 20+
        other countries), resizes exam photos to the exact KB and pixel limits of 40+ Indian exam
        portals (SSC, IBPS, UPSC, SBI, RRB, NTA and more), and handles PDF compression, signature
        resize, and format conversion. Nothing is uploaded: every operation runs in your browser
        using WebAssembly. The specs come from each board&apos;s official notification, verified
        against the source.
      </p>

      <p>
        The reason we built it specifically for India is that no Western tool covers exam photo
        requirements. A SSC CGL applicant needs a 275×354 px JPG between 20 KB and 50 KB, a spec
        that doesn&apos;t exist anywhere in Visafoto&apos;s or iLoveIMG&apos;s interface. The tool
        is free with no account required.
      </p>

      <h2>PassportSizePhoto.in — free, WebAssembly, India-first</h2>

      <p>
        PassportSizePhoto.in is a free, India-native passport photo tool built on WebAssembly with
        a verifiable &quot;zero-data-transfer&quot; privacy model: processing runs entirely in
        the browser and photos are never sent to a server. The India spec is implemented at the
        pixel level: 630×810 px, 10–250 KB, matching the Passport Seva portal&apos;s exact upload
        constraints. The tool claims DPDPA (India&apos;s Digital Personal Data Protection Act)
        compliance alongside GDPR, and a Hindi-language version is available.
      </p>

      <p>
        The feature set goes beyond a basic crop: a print layout selector lets you output 1, 4, 6,
        or 8 photos per 4R sheet for physical printing; background colour options include white,
        off-white, light blue, and light grey; and a guided three-step flow walks through upload,
        settings, and download clearly. The workflow steps are visually structured on their
        how-to-use page: upload with drag-and-drop or camera, choose document type and layout,
        then download a print-ready sheet.
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
        There&apos;s also no KB-target output control and no exam portal presets. The tool
        generates a cropped, background-removed photo, but you can&apos;t tell it &quot;give me
        this under 50 KB at 275×354 px.&quot; A general resize step is still needed after.
      </p>

      <h2>Visafoto — the paid option with an accuracy guarantee</h2>

      <p>
        Visafoto charges ₹600 per photo (confirmed June 2026) and adds a human expert review of
        compliance. If the photo fails the official check, they redo it. That guarantee is
        genuinely valuable for an embassy-grade visa photo where rejection causes a real problem.
      </p>

      <p>
        For most Indian passport or exam photo use cases — where the official portal simply checks
        dimensions and file size — that guarantee is overkill. The ₹600 fee makes sense for a
        Schengen visa with strict biometric requirements, not for a SSC CGL exam registration. It
        also uploads your photo to a remote server for processing, which is the same privacy
        trade-off as other server-based tools. There are no exam photo presets.
      </p>

      <h2>What about AI passport photo apps?</h2>

      <p>
        Several AI tools — Passport Photo Online ($16.95), AIPassportPhoto (~$5), and others —
        use machine learning to adjust background, lighting, and expression automatically. They
        generally require server upload and payment before you can download the result.
        AIPassportPhoto&apos;s India page (as of June 2026) lists the spec as 2×2 inches,
        the US size, not the Indian Passport Seva spec of 35×45 mm. If spec accuracy matters, it
        is worth verifying what a tool claims before paying.
      </p>

      <h2>PhotoGov — check which India page you land on</h2>

      <p>
        PhotoGov (photogov.net) serves 1.8 million users across 200 countries and 900+ document
        types. It is a large, well-established tool. The India 35×45 mm Passport Seva spec exists
        on their dedicated page (/documents/in-passport-35x45mm-photo/). However, their generic
        India passport page (/documents/in-passport-photo/) showed 2×2 inches (51×51 mm) — the
        US specification — with a light grey background rather than the India-mandated white. This
        is a verifiable content discrepancy on their site (confirmed June 2026). If you use
        PhotoGov for an Indian passport photo, navigate to the specific 35×45 mm page, not the
        generic India page.
      </p>

      <p>
        Other caveats: PhotoGov requires an email address and uploads your photo to their server
        for processing. The free tier is location-dependent; Indian users may face a paywall;
        paid options start from approximately $5.90 USD. There is a human expert review add-on
        available (pricing not publicly listed). No exam portal support of any kind.
      </p>

      <h2>Cutout.pro — AI background removal, but credit-gated for passport photos</h2>

      <p>
        Cutout.pro gives 5 free credits on sign-up. A passport photo costs 2 credits. You get
        two complete photos before credits run out. After that, the cheapest plan is ₹246.50/month
        (confirmed June 2026 from their pricing page). Free previews are watermarked. Photos are
        uploaded to Amazon Web Services and retained for 24–48 hours. Public reports (Cybernews
        2023; Trustpilot references to a BreachForums posting in February 2024) document past
        data security incidents.
      </p>

      <p>
        Cutout.pro is genuinely strong at AI background removal for complex subjects: product
        photography, hair, transparent objects. For a one-off Indian passport photo, that
        capability is not needed and the credit pricing is poor value. See the dedicated{" "}
        <a href="/blog/cutout-pro-alternative-india/" className="text-brand underline">
          Cutout.pro alternatives post
        </a>{" "}
        for a full comparison including PassportMaker and PassportSizePhoto.in.
      </p>

      <h2>Which should you use?</h2>

      <ul>
        <li>
          <strong>Indian passport or OCI card application:</strong> easyPhoto or
          PassportSizePhoto.in. Both are free, India-spec-correct, and don&apos;t upload your
          photo.
        </li>
        <li>
          <strong>SSC, IBPS, UPSC, SBI, RRB, NTA exam form:</strong> easyPhoto, the only tool
          with verified KB and pixel targets per portal.
        </li>
        <li>
          <strong>Visa for a foreign country with strict embassy standards:</strong> Visafoto or
          Passport Photo Online are worth the cost for the compliance guarantee.
        </li>
        <li>
          <strong>Privacy is a hard requirement:</strong> easyPhoto or PassportSizePhoto.in.
          Both use on-device WebAssembly processing; easyPhoto&apos;s model is verifiable via
          the browser network tab (zero image upload requests sent).
        </li>
        <li>
          <strong>You found PhotoGov and want to use it:</strong> Navigate specifically to their
          India 35×45 mm page. Their generic India passport page shows the US spec. Or use a
          free on-device tool and skip the server upload entirely.
        </li>
        <li>
          <strong>You are considering Cutout.pro:</strong> It runs out of free credits after two
          passport photos, then requires a subscription. For one-off document photos, the free
          on-device tools are better value. Cutout.pro is strong for bulk product photography.
        </li>
      </ul>

      <h2>Frequently asked questions</h2>

      <p>
        <strong>Is the India passport photo size 35×45 mm or 2×2 inches?</strong>
      </p>
      <p>
        35×45 mm, per Passport Seva (passportindia.gov.in). The 2×2 inch (51×51 mm) size is the
        US specification. Some tools incorrectly use the US size for their India preset. Check
        the dimensions before submitting.
      </p>

      <p>
        <strong>Can I use a phone photo for my Indian passport application?</strong>
      </p>
      <p>
        Yes. Passport Seva accepts digital photos uploaded during the online application. The photo
        must be a clear, recent JPG with a plain white background, face centred, and no glasses.
        A phone camera in good light is sufficient. Resize it to 35×45 mm and under 1 MB before
        uploading.
      </p>

      <p>
        <strong>Do these tools add a watermark to free photos?</strong>
      </p>
      <p>
        easyPhoto, PassportSizePhoto.in, and IDPhoto4You do not add a watermark; downloads are
        fully free. Cutout.pro&apos;s free tier produces watermarked previews; a watermark-free
        full-resolution download requires credits (confirmed by independent reviews). Visafoto
        and Passport Photo Online are paid tools; there is no free download tier.
      </p>
    </BlogPostLayout>
  );
}
