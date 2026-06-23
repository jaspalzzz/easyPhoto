import Link from "next/link";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { pageMetadata } from "@/lib/seo";
import { getPost } from "@/lib/blog";

const post = getPost("cutout-pro-alternative-india")!;

const FAQ_ITEMS = [
  {
    q: "Is Cutout.pro actually free?",
    a: "Cutout.pro starts with 5 free credits. A passport photo costs 2 credits, so you get two complete photos before credits run out. After that, the cheapest option is ₹246.50/month for 80 credits (subscription) or ₹254.15 for 30 credits (pay-as-you-go), both confirmed from cutout.pro/image-pricing in June 2026. Free previews are watermarked.",
  },
  {
    q: "Did Cutout.pro experience a data breach?",
    a: "Cybernews researchers reported an exposed Elasticsearch server associated with Cutout.pro in early 2023. In February 2024, Trustpilot user reviews referenced a 5.93 GB dataset posted to BreachForums. These are sourced from public reports; we have not independently verified the contents. Cutout.pro's current privacy policy states photos are processed on AWS and deleted within 24–48 hours after the last edit.",
  },
  {
    q: "Which free tool is most accurate for India passport photos?",
    a: "PassportSizePhoto.in lists the Passport Seva spec at the pixel level (630×810 px, 10–250 KB), matching the upload portal's exact constraints. easyPhoto targets the same spec and also covers exam portal requirements. Both are free with no server upload. Neither charges credits for any feature.",
  },
];

export const metadata = pageMetadata({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}/`,
  type: "article",
});

export default function Page() {
  return (
    <BlogPostLayout slug="cutout-pro-alternative-india" faqItems={FAQ_ITEMS}>
      <p>
        Cutout.pro gives every new account 5 free credits. A passport photo costs 2 credits — so
        you can make exactly two complete passport photos before the credits run out. After that,
        the cheapest plan is a monthly subscription starting at ₹246.50 for 80 credits (pricing
        confirmed June 2026 from cutout.pro/image-pricing). For someone who needs one{" "}
        <Link href="/blog/indian-passport-photo-size-rules/" className="text-brand underline">Indian passport photo</Link>{" "}
        per year for a renewal, a monthly subscription makes no sense.
      </p>

      <p>
        <strong>Transparency:</strong> easyPhoto is our product. All claims about Cutout.pro below
        are sourced from their own pricing page, privacy policy, and independent third-party
        reviews. Where Cutout.pro does something better, we say so.
      </p>

      <h2>What Cutout.pro is genuinely good at</h2>

      <p>
        Cutout.pro&apos;s core product is AI background removal, and it is genuinely strong at
        it. For complex subjects — hair, fur, transparent objects, product photos on busy
        backgrounds — the AI handles edges that simpler tools miss. If you need background
        removal at scale for product photography or commercial work, Cutout.pro is a competitive
        choice.
      </p>

      <p>
        The passport photo feature sits on top of this background removal engine. The output
        quality is high. The problem is not quality — it is the pricing model and the privacy
        trade-offs for something as sensitive as a biometric government photo.
      </p>

      <h2>Three issues with Cutout.pro for one-off passport photos</h2>

      <p>
        <strong>1. Credits run out after two photos.</strong> Five free credits, two credits per
        passport photo — that is two complete photos and one credit left over. After that, the
        cheapest path is a ₹246.50/month subscription (80 credits). Pay-as-you-go is ₹254.15 for
        30 credits, or roughly ₹17 per photo at minimum. For a tool marketed as &quot;free,&quot;
        that is a significant paywall hidden behind the initial credits.
      </p>

      <p>
        <strong>2. Watermark on free previews.</strong> The low-resolution preview visible without
        spending credits carries a watermark. Independent reviews confirm that a full-resolution,
        watermark-free download requires credits (DCReport, March 2026; HitPaw review). Cutout.pro&apos;s
        own marketing says &quot;free previews forever&quot; — the word &quot;preview&quot; is
        doing significant work there.
      </p>

      <p>
        <strong>3. Server upload to AWS.</strong> Cutout.pro&apos;s privacy policy confirms photos
        are processed on Amazon Web Services and retained for 24–48 hours after your last edit.
        Public reports (Cybernews researchers, 2023; Trustpilot user reviews referencing a data
        set posted to BreachForums in February 2024) indicate past data security incidents. Cutout.pro
        has not issued a public statement about these incidents that we were able to find. For a
        biometric face photo destined for a government document, a server upload carries real risk.
      </p>

      <div className="my-8 overflow-x-auto rounded-xl border border-hairline text-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-hairline bg-accent/30">
              <th className="px-4 py-3 text-left font-semibold text-ink">Tool</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Cost</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">On-device</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">India 35×45 mm</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Watermark-free</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Exam tools</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            <tr>
              <td className="px-4 py-3 font-medium text-ink">Cutout.pro</td>
              <td className="px-4 py-3 text-muted-foreground">5 free credits, then ₹246.50+/mo</td>
              <td className="px-4 py-3 font-medium text-amber-700">No — AWS server</td>
              <td className="px-4 py-3 text-muted-foreground">India listed (spec unconfirmed)</td>
              <td className="px-4 py-3 font-medium text-amber-700">No — credits required</td>
              <td className="px-4 py-3 text-muted-foreground">None</td>
            </tr>
            <tr className="bg-brand-soft/10">
              <td className="px-4 py-3 font-medium text-ink">easyPhoto</td>
              <td className="px-4 py-3 text-muted-foreground">Free</td>
              <td className="px-4 py-3 font-medium text-emerald-700">Yes</td>
              <td className="px-4 py-3 text-muted-foreground">✓ Seva spec, verified</td>
              <td className="px-4 py-3 font-medium text-emerald-700">Yes</td>
              <td className="px-4 py-3 text-muted-foreground">✓ 40+ portals</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">PassportSizePhoto.in</td>
              <td className="px-4 py-3 text-muted-foreground">Free</td>
              <td className="px-4 py-3 font-medium text-emerald-700">Yes (WebAssembly)</td>
              <td className="px-4 py-3 text-muted-foreground">✓ 630×810 px, 10–250 KB</td>
              <td className="px-4 py-3 font-medium text-emerald-700">Yes</td>
              <td className="px-4 py-3 text-muted-foreground">None</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">PassportMaker</td>
              <td className="px-4 py-3 text-muted-foreground">Appears free (unconfirmed)</td>
              <td className="px-4 py-3 font-medium text-amber-700">No — server (~1 hr deletion)</td>
              <td className="px-4 py-3 text-muted-foreground">India listed (spec unconfirmed)</td>
              <td className="px-4 py-3 text-muted-foreground">Not stated</td>
              <td className="px-4 py-3 text-muted-foreground">None</td>
            </tr>
          </tbody>
        </table>
        <p className="border-t border-hairline px-4 py-2 text-xs text-muted-foreground">
          Pricing verified June 2026 from each tool&apos;s own pages.
        </p>
      </div>

      <h2>easyPhoto — free, on-device, covers exam photos too</h2>

      <p>
        <em>This is our product.</em>
      </p>

      <p>
        easyPhoto makes{" "}
        <Link href="/blog/indian-passport-photo-size-rules/" className="text-brand underline">Indian passport photos to the Passport Seva spec</Link>{" "}
        (35×45 mm, white background, under 1 MB) for free, with no account and no server upload. Every operation runs in
        your browser — you can verify this yourself by watching the network tab while the tool
        processes your photo. No image upload request is sent.
      </p>

      <p>
        It also handles exam photos that Cutout.pro has no support for. SSC CGL requires
        275×354 px between 20–50 KB; IBPS PO requires 200×230 px in the same range; UPSC needs
        a square minimum 350×350 px. The tool knows the exact spec from each board&apos;s official
        notification and resizes to fit in one step for{" "}
        <Link href="/blog/exam-photo-signature-size-guide/" className="text-brand underline">40+ portals</Link>.
      </p>

      <h2>PassportSizePhoto.in — the strongest free passport-only alternative</h2>

      <p>
        PassportSizePhoto.in is a free, India-native tool built on WebAssembly. It correctly
        implements the Passport Seva spec at the pixel level: 630×810 px, 10–250 KB. Processing
        is browser-local with an explicit claim of DPDPA (India&apos;s data protection law)
        compliance alongside GDPR — comparable to easyPhoto&apos;s privacy model. The tool
        includes a print layout selector (1, 4, 6, or 8 photos per 4R sheet), multiple
        background colour options (white, off-white, light blue, light grey), and a
        Hindi-language version.
      </p>

      <p>
        The gap: it is a passport and ID photo tool only. It mentions SSC and UPSC by name but
        has no portal-specific KB and pixel constraints for individual exam forms. If you only
        need a passport photo, it is a strong free alternative to Cutout.pro. For a broader
        comparison of every free Indian passport photo tool, see the{" "}
        <Link href="/blog/best-free-passport-photo-maker-india-2026/" className="text-brand underline">best free passport photo maker guide</Link>.
      </p>

      <h2>PassportMaker — AI outfit swap, server upload</h2>

      <p>
        PassportMaker (passportmaker.com) is an AI-powered tool for web, iOS, and Android that
        appears to be free. Its standout feature is AI clothing substitution — it can add a
        suit or shirt over a casual photo, which is useful if your source photo has unsuitable
        attire. It covers 130+ countries.
      </p>

      <p>
        The caveat: PassportMaker&apos;s privacy policy confirms photos are uploaded to their
        servers and deleted approximately one hour after processing. For users who want
        server-free processing, PassportMaker is not the right tool. For users who need the
        AI outfit-swap feature and are comfortable with a temporary upload, it is worth testing.
        Note that the India 35×45 mm spec is listed as supported but not confirmed at the pixel
        level on any page we could access.
      </p>

      <h2>When Cutout.pro is actually worth using</h2>

      <p>
        Cutout.pro is a good product. It is just not designed for one-off passport photo
        creation at a reasonable cost. It makes sense when:
      </p>

      <ul>
        <li>
          <strong>Bulk product photography.</strong> Removing backgrounds from dozens of
          e-commerce product images — 80 credits for ₹246.50 is ₹3 per image, which is
          competitive for commercial-scale use.
        </li>
        <li>
          <strong>Complex subjects.</strong> Hair, fur, and transparent objects are genuinely
          harder for simpler tools. Cutout.pro&apos;s AI handles fine edges better than
          threshold-based background removal.
        </li>
        <li>
          <strong>Video background removal.</strong> None of the passport photo tools here
          remove backgrounds from video clips. Cutout.pro does.
        </li>
      </ul>

      <p>
        For a standard Indian passport photo, exam portal photo, or document resize — where
        the tool&apos;s AI advantages do not apply — the free on-device alternatives are cheaper,
        faster, and more private.
      </p>

      <Faq items={FAQ_ITEMS} noSchema />
    </BlogPostLayout>
  );
}
