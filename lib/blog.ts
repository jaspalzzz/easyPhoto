/**
 * Blog registry. Drives the /blog index, per-post metadata, sitemap and
 * Article schema. Each post is a page at app/blog/<slug>/page.tsx that renders
 * <BlogPostLayout slug="…">…body…</BlogPostLayout>.
 */
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  /** Display date, e.g. "June 6, 2026". */
  date: string;
  /** ISO date for schema/datetime, e.g. "2026-06-06". */
  dateISO: string;
  /**
   * ISO date of last significant content update — set this when a post is
   * refreshed so dateModified in the BlogPosting schema reflects real freshness
   * rather than the original publish date. Leave unset for new posts.
   */
  updatedISO?: string;
  excerpt: string;
  readMins: number;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "pan-vs-voter-id-vs-driving-licence-photo",
    title: "PAN vs Voter ID vs Driving Licence Photo: What's Different (2026)",
    description:
      "The KB limit swings from 30 KB (PAN/UTIITSL) to 200 KB (voter ID) — 6.7× — and only PAN needs a square crop. A side-by-side of all three photo specs, and the one file that passes all.",
    date: "July 10, 2026",
    dateISO: "2026-07-10",
    excerpt:
      "The three IDs look like they'd take the same photo — they don't. The KB cap ranges 6.7× across them and only one needs a square crop. Here's exactly what differs, and the single file that clears all three.",
    readMins: 7,
  },
  {
    slug: "indian-government-id-photo-requirements",
    title: "Indian Government ID Photo Size 2026: PAN, Voter ID, DL & Aadhaar",
    description:
      "The exact photo size, KB limit and pixel dimensions for PAN, Voter ID, Driving Licence and Aadhaar online applications — one verified 2026 reference, every portal compared.",
    date: "July 4, 2026",
    dateISO: "2026-07-04",
    excerpt:
      "A PAN, a voter ID, an Aadhaar and a driving licence — and no two portals accept the same photo. Here is every 2026 spec, the one file that passes the online portals, and why Aadhaar is the exception.",
    readMins: 8,
  },
  {
    slug: "image-to-text-online-free-ocr",
    title: "Image to Text Online Free — Extract Text from Any Photo (OCR)",
    description:
      "Upload a JPG, PNG, screenshot or scanned document and copy the text out in seconds — free OCR that runs in your browser, nothing uploaded. Supports English and Hindi.",
    date: "June 24, 2026",
    dateISO: "2026-06-24",
    excerpt:
      "A scanned certificate, a screenshot of a notice, a photo of a printed form — all have text locked inside a picture. Free in-browser OCR unlocks it in under 10 seconds without uploading anything.",
    readMins: 5,
  },
  {
    slug: "indian-passport-photo-requirements",
    title: "Indian Passport Photo Rules 2026: Adults vs Children Under 4",
    description:
      "Indian passport photo workflow explained: adults are photographed at PSK/POPSK, children below four need a 35×45 mm print, and overseas, OCI and e-Visa rules differ.",
    date: "June 24, 2026",
    dateISO: "2026-06-24",
    updatedISO: "2026-07-13",
    excerpt:
      "Ordinary adults do not upload or carry a passport photo to a PSK/POPSK: it is captured at the centre. The 35×45 mm white-background print is the below-four exception.",
    readMins: 6,
  },
  {
    slug: "indian-passport-photo-size-rules",
    title: "Indian Passport Photo Size & Rules (Passport Seva 2026)",
    description:
      "Indian passport photo rules by workflow: PSK/POPSK capture for adults, a 45×35 mm white-background print for children below four, and separate overseas guidance.",
    date: "June 18, 2026",
    dateISO: "2026-06-18",
    updatedISO: "2026-07-13",
    excerpt:
      "The domestic adult workflow uses a photo captured at the PSK/POPSK. Children below four carry a 45×35 mm print; overseas, OCI and e-Visa photo workflows are separate.",
    readMins: 6,
  },
  {
    slug: "cutout-pro-alternative-india",
    title: "Free Cutout Pro Alternative India: No Subscription, No Watermark, No Upload",
    description:
      "Cutout.pro's passport photo feature costs 2 credits — free credits run out fast, then it's ₹246.50/month or more. Three free, on-device alternatives.",
    date: "June 18, 2026",
    dateISO: "2026-06-18",
    excerpt:
      "Cutout.pro starts free but caps you at 5 credits — a passport photo costs 2. Once they're gone, it's a monthly subscription. Here are three tools that are free permanently, don't upload to a server, and work for India.",
    readMins: 5,
  },
  {
    slug: "best-free-exam-photo-resizer-india",
    title: "5 Free Exam Photo & Signature Resizers Compared (2026)",
    description:
      "Resize SSC, IBPS, UPSC or RRB exam photos to the KB and pixel specs each portal lists, for free. Five tools compared: ExamMint, myexamphoto.in, SarkariResizer, govtphotoresizer.com, and easyPhoto.",
    date: "June 18, 2026",
    dateISO: "2026-06-18",
    updatedISO: "2026-06-18",
    excerpt:
      "Every exam portal has its own KB and pixel spec — a general resize tool won't hit it. Five free tools that know the exact SSC, IBPS, UPSC, and RRB requirements, compared honestly on coverage, privacy, and breadth.",
    readMins: 7,
  },
  {
    slug: "best-free-passport-photo-maker-india-2026",
    title: "Best Free Passport Photo Maker Online India (2026)",
    description:
      "Seven photo tools compared for India's below-four 35×45 mm print, overseas preparation and exam support, with the adult PSK/POPSK capture workflow explained.",
    date: "June 18, 2026",
    dateISO: "2026-06-18",
    updatedISO: "2026-07-13",
    excerpt:
      "Ordinary adults are photographed at the PSK/POPSK. For the below-four print and separate overseas workflows, here are five tools compared on cost, privacy and format support.",
    readMins: 6,
  },
  {
    slug: "visafoto-alternative-india-free",
    title: "Free Visafoto Alternative India: 4 Tools That Won't Charge ₹600",
    description:
      "Four browser-based alternatives for India's below-four 35×45 mm passport print and exam photos, with the ordinary adult PSK/POPSK capture workflow explained.",
    date: "June 18, 2026",
    dateISO: "2026-06-18",
    updatedISO: "2026-07-13",
    excerpt:
      "Ordinary adult passport applicants do not upload a prepared photo. For the below-four print, overseas preparation or exam photos, here are four tool alternatives.",
    readMins: 5,
  },
  {
    slug: "upsc-cse-ias-photo-signature-guide-2026",
    title: "UPSC CSE / IAS Photo & Signature Requirements 2026",
    description:
      "UPSC CSE: 20–300 KB JPG, min 350×350 px square, name and date mandatory, three signatures on one sheet. Live photo matching and 10-day recency rule explained.",
    date: "June 18, 2026",
    dateISO: "2026-06-18",
    excerpt:
      "UPSC CSE 2026 added live webcam matching and a 10-day photo recency rule. Here are the confirmed specs, why three signatures are required, and the complete upload workflow.",
    readMins: 7,
  },
  {
    slug: "nda-cds-photo-signature-guide-2026",
    title: "NDA & CDS 2026 Photo: Square Crop, Name Required — Exact Spec",
    description:
      "NDA and CDS need a square photo (350×350 px min), your name and date at the bottom, and a 20–300 KB JPG. The square crop trips most applicants — full prep here.",
    date: "June 18, 2026",
    dateISO: "2026-06-18",
    excerpt:
      "NDA and CDS require a square photo — 350×350 px minimum — plus your name and date printed on the image. Here are the exact specs, the square vs portrait trap, and the complete upload workflow.",
    readMins: 7,
  },
  {
    slug: "ssc-cgl-chsl-photo-signature-guide-2026",
    title: "SSC CGL & CHSL 2026 Photo: Live Capture Only — Spec & Resizer",
    description:
      "SSC now blocks gallery uploads — your photo must be taken live on the portal. 20–50 KB JPG, 10–20 KB signature, 6 rejection reasons, and a free one-click resizer.",
    date: "June 18, 2026",
    dateISO: "2026-06-18",
    excerpt:
      "SSC now requires live photo capture — no gallery uploads. Here are the exact specs for CGL and CHSL, the six rejection reasons, and how to prepare your signature in one step.",
    readMins: 7,
  },
  {
    slug: "why-exam-photo-signature-rejected",
    title: "Exam Photo Rejected? 7 Reasons SSC, IBPS & UPSC Say No (2026)",
    description:
      "Wrong KB, wrong pixels, grey signature background — 7 reasons exam portals reject your upload and the exact one-click fix for each. Check before you submit.",
    date: "June 13, 2026",
    dateISO: "2026-06-13",
    excerpt:
      "“Photo not as per specification.” “Invalid signature.” Exam portals reject for a handful of predictable reasons — here's every one, and the quick fix for each.",
    readMins: 6,
  },
  {
    slug: "add-name-date-on-exam-photo",
    title: "How to Add Name & Date to an Exam Photo (2026)",
    description:
      "Use a digital name-and-date strip only when the current notice asks for one. Compare APPSC and Kerala PSC with UPSC, SSC, IBPS and slate-photo workflows.",
    date: "June 13, 2026",
    dateISO: "2026-06-13",
    updatedISO: "2026-07-16",
    excerpt:
      "APPSC and Kerala PSC use a digital name-and-date treatment; UPSC, SSC and IBPS do not, while Navy and Airforce Agniveer notices use a physical slate.",
    readMins: 5,
  },
  {
    slug: "ibps-po-2026-photo-signature-checklist",
    title: "IBPS PO 2026: Photo & Signature Checklist Before You Apply",
    description:
      "IBPS PO 2026 prelims are 22–23 August. The exact photo and signature spec, what gets rejected, and a free resizer to prepare now — before registration opens.",
    date: "June 13, 2026",
    dateISO: "2026-06-13",
    excerpt:
      "IBPS PO 2026 prelims are on 22–23 August. Here's the exact photo and signature checklist to prepare now, so applying takes minutes when the form opens.",
    readMins: 5,
  },
  {
    slug: "schengen-europe-visa-photo-size",
    title: "Schengen Visa Photo Size: Germany, France, Italy & More",
    description:
      "Schengen visa photos are 35×45 mm and ICAO-biometric. Background rules differ by country — Germany grey, Italy white. Get the exact spec and make one free.",
    date: "June 10, 2026",
    dateISO: "2026-06-10",
    excerpt:
      "Every Schengen visa photo is 35×45 mm and ICAO-biometric — but the background rule differs by country. Here's the exact spec for Germany, France, Italy and more, and how to make one free.",
    readMins: 5,
  },
  {
    slug: "how-to-mask-aadhaar-before-sharing",
    title: "How to Mask Your Aadhaar Number Before Sharing It (Free)",
    description:
      "UIDAI recommends sharing a masked Aadhaar hiding the first 8 digits. Here's when it's accepted and how to mask yours free, entirely on your device.",
    date: "June 10, 2026",
    dateISO: "2026-06-10",
    excerpt:
      "Sharing your full Aadhaar number is risky. UIDAI says to share a masked copy showing only the last 4 digits. Here's how to do it safely and free, entirely on your device.",
    readMins: 4,
  },
  {
    slug: "how-to-sign-exam-application-forms-india",
    title: "How to Sign an Exam Application Form in India (SSC, UPSC, IBPS Rules)",
    description:
      "Sign on white paper in black or blue ink, scan to JPG, keep it under 10–20 KB. Portal rules for SSC, UPSC, IBPS, RRB and Army Agniveer — and why some need a transparent background.",
    date: "June 21, 2026",
    dateISO: "2026-06-21",
    excerpt:
      "Every major exam portal has its own KB limit and pixel dimension for your signature. Here's the exact spec for SSC, UPSC, IBPS, RRB and Army Agniveer — and why a transparent background matters for some forms.",
    readMins: 8,
  },
  {
    slug: "how-to-sign-on-image-online",
    title: "How to Sign on Image Online: Add a Signature to Any Photo",
    description:
      "Add a signature to a photo or image online: draw, upload a transparent signature PNG, place it, resize it and download the signed image in your browser.",
    date: "July 8, 2026",
    dateISO: "2026-07-08",
    excerpt:
      "Need to sign on an image, add a sign in photo, or place a signature on a JPG? Here is the clean workflow: make a transparent signature, place it on the image, and export privately.",
    readMins: 5,
  },
  {
    slug: "how-to-prepare-documents-for-exam-applications-india",
    title: "How to Prepare Documents for Online Exam Applications in India",
    description:
      "Photo 20–50 KB, signature 10–20 KB, certificates under 100 KB, Aadhaar masked — complete prep workflow before you open an SSC, UPSC, IBPS or Railway portal.",
    date: "June 21, 2026",
    dateISO: "2026-06-21",
    excerpt:
      "Most exam application rejections come from the same four documents: photo, signature, certificates and Aadhaar. Here's the complete preparation workflow for every major Indian exam portal.",
    readMins: 10,
  },
  {
    slug: "how-to-compress-pdf",
    title: "How to Compress a PDF to 50, 100 or 200 KB (Free)",
    description:
      "Exam portals cap documents at 50–200 KB. How to compress a PDF to any KB target — marksheets, certificates, Aadhaar — free, without uploads.",
    date: "June 10, 2026",
    dateISO: "2026-06-10",
    excerpt:
      "Many portals reject PDFs that are too large. Here's the fastest way to hit exactly 50, 100 or 200 KB, what happens to quality, and the one thing to avoid.",
    readMins: 5,
  },
  {
    slug: "how-to-merge-pdf-free",
    title: "How to Merge PDF Files Free (No Sign-Up, No Upload)",
    description:
      "Merge PDF files into one, free. No sign-up, no upload, no watermark — everything runs in your browser. Covers marksheets, certificates and forms.",
    date: "June 10, 2026",
    dateISO: "2026-06-10",
    excerpt:
      "Need one PDF from many? Drop your files, reorder if needed, and download the merged result in seconds. Nothing leaves your device.",
    readMins: 4,
  },
  {
    slug: "exam-photo-signature-size-guide",
    title: "Exam Photo & Signature Size 2026: SSC, UPSC, IBPS, RRB — Full Guide",
    description:
      "Rejected for wrong KB or wrong pixels? Exact photo and signature limits for every major Indian exam — SSC, UPSC, IBPS, SBI, RRB, NTA. Free resizer included.",
    date: "June 8, 2026",
    dateISO: "2026-06-08",
    updatedISO: "2026-06-21",
    excerpt:
      "Wrong KB, wrong pixels, grey signature background — these three mistakes account for nearly every upload rejection. Here's the exact spec for every major Indian exam and how to fix each failure.",
    readMins: 10,
  },
  {
    slug: "linkedin-profile-photo-size-and-tips",
    title: "LinkedIn Profile Photo: Size, Tips & How to Make One Free",
    description:
      "LinkedIn photos must be square, at least 400×400 px, under 8 MB. Here's why it displays as a circle, what looks professional, and how to crop one free.",
    date: "June 8, 2026",
    dateISO: "2026-06-08",
    excerpt:
      "Square, at least 400×400, face centred for the circle crop. Here's the exact LinkedIn photo size and the tips that make a headshot look professional.",
    readMins: 5,
  },
  {
    slug: "resume-photo-size-and-rules",
    title: "Resume Photo: Size, Background & Rules (India Guide)",
    description:
      "In India a resume photo is passport-size (35×45 mm). The US, UK and Canada omit it to avoid bias claims — rules by region, exact size, and a free maker.",
    date: "June 7, 2026",
    dateISO: "2026-06-07",
    updatedISO: "2026-06-21",
    excerpt:
      "In India a resume photo is usually passport-size on a plain background. Here's when to include one, the exact size, and how to make it look professional.",
    readMins: 5,
  },
  {
    slug: "how-to-take-a-passport-photo-at-home",
    title: "How to Take a Passport Photo at Home (and Get It Accepted)",
    description:
      "How to take a compliant passport photo at home: plain wall, good light, correct background colour, and the six common mistakes that get photos rejected.",
    date: "June 6, 2026",
    dateISO: "2026-06-06",
    excerpt:
      "You don't need a studio. With a phone, a window and a plain wall, you can take a passport photo that passes. Here's exactly how.",
    readMins: 5,
  },
  {
    slug: "why-passport-photos-get-rejected",
    title: "Why Passport Photos Get Rejected (and How to Avoid It)",
    description:
      "The real reasons passport photos get rejected: wrong size, wrong background, glasses, expression, shadows — and exactly how to fix each one before submitting.",
    date: "June 6, 2026",
    dateISO: "2026-06-06",
    excerpt:
      "Most rejections come down to a handful of fixable mistakes. Here's the list, and how to avoid every one of them.",
    readMins: 6,
  },
  {
    slug: "passport-photo-size-by-country",
    title: "Passport Photo Size by Country: US, India, UK, Canada & More",
    description:
      "Passport photo sizes vary by country: 35×45 mm for most, 2×2 in for the US, 50×70 mm for Canada. Head height matters too. Get the exact spec per country.",
    date: "June 5, 2026",
    dateISO: "2026-06-05",
    excerpt:
      "2×2 inch, 35×45mm, 50×70mm: passport photo size isn't universal. Here's every major country's spec and how to hit it exactly.",
    readMins: 6,
  },
  {
    slug: "how-to-reduce-passport-photo-size-for-online-forms",
    title: "How to Reduce Passport Photo File Size (10–200 KB)",
    description:
      "Passport, visa and exam portals cap file size, often at 10–100 KB. Here's how to compress your photo to an exact KB target without making it blurry.",
    date: "June 4, 2026",
    dateISO: "2026-06-04",
    excerpt:
      "Portals reject photos that are too large. Here's how to hit an exact KB limit, whether that's 20, 50 or 100 KB, while keeping your photo sharp.",
    readMins: 5,
  },
  {
    slug: "baby-and-infant-passport-photo-guide",
    title: "How to Take a Baby or Infant Passport Photo at Home",
    description:
      "Passport photos for babies must still comply. How to photograph an infant at home — white background, eyes open, no hands or toys — and get it accepted.",
    date: "June 3, 2026",
    dateISO: "2026-06-03",
    excerpt:
      "No studio, no posing, no tears. How to take a compliant baby passport photo on a plain sheet with your phone.",
    readMins: 5,
  },
  {
    slug: "passport-photo-background-color",
    title: "Passport Photo Background Color: White, Grey or Cream?",
    description:
      "White isn't universal. The UK requires grey or cream, Schengen prefers grey, the US wants white. The correct background per country and how to set it.",
    date: "June 2, 2026",
    dateISO: "2026-06-02",
    excerpt:
      "Using the wrong background shade is a top reason photos bounce. Here's the right color for each country, and how to apply it.",
    readMins: 5,
  },
  {
    slug: "pan-card-photo-size",
    title: "PAN Card Photo Size: Exact Dimensions, KB Limit & Signature Spec (NSDL / UTIITSL)",
    description:
      "PAN card photo is 25×35 mm, JPEG, max 50 KB for NSDL or 30 KB for UTIITSL. Signature specs differ too. Full portal-by-portal breakdown and a free resizer.",
    date: "June 23, 2026",
    dateISO: "2026-06-23",
    excerpt:
      "NSDL and UTIITSL accept the same physical 25×35 mm photo but different pixel dimensions and KB limits. Here's every spec, why they differ, and what gets photos rejected.",
    readMins: 7,
  },
  {
    slug: "how-to-compress-photo-to-50kb",
    title: "How to Compress a Photo to 50 KB — Exam & Government Portal Guide",
    description:
      "Compress any photo to an exact KB target — 50 KB, 40 KB, 20 KB — free and on-device. Includes file size limits for UPSC, SSC, IBPS, NTA, NSDL, NVSP, and Sarathi portals in one table.",
    date: "June 25, 2026",
    dateISO: "2026-06-25",
    excerpt:
      "Set the target KB and the tool adjusts JPEG quality automatically. Q80 ≈ 45 KB for a 413×531 px photo — perfect for most 50 KB portals. Start from a high-res original for best results.",
    readMins: 6,
  },
  {
    slug: "what-is-dpi-and-how-to-change-it",
    title: "What Is DPI and How to Change It — Image Resolution Explained",
    description:
      "DPI is a print metadata tag — not a measure of visual quality. Changing it doesn't alter pixels. Here's when it matters (NSDL/UTIITSL require 200 DPI), when it doesn't, and how to change it without re-encoding.",
    date: "June 25, 2026",
    dateISO: "2026-06-25",
    excerpt:
      "Most portals don't check DPI — they check file size and pixel dimensions. NSDL and UTIITSL are the main exceptions (200 DPI required). Changing the metadata tag in your browser takes seconds and doesn't re-encode the JPEG.",
    readMins: 6,
  },
  {
    slug: "how-to-print-passport-photos-at-home",
    title: "How to Print Passport Photos at Home — Sheet Layout, DPI & Paper Guide",
    description:
      "Tile 8 passport photos on a 4×6 inch sheet at 300 DPI — print at home for under ₹20. Step-by-step guide: paper, printer settings, cut lines, and why 'fit to page' ruins size.",
    date: "June 25, 2026",
    dateISO: "2026-06-25",
    excerpt:
      "Home-printed passport photos cost ₹3–₹8 per print vs ₹50–₹150 at a studio. The key is disabling 'fit to page' scaling, using photo paper, and starting with a correctly cropped image.",
    readMins: 6,
  },
  {
    slug: "how-to-remove-background-from-photo-free",
    title: "How to Remove Background from Photo Free — No Upload, No Watermark",
    description:
      "Remove any photo background in your browser — no server upload, no account, no watermark. AI runs on-device via WebGPU. White background for ID photos in one click.",
    date: "June 25, 2026",
    dateISO: "2026-06-25",
    excerpt:
      "The AI model runs entirely in your browser — nothing is uploaded to a server. Desktop uses RMBG-1.4 at 2048 px for sharp hair edges. White background for ID photos in one click.",
    readMins: 6,
  },
  {
    slug: "voter-id-photo-requirements-2026",
    title: "Voter ID Photo Size & Requirements 2026 — NVSP Upload Spec",
    description:
      "NVSP (voters.eci.gov.in) requires a JPEG photo between 10 KB and 200 KB. Compress to under 100 KB to clear all state portals. Background, pixel size, and form-by-form guide.",
    date: "June 25, 2026",
    dateISO: "2026-06-25",
    updatedISO: "2026-07-08",
    excerpt:
      "The ECI portal accepts photos between 10 KB and 200 KB, but state ERO portals can be stricter. Here's every spec for Form 6, 6A, 8 and why photos get rejected.",
    readMins: 6,
  },
  {
    slug: "driving-licence-photo-size-sarathi",
    title: "Driving Licence Photo Size for Sarathi Portal 2026 — RTO Upload Spec",
    description:
      "Sarathi (sarathi.parivahan.gov.in) requires a JPEG photo under 40 KB and signature under 20 KB. Full spec for LL, DL, renewal, and duplicate applications.",
    date: "June 25, 2026",
    dateISO: "2026-06-25",
    excerpt:
      "Sarathi's 40 KB photo limit is tighter than most government portals. Here's every requirement for Learner's Licence and Driving Licence applications, plus what causes rejections.",
    readMins: 6,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

/**
 * Topic clusters — used to make "Keep reading" relevant (same-topic posts
 * first) instead of just showing whichever posts sit first in the array. Keep a
 * post in exactly one cluster; any slug not listed falls back to array order.
 */
const CLUSTERS: Record<string, string[]> = {
  govId: [
    "indian-government-id-photo-requirements",
    "pan-card-photo-size",
    "voter-id-photo-requirements-2026",
    "driving-licence-photo-size-sarathi",
  ],
  signature: [
    "how-to-sign-on-image-online",
    "how-to-sign-exam-application-forms-india",
  ],
  exam: [
    "how-to-prepare-documents-for-exam-applications-india",
    "exam-photo-signature-size-guide",
    "best-free-exam-photo-resizer-india",
    "upsc-cse-ias-photo-signature-guide-2026",
    "nda-cds-photo-signature-guide-2026",
    "ssc-cgl-chsl-photo-signature-guide-2026",
    "ibps-po-2026-photo-signature-checklist",
    "why-exam-photo-signature-rejected",
    "add-name-date-on-exam-photo",
  ],
  passport: [
    "indian-passport-photo-requirements",
    "indian-passport-photo-size-rules",
    "how-to-compress-photo-to-50kb",
    "how-to-print-passport-photos-at-home",
    "what-is-dpi-and-how-to-change-it",
    "how-to-remove-background-from-photo-free",
    "best-free-passport-photo-maker-india-2026",
    "visafoto-alternative-india-free",
    "cutout-pro-alternative-india",
    "schengen-europe-visa-photo-size",
    "how-to-take-a-passport-photo-at-home",
    "why-passport-photos-get-rejected",
    "passport-photo-size-by-country",
    "how-to-reduce-passport-photo-size-for-online-forms",
    "baby-and-infant-passport-photo-guide",
    "passport-photo-background-color",
  ],
  pdf: [
    "how-to-compress-pdf",
    "how-to-merge-pdf-free",
    "how-to-mask-aadhaar-before-sharing",
    "image-to-text-online-free-ocr",
  ],
  professional: [
    "linkedin-profile-photo-size-and-tips",
    "resume-photo-size-and-rules",
  ],
};

/** The cluster a post belongs to, or undefined if it isn't grouped. */
export function clusterOf(slug: string): string | undefined {
  for (const [cluster, slugs] of Object.entries(CLUSTERS)) {
    if (slugs.includes(slug)) return cluster;
  }
  return undefined;
}

/**
 * Up to `n` posts to show as "Keep reading": same-cluster posts first (most
 * relevant), then fill any remaining slots in array order. Never returns the
 * current post.
 */
export function relatedPosts(slug: string, n = 2): BlogPost[] {
  const cluster = clusterOf(slug);
  const others = BLOG_POSTS.filter((p) => p.slug !== slug);
  const sameCluster = cluster
    ? others.filter((p) => clusterOf(p.slug) === cluster)
    : [];
  const sameSlugs = new Set(sameCluster.map((p) => p.slug));
  const rest = others.filter((p) => !sameSlugs.has(p.slug));
  return [...sameCluster, ...rest].slice(0, n);
}
