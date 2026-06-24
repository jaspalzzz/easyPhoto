import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("how-to-mask-aadhaar-before-sharing")!;

export const metadata = pageMetadata({
  title: post.title,
  titleAbsolute: true,
  description: post.description,
  path: `/blog/${post.slug}/`,
  type: "article",
});

export default function Page() {
  return (
    <BlogPostLayout slug={post.slug}>
      <p>
        Your Aadhaar number is requested everywhere — hotels, gas connections,
        coaching centres, rental agreements. But handing over the full 12-digit
        number (and a clear copy of the card) is a real identity-theft risk. UIDAI&apos;s
        own guidance is to share a <strong>masked Aadhaar</strong> wherever a full
        one isn&apos;t strictly required.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>A <strong>masked Aadhaar</strong> hides the first 8 digits and shows only the last 4.</li>
          <li>Share it anywhere the full number isn&apos;t legally required — hotels, landlords, coaching/admission desks.</li>
          <li>Mask any copy free with the{" "}
            <Link href="/tools/mask-aadhaar/">Aadhaar masking tool</Link> — the
            black box is burned into the image and nothing is uploaded.</li>
        </ul>
      </div>

      <h2>What is a masked Aadhaar?</h2>
      <p>
        A masked Aadhaar hides the <strong>first 8 digits</strong> of your Aadhaar
        number and shows only the <strong>last 4</strong> — enough to identify the
        document to you, without exposing the full number.{" "}
        <a href="https://uidai.gov.in" target="_blank" rel="noopener noreferrer">UIDAI</a>{" "}
        offers a masked download on its site, and many verification flows now
        accept the masked version.
      </p>

      <h2>When you can share a masked Aadhaar</h2>
      <ul>
        <li>Address or identity proof where the full number isn&apos;t legally mandated.</li>
        <li>Hotels, private offices, coaching/admission desks, landlords.</li>
        <li>Any time you&apos;re emailing or messaging a copy of the card.</li>
      </ul>
      <p>
        Some government and banking (KYC) processes still require the full number —
        follow the specific instruction there. When in doubt, mask it; you can always
        share the full one if explicitly required.
      </p>

      <h2>Full vs. masked Aadhaar: when each is accepted</h2>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Situation</th>
            <th className="py-2 pr-3 font-semibold text-ink">Which version</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["Bank KYC (account opening, credit card)", "Full Aadhaar"],
            ["e-KYC / OTP-based verification", "Full number required for OTP"],
            ["Government portal identity verification", "Follow the portal's own instruction"],
            ["Hotels and hostels (mandatory guest registration)", "Masked Aadhaar accepted"],
            ["Coaching institutes and exam admission desks", "Masked Aadhaar accepted"],
            ["Private landlord or rental agreements", "Masked Aadhaar accepted"],
            ["Sharing via email or messaging apps", "Masked Aadhaar — never share the full card"],
          ].map(([situation, version]) => (
            <tr key={situation} className="border-b border-hairline/60">
              <td className="py-2 pr-3 font-medium text-ink">{situation}</td>
              <td className="py-2 pr-3">{version}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>How to mask your Aadhaar yourself (free, private)</h2>
      <p>
        You don&apos;t need to wait for the UIDAI download — you can mask any copy
        you already have in seconds:
      </p>
      <ul>
        <li>
          Open the{" "}
          <Link href="/tools/mask-aadhaar/">Aadhaar masking tool</Link> and upload
          your Aadhaar image.
        </li>
        <li>Drag a black box over the first 8 digits of the number (and anything else you want hidden).</li>
        <li>Download the masked copy.</li>
      </ul>
      <p>
        Two things make this safe: the black box is <strong>burned into the image
        pixels</strong> — it can&apos;t be peeled off or recovered — and the whole
        thing runs <strong>in your browser</strong>, so your Aadhaar is never
        uploaded to any server. That matters for a document this sensitive.
      </p>

      <h2>A few extra precautions</h2>
      <ul>
        <li>Mask the QR code too if you don&apos;t want it scanned — it encodes your details.</li>
        <li>Share over secure channels; avoid public/unknown upload sites.</li>
        <li>If a PDF is password-protected (like e-Aadhaar), open it with the <Link href="/unlock-aadhaar-pdf/">e-Aadhaar password</Link> first, then mask a screenshot.</li>
        <li>If the form caps the upload size, see <Link href="/blog/how-to-compress-pdf/">how to compress a PDF to an exact KB target</Link> after masking — the file stays on your device throughout.</li>
        <li>Need to extract details from your Aadhaar card? The <Link href="/tools/aadhaar-ocr/">Aadhaar OCR tool</Link> reads the number, name, DOB and address from a card photo — entirely in your browser, nothing uploaded.</li>
      </ul>

      <div className="mt-12">
        <Faq
          items={[
            {
              q: "Is a masked Aadhaar valid as ID proof?",
              a: "For many private and KYC-light purposes, yes — UIDAI itself promotes masked Aadhaar to limit exposure. Some banking and government KYC still need the full number, so follow the specific instruction; whenever it isn't mandated, share the masked version.",
            },
            {
              q: "Which digits does Aadhaar masking hide?",
              a: "The first 8 of the 12-digit number. Only the last 4 stay visible — enough to identify the document to you without exposing the full number.",
            },
            {
              q: "Can the black box be removed from a masked copy?",
              a: "No. The masking tool burns the black box into the image pixels, so it can't be peeled off or recovered — unlike a highlight or box added in some PDF editors, which can be deleted.",
            },
            {
              q: "Is it safe to mask my Aadhaar online?",
              a: "With this tool, yes — it runs entirely in your browser and your Aadhaar is never uploaded to any server. Avoid tools that upload your document to a server to mask it.",
            },
          ]}
        />
      </div>
    </BlogPostLayout>
  );
}
