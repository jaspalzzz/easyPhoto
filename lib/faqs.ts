/**
 * Page FAQ content — search-intent + long-tail, plain text (no markup) so it
 * renders cleanly and produces valid FAQPage JSON-LD via faqSchema().
 * One set per page; never mix sets across URLs (schema must match the page).
 */
import type { FaqItem } from "@/components/site/Faq";
import {
  acceptsDigitalUpload,
  effectivePrintMm,
  formatFileSizeKb,
  type CountrySpec,
} from "@/lib/countrySpecs";
import type { PortalSpec } from "@/lib/portalPresets";
import { photoDimsPx, sigDimsPx } from "@/lib/specRegistry";

/**
 * Meta description for an exam photo/signature resizer page. Covers BOTH the
 * photo and signature KB targets (dual search intent) and fills the ~150–160
 * char SERP width. All values come straight from the verified spec.
 */
export function resizerMetaDescription(spec: PortalSpec, label: string): string {
  const photo = spec.photoMinKb
    ? `${spec.photoMinKb}–${spec.photoLimitKb} KB`
    : `under ${spec.photoLimitKb} KB`;
  const dims = photoDimsPx(spec);
  const px = dims ? ` (${dims})` : "";
  const sig = spec.sigLimitKb
    ? ` and signature to ${spec.sigMinKb ? `${spec.sigMinKb}–` : "under "}${spec.sigLimitKb} KB`
    : "";
  if (spec.isLiveCapture) {
    const signature = spec.sigLimitKb
      ? ` Prepare the separate ${spec.sigMinKb ? `${spec.sigMinKb}–` : "under "}${spec.sigLimitKb} KB signature${spec.sigFormat ? ` in ${spec.sigFormat} format` : ""}.`
      : "";
    return `${label} currently captures the photograph live in the application.${signature} The optional photo tool is a compatibility aid, not the live-photo step.`;
  }
  return `Prepare your ${label} photo to the stored ${photo}${px}${sig} target. Verify the current form instructions before use. Free, no watermark, processed in your browser.`;
}

/** Visible upload-problem list, limited to fields the registry actually carries. */
export function portalRejectionReasons(spec: PortalSpec, hasSignature: boolean): string[] {
  const reasons = [
    spec.verification === "official"
      ? "File size falls outside the published band."
      : "File size does not match the current application's displayed range.",
  ];
  const photoDimensions = photoDimsPx(spec);
  if (photoDimensions && spec.photoAspectRatio) {
    reasons.push("Photo does not match the stored pixel canvas or aspect ratio.");
  } else if (photoDimensions) {
    reasons.push("Photo does not match the stored pixel canvas.");
  } else if (spec.photoAspectRatio) {
    reasons.push("Photo does not match the stored aspect ratio.");
  }
  if (spec.photoFormat || (hasSignature && spec.sigFormat)) {
    reasons.push("File format differs from the current application's accepted formats.");
  }
  if (hasSignature) {
    const signatureDimensions = sigDimsPx(spec);
    if (signatureDimensions && spec.sigAspectRatio) {
      reasons.push("Signature does not match the stored pixel canvas or aspect ratio.");
    } else if (signatureDimensions) {
      reasons.push("Signature does not match the stored pixel canvas.");
    } else if (spec.sigAspectRatio) {
      reasons.push("Signature does not match the stored aspect ratio.");
    }
    reasons.push("Signature is unclear or includes excess paper around the writing.");
  }
  reasons.push("Photo is blurry or too low-contrast to review clearly.");
  return reasons;
}

/**
 * Exam/portal FAQ built from the verified spec — targets high-intent searches
 * ("what is the ssc photo size", "resize signature to 20kb") and emits valid
 * FAQPage JSON-LD via ToolPage. Numbers come from the registry, never hardcoded.
 */
export function portalFaqItems(spec: PortalSpec): FaqItem[] {
  const photoKb = spec.photoMinKb
    ? `${spec.photoMinKb}–${spec.photoLimitKb} KB`
    : `under ${spec.photoLimitKb} KB`;
  const photoPx = photoDimsPx(spec, " px");
  const photoDim = photoPx ? `, around ${photoPx}` : "";
  const photoFormat = spec.photoFormat ? `, in ${spec.photoFormat} format` : "";
  const sigKb = spec.sigLimitKb
    ? spec.sigMinKb
      ? `${spec.sigMinKb}–${spec.sigLimitKb} KB`
      : `under ${spec.sigLimitKb} KB`
    : null;
  const sigPx = sigDimsPx(spec, " px");
  const sigDim = sigPx ? `, around ${sigPx}` : "";
  const sigFormat = spec.sigFormat ? `, in ${spec.sigFormat} format` : "";
  const backgroundIssue = spec.photoBackground
    ? `, a background that does not match ${spec.photoBackground}`
    : "";
  // 18 of the 52 portals constrain nothing but file size — no pixel spec and no
  // aspect ratio. Claiming we keep "the correct dimensions", or that the wrong
  // ones cause rejection, invents a requirement the authority never published.
  const hasGeometry = photoPx !== null || spec.photoAspectRatio !== undefined;
  const signaturePreparation = spec.signatureInk
    ? `Follow the stored signature instruction: ${spec.signatureInk}. Then upload it here to clean and resize it.`
    : "Follow the current notice's ink and paper instructions, then upload it here to clean and resize it.";

  const items: FaqItem[] = [
    {
      q: `What is the photo size for the ${spec.name} application?`,
      a: spec.isLiveCapture
        ? `The current stored instructions describe a live-photograph step rather than an ordinary prepared-photo upload. The ${photoKb}${photoDim} value shown by this tool is a compatibility target, not a current live-photo requirement. Follow the active form's capture instructions.`
        : `The stored ${spec.name} target is ${photoKb}${photoDim}${photoFormat}. This tool resizes and compresses a prepared photo to that target; confirm the active form before submitting.`,
    },
  ];
  if (sigKb) {
    items.push({
      q: `What is the signature size for ${spec.name}?`,
      a: `The stored signature target is ${sigKb}${sigDim}${sigFormat}. ${signaturePreparation}`,
    });
  }
  items.push(
    {
      q: spec.isLiveCapture
        ? `How does the ${spec.name} live-photo step work?`
        : `How do I resize my photo to ${photoKb} for ${spec.name}?`,
      a: spec.isLiveCapture
        ? `Complete the live-photo step inside the application and follow its on-screen instructions for camera position, lighting and framing. The compatibility photo target shown by this tool does not replace that step. This tool cannot perform or validate the authority's live capture.`
        : `Upload your photo and the tool compresses it to the stored ${spec.name} target ${hasGeometry ? "and applies the recorded dimensions" : "without stretching or distorting it"}. Everything runs in your browser.`,
    },
    {
      q: `What should I check before submitting ${spec.name} files?`,
      a: spec.isLiveCapture
        ? `For a live photograph, follow the capture screen's lighting, framing and background instructions.${sigKb ? ` Compare the separate signature with the stored ${sigKb} band${spec.sigFormat ? ` and ${spec.sigFormat} format` : ""}, then inspect whether it is clear and tightly cropped.` : ""} This tool cannot validate the authority's live-photo step.`
        : `Compare the exported photo with the stored ${photoKb}${sigKb ? ` photo and ${sigKb} signature` : ""} bands${hasGeometry ? ", recorded geometry" : ""}${spec.photoFormat || (sigKb && spec.sigFormat) ? ", recorded formats" : ""}${backgroundIssue}, then inspect the image for blur and low contrast.${sigKb ? " Inspect the signature separately for faint strokes and excess paper." : ""} Confirm every stored value against the active form; the tool cannot predict acceptance.`,
    },
    {
      q: `Is this ${spec.name} resizer free and private?`,
      a: "Yes — free, no watermark, no sign-up, and your photo never leaves your device. All processing happens in your browser.",
    },
    {
      q: `Where can I confirm the official ${spec.name} requirements?`,
      a: `Always verify the current limits on the official source${spec.source ? ` (${spec.source.label})` : ""} before submitting, as requirements can change between notification cycles.`,
    }
  );
  return items;
}

export const PASSPORT_FAQ: FaqItem[] = [
  { q: "What size is a passport photo?", a: "Most countries use 35×45mm. The US and a few others use 2×2 inches (51×51mm). EasyPhoto sets the correct size automatically once you pick your country." },
  { q: "How do I make a passport photo at home for free?", a: "Upload a clear, front-facing photo, choose your country, and download the prepared result. Check it against the linked current requirements before submitting. No app, no payment, no watermark." },
  { q: "Can I take a passport photo on my phone?", a: "Yes. Any recent phone photo in even lighting works, and the tool crops and sizes it for you." },
  { q: "What background colour should a passport photo have?", a: "White for the US and India. The UK accepts any plain light colour, white included, and some Schengen consulates ask for light grey specifically. EasyPhoto applies a colour that suits each country and you can adjust it." },
  { q: "What is the correct head size in a passport photo?", a: "It depends on the country. The US lists 25–35mm chin-to-crown, for instance, while other workflows differ. The tool sizes the head to the selected recorded band; inspect the result and confirm the current instructions before submitting." },
  { q: "Can I smile in a passport photo?", a: "No. Keep a neutral expression with your mouth closed, which is what most countries require for biometric matching." },
  { q: "Can I wear glasses in a passport photo?", a: "Generally no. The US has banned glasses since 2016 and most countries discourage them, so it's safest to take them off." },
  { q: "How many passport photos do I need?", a: "Usually two for a printed application. The 4×6 inch print sheet gives you several copies on one sheet." },
  { q: "How do I make a baby or infant passport photo?", a: "Lay the baby on a plain white sheet, take a top-down photo with the eyes open if you can, and upload it. The same sizing rules apply." },
  { q: "What can EasyPhoto check before I submit?", a: "It prepares the selected dimensions and background, then reviews measurable image properties. It cannot predict acceptance; use the linked source and confirm the current application instructions before submitting." },
  { q: "Can I wear a head covering in a passport photo?", a: "Only for religious or medical reasons, and your full face from chin to forehead must be clearly visible." },
  { q: "Is this passport photo maker really free with no watermark?", a: "Yes. You get a full-quality download with no sign-up and no watermark." },
  { q: "Does my passport photo get uploaded or stored?", a: "No. Everything is processed in your browser and discarded when you close the tab." },
  { q: "Can I make a US DV Lottery or green card photo?", a: "The DV Lottery uses a stricter square spec (600×600, JPEG, under 240KB). Use the US page, then the resize tool to meet the file-size limit." },
  { q: "How do I print my passport photo?", a: "Download the 4×6 inch PDF sheet and print it at any photo kiosk or chemist, then cut out the copies." },
  { q: "What's the difference between a passport photo and a visa photo?", a: "The size is often similar, but background rules and exact specs differ, so use the visa photo maker for visa applications." },
  { q: "Do I upload a photo with an ordinary Passport Seva application?", a: "No. For ordinary adult fresh/reissue applications in India, Passport Seva captures the photograph and biometrics at the PSK/POPSK. A child below four carries a recent 45×35 mm white-background print." },
  { q: "Where does India's 630×810 px passport-photo format apply?", a: "The current ICAO guidance for Indian embassies and consulates abroad specifies 630×810 px for photograph capture or upload. It is not the ordinary domestic adult PSK/POPSK upload size. Follow the selected mission's instructions." },
  { q: "Can I use a phone photo for an Indian passport application?", a: "An ordinary adult applicant is photographed at the PSK/POPSK. A phone image can be prepared for the below-four printed-photo exception or a separate overseas workflow, but it must follow that workflow's current composition and submission instructions." },
];

export const VISA_FAQ: FaqItem[] = [
  { q: "What size is a visa photo?", a: "The size depends on the destination and application route. Pick the destination to load its recorded dimensions, then compare them with the current embassy, consulate or application-centre instructions." },
  { q: "What size is a US visa photo for DS-160?", a: "2×2 inches (51×51mm), square, on a white background. It's the same spec as the US passport photo." },
  { q: "What size is a Schengen visa photo?", a: "35×45mm, with the head taking up roughly 70–80% of the frame." },
  { q: "What background should a Schengen visa photo have?", a: "There is no single safe shade for every member-state workflow. The generic preset uses light grey, but destination instructions differ; compare the result with the mission handling your application." },
  { q: "What are the UK visa photo requirements?", a: "The requirement depends on the UK application route. For a route requesting a 35×45mm printed photo, use the linked UK guidance for its current background, expression and glasses rules rather than assuming another country's preset applies." },
  { q: "What size is a Canada visa photo?", a: "35×45mm for visitor visas and study or work permits. Permanent residence and Express Entry are a separate process specified in pixels rather than millimetres, and the printed Canadian passport booklet is different again at 50×70mm." },
  { q: "What size is an Australia visa photo?", a: "35–40mm wide by 45–50mm high on a plain light background. We use 35×45mm." },
  { q: "Can I use the same photo for my passport and visa?", a: "Check the visa's own rules before assuming so. Matching size and background is not always enough — the UK, for one, states the photo you submit must not be the one already in your passport or identity document. Where that applies, take a second photo to the same specification rather than reusing the print." },
  { q: "Can I smile or wear glasses in a visa photo?", a: "Expression and glasses rules vary by destination. A neutral, unobstructed face is a conservative starting point, but follow the current instruction for the application you are making." },
  { q: "How do I upload a visa photo to VFS Global online?", a: "Generate the destination preset, then compare its encoded format, pixel dimensions and KB size with the exact values shown on your current VFS upload screen. Resize only the fields that screen actually specifies." },
  { q: "Do I need a printed or digital visa photo?", a: "It depends on the consulate, so you get both a print-ready and an upload-ready file." },
  { q: "Is the visa photo maker free?", a: "Yes, completely free with no watermark." },
  { q: "Is my photo uploaded when I make a visa photo?", a: "No, it's processed entirely on your device." },
  { q: "How recent does a visa photo need to be?", a: "Recency windows vary. Check the destination's current instruction and use a photo that still represents your appearance." },
  { q: "What file format and size do online visa portals want?", a: "Use the encoded format and KB or pixel limits displayed by the active portal. If it publishes a cap, the resize tools can target that value without inventing an unstated limit." },
  { q: "Why was my visa photo rejected?", a: "Compare the actual file with the portal's stated dimensions, encoded format, KB band, background, expression and recency rules. Automated checks can inspect measurable properties but cannot predict an authority's decision." },
];

export const PHOTO_RESIZE_FAQ: FaqItem[] = [
  { q: "How do I resize a photo online for free?", a: "Upload it, set a target file size in KB or exact pixel dimensions, and download. No watermark and nothing gets uploaded." },
  { q: "How do I reduce a photo to 20KB?", a: "Set the target to 20KB and the tool compresses your image under 20KB while keeping it as clear as possible." },
  { q: "How do I resize a photo to 50KB?", a: "Enter 50KB as the target and download the compressed file. It's handy for passport, visa and exam uploads." },
  { q: "How do I compress an image to 100KB or 200KB?", a: "Type any target in KB. There are quick presets for 10, 20, 50, 100 and 200KB." },
  { q: "How do I resize a photo without losing quality?", a: "We lower JPEG quality only as much as needed and shrink dimensions last, so the photo stays as sharp as the target allows." },
  { q: "How do I resize a photo for SSC, UPSC or government forms?", a: "Select the limit stated in the current notification, compress to that target, and confirm the downloaded file before uploading." },
  { q: "Can I resize a photo on my phone?", a: "Yes, it works the same in a mobile browser." },
  { q: "What's the difference between resizing by KB and by pixels?", a: "KB controls the file size for upload limits, while pixels control the width and height. There's a separate tool for each." },
  { q: "How do I resize an image to exact pixel dimensions?", a: "Use the resize-by-dimensions tool, with an optional aspect-ratio lock." },
  { q: "Does compressing an image reduce its quality?", a: "A little, but we always keep the highest quality that still fits your target size." },
  { q: "What image formats can I resize?", a: "JPG, PNG, WebP and iPhone HEIC files." },
  { q: "Is the photo resizer free and watermark-free?", a: "Yes. It's free, with no sign-up and no watermark." },
  { q: "Is my photo uploaded when I resize it?", a: "No, compression happens entirely in your browser." },
  { q: "How do I resize a passport photo for online upload?", a: "Make the passport photo first, then compress it here to the portal's KB limit." },
  { q: "Why does my form reject my photo for size?", a: "It's over the file-size cap. Compress it under the stated limit and re-upload." },
  { q: "How small can I make an image?", a: "Down to around 10KB while keeping a face recognisable. Below that, detail starts to suffer." },
];

export const SIGNATURE_FAQ: FaqItem[] = [
  { q: "How do I resize my signature for an online form?", a: "Upload a scan or photo of your signature, set the size, and download. The paper background is removed and transparency is kept." },
  { q: "What size should a signature be for a form?", a: "It varies by authority and cycle. Check the current form for its format, KB band and any published dimensions before resizing." },
  { q: "How do I make my signature 10KB or 20KB?", a: "Use the signature-to-20KB tool, which compresses to the cap while keeping a transparent background." },
  { q: "How do I resize a signature for UPSC or SSC?", a: "Current UPSC instructions request one 20–100 KB JPG containing three signatures vertically. The cited SSC notice requests a separate 10–20 KB JPG/JPEG signature at about 6.0×2.0 cm. Confirm your exam notice before use." },
  { q: "What are the signature dimensions in pixels for forms?", a: "Use pixel dimensions only when the current authority source publishes them. Several portals publish a KB band or physical size but no fixed pixels." },
  { q: "How do I get a transparent signature?", a: "The tool lifts the paper background and exports a transparent PNG so it sits cleanly on documents." },
  { q: "How do I scan my signature for a form?", a: "Sign on plain white paper, photograph or scan it in good light, then upload, and we clean it up." },
  { q: "Can I resize my signature on my phone?", a: "Yes, photograph your signature and process it directly in the mobile browser." },
  { q: "How do I remove the background from a signature?", a: "Use the signature background-removal tool or the transparent option to drop the paper." },
  { q: "Why won't my signature upload?", a: "Compare the actual encoded format, KB band and any published dimensions with the current field. A transparent PNG will not satisfy a field that requests JPG/JPEG." },
  { q: "What format should a signature be, PNG or JPG?", a: "Use the format requested by the destination. PNG preserves transparency for overlays; many exam portals instead request JPG/JPEG on a white field." },
  { q: "How do I crop my signature?", a: "The signature crop tool auto-trims the empty space around the ink." },
  { q: "Is the signature resizer free?", a: "Yes, free with no watermark." },
  { q: "Is my signature uploaded anywhere?", a: "No, it's processed on your device only." },
  { q: "How do I make my signature clearer or darker?", a: "Increase the background-removal strength to lift the paper and sharpen the ink." },
  { q: "Can I resize a signature without losing quality?", a: "Yes. For ink on paper, trimming and light compression keep it crisp." },
];

export const BACKGROUND_REMOVER_FAQ: FaqItem[] = [
  { q: "How do I remove the background from an image for free?", a: "Drop in a photo and download a transparent PNG. It's free, with no sign-up and no watermark." },
  { q: "How do I make a transparent PNG?", a: "Remove the background and save. The result is a PNG with a transparent background." },
  { q: "Is this background remover really free with no watermark?", a: "Yes. You get a full-resolution download with no paywall and no watermark." },
  { q: "Does the background remover upload my photo?", a: "No. The AI model runs in your browser, so your image never leaves your device." },
  { q: "How do I add a white background to a photo?", a: "Remove the original background, then use the white-background tool to drop in white or any colour." },
  { q: "Can I remove the background from a product photo?", a: "Yes, it's well suited to product shots for listings and catalogues." },
  { q: "Does it work on hair and fine edges?", a: "Yes, the model handles hair and detailed edges reasonably well." },
  { q: "How do I remove the background from a signature?", a: "For ink on paper, the dedicated signature tools give cleaner results than the photo remover." },
  { q: "Can I remove a background on my phone?", a: "Yes, it runs in mobile browsers, and the first run downloads the AI model." },
  { q: "What file formats are supported?", a: "JPG, PNG, WebP and HEIC inputs." },
  { q: "What format is the output?", a: "A transparent PNG at full resolution." },
  { q: "How do I remove a background for a passport photo?", a: "Use the country passport page, which removes the background and applies the correct passport colour automatically." },
  { q: "Why does my cut-out have rough edges?", a: "Busy or low-contrast backgrounds are harder. A plainer background gives cleaner edges." },
  { q: "Can I change the background colour after removing it?", a: "Yes, pair it with the white-background tool to set any solid colour." },
  { q: "Is there a limit on image size or number of images?", a: "No hard limit, though very large images use more memory on your device." },
  { q: "How accurate is the AI background removal?", a: "It's good for people and products. Results depend on the contrast between the subject and the background." },
];

export const JPG_TO_PDF_FAQ: FaqItem[] = [
  { q: "How do I convert a JPG to PDF?", a: "Add your JPG (or PNG/HEIC) images, arrange them in order, and download a single PDF where each image becomes one page." },
  { q: "Can I combine multiple images into one PDF?", a: "Yes. Add as many images as you like and they're merged into a single PDF in the order you choose." },
  { q: "Can I reorder or remove pages before converting?", a: "Yes, you can remove any image, and they're added to the PDF in the order you select them." },
  { q: "Is JPG to PDF free with no watermark?", a: "Yes, completely free with no watermark and no sign-up." },
  { q: "Are my images uploaded to a server?", a: "No. The PDF is built in your browser, which is ideal for IDs and certificates that shouldn't be uploaded." },
  { q: "Does JPG to PDF work on mobile?", a: "Yes, it works the same in a mobile browser." },
  { q: "Can I convert PNG or HEIC images to PDF too?", a: "Yes, JPG, PNG and iPhone HEIC images are all supported." },
  { q: "How do I convert a PDF back into images?", a: "Use the PDF to JPG tool to export each PDF page as an image." },
];

export const PDF_TO_JPG_FAQ: FaqItem[] = [
  { q: "How do I convert a PDF to JPG?", a: "Upload your PDF and each page is rendered as a JPG image you can download individually or all at once." },
  { q: "Can I export every page of a PDF as an image?", a: "Yes, every page becomes its own JPG, and there's a download-all option." },
  { q: "Is PDF to JPG free and private?", a: "Yes, free with no watermark, and the PDF is processed entirely in your browser." },
  { q: "Is my PDF uploaded anywhere?", a: "No, it's rendered locally on your device and never sent to a server." },
  { q: "What image quality do I get?", a: "Pages are rendered at a high resolution so text and photos stay sharp." },
  { q: "Can I convert a multi-page PDF?", a: "Yes, large PDFs are supported, with a page cap to protect your browser's memory." },
  { q: "Does PDF to JPG work on mobile?", a: "Yes, it runs in mobile browsers." },
  { q: "How do I turn images back into a PDF?", a: "Use the JPG to PDF tool to combine images into a single PDF." },
];

export const WHITE_BACKGROUND_FAQ: FaqItem[] = [
  { q: "How do I add a white background to a photo?", a: "Upload your photo and the tool removes the existing background and places the subject on white. You can change the colour too." },
  { q: "Can I use a colour other than white?", a: "Yes, pick any solid colour, including light grey and cream for passport or visa photos." },
  { q: "Is the white background tool free with no watermark?", a: "Yes, free with no sign-up and no watermark." },
  { q: "Is my photo uploaded?", a: "No. Background removal and compositing run in your browser, so your image never leaves your device." },
  { q: "How do I make a white background for a passport photo?", a: "For passports, use the country page instead. It applies the exact required background colour and size automatically." },
  { q: "Does it remove the old background automatically?", a: "Yes, the AI removes the original background, then drops in the colour you choose." },
  { q: "What format is the output?", a: "A full-resolution PNG or JPG, your choice." },
  { q: "Does it handle hair and fine edges?", a: "Yes, the model keeps hair and detailed edges reasonably clean." },
];

export const EXAM_PACKAGE_FAQ: FaqItem[] = [
  { q: "What is the Exam Application Kit?", a: "It is a guided flow that prepares photo and signature files to the selected stored preset, then bundles them for download. Confirm the preset against the current form before submitting." },
  { q: "Which exams does it support?", a: "It includes stored presets for SSC, UPSC, IBPS, SBI, Railway (RRB), NTA, RBI, CTET and state PSCs. Each page shows whether its source is dated official evidence or still needs review." },
  { q: "What photo and signature size do exam forms need?", a: "It varies by exam and workflow. Some portals publish prepared-file KB bands and dimensions; some use live capture; some presets still need review. Select the exam and verify its current source." },
  { q: "Do I need to resize the photo and signature separately?", a: "No. The kit handles both in one flow — it sizes the photo, cleans and sizes the signature, and gives you files that fit the form's limits." },
  { q: "Is the Exam Application Kit free and private?", a: "Yes. It's free, with no watermark and no sign-up, and everything runs in your browser — your photo and signature are never uploaded to any server." },
  { q: "Should I still check the official exam notification?", a: "Yes. Requirements can change between notification cycles, so confirm the current photo and signature limits in the official notification before you submit." },
];

export const PDF_COMPRESS_FAQ: FaqItem[] = [
  { q: "How do I compress a PDF to a target size (100, 200, 500 KB)?", a: "Upload your PDF, pick a target like 100, 200 or 500 KB, and the tool rasterises and re-compresses the pages to land under it, then you download. Everything happens in your browser." },
  { q: "Will compressing reduce the PDF's quality?", a: "Some quality is traded for the smaller size. We keep the highest quality that still fits your target, and smaller targets reduce sharpness more, so pick the largest size your form allows." },
  { q: "Is the PDF compressor free and private?", a: "Yes — free, no watermark, no sign-up, and your PDF is processed entirely on your device. Nothing is uploaded." },
  { q: "Why does my form reject my PDF for size?", a: "It's over the upload cap. Compress it under the stated limit (for example 200 KB) and re-upload." },
  { q: "Does it work on scanned PDFs?", a: "Yes. Scanned, image-heavy PDFs usually compress the most, since the pages are images." },
];

export const PDF_MERGE_FAQ: FaqItem[] = [
  { q: "How do I merge PDF files into one?", a: "Add two or more PDFs, arrange them in order, and download a single combined PDF. It's lossless — pages are copied as-is." },
  { q: "Is there a limit on how many PDFs I can merge?", a: "No fixed limit. Very large documents use more memory on your device, but typical multi-file merges work fine." },
  { q: "Will merging reduce quality?", a: "No. Merge copies the original pages without re-compressing, so text and images stay exactly as they were." },
  { q: "Is the PDF merger free and private?", a: "Yes — free, no watermark, and the merge happens in your browser, so your files are never uploaded." },
  { q: "Can I reorder the files before merging?", a: "Yes, arrange them in the order you want before downloading the combined PDF." },
];

export const PDF_SPLIT_FAQ: FaqItem[] = [
  { q: "How do I split a PDF or extract pages?", a: "Upload your PDF, select the pages you want, and download them as a new PDF. The original is untouched." },
  { q: "Can I extract a single page from a PDF?", a: "Yes. Pick just the page (or range) you need and export it as its own PDF." },
  { q: "Does splitting reduce quality?", a: "No. Pages are copied losslessly into the new file, so nothing is re-compressed." },
  { q: "Is the PDF splitter free and private?", a: "Yes — free, no watermark, and processed entirely in your browser. Your PDF is never uploaded." },
];

export const PDF_REORDER_FAQ: FaqItem[] = [
  { q: "How do I reorder pages in a PDF?", a: "Upload your PDF, drag the page thumbnails into the order you want, and download the rearranged file." },
  { q: "Can I rotate or delete pages too?", a: "Yes. You can rotate any page and remove pages you don't need before downloading." },
  { q: "Will reordering or rotating reduce quality?", a: "No. Pages are moved and rotated losslessly — the content isn't re-compressed." },
  { q: "Is the tool free and private?", a: "Yes — free, no watermark, and everything runs in your browser, so your PDF is never uploaded." },
];

export const SIGN_PDF_FAQ: FaqItem[] = [
  { q: "How do I sign a PDF online for free?", a: "Upload your PDF, draw or place your signature image on the page, position it, and download the signed PDF — all in your browser." },
  { q: "Can I draw my signature or upload an image?", a: "Both. Draw it with your mouse or finger, or upload a transparent signature PNG and drop it onto the page." },
  { q: "Is signing a PDF here legally valid?", a: "It adds a visible signature image, which is accepted for many everyday forms. For qualified e-signatures with certificates, use a dedicated e-sign service." },
  { q: "Is the PDF signer free and private?", a: "Yes — free, no watermark, and your PDF and signature never leave your device." },
  { q: "How do I get a clean signature to place?", a: "Use the transparent signature tool first to turn a scan into a clean, background-free PNG, then place it here." },
];

export const SIGN_IMAGE_FAQ: FaqItem[] = [
  { q: "How do I add a signature to a photo or image?", a: "Upload your image, draw or place a transparent signature on top, position and size it, then download the signed image." },
  { q: "Can I overlay a transparent signature PNG?", a: "Yes. Upload a transparent signature and drop it onto the photo, or draw a new one directly." },
  { q: "Will the signature have a white box around it?", a: "No, if you use a transparent signature. Make one with the transparent signature tool first for a clean overlay." },
  { q: "Is it free and private?", a: "Yes — free, no watermark, and the image is processed in your browser, never uploaded." },
];

export const TRANSPARENT_SIGNATURE_FAQ: FaqItem[] = [
  { q: "How do I make a transparent signature PNG?", a: "Upload a scan or photo of your signature on white paper. The tool removes the paper background, trims to the ink, and exports a transparent PNG." },
  { q: "Why do I need a transparent signature?", a: "Forms and documents expect a signature with no white box around it, so it sits cleanly on the page. A transparent PNG does exactly that." },
  { q: "My scan has grey or shadowed paper — will it clean up?", a: "Yes. Increase the background-removal strength to push the paper fully transparent while keeping the ink crisp." },
  { q: "Is it free and private?", a: "Yes — free, no watermark, and your signature is processed on your device and never uploaded." },
];

export const SIGNATURE_BG_REMOVAL_FAQ: FaqItem[] = [
  { q: "How do I remove the background from a signature?", a: "Upload a photo or scan of your signature and the tool lifts the paper tone, keeping just the ink on a transparent background." },
  { q: "Does it keep the ink sharp?", a: "Yes. It targets the paper colour and leaves the ink intact; a strength control lets you push faint paper fully transparent." },
  { q: "What's the difference from the transparent signature tool?", a: "This focuses on background removal; the transparent signature tool also auto-trims and optimises the file. Use whichever fits, or chain them." },
  { q: "Is it free and private?", a: "Yes — free, no watermark, and processed entirely in your browser. Your signature is never uploaded." },
];

export const SIGNATURE_CLEANER_FAQ: FaqItem[] = [
  { q: "How do I turn a photo of my signature into a signature image?", a: "Sign on plain white paper, take a clear photo or scan, and upload it here. The tool removes the paper background, trims tightly to the ink, and converts the photo into a clean signature image you can drop onto any form — exported as a white-background JPG or a transparent PNG." },
  { q: "What does the signature cleaner do?", a: "It removes the paper background, auto-trims the empty space around the ink, and optimises the file size — turning a phone photo of your signature into a clean, form-ready image." },
  { q: "Will it keep a transparent background?", a: "Yes. The cleaned signature is exported as a transparent PNG so it sits cleanly on forms and documents." },
  { q: "Can it fix a faint or shadowed scan?", a: "Yes. Adjust the cleanup strength to lift faint paper and shadows while keeping the ink legible." },
  { q: "Is it free and private?", a: "Yes — free, no watermark, and your signature is processed on your device only." },
];

export const SIGNATURE_CROP_FAQ: FaqItem[] = [
  { q: "How do I crop a signature to the ink?", a: "Upload your signature scan or phone photo, then drag the crop box around your signature — the dimmed area is removed and the bright area is kept. Or tap Auto-detect to snap the box to the ink automatically. Download as PNG or JPG." },
  { q: "Can I crop a photo of my signature, not just a clean scan?", a: "Yes. The manual crop box works on any photo — including phone photos with shadows or off-white paper, where automatic trimming alone can struggle. Just drag the box to exactly what you want to keep." },
  { q: "Why crop a signature before uploading?", a: "Forms expect the signature to fill the frame, not float in a sea of white. A tight crop also helps it meet pixel-dimension limits." },
  { q: "Can I also remove the paper background?", a: "Yes — use the signature cleaner or background-removal tool to drop the paper and keep a transparent PNG." },
  { q: "Is it free and private?", a: "Yes — free, no watermark, and processed entirely in your browser." },
];

export const FORMAT_CONVERTER_FAQ: FaqItem[] = [
  { q: "How do I convert an image between JPG, PNG, WebP and HEIC?", a: "Upload your image, choose the output format, and download. The conversion runs in your browser — nothing is uploaded." },
  { q: "How do I convert an iPhone HEIC photo to JPG?", a: "Drop in the HEIC file and select JPG as the output. This is handy because many forms and sites don't accept HEIC." },
  { q: "Does converting reduce quality?", a: "Converting to PNG is lossless. JPG and WebP use compression, but at high quality the difference is hard to see." },
  { q: "Is the format converter free and private?", a: "Yes — free, no watermark, and your image is processed on your device only." },
  { q: "What's the difference between JPG, PNG and WebP?", a: "JPG is best for photos and small files, PNG keeps transparency and sharp edges, and WebP gives smaller files at similar quality." },
];

export const RESIZE_DIMENSIONS_FAQ: FaqItem[] = [
  { q: "How do I resize an image to exact pixel dimensions?", a: "Upload your image, enter the width and height in pixels (with an optional aspect-ratio lock), and download. It runs in your browser." },
  { q: "How do I keep the aspect ratio while resizing?", a: "Turn on the lock and the other dimension updates automatically as you type, so the image isn't stretched." },
  { q: "What's the difference between resizing by pixels and by KB?", a: "Pixels set the width and height; KB sets the file size for upload limits. Use the resize-to-KB tool when a form caps the file size." },
  { q: "Does resizing reduce quality?", a: "Shrinking is high quality. Enlarging beyond the original size can look soft, since there's no extra detail to add." },
  { q: "Is it free and private?", a: "Yes — free, no watermark, and processed entirely in your browser." },
];

export const PHOTO_NAME_DATE_FAQ: FaqItem[] = [
  { q: "How do I add my name and date under a photo?", a: "Upload your photo, type your name and the date, and the tool prints them in a clean strip at the bottom — then you download it." },
  { q: "Which applications use a digital name-and-date strip?", a: "The current APPSC Direct Recruitment OTPR manual and Kerala PSC guidance require the candidate's name and photography date on the image. Confirm the current notice for your application before using a strip." },
  { q: "Can I use this tool for UPSC, SSC, IBPS or Agniveer forms?", a: "Current UPSC, SSC and IBPS instructions do not list a digital strip. Navy Agniveer and Agniveervayu notices require a physical black slate held in the photograph, which cannot be added by this tool." },
  { q: "Can I change the date or text format?", a: "Yes. Enter the photography date and use the wording or date format stated by the current application instructions." },
  { q: "Is it free and private?", a: "Yes — free, no watermark, and your photo is processed on your device only." },
];

export const COMPLIANCE_CHECKER_FAQ: FaqItem[] = [
  { q: "What does the photo & signature checker do?", a: "Pick your exam, choose photo or signature, and upload your file. It compares file size (KB), pixel dimensions, aspect, format and a white-background guide with the selected published requirements, then reports measurable issues before you upload." },
  { q: "What can the checker confirm?", a: "It can compare measurable file properties with the selected listing. Background and face-position results are guides, and it cannot predict acceptance. Confirm the current application instructions on the named authority's portal before submitting." },
  { q: "Does it upload my photo or signature?", a: "No. The file is read and checked entirely in your browser — nothing is uploaded to any server." },
  { q: "Why does a portal reject my upload?", a: "Usually the file is over the KB limit, the pixel dimensions/aspect are wrong, it isn't a JPG, or the background isn't plain white. The checker flags each of these so you know exactly what to fix." },
  { q: "How do I fix a failing check?", a: "When something fails, the result links straight to the resizer for your exam, which compresses and resizes your file to the exact required spec." },
];

export const UNLOCK_PDF_FAQ: FaqItem[] = [
  { q: "How do I remove the password from a PDF?", a: "Upload the protected PDF, enter its password when asked, and download an unprotected copy. It all happens in your browser — the PDF and password are never uploaded." },
  { q: "What is the e-Aadhaar PDF password?", a: "The e-Aadhaar PDF opens with the first 4 letters of your name in CAPITALS followed by your year of birth — for example RAVI1998. Enter that as the password to unlock it." },
  { q: "Is it safe to unlock my Aadhaar PDF here?", a: "Yes. Your Aadhaar PDF and its password are processed entirely on your device and are never uploaded to any server — nothing leaves your browser." },
  { q: "Why is the unlocked PDF slightly different?", a: "The unprotected copy is rebuilt from the rendered pages, so it looks identical and the password is gone, but the text is no longer selectable. That's the trade-off of removing the password fully in-browser." },
  { q: "Is the PDF password remover free?", a: "Yes — completely free, no watermark and no sign-up." },
];

export const IMAGE_CROP_FAQ: FaqItem[] = [
  { q: "How do I crop an image online for free?", a: "Upload your image, drag the crop box around the area you want to keep, and click Download PNG or JPG. No watermark, no sign-up required." },
  { q: "Can I lock the aspect ratio when cropping?", a: "Yes. Choose Free, 1:1 (square), 4:3, 3:4, 16:9 or 9:16 before dragging — the crop box snaps to that ratio automatically as you resize." },
  { q: "Does the tool show exact pixel dimensions?", a: "Yes. The live width × height in pixels is shown as you drag, so you can hit a precise size. If you need a specific output size, resize the image first with the Resize Image (Pixels) tool." },
  { q: "What image formats does the crop tool support?", a: "JPG, PNG, WebP and HEIC (iPhone photos). You can download the cropped result as a PNG (lossless, supports transparency) or JPG (smaller file size)." },
  { q: "Is my image uploaded to a server?", a: "No. All cropping runs entirely in your browser — your image never leaves your device and nothing is sent to any server." },
  { q: "How is this different from the Signature Crop tool?", a: "The Signature Crop tool auto-detects the ink boundary and is designed for signature scans. The Image Crop tool is for general photos and images, giving you a free-hand drag interface with aspect ratio lock." },
];

/**
 * Per-country passport FAQ — built from the verified spec so every country's
 * set is genuinely different (sizes, background, head height, rules all differ).
 */
export function countryFaqItems(
  spec: CountrySpec,
  kind: "passport" | "visa" = "passport"
): FaqItem[] {
  const doc = kind === "visa" ? "visa" : "passport";
  const mm = effectivePrintMm(spec);
  const size =
    mm.width === 51 && mm.height === 51
      ? "2×2 inches (51×51mm)"
      : `${mm.width}×${mm.height}mm`;
  const glasses =
    typeof spec.glasses === "boolean"
      ? spec.glasses
        ? "Glasses are allowed if there's no glare and your eyes are clearly visible."
        : "No, glasses are not allowed."
      : `Glasses: ${spec.glasses}.`;
  const fileSize = spec.digital.fileSizeKb
    ? `Online uploads accept ${formatFileSizeKb(spec.digital.fileSizeKb)}, so compress your photo to fit if needed.`
    : "The online file-size limit varies by portal, so check the limit on your form, then compress to fit.";

  const EXTRA: Record<string, FaqItem> = {
    us: {
      q: "Can I use this for a US visa or DV Lottery photo?",
      a: "The 2×2 inch spec also covers US visa (DS-160) photos. The DV Lottery is stricter (600×600, JPEG, under 240KB), so use the resize tool to meet it.",
    },
    india: {
      q: "Is a home-printed Indian passport photo accepted?",
      a: "Ordinary adult applicants do not carry a print to the PSK/POPSK. For a child below four, Passport Seva requires a recent 45×35 mm white-background print; use the official minor-photo guidance and confirm the current application instructions.",
    },
    canada: {
      q: "Can I use this for a Canadian passport photo?",
      a: "Use it for Canada visa, PR/Express Entry and online renewal (35×45mm). The printed Canadian passport photo needs a commercial photographer's certification, which a DIY tool can't provide.",
    },
    uk: {
      q: "Does a UK passport photo have to avoid a white background?",
      a: "No. HM Passport Office accepts a plain background in any light colour and gives shades of white, cream, ivory and light grey as its own examples. Light grey is applied here because it also suits Schengen consulates that do ask for grey, and because it keeps your outline visible if you are wearing something pale.",
    },
    australia: {
      q: "Does the Australian passport photo need a guarantor?",
      a: "Yes, your guarantor must sign the back of the printed photo. This tool prepares the recorded image dimensions and background; the signature is added after printing.",
    },
    schengen: {
      q: "Is the background the same for every Schengen country?",
      a: "No. This generic preset uses light grey, but member-state missions publish their own accepted background examples. Check the current photo sheet for the consulate handling your application before submitting.",
    },
  };

  const items: FaqItem[] = [
    { q: `What size is a ${doc} photo for ${spec.label}?`, a: `A ${doc} photo for ${spec.label} is ${size}. EasyPhoto sets this size automatically.` },
    { q: `What background colour does a ${doc} photo for ${spec.label} need?`, a: `${spec.background.description}. The tool applies the recorded default; compare it with the linked current instructions before submitting.` },
    { q: `What is the head size in a ${doc} photo for ${spec.label}?`, a: `Your head should measure ${spec.headHeightMm.min}–${spec.headHeightMm.max}mm from chin to crown. We size it to that band and flag it if it's off.` },
    { q: `Can I wear glasses or smile in a ${doc} photo for ${spec.label}?`, a: `${glasses} Expression: ${spec.smileAllowed}.` },
    { q: `Is the ${spec.label} ${doc} photo maker free and private?`, a: "Yes. It's free, with no watermark, and processed entirely in your browser. Your photo is never uploaded." },
  ];
  // Only ask about an upload where one exists. Some applications take printed
  // photographs and nothing else — an Irish visa wants two prints with details
  // written on the back — and generating "what file size does the online upload
  // need?" for those contradicted the rest of the page.
  if (acceptsDigitalUpload(spec)) {
    items.splice(4, 0, {
      q: `What file size does the ${spec.label} online ${doc} upload need?`,
      a: fileSize,
    });
  }
  // Country caveats are passport-flavoured; visa pages get their specifics from
  // the per-page maker content instead.
  if (kind === "passport" && EXTRA[spec.id]) items.push(EXTRA[spec.id]);
  return items;
}
