/**
 * Page FAQ content — search-intent + long-tail, plain text (no markup) so it
 * renders cleanly and produces valid FAQPage JSON-LD via faqSchema().
 * One set per page; never mix sets across URLs (schema must match the page).
 */
import type { FaqItem } from "@/components/site/Faq";
import { effectivePrintMm, type CountrySpec } from "@/lib/countrySpecs";
import type { PortalSpec } from "@/lib/portalPresets";

/**
 * Meta description for an exam photo/signature resizer page. Covers BOTH the
 * photo and signature KB targets (dual search intent) and fills the ~150–160
 * char SERP width. All values come straight from the verified spec.
 */
export function resizerMetaDescription(spec: PortalSpec, label: string): string {
  const photo = spec.photoMinKb
    ? `${spec.photoMinKb}–${spec.photoLimitKb} KB`
    : `under ${spec.photoLimitKb} KB`;
  const px = spec.photoWidthPx
    ? ` (${spec.photoWidthPx}×${spec.photoHeightPx}px)`
    : "";
  const sig = spec.sigLimitKb
    ? ` and signature to ${spec.sigMinKb ? `${spec.sigMinKb}–` : "under "}${spec.sigLimitKb} KB`
    : "";
  return `Compress your ${label} photo to ${photo}${px}${sig} — the exact size the ${label} form needs. Free, no watermark, 100% in your browser.`;
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
  const photoDim =
    spec.photoWidthPx && spec.photoHeightPx
      ? `, around ${spec.photoWidthPx}×${spec.photoHeightPx} px`
      : "";
  const sigKb = spec.sigLimitKb
    ? spec.sigMinKb
      ? `${spec.sigMinKb}–${spec.sigLimitKb} KB`
      : `under ${spec.sigLimitKb} KB`
    : null;
  const sigDim =
    spec.sigWidthPx && spec.sigHeightPx
      ? `, around ${spec.sigWidthPx}×${spec.sigHeightPx} px`
      : "";

  const items: FaqItem[] = [
    {
      q: `What is the photo size for the ${spec.name} application?`,
      a: `The ${spec.name} photo should be ${photoKb}${photoDim}, in JPG format. This tool resizes and compresses your photo to fit automatically.`,
    },
  ];
  if (sigKb) {
    items.push({
      q: `What is the signature size for ${spec.name}?`,
      a: `The signature should be ${sigKb}${sigDim}. Sign on white paper in black ink, then upload it here to clean and resize it.`,
    });
  }
  items.push(
    {
      q: `How do I resize my photo to ${photoKb} for ${spec.name}?`,
      a: `Upload your photo and the tool compresses it under the ${spec.name} limit while keeping the correct dimensions. Everything runs in your browser.`,
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
  { q: "How do I make a passport photo at home for free?", a: "Upload a clear, front-facing photo, choose your country, and download the compliant result. No app, no payment, no watermark." },
  { q: "Can I take a passport photo on my phone?", a: "Yes. Any recent phone photo in even lighting works, and the tool crops and sizes it for you." },
  { q: "What background colour should a passport photo have?", a: "White for the US and India, and light grey or cream for the UK, where plain white is the top reason photos get rejected. EasyPhoto applies the right colour by country." },
  { q: "What is the correct head size in a passport photo?", a: "It depends on the country. The US wants 25–35mm chin-to-crown, for instance, and India wants larger. We size your head to the exact band so it isn't rejected for being too big or small." },
  { q: "Can I smile in a passport photo?", a: "No. Keep a neutral expression with your mouth closed, which is what most countries require for biometric matching." },
  { q: "Can I wear glasses in a passport photo?", a: "Generally no. The US has banned glasses since 2016 and most countries discourage them, so it's safest to take them off." },
  { q: "How many passport photos do I need?", a: "Usually two for a printed application. The 4×6 inch print sheet gives you several copies on one sheet." },
  { q: "How do I make a baby or infant passport photo?", a: "Lay the baby on a plain white sheet, take a top-down photo with the eyes open if you can, and upload it. The same sizing rules apply." },
  { q: "Will an EasyPhoto passport photo be accepted?", a: "It's built to each country's published specification and runs a compliance check, and we link the official source on every country page. Always review the requirements before submitting." },
  { q: "Can I wear a head covering in a passport photo?", a: "Only for religious or medical reasons, and your full face from chin to forehead must be clearly visible." },
  { q: "Is this passport photo maker really free with no watermark?", a: "Yes. You get a full-quality download with no sign-up and no watermark." },
  { q: "Does my passport photo get uploaded or stored?", a: "No. Everything is processed in your browser and discarded when you close the tab." },
  { q: "Can I make a US DV Lottery or green card photo?", a: "The DV Lottery uses a stricter square spec (600×600, JPEG, under 240KB). Use the US page, then the resize tool to meet the file-size limit." },
  { q: "How do I print my passport photo?", a: "Download the 4×6 inch PDF sheet and print it at any photo kiosk or chemist, then cut out the copies." },
  { q: "What's the difference between a passport photo and a visa photo?", a: "The size is often similar, but background rules and exact specs differ, so use the visa photo maker for visa applications." },
];

export const VISA_FAQ: FaqItem[] = [
  { q: "What size is a visa photo?", a: "Most visa photos are 35×45mm, and US visas use 2×2 inches. Pick your destination and we apply the right size." },
  { q: "What size is a US visa photo for DS-160?", a: "2×2 inches (51×51mm), square, on a white background. It's the same spec as the US passport photo." },
  { q: "What size is a Schengen visa photo?", a: "35×45mm, with the head taking up roughly 70–80% of the frame." },
  { q: "What background should a Schengen visa photo have?", a: "Light grey is the safe universal choice. Some states accept white (France, for example), but Switzerland requires grey and won't accept white, so we default to light grey." },
  { q: "What are the UK visa photo requirements?", a: "35×45mm, a plain light-grey or cream background, a neutral expression, and no glasses." },
  { q: "What size is a Canada visa photo?", a: "35×45mm for visas, study and work permits, and PR. That's different from the 50×70mm Canadian passport print." },
  { q: "What size is an Australia visa photo?", a: "35–40mm wide by 45–50mm high on a plain light background. We use 35×45mm." },
  { q: "Can I use the same photo for my passport and visa?", a: "Often yes if the size and background match, but check both specs because some visas differ." },
  { q: "Can I smile or wear glasses in a visa photo?", a: "Keep a neutral expression and take your glasses off, since most consulates require it." },
  { q: "How do I upload a visa photo to VFS Global online?", a: "Use the digital file we generate. It's sized correctly and compressed under typical portal limits. Confirm the exact limit on your VFS page." },
  { q: "Do I need a printed or digital visa photo?", a: "It depends on the consulate, so you get both a print-ready and an upload-ready file." },
  { q: "Is the visa photo maker free?", a: "Yes, completely free with no watermark." },
  { q: "Is my photo uploaded when I make a visa photo?", a: "No, it's processed entirely on your device." },
  { q: "How recent does a visa photo need to be?", a: "Most countries require it to be taken within the last six months and to match how you currently look." },
  { q: "What file format and size do online visa portals want?", a: "Usually a JPG under a set KB limit. Use the resize tool if your portal caps the file size." },
  { q: "Why was my visa photo rejected?", a: "Common reasons are the wrong size, wrong background, glasses, smiling, shadows, or an old photo. The compliance check catches the sizing and background issues." },
];

export const PHOTO_RESIZE_FAQ: FaqItem[] = [
  { q: "How do I resize a photo online for free?", a: "Upload it, set a target file size in KB or exact pixel dimensions, and download. No watermark and nothing gets uploaded." },
  { q: "How do I reduce a photo to 20KB?", a: "Set the target to 20KB and the tool compresses your image under 20KB while keeping it as clear as possible." },
  { q: "How do I resize a photo to 50KB?", a: "Enter 50KB as the target and download the compressed file. It's handy for passport, visa and exam uploads." },
  { q: "How do I compress an image to 100KB or 200KB?", a: "Type any target in KB. There are quick presets for 10, 20, 50, 100 and 200KB." },
  { q: "How do I resize a photo without losing quality?", a: "We lower JPEG quality only as much as needed and shrink dimensions last, so the photo stays as sharp as the target allows." },
  { q: "How do I resize a photo for SSC, UPSC or government forms?", a: "These usually cap photos at 20–50KB. Compress to that target and the upload will be accepted." },
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
  { q: "What size should a signature be for a form?", a: "Often 10–20KB and a few hundred pixels wide. Check the limit stated on your form." },
  { q: "How do I make my signature 10KB or 20KB?", a: "Use the signature-to-20KB tool, which compresses to the cap while keeping a transparent background." },
  { q: "How do I resize a signature for UPSC or SSC?", a: "These typically want a 10–20KB signature on a clean background, which is exactly what the signature tools produce." },
  { q: "What are the signature dimensions in pixels for forms?", a: "Commonly around 140×60 to 300×80 pixels. Use the resize-by-dimensions option for an exact size." },
  { q: "How do I get a transparent signature?", a: "The tool lifts the paper background and exports a transparent PNG so it sits cleanly on documents." },
  { q: "How do I scan my signature for a form?", a: "Sign on plain white paper, photograph or scan it in good light, then upload, and we clean it up." },
  { q: "Can I resize my signature on my phone?", a: "Yes, photograph your signature and process it directly in the mobile browser." },
  { q: "How do I remove the background from a signature?", a: "Use the signature background-removal tool or the transparent option to drop the paper." },
  { q: "Why won't my signature upload?", a: "Usually it's too large or has a white box around it. Compress it and keep a transparent background." },
  { q: "What format should a signature be, PNG or JPG?", a: "PNG if you need transparency, which most forms expect. JPG works if a white background is acceptable." },
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
  { q: "What is the Exam Application Kit?", a: "It's a guided flow that gets your photo and signature into the exact size, dimensions and file size an exam form needs. Pick your exam, add your photo and signature, and download an application-ready set in one go." },
  { q: "Which exams does it support?", a: "Indian exam and recruitment portals including SSC, UPSC, IBPS, SBI, Railway (RRB), NEET/JEE (NTA), RBI, CTET and state PSCs. Each preset uses that exam's published photo and signature requirements." },
  { q: "What photo and signature size do exam forms need?", a: "It varies by exam, but photos are commonly 20–50 KB and signatures 10–20 KB, each within set pixel dimensions. The kit applies the right values for the exam you pick, so you don't have to look them up." },
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
  { q: "How do I crop a signature to the ink?", a: "Upload your signature scan and the tool auto-trims the blank space around it, leaving a tight crop of just the signature." },
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
  { q: "Why do some exam photos need a name and date?", a: "Several exam and recruitment forms (and some banks) require the photo to show your name and the date it was taken, written below the image." },
  { q: "Can I change the date or text format?", a: "Yes, you can set the name and the date text to match exactly what your form asks for." },
  { q: "Is it free and private?", a: "Yes — free, no watermark, and your photo is processed on your device only." },
];

export const COMPLIANCE_CHECKER_FAQ: FaqItem[] = [
  { q: "What does the photo & signature checker do?", a: "Pick your exam, choose photo or signature, and upload your file. It checks the file against that exam's official spec — file size (KB), pixel dimensions, aspect, format and a white-background guide — and tells you whether it will likely be accepted, before you upload to the portal." },
  { q: "Is the check accurate?", a: "The size, dimensions and format checks are exact — they compare your file to the official spec. The background check is a guide, not a guarantee. Always confirm against the official portal before submitting." },
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
    ? `Online uploads typically accept ${spec.digital.fileSizeKb.min}–${spec.digital.fileSizeKb.max} KB, so compress your photo to fit if needed.`
    : "The online file-size limit varies by portal, so check the limit on your form, then compress to fit.";

  const EXTRA: Record<string, FaqItem> = {
    us: {
      q: "Can I use this for a US visa or DV Lottery photo?",
      a: "The 2×2 inch spec also covers US visa (DS-160) photos. The DV Lottery is stricter (600×600, JPEG, under 240KB), so use the resize tool to meet it.",
    },
    india: {
      q: "Is a home-printed Indian passport photo accepted?",
      a: "For the pasted paper form, India requires a real photo-lab print, and a home or computer printout may be rejected. Online upload sizes vary, so confirm the current limit at passportindia.gov.in.",
    },
    canada: {
      q: "Can I use this for a Canadian passport photo?",
      a: "Use it for Canada visa, PR/Express Entry and online renewal (35×45mm). The printed Canadian passport photo needs a commercial photographer's certification, which a DIY tool can't provide.",
    },
    uk: {
      q: "Why shouldn't a UK passport photo have a white background?",
      a: "Plain white is the top reason UK photos get rejected. HMPO wants a light grey or cream background, which this tool applies for you.",
    },
    australia: {
      q: "Does the Australian passport photo need a guarantor?",
      a: "Yes, your guarantor must sign the back of the printed photo. This tool makes the compliant image, and the signature is added after printing.",
    },
    schengen: {
      q: "Is the background the same for every Schengen country?",
      a: "Light grey is the safest universal choice. Some states accept white (e.g. France) but Switzerland requires grey, so we default to light grey.",
    },
  };

  const items: FaqItem[] = [
    { q: `What size is a ${doc} photo for ${spec.label}?`, a: `A ${doc} photo for ${spec.label} is ${size}. EasyPhoto sets this size automatically.` },
    { q: `What background colour does a ${doc} photo for ${spec.label} need?`, a: `${spec.background.description}. The tool applies the correct colour for you.` },
    { q: `What is the head size in a ${doc} photo for ${spec.label}?`, a: `Your head should measure ${spec.headHeightMm.min}–${spec.headHeightMm.max}mm from chin to crown. We size it to that band and flag it if it's off.` },
    { q: `Can I wear glasses or smile in a ${doc} photo for ${spec.label}?`, a: `${glasses} Expression: ${spec.smileAllowed}.` },
    { q: `What file size does the ${spec.label} online ${doc} upload need?`, a: fileSize },
    { q: `Is the ${spec.label} ${doc} photo maker free and private?`, a: "Yes. It's free, with no watermark, and processed entirely in your browser. Your photo is never uploaded." },
  ];
  // Country caveats are passport-flavoured; visa pages get their specifics from
  // the per-page maker content instead.
  if (kind === "passport" && EXTRA[spec.id]) items.push(EXTRA[spec.id]);
  return items;
}
