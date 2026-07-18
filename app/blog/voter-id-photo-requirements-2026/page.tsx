import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("voter-id-photo-requirements-2026")!;

const FAQ_ITEMS = [
  {
    q: "What is the photo size for a voter ID (EPIC) application?",
    a: "ECI's public Form 6 guidance specifies a recent, good-quality, unsigned colour photograph measuring 4.5 cm high by 3.5 cm wide, with a white background. It does not publish a universal digital KB cap, pixel size, file format or DPI, so confirm those fields on the current Voters' Service Portal upload screen.",
  },
  {
    q: "What are the photo requirements for voter registration Form 6?",
    a: "Form 6 asks for a recent, good-quality, unsigned colour photo measuring 4.5 cm high by 3.5 cm wide on a white background. The applicant's eyes must be open and both edges of the face clearly visible. Other voter forms have their own instructions, so do not assume their photo fields are identical.",
  },
  {
    q: "Why is my voter ID photo getting rejected on the NVSP portal?",
    a: "Check the current upload screen's file-size and format message first, because ECI's public Form 6 guidance does not publish one universal digital limit. The published requirements do support checking for a recent good-quality unsigned colour photo, the 4.5 cm by 3.5 cm crop, a white background, open eyes and both face edges being visible.",
  },
  {
    q: "Can I use a mobile selfie for a voter ID application?",
    a: "ECI's public Form 6 guidance describes the required photo, not the device used to take it. If you use a phone, prepare a recent good-quality unsigned colour image with a white background, open eyes and both face edges visible, then follow the current upload screen's digital fields.",
  },
  {
    q: "Is the voter ID photo size the same across all states?",
    a: "Form 6 is an Election Commission of India form and publishes the same 4.5 cm by 3.5 cm physical photo guidance. Its public instructions do not establish a national digital KB or pixel rule, so confirm the current portal fields instead of relying on an assumed state or national cap.",
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
      ctaHref="/exam-requirements/voter-id/"
      ctaLabel="Resize voter ID photo free"
    >
      <p>
        The Election Commission of India&apos;s public Form 6 guidance is specific about
        the physical photo and its composition, but it does not publish a universal
        digital KB cap or pixel size. This guide separates those confirmed requirements
        from the fields you still need to check on the current Voters&apos; Service Portal.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>
            <strong>Physical size:</strong> 4.5&nbsp;cm high × 3.5&nbsp;cm wide
          </li>
          <li>
            <strong>Photo:</strong> recent, good-quality, unsigned colour image
          </li>
          <li>
            <strong>Background:</strong> white
          </li>
          <li>
            <strong>Face:</strong> eyes open and both edges clearly visible
          </li>
          <li>
            <strong>Digital fields:</strong> no public universal KB, pixel, format or
            DPI rule; confirm the current upload screen
          </li>
        </ul>
      </div>

      <h2>What photo size does Form 6 publish?</h2>

      <p>
        The official guidance says: a recent, good-quality, unsigned colour passport
        photo measuring <strong>4.5&nbsp;cm high by 3.5&nbsp;cm wide</strong>, with a
        white background, open eyes and both edges of the face visible. You can read
        that wording in the{" "}
        <a
          href="https://voters.eci.gov.in/guidelines/Form-6_en.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          ECI Form 6 guidance
        </a>
        . That public document does not specify a digital file-size band, pixel canvas,
        format or DPI. Treat any such field shown by the online form as workflow-specific
        and follow the value displayed when you apply.
      </p>

      <img
        src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?fm=jpg&q=80&w=1200&h=630&fit=crop"
        alt="Election Commission ballot box and voter registration process in India"
        className="my-6 w-full rounded-xl object-cover"
        loading="lazy"
        width={1200}
        height={630}
      />

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Requirement</th>
            <th className="py-2 font-semibold text-ink">ECI / NVSP spec</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["Physical size", "4.5 cm high × 3.5 cm wide"],
            ["Photo type", "Recent, good-quality, unsigned colour photograph"],
            ["Background", "White"],
            ["Eyes", "Open"],
            ["Face framing", "Both edges of the face clearly visible"],
            ["Digital file-size band", "Not published in the public Form 6 guidance"],
            ["Pixel dimensions", "Not published in the public Form 6 guidance"],
            ["Digital format / DPI", "Not published in the public Form 6 guidance"],
          ].map(([req, spec]) => (
            <tr key={req} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{req}</td>
              <td className="py-2">{spec}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        The{" "}
        <Link href="/exam-requirements/voter-id/" className="text-brand underline">
          voter ID photo resizer
        </Link>{" "}
        lets you choose a compatibility target, crop to the published portrait proportion
        and export in your browser. Because ECI does not publish one universal digital cap
        in Form 6, use the value displayed on your current upload screen.
      </p>

      <h2>Which voter registration form does this guidance cover?</h2>

      <p>
        Form 6 covers fresh enrolment for an Indian resident and includes the published
        4.5&nbsp;cm × 3.5&nbsp;cm photo field described above. Other forms can use
        different photo boxes or workflows. Open the current form that matches your case
        instead of carrying the Form 6 dimensions or an assumed digital cap across them.
      </p>

      <h2>Why do voter ID photos get rejected?</h2>

      <img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?fm=jpg&q=80&w=1200&h=630&fit=crop"
        alt="Person reviewing documents on a laptop for voter registration application"
        className="my-6 w-full rounded-xl object-cover"
        loading="lazy"
        width={1200}
        height={630}
      />

      <p>
        The public Form 6 guidance supports checking the physical crop and visible photo
        qualities below. For a digital validation error, follow the current upload
        screen&apos;s message because the public guidance does not publish a universal KB,
        pixel or format rule.
      </p>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Rejection reason</th>
            <th className="py-2 font-semibold text-ink">Fix</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["Background is not white", "Use the white background specified by Form 6"],
            ["Eyes are closed", "Use a photo with both eyes open"],
            ["A face edge is hidden", "Keep both edges of the face clearly visible"],
            ["Photo is signed", "Use an unsigned photograph"],
            ["Physical crop is wrong", "Use 4.5 cm high × 3.5 cm wide"],
            ["Digital upload error", "Follow the current portal's displayed KB, pixel and format fields"],
          ].map(([reason, fix]) => (
            <tr key={reason} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{reason}</td>
              <td className="py-2">{fix}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="my-8 rounded-xl border border-hairline bg-paper p-5">
        <h3 className="!mt-0 text-base font-semibold text-ink">Published versus portal-specific</h3>
        <p className="!mb-0 !mt-2 text-sm leading-relaxed text-ink-soft">
          Form 6 publishes the 4.5&nbsp;cm × 3.5&nbsp;cm physical photo and visible
          composition requirements. It does not publish a national digital KB window,
          pixel canvas, file format or DPI. Confirm those digital fields on the current
          application screen rather than treating a compatibility target as an ECI rule.
        </p>
      </div>

      <h2>How to take a voter ID photo at home</h2>

      <p>
        The public guidance focuses on the resulting photo. Use this checklist to match
        what it actually publishes:
      </p>

      <ol className="my-4 space-y-3 text-[15px]">
        <li>
          <strong>Background:</strong> Use white, as specified by Form 6.
        </li>
        <li>
          <strong>Photo quality:</strong> Use a recent, good-quality colour image and
          do not sign or write on it.
        </li>
        <li>
          <strong>Face visibility:</strong> Keep both eyes open and both edges of the
          face clearly visible.
        </li>
        <li>
          <strong>Crop and resize:</strong> Use the{" "}
          <Link href="/exam-requirements/voter-id/" className="text-brand underline">
            voter ID photo resizer
          </Link>{" "}
          to crop to the 4.5&nbsp;cm-by-3.5&nbsp;cm portrait proportion and choose a
          compatibility target. Confirm the current portal&apos;s digital fields before
          export. The tool runs entirely in your browser.
        </li>
      </ol>

      <p>
        If your background isn&apos;t plain enough, the{" "}
        <Link href="/tools/background-removal/" className="text-brand underline">
          background removal tool
        </Link>{" "}
        can replace a busy background with a clean white one — all on-device, nothing
        uploaded. This is also useful if the photo you have is otherwise good but was
        taken in front of a coloured wall.
      </p>

      <h2>Voter ID vs Aadhaar vs PAN — are the photo specs the same?</h2>

      <p>
        They use different workflows, so one photo file should not be assumed to satisfy
        all three. In particular, the public Form 6 guidance does not establish a Voter
        ID digital KB or pixel rule.
      </p>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-4 font-semibold text-ink">Document</th>
            <th className="py-2 pr-4 font-semibold text-ink">Portal</th>
            <th className="py-2 pr-4 font-semibold text-ink">Published photo detail</th>
            <th className="py-2 font-semibold text-ink">Digital fields</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            ["Voter ID (Form 6)", "voters.eci.gov.in", "4.5 cm high × 3.5 cm wide", "Not published in public Form 6 guidance"],
            ["PAN", "Protean / UTIITSL", "Separate application guidance", "Check the selected application route"],
            ["Driving Licence", "sarathi.parivahan.gov.in", "Separate Sarathi scan guide", "Check the selected state and service"],
            ["Aadhaar", "Aadhaar Seva Kendra", "Photo captured at the centre", "No prepared photo upload for enrolment/update"],
          ].map(([doc, portal, kb, px]) => (
            <tr key={doc} className="border-b border-hairline/60">
              <td className="py-2 pr-4 font-medium text-ink">{doc}</td>
              <td className="py-2 pr-4 text-[13px]">{portal}</td>
              <td className="py-2 pr-4">{kb}</td>
              <td className="py-2">{px}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        The full side-by-side for all four IDs is in the{" "}
        <Link href="/blog/indian-government-id-photo-requirements/" className="text-brand underline">
          Indian government ID photo requirements
        </Link>{" "}
        guide — one reference for the recorded sizes and KB limits of the listed portals. For
        PAN card specs, see the{" "}
        <Link href="/blog/pan-card-photo-size/" className="text-brand underline">
          PAN card photo size guide
        </Link>
        . For passport photo requirements, the{" "}
        <Link href="/blog/indian-passport-photo-requirements/" className="text-brand underline">
          Indian passport photo requirements
        </Link>{" "}
        guide covers the MEA and VFS spec in detail.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
