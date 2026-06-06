/**
 * Page FAQ content — search-intent + long-tail, plain text (no markup) so it
 * renders cleanly and produces valid FAQPage JSON-LD via faqSchema().
 * One set per page; never mix sets across URLs (schema must match the page).
 */
import type { FaqItem } from "@/components/site/Faq";

export const PASSPORT_FAQ: FaqItem[] = [
  { q: "What size is a passport photo?", a: "Most countries use 35×45mm; the US and a few others use 2×2 inches (51×51mm). EasyPhoto sets the correct size automatically once you pick your country." },
  { q: "How do I make a passport photo at home for free?", a: "Upload a clear, front-facing photo, choose your country, and download the compliant result. No app, no payment, and no watermark." },
  { q: "Can I take a passport photo on my phone?", a: "Yes. Any recent phone photo in even lighting works — the tool crops and sizes it for you." },
  { q: "What background colour should a passport photo have?", a: "White for the US and India, and light grey or cream for the UK, where plain white is the top rejection reason. EasyPhoto applies the right colour by country." },
  { q: "What is the correct head size in a passport photo?", a: "It varies — for example 25–35mm chin-to-crown for the US, and larger for India. We size your head to the exact band so it isn't rejected for being too big or small." },
  { q: "Can I smile in a passport photo?", a: "No — keep a neutral expression with your mouth closed, which most countries require for biometric matching." },
  { q: "Can I wear glasses in a passport photo?", a: "Generally no. The US has banned glasses since 2016 and most countries discourage them, so remove glasses to be safe." },
  { q: "How many passport photos do I need?", a: "Usually two for a printed application. The 4×6 inch print sheet gives you several copies on one sheet." },
  { q: "How do I make a baby or infant passport photo?", a: "Lay the baby on a plain white sheet, take a top-down photo with the eyes open if possible, and upload it — the same sizing rules apply." },
  { q: "Will an EasyPhoto passport photo be accepted?", a: "It's built to each country's published specification and runs a compliance check, and we link the official source on every country page. Always review the requirements before submitting." },
  { q: "Can I wear a head covering in a passport photo?", a: "Only for religious or medical reasons, and your full face from chin to forehead must be clearly visible." },
  { q: "Is this passport photo maker really free with no watermark?", a: "Yes — a full-quality download with no sign-up and no watermark." },
  { q: "Does my passport photo get uploaded or stored?", a: "No. Everything is processed in your browser and discarded when you close the tab." },
  { q: "Can I make a US DV Lottery or green card photo?", a: "The DV Lottery uses a stricter square spec (600×600, JPEG, under 240KB). Use the US page, then the resize tool to meet the file-size limit." },
  { q: "How do I print my passport photo?", a: "Download the 4×6 inch PDF sheet and print it at any photo kiosk or chemist, then cut out the copies." },
  { q: "What's the difference between a passport photo and a visa photo?", a: "The size is often similar, but background rules and exact specs differ — use the visa photo maker for visa applications." },
];

export const VISA_FAQ: FaqItem[] = [
  { q: "What size is a visa photo?", a: "Most visa photos are 35×45mm; US visas use 2×2 inches. Pick your destination and we apply the right size." },
  { q: "What size is a US visa photo for DS-160?", a: "2×2 inches (51×51mm), square, on a white background — the same spec as the US passport photo." },
  { q: "What size is a Schengen visa photo?", a: "35×45mm, with the head taking up roughly 70–80% of the frame." },
  { q: "What background should a Schengen visa photo have?", a: "Light grey is safest — pure white is a known rejection risk at French and Swiss consulates, so we default to light grey." },
  { q: "What are the UK visa photo requirements?", a: "35×45mm, a plain light-grey or cream background, a neutral expression, and no glasses." },
  { q: "What size is a Canada visa photo?", a: "35×45mm for visas, study and work permits, and PR — different from the 50×70mm Canadian passport print." },
  { q: "What size is an Australia visa photo?", a: "35–40mm wide by 45–50mm high on a plain light background; we use 35×45mm." },
  { q: "Can I use the same photo for my passport and visa?", a: "Often yes if the size and background match, but check both specs because some visas differ." },
  { q: "Can I smile or wear glasses in a visa photo?", a: "Keep a neutral expression and remove glasses — most consulates require it." },
  { q: "How do I upload a visa photo to VFS Global online?", a: "Use the digital file we generate; it's sized correctly and compressed under typical portal limits. Confirm the exact limit on your VFS page." },
  { q: "Do I need a printed or digital visa photo?", a: "It depends on the consulate, so you get both a print-ready and an upload-ready file." },
  { q: "Is the visa photo maker free?", a: "Yes — completely free with no watermark." },
  { q: "Is my photo uploaded when I make a visa photo?", a: "No, it's processed entirely on your device." },
  { q: "How recent does a visa photo need to be?", a: "Most countries require it to be taken within the last six months and to match how you currently look." },
  { q: "What file format and size do online visa portals want?", a: "Usually a JPG under a set KB limit. Use the resize tool if your portal caps the file size." },
  { q: "Why was my visa photo rejected?", a: "Common reasons are the wrong size, wrong background, glasses, smiling, shadows, or an old photo. The compliance check catches the sizing and background issues." },
];

export const PHOTO_RESIZE_FAQ: FaqItem[] = [
  { q: "How do I resize a photo online for free?", a: "Upload it, set a target file size in KB or exact pixel dimensions, and download — with no watermark and no upload." },
  { q: "How do I reduce a photo to 20KB?", a: "Set the target to 20KB; the tool compresses your image under 20KB while keeping it as clear as possible." },
  { q: "How do I resize a photo to 50KB?", a: "Enter 50KB as the target and download the compressed file — handy for passport, visa and exam uploads." },
  { q: "How do I compress an image to 100KB or 200KB?", a: "Type any target in KB. There are quick presets for 10, 20, 50, 100 and 200KB." },
  { q: "How do I resize a photo without losing quality?", a: "We lower JPEG quality only as much as needed and shrink dimensions last, so the photo stays as sharp as the target allows." },
  { q: "How do I resize a photo for SSC, UPSC or government forms?", a: "These usually cap photos at 20–50KB; compress to that target and the upload will be accepted." },
  { q: "Can I resize a photo on my phone?", a: "Yes, it works the same in a mobile browser." },
  { q: "What's the difference between resizing by KB and by pixels?", a: "KB controls the file size for upload limits; pixels control the width and height. There's a separate tool for each." },
  { q: "How do I resize an image to exact pixel dimensions?", a: "Use the resize-by-dimensions tool, with an optional aspect-ratio lock." },
  { q: "Does compressing an image reduce its quality?", a: "A little, but we always keep the highest quality that still fits your target size." },
  { q: "What image formats can I resize?", a: "JPG, PNG, WebP and iPhone HEIC files." },
  { q: "Is the photo resizer free and watermark-free?", a: "Yes — free, no sign-up, and no watermark." },
  { q: "Is my photo uploaded when I resize it?", a: "No, compression happens entirely in your browser." },
  { q: "How do I resize a passport photo for online upload?", a: "Make the passport photo first, then compress it here to the portal's KB limit." },
  { q: "Why does my form reject my photo for size?", a: "It's over the file-size cap; compress it under the stated limit and re-upload." },
  { q: "How small can I make an image?", a: "Down to around 10KB while keeping a face recognisable; below that, detail starts to suffer." },
];

export const SIGNATURE_FAQ: FaqItem[] = [
  { q: "How do I resize my signature for an online form?", a: "Upload a scan or photo of your signature, set the size, and download — with the paper background removed and transparency kept." },
  { q: "What size should a signature be for a form?", a: "Often 10–20KB and a few hundred pixels wide. Check the limit stated on your form." },
  { q: "How do I make my signature 10KB or 20KB?", a: "Use the signature-to-20KB tool, which compresses to the cap while keeping a transparent background." },
  { q: "How do I resize a signature for UPSC or SSC?", a: "These typically want a 10–20KB signature on a clean background — exactly what the signature tools produce." },
  { q: "What are the signature dimensions in pixels for forms?", a: "Commonly around 140×60 to 300×80 pixels; use the resize-by-dimensions option for an exact size." },
  { q: "How do I get a transparent signature?", a: "The tool lifts the paper background and exports a transparent PNG so it sits cleanly on documents." },
  { q: "How do I scan my signature for a form?", a: "Sign on plain white paper, photograph or scan it in good light, then upload — we clean it up." },
  { q: "Can I resize my signature on my phone?", a: "Yes, photograph your signature and process it directly in the mobile browser." },
  { q: "How do I remove the background from a signature?", a: "Use the signature background-removal tool or the transparent option to drop the paper." },
  { q: "Why won't my signature upload?", a: "Usually it's too large or has a white box around it; compress it and keep a transparent background." },
  { q: "What format should a signature be — PNG or JPG?", a: "PNG if you need transparency, which most forms expect; JPG if a white background is acceptable." },
  { q: "How do I crop my signature?", a: "The signature crop tool auto-trims the empty space around the ink." },
  { q: "Is the signature resizer free?", a: "Yes, free with no watermark." },
  { q: "Is my signature uploaded anywhere?", a: "No — it's processed on your device only." },
  { q: "How do I make my signature clearer or darker?", a: "Increase the background-removal strength to lift the paper and sharpen the ink." },
  { q: "Can I resize a signature without losing quality?", a: "Yes — for ink on paper, trimming and light compression keep it crisp." },
];

export const BACKGROUND_REMOVER_FAQ: FaqItem[] = [
  { q: "How do I remove the background from an image for free?", a: "Drop in a photo and download a transparent PNG — free, no sign-up and no watermark." },
  { q: "How do I make a transparent PNG?", a: "Remove the background and save; the result is a PNG with a transparent background." },
  { q: "Is this background remover really free with no watermark?", a: "Yes — a full-resolution download with no paywall and no watermark." },
  { q: "Does the background remover upload my photo?", a: "No. The AI model runs in your browser, so your image never leaves your device." },
  { q: "How do I add a white background to a photo?", a: "Remove the original background, then use the white-background tool to drop in white or any colour." },
  { q: "Can I remove the background from a product photo?", a: "Yes — it's well suited to product shots for listings and catalogues." },
  { q: "Does it work on hair and fine edges?", a: "Yes, the model handles hair and detailed edges reasonably well." },
  { q: "How do I remove the background from a signature?", a: "For ink on paper, the dedicated signature tools give cleaner results than the photo remover." },
  { q: "Can I remove a background on my phone?", a: "Yes, it runs in mobile browsers; the first run downloads the AI model." },
  { q: "What file formats are supported?", a: "JPG, PNG, WebP and HEIC inputs." },
  { q: "What format is the output?", a: "A transparent PNG at full resolution." },
  { q: "How do I remove a background for a passport photo?", a: "Use the country passport page — it removes the background and applies the correct passport colour automatically." },
  { q: "Why does my cut-out have rough edges?", a: "Busy or low-contrast backgrounds are harder; a plainer background gives cleaner edges." },
  { q: "Can I change the background colour after removing it?", a: "Yes — pair it with the white-background tool to set any solid colour." },
  { q: "Is there a limit on image size or number of images?", a: "No hard limit, though very large images use more memory on your device." },
  { q: "How accurate is the AI background removal?", a: "It's good for people and products; results depend on the contrast between the subject and the background." },
];
