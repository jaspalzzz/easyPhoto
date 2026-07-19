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
    ],
    checklist: [
      "Pay special attention to zero/O and one/I substitutions.",
      "Confirm the name order and date directly from the card.",
      "Do not treat OCR output as PAN verification.",
    ],
  },
  "aadhaar-ocr": {
    heading: "Read locally, then verify against the card",
    paragraphs: [
      "Aadhaar OCR converts visible printed characters into editable text on your device. It does not query UIDAI, authenticate the holder or validate whether a number is current. Use it to reduce retyping, then compare each result with the original before entering it into any official or financial workflow.",
      "Use a sharp, square-on image without glare over the number or name. Aadhaar documents can mix English, Hindi and regional text, so recognition quality varies by side and print quality. Mask or avoid copying fields that the recipient does not need, and close or refresh the page after finishing.",
    ],
    checklist: [
      "Check every four-digit number group character by character.",
      "Confirm date of birth versus year-of-birth wording on the source.",
      "Use UIDAI's own services when identity verification is required.",
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
    ],
    checklist: ["Include every pen stroke.", "Avoid large blank margins.", "Keep the signature level rather than stretching it."],
  },
  "sign-image": {
    heading: "Place a signature on an image with control",
    paragraphs: [
      "This workflow layers your signature over a local image and lets you position it visually. Use it for documents that explicitly allow an inserted signature image; it does not replace a digital certificate, e-sign service or witnessed signature when those are required.",
      "Keep the mark readable without covering printed text, dates or seals. Review the final image at full resolution, because a placement that looks clear in the small editor can overlap content after download.",
    ],
    checklist: ["Confirm image signatures are allowed.", "Leave surrounding text readable.", "Save the unsigned original separately."],
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
