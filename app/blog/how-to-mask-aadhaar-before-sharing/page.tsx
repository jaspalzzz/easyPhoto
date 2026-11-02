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
    <BlogPostLayout slug={post.slug} ctaHref="/tools/resize-kb/" ctaLabel="Compress to a KB limit">
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
          <li>Get one free from UIDAI: on myAadhaar, choose the masked version when you download e-Aadhaar.</li>
          <li>For a photo of the card you already have, cover the first 8 digits with a solid box and share that edited copy.</li>
        </ul>
      </div>

      <h2>When to share a masked copy</h2>
      <p>
        Share the masked version whenever the person asking doesn&apos;t need the
        full number: a hotel, a landlord, a coaching centre, or any copy you send
        by email or a messaging app. Some bank and government KYC processes still
        ask for the full number, or verify it by OTP; follow their instruction
        there. If you aren&apos;t sure, ask whether a masked copy will do. You can
        always share the full one later if it is genuinely required.
      </p>

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
        <li>If a form caps the upload size, bring the masked copy under the limit with the <Link href="/tools/resize-kb/">KB resizer</Link>; the <Link href="/blog/how-to-prepare-documents-for-exam-applications-india/">exam documents guide</Link> covers scans for exam forms.</li>
      </ul>

      <div className="mt-12">
        <Faq
          items={[
            {
              q: "Is a masked Aadhaar valid as ID proof?",
              a: "For many purposes, yes: UIDAI itself offers the masked download so people can limit who sees the full number. Some bank and government KYC still need the full number, so follow the instruction of whoever is asking.",
            },
            {
              q: "Can the black box be removed from a masked copy?",
              a: "Not if the box is solid and saved into the picture itself, as a phone's markup tool does when you save the edited photo. A highlighter, a see-through shape, or a box drawn on top of a PDF can sometimes be removed, so don't rely on those.",
            },
            {
              q: "Is it safe to mask my Aadhaar on a website?",
              a: "Only if the site never receives the file. UIDAI's own masked download and your phone's photo editor both keep the card off third-party servers; avoid sites that ask you to upload the card to mask it.",
            },
          ]}
        />
      </div>
    </BlogPostLayout>
  );
}
