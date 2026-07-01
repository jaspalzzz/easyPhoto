import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { getPost } from "@/lib/blog";

const post = getPost("indian-passport-photo-requirements")!;

const FAQ_ITEMS = [
  {
    q: "What is the exact size of an Indian passport photo in 2026?",
    a: "For the physical form, a printed photo of 45×35 mm (height × width). For the Passport Seva online upload, a JPEG of exactly 630×810 px and under 250 KB. Both are portrait rectangles in a 9:7 ratio. The 2×2 inch square is the US specification — India is not square.",
  },
  {
    q: "Can I wear glasses in my Indian passport photo?",
    a: "No. Since the ICAO biometric update, glasses are not permitted for Indian passport photos — including prescription glasses. This rule applies to domestic Passport Seva, overseas embassy applications, and OCI cards. If you wear glasses daily, you must still submit a photo without them.",
  },
  {
    q: "What background colour is required for an Indian passport photo?",
    a: "Plain white or near-white with no patterns, shadows, or gradients. Cream or light grey is not acceptable — it must be white. If shadows appear on the background, the PSK officer will reject the photo at the counter.",
  },
  {
    q: "How old can my passport photo be?",
    a: "Passport Seva requires the photo to be recent and to look like you at the time of application. There is no officially stated expiry date like some countries use, but UPSC's 10-day rule for CSE is an anomaly; for most Indian passport applications 6 months is the practical guideline followed by PSK counters.",
  },
  {
    q: "Is a printed passport photo required or can I just upload digitally?",
    a: "Both. You upload the JPEG (630×810 px, under 250 KB) during the online form, and you bring two printed 45×35 mm physical photos to the PSK appointment. The printed photos must be photo-lab quality — a home or office inkjet print is explicitly rejected.",
  },
  {
    q: "Do OCI card and Indian e-Visa use the same photo spec?",
    a: "No. OCI card requires a 51×51 mm square photo on a light (not pure white) background. Indian e-Visa requires a square photo with a white background and specific head-height ratios set by the destination country's embassy. Reusing an Indian passport photo for either document is a common rejection cause.",
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
        Getting your Indian passport photo wrong is one of the most common reasons
        applications stall at the Passport Seva Kendra counter. The officer checks
        several things in under a minute: size, background, expression, print
        quality, and whether your photo actually looks like you. This checklist
        covers every requirement so you arrive with a photo that passes.
      </p>

      <p>
        <strong>Quick summary:</strong> the physical photo is <strong>45×35 mm</strong>{" "}
        (portrait), the digital upload for Passport Seva is <strong>630×810 px JPEG
        under 250 KB</strong>, the background must be <strong>plain white</strong>, glasses
        are <strong>not permitted</strong>, and the print must come from a photo lab.
        Not an inkjet printer.
      </p>

      <h2>The 12-point Indian passport photo compliance checklist</h2>

      <p>
        The Ministry of External Affairs specifies these requirements through
        passportindia.gov.in. Use this as a pre-submission checklist before you
        print or upload.
      </p>

      <figure className="my-8">
        <svg viewBox="0 0 760 420" role="img" aria-label="12-point Indian passport photo compliance checklist showing all requirements in a visual grid" style={{maxWidth:"100%",height:"auto",fontFamily:"system-ui,sans-serif"}}>
          <title>Indian Passport Photo Compliance Checklist</title>
          <desc>12 requirements: size 45×35mm, white background, face 80-85%, eyes open neutral expression, no glasses, ears visible, mouth closed, no head covering except religious, no shadows, recent photo, lab print quality, plain clothing.</desc>
          <rect x="0" y="0" width="760" height="38" fill="#163A6B" rx="8"/>
          <text x="380" y="25" textAnchor="middle" fontSize="13" fontWeight="700" fill="#F4C63F">Indian Passport Photo — 12 Requirements (passportindia.gov.in)</text>
          {[
            {n:"1",label:"Photo size",val:"45 × 35 mm (print) · 630 × 810 px JPEG (digital)",col:0},
            {n:"2",label:"File size",val:"Under 250 KB for Passport Seva upload",col:1},
            {n:"3",label:"Background",val:"Plain white — no cream, grey, patterns or shadows",col:0},
            {n:"4",label:"Face coverage",val:"80–85 % of the frame height",col:1},
            {n:"5",label:"Expression",val:"Neutral — no smiling, no squinting",col:0},
            {n:"6",label:"Eyes",val:"Open, looking directly at the camera",col:1},
            {n:"7",label:"Mouth",val:"Closed",col:0},
            {n:"8",label:"Glasses",val:"NOT permitted (prescription or sunglasses)",col:1},
            {n:"9",label:"Head covering",val:"Only for religious reasons; ears must be visible",col:0},
            {n:"10",label:"Lighting",val:"Even — no shadows on face or background",col:1},
            {n:"11",label:"Recency",val:"Taken within 6 months, looks like you now",col:0},
            {n:"12",label:"Print quality",val:"Photo lab only — inkjet prints rejected",col:1},
          ].map((item, i) => {
            const col = item.col;
            const row = Math.floor(i / 2);
            const x = col === 0 ? 10 : 390;
            const y = 48 + row * 48;
            return (
              <g key={item.n}>
                <rect x={x} y={y} width="370" height="40" rx="5" fill="#163A6B" opacity={i % 4 < 2 ? 0.06 : 0.03}/>
                <rect x={x+4} y={y+8} width="24" height="24" rx="4" fill="#163A6B"/>
                <text x={x+16} y={y+25} textAnchor="middle" fontSize="11" fontWeight="800" fill="white">{item.n}</text>
                <text x={x+34} y={y+17} fontSize="10.5" fontWeight="700" fill="currentColor">{item.label}</text>
                <text x={x+34} y={y+30} fontSize="9.5" fill="currentColor" opacity="0.65">{item.val}</text>
              </g>
            );
          })}
          <text x="380" y="414" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.4">Source: passportindia.gov.in — verify before applying</text>
        </svg>
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">All 12 requirements must be met. A single failure at the PSK counter means resubmission.</figcaption>
      </figure>

      <h2>Size and digital upload specification</h2>

      <p>
        India uses a <strong>portrait rectangle</strong>, not a square. The physical
        photo is <strong>45 mm tall by 35 mm wide</strong>. This is the dimension that goes
        on paper application forms and the printed photos you hand to the PSK officer.
        For the Passport Seva online form, the digital spec is{" "}
        <strong>630 × 810 px (width × height) as a JPEG, under 250 KB</strong>. These are
        the same 7:9 ratio expressed in pixels.
      </p>

      <p>
        The portal sometimes states a 300 KB or even 1 MB ceiling in different help
        documents, but staying under 250 KB satisfies every version of the spec. If
        you submit a photo taken on a modern smartphone (typically 2–10 MB), you
        must resize and compress it before uploading; the portal will reject
        anything over the cap.
      </p>

      <p>
        You also need <strong>two printed physical photos</strong> for the PSK appointment:
        one for the officer and one to keep as a record. These are the 45×35 mm
        prints, not the digital file.
      </p>

      <h2>Background requirements</h2>

      <p>
        The background must be <strong>plain white</strong>. Not cream, not light grey,
        not off-white. White. There must be no pattern, texture, or gradient behind
        you. This is stricter than many other countries: the UK accepts light grey,
        Canada accepts white or light grey, but India requires white.
      </p>

      <p>
        Equally important: <strong>no shadows on the background</strong>. A shadow
        appears when you stand too close to the wall or the light source is
        positioned to one side. The PSK officer looks specifically for background
        shadows because they are a sign the background was digitally manipulated
        rather than naturally white.
      </p>

      <p>
        If your background is not white, you can use the{" "}
        <Link href="/passport-photo/">free background replacer</Link> to set it to white
        automatically; no upload needed, runs entirely in your browser.
      </p>

      <h2>Face size, position, and expression</h2>

      <p>
        Your face must fill <strong>80–85% of the photo height</strong>. This is the
        ICAO biometric requirement: facial recognition systems need the face to
        occupy a consistent proportion of the frame. A photo where the face is too
        small (common when taken from too far away) will be rejected.
      </p>

      <p>
        Specific requirements for face position and expression:
      </p>

      <ul>
        <li>Face centred in the frame — not tilted left or right</li>
        <li>Head straight — no chin up, no chin down</li>
        <li>Eyes open and looking directly at the lens</li>
        <li>Mouth <strong>closed</strong></li>
        <li>Neutral expression — no smiling, no raised eyebrows</li>
        <li>Both ears visible (hair should not cover the ears)</li>
      </ul>

      <p>
        Smiling is the most common expression mistake. It is natural to smile for a
        camera, but passport photos require a neutral, relaxed expression. A slight
        smile that does not show teeth is borderline; a visible tooth or dimple will
        get the photo rejected.
      </p>

      <h2>Glasses rule</h2>

      <p>
        <strong>Glasses are not permitted</strong> for Indian passport photos. This
        applies to prescription glasses, reading glasses, and sunglasses. The
        restriction exists because frames obstruct the eye region that biometric
        systems use for facial recognition at immigration checkpoints.
      </p>

      <p>
        This changed with the ICAO biometric update. If you have an older passport
        taken with glasses, your renewal photo must be without them. There are no
        medical exemptions listed by Passport Seva — if you cannot remove your
        glasses, contact your regional passport office before applying.
      </p>

      <h2>Head covering rule</h2>

      <p>
        Head coverings are <strong>only permitted for religious reasons</strong>:
        turbans, hijabs, niqabs, and similar. Even when a head covering is worn for
        religious reasons, both ears must be visible, and the face from the forehead
        hairline to the chin must be completely uncovered. Wearing a cap, hat, or
        hair band for non-religious reasons is not permitted.
      </p>

      <h2>Print quality requirement</h2>

      <p>
        The physical photos must be <strong>printed on photographic paper by a photo
        lab</strong>. Passport Seva explicitly states that photographs printed on a
        computer printer or an inkjet printer will not be accepted at the PSK counter.
      </p>

      <p>
        This rule applies to the <em>physical</em> photos, not the digital upload.
        You can prepare, crop, and resize the image yourself, but take the final file
        to a photo lab for printing. Most chemists, stationery shops, and mobile
        photo studios can print a 45×35 mm photo from a file on your phone.
      </p>

      <h2>What the PSK officer checks at the counter</h2>

      <p>
        When you arrive at the Passport Seva Kendra, the counter officer checks your
        physical photos before proceeding. Based on the Passport Seva guidelines and
        common applicant experiences, the officer typically verifies:
      </p>

      <ol>
        <li><strong>Photo looks like you</strong> — matches your current appearance</li>
        <li><strong>White background with no shadows</strong></li>
        <li><strong>Face is not too small or too large</strong> in the frame</li>
        <li><strong>No glasses</strong></li>
        <li><strong>Photo quality</strong> — is it a photo-paper print or an inkjet?</li>
        <li><strong>No creases or markings</strong> on the photo</li>
        <li><strong>Eyes open, neutral expression</strong></li>
      </ol>

      <p>
        The officer does not measure the photo with a ruler — they check it visually.
        However, if your photo is obviously not 45×35 mm (too square, too wide, or
        too tall), it will fail this visual check. Use the free{" "}
        <Link href="/passport-photo/">passport photo maker</Link> to crop to the exact
        ratio before printing.
      </p>

      <h2>Requirements for specific passport types</h2>

      <p>
        Most of the requirements above apply to all Indian passport types, but a
        few vary:
      </p>

      <h3>Minors (under 18)</h3>
      <p>
        Children follow the same photo rules as adults — white background, eyes
        open, neutral expression, no glasses. For infants and toddlers, the mouth
        does not need to be closed if the child cannot cooperate. Eyes must be
        visible. The child should not be held by an adult in the photo — no hands or
        clothing from another person should appear. Use a plain white sheet under the
        baby to photograph them lying down.
      </p>

      <h3>Tatkal passport</h3>
      <p>
        A Tatkal passport application uses the same photo spec as a normal
        application — 45×35 mm print, 630×810 px JPEG, white background, no
        glasses. The faster processing time does not change what the photo must look
        like.
      </p>

      <h3>Passport renewal (re-issue)</h3>
      <p>
        The photo spec is the same as a fresh application. However, if your
        appearance has changed significantly since your old passport photo (weight
        change, surgery, age), the officer may take extra care to verify your
        identity. Bring the best photo you can, not one from years ago repurposed.
      </p>

      <h3>Police Verification Certificate (PVC)</h3>
      <p>
        The police verification photo is <strong>different</strong> from the passport
        photo. For PVC, you typically submit a standard passport-size photo
        (45×35 mm) with your home address written on the back, but the officer
        collecting it may have additional local requirements. Confirm at your local
        police station; the spec is not standardised nationally.
      </p>

      <h2>OCI card and Indian e-Visa: different requirements</h2>

      <p>
        The OCI (Overseas Citizen of India) card and Indian e-Visa have different
        photo specifications from the domestic passport:
      </p>

      <div className="my-6 overflow-x-auto rounded-xl border border-hairline text-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-hairline bg-accent/30">
              <th className="px-4 py-3 text-left font-semibold text-ink">Document</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Size</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Shape</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Background</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Indian Passport (domestic)", "45 × 35 mm / 630×810 px", "Portrait rectangle", "Plain white"],
              ["OCI Card", "51 × 51 mm (2×2 in)", "Square", "Light (not pure white)"],
              ["Indian e-Visa", "Varies by destination", "Square (usually)", "White"],
              ["Police Verification", "45 × 35 mm (typical)", "Portrait rectangle", "Light background"],
            ].map(([doc, size, shape, bg]) => (
              <tr key={doc} className="border-b border-hairline last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{doc}</td>
                <td className="px-4 py-3 text-ink-soft">{size}</td>
                <td className="px-4 py-3 text-ink-soft">{shape}</td>
                <td className="px-4 py-3 text-ink-soft">{bg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        Using a domestic passport photo for an OCI card application is one of the
        most common rejection causes for NRI applicants. The OCI photo is a square
        (2×2 inches), not a portrait rectangle. Check the specific country&apos;s VFS or
        embassy instructions for the exact OCI digital dimensions and background
        shade required for your application.
      </p>

      <h2>Applying from abroad (NRI and embassy route)</h2>

      <p>
        From 1 September 2025, Indian passport applications processed through Indian
        embassies and consulates abroad require an <strong>ICAO-compliant biometric
        photograph</strong>. The practical effect for most applicants is that the
        white background rule and the no-glasses rule are enforced even more
        strictly. The photo size (45×35 mm) remains the same.
      </p>

      <p>
        If you are applying through VFS Global, confirm photo requirements on the VFS
        portal for your country; some VFS centres have slightly different acceptance
        criteria (particularly around acceptable background shades) compared to the
        domestic PSK process.
      </p>

      <h2>Common reasons passport photos are rejected</h2>

      <p>
        Based on the Passport Seva guidelines and common applicant reports, these are
        the most frequent rejection reasons:
      </p>

      <ol>
        <li><strong>Background not white</strong> — cream, grey, or shadow visible</li>
        <li><strong>Glasses not removed</strong> — any type of glasses</li>
        <li><strong>Face too small</strong> — taken from too far away</li>
        <li><strong>Expression incorrect</strong> — smiling, open mouth</li>
        <li><strong>Inkjet print</strong> — not a photo-lab print</li>
        <li><strong>Photo looks old</strong> — does not match current appearance</li>
        <li><strong>Shadow on face</strong> — uneven lighting, one-sided flash</li>
        <li><strong>Head covering</strong> — non-religious, or face partially covered</li>
        <li><strong>Red-eye or flash artefacts</strong> visible in the photo</li>
        <li><strong>Photo creased or damaged</strong> — wrinkled or marked</li>
      </ol>

      <h2>How to prepare a compliant photo step by step</h2>

      <ol>
        <li>
          <strong>Take the photo in good light.</strong> Natural daylight facing a
          window is ideal. Avoid direct flash which creates shadows behind you and
          red-eye. Stand 1–2 metres from a plain white wall.
        </li>
        <li>
          <strong>Remove glasses.</strong> Take the photo without glasses, even if
          you wear them daily.
        </li>
        <li>
          <strong>Check background.</strong> The wall behind you should appear white
          in the photo. If it shows any shade, use the{" "}
          <Link href="/passport-photo/">background replacer</Link> to set it to white.
        </li>
        <li>
          <strong>Crop to the right ratio.</strong> Use the{" "}
          <Link href="/passport-photo/">free passport photo maker</Link> — it crops to
          exactly 630×810 px with the face centred automatically.
        </li>
        <li>
          <strong>Check face coverage.</strong> Your face should fill 80–85% of the
          frame height. Use the{" "}
          <Link href="/tools/face-centering/">face centering checker</Link> to verify.
        </li>
        <li>
          <strong>Compress to under 250 KB.</strong> The{" "}
          <Link href="/tools/resize-kb/">photo compressor</Link> lets you target an
          exact KB ceiling without visible quality loss.
        </li>
        <li>
          <strong>Print at a photo lab.</strong> Save the JPEG and get it printed on
          45×35 mm photo paper at a chemist, studio, or mobile print shop. Do not
          use an inkjet printer.
        </li>
        <li>
          <strong>Bring two prints to the PSK appointment.</strong> Keep a digital
          copy of the file in case the officer requests a replacement.
        </li>
      </ol>

      <h2>Run a quick quality check before you go</h2>

      <p>
        Before your PSK appointment, run your photo through the{" "}
        <Link href="/tools/photo-rejection-check/">Rejection Predictor</Link> — it checks
        9 ICAO criteria (background, face coverage, tilt, lighting, expression
        markers) entirely on your device. If the tool flags an issue, fix it before
        you print. A reprinting is cheaper than rescheduling a PSK appointment.
      </p>
    </BlogPostLayout>
  );
}
