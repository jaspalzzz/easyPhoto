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
          <li>Get one free from UIDAI: on myAadhaar, choose the masked version when
            you download e-Aadhaar. For a photo of the card you already have, cover
            the first 8 digits with a solid box, then keep that edited copy.</li>
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
        The simplest route is UIDAI&apos;s own: sign in to{" "}
        <a href="https://myaadhaar.uidai.gov.in/" target="_blank" rel="noopener noreferrer">myAadhaar</a>,
        choose to download e-Aadhaar and tick the masked option. For a photo or
        scan of the card you already have, you can mask it yourself on your phone:
      </p>
      <ul>
        <li>Open the image in your phone&apos;s photo editor and pick the markup or draw tool.</li>
        <li>Draw a solid, fully opaque box over the first 8 digits of the number (and anything else you want hidden).</li>
        <li>Keep the edited version as a separate picture and share that copy, never the original.</li>
      </ul>
      <p>
        Two things make this safe: the box must be <strong>solid and saved into
        the image</strong> — a highlighter, a semi-transparent shape or a box
        drawn on top of a PDF can sometimes be removed — and the editing should
        happen <strong>on your own device</strong>, not on an upload site you
        don&apos;t know. That matters for a document this sensitive.
      </p>

      <h2>A few extra precautions</h2>
      <ul>
        <li>Mask the QR code too if you don&apos;t want it scanned — it encodes your details.</li>
        <li>Share over secure channels; avoid public/unknown upload sites.</li>
        <li>e-Aadhaar PDFs are password-protected: the password is the first four letters of your name in capitals followed by your year of birth (for example RAVI1998). Open it, then mask a screenshot.</li>
        <li>If the form caps the upload size, see the <Link href="/blog/how-to-prepare-documents-for-exam-applications-india/">exam documents guide</Link> for keeping a scan under the limit.</li>
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
