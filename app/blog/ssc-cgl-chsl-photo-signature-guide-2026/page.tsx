import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("ssc-cgl-chsl-photo-signature-guide-2026")!;

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
        If you&apos;ve applied for an SSC exam recently and tried to upload a
        saved photo, you already know the problem: the portal no longer lets
        you. The{" "}
        <a href="https://ssc.gov.in" className="text-brand underline" target="_blank" rel="noopener noreferrer">SSC official portal</a>{" "}
        now requires you to capture your photo live, through your webcam or
        phone camera, at the time of filling the form. This changes how
        preparation works. Here are the exact specs for CGL and CHSL, how
        live capture works, and how to prepare your signature so neither file
        gets bounced.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li><strong>Photo:</strong> 20–50&nbsp;KB, JPG, plain white background — taken live through the SSC portal; saved gallery photos are not accepted.</li>
          <li><strong>Signature:</strong> 10–20&nbsp;KB, JPG, black ink on white paper, 4.0&nbsp;×&nbsp;2.0&nbsp;cm — all-capitals signatures are rejected.</li>
          <li>Both are a <em>band</em>, not just a ceiling. A photo under 20&nbsp;KB fails just as firmly as one over 50&nbsp;KB.</li>
          <li>Always confirm exact specs in the official notification at{" "}
            <a href="https://ssc.gov.in" className="text-brand underline" target="_blank" rel="noopener noreferrer">ssc.gov.in</a>{" "}
            before applying — bands can vary slightly between CGL and CHSL cycles.</li>
        </ul>
      </div>

      <h2>What does SSC CGL require for photo and signature?</h2>
      <p>
        Per the SSC&apos;s photo and signature upload instructions (updated
        August 2024,{" "}
        <a href="https://ssc.gov.in" className="text-brand underline" target="_blank" rel="noopener noreferrer">ssc.gov.in</a>),
        the confirmed requirements for SSC CGL and most SSC examinations are:
      </p>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Field</th>
            <th className="py-2 pr-3 font-semibold text-ink">Photo</th>
            <th className="py-2 pr-3 font-semibold text-ink">Signature</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Format</td>
            <td className="py-2 pr-3">JPG / JPEG only</td>
            <td className="py-2 pr-3">JPG / JPEG only</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">File size</td>
            <td className="py-2 pr-3"><strong>20–50&nbsp;KB</strong></td>
            <td className="py-2 pr-3"><strong>10–20&nbsp;KB</strong></td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Physical size</td>
            <td className="py-2 pr-3">3.5&nbsp;×&nbsp;4.5&nbsp;cm (passport size)</td>
            <td className="py-2 pr-3">4.0&nbsp;×&nbsp;2.0&nbsp;cm</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Background</td>
            <td className="py-2 pr-3">Plain white — no cream, grey, or colour</td>
            <td className="py-2 pr-3">White paper, clean scan</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Capture method</td>
            <td className="py-2 pr-3">Live portal capture (webcam or phone)</td>
            <td className="py-2 pr-3">Upload scanned image</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Ink / style</td>
            <td className="py-2 pr-3">—</td>
            <td className="py-2 pr-3">Black ink; cursive/running hand — all-caps rejected</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Recency</td>
            <td className="py-2 pr-3">Within 3 months of notification</td>
            <td className="py-2 pr-3">—</td>
          </tr>
        </tbody>
      </table>
      <p>
        A note on pixel dimensions: coaching sources report two different
        figures — 275&nbsp;×&nbsp;354&nbsp;px and 200&nbsp;×&nbsp;230&nbsp;px
        for the photo (236&nbsp;×&nbsp;79&nbsp;px and 140&nbsp;×&nbsp;60&nbsp;px
        for the signature). Since the live-capture system resizes automatically,
        the pixel value matters less than the KB band; but verify the exact
        figure in the official notification PDF when applying.
      </p>

      <h2>Why does SSC now require live photo capture — and what does that mean for you?</h2>
      <p>
        Since the current portal iteration, SSC no longer provides a file-upload
        field for the photo. The application form opens a live camera interface
        — you take the shot right there, and the portal saves it directly. The
        reason is fraud prevention: live capture ensures the photo is recent,
        matches the candidate at the time of application, and cannot be someone
        else&apos;s image.
      </p>
      <p>
        In practical terms, preparation shifts from &ldquo;have a file ready to
        upload&rdquo; to &ldquo;have the right setup ready before you open the
        form.&rdquo; Here&apos;s what to set up:
      </p>
      <ul>
        <li>
          <strong>Background:</strong> sit in front of a plain white wall.
          Not cream, not light grey — white. The portal&apos;s validator checks
          this. If your wall is off-white or painted, hang a sheet or stand in
          front of a door.
        </li>
        <li>
          <strong>Light:</strong> face a window or a desk lamp. Even light
          across the face; no harsh shadows on one side, no backlight from a
          window behind you.
        </li>
        <li>
          <strong>Camera:</strong> if your laptop webcam takes blurry photos,
          use a phone instead. Most SSC-compatible browsers support the mobile
          camera on the portal; if not, switch to desktop Chrome and grant
          webcam permission when the browser prompts.
        </li>
        <li>
          <strong>Glasses:</strong> remove them before starting — the portal
          rejects photos with glasses.
        </li>
        <li>
          <strong>Dress:</strong> wear the formal attire you plan to use in the
          photo before opening the form. Once the session starts, there&apos;s
          no easy way to pause it.
        </li>
      </ul>
      <p>
        The live capture produces the photo file internally; the SSC portal
        then resizes and compresses it to fit the 20–50&nbsp;KB band. Your
        job is to ensure the source image is correctly lit, correctly framed,
        and against the right background — the system handles the file itself.
      </p>

      <h2>What background and dress code does the portal expect?</h2>
      <p>
        SSC is stricter about background than most other Indian exam portals.
        The official instruction is &ldquo;plain white&rdquo; — coloured
        backgrounds, cream, or light grey are all grounds for rejection, even
        if they look neutral to the eye. The automated validator checks the
        pixel distribution behind the face.
      </p>
      <ul>
        <li><strong>Background:</strong> plain white only. No patterns, no shadows, no furniture visible.</li>
        <li><strong>Attire:</strong> formal — a plain, dark-coloured shirt or blouse reads cleanly. Avoid white tops in front of a white background, as the shoulder edges blur together.</li>
        <li><strong>Glasses:</strong> strictly prohibited. Not just tinted lenses — all glasses, including prescription ones.</li>
        <li><strong>Head covering:</strong> banned except for religious reasons (turban, hijab). If worn consistently in your identity documents, it will be accepted; otherwise, remove it.</li>
        <li><strong>Expression:</strong> neutral, mouth closed, both eyes fully open. Looking directly at the camera.</li>
        <li><strong>Framing:</strong> head and the top of your shoulders should fill roughly 70–80% of the frame. Don&apos;t stand too far back.</li>
      </ul>
      <p>
        If you need to fix an existing photo&apos;s background to white before
        using it as a reference during live capture, the{" "}
        <Link href="/tools/white-background/">white background tool</Link>{" "}
        can show you what the compliant version looks like.
      </p>

      <h2>How do I prepare my signature for SSC?</h2>
      <p>
        The signature is uploaded as a regular file (not live capture), so you
        can prepare and check it before applying. The portal&apos;s validator
        checks three things: file size in the 10–20&nbsp;KB band, clean white
        background (no visible paper texture or shadow), and signature style
        (all-capitals are flagged and rejected).
      </p>
      <p>
        The right process:
      </p>
      <ul>
        <li>
          <strong>Sign on plain white A4 paper</strong> with a black ballpoint
          pen. Avoid gel pens — they can bleed slightly when photographed. Sign
          in your usual cursive or running hand across an area of roughly
          4.0&nbsp;×&nbsp;2.0&nbsp;cm.
        </li>
        <li>
          <strong>Photograph or scan it flat</strong> in good, even light. Place
          the paper on a table, hold your phone directly above it, and make sure
          there are no shadows falling across the signature. If the background
          in the image looks slightly grey or yellow, the portal will reject it.
        </li>
        <li>
          <strong>Clean and resize</strong> using the{" "}
          <Link href="/ssc-signature-resizer/">SSC signature resizer</Link>. It
          removes the paper background, trims white space around the signature,
          and compresses the result to fit inside the 10–20&nbsp;KB band — one
          step from photo to portal-ready file.
        </li>
      </ul>
      <p>
        One more thing: if your name is short and you tend to sign in block
        capitals — RAHUL, for instance — the portal will reject it. Write
        your name in a flowing cursive style, even if you don&apos;t normally
        sign that way for official documents.
      </p>

      <h2>What are the most common reasons SSC photos and signatures get rejected?</h2>
      <p>
        The portal runs automated checks on every upload. It returns a generic
        &ldquo;not as per specification&rdquo; message without telling you
        which check failed. These are the six causes, in order of frequency:
      </p>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Rejection cause</th>
            <th className="py-2 pr-3 font-semibold text-ink">The fix</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">File size out of band (too large <em>or</em> too small)</td>
            <td className="py-2 pr-3">Use the SSC-specific resizer — it targets the 20–50&nbsp;KB band, not just a ceiling</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Non-white background in live capture</td>
            <td className="py-2 pr-3">Sit in front of a plain white wall; no printed sheets or off-white paint</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Glasses visible in photo</td>
            <td className="py-2 pr-3">Remove all glasses — including prescription lenses — before capturing</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Signature background not clean white</td>
            <td className="py-2 pr-3">Use the signature resizer to remove the paper background in one step</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">All-capitals signature</td>
            <td className="py-2 pr-3">Rewrite in cursive or running hand; the portal flags capital-letter patterns</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Wrong format (HEIC from iPhone, PNG)</td>
            <td className="py-2 pr-3">The signature resizer outputs JPG automatically; for HEIC files use the{" "}
              <Link href="/convert/">format converter</Link> first</td>
          </tr>
        </tbody>
      </table>
      <p>
        The KB floor is the most missed. Candidates who compress aggressively
        to stay under 50&nbsp;KB sometimes land at 8–12&nbsp;KB — and the
        portal rejects those too. A file rejected for being too small looks
        identical in the error message to one rejected for being too large.
        For the full breakdown of rejection patterns across all Indian exam
        portals, see{" "}
        <Link href="/blog/why-exam-photo-signature-rejected/">why exam photos and signatures get rejected</Link>.
      </p>

      <h2>Do SSC CGL and SSC CHSL have the same photo requirements?</h2>
      <p>
        For photo requirements, CGL and CHSL currently match: 20–50&nbsp;KB,
        JPG, white background, live portal capture. For the signature, most
        cycles also match — 10–20&nbsp;KB, black ink on white — but at least
        one CHSL notification has specified a different physical width for the
        signature field compared to CGL. The safest approach: download your
        specific notification from{" "}
        <a href="https://ssc.gov.in" className="text-brand underline" target="_blank" rel="noopener noreferrer">ssc.gov.in</a>{" "}
        and read the photo/signature section before applying.
      </p>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Requirement</th>
            <th className="py-2 pr-3 font-semibold text-ink">SSC CGL</th>
            <th className="py-2 pr-3 font-semibold text-ink">SSC CHSL</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Photo file size</td>
            <td className="py-2 pr-3">20–50&nbsp;KB</td>
            <td className="py-2 pr-3">20–50&nbsp;KB</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Photo format</td>
            <td className="py-2 pr-3">JPG</td>
            <td className="py-2 pr-3">JPG</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Photo background</td>
            <td className="py-2 pr-3">Plain white</td>
            <td className="py-2 pr-3">Plain white</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Signature file size</td>
            <td className="py-2 pr-3">10–20&nbsp;KB</td>
            <td className="py-2 pr-3">10–20&nbsp;KB</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Signature width</td>
            <td className="py-2 pr-3">4.0&nbsp;cm</td>
            <td className="py-2 pr-3">Confirm in notification</td>
          </tr>
        </tbody>
      </table>
      <p>
        IBPS PO uses the same 20–50&nbsp;KB photo and 10–20&nbsp;KB signature
        spec. If you&apos;re applying to both, one well-prepared signature file
        will cover both portals. For the IBPS PO checklist, see the{" "}
        <Link href="/blog/ibps-po-2026-photo-signature-checklist/">IBPS PO 2026 photo &amp; signature checklist</Link>.
      </p>

      <h2>How to prepare your SSC photo and signature — complete workflow</h2>
      <p>
        For the photo, the work happens before the form opens, not inside it:
      </p>
      <ol>
        <li>
          <strong>Set up your space.</strong> Plain white wall or hung white
          sheet. Window light or desk lamp facing you. No glasses. Formal attire.
        </li>
        <li>
          <strong>Open the application form</strong> on the SSC portal and
          navigate to the photo section. The portal will prompt your browser
          for webcam or camera access — grant it. Use your phone camera if your
          laptop&apos;s webcam produces blurry images.
        </li>
        <li>
          <strong>Capture and confirm.</strong> The portal saves the photo
          automatically after a brief review step. Check that the background
          looks clean white in the preview before confirming.
        </li>
      </ol>
      <p>
        For the signature, prepare it offline first:
      </p>
      <ol>
        <li>
          <strong>Sign on white A4 paper</strong> in black ballpoint ink,
          cursive hand, roughly 4.0&nbsp;×&nbsp;2.0&nbsp;cm.
        </li>
        <li>
          <strong>Photograph flat</strong> in even light; check for shadows.
        </li>
        <li>
          <strong>Run it through the{" "}
          <Link href="/ssc-signature-resizer/">SSC signature resizer</Link></strong>.
          It removes the paper background, trims the edges, and outputs a clean
          JPG in the 10–20&nbsp;KB band. Everything runs in your browser —
          your signature file is never uploaded to a server.
        </li>
        <li>
          <strong>Save the file</strong> with a clear name (e.g.{" "}
          <code>ssc-signature-2026.jpg</code>) so you can find it when the
          form opens.
        </li>
      </ol>
      <p>
        For exams that additionally require your name and date printed on the
        photo — UPSC and Indian Army, not CGL or CHSL — see{" "}
        <Link href="/blog/add-name-date-on-exam-photo/">how to add name and date on an exam photo</Link>.
        The general photo and signature size requirements across all major exams
        are in the{" "}
        <Link href="/blog/exam-photo-signature-size-guide/">exam photo and signature size guide</Link>.
      </p>

      <div className="mt-12">
        <Faq items={[
          {
            q: "Can I upload a saved photo from my phone gallery for SSC CGL?",
            a: "No. The current SSC portal requires live photo capture — a webcam or phone camera opened directly through the application form. The option to upload an existing file is not available. Set up your background and lighting before opening the form.",
          },
          {
            q: "What is the minimum file size for an SSC CGL photo?",
            a: "20 KB. The portal enforces a band: files below 20 KB are rejected just as firmly as files above 50 KB. Use a resizer that targets the full 20–50 KB range, not one that simply compresses to the smallest possible size.",
          },
          {
            q: "Why does SSC reject a signature written in all capital letters?",
            a: "The SSC portal runs a pattern check that flags signatures written entirely in capital letters — a style considered inconsistent with a personal signature. Write your name in cursive or a flowing running hand. If you normally sign in block capitals, practise a simple connected version for the application.",
          },
          {
            q: "Are SSC CGL and SSC CHSL photo requirements the same?",
            a: "For the photo: yes — both currently require 20–50 KB JPG with a plain white background. For the signature, specifications have matched in recent cycles but can differ slightly per notification. Download the official CHSL notification from ssc.gov.in and check the photo/signature table before applying.",
          },
          {
            q: "My iPhone saves photos as HEIC. Can I use that format for the SSC signature?",
            a: "No. SSC portals accept JPG only. For photos taken on iPhone, use the SSC signature resizer — it accepts HEIC and outputs JPG automatically. Alternatively, switch your iPhone to JPEG mode in Settings → Camera → Formats before taking the photo.",
          },
        ]} />
      </div>
    </BlogPostLayout>
  );
}
