type ToolDepthCopy = {
  heading: string;
  paragraphs: readonly string[];
  checklist: readonly string[];
};

const TOOL_DEPTH: Record<string, ToolDepthCopy> = {
  "face-centering": {
    heading: "How to interpret the centering overlay",
    paragraphs: [
      "The overlay compares the detected face with the middle of the image. A small horizontal offset is useful as a preparation warning, but it is not an acceptance decision: authorities can assess pose, expression, lighting and identity details that a geometric check cannot judge.",
      "Use the original camera file where possible. A screenshot, heavily compressed image or crop that cuts into the hair can make landmark detection less reliable. If the box is clearly misplaced, retake the photo against an uncluttered background before relying on the score.",
      "Centring is only one of several geometric rules, and it is rarely the one that causes a rejection on its own. Most published specifications care more about head height \u2014 the distance from chin to crown as a proportion of the frame \u2014 and about the eye line sitting within a band measured from the bottom edge. A photo can be perfectly centred and still fail because the head fills too little of the frame, which usually happens when the original was taken from too far away and then cropped.",
      "Treat the overlay as a preparation aid rather than a verdict. It reports what it can measure from landmarks in your image; it cannot see whether the lighting flattens your features, whether the expression is neutral enough, or whether the background shade matches the one your authority publishes. A photo that scores well here can still be returned, and a photo that scores slightly off-centre may still sit inside the tolerance the published rule allows.",
      "One practical habit removes most centring problems before they start: stand further back than feels natural and crop afterwards. Phone cameras held at arm's length distort features and encourage a tilted, off-centre frame, while a photo taken from two metres away on a level camera leaves room to crop precisely to the head-height band your document asks for.",
    ],
    checklist: [
      "Keep the camera level with the eyes rather than pointing up or down.",
      "Leave visible space around the crown and both shoulders before cropping.",
      "Compare the result with the current authority instructions for your document.",
    ],
  },
  "image-to-text": {
    heading: "Getting cleaner text from a photo",
    paragraphs: [
      "OCR works best when letters are upright, sharply focused and evenly lit. Crop away the desk or phone border, straighten a tilted page, and avoid reflections from laminated cards. Select Hindi only when Devanagari is present; fewer active languages usually makes recognition faster and reduces character confusion.",
      "Always proofread names, dates, account numbers and identification numbers against the image. OCR predicts characters from pixels and can confuse similar shapes such as zero and the letter O. Treat the extracted text as an editable draft, not as a verified transcription of a legal document.",
    ],
    checklist: [
      "Use the highest-resolution source rather than a messaging-app thumbnail.",
      "Photograph the page square-on so rows do not taper toward an edge.",
      "Copy only the fields you need and clear the page when finished.",
    ],
  },
  "compress-document": {
    heading: "Choose a target without making the document unreadable",
    paragraphs: [
      "Start with the file-size limit shown by the receiving form, then keep a small margin below its maximum. Photographs usually shrink through JPEG quality adjustment, while PDFs may need image downsampling. Text-heavy scans need more care because aggressive compression can blur fine characters and seals even when the file meets the requested KB value.",
      "Open the downloaded file before uploading it. Check every page, zoom into names and numbers, and confirm that the file type is still one the portal lists. If the result is hard to read, return to the original and choose a larger target instead of repeatedly compressing an already reduced copy.",
    ],
    checklist: [
      "Keep the original file until the application is complete.",
      "Verify page count and orientation after PDF compression.",
      "Use a dedicated photo or signature preset when a portal also publishes dimensions.",
    ],
  },
  "extract-pages": {
    heading: "Extract only the pages the recipient asks for",
    paragraphs: [
      "Page extraction creates a new PDF from selected pages; it does not convert or rewrite their visible content. This is useful when a portal asks for one marksheet, certificate page or signed declaration from a larger scan. Select pages in the order they should appear in the downloaded document.",
      "Review the new PDF before sharing it. Confirm that the chosen page includes its heading, identifying details, stamp or signature, and that no reverse side was accidentally omitted. Removing unrelated pages can reduce unnecessary disclosure, but never remove a continuation page that forms part of the requested record.",
    ],
    checklist: [
      "Use the thumbnail and page number together before selecting.",
      "Keep related front and reverse pages in their original order.",
      "Rename the result clearly so it is not confused with the source PDF.",
    ],
  },
  "form-fill": {
    heading: "When browser-based PDF form filling works",
    paragraphs: [
      "This tool fills interactive AcroForm fields already embedded in a PDF. It cannot discover blank lines in a scanned image or reproduce dynamic forms that depend on Adobe-specific scripts. If no fields appear, check whether the issuer provides a fillable version rather than trying to type over a scan.",
      "After downloading, reopen the completed PDF and inspect every page. Long names can be clipped by a narrow field, checkboxes may have portal-specific meanings, and some authorities require a handwritten signature after printing. The tool preserves your local workflow; it does not validate the truth or completeness of the answers.",
    ],
    checklist: [
      "Use the latest form downloaded from the issuer.",
      "Check dates, spelling and selected boxes in the final PDF.",
      "Follow the issuer's instruction for signing and submission.",
    ],
  },
  "pdf-to-text": {
    heading: "Text-layer extraction versus OCR",
    paragraphs: [
      "A digitally created PDF usually contains selectable characters, and this tool reads that text layer without photographing or reinterpreting the page. A scan may contain only page images, so it can return little or no text even though the document looks readable on screen. Use Image to Text OCR for those image-only pages.",
      "The extracted text does not preserve columns, seals, signatures or visual layout. Tables may read in a different order from the page, and embedded fonts can produce unusual characters. Compare important names, amounts and dates with the PDF before reusing them in an application or record.",
    ],
    checklist: [
      "Try selecting a word in your PDF viewer to identify a real text layer.",
      "Check page breaks and table reading order in the result.",
      "Retain the PDF as the authoritative visual record.",
    ],
  },
  "pan-card-ocr": {
    heading: "Use PAN OCR as a transcription aid",
    paragraphs: [
      "The reader looks for printed fields on a PAN card image and presents candidate text for copying. It does not contact the Income Tax Department, verify that a PAN is active, or confirm a person's identity. Review every extracted field against the card before placing it into a tax, banking or KYC form.",
      "For better recognition, use a straight, glare-free image with all four card edges visible. Reflections across the laminated surface and compression from messaging apps can turn letters into similar-looking characters. Avoid sharing the source image unnecessarily; once you have checked the transcription, clear it from the browser session.",
      "A PAN is always ten characters in one fixed pattern: five letters, four digits, then a single check letter. The fourth letter encodes the holder type \u2014 P for an individual, C for a company, H for a Hindu Undivided Family \u2014 and the fifth is normally the first letter of the surname. Knowing the shape is the fastest way to catch a bad read, because a result with six letters before the digits, or a digit where the tenth character should be, is wrong no matter how confident it looks.",
      "Photograph the card itself rather than a photocopy where you can. Laminate reflections, a folded corner over the number, or a print-of-a-print all cost accuracy, and the embossed lettering on some older cards reads poorly at an angle. If the text comes back mangled in one attempt, changing the angle to kill the reflection usually helps more than raising the resolution.",
    ],
    checklist: [
      "Pay special attention to zero/O and one/I substitutions.",
      "Confirm the name order and date directly from the card.",
      "Do not treat OCR output as PAN verification.",
      "Check the pattern: five letters, four digits, then one letter.",
    ],
  },
  "aadhaar-ocr": {
    heading: "Read locally, then verify against the card",
    paragraphs: [
      "Aadhaar OCR converts visible printed characters into editable text on your device. It does not query UIDAI, authenticate the holder or validate whether a number is current. Use it to reduce retyping, then compare each result with the original before entering it into any official or financial workflow.",
      "Use a sharp, square-on image without glare over the number or name. Aadhaar documents can mix English, Hindi and regional text, so recognition quality varies by side and print quality. Mask or avoid copying fields that the recipient does not need, and close or refresh the page after finishing.",
      "An Aadhaar number is twelve digits and carries a checksum in its final digit, so a single mistyped or misread digit almost always produces an invalid number rather than a different valid one. That makes the check useful as a proofreading aid, but it proves only that the digits are internally consistent \u2014 not that the number exists, belongs to the person shown, or matches UIDAI's records. Only UIDAI can confirm that.",
      "Think about what you actually need before extracting anything. Some recipients ask only for the last four digits, and UIDAI publishes a masked download that hides the first eight for exactly that purpose \u2014 though what any particular form requires is set by that form, not by UIDAI. Pulling the full number into a text box and pasting it somewhere it is not required is the more common privacy mistake, and it is easier to avoid at this step than to undo later.",
    ],
    checklist: [
      "Check every four-digit number group character by character.",
      "Confirm date of birth versus year-of-birth wording on the source.",
      "Use UIDAI's own services when identity verification is required.",
      "Share a masked copy where the full number is not strictly needed.",
    ],
  },
  "photo-rejection-check": {
    heading: "What this pre-check can and cannot tell you",
    paragraphs: [
      "The checker measures visible image properties such as face position, approximate head framing, tilt, background uniformity and lighting distribution. Those signals can identify common preparation issues, but they cannot assess identity, document eligibility, recency or every exception in an authority's manual review.",
      "Treat each warning as a reason to inspect the photo, not as a prediction of rejection. A result with no measurable issue still needs to match the current size, format and workflow instructions for the specific application. When a warning is caused by a poor crop, return to the original camera image rather than enlarging a small copy.",
    ],
    checklist: [
      "Retake blur, glare and strong facial shadows instead of editing them heavily.",
      "Use the authority's required background, not a generic default.",
      "Confirm the current application instructions before submission.",
    ],
  },
  "auto-crop": {
    heading: "Start with enough space for a reliable crop",
    paragraphs: [
      "Automatic cropping uses detected face landmarks and the selected frame geometry. It works best with a front-facing portrait that includes the full hair, chin and shoulders. A close selfie may leave no pixels above the crown or beside the face, so no crop can restore the missing area without adding artificial content.",
      "Choose the preset for the actual document workflow and review its source notes. Different authorities use different frames and head-size guidance, and some application centres capture the photograph themselves. The crop prepares measurable geometry; it does not replace checks for expression, clothing, recency or identity.",
    ],
    checklist: [
      "Keep the phone upright and the camera near eye level.",
      "Use even light and a plain area behind the subject.",
      "Inspect the crown, chin and shoulder margins before download.",
    ],
  },
  "pdf-reorder": {
    heading: "Rebuild the page order without changing page content",
    paragraphs: [
      "Drag pages into the sequence the recipient expects, rotate sideways scans, and remove only pages you are certain are unnecessary. The exported PDF keeps the selected page artwork; it does not rewrite text or repair a poor scan. Page numbers printed inside the document will also remain unchanged.",
      "Before downloading, compare the thumbnail order with the source document. Certificates with a reverse side, multi-page statements and annexures can lose meaning when separated. After export, open the new PDF and check its first page, final page, orientation and total page count before uploading or emailing it.",
    ],
    checklist: [
      "Keep front-and-back scans adjacent.",
      "Rotate each affected page rather than the entire document.",
      "Preserve the original PDF in case the requested order changes.",
    ],
  },
  "pdf-split": {
    heading: "Choose a split method that preserves context",
    paragraphs: [
      "Splitting is useful when a portal sets separate upload slots for a certificate, marksheet or supporting declaration. Create ranges that keep related pages together instead of automatically making one file per page. The operation copies pages into new PDFs and does not upload or alter their visible contents.",
      "Check whether the document has a reverse side, continuation page or attachment before separating it. A small output file is not automatically complete. Open every downloaded part, confirm the page order and give it a descriptive filename before selecting it in the application form.",
    ],
    checklist: [
      "Write down the intended page ranges before processing a long file.",
      "Keep signatures, stamps and their continuation text together.",
      "Verify each result opens and contains the expected pages.",
    ],
  },
  "signature-background-removal": {
    heading: "Remove paper texture without erasing the ink",
    paragraphs: [
      "The transparency threshold separates darker pen strokes from lighter paper. Increase it gradually while watching loops, dots and the ends of strokes; an aggressive setting can make a signature look broken. Stroke width can strengthen a faint scan, but it cannot recover ink that was out of focus or hidden by glare.",
      "Transparent PNG is useful for placing a signature on a document. Many application portals instead request a flattened JPEG on white, so use the exam-specific signature resizer when a form publishes a format and KB band. Always compare the downloaded mark with the original signature before using it.",
      "Contrast between ink and paper decides the result. A blue or black pen on plain white paper, photographed in even daylight, separates cleanly. A faint ballpoint, a signature on lined or tinted paper, or a photograph with a shadow falling across the page will lose stroke ends, and thinning strokes are what make a signature look unlike itself. If the output has gaps, re-signing with a darker pen on plain paper is quicker than repairing the image.",
    ],
    checklist: [
      "Photograph white paper in even light without a hand shadow.",
      "Keep the full signature inside the crop with a small margin.",
      "Select ink colour only when the receiving form permits it.",
    ],
  },
  "transparent-signature": {
    heading: "Where a transparent signature is useful",
    paragraphs: [
      "A transparent PNG places only the ink over a letter, declaration or locally edited PDF, avoiding a visible white rectangle around the mark. The automatic crop removes unused paper space while retaining a small margin, which makes positioning easier in document editors.",
      "Transparency is not accepted by every upload portal. If an application asks for JPG/JPEG, a white background or a particular file-size band, use its dedicated signature workflow instead. Inspect thin pen strokes at full size before download and keep the unedited scan as your reference.",
    ],
    checklist: [
      "Use dark, continuous ink on clean unruled paper.",
      "Check that initials, dots and underlines remain visible.",
      "Do not stretch the PNG after placing it in a document.",
    ],
  },
  "signature-cleaner": {
    heading: "Clean a scan while preserving its character",
    paragraphs: [
      "Signature cleaning is a contrast operation, not a redraw. Adjust the paper-removal control until grey texture disappears but the natural variation in the pen line remains. If the source is blurred, heavily shadowed or photographed at an angle, making the threshold stronger can remove authentic strokes along with the paper.",
      "Use the preview at both normal size and close zoom. Pay attention to crossings, small dots and the final pen lift. Export transparent PNG for document placement, or move to a portal-specific resizer when the receiving form lists JPEG, dimensions or a KB range.",
    ],
    checklist: ["Retake severe shadows.", "Preserve a clean original scan.", "Compare every fine stroke before download."],
  },
  "signature-crop": {
    heading: "Crop tightly without clipping the signature",
    paragraphs: [
      "A good signature crop removes empty paper while leaving a narrow, even margin around every stroke. Include long underlines, dots and the tallest loop; clipping any of them changes the visible mark. Auto-crop estimates the ink boundary, while manual adjustment is useful for ruled paper or nearby marks.",
      "Cropping changes the canvas, not the receiving portal's size or format requirement. After the crop, use a signature resizer if the form publishes pixels or a KB band. Check the final background and file type before uploading.",
      "Portals differ on how much white space they expect around the strokes. Some publish an exact pixel size, some a KB range, and some only say the signature must be clearly visible. Crop close enough that the signature fills the frame without touching the edges, keeping a thin even margin on all four sides. Stretching a crop to hit a stated aspect ratio distorts the handwriting, which is the one thing a checker compares against your other documents.",
    ],
    checklist: ["Include every pen stroke.", "Avoid large blank margins.", "Keep the signature level rather than stretching it."],
  },
  "sign-image": {
    heading: "Place a signature on an image with control",
    paragraphs: [
      "This workflow layers your signature over a local image and lets you position it visually. Use it for documents that explicitly allow an inserted signature image; it does not replace a digital certificate, e-sign service or witnessed signature when those are required.",
      "Keep the mark readable without covering printed text, dates or seals. Review the final image at full resolution, because a placement that looks clear in the small editor can overlap content after download.",
      "A signature saved with a transparent background sits on the document without a white box around it, which matters when you are placing it over a form that already has printed lines or shading. Save as PNG when transparency is needed; JPEG has no transparency and will always paint a solid rectangle. If the receiving form only accepts JPEG, place the signature over a matching white area rather than over ruled or coloured content.",
      "Everything here happens in your browser, so the signature file is never uploaded. That is worth keeping in mind for the opposite reason too: because nothing is transmitted, nothing is timestamped, logged or witnessed. Where a process needs proof of who signed and when \u2014 a contract, an affidavit, anything with legal consequence \u2014 an inserted image is not evidence, and the issuing body will say which e-signature method it accepts.",
    ],
    checklist: ["Confirm image signatures are allowed.", "Leave surrounding text readable.", "Save the unsigned original separately."],
  },
  "exam-package": {
    heading: "Why an exam application is two uploads, not one",
    paragraphs: [
      "The Indian recruitment portals covered here take the photograph and the signature as separate files with separate limits, and the signature limit is generally the tighter of the two \u2014 often a 10 to 50 KB band against 10 to 200 KB for the photo. Check your own form rather than assuming that split. Preparing them together helps because the two are judged against the same application, but they are still two files, and a package that merges them is wrong unless the portal explicitly asks for one image.",
      "Order matters more than most candidates expect. Sign on plain white paper in the ink the notice specifies, photograph or scan it square-on, and crop before resizing \u2014 resizing first locks in whatever margin you had. Do the photo separately against a plain background at the head size the exam publishes. Only then check both files against the KB limits, because cropping and adding any name or date strip both change the file size after the fact.",
      "One thing no tool can do for you is confirm the figures. Boards revise their notices between cycles, some publish pixel dimensions and some only a KB range, and a few state nothing beyond \"recent passport-size photograph\". Each exam page here records the figure we found and names the source it came from, so you can open that source and check it. Where a source is marked as needing review, treat the numbers as a starting point and take the binding version from your own notification.",
    ],
    checklist: [
      "Prepare photo and signature as separate files unless told otherwise.",
      "Crop first, resize second, then check the KB limit last.",
      "Open the cited source for your exam rather than trusting a stored figure.",
    ],
  },
  "white-background": {
    heading: "Why a replaced background is not the same as a plain wall",
    paragraphs: [
      "Background replacement separates you from whatever was behind you and fills the rest with a flat colour. It works best when the edge between hair and background is already visible in the original \u2014 even lighting, no strong shadow on the wall behind you, and no clothing the same shade as the backdrop. Fine or wispy hair against a dark or busy background is the hardest case, and the result may show a halo or a chewed edge that a person checking the photo will notice.",
      "Which shade of light background you need is set by the authority, not by the tool. Indian exam portals and passport guidance generally ask for plain white, while Schengen states such as Switzerland ask for light grey. The UK is often cited as rejecting white; it does not — HM Passport Office accepts any plain light colour and names shades of white among its examples. Setting a background here does not make a photo compliant on its own: pose, expression, head size, recency and lighting are all judged separately. If the cut-out edge looks wrong at full size, retaking the photo against a plain wall in soft daylight will beat any amount of editing.",
    ],
    checklist: [
      "Check the required shade on your own application before choosing white.",
      "Some services ask for an unedited photo — the UK online one does — so a replaced background may suit a print, not an upload.",
      "Inspect the hair edge at 100% zoom, not in the small preview.",
      "Avoid wearing a top that matches the background you are replacing.",
    ],
  },
  "photo-signature-merge": {
    heading: "When a form wants photo and signature as one image",
    paragraphs: [
      "Some application portals accept a single image containing the photograph above the signature, rather than two separate uploads. Others insist on separate files and will reject a combined one. Read the upload screen before merging: if it shows two distinct file inputs with their own size limits, they are meant to stay separate, and combining them is a rejection you can avoid.",
      "Where a combined image is accepted, the usual failure is proportion rather than quality. The signature strip is often reduced until the strokes break up, or the photo is stretched to fill an unusual aspect ratio. Keep both elements at the size they were captured, place the signature in its own band beneath the photograph rather than overlapping it, and check the merged file against whatever KB limit the form states.",
    ],
    checklist: [
      "Confirm the portal accepts one combined image before merging.",
      "Keep the signature on white with no part of it cropped away.",
      "Re-read both elements at full size after downloading.",
    ],
  },
  "dpi-converter": {
    heading: "DPI is a label; pixels are the photograph",
    paragraphs: [
      "DPI is a number stored in the file that says how large the image should print. Changing it alone does not add detail, sharpen anything, or make a small photo acceptable \u2014 a 300 by 300 pixel image tagged at 300 DPI simply says print me one inch wide. When a form asks for 300 DPI it is almost always asking for enough pixels to print at the stated size, so the figure that matters is the pixel dimensions.",
      "The relationship is arithmetic: millimetres divided by 25.4, multiplied by DPI, gives pixels. A 35 by 45mm photo at 300 DPI is about 413 by 531 pixels. If your source is smaller than that, raising the DPI tag will satisfy a checker that only reads metadata but will still print soft, because the detail was never captured. Re-tagging is useful when a portal validates the DPI field; it is not a substitute for photographing at a higher resolution.",
    ],
    checklist: [
      "Work out the pixels your print size needs before changing the tag.",
      "Do not upscale a small image to reach a pixel count \u2014 retake it.",
      "Keep the original file in case the portal wants the untouched capture.",
    ],
  },
  "photo-with-name-date": {
    heading: "Adding a name and date strip without breaking the photo",
    paragraphs: [
      "Several Indian recruitment boards ask for the candidate's name and the date of capture printed beneath the photograph, most often in black text on a white strip. The requirement is specific to the notification you are applying under, and boards differ on wording, date format and whether the strip counts inside the stated photo dimensions. Take the format from your own notice rather than assuming the pattern from another exam.",
      "The common rejections are mechanical. Text that overlaps the face, a strip so short the date is cut off, a date that does not match when the photograph was actually taken, or a merged image that now exceeds the KB limit the form allows. Add the strip below the frame rather than over it, keep the typeface plain, and re-check the file size afterwards \u2014 adding text can push a photo past a tight upload cap.",
    ],
    checklist: [
      "Copy the exact name spelling and date format from your notification.",
      "Keep the strip below the face, never across it.",
      "Re-check the KB limit after adding text, not before.",
    ],
  },
};

export function ToolDepth({ slug }: { slug?: string }) {
  if (!slug) return null;
  const copy = TOOL_DEPTH[slug];
  if (!copy) return null;

  return (
    <section className="mt-10 rounded-xl border border-hairline bg-paper p-5 sm:p-6">
      <h2 className="text-lg font-semibold tracking-tight text-ink">{copy.heading}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
        {copy.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
        {copy.checklist.map((item) => (
          <li key={item} className="rounded-md bg-accent/35 px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
