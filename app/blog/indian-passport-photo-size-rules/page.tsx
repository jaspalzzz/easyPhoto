import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("indian-passport-photo-size-rules")!;

const FAQ_ITEMS = [
  {
    q: "Is the Indian passport photo size 35×45 mm or 2×2 inches?",
    a: "45×35 mm (4.5×3.5 cm) for the domestic Passport Seva process — a portrait rectangle. The 2×2 inch (51×51 mm) square is the US specification, not India's. Some international tools wrongly apply the US square to their India preset, which is a common rejection cause. For the online upload the digital size is exactly 630×810 px, which is the same 7:9 proportion as 45×35 mm.",
  },
  {
    q: "What is the file size limit for the online passport photo upload?",
    a: "The Passport Seva photo-upload spec requires a JPEG that is exactly 630×810 px and under 250 KB. Reported caps have varied (250/300/1024 KB across sources), so staying under 250 KB is the safe choice that satisfies all of them. Confirm the current limit on passportindia.gov.in before uploading.",
  },
  {
    q: "Can I use a photo taken on my phone for an Indian passport?",
    a: "Yes. A phone photo works if it meets the spec: plain white background, face filling 80–85% of the frame, head centred and straight, neutral expression, no glasses, and good even lighting. Take it against a brightly lit white surface, then crop to 45×35 mm. For the pasted paper photo you'll still need a real photo-lab print — a home computer printout is not accepted.",
  },
  {
    q: "Why does Passport Seva reject computer-printed photos?",
    a: "For the physical photo pasted on the form, Passport Seva requires a genuine photo-paper lab print and explicitly states that a photograph printed on a computer or inkjet printer will not be accepted. You can prepare and crop the image yourself, but get the final print done at a photo lab. This rule does not apply to the online upload, where you submit the JPEG directly.",
  },
  {
    q: "Is the OCI card photo the same as the passport photo?",
    a: "No. The OCI card photo is a 51×51 mm square on a light (not pure white) background — different in both shape and background from the 45×35 mm white passport photo. Reusing a passport photo for an OCI application is a common rejection. Prepare the OCI photo separately as a square.",
  },
  {
    q: "Did the photo rules change in September 2025?",
    a: "An ICAO-compliant photograph requirement took effect from 1 September 2025 for applications through Indian embassies and consulates abroad (the NRI route, often via VFS). It did not change the domestic Passport Seva Kendra spec, which already used the 45×35 mm white-background format. If you're applying inside India, follow the domestic rules; if abroad, confirm with your local mission.",
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
    <BlogPostLayout slug={post.slug} faqItems={FAQ_ITEMS}>
      <p>
        The Indian passport photo spec confuses people because there are really
        two of them — one for the <strong>printed photo</strong> you paste on a
        paper form, and one for the <strong>digital photo</strong> you upload to
        the Passport Seva portal — and a third, different spec entirely if
        you&apos;re applying through an embassy abroad or for an OCI card. Here is
        every rule, where each applies, and how to make a compliant photo for free.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li><strong>Printed photo:</strong> 45&nbsp;×&nbsp;35&nbsp;mm (4.5&nbsp;×&nbsp;3.5&nbsp;cm), plain white background, from a real photo lab — computer printouts are not accepted.</li>
          <li><strong>Online upload:</strong> exactly <strong>630&nbsp;×&nbsp;810&nbsp;px</strong> JPEG, <strong>under 250&nbsp;KB</strong>, plain white background.</li>
          <li>Face must fill <strong>80–85%</strong> of the frame, head centred, both ears visible, neutral expression, no glasses.</li>
          <li><strong>OCI card</strong> and <strong>embassy/NRI</strong> applications use different specs — see below.</li>
          <li>Always confirm current numbers at{" "}
            <a href="https://www.passportindia.gov.in" className="text-brand underline" target="_blank" rel="noopener noreferrer">passportindia.gov.in</a>.</li>
        </ul>
      </div>

      <figure className="my-7 overflow-hidden rounded-xl border border-hairline">
        <Image
          src="/images/indian-passport-photo-size-rules.png"
          alt="Indian passport photo size diagram showing 35×45 mm frame, face height zone of 25–35 mm, and compliance requirements"
          width={760}
          height={760}
          className="w-full h-auto"
        />
        <figcaption className="bg-accent/30 px-4 py-2.5 text-center text-[12.5px] text-muted-foreground">
          Indian passport photo dimensions: 35×45 mm frame, face must occupy 25–35 mm of the height, white or off-white background.
        </figcaption>
      </figure>

      <figure className="my-8">
        <svg viewBox="0 0 760 320" role="img" aria-label="Indian passport photo specification diagram: 45×35mm, white background, face 80-85% of frame" style={{maxWidth:"100%",height:"auto",fontFamily:"system-ui,sans-serif"}}>
          <title>Indian Passport Photo Specification</title>
          <desc>Diagram showing Indian passport photo: 45×35mm portrait, plain white background, face occupying 80–85% of frame height, uploaded as 630×810px JPEG under 250KB for Passport Seva portal.</desc>
          {/* Background */}
          <rect x="0" y="0" width="760" height="320" fill="none"/>
          {/* Left: Photo frame */}
          <rect x="40" y="30" width="210" height="270" rx="4" fill="white" stroke="#163A6B" strokeWidth="2.5"/>
          {/* Face placeholder */}
          <ellipse cx="145" cy="145" rx="68" ry="82" fill="#e8eef6"/>
          <ellipse cx="145" cy="95" rx="38" ry="40" fill="#c9d6e8"/>
          {/* Shoulder */}
          <path d="M77 270 Q145 220 213 270" fill="#c9d6e8"/>
          {/* Dimension arrows */}
          <line x1="38" y1="30" x2="38" y2="300" stroke="#163A6B" strokeWidth="1.5" markerEnd="url(#arrowB)" markerStart="url(#arrowT)"/>
          <text x="29" y="170" textAnchor="middle" fontSize="11" fill="#163A6B" fontWeight="700" transform="rotate(-90,29,170)">45 mm (height)</text>
          <line x1="40" y1="312" x2="250" y2="312" stroke="#163A6B" strokeWidth="1.5"/>
          <text x="145" y="320" textAnchor="middle" fontSize="11" fill="#163A6B" fontWeight="700">35 mm (width)</text>
          {/* Head proportion line */}
          <line x1="252" y1="63" x2="265" y2="63" stroke="#F4C63F" strokeWidth="1.5"/>
          <line x1="252" y1="227" x2="265" y2="227" stroke="#F4C63F" strokeWidth="1.5"/>
          <line x1="259" y1="63" x2="259" y2="227" stroke="#F4C63F" strokeWidth="1.5"/>
          <text x="271" y="152" fontSize="10" fill="#F4C63F" fontWeight="700">80–85%</text>
          <text x="271" y="165" fontSize="9.5" fill="currentColor" opacity="0.6">of height</text>
          {/* Right: spec list */}
          <rect x="340" y="20" width="380" height="280" rx="10" fill="#163A6B" opacity="0.06"/>
          <text x="530" y="50" textAnchor="middle" fontSize="14" fontWeight="700" fill="#163A6B">Passport Seva Requirements</text>
          {[
            {label:"Print size",value:"45 × 35 mm (portrait)"},
            {label:"Digital size",value:"630 × 810 px JPEG"},
            {label:"File size",value:"Under 250 KB"},
            {label:"Background",value:"Plain white (no shading)"},
            {label:"Face coverage",value:"80–85% of frame height"},
            {label:"Expression",value:"Neutral, eyes open, mouth closed"},
            {label:"Glasses",value:"Not permitted"},
            {label:"Print type",value:"Photo lab — no inkjet"},
          ].map((row, i) => (
            <g key={row.label}>
              <text x="360" y={78 + i * 28} fontSize="11" fontWeight="600" fill="#163A6B">{row.label}</text>
              <text x="490" y={78 + i * 28} fontSize="11" fill="currentColor" opacity="0.75">{row.value}</text>
            </g>
          ))}
          <text x="530" y="306" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.4">Source: passportindia.gov.in · verify before applying</text>
        </svg>
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">Indian Passport Seva photo spec — domestic applications. OCI and e-Visa use different dimensions.</figcaption>
      </figure>

      <h2>What size is an Indian passport photo?</h2>
      <p>
        For the <strong>domestic Passport Seva</strong> process, the printed
        photograph is <strong>45&nbsp;×&nbsp;35&nbsp;mm (4.5&nbsp;×&nbsp;3.5&nbsp;cm)</strong>.
        A portrait rectangle, taller than it is wide. This is not the US
        2&nbsp;×&nbsp;2&nbsp;inch (51&nbsp;×&nbsp;51&nbsp;mm) square; several
        international tools wrongly apply the US size to their &ldquo;India&rdquo;
        preset, which is the most common reason an otherwise-good photo is rejected.
      </p>
      <p>
        For the <strong>online application</strong>, Passport Seva&apos;s
        photo-upload instructions require a digital image that is{" "}
        <strong>exactly 630&nbsp;×&nbsp;810&nbsp;px</strong> in JPEG format,{" "}
        <strong>under 250&nbsp;KB</strong>. That pixel ratio (630:810) is the same
        7:9 proportion as the 45&nbsp;×&nbsp;35&nbsp;mm print; they are the same
        shape, just one is measured in millimetres and the other in pixels.
      </p>
      <div className="my-5 overflow-x-auto rounded-xl border border-hairline text-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-hairline bg-accent/30">
              <th className="px-4 py-3 text-left font-semibold text-ink">Requirement</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Printed photo</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Online upload</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline text-ink-soft">
            <tr>
              <td className="px-4 py-3 font-medium text-ink">Size</td>
              <td className="px-4 py-3">45 × 35 mm (4.5 × 3.5 cm)</td>
              <td className="px-4 py-3">630 × 810 px</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">Format</td>
              <td className="px-4 py-3">Photo-lab print on photo paper</td>
              <td className="px-4 py-3">JPEG</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">File size</td>
              <td className="px-4 py-3">—</td>
              <td className="px-4 py-3">Under 250 KB</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">Background</td>
              <td className="px-4 py-3">Plain white</td>
              <td className="px-4 py-3">Plain white</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">Face coverage</td>
              <td className="px-4 py-3">80–85% of frame</td>
              <td className="px-4 py-3">80–85% of frame</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">Computer printout</td>
              <td className="px-4 py-3">Not accepted</td>
              <td className="px-4 py-3">N/A</td>
            </tr>
          </tbody>
        </table>
        <p className="border-t border-hairline px-4 py-2 text-xs text-muted-foreground">
          Source: Passport Seva photo-upload instructions and PSK &ldquo;DOs &amp; DON&apos;Ts for Photograph&rdquo;, verified June 2026 against{" "}
          <a href="https://www.passportindia.gov.in" className="text-brand underline" target="_blank" rel="noopener noreferrer">passportindia.gov.in</a>. Confirm current limits before applying.
        </p>
      </div>

      <div className="my-6 rounded-xl border border-brand/20 bg-brand-soft/10 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Make a compliant Indian passport photo free</p>
        <p className="!mt-1 text-[15px] text-ink-soft">
          Drop in your photo — the tool outputs a white-background 630×810&nbsp;px JPEG under 250&nbsp;KB for
          the Passport Seva portal, and a print-ready 35×45&nbsp;mm crop. Nothing uploaded.
        </p>
        <div className="mt-3">
          <Link href="/passport-photo/" className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white">
            Make my passport photo →
          </Link>
        </div>
      </div>

      <h2>The white background rule</h2>
      <p>
        The background must be <strong>plain white</strong> — and Passport Seva
        checks it strictly, including the luminance, so an off-white, cream, or
        light-grey wall can fail. There should be no shadows falling on the
        background behind you and no objects, furniture, or texture in the frame.
      </p>
      <p>
        White is harder to photograph than people expect: a white wall in normal
        room light usually comes out grey or yellow. The fix is either a true
        background replacement or shooting against a brightly and evenly lit white
        surface. For the full breakdown of why white matters and how it differs
        across countries, see{" "}
        <Link href="/blog/passport-photo-background-color/">passport photo background colour</Link>.
      </p>

      <h2>Face size, position and expression</h2>
      <p>
        Your face must take up <strong>80–85% of the photo</strong> — measured
        from the bottom of the chin to the top of the head. On a 45&nbsp;mm-tall
        photo that is roughly 36–38&nbsp;mm of face. Too small (a distant shot
        with lots of background) and too large (a tight crop that clips the top of
        the head) are both rejected.
      </p>
      <ul>
        <li><strong>Full head visible</strong> — from the top of the hair to the bottom of the chin, with both edges of the face inside the frame.</li>
        <li><strong>Head centred and straight</strong> — not tilted, looking directly at the camera.</li>
        <li><strong>Both ears visible</strong> where possible — frontal full-face view.</li>
        <li><strong>Neutral expression</strong> — eyes open and clearly visible, mouth closed, no hair across the eyes.</li>
        <li><strong>No glasses</strong> — Passport Seva asks for glasses to be removed to avoid glare and reflections.</li>
        <li><strong>Head coverings</strong> only for religious reasons, and even then the face from chin to forehead and both edges must be fully visible.</li>
      </ul>
      <p>
        Dark or contrasting clothing helps you stand out against the white
        background. For a step-by-step on getting these right at home with just a
        phone, see{" "}
        <Link href="/blog/how-to-take-a-passport-photo-at-home/">how to take a passport photo at home</Link>.
      </p>

      <h2>The &ldquo;no computer printout&rdquo; rule</h2>
      <p>
        One rule trips up people who make their own photos: for the{" "}
        <strong>pasted paper photograph</strong>, Passport Seva states that a
        photograph printed on a computer or inkjet printer will <em>not</em> be
        accepted. It must be a genuine photo-paper lab print. You can absolutely
        prepare and crop the photo yourself; you just need to get the final image
        printed at a photo lab (or use a print service) rather than running it
        through a home printer onto ordinary paper.
      </p>
      <p>
        This rule applies only to the physical pasted photo. For the{" "}
        <strong>online upload</strong>, you submit the 630&nbsp;×&nbsp;810&nbsp;px
        JPEG directly — no printing involved.
      </p>

      <h2>Applying from abroad (NRI / embassy applications)</h2>
      <p>
        If you are applying through an <strong>Indian embassy or consulate
        abroad</strong> (often via VFS), a widely-reported change effective{" "}
        <strong>1 September 2025</strong> moved those applications to{" "}
        <strong>ICAO-compliant photographs</strong>. This is the same 45&nbsp;×&nbsp;35&nbsp;mm
        portrait proportion and white background, with the ICAO biometric rules:
        face 80–85% of the frame, taken from about 1.5&nbsp;metres, uniform
        lighting, no red-eye, natural expression.
      </p>
      <p>
        The important point: this ICAO switch applies to the embassy/consulate
        (NRI) route, <strong>not</strong> the domestic Passport Seva Kendra
        process, which has long used the 45&nbsp;×&nbsp;35&nbsp;mm spec already
        described. If you&apos;re applying inside India, follow the domestic rules
        above. If you&apos;re applying abroad, confirm the exact requirement on
        your local mission&apos;s page, as it can vary by country and service
        provider.
      </p>

      <h2>OCI card and Indian e-Visa are different</h2>
      <p>
        Two specs are frequently — and wrongly — treated as the same as the
        passport photo:
      </p>
      <ul>
        <li>
          <strong>OCI card:</strong> a <strong>51&nbsp;×&nbsp;51&nbsp;mm square</strong>
          photo on a <strong>light (not pure white)</strong> background. Using a
          35&nbsp;×&nbsp;45&nbsp;mm white passport photo for an OCI application is
          a common rejection.
        </li>
        <li>
          <strong>Indian e-Visa</strong> (for foreign nationals visiting India): a
          <strong> square digital photo, roughly 350–1000&nbsp;px</strong>, white
          background — different again from both the passport and OCI specs.
        </li>
      </ul>
      <p>
        If you need a square format, prepare it separately rather than reusing the
        portrait passport crop.
      </p>

      <h2>Why Indian passport photos get rejected</h2>
      <ul>
        <li><strong>Wrong size or shape</strong> — using the US 2×2 inch square instead of 45×35 mm portrait.</li>
        <li><strong>Background not white enough</strong> — grey, cream, or shadowed; fails the luminance check.</li>
        <li><strong>Face too small or too large</strong> — outside the 80–85% band.</li>
        <li><strong>Glasses, glare, or shadows</strong> on the face.</li>
        <li><strong>Computer printout</strong> pasted on the form instead of a photo-lab print.</li>
        <li><strong>Online file too large</strong> — over the 250 KB limit, or not exactly 630×810 px.</li>
      </ul>
      <p>
        For the complete rejection checklist with fixes, see{" "}
        <Link href="/blog/why-passport-photos-get-rejected/">why passport photos get rejected</Link>.
        Applying for a child? The rules relax slightly — see the{" "}
        <Link href="/blog/baby-and-infant-passport-photo-guide/">baby and infant passport photo guide</Link>.
        Comparing to other countries? See{" "}
        <Link href="/blog/passport-photo-size-by-country/">passport photo size by country</Link>.
      </p>

      <h2>How to make an Indian passport photo free</h2>
      <p>
        Upload any clear, front-facing photo to the{" "}
        <Link href="/passport-photo/">passport photo maker</Link>, choose{" "}
        <strong>India</strong>, and it crops to the 45&nbsp;×&nbsp;35&nbsp;mm
        proportion with a plain white background and the correct 80–85% face
        coverage — ready to print at a lab or upload online. Everything runs in
        your browser; nothing is uploaded to a server.
      </p>
      <p>
        For the online upload, if your exported file is over the 250&nbsp;KB cap,
        compress it to a{" "}
        <Link href="/tools/resize-kb/">custom KB target</Link> without losing the
        required dimensions. For the full guide to hitting an exact file-size limit
        on any portal, see{" "}
        <Link href="/blog/how-to-reduce-passport-photo-size-for-online-forms/">how to reduce passport photo file size</Link>.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
